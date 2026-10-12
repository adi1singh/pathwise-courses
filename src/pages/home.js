import { site } from '../data/site.js';
import { courses, sectors, levelById } from '../data/courses.js';
import { faqGroups } from '../data/faqs.js';
import { interests } from '../data/finder.js';
import { facts, careerLinks } from '../data/why.js';
import { priceFrom, pricesCheckedOn } from '../data/prices.js';
import { html, link, icon, tbc, esc } from '../templates/helpers.js';
import { faqList, ctaBand, areaCard, advisorAvatar, advisorPortrait, searchFields } from '../templates/components.js';

const POPULAR = [
  ['Aged care', 'aged care'],
  ['Childcare', 'childcare'],
  ['Disability (NDIS)', 'disability'],
  ['Teacher aide', 'teacher aide'],
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
        <p class="hero__eyebrow"><span class="hero__pulse" aria-hidden="true"></span>Personal course guidance with ${site.advisor}</p>
        <h1 id="hero-title">Find the course that <em>moves your career forward</em></h1>
        <p class="hero__lead">Search ${courses.length} nationally recognised courses in care, early childhood, training, leadership and building, then talk it through with ${site.advisor}.</p>

        <form class="hero-search" action="courses.html" method="get" role="search" aria-label="Search courses" data-hero-search>
          <div class="hero-search__box">
            ${icon('search', 'hero-search__icon')}
            <label class="visually-hidden" for="hero-q">Search courses by job, topic or course name</label>
            <input class="hero-search__input" id="hero-q" name="q" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search"
              placeholder="Try “aged care” or “teacher aide”" data-hero-input>
            <span class="hero-search__ghost" aria-hidden="true" data-hero-ghost></span>
            <button class="btn btn--sun hero-search__go" type="submit">Find courses</button>
          </div>
          <div class="hero-search__panel" id="hero-results-panel" hidden data-hero-panel>
            <ul class="hero-search__results" id="hero-results" role="listbox" aria-label="Suggested courses" data-hero-results></ul>
          </div>
          <p class="visually-hidden" aria-live="polite" data-hero-status></p>
          <script type="application/json" data-hero-data>${searchData(d)}</script>
        </form>

        <div class="hero__popular">
          <span id="popular-label">Popular:</span>
          <ul role="list" aria-labelledby="popular-label">
            ${POPULAR.map(([label, q]) => `<li><a href="courses.html?q=${encodeURIComponent(q)}">${label}</a></li>`)}
          </ul>
        </div>
        <a class="hero__finder" href="course-finder.html">${icon('compass')}<span><strong>Not sure what to search for?</strong> Answer 4 quick questions</span>${icon('arrow-right')}</a>
      </div>

      <figure class="hero-guide">
        ${site.advisorPhoto
          ? `<img class="hero-guide__photo" src="${site.advisorPhoto.cutout}-520.webp" srcset="${site.advisorPhoto.cutout}-520.webp 520w, ${site.advisorPhoto.cutout}-900.webp 900w" sizes="(min-width: 1200px) 460px, 38vw" width="520" height="650" alt="${esc(site.advisor)}, your course guide">`
          : `<span class="hero-guide__initial" aria-hidden="true">${site.advisor[0]}</span>`}
        <figcaption class="hero-guide__card">
          <span class="hero-guide__name">${site.advisor}</span>
          <span class="hero-guide__role">Your course guide</span>
          <a class="hero-guide__link" href="contact.html">${icon('chat')} Talk to ${site.advisor}</a>
        </figcaption>
      </figure>
    </div>
    <button class="hero__pause" type="button" aria-pressed="false" hidden data-hero-pause>
      <span class="hero__pause-icon" aria-hidden="true"></span><span data-hero-pause-label>Pause video</span>
    </button>
  </section>

  <aside class="guide-strip" aria-label="Your course guide">
    <div class="container guide-strip__inner">
      <span class="avatar avatar--lg" aria-hidden="true">${advisorAvatar(d)}</span>
      <p><strong>Hi, I’m ${site.advisor}.</strong> Tell me about your experience and goals, and I’ll suggest courses that fit. ${tbc('Poonam to approve her introduction')}</p>
      <a class="btn btn--primary" href="contact.html">${icon('chat')} Talk to ${site.advisor}</a>
    </div>
  </aside>`;

const finderEntry = () => html`
  <section class="section section--navy finder-entry" aria-labelledby="finder-title">
    <div class="container finder-entry__inner">
      <div class="finder-entry__text">
        <p class="eyebrow eyebrow--on-dark">Course finder</p>
        <h2 id="finder-title">Not sure which course fits? Answer four quick questions.</h2>
        <p>Tell us what interests you, your experience and your goal. You’ll see suggested courses and study pathways, with the reasons why, before we ask for any contact details.</p>
        <ol class="finder-entry__path" role="list" aria-label="Four questions">
          <li class="is-current">Interest</li><li>Experience</li><li>Qualifications</li><li>Goal</li>
        </ol>
      </div>
      <div class="finder-entry__start">
        <p class="finder-entry__q" id="finder-q1">Question 1 of 4 · What kind of work interests you?</p>
        <ul class="finder-entry__options" role="list" aria-labelledby="finder-q1">
          ${interests.map((o) => `<li><a class="pill-option" href="course-finder.html?interest=${o.id}">${esc(o.label)}</a></li>`)}
        </ul>
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
const testimonials = () => {
  const real = site.testimonials.length > 0;
  const list = real ? site.testimonials : site.draft ? site.sampleTestimonials : [];
  if (!list.length) return '';
  return html`
  <section class="section section--soft reviews" aria-labelledby="reviews-title">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">Student stories</p>
        <h2 id="reviews-title">What students say</h2>
        ${real ? '' : `<p class="reviews__sample-note">${icon('info')} <span><strong>Sample reviews.</strong> These show the layout only. They are not real reviews and are hidden automatically at launch. Replace them with genuine, approved stories.</span></p>`}
      </div>
      <ul class="reviews__grid" role="list">
        ${list.map(
          (t) => html`<li>
            <figure class="review${real ? '' : ' review--sample'}">
              ${real ? '' : '<span class="review__flag">Sample</span>'}
              <svg class="review__mark" viewBox="0 0 48 36" aria-hidden="true" focusable="false"><path d="M0 36V22C0 9 7 2 19 0l2 6c-7 2-10 6-10 12h9v18zm27 0V22C27 9 34 2 46 0l2 6c-7 2-10 6-10 12h9v18z" fill="currentColor"/></svg>
              <blockquote><p>${esc(t.quote)}</p></blockquote>
              <figcaption><span class="review__avatar" aria-hidden="true">${esc(t.name[0])}</span><span><strong>${esc(t.name)}</strong>${t.detail ? `<span>${esc(t.detail)}</span>` : ''}</span></figcaption>
            </figure>
          </li>`
        )}
      </ul>
    </div>
  </section>`;
};

const whyMatters = () => html`
  <section class="section section--navy why-matters" aria-labelledby="matters-title">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow eyebrow--on-dark">Why these courses matter</p>
        <h2 id="matters-title">In-demand work that makes a difference</h2>
        <p class="lead">Care, early childhood and education roles keep growing. Here’s what official Victorian Government workforce projections show.</p>
      </div>
      <ul class="facts-grid" role="list">
        ${facts.map(
          (f) => html`<li class="fact-card">
            <span class="fact-card__icon">${icon(f.icon)}</span>
            <p class="fact-card__stat">${f.stat}</p>
            <p class="fact-card__text">${f.text}</p>
            <p class="fact-card__source">Source: <a href="${f.url}" rel="noopener">${esc(f.source)}</a></p>
          </li>`
        )}
      </ul>
      ${careerLinks.length
        ? html`<div class="watch">
            <h3 class="watch__title">${icon('play')} See what the work is like</h3>
            <ul class="watch__list" role="list">
              ${careerLinks.map((v) => `<li><a class="watch__link" href="${v.url}" rel="noopener"><span class="watch__play" aria-hidden="true">${icon('play')}</span><span><strong>${esc(v.title)}</strong><span>${esc(v.publisher)}</span></span></a></li>`)}
            </ul>
          </div>`
        : ''}
    </div>
  </section>`;

const howItWorks = () => html`
  <section class="section how" aria-labelledby="how-title">
    <div class="container">
      <div class="how__head">
        <div>
          <p class="eyebrow">How it works</p>
          <h2 id="how-title">Your path to a qualification</h2>
        </div>
        <a class="link-arrow" href="ways-to-study.html">Compare RPL, online study and short courses ${icon('arrow-right')}</a>
      </div>
      <ol class="route" role="list">
        <li class="route__stop"><span class="route__num" aria-hidden="true">01</span><span class="route__dot">${icon('chat')}</span><h3>Have a chat</h3><p>Share your experience and goals with ${site.advisor}.</p></li>
        <li class="route__stop"><span class="route__num" aria-hidden="true">02</span><span class="route__dot">${icon('compass')}</span><h3>Choose your course</h3><p>Agree the right course and the best way to get it.</p></li>
        <li class="route__stop"><span class="route__num" aria-hidden="true">03</span><span class="route__dot">${icon('file')}</span><h3>Show or build your skills</h3><p>Gather evidence for RPL, or study the course online.</p></li>
        <li class="route__stop route__stop--end"><span class="route__num" aria-hidden="true">04</span><span class="route__dot">${icon('award')}</span><h3>Get qualified</h3><p>Your training organisation issues your qualification.</p></li>
      </ol>
    </div>
  </section>`;

export default function home() {
  const d = 0;
  const faqs = [faqGroups[0].items[0], faqGroups[1].items[1], faqGroups[0].items[2], faqGroups[3].items[0]];

  const body = html`
  ${hero(d)}
  ${finderEntry()}
  ${areas(d)}
  ${aboutPoonam(d)}
  ${testimonials()}
  ${whyMatters()}
  ${howItWorks()}

  <section class="section section--soft" aria-labelledby="faq-title">
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

  ${ctaBand(d)}
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
