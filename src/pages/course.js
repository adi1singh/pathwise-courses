import { site } from '../data/site.js';
import { courses, courseByCode, sectorById, levelById, pathways } from '../data/courses.js';
import { html, link, icon, esc, tbc, tgaUrl } from '../templates/helpers.js';
import { breadcrumbs, sectorChip, courseCard, checklist, faqList, contactOptions } from '../templates/components.js';

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

  const facts = [
    { label: 'Level', value: level, ic: 'award' },
    c.unit
      ? { label: 'Format', value: c.duration.study, ic: 'laptop', key: 'duration' }
      : { label: 'Study online', value: `${c.duration.study} (typical)`, ic: 'laptop', key: 'duration' },
    c.pathways.includes('rpl') ? { label: 'Through RPL', value: c.duration.rpl, ic: 'briefcase', key: 'duration' } : null,
    { label: c.unit ? 'Practical' : 'Work placement', value: c.placement.required ? 'Required' : c.unit ? 'Practical assessment' : 'Not required', ic: 'users', key: 'placement' },
  ].filter(Boolean);

  const body = html`
  <section class="page-hero page-hero--course">
    <div class="container">
      ${breadcrumbs([{ label: 'Courses', href: 'courses.html' }, { label: c.title }], d)}
      <div class="course-hero">
        <div class="course-hero__text">
          <div class="course-hero__tags">
            ${sectorChip(c.sector)}
            <span class="code-badge">${c.code}</span>
            ${confirm('code') && `<span>${confirm('code')}</span>`}
          </div>
          <h1>${esc(c.title)}</h1>
          <p class="lead">${esc(c.summary)}</p>
          <div class="btn-row">
            <a class="btn btn--primary btn--lg" href="${link(d, `eligibility.html${q}`)}">Check my eligibility ${icon('arrow-right')}</a>
            <a class="btn btn--secondary btn--lg" href="${link(d, `contact.html${q}`)}">${icon('chat')} Ask a question</a>
          </div>
        </div>
        <dl class="facts">
          ${facts.map(
            (f) => html`<div class="fact">
              <dt>${icon(f.ic)} ${f.label}</dt>
              <dd>${esc(f.value)} ${f.key ? confirm(f.key) : ''}</dd>
            </div>`
          )}
        </dl>
      </div>
    </div>
  </section>

  <div class="container course-layout">
    <div class="course-main">
      <section class="prose-section" aria-labelledby="about-course">
        <h2 id="about-course">About this course</h2>
        <p>${esc(c.intro)}</p>
      </section>

      <section class="prose-section" aria-labelledby="suits">
        <h2 id="suits">Is it right for you?</h2>
        <p>This course is a good fit for:</p>
        ${checklist(c.suits)}
      </section>

      <section class="prose-section" aria-labelledby="roles">
        <h2 id="roles">${c.unit ? 'Who needs it' : 'Jobs it can lead to'}</h2>
        <ul class="tag-list" role="list">${c.roles.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
        ${!c.unit ? '<p class="small muted">Job titles vary between employers and states. Some roles also need experience or extra checks.</p>' : ''}
      </section>

      <section class="prose-section" aria-labelledby="topics">
        <h2 id="topics">What you’ll cover</h2>
        <ul class="topic-grid" role="list">
          ${c.topics.map((t) => `<li>${icon('book')}<span>${esc(t)}</span></li>`)}
        </ul>
        <p class="small muted">The exact units depend on the electives the training provider offers. The full list of units for ${c.code} is on <a href="${tgaUrl(c.code)}" rel="noopener">training.gov.au ${icon('external', 'icon--sm')}</a>.</p>
      </section>

      <section class="prose-section" aria-labelledby="ways">
        <h2 id="ways">Ways to get this ${c.unit ? 'certificate' : 'qualification'}</h2>
        <div class="grid grid--2">
          ${c.pathways.includes('rpl') ? html`
          <div class="way-card">
            <h3>${icon('briefcase')} ${pathways.rpl}</h3>
            <p>For people with relevant experience. Show what you already know, then fill any gaps. Typical timeframe: <strong>${esc(c.duration.rpl)}</strong>, depending on your evidence.</p>
            <a class="link-arrow" href="${link(d, 'ways-to-study.html#rpl')}">How RPL works ${icon('arrow-right')}</a>
          </div>` : ''}
          ${c.pathways.includes('online') ? html`
          <div class="way-card">
            <h3>${icon('laptop')} ${pathways.online}</h3>
            <p>Learn the full course at your own pace with trainer support. Typical timeframe: <strong>${esc(c.duration.study)}</strong>.</p>
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
        <h2 id="entry">What you’ll need ${confirm('entry')}</h2>
        ${checklist(c.entry)}
        <p class="small muted">Entry requirements are set by the training provider. ${site.advisor} will check them with you before you enrol.</p>
      </section>

      <section class="prose-section" aria-labelledby="rto">
        <h2 id="rto">Who delivers this course</h2>
        ${rtoBlock(c)}
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
        <h2 class="side-card__title">Talk to ${site.advisor} about this course</h2>
        <p>Get a straight answer on whether it suits you, how long it would take and what it costs.</p>
        <a class="btn btn--primary btn--block" href="${link(d, `eligibility.html${q}`)}">Check my eligibility</a>
        <a class="btn btn--secondary btn--block" href="${link(d, `contact.html${q}`)}">Ask a question</a>
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
    <a class="btn btn--primary btn--block" href="${link(d, `eligibility.html${q}`)}">Check my eligibility</a>
    <a class="btn btn--secondary" href="${link(d, `contact.html${q}`)}" aria-label="Ask Poonam a question about this course">${icon('chat')}</a>
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
