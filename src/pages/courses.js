import { courses, sectors, levels, levelById, sectorById, pathways } from '../data/courses.js';
import { html, icon, esc } from '../templates/helpers.js';
import { courseCard, pageHero, ctaBand } from '../templates/components.js';

// Data the compare dialog needs, embedded so the page works without extra requests.
const compareData = () =>
  JSON.stringify(
    Object.fromEntries(
      courses.map((c) => [
        c.code,
        {
          code: c.code,
          title: c.title,
          href: `course/${c.slug}.html`,
          sector: sectorById[c.sector].name,
          level: levelById[c.level].name,
          suits: c.suits[0],
          study: c.unit ? 'Online learning + practical assessment' : c.duration.study,
          rpl: c.pathways.includes('rpl') ? c.duration.rpl : 'Not usually offered',
          placement: c.placement.detail,
          roles: c.roles.slice(0, 3).join(', '),
          ways: c.pathways.map((p) => pathways[p]).join(' · '),
        },
      ])
    )
  ).replace(/</g, '\\u003c');

export default function coursesPage() {
  const d = 0;
  const qualCount = courses.filter((c) => !c.unit).length;
  const unitCount = courses.length - qualCount;

  const body = html`
  ${pageHero({
    eyebrow: `${qualCount} qualifications · ${unitCount} first aid units`,
    title: 'Find your course',
    lead: 'Filter by area or level, then compare up to three courses side by side. Every course can be discussed with Poonam before you decide.',
    crumbs: [{ label: 'Courses' }],
    depth: d,
  })}

  <section class="section section--tight">
    <div class="container">
      <form class="filters" data-filters="courses" role="search" aria-label="Filter courses" onsubmit="return false">
        <div class="filters__search">
          <label for="course-search" class="visually-hidden">Search courses</label>
          ${icon('search')}
          <input id="course-search" type="search" name="q" placeholder="Search by job, course name or code" autocomplete="off" data-filter-search>
        </div>

        <fieldset class="filters__group">
          <legend class="filters__legend">Area</legend>
          <div class="chip-row" data-filter-chips="sector">
            <button type="button" class="filter-chip" aria-pressed="true" data-value="">All areas</button>
            ${sectors.map((s) => `<button type="button" class="filter-chip" aria-pressed="false" data-value="${s.id}">${icon(s.icon)}${esc(s.short)}</button>`)}
          </div>
        </fieldset>

        <div class="filters__row">
          <div class="filters__field">
            <label for="level-filter" class="filters__legend">Level</label>
            <select id="level-filter" data-filter-select="level">
              <option value="">Any level</option>
              ${levels.map((l) => `<option value="${l.id}">${l.name}</option>`)}
            </select>
          </div>
          <label class="switch">
            <input type="checkbox" data-filter-toggle="rpl">
            <span class="switch__track" aria-hidden="true"></span>
            <span>RPL available</span>
          </label>
          <button type="button" class="btn btn--text" data-filter-reset hidden>${icon('x')} Clear filters</button>
        </div>
      </form>

      <h2 class="visually-hidden">Course list</h2>
      <p class="results-count" data-results-count aria-live="polite">Showing all ${courses.length} courses</p>

      <div class="course-grid" data-results>
        ${courses.map((c) => courseCard(c, d, { compare: true }))}
      </div>

      <div class="empty-state" data-empty hidden>
        <h2>No courses match those filters</h2>
        <p>Try removing a filter – or ask Poonam. If the course you want isn’t listed, she may still be able to help.</p>
        <div class="btn-row btn-row--center">
          <button type="button" class="btn btn--secondary" data-filter-reset>Clear filters</button>
          <a class="btn btn--primary" href="contact.html">Ask Poonam</a>
        </div>
      </div>

      <div class="hint-card">
        ${icon('compass')}
        <div>
          <h2 class="hint-card__title">Not sure which pathway suits you?</h2>
          <p>Answer three quick questions to see whether RPL, online study or a short course is the best fit.</p>
        </div>
        <a class="btn btn--secondary" href="ways-to-study.html#quiz">Take the pathway check</a>
      </div>
    </div>
  </section>

  <div class="compare-tray" data-compare-tray hidden>
    <div class="container compare-tray__inner">
      <p class="compare-tray__label"><strong data-compare-count>0</strong> of 3 selected</p>
      <ul class="compare-tray__list" role="list" data-compare-list></ul>
      <div class="compare-tray__actions">
        <button type="button" class="btn btn--text" data-compare-clear>Clear</button>
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
    <p class="compare-dialog__note">Durations are typical. The training provider confirms exact timeframes, placement hours and entry requirements before you enrol.</p>
  </dialog>
  <script id="compare-data" type="application/json">${compareData()}</script>

  ${ctaBand(d, { title: 'Can’t decide between two courses?', text: 'Poonam can talk you through the differences in job options, study time and entry requirements – usually in about 15 minutes.' })}
  `;

  return {
    path: 'courses.html',
    title: 'Find your course',
    active: 'courses',
    description: 'Browse and compare nationally recognised courses in community care, disability, aged care, early childhood, training and assessment, leadership, WHS, building and first aid.',
    bodyClass: 'has-compare',
    body,
  };
}
