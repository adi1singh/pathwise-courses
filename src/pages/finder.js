import { site } from '../data/site.js';
import { courses, sectorById, levelById } from '../data/courses.js';
import { questions, interests, stepUpCourses } from '../data/finder.js';
import { html, link, icon, esc, tbc } from '../templates/helpers.js';
import { breadcrumbs, photo } from '../templates/components.js';

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
  const KEYS = 'ABCDEFGHI';
  const reel = ['courses/chc30125', 'courses/chc43121', 'areas/training', 'courses/chc40225', 'areas/construction', 'courses/chc52025', 'courses/hltaid011', 'areas/business', 'courses/chc50225', 'courses/chc33021', 'ways/online', 'courses/chc51015'];
  const col = (files) => [...files, ...files].map((f) => `<span class="reel__tile">${photo(f, d, { sizes: '220px' })}</span>`).join('');
  const body = html`
  <section class="finder-hero">
    <div class="container finder-hero__inner">
      <div class="finder-hero__text">
        ${breadcrumbs([{ label: 'Find my course' }], d)}
        <p class="eyebrow eyebrow--on-dark">4 questions · about a minute</p>
        <h1>Find the course that fits you.</h1>
        <p class="lead">Tell us what interests you and where you’re at. You’ll see suggested courses, and why they may fit, before we ask for any contact details.</p>
        <a class="btn btn--sun btn--lg" href="#finder-start">Start the questions ${icon('arrow-right')}</a>
        <p><a class="powered" href="https://jobgen.ai" rel="noopener">Powered by <strong>JOBGEN.AI</strong></a></p>
      </div>
      <div class="reel" aria-hidden="true">
        <div class="reel__col">${col(reel.slice(0, 4))}</div>
        <div class="reel__col reel__col--down">${col(reel.slice(4, 8))}</div>
        <div class="reel__col">${col(reel.slice(8, 12))}</div>
      </div>
    </div>
  </section>

  <section class="section finder-section" id="finder-start">
    <div class="container finder-layout" data-finder-layout>
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
              <div class="choice-list${q.id === 'interest' ? ' choice-list--photos' : ''}">
                ${q.options.map(
                  (o, n) => html`<label class="choice${o.area ? ` acc-${o.area}` : ''}"${o.img ? ` data-preview-for="${esc(o.id)}"` : ''}>
                    <input type="radio" name="${q.id}" value="${esc(o.id)}">
                    <span class="choice__body">
                      <span class="choice__key" aria-hidden="true">${KEYS[n]}</span>
                      ${o.img ? `<span class="choice__thumb">${photo(o.img, d, { sizes: '64px' })}</span>` : ''}
                      <span class="choice__text"><strong>${esc(o.label)}</strong>${o.hint ? `<small>${esc(o.hint)}</small>` : ''}</span>
                      ${icon('arrow-right', 'choice__arrow')}
                    </span>
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

      <aside class="finder-side" aria-label="How suggestions work">
        <div class="preview" data-finder-preview aria-hidden="true">
          <div class="preview__frame">
            <div class="preview__start is-shown" data-preview="">
              <span class="preview__mark">${icon('compass')}</span>
              <p>Your next step <em>starts here.</em></p>
            </div>
            ${interests.map((i) => `<div class="preview__slide${i.area ? ` acc-${i.area}` : ''}" data-preview="${i.id}">${photo(i.img, d, { sizes: '(min-width: 1000px) 420px, 1px' })}<span class="preview__chip">${esc(i.label)}</span></div>`)}
          </div>
          <ul class="preview__answers" role="list" data-preview-answers hidden></ul>
        </div>
        <div class="finder-note">
          <h2 class="h4">${icon('info')} How suggestions work</h2>
          <p>Suggestions use only the course information on this site: each course’s level, study options, typical timeframes and the jobs it can lead to. They’re a starting point, not an eligibility decision: the training provider confirms entry requirements, and ${site.advisor} checks them with you.${tbc('Typical timeframes – confirm with partner RTOs')}</p>
          <a class="link-arrow" href="contact.html">Rather talk it through? Ask ${site.advisor} ${icon('arrow-right')}</a>
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
