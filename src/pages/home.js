import { site } from '../data/site.js';
import { courses, sectors } from '../data/courses.js';
import { faqGroups } from '../data/faqs.js';
import { interests } from '../data/finder.js';
import { html, link, icon, tbc, esc } from '../templates/helpers.js';
import { faqList, ctaBand, areaCard, journeyPath, advisorAvatar } from '../templates/components.js';

// Hero visual: Poonam's portrait when supplied, otherwise a designed
// composition with her name – never a stand-in face.
const heroVisual = (depth) => html`
  <figure class="hero-visual${site.advisorPhoto ? ' hero-visual--photo' : ''}">
    <div class="hero-visual__arch">
      ${site.advisorPhoto
        ? `<img src="${link(depth, site.advisorPhoto)}" alt="${esc(site.advisor)}, course guide at ${esc(site.name)}" width="640" height="800" fetchpriority="high">`
        : html`<span class="hero-visual__monogram" aria-hidden="true">${site.advisor[0]}</span>
          ${journeyPath('hero-visual__path')}`}
      <span class="hero-visual__plate">
        <span class="hero-visual__name">${site.advisor}</span>
        <span class="hero-visual__role">Your course guide</span>
      </span>
    </div>
    <figcaption class="hero-note">
      <p class="hero-note__quote">“I’ll listen to your experience and goals, suggest courses that fit, then help you through enrolment.”</p>
      <p class="hero-note__by">${site.advisor} ${tbc('Poonam to approve her introduction')}</p>
    </figcaption>
    ${site.draft && !site.advisorPhoto ? '<p class="hero-visual__todo">Placeholder until Poonam’s photo is supplied</p>' : ''}
  </figure>`;

export default function home() {
  const d = 0;
  const faqs = [faqGroups[0].items[0], faqGroups[1].items[1], faqGroups[0].items[2], faqGroups[3].items[0]];

  const body = html`
  <section class="hero" aria-labelledby="hero-title">
    <div class="container hero__inner">
      <div class="hero__text">
        <h1 id="hero-title">Find your course, <em>with ${site.advisor} by your side.</em></h1>
        <p class="lead hero__lead">
          ${site.advisor} helps you choose a nationally recognised course in care, education, training, leadership or building, and the best way to get it.
          You get honest, personal advice from your first question to enrolment.
        </p>
        <div class="btn-row">
          <a class="btn btn--primary btn--lg" href="course-finder.html">Find my course ${icon('arrow-right')}</a>
          <a class="btn btn--secondary btn--lg" href="courses.html">Browse courses</a>
        </div>
        <div class="hero__intro">
          <span class="avatar" aria-hidden="true">${advisorAvatar(d)}</span>
          <p><strong>Hi, I’m ${site.advisor}.</strong> I’ll listen first, suggest courses that fit your experience, and help you through enrolment.</p>
        </div>
      </div>
      ${heroVisual(d)}
    </div>
  </section>

  <section class="section section--teal finder-entry" aria-labelledby="finder-title">
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
  </section>

  <section class="section" aria-labelledby="areas-title">
    <div class="container">
      <div class="section-head section-head--row">
        <div>
          <p class="eyebrow">Course areas</p>
          <h2 id="areas-title">Where would you like to work?</h2>
        </div>
        <a class="link-arrow" href="courses.html">All ${courses.length} courses ${icon('arrow-right')}</a>
      </div>
      <div class="area-grid">
        ${sectors.map((s) => areaCard(s, courses.filter((c) => c.sector === s.id).length, d))}
      </div>
    </div>
  </section>

  <section class="section section--sand" aria-labelledby="why-title">
    <div class="container why">
      <div class="why__intro">
        <p class="eyebrow">Why ${site.advisor}</p>
        <h2 id="why-title">Personal guidance, not a sales call</h2>
        <p class="lead">Choosing a course is a big decision. ${site.advisor} takes the time to understand where you are now and gives you a straight answer about what fits.${tbc('Poonam to confirm these commitments')}</p>
        <a class="link-arrow" href="about.html">More about ${site.advisor} ${icon('arrow-right')}</a>
      </div>
      <ul class="why__list" role="list">
        <li>${icon('user')}<div><h3>One person, start to finish</h3><p>You talk to ${site.advisor} each time, so you never have to repeat your story.</p></div></li>
        <li>${icon('shield')}<div><h3>Honest about fit</h3><p>If a course or pathway isn’t right for you, she’ll tell you, even if that means not enrolling.</p></div></li>
        <li>${icon('file')}<div><h3>Help with the paperwork</h3><p>From organising RPL evidence to enrolment forms, you get help getting it right first time.</p></div></li>
        <li>${icon('info')}<div><h3>Clear about who does what</h3><p>${site.advisor} guides you. A Registered Training Organisation (RTO) trains, assesses and issues your qualification, and you’ll know which one before you pay anything.${tbc('Add partner RTO names and RTO codes')}</p></div></li>
      </ul>
      ${site.testimonials.length
        ? html`<div class="why__stories">
            ${site.testimonials.map((t) => html`<blockquote class="story"><p>“${esc(t.quote)}”</p><footer>${esc(t.name)}${t.detail ? ` · ${esc(t.detail)}` : ''}</footer></blockquote>`)}
          </div>`
        : ''}
    </div>
  </section>

  <section class="section" aria-labelledby="how-title">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">How it works</p>
        <h2 id="how-title">Your path to a qualification</h2>
      </div>
      <ol class="route" role="list">
        <li class="route__stop"><span class="route__dot">${icon('chat')}</span><h3>Have a chat</h3><p>Share your experience and goals with ${site.advisor}.</p></li>
        <li class="route__stop"><span class="route__dot">${icon('compass')}</span><h3>Choose your course</h3><p>Agree the right course and the best way to get it.</p></li>
        <li class="route__stop"><span class="route__dot">${icon('file')}</span><h3>Show or build your skills</h3><p>Gather evidence for RPL, or study the course online.</p></li>
        <li class="route__stop route__stop--end"><span class="route__dot">${icon('award')}</span><h3>Get qualified</h3><p>Your training organisation issues your qualification.</p></li>
      </ol>
      <p class="center"><a class="link-arrow" href="ways-to-study.html">Compare RPL, online study and short courses ${icon('arrow-right')}</a></p>
    </div>
  </section>

  <section class="section section--sand" aria-labelledby="faq-title">
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
    description: `Personal course guidance from ${site.advisor}. Find a nationally recognised course in care, early childhood, training, leadership or building, and the best way to get it.`,
    body,
  };
}
