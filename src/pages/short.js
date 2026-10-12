import { shortCourses, shortCategories, formats } from '../data/short-courses.js';
import { courses } from '../data/courses.js';
import { html, icon, esc, tbc } from '../templates/helpers.js';
import { pageHero, courseCard, ctaBand, photo } from '../templates/components.js';

const TOPIC_ICON = { clinical: 'heart', ndis: 'users', mental: 'chat', safety: 'shield', workplace: 'briefcase' };

export default function shortPage() {
  const d = 0;
  const catName = Object.fromEntries(shortCategories.map((c) => [c.id, c.name]));
  const firstAid = courses.filter((c) => c.sector === 'firstaid');

  const body = html`
  ${pageHero({
    eyebrow: 'Short courses',
    title: 'Short courses for care and support workers',
    lead: 'Focused online courses to build a specific skill, refresh your knowledge or meet a workplace training requirement – completed at your own pace.',
    crumbs: [{ label: 'Short courses' }],
    depth: d,
    media: { file: 'courses/chc33021', alt: 'A care worker chatting with older people around a table', badge: `${icon('zap')} Learn one skill, fast` },
    stats: [[shortCourses.length, 'short courses'], [shortCategories.length, 'topic areas'], ['1–20 h', 'to complete']],
  })}

  <section class="section section--tight">
    <div class="container">
      <div class="notice notice--info notice--wide">
        ${icon('info')}
        <p><strong>Good to know:</strong> short courses are professional development (CPD). You receive a certificate of completion, but they are not nationally recognised qualifications. Course list, formats and prices are being finalised. ${tbc('Confirm which short courses Poonam offers, who delivers them, prices and durations')}</p>
      </div>

      <form class="filters" data-filters="short" role="search" aria-label="Filter short courses" onsubmit="return false">
        <div class="filters__search">
          <label for="short-search" class="visually-hidden">Search short courses</label>
          ${icon('search')}
          <input id="short-search" type="search" placeholder="Search topics, e.g. dementia" autocomplete="off" data-filter-search>
        </div>
        <fieldset class="filters__group">
          <legend class="filters__legend">Topic</legend>
          <div class="chip-row" data-filter-chips="category">
            <button type="button" class="filter-chip" aria-pressed="true" data-value="">All topics</button>
            ${shortCategories.map((c) => `<button type="button" class="filter-chip filter-chip--topic" aria-pressed="false" data-value="${c.id}" data-label="${esc(c.name)}">${icon(TOPIC_ICON[c.id])}${esc(c.name)}<span class="filter-chip__count">${shortCourses.filter((x) => x.category === c.id).length}</span></button>`)}
          </div>
        </fieldset>
        <div class="filters__row">
          <div class="filters__field">
            <label for="format-filter" class="filters__legend">Length</label>
            <select id="format-filter" data-filter-select="format">
              <option value="">Any length</option>
              ${Object.entries(formats).map(([id, f]) => `<option value="${id}">${f.name} (${f.time.toLowerCase()})</option>`)}
            </select>
          </div>
          <button type="button" class="btn btn--text" data-filter-reset hidden>${icon('x')} Clear filters</button>
        </div>
      </form>

      <h2 class="visually-hidden">Short course list</h2>
      <p class="results-count" data-results-count aria-live="polite">Showing all ${shortCourses.length} short courses</p>

      <div class="short-grid" data-results>
        ${shortCourses.map(
          (s) => html`<article class="short-card short-card--${s.category}" data-course-card data-category="${s.category}" data-format="${s.format}" data-search="${esc(`${s.title} ${s.summary} ${catName[s.category]}`.toLowerCase())}" aria-labelledby="s-${s.id}">
            <p class="short-card__cat"><span class="short-card__icon">${icon(TOPIC_ICON[s.category])}</span>${esc(catName[s.category])}</p>
            <h3 id="s-${s.id}">${esc(s.title)}</h3>
            <p>${esc(s.summary)}</p>
            <div class="short-card__foot">
              <span class="short-card__format">${icon(s.format === 'quick' ? 'zap' : 'book')}${formats[s.format].name} · ${formats[s.format].time.toLowerCase()}</span>
              <span class="short-card__price">Price on enquiry</span>
            </div>
            <a class="link-arrow" href="contact.html?topic=short-course&amp;course=${encodeURIComponent(s.title)}" aria-describedby="s-${s.id}">Enquire ${icon('arrow-right')}</a>
          </article>`
        )}
      </div>

      <div class="empty-state" data-empty hidden>
        <h2>No short courses match</h2>
        <p>Try a different word or topic – or tell Poonam what you need.</p>
        <div class="btn-row btn-row--center">
          <button type="button" class="btn btn--secondary" data-filter-reset>Clear filters</button>
          <a class="btn btn--primary" href="contact.html?topic=short-course">Ask Poonam</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="teams-title">
    <div class="container">
      <div class="teams-band">
        <div class="teams-band__text">
          <p class="eyebrow eyebrow--on-dark">For employers</p>
          <h2 id="teams-title">Training a <em>whole team?</em></h2>
          <p class="lead">Induction training for new support workers, refreshers for everyone, or RPL for experienced staff: ${'Poonam'} can put together a plan that fits your roster.</p>
          <ul class="teams-band__list" role="list">
            <li>${icon('check')} Bundles across topics</li>
            <li>${icon('check')} Online, at each person’s pace</li>
            <li>${icon('check')} RPL for experienced staff</li>
          </ul>
          <div class="btn-row"><a class="btn btn--sun btn--lg" href="contact.html?topic=team">Enquire about team training ${icon('arrow-right')}</a></div>
        </div>
        <div class="teams-band__media">${photo('areas/business', d, { sizes: '(min-width: 900px) 480px, 92vw' })}</div>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="fa-title">
    <div class="container">
      <div class="section-head section-head--row">
        <div>
          <p class="eyebrow">Nationally recognised</p>
          <h2 id="fa-title">First aid and CPR</h2>
          <p class="lead">Short, accredited units that many care, education and community jobs require.</p>
        </div>
      </div>
      <div class="course-grid course-grid--2">${firstAid.map((c) => courseCard(c, d))}</div>
    </div>
  </section>

  ${ctaBand(d, { title: 'Looking for a full qualification?', text: 'If you want to move into a new role, a nationally recognised qualification may serve you better. Poonam can help you weigh it up.' })}
  `;

  return {
    path: 'short-courses.html',
    title: 'Short courses for care and support workers',
    active: 'short',
    description: 'Online short courses for care and disability support workers: medication support, dementia, infection control, behaviour support, mental health and more. Plus first aid and CPR.',
    body,
  };
}
