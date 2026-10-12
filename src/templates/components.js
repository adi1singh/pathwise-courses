import { site } from '../data/site.js';
import { sectorById, levelById, pathways, courses } from '../data/courses.js';
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
// counts for more than a word buried in the description.
const searchAttrs = (c) =>
  [
    ['title', `${c.title} ${c.short ?? ''}`],
    ['keywords', `${c.keywords ?? ''} ${sectorById[c.sector].name}`],
    ['roles', c.roles.join(' | ')],
    ['text', `${c.summary} ${c.topics.join(' ')} ${c.suits.join(' ')}`],
  ]
    .map(([k, v]) => `data-s-${k}="${esc(v.toLowerCase())}"`)
    .join(' ');

export const courseCard = (c, depth, { compare = false } = {}) => {
  const level = levelById[c.level].name;
  const href = link(depth, `course/${c.slug}.html`);
  const titleId = `t-${c.code.toLowerCase()}`;
  return html`
  <article class="course-card" data-course-card data-code="${c.code}" data-sector="${c.sector}" data-level="${c.level}" data-pathways="${c.pathways.join(' ')}" ${searchAttrs(c)} aria-labelledby="${titleId}">
    <div class="course-card__top">
      ${sectorChip(c.sector)}
      <span class="course-card__code">${c.code}</span>
    </div>
    <h3 class="course-card__title" id="${titleId}"><a href="${href}">${esc(c.title)}</a></h3>
    <p class="course-card__summary">${esc(c.summary)}</p>
    <dl class="course-card__meta">
      <div><dt>Level</dt><dd>${level}</dd></div>
      <div><dt>${c.unit ? 'Format' : 'Typical study time'}</dt><dd>${esc(c.unit ? 'Online + practical' : c.duration.study)}</dd></div>
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
  </article>`;
};

export const sectionHead = ({ eyebrow, title, lead, id, align = '' }) => html`
  <div class="section-head${align ? ` section-head--${align}` : ''}">
    ${eyebrow && `<p class="eyebrow">${eyebrow}</p>`}
    <h2${id ? ` id="${id}"` : ''}>${title}</h2>
    ${lead && `<p class="lead">${lead}</p>`}
  </div>`;

export const pageHero = ({ eyebrow, title, lead, crumbs = [], depth = 0, aside = '', actions = '' }) => html`
  <section class="page-hero">
    <div class="container page-hero__inner${aside ? ' page-hero__inner--split' : ''}">
      <div>
        ${crumbs.length ? breadcrumbs(crumbs, depth) : ''}
        ${eyebrow && `<p class="eyebrow">${eyebrow}</p>`}
        <h1>${title}</h1>
        ${lead && `<p class="lead">${lead}</p>`}
        ${actions && `<div class="btn-row">${actions}</div>`}
      </div>
      ${aside}
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
    ? `<img src="${link(depth, site.advisorPhoto)}" alt="" width="96" height="96" loading="lazy">`
    : `<span class="avatar__initial">${site.advisor[0]}</span>`;

// Decorative winding path used as the Pathwise journey motif.
export const journeyPath = (cls = '') =>
  `<svg class="journey-path ${cls}" viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M4 196C120 196 132 108 236 108S352 30 456 30 560 18 596 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="2 9"/></svg>`;

// Photo card for a course area. Images are Unsplash-licensed; see CREDITS.md.
export const areaCard = (s, count, depth) => html`
  <a class="area-card" href="${link(depth, `courses.html?sector=${s.id}`)}">
    <span class="area-card__media">
      <img src="${link(depth, `assets/img/areas/${s.image.file}-480.webp`)}" srcset="${link(depth, `assets/img/areas/${s.image.file}-480.webp`)} 480w, ${link(depth, `assets/img/areas/${s.image.file}-800.webp`)} 800w" sizes="(min-width: 1000px) 360px, (min-width: 640px) 45vw, 48vw" width="480" height="360" alt="${esc(s.image.alt)}" loading="lazy" decoding="async">
    </span>
    <span class="area-card__body">
      <span class="area-card__name">${esc(s.name)}</span>
      <span class="area-card__blurb">${esc(s.blurb)}</span>
      <span class="area-card__count">${count} ${count === 1 ? 'course' : 'courses'} ${icon('arrow-right')}</span>
    </span>
  </a>`;

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
