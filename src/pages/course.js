import { site } from '../data/site.js';
import { courses, courseByCode, sectorById, levelById, pathways } from '../data/courses.js';
import { html, link, icon, esc, tbc, tgaUrl } from '../templates/helpers.js';
import { breadcrumbs, sectorChip, courseCard, checklist, faqList, contactOptions, advisorAvatar, photo } from '../templates/components.js';
import { priceDetail, pricesCheckedOn } from '../data/prices.js';

const rtoBlock = (c) => {
  const rto = c.rto && site.partnerRtos.find((r) => r.id === c.rto);
  if (rto) {
    return html`<p><strong>${esc(rto.name)}</strong> (RTO ${esc(rto.code)}) delivers, assesses and issues this qualification.</p>`;
  }
  return html`<p>This qualification is delivered, assessed and issued by a partner Registered Training Organisation (RTO). You’ll be told which RTO, and given its RTO code, before you enrol. ${tbc('Add the delivering RTO name and RTO code for this course (ASQA requirement for third-party marketing)')}</p>`;
};

const courseFaqs = (c) => {
  const items = [];
  if (c.pathways.includes('rpl')) {
    items.push({
      q: `Can I get the ${c.title} through RPL?`,
      a: `If you already have relevant work experience, you may be able to have it assessed through recognition of prior learning. You would provide evidence of your skills and talk with an assessor, then complete any gap training needed. ${site.advisor} can tell you whether RPL is realistic for you after a short chat.`,
    });
  }
  items.push(
    c.placement.required
      ? {
          q: 'Will I need to do a work placement?',
          a: `Yes. ${c.placement.detail}. If you already work in a suitable role, some or all of it may be completed in your current workplace.`,
          confirm: true,
        }
      : {
          q: 'Is there a work placement?',
          a: `${c.placement.detail}.`,
          confirm: true,
        },
    {
      q: 'How much does it cost?',
      a: `Fees depend on the training provider and whether you use RPL or study the full course. ${site.advisor} will give you the full cost in writing before you decide – just ask.`,
      confirm: true,
    },
    {
      q: 'Is this course nationally recognised?',
      a: `Yes. ${c.code} is part of Australia’s national training system. You can look it up on training.gov.au.`,
    }
  );
  return items;
};

export default function coursePage(c) {
  const d = 1;
  const sector = sectorById[c.sector];
  const level = levelById[c.level].name;
  const q = `?course=${encodeURIComponent(c.code)}`;
  const related = courses.filter((x) => x.sector === c.sector && x.code !== c.code).slice(0, 3);
  const next = c.next.map((code) => courseByCode[code]).filter(Boolean);
  const confirm = (key) => (c.confirm?.includes(key) ? tbc('Typical figure – confirm with the delivering RTO') : '');

  const rto = c.rto && site.partnerRtos.find((r) => r.id === c.rto);
  const studyLine = c.unit
    ? `${c.duration.study}`
    : [c.pathways.includes('rpl') ? `RPL: ${c.duration.rpl.replace(/^Often /, '')}` : '', `Online study: ${c.duration.study}`].filter(Boolean).join(' · ');

  const price = priceDetail(c);
  const typical = price?.study
    ? `${price.study} to study${price.rpl ? `, ${price.rpl} with RPL` : ''}`
    : '';
  const glance = [
    { id: 'suits', ic: 'user', label: 'Who it suits', value: esc(c.suits[0]) },
    { id: 'study', ic: 'laptop', label: 'Study options', value: `${esc(studyLine)} ${confirm('duration')}` },
    { id: 'placement', ic: 'briefcase', label: c.unit ? 'Practical' : 'Work placement', value: `${esc(c.placement.required ? c.placement.detail : c.unit ? 'In-person practical assessment' : 'Not required')} ${confirm('placement')}` },
    { id: 'entry', ic: 'file', label: 'Entry requirements', value: `${esc(c.entry.length)} things you’ll need, including a USI ${confirm('entry')}` },
    { id: 'provider', ic: 'building', label: 'Training provider', value: rto ? `${esc(rto.name)} (RTO ${esc(rto.code)})` : `Confirmed before you enrol ${tbc('Add the delivering RTO for this course')}` },
    { id: 'provider', ic: 'coins', label: c.fees ? 'Fees' : 'Typical price', value: c.fees ? esc(c.fees) : typical ? `${esc(typical)} <span class="glance__note">Typical across providers. Ask ${site.advisor} for an exact quote.</span>` : `Ask ${site.advisor} for a written quote` },
  ];

  const sections = [
    ['about', 'About'],
    ['suits', 'Who it suits'],
    ['study', 'Study options'],
    ['placement', c.unit ? 'Practical' : 'Placement'],
    ['entry', 'Entry requirements'],
    ['provider', 'Provider & fees'],
    ['topics', 'What you’ll cover'],
    ['course-faq', 'FAQs'],
  ];

  const body = html`
  <section class="page-hero page-hero--course">
    <div class="container course-hero">
      <div class="course-hero__text">
        ${breadcrumbs([{ label: 'Courses', href: 'courses.html' }, { label: c.title }], d)}
        <div class="course-hero__tags">
          ${sectorChip(c.sector)}
          <span class="course-hero__level">${level}</span>
          <span class="code-badge">${c.code}</span>
          ${confirm('code') && `<span>${confirm('code')}</span>`}
        </div>
        <h1>${esc(c.title)}</h1>
        <p class="lead">${esc(c.summary)}</p>
        <div class="btn-row">
          <a class="btn btn--primary btn--lg" href="${link(d, `eligibility.html${q}`)}">Ask ${site.advisor} about this course ${icon('arrow-right')}</a>
          <a class="btn btn--secondary btn--lg" href="${link(d, 'course-finder.html')}">Not sure? Find my course</a>
        </div>
      </div>
      <figure class="course-hero__media">
        ${photo(c.image.file, d, { sizes: '(min-width: 1000px) 460px, 92vw', lazy: false })}
        ${typical ? `<figcaption class="course-hero__price"><span>Typical price</span><strong>${esc(price.study)}</strong></figcaption>` : ''}
      </figure>
    </div>
  </section>

  <section class="glance-wrap" aria-labelledby="glance-title">
    <div class="container">
      <div class="glance">
        <h2 class="glance__title" id="glance-title">At a glance</h2>
        <dl class="glance__grid">
          ${glance.map(
            (g) => html`<div class="glance__item">
              <dt>${icon(g.ic)} ${g.label}</dt>
              <dd>${g.value} <a class="glance__more" href="#${g.id}">Details<span class="visually-hidden"> about ${g.label.toLowerCase()}</span></a></dd>
            </div>`
          )}
        </dl>
      </div>
    </div>
  </section>

  <div class="container course-layout">
    <div class="course-main">
      <nav class="on-page" aria-label="On this page">
        <p class="on-page__title">On this page</p>
        <ul role="list">${sections.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join('')}</ul>
      </nav>

      <section class="prose-section" aria-labelledby="about">
        <h2 id="about">About this course</h2>
        <p>${esc(c.intro)}</p>
      </section>

      <section class="prose-section" aria-labelledby="suits">
        <h2 id="suits">Who it suits</h2>
        ${checklist(c.suits)}
        <h3 class="prose-section__sub">${c.unit ? 'Often required for' : 'Jobs it can lead to'}</h3>
        <ul class="tag-list" role="list">${c.roles.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
        ${!c.unit ? '<p class="small muted">Job titles vary between employers and states. Some roles also need experience or extra checks.</p>' : ''}
      </section>

      <section class="prose-section" aria-labelledby="study">
        <h2 id="study">Study options and commitment ${confirm('duration')}</h2>
        <div class="grid grid--2">
          ${c.pathways.includes('rpl') ? html`
          <div class="way-card">
            <h3>${icon('briefcase')} ${pathways.rpl}</h3>
            <p class="way-card__time">Typically ${esc(c.duration.rpl.replace(/^Often /, ''))}</p>
            <p>For people with relevant experience. You show what you already know, then fill any gaps. Timing depends mostly on how quickly you gather evidence.</p>
            <a class="link-arrow" href="${link(d, 'ways-to-study.html#rpl')}">How RPL works ${icon('arrow-right')}</a>
          </div>` : ''}
          ${c.pathways.includes('online') ? html`
          <div class="way-card">
            <h3>${icon('laptop')} ${pathways.online}</h3>
            <p class="way-card__time">Typically ${esc(c.duration.study)}</p>
            <p>Learn the full course at your own pace with trainer support. Most people studying alongside work plan for around 8–15 hours a week.</p>
            <a class="link-arrow" href="${link(d, 'ways-to-study.html#online')}">How online study works ${icon('arrow-right')}</a>
          </div>` : ''}
          ${c.pathways.includes('practical') ? html`
          <div class="way-card">
            <h3>${icon('cross')} ${pathways.practical}</h3>
            <p>Complete the theory online, then a short in-person session where an assessor watches you perform the practical skills.</p>
          </div>` : ''}
        </div>
      </section>

      <section class="prose-section" aria-labelledby="placement">
        <h2 id="placement">${c.unit ? 'Practical assessment' : 'Work placement'} ${confirm('placement')}</h2>
        <p>${esc(c.placement.detail)}.${c.placement.required ? ' If you already work in the industry, your current workplace may be able to host your placement.' : ''}</p>
      </section>

      <section class="prose-section" aria-labelledby="entry">
        <h2 id="entry">Entry requirements ${confirm('entry')}</h2>
        ${checklist(c.entry)}
        <p class="small muted">Entry requirements are set by the training provider. ${site.advisor} checks them with you before you enrol.</p>
      </section>

      <section class="prose-section" aria-labelledby="provider">
        <h2 id="provider">Training provider and fees</h2>
        <div class="provider-fees">
          <div>
            <h3 class="prose-section__sub">${icon('building')} Who delivers it</h3>
            ${rtoBlock(c)}
          </div>
          <div>
            <h3 class="prose-section__sub">${icon('coins')} What it costs</h3>
            ${c.fees
              ? `<p><strong>${esc(c.fees)}</strong></p>`
              : html`${typical
                  ? html`<dl class="price-table">
                      <div><dt>Full course</dt><dd>${esc(price.study)}</dd></div>
                      ${price.rpl ? `<div><dt>RPL</dt><dd>${esc(price.rpl)}</dd></div>` : ''}
                    </dl>
                    ${price.note ? `<p class="small"><strong>${esc(price.note)}</strong></p>` : ''}
                    <p class="small muted">Typical full-fee prices published by Australian training providers, checked ${pricesCheckedOn}. Government funding can lower the cost in some states. These are not ${site.advisor}’s prices.</p>`
                  : ''}
                <p>Your price depends on the training provider and on whether you use RPL or study the full course. ${site.advisor} will get you a written quote that shows the full cost, including any extra fees, before you decide. ${tbc('Add agreed fees once set with the partner RTO')}</p>
                <a class="link-arrow" href="${link(d, `contact.html?topic=course&course=${encodeURIComponent(c.code)}`)}">Ask for a quote ${icon('arrow-right')}</a>`}
          </div>
        </div>
      </section>

      <section class="prose-section" aria-labelledby="topics">
        <h2 id="topics">What you’ll cover</h2>
        <ul class="topic-grid" role="list">
          ${c.topics.map((t) => `<li>${icon('book')}<span>${esc(t)}</span></li>`)}
        </ul>
        <p class="small muted">The exact units depend on the electives the training provider offers. The full list of units for ${c.code} is on <a href="${tgaUrl(c.code)}" rel="noopener">training.gov.au ${icon('external', 'icon--sm')}</a>.</p>
      </section>

      ${next.length ? html`
      <section class="prose-section" aria-labelledby="next">
        <h2 id="next">Where it can lead</h2>
        <ul class="next-list" role="list">
          ${next.map((n) => `<li><a href="${link(d, `course/${n.slug}.html`)}"><span class="next-list__code">${n.code}</span><span>${esc(n.title)}</span>${icon('arrow-right')}</a></li>`)}
        </ul>
      </section>` : ''}

      <section class="prose-section" aria-labelledby="course-faq">
        <h2 id="course-faq">Common questions</h2>
        ${faqList(courseFaqs(c))}
      </section>
    </div>

    <aside class="course-side" aria-label="Enquire about this course">
      <div class="side-card">
        <span class="avatar" aria-hidden="true">${advisorAvatar(d)}</span>
        <h2 class="side-card__title">Talk to ${site.advisor} about this course</h2>
        <p>Get a straight answer on whether it suits you, how long it would take and what it costs.</p>
        <a class="btn btn--primary btn--block" href="${link(d, `eligibility.html${q}`)}">Ask about this course</a>
        <a class="btn btn--secondary btn--block" href="${link(d, `contact.html${q}`)}">Send a quick question</a>
        <div class="side-card__contact">${contactOptions()}</div>
      </div>
      <a class="side-link" href="${tgaUrl(c.code)}" rel="noopener">
        ${icon('shield')}
        <span><strong>Check ${c.code} on training.gov.au</strong><span>The official national register</span></span>
        ${icon('external', 'icon--sm')}
      </a>
    </aside>
  </div>

  ${related.length ? html`
  <section class="section section--sand" aria-labelledby="related">
    <div class="container">
      <h2 id="related" class="h3-size">More ${esc(sector.name.toLowerCase())} courses</h2>
      <div class="course-grid">${related.map((r) => courseCard(r, d))}</div>
    </div>
  </section>` : ''}

  <div class="mobile-cta" data-mobile-cta>
    <a class="btn btn--primary btn--block" href="${link(d, `eligibility.html${q}`)}">Ask ${site.advisor} about this course</a>
    <a class="btn btn--secondary mobile-cta__icon" href="${link(d, `contact.html${q}`)}" aria-label="Send ${site.advisor} a quick question about this course">${icon('chat')}</a>
  </div>
  `;

  return {
    path: `course/${c.slug}.html`,
    depth: d,
    title: `${c.title} (${c.code})`,
    active: 'courses',
    bodyClass: 'has-mobile-cta',
    description: `${c.code} ${c.title}: ${c.summary} Explore study options, RPL, job outcomes and entry requirements, and talk to ${site.advisor}.`,
    body,
  };
}
