// Renders the social sharing image and the Apple touch icon from HTML.
// Run once after changing the brand: node scripts/make-images.mjs
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const font = async (f) => `data:font/woff2;base64,${(await readFile(join(root, 'src/assets/fonts', f))).toString('base64')}`;
const out = join(root, 'src/assets/img');
const mark = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 40 40"><rect width="40" height="40" rx="12" fill="#0e5e63"/><path d="M14 29V11h7.5a6 6 0 0 1 0 12H19" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="29.5" r="3.2" fill="#e3aa3c"/></svg>`;
const fontCss = `
  @font-face { font-family: Figtree; src: url(${await font('figtree-var-latin.woff2')}); font-weight: 400 700; }
  @font-face { font-family: Fraunces; src: url(${await font('fraunces-600-latin.woff2')}); font-weight: 600; }
  @font-face { font-family: Fraunces; font-style: italic; src: url(${await font('fraunces-600-italic-latin.woff2')}); font-weight: 600; }
  * { margin: 0; box-sizing: border-box; }`;

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<style>${fontCss}
  body { width: 1200px; height: 630px; background: #fbf8f3; font-family: Figtree; color: #142229; position: relative; overflow: hidden; padding: 72px 80px; }
  .blob { position: absolute; right: -160px; top: -160px; width: 620px; height: 620px; border-radius: 50%; background: radial-gradient(closest-side, rgba(227,170,60,.4), transparent 70%); }
  .ring { position: absolute; right: 70px; bottom: -140px; width: 360px; height: 360px; border-radius: 50%; border: 56px solid rgba(14,94,99,.12); }
  .brand { display: flex; align-items: center; gap: 18px; font-family: Fraunces; font-size: 40px; }
  .brand small { display: block; font-family: Figtree; font-size: 15px; letter-spacing: .18em; font-weight: 600; color: #56646b; margin-top: 4px; }
  h1 { font-family: Fraunces; font-weight: 600; font-size: 74px; line-height: 1.05; letter-spacing: -.02em; margin-top: 64px; max-width: 900px; position: relative; }
  p { font-size: 28px; color: #56646b; margin-top: 28px; position: relative; }
</style>
<div class="blob"></div><div class="ring"></div>
<div class="brand">${mark(64)}<div>Pathwise<small>COURSES</small></div></div>
<h1>Find your course, <em style="color:#0e5e63">with Poonam by your side.</em></h1>
<p>Personal course guidance · RPL · Online study · Short courses</p>`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(out, 'og-image.png') });

await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(`<style>${fontCss} body { width: 180px; height: 180px; }</style>${mark(180).replace('rx="12"', 'rx="0"')}`);
await page.screenshot({ path: join(out, 'apple-touch-icon.png') });

await browser.close();
console.log('Images written to src/assets/img/');
