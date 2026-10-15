// Renders the social sharing image and the Apple touch icon from HTML.
// Run once after changing the brand: node scripts/make-images.mjs
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { rocketMark } from '../src/templates/brand.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const font = async (f) => `data:font/woff2;base64,${(await readFile(join(root, 'src/assets/fonts', f))).toString('base64')}`;
const out = join(root, 'src/assets/img');
// Render every exported brand asset from the same rocket geometry.
const mark = (size, radius = 13) => rocketMark({ size, radius });
await writeFile(join(out, 'favicon.svg'), rocketMark());
const fontCss = `
  @font-face { font-family: Geist; src: url(${await font('geist-var-latin.woff2')}); font-weight: 300 800; }
  @font-face { font-family: 'Geist Mono'; src: url(${await font('geist-mono-latin.woff2')}); font-weight: 400 600; }
  @font-face { font-family: 'Instrument Serif'; font-style: italic; src: url(${await font('instrument-serif-italic-latin.woff2')}); }
  * { margin: 0; box-sizing: border-box; }`;

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<style>${fontCss}
  body { width: 1200px; height: 630px; background: #0e1512; font-family: Geist; color: #fff; position: relative; overflow: hidden; padding: 72px 80px; }
  .glow { position: absolute; right: -200px; top: -220px; width: 760px; height: 760px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,106,61,.45), transparent 70%); }
  .glow2 { position: absolute; left: -200px; bottom: -320px; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,178,63,.22), transparent 70%); }
  .brand { position: relative; display: flex; align-items: center; gap: 18px; font-size: 42px; font-weight: 640; letter-spacing: -.045em; }
  .brand em { font-family: 'Instrument Serif'; font-style: italic; font-weight: 400; color: #ff6a3d; letter-spacing: -.01em; }
  .brand small { display: block; font-family: 'Geist Mono'; font-size: 14px; letter-spacing: .3em; font-weight: 500; color: #a9a496; margin-top: 6px; }
  h1 { position: relative; font-weight: 560; font-size: 82px; line-height: 1; letter-spacing: -.05em; margin-top: 70px; max-width: 980px; }
  h1 em { font-family: 'Instrument Serif'; font-style: italic; font-weight: 400; color: #ffb23f; letter-spacing: -.02em; }
  p { position: relative; font-family: 'Geist Mono'; font-size: 20px; letter-spacing: .12em; text-transform: uppercase; color: #e9e3d6; margin-top: 40px; }
  .band { position: absolute; left: 0; right: 0; bottom: 0; height: 14px; background: #ff6a3d; }
</style>
<div class="glow"></div><div class="glow2"></div>
<div class="brand">${mark(68)}<div>Path<em>wise</em><small>COURSES</small></div></div>
<h1>Find the course that <em>moves your career forward.</em></h1>
<p>Course guidance with Poonam · RPL · Online study</p>
<div class="band"></div>`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(out, 'og-image.png') });

await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(`<style>${fontCss} body { width: 180px; height: 180px; }</style>${mark(180, 0)}`);
await page.screenshot({ path: join(out, 'apple-touch-icon.png') });

await browser.close();
console.log('Images written to src/assets/img/');
