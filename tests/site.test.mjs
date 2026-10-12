// End-to-end checks for the built site in docs/.
// Run: npm test   (builds first, then runs these checks in headless Chromium)
//
// Covers: every internal link and #anchor resolves, automated accessibility
// (axe-core, WCAG 2.1 AA) on every page, no horizontal scrolling from 320px to
// 1440px, and the interactive pieces – menu, filters, compare, pathway check,
// evidence checklist, and both enquiry forms (validation, "not connected"
// handling, success and failure responses from a form service).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { startServer } from '../scripts/serve.mjs';

const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const docs = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs');
const PORT = 4321;
const BASE = `http://localhost:${PORT}/`;
const pages = (await readdir(docs, { recursive: true })).filter((f) => f.endsWith('.html')).map((f) => f.split('\\').join('/')).sort();

let server, browser;
before(async () => {
  server = await startServer(PORT);
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  server?.close();
});

const newPage = async (viewport = { width: 1280, height: 900 }) => {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.errors = errors;
  return page;
};

test('every internal link and anchor resolves', async () => {
  const ids = {};
  const html = {};
  for (const p of pages) {
    html[p] = await readFile(join(docs, p), 'utf8');
    ids[p] = new Set([...html[p].matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  }
  const problems = [];
  for (const p of pages) {
    for (const [, raw] of html[p].matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const href = raw.replace(/&amp;/g, '&');
      if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
      const [pathPart, hash] = href.split('#');
      const target = pathPart ? posix.normalize(posix.join(posix.dirname(p), pathPart.split('?')[0])) : p;
      if (target === '' || target.startsWith('..')) { problems.push(`${p} → ${href} (outside site)`); continue; }
      const exists = pages.includes(target) || (await readFile(join(docs, target)).then(() => true, () => false));
      if (!exists) problems.push(`${p} → ${href} (missing file)`);
      else if (hash && target.endsWith('.html') && !ids[target]?.has(hash)) problems.push(`${p} → ${href} (missing #${hash})`);
    }
  }
  assert.deepEqual(problems, []);
});

test('no accessibility violations (axe, WCAG 2.1 AA) on any page – desktop and mobile', async () => {
  const report = [];
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const page = await newPage(viewport);
    for (const p of pages) {
      await page.goto(BASE + p);
      await page.addScriptTag({ content: axeSource });
      const result = await page.evaluate(() =>
        window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } })
      );
      for (const v of result.violations) {
        report.push(`${viewport.width}px ${p}: [${v.impact}] ${v.id} – ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0].target.join(' ')}`);
      }
    }
    assert.deepEqual(page.errors, [], 'no script errors');
    await page.context().close();
  }
  assert.deepEqual(report, []);
});

test('no horizontal scrolling at common widths', async () => {
  const overflow = [];
  for (const width of [320, 390, 768, 1024, 1440]) {
    const page = await newPage({ width, height: 900 });
    for (const p of pages) {
      await page.goto(BASE + p);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > width) overflow.push(`${p} @${width}px scrollWidth=${sw}`);
    }
    await page.context().close();
  }
  assert.deepEqual(overflow, []);
});

test('mobile menu opens, closes with Escape and returns focus', async () => {
  const page = await newPage({ width: 390, height: 844 });
  await page.goto(BASE + 'index.html');
  const toggle = page.locator('[data-nav-toggle]');
  await assert.doesNotReject(toggle.click());
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  await page.getByRole('link', { name: 'Short courses' }).first().waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute('data-nav-toggle')), true);
  await toggle.click();
  await page.locator('#site-menu').getByRole('link', { name: 'About Poonam' }).click();
  await page.waitForURL(/about\.html$/);
  await page.context().close();
});

test('course filters, search and URL state', async () => {
  const page = await newPage();
  await page.goto(BASE + 'courses.html');
  const visible = () => page.locator('[data-course-card]:visible').count();
  assert.equal(await visible(), 16);
  await page.getByRole('button', { name: 'Education' }).click();
  assert.equal(await visible(), 4);
  assert.match(page.url(), /sector=education/);
  await page.getByLabel('Level').selectOption('diploma');
  assert.equal(await visible(), 2);
  await page.getByRole('button', { name: 'Clear filters' }).first().click();
  assert.equal(await visible(), 16);
  await page.getByLabel('Search courses').fill('trainer');
  await page.waitForTimeout(250);
  assert.equal(await visible(), 1);
  await page.getByLabel('Search courses').fill('zzzz');
  await page.waitForTimeout(250);
  assert.equal(await page.locator('[data-empty]').isVisible(), true);
  await page.goto(BASE + 'courses.html?sector=firstaid');
  assert.equal(await visible(), 2);
  assert.equal(await page.getByRole('button', { name: 'First aid' }).getAttribute('aria-pressed'), 'true');
  await page.context().close();
});

test('compare up to three courses', async () => {
  const page = await newPage();
  await page.goto(BASE + 'courses.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const boxes = page.locator('[data-compare]');
  await boxes.nth(0).check();
  assert.equal(await page.locator('[data-compare-open]').isDisabled(), true, 'needs two');
  await boxes.nth(1).check();
  await boxes.nth(2).check();
  await boxes.nth(3).click();
  assert.equal(await boxes.nth(3).isChecked(), false, 'fourth is refused');
  assert.equal(await page.locator('[data-compare-count]').textContent(), '3');
  await page.locator('[data-compare-open]').click();
  const dialog = page.locator('[data-compare-dialog]');
  await dialog.waitFor({ state: 'visible' });
  assert.equal(await dialog.locator('thead th').count(), 3);
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  await page.locator('[data-compare-clear]').click();
  assert.equal(await page.locator('[data-compare-tray]').isHidden(), true);
  await page.context().close();
});

test('pathway check and evidence checklist', async () => {
  const page = await newPage();
  await page.goto(BASE + 'ways-to-study.html');
  await page.getByRole('button', { name: 'See my result' }).click();
  assert.equal(await page.locator('[data-quiz-error]').isVisible(), true);
  await page.locator('label.option', { hasText: '3 years or more' }).click();
  await page.locator('label.option', { hasText: 'A full qualification' }).click();
  await page.locator('label.option', { hasText: 'Yes, most of it' }).click();
  await page.getByRole('button', { name: 'See my result' }).click();
  assert.match(await page.locator('[data-quiz-result]').textContent(), /Recognition of prior learning looks promising/);

  await page.evaluate(() => localStorage.removeItem('pathwise-evidence'));
  await page.getByText('An up-to-date resume').click();
  await page.getByText('Position descriptions').click();
  assert.equal(await page.locator('[data-evidence-count]').textContent(), '2');
  await page.reload();
  assert.equal(await page.locator('[data-evidence-count]').textContent(), '2', 'remembered');
  await page.context().close();
});

test('contact form validates and never fakes success when not connected', async () => {
  const page = await newPage();
  await page.goto(BASE + 'contact.html?course=TAE40122');
  assert.equal(await page.locator('#course').inputValue(), 'TAE40122', 'prefilled from link');
  assert.equal(await page.locator('#topic').inputValue(), 'course');

  await page.getByRole('button', { name: /Send enquiry/ }).click();
  assert.equal(await page.locator('#name').getAttribute('aria-invalid'), 'true');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'name', 'focus moves to first error');
  assert.match(await page.locator('#name-error').textContent(), /enter your name/i);

  await page.locator('#name').fill('Sam Example');
  await page.locator('#email').fill('sam@');
  await page.locator('label.option', { hasText: 'Phone call' }).click();
  await page.getByRole('button', { name: /Send enquiry/ }).click();
  assert.match(await page.locator('#email-error').textContent(), /name@example\.com/);
  assert.match(await page.locator('#phone-error').textContent(), /phone number/i, 'phone required for a call');

  await page.locator('#email').fill('sam@example.com');
  await page.locator('#phone').fill('0412 345 678');
  await page.locator('label[for="contact-consent"]').click();
  await page.getByRole('button', { name: /Send enquiry/ }).click();
  const status = page.locator('[data-form-status]');
  assert.match(await status.textContent(), /have not been sent/);
  assert.doesNotMatch(await status.textContent(), /Thanks/);
  await page.context().close();
});

// Re-serve a page with a form endpoint configured, to exercise real submission.
const withEndpoint = async (page, url, respond) => {
  await page.route('**/*.html*', async (route) => {
    const res = await route.fetch();
    const body = (await res.text()).replace('"endpoint":""', '"endpoint":"https://forms.example.test/submit"');
    await route.fulfill({ response: res, body });
  });
  let payload = null;
  await page.route('https://forms.example.test/submit', async (route) => {
    payload = JSON.parse(route.request().postData());
    await respond(route);
  });
  await page.goto(url);
  return () => payload;
};

test('eligibility check: steps, validation and a successful submission', async () => {
  const page = await newPage();
  const sent = await withEndpoint(page, BASE + 'eligibility.html?course=CHC33021&pathway=rpl', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  );
  assert.equal(await page.locator('#e-course').inputValue(), 'CHC33021');
  assert.equal(await page.locator('input[name="pathway"][value="rpl"]').isChecked(), true);
  assert.equal(await page.locator('[data-submit]').isHidden(), true, 'submit only on last step');

  await page.getByRole('button', { name: 'Next' }).click(); // step 1 → 2
  await page.getByRole('button', { name: 'Next' }).click(); // step 2 empty → errors
  assert.equal(await page.locator('#experience-error').isVisible(), true);
  await page.locator('label.option', { hasText: '3–5 years' }).click();
  await page.locator('fieldset', { hasText: 'working in this field' }).locator('label.option', { hasText: 'Yes' }).click();
  await page.locator('#e-state').selectOption('VIC');
  await page.getByRole('button', { name: 'Next' }).click();
  assert.equal(await page.evaluate(() => document.activeElement?.matches('[data-step-title]')), true, 'focus moves to new step');

  await page.locator('#e-first').fill('Sam');
  await page.locator('#e-last').fill('Example');
  await page.locator('#e-email').fill('sam@example.com');
  await page.locator('#e-phone').fill('0412345678');
  await page.locator('label.option', { hasText: 'WhatsApp' }).click();
  await page.locator('label[for="e-consent"]').click();
  await page.getByRole('button', { name: /Send my eligibility check/ }).click();
  await page.getByText('that’s on its way').waitFor();
  const payload = sent();
  assert.equal(payload.first_name, 'Sam');
  assert.match(payload.course, /CHC33021/);
  assert.equal(payload.state, 'Victoria');
  assert.equal(payload._gotcha, undefined);
  await page.context().close();
});

test('a failed submission shows an error, not a success message', async () => {
  const page = await newPage();
  await withEndpoint(page, BASE + 'contact.html', (route) => route.fulfill({ status: 500, body: 'nope' }));
  await page.locator('#topic').selectOption('other');
  await page.locator('#name').fill('Sam');
  await page.locator('#email').fill('sam@example.com');
  await page.locator('label.option', { hasText: 'Email' }).click();
  await page.locator('label[for="contact-consent"]').click();
  await page.getByRole('button', { name: /Send enquiry/ }).click();
  await page.getByText('your details were not sent').waitFor();
  assert.equal(await page.getByText('that’s on its way').count(), 0);
  await page.context().close();
});

test('course page sticky enquiry bar appears on mobile after scrolling', async () => {
  const page = await newPage({ width: 390, height: 844 });
  await page.goto(BASE + 'course/chc33021-certificate-iii-individual-support.html');
  const bar = page.locator('[data-mobile-cta]');
  assert.equal(await bar.evaluate((el) => el.classList.contains('is-visible')), false);
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(400);
  assert.equal(await bar.evaluate((el) => el.classList.contains('is-visible')), true);
  await page.context().close();
});
