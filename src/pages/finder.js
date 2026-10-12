import { site } from '../data/site.js';
import { courses, sectorById, levelById } from '../data/courses.js';
import { questions, interests, stepUpCourses } from '../data/finder.js';
import { html, link, icon, esc, tbc } from '../templates/helpers.js';
import { breadcrumbs } from '../templates/components.js';

// Everything the browser needs to suggest courses, taken from courses.js.
const finderData = () =>
  JSON.stringify({
    questions,
    interests: Object.fromEntries(interests.map((i) => [i.id, { label: i.label, phrase: i.phrase, courses: i.courses }])),
    stepUp: stepUpCourses,
    courses: Object.fromEntries(
      courses.map((c) => [
        c.code,
        {
          code: c.code,
          title: c.title,
          sector: c.sector,
          area: sectorById[c.sector].name,
          level: c.level,
          levelName: levelById[c.level].name,
          unit: !!c.unit,
          pathways: c.pathways,
          study: c.duration.study,
          rpl: c.duration.rpl ?? null,
          placement: c.placement,
          roles: c.roles,
          summary: c.summary,
          href: `course/${c.slug}.html`,
        },
      ])
    ),
  }).replace(/</g, '\\u003c');

export default function finder() {
  const d = 0;
  const body = html`
  <section class="page-hero page-hero--compact">
    <div class="container">
      ${breadcrumbs([{ label: 'Find my course' }], d)}
      <h1>Find my course</h1>
      <p class="lead">Four quick questions. You’ll see suggested courses, and why they may fit, before we ask for any contact details.</p>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container finder-layout">
      <div class="finder" data-finder>
        <noscript>
          <div class="notice notice--info">${icon('info')}<p>The course finder needs JavaScript. You can still <a href="courses.html">browse all courses</a> or <a href="contact.html">talk to ${site.advisor}</a>.</p></div>
        </noscript>

        <form class="finder__form" data-finder-form novalidate aria-labelledby="finder-progress-label">
          <div class="finder__progress">
            <p class="finder__count" id="finder-progress-label" data-finder-count aria-live="polite">Question 1 of ${questions.length}</p>
            <ol class="finder-track" role="list" aria-hidden="true">
              ${questions.map((q, i) => `<li class="finder-track__stop${i === 0 ? ' is-current' : ''}" data-track="${q.id}"><span></span></li>`)}
            </ol>
          </div>

          ${questions.map(
            (q, i) => html`<fieldset class="finder-q" data-q="${q.id}"${i > 0 ? ' hidden' : ''}>
              <legend class="finder-q__legend"><span class="finder-q__title" tabindex="-1" data-q-title>${esc(q.title)}</span></legend>
              <p class="finder-q__hint">${esc(q.hint)}</p>
              <div class="option-grid${q.options.length > 5 ? ' option-grid--wide' : ''}">
                ${q.options.map(
                  (o) => html`<label class="option option--finder">
                    <input type="radio" name="${q.id}" value="${esc(o.id)}">
                    <span><strong>${esc(o.label)}</strong>${o.hint ? `<small>${esc(o.hint)}</small>` : ''}</span>
                  </label>`
                )}
              </div>
            </fieldset>`
          )}

          <p class="form-error" data-finder-error role="alert" hidden>Choose an answer to continue.</p>
          <div class="finder__nav">
            <button class="btn btn--secondary" type="button" data-finder-back hidden>${icon('arrow-left')} Back</button>
            <button class="btn btn--primary btn--lg" type="submit" data-finder-next>Next ${icon('arrow-right')}</button>
          </div>
        </form>

        <div class="finder-results" data-finder-results tabindex="-1" hidden></div>
      </div>

      <aside class="finder-aside" aria-label="How suggestions work">
        <div class="card card--soft">
          <h2 class="h4">${icon('info')} How suggestions work</h2>
          <p>Suggestions use only the course information on this site: each course’s level, study options, typical timeframes and the jobs it can lead to.</p>
          <p>They’re a starting point, not an eligibility decision. The training provider confirms entry requirements, and ${site.advisor} checks them with you.${tbc('Typical timeframes – confirm with partner RTOs')}</p>
        </div>
        <div class="card finder-aside__talk">
          <h2 class="h4">Rather talk it through?</h2>
          <p>${site.advisor} can help you choose in a short conversation.</p>
          <a class="btn btn--secondary btn--block" href="contact.html">${icon('chat')} Talk to ${site.advisor}</a>
        </div>
      </aside>
    </div>
  </section>
  <script id="finder-data" type="application/json">${finderData()}</script>
  `;

  return {
    path: 'course-finder.html',
    title: 'Find my course',
    active: 'finder',
    description: `Answer four quick questions about your interests, experience and goals to see suggested courses and study pathways, with reasons, before sharing any contact details.`,
    head: `<script src="${link(d, 'assets/js/finder.js')}" defer></script>`,
    body,
  };
}
