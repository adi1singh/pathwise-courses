import { shortCourses, shortCategories, formats } from '../data/short-courses.js';
import { courses } from '../data/courses.js';
import { html, icon, esc, tbc } from '../templates/helpers.js';
import { pageHero, courseCard, ctaBand } from '../templates/components.js';

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
            ${shortCategories.map((c) => `<button type="button" class="filter-chip" aria-pressed="false" data-value="${c.id}">${esc(c.name)}</button>`)}
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
          (s) => html`<article class="short-card" data-course-card data-category="${s.category}" data-format="${s.format}" data-search="${esc(`${s.title} ${s.summary} ${catName[s.category]}`.toLowerCase())}" aria-labelledby="s-${s.id}">
            <p class="short-card__cat">${esc(catName[s.category])}</p>
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

  <section class="section section--sand" aria-labelledby="teams-title">
    <div class="container">
      <div class="teams">
        <div class="teams__icon">${icon('users')}</div>
        <div>
          <p class="eyebrow">For employers</p>
          <h2 id="teams-title">Training a team?</h2>
          <p class="lead">Whether you need induction training for new support workers, refreshers for your whole team, or RPL for experienced staff, Poonam can put together a plan that fits your roster.</p>
        </div>
        <a class="btn btn--primary" href="contact.html?topic=team">Enquire about team training ${icon('arrow-right')}</a>
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
