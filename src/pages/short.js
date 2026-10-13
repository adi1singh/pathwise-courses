import { shortCourses, shortCategories, formats } from '../data/short-courses.js';
import { courses } from '../data/courses.js';
import { html, icon, esc, tbc } from '../templates/helpers.js';
import { breadcrumbs, courseCard, ctaBand, photo } from '../templates/components.js';

const TOPIC_ICON = { clinical: 'heart', ndis: 'users', mental: 'chat', safety: 'shield', workplace: 'briefcase' };

export default function shortPage() {
  const d = 0;
  const catName = Object.fromEntries(shortCategories.map((c) => [c.id, c.name]));
  const firstAid = courses.filter((c) => c.sector === 'firstaid');

  const CAT_AREA = { clinical: 'firstaid', ndis: 'care', mental: 'training', safety: 'education', workplace: 'business' };
  const mosaic = ['dementia', 'infection', 'active-support', 'medication'];
  const body = html`
  <section class="short-hero">
    <div class="container short-hero__inner">
      <div class="short-hero__text">
        ${breadcrumbs([{ label: 'Short courses' }], d)}
        <p class="eyebrow eyebrow--on-dark">${shortCourses.length} short courses · ${shortCategories.length} topics · 1 to 20 hours</p>
        <h1>Learn one skill. <em>Fast.</em></h1>
        <p class="lead">Focused online courses for care and support workers: build a specific skill, refresh what you know or meet a workplace training requirement, at your own pace.</p>
        <div class="btn-row">
          <a class="btn btn--sun btn--lg" href="#short-list">Browse short courses ${icon('arrow-right')}</a>
          <a class="btn btn--secondary btn--lg" href="contact.html?topic=team">Training a team?</a>
        </div>
      </div>
      <div class="mosaic" aria-hidden="true">
        ${mosaic.map((id) => { const c = shortCourses.find((x) => x.id === id); return `<figure class="mosaic__tile acc-${CAT_AREA[c.category]}">${photo(`short/${id}`, d, { sizes: '260px', lazy: false })}<figcaption>${esc(c.title)}</figcaption></figure>`; })}
      </div>
    </div>
  </section>

  <section class="section section--catalogue short-catalogue" id="short-list">
    <div class="filters-dock" data-filters-dock>
      <div class="filters-dock__bar" data-filters-bar>
        <div class="container">
          <form class="filters" data-filters="short" role="search" aria-label="Search and filter short courses" onsubmit="return false">
            <div class="filters__top">
              <div class="filters__search">
                <label for="short-search" class="visually-hidden">Search short courses</label>
                ${icon('search')}
                <input id="short-search" type="search" name="q" placeholder="Search short courses" autocomplete="off" enterkeyhint="search" data-filter-search
                  data-typing-hints="dementia|medication|manual handling|mental health|infection control|autism|behaviour support|using AI">
              </div>
              <button type="button" class="btn btn--secondary filters__toggle" aria-expanded="false" aria-controls="short-more" data-filters-toggle>
                ${icon('sliders')} Filters <span class="filters__badge" data-filters-badge hidden></span>
              </button>
              <div class="filters__more" id="short-more" data-filters-more>
                <div class="filters__field">
                  <label for="format-filter" class="filters__legend">Length</label>
                  <select id="format-filter" data-filter-select="format">
                    <option value="">Any length</option>
                    ${Object.entries(formats).map(([id, f]) => `<option value="${id}">${f.name} (${f.time.toLowerCase()})</option>`)}
                  </select>
                </div>
              </div>
            </div>
            <div class="filters__group" role="group" aria-labelledby="topic-label">
              <p class="filters__legend visually-hidden" id="topic-label">Topic</p>
              <div class="chip-row chip-row--scroll" data-filter-chips="category">
                <button type="button" class="filter-chip" aria-pressed="true" data-value="">All topics <span class="filter-chip__count" aria-hidden="true">${shortCourses.length}</span></button>
                ${shortCategories.map((c) => `<button type="button" class="filter-chip acc-${CAT_AREA[c.id]}" aria-pressed="false" data-value="${c.id}" data-label="${esc(c.name)}" title="${esc(c.name)}">${icon(TOPIC_ICON[c.id])}${esc(c.short)}<span class="filter-chip__count" aria-hidden="true">${shortCourses.filter((x) => x.category === c.id).length}</span></button>`)}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="results-bar">
        <p class="results-count" data-results-count aria-live="polite">Showing all ${shortCourses.length} short courses</p>
        <button type="button" class="btn btn--text btn--sm" data-filter-reset hidden>${icon('x')} Clear filters</button>
      </div>

      <h2 class="visually-hidden">Short course list</h2>
      <div class="short-grid" data-results>
        ${shortCourses.map(
          (s) => html`<article class="short-card acc-${CAT_AREA[s.category]}" data-course-card data-category="${s.category}" data-format="${s.format}" data-search="${esc(`${s.title} ${s.summary} ${catName[s.category]}`.toLowerCase())}" aria-labelledby="s-${s.id}">
            <div class="short-card__media">
              ${photo(`short/${s.id}`, d, { sizes: '(min-width: 1200px) 300px, (min-width: 640px) 45vw, 92vw' })}
              <span class="short-card__cat">${icon(TOPIC_ICON[s.category])}${esc(catName[s.category])}</span>
            </div>
            <div class="short-card__body">
              <h3 id="s-${s.id}">${esc(s.title)}</h3>
              <p>${esc(s.summary)}</p>
              <div class="short-card__foot">
                <span class="short-card__format">${icon(s.format === 'quick' ? 'zap' : 'book')}${formats[s.format].name} · ${formats[s.format].time.toLowerCase()}</span>
                <span class="short-card__price">Price on enquiry</span>
              </div>
              <a class="link-arrow short-card__link" href="contact.html?topic=short-course&amp;course=${encodeURIComponent(s.title)}" aria-describedby="s-${s.id}">Enquire ${icon('arrow-right')}</a>
            </div>
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

      <div class="notice notice--info short-note">
        ${icon('info')}
        <p><strong>Good to know:</strong> short courses are professional development (CPD). You receive a certificate of completion, but they are not nationally recognised qualifications. Course list, formats and prices are being finalised. ${tbc('Confirm which short courses Poonam offers, who delivers them, prices and durations')}</p>
      </div>
    </div>
  </section>

  <section class="section section--navy" aria-labelledby="teams-title">
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

  <section class="section section--blush" aria-labelledby="fa-title">
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
    bodyClass: 'page-short',
    description: 'Online short courses for care and disability support workers: medication support, dementia, infection control, behaviour support, mental health and more. Plus first aid and CPR.',
    body,
  };
}
