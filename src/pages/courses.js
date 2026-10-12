import { site } from '../data/site.js';
import { courses, sectors, levels, levelById, sectorById, pathways } from '../data/courses.js';
import { priceDetail, pricesCheckedOn } from '../data/prices.js';
import { html, icon, esc } from '../templates/helpers.js';
import { courseCard, breadcrumbs, ctaBand } from '../templates/components.js';

// Data the compare dialog needs, embedded so the page works without extra requests.
const compareData = () =>
  JSON.stringify(
    Object.fromEntries(
      courses.map((c) => [
        c.code,
        {
          code: c.code,
          title: c.title,
          short: `${c.short ?? c.title} (${levelById[c.level].name})`,
          href: `course/${c.slug}.html`,
          sector: sectorById[c.sector].name,
          level: levelById[c.level].name,
          suits: c.suits[0],
          study: c.unit ? 'Online learning + practical assessment' : c.duration.study,
          rpl: c.pathways.includes('rpl') ? c.duration.rpl : 'Not usually offered',
          placement: c.placement.detail,
          roles: c.roles.slice(0, 3).join(', '),
          ways: c.pathways.map((p) => pathways[p]).join(' · '),
          price: (() => { const p = priceDetail(c); return c.fees || (p?.study ? `${p.study}${p.rpl ? ` (RPL ${p.rpl})` : ''}` : 'Ask for a quote'); })(),
        },
      ])
    )
  ).replace(/</g, '\\u003c');

export default function coursesPage() {
  const d = 0;
  const qualCount = courses.filter((c) => !c.unit).length;
  const unitCount = courses.length - qualCount;

  const body = html`
  <section class="page-hero page-hero--compact">
    <div class="container">
      ${breadcrumbs([{ label: 'Courses' }], d)}
      <h1>Courses</h1>
      <p class="lead">${qualCount} qualifications and ${unitCount} first aid units. Search, filter, then compare up to three side by side.</p>
    </div>
  </section>

  <section class="section section--catalogue">
    <div class="container">
      <form class="filters" data-filters="courses" role="search" aria-label="Search and filter courses" onsubmit="return false">
        <div class="filters__top">
          <div class="filters__search">
            <label for="course-search" class="visually-hidden">Search courses</label>
            ${icon('search')}
            <input id="course-search" type="search" name="q" placeholder="Search, e.g. childcare" autocomplete="off" enterkeyhint="search" data-filter-search>
          </div>
          <button type="button" class="btn btn--secondary filters__toggle" aria-expanded="false" aria-controls="more-filters" data-filters-toggle>
            ${icon('sliders')} Filters <span class="filters__badge" data-filters-badge hidden></span>
          </button>
        </div>

        <div class="filters__group" role="group" aria-labelledby="area-label">
          <p class="filters__legend" id="area-label">Area</p>
          <div class="chip-row chip-row--scroll" data-filter-chips="sector">
            <button type="button" class="filter-chip" aria-pressed="true" data-value="">All</button>
            ${sectors.map((s) => `<button type="button" class="filter-chip" aria-pressed="false" data-value="${s.id}" data-label="${esc(s.name)}">${icon(s.icon)}${esc(s.short)}</button>`)}
          </div>
        </div>

        <div class="filters__more" id="more-filters" data-filters-more>
          <div class="filters__field">
            <label for="level-filter" class="filters__legend">Level</label>
            <select id="level-filter" data-filter-select="level">
              <option value="">Any level</option>
              ${levels.map((l) => `<option value="${l.id}">${l.name}</option>`)}
            </select>
          </div>
          <label class="switch">
            <input type="checkbox" data-filter-toggle="rpl" data-label="RPL available">
            <span class="switch__track" aria-hidden="true"></span>
            <span>Only show courses with RPL</span>
          </label>
        </div>
      </form>

      <div class="results-bar">
        <p class="results-count" data-results-count aria-live="polite">Showing all ${courses.length} courses</p>
        <div class="active-filters" data-active-filters hidden>
          <ul class="active-filters__list" role="list" data-active-list aria-label="Active filters"></ul>
          <button type="button" class="btn btn--text btn--sm" data-filter-reset>Clear all</button>
        </div>
      </div>

      <h2 class="visually-hidden">Course list</h2>
      <div class="course-grid" data-results>
        ${courses.map((c) => courseCard(c, d, { compare: true }))}
      </div>
      <p class="areas__note">Typical prices are full-fee ranges published by Australian training providers (${pricesCheckedOn}). They are not ${site.advisor}’s prices, and government funding can lower the cost in some states. Ask ${site.advisor} for an exact quote.</p>

      <div class="empty-state" data-empty hidden>
        <h2 class="h3-size">No courses match <span data-empty-query></span></h2>
        <p>Try a different word, or one of these:</p>
        <ul class="suggest-list" role="list">
          ${['aged care', 'childcare', 'disability', 'teacher aide', 'trainer', 'first aid', 'manager', 'builder'].map((t) => `<li><button type="button" class="pill-option pill-option--light" data-suggest="${t}">${t}</button></li>`)}
        </ul>
        <div class="btn-row btn-row--center">
          <button type="button" class="btn btn--secondary" data-filter-reset>Show all courses</button>
          <a class="btn btn--primary" href="course-finder.html">Use the course finder</a>
        </div>
        <p class="small muted">Looking for something we don’t list? <a href="contact.html">Ask Poonam</a> – she may still be able to help.</p>
      </div>

      <div class="hint-card">
        ${icon('compass')}
        <div>
          <h2 class="hint-card__title">Not sure where to start?</h2>
          <p>Answer four quick questions and see suggested courses, with reasons, before sharing any details.</p>
        </div>
        <a class="btn btn--primary" href="course-finder.html">Find my course</a>
      </div>
    </div>
  </section>

  <div class="compare-tray" data-compare-tray hidden>
    <div class="container compare-tray__inner">
      <p class="compare-tray__label"><strong data-compare-count>0</strong> of 3 selected <span class="compare-tray__hint" data-compare-hint hidden>· choose one more to compare</span></p>
      <ul class="compare-tray__list" role="list" data-compare-list aria-label="Courses to compare"></ul>
      <div class="compare-tray__actions">
        <button type="button" class="btn btn--text" data-compare-clear>Clear<span class="visually-hidden"> comparison</span></button>
        <button type="button" class="btn btn--primary" data-compare-open>${icon('compare')} Compare</button>
      </div>
    </div>
  </div>

  <dialog class="compare-dialog" data-compare-dialog aria-labelledby="compare-title">
    <div class="compare-dialog__head">
      <h2 id="compare-title">Compare courses</h2>
      <button type="button" class="icon-btn" data-compare-close aria-label="Close comparison">${icon('x')}</button>
    </div>
    <div class="compare-dialog__body" data-compare-body></div>
    <p class="compare-dialog__note">Durations and prices are typical. Prices are full-fee ranges published by Australian providers (${pricesCheckedOn}), not ${site.advisor}’s prices. The training provider confirms exact fees, timeframes, placement hours and entry requirements before you enrol.</p>
  </dialog>
  <script id="compare-data" type="application/json">${compareData()}</script>

  ${ctaBand(d, { title: 'Can’t decide between courses?', text: 'Poonam can talk you through the differences in job options, study time and entry requirements.' })}
  `;

  return {
    path: 'courses.html',
    title: 'Courses',
    active: 'courses',
    description: 'Browse and compare nationally recognised courses in community care, disability, aged care, early childhood, training and assessment, leadership, WHS, building and first aid.',
    bodyClass: 'has-compare',
    body,
  };
}
