// Builds the static site into docs/ (served as-is by GitHub Pages, Netlify,
// Vercel or any static host). Run: npm run build
import { mkdir, rm, writeFile, cp, readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from '../src/data/site.js';
import { courses } from '../src/data/courses.js';
import { layout } from '../src/templates/layout.js';
import home from '../src/pages/home.js';
import coursesPage from '../src/pages/courses.js';
import finder from '../src/pages/finder.js';
import coursePage from '../src/pages/course.js';
import ways from '../src/pages/ways.js';
import shortPage from '../src/pages/short.js';
import about from '../src/pages/about.js';
import faq from '../src/pages/faq.js';
import { contact, eligibility } from '../src/pages/forms.js';
import { privacy, notFound } from '../src/pages/misc.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// PATHWISE_OUT and PATHWISE_FORM_ENDPOINT let the test suite build a copy of
// the site with a (fake) form service connected, without touching docs/.
const out = process.env.PATHWISE_OUT || join(root, 'docs');
if (process.env.PATHWISE_FORM_ENDPOINT) site.forms.endpoint = process.env.PATHWISE_FORM_ENDPOINT;

const pages = [
  home(),
  finder(),
  coursesPage(),
  ...courses.map(coursePage),
  ways(),
  shortPage(),
  about(),
  faq(),
  contact(),
  eligibility(),
  privacy(),
  notFound(),
];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const page of pages) {
  const file = join(out, page.path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, layout(page));
}

await cp(join(root, 'src/assets'), join(out, 'assets'), { recursive: true });

// Light CSS minification: drop comments and collapse whitespace.
const cssFile = join(out, 'assets/css/styles.css');
const css = await readFile(cssFile, 'utf8');
await writeFile(
  cssFile,
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim()
);

// Search engine files. While in draft the site asks not to be indexed.
const indexable = pages.filter((p) => p.path !== '404.html');
await writeFile(
  join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${site.url}/${p.path === 'index.html' ? '' : p.path}</loc></url>`).join('\n')}
</urlset>
`
);
await writeFile(
  join(out, 'robots.txt'),
  site.draft ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`
);
// Stop GitHub Pages running Jekyll over the output.
await writeFile(join(out, '.nojekyll'), '');

const count = (await readdir(out, { recursive: true })).filter((f) => f.endsWith('.html')).length;
console.log(`Built ${count} pages into ${process.env.PATHWISE_OUT ? out : 'docs/'}${site.draft ? ' (draft mode)' : ''}`);
