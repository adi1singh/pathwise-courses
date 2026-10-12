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

export const courseCard = (c, depth, { compare = false } = {}) => {
  const level = levelById[c.level].name;
  const href = link(depth, `course/${c.slug}.html`);
  const titleId = `t-${c.code.toLowerCase()}`;
  return html`
  <article class="course-card" data-course-card data-code="${c.code}" data-sector="${c.sector}" data-level="${c.level}" data-pathways="${c.pathways.join(' ')}" data-search="${esc(`${c.code} ${c.title} ${c.summary} ${c.roles.join(' ')}`.toLowerCase())}" aria-labelledby="${titleId}">
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

export const ctaBand = (depth, { title = 'Not sure where to start?', text = 'Tell Poonam a little about your work and goals. She’ll suggest a course and the most sensible way to get it – with no pressure to enrol.', course } = {}) => {
  const q = course ? `?course=${encodeURIComponent(course)}` : '';
  return html`
  <section class="section">
    <div class="container">
      <div class="cta-band">
        <div class="cta-band__text">
          <h2>${title}</h2>
          <p>${text}</p>
        </div>
        <div class="btn-row">
          <a class="btn btn--primary btn--lg" href="${link(depth, `eligibility.html${q}`)}">Check my eligibility ${icon('arrow-right')}</a>
          <a class="btn btn--secondary btn--lg" href="${link(depth, `contact.html${q}`)}">${icon('chat')} Talk to Poonam</a>
        </div>
      </div>
    </div>
  </section>`;
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

export const formNotConnected = () =>
  site.forms.endpoint
    ? ''
    : html`<div class="notice notice--warn" role="note">
        ${icon('info')}
        <div>
          <p><strong>Online forms are being set up.</strong> Until then, submitting this form will not send your details to Poonam – please use the phone, WhatsApp or email options instead.</p>
          ${site.draft ? `<p class="notice__dev">Site owner: add a form endpoint in <code>src/data/site.js</code> (<code>forms.endpoint</code>). See “Connecting the forms” in the README.</p>` : ''}
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
