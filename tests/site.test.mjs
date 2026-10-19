// End-to-end checks for the built site in docs/.
// Run: npm test   (builds first, then runs these checks in headless Chromium)
//
// Covers every internal link and #anchor, automated accessibility (axe-core,
// WCAG 2.1 AA) on every page, horizontal overflow at 320–1440px, and the main
// visitor journeys: search and filters, comparison, the course finder, course
// pages, and both enquiry forms – switched off while no form service is
// connected, and working (success and failure) on a build that has one.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, rm } from 'node:fs/promises';
import { join, dirname, posix } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { startServer } from '../scripts/serve.mjs';

const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'docs');
const connected = join(tmpdir(), `pathwise-connected-${process.pid}`);
const ENDPOINT = 'https://forms.example.test/submit';
const BASE = 'http://localhost:4321/';
const LIVE = 'http://localhost:4322/'; // same site, built with a form service connected
const pages = (await readdir(docs, { recursive: true })).filter((f) => f.endsWith('.html')).map((f) => f.split('\\').join('/')).sort();

let servers = [];
let browser;
before(async () => {
  execFileSync(process.execPath, [join(root, 'scripts/build.mjs')], { env: { ...process.env, PATHWISE_OUT: connected, PATHWISE_FORM_ENDPOINT: ENDPOINT }, stdio: 'ignore' });
  servers = [await startServer(4321), await startServer(4322, connected)];
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  servers.forEach((s) => s.close());
  await rm(connected, { recursive: true, force: true });
});

const newPage = async (viewport = { width: 1280, height: 900 }, opts = {}) => {
  const ctx = await browser.newContext({ viewport, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.errors = errors;
  return page;
};
const visibleCodes = (page) => page.$$eval('[data-course-card]:not([hidden])', (els) => els.map((e) => e.dataset.code));
const search = async (page, q) => { await page.getByLabel('Search courses').fill(q); await page.waitForTimeout(250); };

/* ── Whole-site checks ─────────────────────────────────────────────────── */

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

test('no developer instructions on visitor-facing pages', async () => {
  for (const p of pages) {
    const text = await readFile(join(docs, p), 'utf8');
    assert.doesNotMatch(text, /Site owner|forms\.endpoint|src\/data\/site\.js/, p);
  }
});

test('no accessibility violations (axe, WCAG 2.1 AA) on any page – desktop and mobile', async () => {
  const report = [];
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    // Reduced motion so axe measures the settled page, not a frame mid-animation.
    const page = await newPage(viewport, { reducedMotion: 'reduce' });
    for (const p of [...pages, 'course-finder.html?interest=aged-disability&exp=3-5&held=none&goal=qualify']) {
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

test('no horizontal scrolling at 320, 390, 768, 1024 and 1440px', async () => {
  const overflow = [];
  for (const width of [320, 390, 768, 1024, 1440]) {
    const page = await newPage({ width, height: 900 });
    for (const p of [...pages, 'course-finder.html?interest=early-childhood&exp=none&held=none&goal=start']) {
      await page.goto(BASE + p);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > width) overflow.push(`${p} @${width}px scrollWidth=${sw}`);
    }
    await page.context().close();
  }
  assert.deepEqual(overflow, []);
});

/* ── Navigation ────────────────────────────────────────────────────────── */

test('mobile menu opens, closes with Escape and returns focus', async () => {
  const page = await newPage({ width: 390, height: 844 });
  await page.goto(BASE + 'index.html');
  const toggle = page.locator('[data-nav-toggle]');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute('data-nav-toggle')), true);
  await toggle.click();
  await page.locator('#site-menu').getByRole('link', { name: 'Find my course' }).click();
  await page.waitForURL(/course-finder\.html$/);
  await page.context().close();
});

test('homepage hero: search suggests courses, and the finder is one click away', async () => {
  const page = await newPage();
  await page.goto(BASE + 'index.html');
  const input = page.getByRole('combobox', { name: /search courses/i });
  await input.fill('childcare');
  const options = page.getByRole('option');
  assert.match(await options.first().textContent(), /Early Childhood/);
  await input.press('ArrowDown');
  assert.equal(await input.getAttribute('aria-activedescendant'), 'hs-opt-0');
  await input.press('Escape');
  assert.equal(await input.getAttribute('aria-expanded'), 'false');
  await input.fill('nursing home');
  await input.press('Enter');
  await page.waitForURL(/courses\.html\?q=nursing\+home|courses\.html\?q=nursing%20home/);
  assert.equal(await page.locator('#course-search').inputValue(), 'nursing home');
  await page.goto(BASE + 'index.html');
  assert.ok(await page.locator('.hero a[href="course-finder.html"]').count(), 'hero links to the course finder');
  await page.getByRole('link', { name: 'Childcare and early learning' }).click();
  await page.waitForURL(/course-finder\.html\?interest=early-childhood/);
  assert.match(await page.locator('[data-finder-count]').textContent(), /Question 2 of 4/);
  await page.context().close();
});

test('Pathway Map: tabs switch routes and the starting point follows experience', async () => {
  const page = await newPage(undefined, { reducedMotion: 'reduce' });
  await page.goto(BASE + 'index.html');
  const map = page.locator('#pathway-map');
  assert.equal(await map.getByText('Where are you now?').isVisible(), false, 'no starting-point question before an area is picked');
  assert.equal(await map.locator('[role="tabpanel"]:visible').count(), 0, 'no route shows until an area is picked');
  await map.getByRole('tab', { name: 'Early childhood' }).click();
  assert.ok(await map.getByText('Where are you now?').isVisible(), 'starting-point question appears after picking an area');
  const panel = map.getByRole('tabpanel', { name: /Early childhood/ });
  assert.ok(await panel.isVisible(), 'chosen route shows');
  assert.equal(await map.locator('[role="tabpanel"]:visible').count(), 1, 'one route at a time');
  assert.match(await panel.locator('.pmap__stop.is-start').textContent(), /Certificate III/);
  await map.locator('input[name="pmap-exp"][value="qual"]').check();
  assert.match(await panel.locator('.pmap__stop.is-start').textContent(), /Diploma/);
  assert.ok(await panel.locator('.pmap__stop').first().getByText('Already done').isVisible());
  await map.locator('input[name="pmap-exp"][value="exp"]').check();
  assert.ok(await panel.locator('.pmap__stop.is-start [data-rpl-note]').isVisible(), 'experience shows where RPL could count');
  await map.getByRole('tab', { name: 'Early childhood' }).press('ArrowRight');
  assert.equal(await map.getByRole('tab', { name: 'Schools & OSHC' }).getAttribute('aria-selected'), 'true', 'arrow keys move between tabs');
  await page.context().close();
});

test('Pathway Map: an area can be dragged onto the board with a mouse', async () => {
  const page = await newPage({ width: 1440, height: 900 });
  await page.goto(BASE + 'index.html');
  const map = page.locator('#pathway-map');
  await map.scrollIntoViewIfNeeded();
  const tab = map.getByRole('tab', { name: 'Training & leadership' });
  const from = await tab.boundingBox();
  const zone = await map.locator('[data-pmap-zone]').boundingBox();
  await page.mouse.move(from.x + 30, from.y + 20);
  await page.mouse.down();
  await page.mouse.move(from.x + 90, from.y + 30, { steps: 4 });
  await page.mouse.move(zone.x + zone.width / 2, zone.y + zone.height / 2, { steps: 10 });
  assert.equal(await map.locator('[data-pmap-zone]').evaluate((el) => el.classList.contains('is-over')), true, 'the board lights up under the card');
  await page.mouse.up();
  assert.equal(await tab.getAttribute('aria-selected'), 'true', 'dropping picks the area');
  assert.ok(await map.getByRole('tabpanel', { name: /Training & leadership/ }).isVisible());
  assert.ok(await map.getByText('Where are you now?').isVisible());
  assert.equal(await page.locator('.pmap__ghost').count(), 0, 'the dragged copy is cleaned up');
  await map.getByRole('button', { name: 'Change area' }).click();
  assert.equal(await map.locator('[role="tabpanel"]:visible').count(), 0, 'Change area clears the board');
  await page.context().close();
});

test('chat button wears the Pathwise mark and says hello once a visit', async () => {
  const page = await newPage({ width: 1440, height: 900 });
  await page.goto(BASE + 'courses.html');
  assert.equal(await page.locator('.assistant__launcher .assistant__face img').count(), 0, 'no photo of Poonam on the automated assistant');
  const nudge = page.locator('[data-assistant-nudge]');
  await nudge.waitFor({ state: 'visible', timeout: 4000 });
  assert.match(await nudge.textContent(), /How can I help\?/);
  await nudge.click();
  assert.ok(await page.getByRole('dialog', { name: 'Course questions assistant' }).isVisible(), 'the bubble opens the chat');
  await page.goto(BASE + 'index.html');
  await page.waitForTimeout(2600);
  assert.equal(await nudge.isVisible(), false, 'only once per visit');
  await page.context().close();
});

test('chat assistant answers from site content and closes with Escape', async () => {
  const page = await newPage(undefined, { reducedMotion: 'reduce' });
  let releaseData;
  const dataReady = new Promise((resolve) => { releaseData = resolve; });
  await page.route('**/assets/data/assistant.json', async (route) => {
    await dataReady;
    await route.continue();
  });
  await page.goto(BASE + 'courses.html');
  const toggle = page.getByRole('button', { name: /ask a question about courses/i });
  await toggle.click();
  const dialog = page.getByRole('dialog', { name: 'Course questions assistant' });
  await dialog.getByText(/automated helper/i).first().waitFor();
  assert.ok(await dialog.getByRole('textbox').isDisabled(), 'questions wait until the assistant data and handlers are ready');
  releaseData();
  await dialog.getByRole('textbox').fill('how much is the TAE');
  await dialog.getByRole('textbox').press('Enter');
  await dialog.getByRole('link', { name: /Training and Assessment/ }).waitFor();
  assert.match(await dialog.locator('.assistant__msg--bot').last().textContent(), /not Poonam’s prices/);
  await dialog.getByRole('button', { name: 'What is RPL?' }).click();
  assert.match(await dialog.locator('.assistant__msg--bot').last().textContent(), /RPL is a formal assessment/);
  await page.keyboard.press('Escape');
  assert.ok(await dialog.isHidden(), 'closes with Escape');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  await page.context().close();
});

test('student stories: a moving wall that keeps moving under the mouse and can be paused', async () => {
  const page = await newPage();
  await page.goto(BASE + 'index.html');
  const sec = page.locator('[data-wall]');
  assert.ok((await sec.locator('.wall-card:not([aria-hidden])').count()) >= 4, 'each story is listed once for screen readers');
  const rows = await sec.locator('.wall__rows').boundingBox();
  await page.mouse.move(rows.x + rows.width / 2, rows.y + rows.height / 2); // the cards keep moving, so hover a point
  assert.equal(await sec.evaluate((el) => getComputedStyle(el.querySelector('.wall__row')).animationPlayState), 'running', 'stories keep moving under the mouse');
  await sec.locator('.wall__rows').click();
  assert.equal(await sec.evaluate((el) => getComputedStyle(el.querySelector('.wall__row')).animationPlayState), 'paused', 'a click on the stories pauses them');
  await sec.locator('.wall__rows').click();
  await sec.getByRole('button', { name: 'Pause stories' }).click();
  assert.equal(await sec.locator('[data-wall-pause]').getAttribute('aria-pressed'), 'true');
  assert.ok(await sec.getByRole('button', { name: 'Play stories' }).isVisible(), 'label changes to Play');
  assert.equal(await sec.evaluate((el) => getComputedStyle(el.querySelector('.wall__row')).animationPlayState), 'paused');
  await page.context().close();
});

test('Instagram reels: a section at the end of the home page that loads Instagram only when scrolled to', async () => {
  const page = await newPage({ width: 1440, height: 900 });
  const igRequests = [];
  page.on('request', (r) => { if (/instagram\.com|cdninstagram/.test(r.url())) igRequests.push(r.url()); });
  await page.goto(BASE + 'index.html');
  assert.equal(igRequests.length, 0, 'nothing loads from Instagram at the top of the page');
  const sec = page.locator('.reels');
  await sec.scrollIntoViewIfNeeded();
  assert.ok(await sec.getByRole('heading', { name: /See the work/ }).isVisible());
  assert.ok((await sec.locator('.reel-card').count()) >= 1);
  assert.equal(await page.locator('main > :last-child').evaluate((el) => el.classList.contains('reels')), true, 'reels are the last section on the page');
  await page.context().close();
});

/* ── Search, filters and comparison ────────────────────────────────────── */

test('search understands everyday words and ranks the best matches first', async () => {
  const page = await newPage();
  await page.goto(BASE + 'courses.html');

  await search(page, 'childcare');
  const child = await visibleCodes(page);
  for (const code of ['CHC30125', 'CHC50125', 'CHC50225']) assert.ok(child.includes(code), `childcare should include ${code}`);
  assert.deepEqual(child.slice(0, 2).sort(), ['CHC30125', 'CHC50125'], 'early childhood courses rank first');
  const cpr = child.indexOf('HLTAID009');
  assert.ok(cpr === -1 || cpr > child.indexOf('CHC50225'), 'CPR does not outrank childcare qualifications');

  await search(page, 'nursing home');
  assert.ok((await visibleCodes(page)).includes('CHC33021'));
  await search(page, 'cert 3');
  assert.deepEqual((await visibleCodes(page)).sort(), ['CHC30125', 'CHC33021']);
  await search(page, 'teacher aide');
  assert.equal((await visibleCodes(page))[0], 'CHC40225');
  await search(page, 'TAE');
  assert.equal((await visibleCodes(page))[0], 'TAE40122');
  await search(page, 'oh&s');
  assert.equal((await visibleCodes(page))[0], 'BSB41419');

  await search(page, 'zzzz');
  assert.equal(await page.locator('[data-empty]').isVisible(), true);
  await page.getByRole('button', { name: 'aged care' }).click();
  assert.ok((await visibleCodes(page)).includes('CHC33021'), 'empty-state suggestion leads back to courses');
  await page.context().close();
});

test('filters stay visible as removable chips and update the URL', async () => {
  const page = await newPage();
  await page.goto(BASE + 'courses.html');
  const count = async () => (await visibleCodes(page)).length;
  assert.equal(await count(), 16);
  await page.getByRole('button', { name: 'Education', exact: true }).click();
  assert.equal(await count(), 4);
  assert.match(page.url(), /sector=education/);
  await page.getByLabel('Level').selectOption('diploma');
  assert.equal(await count(), 2);
  const chips = page.locator('[data-active-list] button');
  assert.equal(await chips.count(), 2);
  await chips.filter({ hasText: 'Diploma' }).click();
  assert.equal(await count(), 4, 'removing one chip keeps the other filter');
  await page.getByRole('button', { name: 'Clear all' }).click();
  assert.equal(await count(), 16);
  await page.goto(BASE + 'courses.html?sector=firstaid');
  assert.equal(await count(), 2);
  await page.context().close();
});

test('on mobile, search comes first, extra filters fold away and results start on the first screen', async () => {
  const page = await newPage({ width: 390, height: 844 });
  await page.goto(BASE + 'courses.html');
  assert.equal(await page.getByLabel('Search courses').isVisible(), true);
  assert.equal(await page.getByLabel('Level').isVisible(), false);
  await page.locator('[data-filters-toggle]').click();
  assert.equal(await page.getByLabel('Level').isVisible(), true);
  await page.locator('[data-filters-toggle]').click();
  const firstCardTop = await page.locator('[data-course-card]').first().evaluate((el) => el.getBoundingClientRect().top);
  assert.ok(firstCardTop < 844, `first result starts at ${firstCardTop}px`);
  await page.context().close();
});

test('the course search stays in view while scrolling the results', async () => {
  const page = await newPage({ width: 1280, height: 800 });
  await page.goto(BASE + 'courses.html');
  await page.evaluate(() => window.scrollTo({ top: 1600, behavior: 'instant' }));
  await page.waitForTimeout(300);
  const search = page.getByLabel('Search courses');
  const top = await search.evaluate((el) => el.getBoundingClientRect().top);
  assert.ok(top > 0 && top < 200, `search sits under the header after scrolling (top ${top}px)`);
  await search.fill('childcare');
  // The page scrolls (smoothly) so the first match sits just under the pinned search.
  await page.waitForFunction(() => {
    const card = [...document.querySelectorAll('[data-course-card]')].find((c) => !c.hidden);
    const top = card?.getBoundingClientRect().top;
    return top > 0 && top < 800;
  }, null, { timeout: 3000 });
  assert.ok(await search.isVisible(), 'search is still in view');
  await page.context().close();
});

test('compare up to three courses, with names in the tray, on desktop and mobile', async () => {
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const page = await newPage(viewport);
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
    if (viewport.width > 600) assert.match(await page.locator('[data-compare-list]').textContent(), /Individual Support/);
    await page.locator('[data-compare-open]').click();
    const dialog = page.locator('[data-compare-dialog]');
    await dialog.waitFor({ state: 'visible' });
    const blocks = viewport.width > 720 ? dialog.locator('thead th') : dialog.locator('.cmp-card');
    assert.equal(await blocks.count(), 3);
    assert.equal(await blocks.first().isVisible(), true);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await page.locator('[data-compare-clear]').click();
    assert.equal(await page.locator('[data-compare-tray]').isHidden(), true);
    await page.context().close();
  }
});

/* ── Course finder ─────────────────────────────────────────────────────── */

test('course finder: one question at a time, Back, results with reasons, edit without restarting', async () => {
  const page = await newPage();
  await page.goto(BASE + 'course-finder.html');
  const count = page.locator('[data-finder-count]');
  assert.match(await count.textContent(), /Question 1 of 4/);
  assert.equal(await page.locator('[data-q="exp"]').isVisible(), false);

  await page.getByRole('button', { name: /Next/ }).click();
  assert.equal(await page.locator('[data-finder-error]').isVisible(), true, 'asks for an answer');

  await page.locator('label.choice', { hasText: 'Aged care or disability support' }).click(); // a pointer click moves on
  await page.waitForTimeout(400);
  assert.match(await count.textContent(), /Question 2 of 4/);
  await page.getByRole('button', { name: 'Back' }).click();
  assert.equal(await page.locator('input[name="interest"][value="aged-disability"]').isChecked(), true, 'answer kept');
  await page.getByRole('button', { name: /Next/ }).click();

  for (const answer of ['3–5 years', 'None yet', 'Get qualified for work I already do']) {
    await page.locator('fieldset:not([hidden]) label.choice', { hasText: answer }).click();
    await page.waitForTimeout(400);
  }
  const results = page.locator('[data-finder-results]');
  await results.waitFor({ state: 'visible' });
  assert.equal(await page.locator('[data-finder-form]').isVisible(), false);
  assert.equal(await page.locator('.suggestion h3').first().textContent(), 'Certificate III in Individual Support');
  assert.match(await page.locator('.suggestion').first().textContent(), /Why it may fit[\s\S]*Matches your interest/);
  assert.match(await page.locator('.suggestion').first().textContent(), /Recognition of prior learning/);
  assert.doesNotMatch(await results.textContent(), /\d+\s?%|guarantee/i, 'no match scores or guarantees');
  assert.equal(await page.locator('form input[type="email"]').count(), 0, 'results come before any contact details');

  // Change one answer: it opens that question, then goes straight back to the results.
  await page.getByRole('button', { name: /Change your answer about experience/ }).click();
  assert.match(await count.textContent(), /Question 2 of 4/);
  await page.locator('fieldset:not([hidden]) label.choice', { hasText: 'None yet' }).click();
  await results.waitFor({ state: 'visible' });
  assert.match(await page.locator('.suggestion').first().textContent(), /Full course, studied online/);

  const ask = page.getByRole('link', { name: /Ask Poonam about this course/ }).first();
  assert.match(await ask.getAttribute('href'), /course=CHC33021&pathway=study&from=finder&exp=none/);
  await ask.click();
  await page.waitForURL(/eligibility\.html/);
  assert.match(await page.locator('[data-selection]').textContent(), /Certificate III in Individual Support[\s\S]*Experience: None yet/);
  assert.equal(await page.locator('#e-course').inputValue(), 'CHC33021');
  assert.equal(await page.locator('input[name="experience"][value="none"]').isChecked(), true);
  await page.context().close();
});

test('course finder works with the keyboard alone and skips questions that don’t apply', async () => {
  const page = await newPage();
  await page.goto(BASE + 'course-finder.html');
  await page.locator('input[name="interest"]').first().focus();
  // Arrow through the options to "A first aid or CPR certificate" (8th option).
  for (let i = 0; i < 7; i++) await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('input[name="interest"][value="firstaid"]').isChecked(), true);
  assert.match(await page.locator('[data-finder-count]').textContent(), /Question 1 of 4/, 'arrow keys do not jump ahead');
  await page.keyboard.press('Enter');
  assert.match(await page.locator('[data-finder-count]').textContent(), /Question 2 of 3/, 'qualification question skipped for first aid');
  assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute('data-q-title')), true, 'focus moves to the new question');
  await page.locator('input[name="exp"]').first().focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Enter');
  await page.locator('input[name="goal"][value="skill"]').focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Enter');
  await page.locator('[data-finder-results]').waitFor({ state: 'visible' });
  assert.equal(await page.locator('.suggestion h3').first().textContent(), 'Provide First Aid');
  assert.match(await page.locator('[data-finder-results]').textContent(), /short course/);
  await page.context().close();
});

/* ── Course pages ──────────────────────────────────────────────────────── */

test('course page brings the key decision details together', async () => {
  const page = await newPage(undefined, { reducedMotion: 'reduce' });
  await page.goto(BASE + 'course/chc50125-diploma-early-childhood-education-care.html');
  const glance = await page.locator('.glance').textContent();
  for (const label of ['Who it suits', 'Study options', 'Work placement', 'Entry requirements', 'Training provider', 'price|fees']) assert.match(glance, new RegExp(label, 'i'));
  assert.match(glance, /\$[\d,]+–\$[\d,]+/, 'typical price range shown');
  assert.match(glance, /Typical across providers\. Ask Poonam for an exact quote/i, 'range labelled as typical, not Poonam’s price');
  assert.ok((await page.locator('.on-page a').count()) >= 7, 'section links');
  await page.locator('.on-page a', { hasText: 'Entry requirements' }).click();
  await page.waitForTimeout(500);
  const top = await page.locator('#entry').evaluate((el) => el.getBoundingClientRect().top);
  assert.ok(top >= 0 && top < 300, `section link scrolls to the section (top ${top})`);
  await page.context().close();
});

test('course page sticky enquiry bar appears on mobile and leaves room above it', async () => {
  const page = await newPage({ width: 390, height: 844 });
  await page.goto(BASE + 'course/chc33021-certificate-iii-individual-support.html');
  const bar = page.locator('[data-mobile-cta]');
  assert.equal(await bar.evaluate((el) => el.classList.contains('is-visible')), false);
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(400);
  assert.equal(await bar.evaluate((el) => el.classList.contains('is-visible')), true);
  const footerPad = await page.locator('.site-footer').evaluate((el) => parseFloat(getComputedStyle(el).paddingBottom));
  assert.ok(footerPad >= 80, 'footer leaves room for the bar');
  await page.context().close();
});

/* ── Enquiry forms ─────────────────────────────────────────────────────── */

test('without a form service, both forms are clearly switched off', async () => {
  const page = await newPage();
  for (const p of ['contact.html', 'eligibility.html']) {
    await page.goto(BASE + p);
    assert.match(await page.locator('.form-unavailable').textContent(), /aren’t open yet/);
    assert.equal(await page.locator('[data-submit]').isDisabled(), true);
    assert.equal(await page.locator('form input:not([type=hidden])').first().isDisabled(), true);
  }
  await page.context().close();
});

test('connected contact form: clear validation, then success only when accepted', async () => {
  const page = await newPage();
  let payload = null;
  await page.route(ENDPOINT, async (route) => {
    payload = JSON.parse(route.request().postData());
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.goto(LIVE + 'contact.html?course=TAE40122');
  assert.equal(await page.locator('#course').inputValue(), 'TAE40122');
  assert.equal(await page.locator('#topic').inputValue(), 'course');

  await page.getByRole('button', { name: /Send enquiry/ }).click();
  assert.equal(await page.locator('#name').getAttribute('aria-invalid'), 'true');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'name', 'focus moves to the first error (topic is prefilled)');
  assert.match(await page.locator('#name-error').textContent(), /enter your name/i);

  await page.locator('#name').fill('Sam Example');
  await page.locator('#email').fill('sam@');
  await page.locator('label.option', { hasText: 'Phone call' }).click();
  await page.getByRole('button', { name: /Send enquiry/ }).click();
  assert.match(await page.locator('#email-error').textContent(), /name@example\.com/);
  assert.match(await page.locator('#phone-error').textContent(), /phone number/i, 'phone required for a call');
  assert.equal(payload, null, 'nothing sent while invalid');

  await page.locator('#email').fill('sam@example.com');
  await page.locator('#phone').fill('0412 345 678');
  await page.locator('label[for="contact-consent"]').click();
  await page.getByRole('button', { name: /Send enquiry/ }).click();
  await page.getByText('that’s on its way').waitFor();
  assert.match(await page.locator('.form-success').textContent(), /What happens next/);
  assert.equal(payload.name, 'Sam Example');
  assert.equal(payload.form, 'contact');
  await page.context().close();
});

test('connected eligibility form: steps, finder details passed along, a failure keeps answers', async () => {
  const page = await newPage();
  let accept = false;
  let payload = null;
  await page.route(ENDPOINT, async (route) => {
    payload = JSON.parse(route.request().postData());
    if (accept) await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    else await route.fulfill({ status: 500, body: 'nope' });
  });
  // Arrive from the course finder with results saved for this visit.
  await page.goto(LIVE + 'course-finder.html?interest=aged-disability&exp=3-5&held=none&goal=qualify');
  await page.getByRole('link', { name: /Ask Poonam about this course/ }).first().click();
  await page.waitForURL(/eligibility\.html/);
  assert.equal(await page.locator('input[name="pathway"][value="rpl"]').isChecked(), true);
  assert.equal(await page.locator('[data-submit]').isHidden(), true, 'submit only on the last step');

  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('fieldset', { hasText: 'working in this field' }).locator('label.option', { hasText: 'Yes' }).click();
  await page.locator('#e-state').selectOption('VIC');
  await page.getByRole('button', { name: 'Next' }).click();
  assert.equal(await page.evaluate(() => document.activeElement?.matches('[data-step-title]')), true, 'focus moves to the new step');

  await page.locator('#e-first').fill('Sam');
  await page.locator('#e-last').fill('Example');
  await page.locator('#e-email').fill('sam@example.com');
  await page.locator('#e-phone').fill('0412345678');
  await page.locator('label.option', { hasText: 'WhatsApp' }).click();
  await page.locator('label[for="e-consent"]').click();
  await page.getByRole('button', { name: /Send to Poonam/ }).click();
  await page.getByText('your details were not sent').waitFor();
  assert.equal(await page.locator('#e-email').inputValue(), 'sam@example.com', 'answers kept after a failure');
  assert.equal(await page.getByText('that’s on its way').count(), 0);

  accept = true;
  await page.getByRole('button', { name: /Send to Poonam/ }).click();
  await page.getByText('that’s on its way').waitFor();
  assert.match(payload.course, /CHC33021/);
  assert.equal(payload.state, 'Victoria');
  assert.match(payload.finder_results, /Experience: 3–5 years/);
  assert.equal(payload._gotcha, undefined);
  await page.context().close();
});

test('evidence checklist remembers ticks on this device', async () => {
  const page = await newPage();
  await page.goto(BASE + 'ways-to-study.html');
  await page.evaluate(() => localStorage.removeItem('pathwise-evidence'));
  await page.reload();
  await page.getByText('An up-to-date resume').click();
  await page.getByText('Position descriptions').click();
  assert.equal(await page.locator('[data-evidence-count]').textContent(), '2');
  await page.reload();
  assert.equal(await page.locator('[data-evidence-count]').textContent(), '2');
  await page.context().close();
});
