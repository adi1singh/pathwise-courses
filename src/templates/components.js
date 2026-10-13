import { site } from '../data/site.js';
import { sectorById, levelById, pathways, courses } from '../data/courses.js';
import { money, priceRange, priceFrom } from '../data/prices.js';
import { esc, html, link, icon, tbc, contactLinks, placeholder } from './helpers.js';

export const sectorChip = (sectorId) => {
  const s = sectorById[sectorId];
  return `<span class="chip chip--${s.id}">${icon(s.icon)}${esc(s.short)}</span>`;
};

const pathwayBadges = (c) =>
  c.pathways
    .map((p) =>
      p === 'rpl'
        ? `<li class="badge badge--rpl" title="${pathways.rpl}">${icon('award')}RPL</li>`
        : p === 'online'
          ? `<li class="badge" title="${pathways.online}">${icon('laptop')}Study online</li>`
          : `<li class="badge" title="${pathways.practical}">${icon('cross')}Online + practical</li>`
    )
    .join('');

// Separate fields so the browser can rank results: a title or keyword match
// counts for more than a word buried in the description. The hero search on
// the home page uses the same fields.
export const searchFields = (c) => ({
  title: `${c.title} ${c.short ?? ''}`.toLowerCase(),
  keywords: `${c.keywords ?? ''} ${sectorById[c.sector].name}`.toLowerCase(),
  roles: c.roles.join(' | ').toLowerCase(),
  text: `${c.summary} ${c.topics.join(' ')} ${c.suits.join(' ')}`.toLowerCase(),
});
const searchAttrs = (c) =>
  Object.entries(searchFields(c))
    .map(([k, v]) => `data-s-${k}="${esc(v)}"`)
    .join(' ');

// Responsive <img> for a 4:3 photo saved at 480 and 800px wide.
export const photo = (file, depth, { alt = '', sizes = '(min-width: 1000px) 380px, (min-width: 640px) 45vw, 92vw', lazy = true, cls = '' } = {}) =>
  `<img${cls ? ` class="${cls}"` : ''} src="${link(depth, `assets/img/${file}-480.webp`)}" srcset="${link(depth, `assets/img/${file}-480.webp`)} 480w, ${link(depth, `assets/img/${file}-800.webp`)} 800w" sizes="${sizes}" width="480" height="360" alt="${esc(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ''}>`;

export const courseCard = (c, depth, { compare = false } = {}) => {
  const level = levelById[c.level].name;
  const href = link(depth, `course/${c.slug}.html`);
  const titleId = `t-${c.code.toLowerCase()}`;
  return html`
  <article class="course-card course-card--${c.sector}" data-course-card data-code="${c.code}" data-sector="${c.sector}" data-level="${c.level}" data-pathways="${c.pathways.join(' ')}" ${searchAttrs(c)} aria-labelledby="${titleId}">
    <div class="course-card__media">
      ${photo(c.image.file, depth)}
      ${sectorChip(c.sector)}
    </div>
    <div class="course-card__body">
      <p class="course-card__kicker"><span>${level}</span><span class="course-card__code">${c.code}</span></p>
      <h3 class="course-card__title" id="${titleId}"><a href="${href}">${esc(c.title)}</a></h3>
      <p class="course-card__summary">${esc(c.summary)}</p>
      <dl class="course-card__meta">
        <div><dt>${c.unit ? 'Format' : 'Study time'}</dt><dd>${esc(c.unit ? 'Online + practical' : c.duration.study)}</dd></div>
        <div><dt>Typical price</dt><dd>${priceRange(c)}</dd></div>
      </dl>
      <ul class="badge-list" role="list" aria-label="Ways to study">${pathwayBadges(c)}</ul>
      <div class="course-card__actions">
        <a class="link-arrow" href="${href}" aria-describedby="${titleId}">View course ${icon('arrow-right')}</a>
        ${compare
          ? html`<label class="compare-toggle">
              <input type="checkbox" data-compare value="${c.code}" aria-describedby="${titleId}">
              <span>Compare</span>
            </label>`
          : ''}
      </div>
    </div>
  </article>`;
};

export const sectionHead = ({ eyebrow, title, lead, id, align = '' }) => html`
  <div class="section-head${align ? ` section-head--${align}` : ''}">
    ${eyebrow && `<p class="eyebrow">${eyebrow}</p>`}
    <h2${id ? ` id="${id}"` : ''}>${title}</h2>
    ${lead && `<p class="lead">${lead}</p>`}
  </div>`;

export const pageHero = ({ eyebrow, title, lead, crumbs = [], depth = 0, aside = '', actions = '', media = null, stats = [] }) => html`
  <section class="page-hero${media ? ' page-hero--media' : ''}">
    <div class="container page-hero__inner${aside || media ? ' page-hero__inner--split' : ''}">
      <div class="page-hero__text">
        ${crumbs.length ? breadcrumbs(crumbs, depth) : ''}
        ${eyebrow && `<p class="eyebrow eyebrow--on-dark">${eyebrow}</p>`}
        <h1>${title}</h1>
        ${lead && `<p class="lead">${lead}</p>`}
        ${actions && `<div class="btn-row">${actions}</div>`}
        ${stats.length ? html`<ul class="hero-stats" role="list">${stats.map(([v, l]) => `<li><strong>${v}</strong><span>${l}</span></li>`)}</ul>` : ''}
      </div>
      ${media ? html`<figure class="page-hero__media">${photo(media.file, depth, { alt: media.alt ?? '', sizes: '(min-width: 900px) 440px, 92vw', lazy: false })}${media.badge ? `<figcaption class="page-hero__badge">${media.badge}</figcaption>` : ''}</figure>` : aside}
    </div>
  </section>`;

export const breadcrumbs = (crumbs, depth) => html`
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol role="list">
      <li><a href="${link(depth, 'index.html')}">Home</a></li>
      ${crumbs.map((c, i) =>
        i === crumbs.length - 1
          ? `<li><span aria-current="page">${esc(c.label)}</span></li>`
          : `<li><a href="${link(depth, c.href)}">${esc(c.label)}</a></li>`
      )}
    </ol>
  </nav>`;

export const steps = (items, { numbered = true } = {}) => html`
  <ol class="steps${numbered ? '' : ' steps--plain'}" role="list" data-cols="${items.length === 6 ? 3 : items.length}">
    ${items.map(
      (s, i) => html`<li class="step">
        <span class="step__num" aria-hidden="true">${numbered ? i + 1 : icon(s.icon ?? 'check')}</span>
        <div>
          <h3 class="step__title">${s.title}</h3>
          <p>${s.text}</p>
        </div>
      </li>`
    )}
  </ol>`;

export const checklist = (items, cls = '') =>
  `<ul class="checklist ${cls}" role="list">${items.map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('')}</ul>`;

export const faqList = (items) => html`
  <div class="faq-list">
    ${items.map(
      (f) => html`<details class="faq">
        <summary><span>${esc(f.q)}</span>${icon('plus', 'faq__icon')}</summary>
        <div class="faq__body"><p>${esc(f.a)}${f.confirm ? ' ' + tbc('Check this answer matches how Poonam works') : ''}</p></div>
      </details>`
    )}
  </div>`;

// What happens after someone gets in touch. Shown on the final invitation,
// beside both forms and after a successful submission.
export const afterEnquiry = () => [
  'You send a few details: the course you’re curious about and how to reach you.',
  `${site.advisor} reviews them and contacts you the way you prefer${site.responseTime ? `, ${site.responseTime}` : ''}.`,
  'You talk through your options. If you go ahead, she helps you enrol with the right training organisation.',
];

export const nextSteps = (cls = '') =>
  `<ol class="next-steps ${cls}" role="list">${afterEnquiry().map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`;

export const ctaBand = (depth, { title = 'Ready to talk it through?', text = `Tell ${site.advisor} a little about your work and goals. She’ll suggest courses that fit and the most sensible way to get there, with no pressure to enrol.`, course } = {}) => {
  const q = course ? `?course=${encodeURIComponent(course)}` : '';
  return html`
  <section class="section section--invite">
    <div class="container">
      <div class="invite">
        <div class="invite__text">
          <span class="avatar avatar--lg" aria-hidden="true">${advisorAvatar(depth)}</span>
          <h2>${title}</h2>
          <p class="lead">${text}${tbc('Confirm the first conversation is free and without obligation')}</p>
          <div class="btn-row">
            <a class="btn btn--primary btn--lg" href="${link(depth, `contact.html${q}`)}">${icon('chat')} Talk to ${site.advisor}</a>
            <a class="btn btn--secondary btn--lg" href="${link(depth, 'course-finder.html')}">Find my course</a>
          </div>
        </div>
        <div class="invite__steps">
          <h3 class="invite__steps-title">What happens next</h3>
          ${nextSteps()}
        </div>
      </div>
    </div>
  </section>`;
};

// Small round avatar: Poonam's photo when supplied, otherwise her initial.
export const advisorAvatar = (depth) =>
  site.advisorPhoto
    ? `<img src="${link(depth, `${site.advisorPhoto.avatar}-96.webp`)}" srcset="${link(depth, `${site.advisorPhoto.avatar}-96.webp`)} 1x, ${link(depth, `${site.advisorPhoto.avatar}-192.webp`)} 2x" alt="" width="96" height="96" loading="lazy" decoding="async">`
    : `<span class="avatar__initial">${site.advisor[0]}</span>`;

// Poonam's 4:5 portrait (or her initial on a designed background).
export const advisorPortrait = (depth, { sizes = '(min-width: 900px) 420px, 80vw', lazy = true } = {}) =>
  site.advisorPhoto
    ? `<img src="${link(depth, `${site.advisorPhoto.portrait}-480.webp`)}" srcset="${link(depth, `${site.advisorPhoto.portrait}-480.webp`)} 480w, ${link(depth, `${site.advisorPhoto.portrait}-800.webp`)} 800w" sizes="${sizes}" width="480" height="600" alt="${esc(site.advisor)}, course guide at ${esc(site.name)}"${lazy ? ' loading="lazy" decoding="async"' : ''}>`
    : `<span class="portrait__initial">${site.advisor[0]}</span>`;

// Decorative winding path used as the Pathwise journey motif.
export const journeyPath = (cls = '') =>
  `<svg class="journey-path ${cls}" viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M4 196C120 196 132 108 236 108S352 30 456 30 560 18 596 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="2 9"/></svg>`;

// Photo tile for a course area (bento grid on the home page).
export const areaCard = (s, list, depth) => {
  const from = Math.min(...list.map((c) => priceFrom(c)).filter(Boolean));
  return html`
  <a class="area-tile area-tile--${s.id}" style="--acc:var(--c-${s.id});--acc-ink:var(--c-${s.id}-ink)" href="${link(depth, `courses.html?sector=${s.id}`)}">
    ${photo(s.image.file, depth, { sizes: '(min-width: 960px) 40vw, 50vw' })}
    <span class="area-tile__body">
      <span class="area-tile__icon">${icon(s.icon)}</span>
      <span class="area-tile__name">${esc(s.name)}</span>
      <span class="area-tile__meta">${list.length} ${list.length === 1 ? 'course' : 'courses'}${Number.isFinite(from) ? ` · from ${money(from)}` : ''} ${icon('arrow-right')}</span>
    </span>
  </a>`;
};

// Phone / WhatsApp / email tiles. Missing details show a placeholder.
export const contactOptions = () => {
  const c = contactLinks();
  const tile = (ic, label, detail, linkObj, ph) => html`
    <li class="contact-tile">
      <span class="contact-tile__icon">${icon(ic)}</span>
      <div>
        <p class="contact-tile__label">${label}</p>
        ${linkObj ? `<a class="contact-tile__value" href="${linkObj.href}">${esc(detail ?? linkObj.label)}</a>` : `<p class="contact-tile__value">${placeholder(ph)}</p>`}
      </div>
    </li>`;
  return html`<ul class="contact-tiles" role="list">
    ${tile('phone', 'Call', null, c.phone, 'Phone number coming soon')}
    ${tile('chat', 'WhatsApp', 'Send a message', c.whatsapp, 'WhatsApp number coming soon')}
    ${tile('mail', 'Email', null, c.email, 'Email address coming soon')}
  </ul>`;
};

// Shown instead of a working form while no submission service is connected.
export const formUnavailable = () =>
  site.forms.endpoint
    ? ''
    : html`<div class="notice notice--warn form-unavailable" role="note">
        ${icon('info')}
        <div>
          <p><strong>Online enquiries aren’t open yet.</strong> This form can’t send messages at the moment, so it’s switched off for now.</p>
          <p>${contactLinks().phone || contactLinks().email ? `Please contact ${site.advisor} directly using the details on this page.` : `${site.advisor}’s phone, WhatsApp and email details will be added here soon.`}</p>
        </div>
      </div>`;

export const courseOptions = (selected = '') => {
  const groups = {};
  for (const c of courses) (groups[c.sector] ??= []).push(c);
  return html`
    <option value="">Not sure yet – help me choose</option>
    ${Object.entries(groups).map(
      ([sid, list]) => html`<optgroup label="${esc(sectorById[sid].name)}">
        ${list.map((c) => `<option value="${c.code}"${c.code === selected ? ' selected' : ''}>${esc(c.title)} (${c.code})</option>`)}
      </optgroup>`
    )}
    <option value="short-course">A short course (CPD)</option>
    <option value="other">Something else</option>`;
};

export const STATES = [
  ['ACT', 'Australian Capital Territory'],
  ['NSW', 'New South Wales'],
  ['NT', 'Northern Territory'],
  ['QLD', 'Queensland'],
  ['SA', 'South Australia'],
  ['TAS', 'Tasmania'],
  ['VIC', 'Victoria'],
  ['WA', 'Western Australia'],
  ['OS', 'Outside Australia'],
];
