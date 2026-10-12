import { site } from '../data/site.js';
import { courses } from '../data/courses.js';
import { esc, html, link, icon, contactLinks, placeholder, tbc } from './helpers.js';

export const NAV = [
  { id: 'finder', label: 'Find my course', href: 'course-finder.html' },
  { id: 'courses', label: 'Courses', href: 'courses.html' },
  { id: 'ways', label: 'Ways to study', href: 'ways-to-study.html' },
  { id: 'short', label: 'Short courses', href: 'short-courses.html' },
  { id: 'about', label: 'About Poonam', href: 'about.html' },
];

const logo = (depth) => html`
  <a class="logo" href="${link(depth, 'index.html')}" aria-label="${site.name} – home">
    <svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="12" fill="var(--primary)"/>
      <path d="M14 29V11h7.5a6 6 0 0 1 0 12H19" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="14" cy="29.5" r="3.2" fill="var(--gold)"/>
    </svg>
    <span class="logo__text">Pathwise<span class="logo__sub">Courses</span></span>
  </a>`;

const header = (depth, active) => html`
  <header class="site-header" data-header>
    <div class="container site-header__inner">
      ${logo(depth)}
      <nav class="site-nav" aria-label="Main">
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu" data-nav-toggle>
          <span class="nav-toggle__open">${icon('menu')}</span>
          <span class="nav-toggle__close">${icon('x')}</span>
          <span class="nav-toggle__label">Menu</span>
        </button>
        <div class="site-menu" id="site-menu" data-nav-menu>
          <ul class="site-menu__list" role="list">
            ${NAV.map(
              (item) => html`<li><a href="${link(depth, item.href)}"${item.id === active ? ' aria-current="page"' : ''}>${item.label}</a></li>`
            )}
          </ul>
          <div class="site-menu__cta">
            <a class="btn btn--primary" href="${link(depth, 'contact.html')}"${active === 'contact' ? ' aria-current="page"' : ''}>${icon('chat')} Talk to ${site.advisor}</a>
          </div>
        </div>
      </nav>
    </div>
  </header>`;

const draftBanner = () =>
  site.draft
    ? html`<aside class="draft-banner" aria-label="Preview notice">
        <div class="container">
          <strong>Preview.</strong> Details marked <span class="tbc tbc--inline"><span aria-hidden="true">●</span> To confirm</span> are waiting on Poonam, and online enquiries aren’t open yet.
        </div>
      </aside>`
    : '';

const footer = (depth) => {
  const c = contactLinks();
  const year = new Date().getFullYear();
  const featured = courses.filter((x) => x.popular).slice(0, 6);
  return html`
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          ${logo(depth)}
          <p>Friendly, honest course guidance from ${site.advisor}. We help you choose a nationally recognised course and the right way to get it.</p>
        </div>

        <div>
          <h2 class="site-footer__heading">Explore</h2>
          <ul role="list">
            ${NAV.map((item) => `<li><a href="${link(depth, item.href)}">${item.label}</a></li>`)}
            <li><a href="${link(depth, 'faq.html')}">FAQ</a></li>
            <li><a href="${link(depth, 'eligibility.html')}">Eligibility check</a></li>
          </ul>
        </div>

        <div>
          <h2 class="site-footer__heading">Popular courses</h2>
          <ul role="list">
            ${featured.map((x) => `<li><a href="${link(depth, `course/${x.slug}.html`)}">${esc(x.title)}</a></li>`)}
          </ul>
        </div>

        <div>
          <h2 class="site-footer__heading">Get in touch</h2>
          <ul role="list" class="site-footer__contact">
            <li>${icon('phone')}<span>${c.phone ? `<a href="${c.phone.href}">${esc(c.phone.label)}</a>` : placeholder('Phone number coming soon')}</span></li>
            <li>${icon('mail')}<span>${c.email ? `<a href="${c.email.href}">${esc(c.email.label)}</a>` : placeholder('Email address coming soon')}</span></li>
            ${c.whatsapp ? `<li>${icon('chat')}<span><a href="${c.whatsapp.href}">${c.whatsapp.label}</a></span></li>` : ''}
            <li>${icon('pin')}<span>${site.contact.serviceArea ? esc(site.contact.serviceArea) : placeholder('Service area to be added')}</span></li>
          </ul>
        </div>
      </div>

      <div class="site-footer__legal">
        <p class="site-footer__disclaimer">
          ${site.name} is a course advisory service, not a Registered Training Organisation (RTO).
          Nationally recognised qualifications are delivered, assessed and issued by our partner RTOs, which are named before you enrol.${tbc('Confirm partner RTO arrangements and add their names and RTO codes')}
          You can check any course or RTO at <a href="https://training.gov.au" rel="noopener">training.gov.au</a>.
        </p>
        <div class="site-footer__bottom">
          <p>© ${year} ${esc(site.business.legalName ?? site.name)}${site.business.abn ? ` · ABN ${esc(site.business.abn)}` : ''}</p>
          <ul role="list">
            <li><a href="${link(depth, 'privacy.html')}">Privacy</a></li>
            <li><a href="${link(depth, 'contact.html')}">Contact</a></li>
          </ul>
          <a class="powered" href="https://jobgen.ai" rel="noopener">Powered by <strong>JobGen</strong></a>
        </div>
      </div>
    </div>
  </footer>`;
};

// Settings the browser script needs (form endpoint, fallback contacts).
const clientConfig = () =>
  JSON.stringify({
    endpoint: site.forms.endpoint || '',
    extraFields: site.forms.extraFields || {},
    draft: site.draft,
    advisor: site.advisor,
    phone: site.contact.phone,
    email: site.contact.email,
    whatsapp: site.contact.whatsapp,
  }).replace(/</g, '\\u003c');

export const layout = ({ title, description, path, depth = 0, active = '', body, bodyClass = '', head = '' }) => {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} – ${site.tagline}`;
  const canonical = `${site.url}/${path === 'index.html' ? '' : path}`;
  return html`<!doctype html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(canonical)}">
  <meta name="theme-color" content="#0e5e63">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(site.url)}/assets/img/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  ${site.draft ? '<meta name="robots" content="noindex">' : ''}
  <link rel="icon" href="${link(depth, 'assets/img/favicon.svg')}" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${link(depth, 'assets/img/apple-touch-icon.png')}">
  <link rel="preload" href="${link(depth, 'assets/fonts/figtree-var-latin.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${link(depth, 'assets/fonts/fraunces-600-latin.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${link(depth, 'assets/css/styles.css')}">
  <script>document.documentElement.classList.add('js')</script>
  <script id="site-config" type="application/json">${clientConfig()}</script>
  <script src="${link(depth, 'assets/js/main.js')}" defer></script>
  ${head}
</head>
<body class="${bodyClass}">
  <a class="skip-link" href="#main">Skip to main content</a>
  ${draftBanner()}
  ${header(depth, active)}
  <main id="main" tabindex="-1">
${body}
  </main>
  ${footer(depth)}
</body>
</html>
`;
};

