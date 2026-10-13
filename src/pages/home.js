import { site } from '../data/site.js';
import { courses, sectors, levelById, courseByCode } from '../data/courses.js';
import { faqGroups } from '../data/faqs.js';
import { interests } from '../data/finder.js';
import { routes, experience } from '../data/pathway-map.js';
import { facts, careerLinks } from '../data/why.js';
import { priceFrom, pricesCheckedOn, typicalPrices, money } from '../data/prices.js';
import { html, link, icon, tbc, esc } from '../templates/helpers.js';
import { faqList, areaCard, advisorAvatar, advisorPortrait, searchFields } from '../templates/components.js';

const POPULAR = [
  ['Aged care', 'aged care'],
  ['Childcare', 'childcare'],
  ['Teacher aide', 'teacher aide'],
  ['Disability (NDIS)', 'disability'],
  ['Trainer (TAE)', 'tae'],
  ['First aid', 'first aid'],
];

// Course data for the hero search suggestions (same ranking fields as the
// course catalogue).
const searchData = (depth) =>
  JSON.stringify(
    courses.map((c) => ({
      code: c.code,
      title: c.title,
      level: levelById[c.level].name,
      href: link(depth, `course/${c.slug}.html`),
      img: link(depth, `assets/img/${c.image.file}-480.webp`),
      from: priceFrom(c),
      s: searchFields(c),
    }))
  ).replace(/</g, '\\u003c');

// Full-width video hero. Phones, reduced-motion and data-saver visitors get the
// still poster; the video is attached by script only on larger screens.
const hero = (d) => html`
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__media" aria-hidden="true">
      <img class="hero__poster" src="assets/video/hero-poster-768.webp" srcset="assets/video/hero-poster-768.webp 768w, assets/video/hero-poster.webp 1280w" sizes="100vw" width="1280" height="720" alt="" fetchpriority="high">
      <video class="hero__video" muted loop playsinline preload="none" data-hero-video data-src="assets/video/hero.mp4" data-src-webm="assets/video/hero.webm"></video>
    </div>
    <div class="container hero__inner">
      <div class="hero__text">
        <h1 id="hero-title">Find the course that <em>moves your career forward</em></h1>
        <p class="hero__lead">Search ${courses.length} nationally recognised courses, then talk it through with ${site.advisor}.</p>

        <form class="hero-search" action="courses.html" method="get" role="search" aria-label="Search courses" data-hero-search>
          <div class="hero-search__box">
            ${icon('search', 'hero-search__icon')}
            <label class="visually-hidden" for="hero-q">Search courses by job, topic or course name</label>
            <input class="hero-search__input" id="hero-q" name="q" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search"
              placeholder="Try “aged care” or “teacher aide”" data-hero-input
              data-typing-hints="aged care|childcare|teacher aide|NDIS disability support|Cert IV in Training and Assessment|first aid|counselling|team leader">
            <span class="hero-search__ghost" aria-hidden="true" data-hero-ghost></span>
            <button class="btn btn--sun hero-search__go" type="submit">Find courses</button>
          </div>
          <div class="hero-search__panel" id="hero-results-panel" hidden data-hero-panel>
            <ul class="hero-search__results" id="hero-results" role="listbox" aria-label="Suggested courses" data-hero-results></ul>
          </div>
          <p class="visually-hidden" aria-live="polite" data-hero-status></p>
          <script type="application/json" data-hero-data>${searchData(d)}</script>
        </form>

        <p class="hero__popular">
          <span>Popular:</span>
          ${POPULAR.slice(0, 4).map(([label, q]) => `<a href="courses.html?q=${encodeURIComponent(q)}">${label}</a>`).join('')}
        </p>
        <p class="hero__finder-link">Not sure what to search for? <a href="course-finder.html">Answer 4 quick questions ${icon('arrow-right')}</a></p>
      </div>

      <figure class="hero-guide">
        ${site.advisorPhoto
          ? `<img class="hero-guide__photo" src="${site.advisorPhoto.cutout}-520.webp" srcset="${site.advisorPhoto.cutout}-520.webp 520w, ${site.advisorPhoto.cutout}-900.webp 900w" sizes="(min-width: 1200px) 460px, 38vw" width="520" height="650" alt="${esc(site.advisor)}, your course guide">`
          : `<span class="hero-guide__initial" aria-hidden="true">${site.advisor[0]}</span>`}
        <figcaption class="hero-guide__card">
          <span class="hero-guide__name">${site.advisor}</span>
          <span class="hero-guide__role">Your course guide</span>
        </figcaption>
      </figure>
    </div>
    <button class="hero__pause" type="button" aria-pressed="false" hidden data-hero-pause>
      <span class="hero__pause-icon" aria-hidden="true"></span><span data-hero-pause-label>Pause video</span>
    </button>
  </section>`;

const guideStrip = (d) => html`
  <aside class="guide-strip" aria-label="Your course guide">
    <div class="container guide-strip__inner">
      <span class="avatar avatar--lg" aria-hidden="true">${advisorAvatar(d)}</span>
      <p><strong>Hi, I’m ${site.advisor}.</strong> Tell me about your experience and goals, and I’ll suggest courses that fit. ${tbc('Poonam to approve her introduction')}</p>
      <a class="btn btn--primary" href="contact.html">${icon('chat')} Talk to ${site.advisor}</a>
    </div>
  </aside>`;

const JOBS = ['Aged care worker', 'Early childhood educator', 'Teacher aide', 'Disability support worker', 'Trainer & assessor', 'Team leader', 'Counsellor', 'WHS officer', 'Community worker', 'OSHC coordinator', 'Site supervisor'];

// Big scrolling band of job titles under the hero.
const jobBand = () => html`
  <div class="job-band" aria-label="Jobs these courses lead to">
    <ul class="job-band__track" role="list">
      ${[...JOBS, ...JOBS].map((j, i) => `<li${i >= JOBS.length ? ' aria-hidden="true"' : ''}>${j}</li>`)}
    </ul>
  </div>`;

const span = (codes, key) => {
  const vals = codes.map((c) => typicalPrices[c]?.[key]).filter(Boolean);
  if (!vals.length) return null;
  const lo = Math.min(...vals.map((v) => v[0]));
  const hi = Math.max(...vals.map((v) => v[1]));
  return lo === hi ? money(lo) : `${money(lo)}–${money(hi)}`;
};

const mapStop = (codes, i, d) => {
  const list = codes.map((c) => courseByCode[c]);
  const first = list[0];
  const study = span(codes, 'study');
  const rpl = span(codes, 'rpl');
  const canRpl = list.some((c) => c.pathways.includes('rpl'));
  return html`<li class="pmap__stop" data-step="${i}" data-rpl="${canRpl ? '1' : ''}">
    <span class="pmap__node" aria-hidden="true"><span>${i + 1}</span></span>
    <div class="pmap__card">
      <p class="pmap__you" data-you hidden>${icon('pin')} You start here</p>
      <p class="pmap__level">${levelById[first.level].name}</p>
      <h3 class="pmap__title">${list.map((c) => `<a href="${link(d, `course/${c.slug}.html`)}">${esc(c.short ?? c.title)}</a>`).join('<span class="pmap__or"> or </span>')}</h3>
      <p class="pmap__roles">${esc(first.roles.slice(0, 2).join(' · '))}</p>
      ${canRpl ? `<p class="pmap__rpl" data-rpl-note hidden>${icon('award')}<span><strong>Your experience may count.</strong> RPL ${esc(first.duration.rpl.replace(/^Often /, 'often '))}${rpl ? `, typically ${rpl}` : ''}.</span></p>` : ''}
      <dl class="pmap__facts">
        <div><dt>Study</dt><dd>${esc(first.duration.study)}</dd></div>
        <div><dt>Typical price</dt><dd>${study ?? 'Ask for a quote'}</dd></div>
      </dl>
      <p class="pmap__done" data-done hidden>${icon('check')} Already done</p>
    </div>
  </li>`;
};

// Signature feature: pick an area, see the route from entry level upwards.
const pathwayMap = (d) => html`
  <section class="section pmap" id="pathway-map" aria-labelledby="pmap-title" data-pmap>
    <div class="container">
      <div class="pmap__head">
        <div>
          <p class="eyebrow eyebrow--on-dark">The Pathway Map</p>
          <h2 id="pmap-title">See where your next step <em>could take you</em></h2>
        </div>
        <p class="lead">Pick the work you love. Then tell us where you are now: we’ll show your starting point, the jobs each step opens up, the time it takes and typical prices. If you’ve already got experience, see where it could count.</p>
      </div>

      <div class="pmap__controls">
        <div class="pmap__tabs" role="tablist" aria-label="Choose an area of work">
          ${routes.map((r, i) => `<button type="button" role="tab" id="pmt-${r.id}" aria-controls="pm-${r.id}" aria-selected="false" tabindex="${i === 0 ? 0 : -1}" data-pmap-tab="${r.id}" style="--acc:var(--c-${r.color});--acc-ink:var(--c-${r.color}-ink);--acc-50:var(--c-${r.color}-50)">${icon(r.icon)}${r.label}</button>`)}
        </div>
        <fieldset class="pmap__exp" data-pmap-exp hidden>
          <legend>Where are you now?</legend>
          <div>
            ${experience.map((e, i) => `<label><input type="radio" name="pmap-exp" value="${e.id}"${i === 0 ? ' checked' : ''}><span>${e.label}</span></label>`)}
          </div>
        </fieldset>
      </div>

      ${routes.map(
        (r) => html`<div class="pmap__panel" role="tabpanel" id="pm-${r.id}" aria-labelledby="pmt-${r.id}" data-pmap-panel="${r.id}" data-inactive style="--acc:var(--c-${r.color});--acc-ink:var(--c-${r.color}-ink);--acc-50:var(--c-${r.color}-50)">
          <h3 class="visually-hidden">${r.label} pathway</h3>
          <ol class="pmap__route" role="list" style="--stops:${r.steps.length}">
            ${r.steps.map((codes, n) => mapStop(codes, n, d))}
          </ol>
        </div>`
      )}

      <p class="pmap__prompt" data-pmap-prompt>${icon('arrow-left')} Pick an area to see your route, from your first certificate upwards.</p>

      <div class="pmap__foot">
        <p>Prices are typical full-fee ranges across Australian providers (${pricesCheckedOn}). Whether RPL fits is decided by the training provider. ${tbc('Poonam to check the routes on the Pathway Map')}</p>
        <div class="pmap__finder">
          <span id="finder-q1">Not sure where you fit? Start the 4-question finder:</span>
          <ul class="pmap__pills" role="list" aria-labelledby="finder-q1">
            ${interests.filter((o) => o.id !== 'unsure').slice(0, 4).map((o) => `<li><a class="pill-option" href="course-finder.html?interest=${o.id}">${esc(o.label)}</a></li>`)}
            <li><a class="pill-option pill-option--more" href="course-finder.html">More options ${icon('arrow-right')}</a></li>
          </ul>
        </div>
      </div>
    </div>
  </section>`;

const areas = (d) => html`
  <section class="section areas" aria-labelledby="areas-title">
    <div class="container">
      <div class="section-head section-head--row">
        <div>
          <p class="eyebrow">Course areas</p>
          <h2 id="areas-title">Where do you want to make a difference?</h2>
          <p class="lead">Six areas, ${courses.length} courses. Pick one to see its courses, ways to study and typical prices.</p>
        </div>
        <a class="link-arrow" href="courses.html">See all ${courses.length} courses ${icon('arrow-right')}</a>
      </div>
      <div class="bento">
        ${sectors.map((s) => areaCard(s, courses.filter((c) => c.sector === s.id), d))}
      </div>
      <p class="areas__note">“From” prices are the lowest typical prices published by Australian providers (${pricesCheckedOn}). Ask ${site.advisor} for an exact quote.</p>
    </div>
  </section>`;

const PROMISES = [
  ['user', 'One person, start to finish', `You talk to ${site.advisor} each time, so you never repeat your story.`],
  ['shield', 'Honest about fit', 'If a course or pathway isn’t right for you, she’ll say so.'],
  ['file', 'Help with the paperwork', 'From RPL evidence to enrolment forms, get it right first time.'],
  ['info', 'Clear about who does what', 'You’ll know which training organisation issues your qualification before you pay.'],
];

const aboutPoonam = (d) => html`
  <section class="section about-poonam" aria-labelledby="about-title">
    <div class="container about-poonam__inner">
      <figure class="about-poonam__photo">
        <div class="about-poonam__frame">${advisorPortrait(d)}</div>
        <figcaption class="about-poonam__tag">${icon('route')} Your course guide</figcaption>
      </figure>
      <div class="about-poonam__text">
        <p class="eyebrow">Meet your guide</p>
        <h2 id="about-title">Hi, I’m ${site.advisor}. <em>Let’s find your path together.</em></h2>
        <p class="lead">Choosing a course is a big decision. I take the time to understand your experience, your goals and your week, then give you a straight answer about what fits and the most sensible way to get there. ${tbc('Poonam to approve or rewrite her introduction')}</p>
        <ul class="promises" role="list">
          ${PROMISES.map(([ic, title, text]) => `<li>${icon(ic)}<div><h3>${title}</h3><p>${text}</p></div></li>`)}
        </ul>
        <div class="btn-row">
          <a class="btn btn--primary btn--lg" href="contact.html">${icon('chat')} Talk to ${site.advisor}</a>
          <a class="btn btn--secondary btn--lg" href="about.html">Read ${site.advisor}’s story</a>
        </div>
      </div>
    </div>
  </section>`;

// Real, approved testimonials when supplied. In preview builds only, clearly
// labelled samples show the layout; they are never published at launch.
// Story colour follows the course area it relates to.
const storyArea = (t) => {
  const c = courses.find((x) => x.title === t.detail);
  return c ? c.sector : 'care';
};

const storyCard = (t, hidden) => html`<li class="wall-card" style="--acc:var(--c-${storyArea(t)});--acc-ink:var(--c-${storyArea(t)}-ink);--acc-50:var(--c-${storyArea(t)}-50)"${hidden ? ' aria-hidden="true"' : ''}>
    <svg class="wall-card__mark" viewBox="0 0 48 36" aria-hidden="true" focusable="false"><path d="M0 36V22C0 9 7 2 19 0l2 6c-7 2-10 6-10 12h9v18zm27 0V22C27 9 34 2 46 0l2 6c-7 2-10 6-10 12h9v18z" fill="currentColor"/></svg>
    <p class="wall-card__quote">${esc(t.quote)}</p>
    ${t.from && t.to ? `<p class="wall-card__journey"><span>${esc(t.from)}</span>${icon('arrow-right')}<strong>${esc(t.to)}</strong></p>` : ''}
    <p class="wall-card__who"><span class="wall-card__avatar" aria-hidden="true">${esc(t.name[0])}</span><span><strong>${esc(t.name)}</strong><span>${esc(t.detail ?? '')}</span></span></p>
  </li>`;

// Student stories: two rows of story cards drifting in opposite directions.
const testimonials = () => {
  const real = site.testimonials.length > 0;
  const list = real ? site.testimonials : site.draft ? site.sampleTestimonials : [];
  if (!list.length) return '';
  const rowB = [...list].reverse();
  return html`
  <section class="section wall" aria-labelledby="reviews-title" data-wall>
    <div class="container wall__head">
      <h2 id="reviews-title" class="wall__title">Student <em>stories</em>${real ? '' : tbc('Placeholder stories: replace with genuine, approved reviews. They are hidden automatically at launch.')}</h2>
      <p class="wall__lead">From “I’ve done this work for years” to qualified. From “I don’t know where to start” to enrolled.</p>
      <button type="button" class="wall__pause" data-wall-pause aria-pressed="false"><span class="wall__pause-icon" aria-hidden="true"></span><span data-wall-pause-label>Pause stories</span></button>
    </div>
    <div class="wall__rows">
      <ul class="wall__row" role="list">${list.map((t) => storyCard(t, false))}${list.map((t) => storyCard(t, true))}</ul>
      <ul class="wall__row wall__row--reverse" role="list" aria-hidden="true">${rowB.map((t) => storyCard(t, true))}${rowB.map((t) => storyCard(t, true))}</ul>
    </div>
  </section>`;
};

// Why these courses matter, said simply: the jobs are growing.
const whyMatters = () => html`
  <section class="section demand" aria-labelledby="matters-title">
    <div class="container">
      <div class="demand__head">
        <p class="eyebrow eyebrow--on-dark">Why these courses</p>
        <h2 id="matters-title">These jobs need <em>more people.</em></h2>
        <p class="lead">Thousands more qualified carers, educators and teacher aides will be needed in the next ten years. A qualification now puts you in line for that work.</p>
      </div>
      <ul class="demand__grid" role="list">
        ${facts.map(
          (f) => html`<li class="demand__item" style="--acc:var(--c-${f.area})">
            <p class="demand__stat">${f.stat}</p>
            <p class="demand__label">${f.label}</p>
            <p class="demand__source">Source: <a href="${f.url}" rel="noopener">${esc(f.source)}</a></p>
          </li>`
        )}
      </ul>
      ${careerLinks.length
        ? html`<div class="watch">
            <h3 class="watch__title">See what the work is like</h3>
            <ul class="watch__grid" role="list">
              ${careerLinks.map((v) => html`<li><figure class="video-card">
                <div class="video-card__frame" data-yt-frame>
                  <button class="video-card__play" type="button" data-yt="${v.id}" data-yt-title="${esc(v.title)}" aria-label="Play video: ${esc(v.title)}">
                    <img src="assets/img/videos/${v.id}.webp" alt="" width="640" height="360" loading="lazy" decoding="async">
                    <span class="video-card__btn" aria-hidden="true">${icon('play')}</span>
                  </button>
                </div>
                <figcaption><strong>${esc(v.title)}</strong><span>${esc(v.publisher)}</span></figcaption>
              </figure></li>`)}
            </ul>
            <p class="watch__note">Videos play from YouTube in privacy-enhanced mode, only when you press play.</p>
          </div>`
        : ''}
    </div>
  </section>`;

export default function home() {
  const d = 0;
  const faqs = [faqGroups[0].items[0], faqGroups[1].items[1], faqGroups[0].items[2], faqGroups[3].items[0]];

  const body = html`
  <div class="first-screen">
  ${hero(d)}
  ${jobBand()}
  </div>
  ${guideStrip(d)}
  ${pathwayMap(d)}
  ${areas(d)}
  ${aboutPoonam(d)}
  ${testimonials()}
  ${whyMatters()}

  <section class="section" aria-labelledby="faq-title">
    <div class="container faq-split">
      <div class="faq-split__intro">
        <p class="eyebrow">Questions</p>
        <h2 id="faq-title">Good questions to ask first</h2>
        <p>Straight answers to what people ask most before choosing a course.</p>
        <a class="link-arrow" href="faq.html">Read all FAQs ${icon('arrow-right')}</a>
      </div>
      ${faqList(faqs)}
    </div>
  </section>

  `;

  return {
    path: 'index.html',
    title: '',
    bodyClass: 'page-home',
    description: `Personal course guidance from ${site.advisor}. Search nationally recognised courses in care, early childhood, training, leadership and building, see typical prices, and find the best way to get qualified.`,
    head: `<link rel="preload" as="image" href="assets/video/hero-poster-768.webp" imagesrcset="assets/video/hero-poster-768.webp 768w, assets/video/hero-poster.webp 1280w" imagesizes="100vw" fetchpriority="high">`,
    body,
  };
}
