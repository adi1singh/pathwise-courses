import { site } from '../data/site.js';
import { html, icon, tbc } from '../templates/helpers.js';
import { pageHero, ctaBand, photo } from '../templates/components.js';

const EVIDENCE = [
  ['resume', 'An up-to-date resume', 'List every relevant role, with dates and main duties.'],
  ['pd', 'Position descriptions', 'For your current and past roles, if you have them.'],
  ['refs', 'Referee or supervisor details', 'People who can confirm the work you do – they may be contacted.'],
  ['samples', 'Examples of your work', 'Reports, rosters, checklists or de-identified care or support plans.'],
  ['certs', 'Certificates you already hold', 'Including first aid, short courses and overseas qualifications.'],
  ['payslips', 'Proof of employment', 'An employment contract, letter of service or payslips showing your role.'],
  ['training', 'Training records', 'In-house training, inductions or professional development.'],
  ['id', 'Photo ID and a USI', 'A Unique Student Identifier is free to create at usi.gov.au.'],
];

const PATHS = [
  {
    id: 'rpl', icon: 'award', tag: 'Most popular with experienced workers', name: 'Recognition of prior learning', short: 'RPL',
    img: 'areas/care', best: 'You already do the work but don’t hold the qualification', time: 'Often 4–12 weeks',
    get: 'The full nationally recognised qualification',
  },
  {
    id: 'online', icon: 'laptop', tag: 'Best if you’re new to the field', name: 'Full course, studied online', short: 'Online study',
    img: 'ways/online', best: 'You want to learn the job properly, around work and family', time: '6–18 months',
    get: 'The full nationally recognised qualification',
  },
  {
    id: 'short', icon: 'zap', tag: 'Quickest', name: 'Short course', short: 'Short courses',
    img: 'courses/hltaid011', best: 'You need one skill, a refresher or a workplace requirement', time: 'About 1 to 20 hours',
    get: 'A certificate of completion (first aid units are accredited)',
  },
];

const timeline = (items) => html`
  <ol class="timeline" role="list">
    ${items.map((s, i) => html`<li><span class="timeline__num" aria-hidden="true">${i + 1}</span><div><h3>${s.title}</h3><p>${s.text}</p></div></li>`)}
  </ol>`;

export default function ways() {
  const d = 0;
  const body = html`
  ${pageHero({
    eyebrow: 'Ways to study',
    title: 'Three ways to get <em>qualified</em>',
    lead: 'The right route depends on what you already know. Your experience might count towards a qualification, you might study it from scratch, or you might only need one skill.',
    crumbs: [{ label: 'Ways to study' }],
    depth: d,
    actions: `<a class="btn btn--primary" href="course-finder.html">Find my course ${icon('arrow-right')}</a><a class="btn btn--secondary" href="#compare">Compare side by side</a>`,
    media: { file: 'areas/training', alt: 'A trainer leading a small group session', badge: `${icon('route')} Your route, your pace` },
  })}

  <nav class="subnav" aria-label="On this page">
    <div class="container">
      <ul role="list">
        ${PATHS.map((p) => `<li><a href="${p.id === 'short' ? 'short-courses.html' : `#${p.id}`}">${icon(p.icon)}${p.short}</a></li>`)}
        <li><a href="#evidence-title">${icon('check')}RPL checklist</a></li>
        <li><a href="#compare">${icon('compare')}Compare</a></li>
      </ul>
    </div>
  </nav>

  <section class="section section--tight" aria-labelledby="paths-title">
    <div class="container">
      <h2 class="visually-hidden" id="paths-title">The three routes</h2>
      <ul class="paths" role="list">
        ${PATHS.map(
          (p) => html`<li class="path path--${p.id}">
            <div class="path__media">${photo(p.img, d, { sizes: '(min-width: 960px) 380px, 92vw' })}<span class="path__icon">${icon(p.icon)}</span></div>
            <div class="path__body">
              <p class="path__tag">${p.tag}</p>
              <h3>${p.name}</h3>
              <dl class="path__facts">
                <div><dt>Best if</dt><dd>${p.best}</dd></div>
                <div><dt>Typical time</dt><dd>${p.time}</dd></div>
                <div><dt>You receive</dt><dd>${p.get}</dd></div>
              </dl>
              <a class="link-arrow" href="${p.id === 'short' ? 'short-courses.html' : `#${p.id}`}">${p.id === 'short' ? 'Browse short courses' : `How ${p.id === 'online' ? 'online study' : p.short} works`} ${icon('arrow-right')}</a>
            </div>
          </li>`
        )}
      </ul>
      <p class="areas__note">Timeframes are typical and set by the training provider. ${tbc('Typical timeframes – confirm with partner RTOs')}</p>
    </div>
  </section>

  <section class="section" id="rpl" aria-labelledby="rpl-title">
    <div class="container">
      <div class="split">
        <div>
          <p class="eyebrow">Recognition of prior learning</p>
          <h2 id="rpl-title">Your experience <em>counts</em></h2>
          <p class="lead">RPL is a formal way of having the skills you already use at work assessed against a nationally recognised qualification.</p>
          <p>If you’ve worked in care, education, training, building or management – paid or unpaid, here or overseas – you may already meet many of the requirements. An assessor from the training organisation reviews your evidence, talks with you about your work, and identifies any gaps. You then complete only what’s missing.</p>
          <div class="notice notice--info">
            ${icon('info')}
            <p><strong>RPL isn’t a shortcut.</strong> You still have to prove you’re competent, and you receive exactly the same qualification as someone who studied the full course.</p>
          </div>
        </div>
        <div class="suits-card">
          <h3>RPL could suit you if you…</h3>
          <ul class="checklist" role="list">
            <li>${icon('check')}<span>Have worked in the industry for a year or more</span></li>
            <li>${icon('check')}<span>Do the job well but don’t hold the qualification</span></li>
            <li>${icon('check')}<span>Gained skills or qualifications overseas</span></li>
            <li>${icon('check')}<span>Need a qualification for a promotion, registration or new role</span></li>
            <li>${icon('check')}<span>Want to avoid repeating what you already know</span></li>
          </ul>
          <a class="btn btn--primary btn--block" href="eligibility.html?pathway=rpl">Check if RPL could work for me ${icon('arrow-right')}</a>
        </div>
      </div>

      <h3 class="subhead">How RPL works</h3>
      ${timeline([
        { title: 'Free chat', text: `${site.advisor} asks about your experience and suggests the qualification that best matches it.` },
        { title: 'Self-assessment', text: 'A checklist comparing your skills with the units in the qualification.' },
        { title: 'Build your evidence', text: `Gather documents that show your skills – ${site.advisor} helps you organise them.` },
        { title: 'Talk with an assessor', text: 'The RTO’s assessor discusses your work and may ask you to demonstrate tasks.' },
        { title: 'Fill any gaps', text: 'If anything is missing, you complete targeted training or extra assessment.' },
        { title: 'Get qualified', text: 'Once you’re competent in every unit, the RTO issues your qualification.' },
      ])}
    </div>
  </section>

  <section class="section section--navy evidence-section" aria-labelledby="evidence-title">
    <div class="container">
      <div class="split split--top">
        <div>
          <p class="eyebrow eyebrow--on-dark">Get a head start</p>
          <h2 id="evidence-title">RPL evidence checklist</h2>
          <p class="lead">Tick off what you already have. It’s a quick way to see how ready you are before your first chat.</p>
          <div class="progress" data-evidence-progress>
            <div class="progress__bar"><span data-evidence-bar style="width:0%"></span></div>
            <p class="progress__label" aria-live="polite"><strong data-evidence-count>0</strong> of ${EVIDENCE.length} ready</p>
          </div>
          <p class="small evidence-section__note">Your ticks are saved only in this browser. Exact evidence requirements are set by the assessor.</p>
        </div>
        <fieldset class="evidence card" data-evidence>
          <legend class="visually-hidden">Evidence you already have</legend>
          ${EVIDENCE.map(
            ([id, title, hint]) => html`<label class="evidence__item">
              <input type="checkbox" name="${id}">
              <span class="evidence__box" aria-hidden="true">${icon('check')}</span>
              <span><strong>${title}</strong><span>${hint}</span></span>
            </label>`
          )}
        </fieldset>
      </div>
    </div>
  </section>

  <section class="section" id="online" aria-labelledby="online-title">
    <div class="container">
      <div class="split">
        <figure class="photo-stack">
          ${photo('ways/online', d, { sizes: '(min-width: 900px) 520px, 92vw' })}
          <figcaption class="photo-stack__chip">${icon('laptop')} Study on any device</figcaption>
        </figure>
        <div>
          <p class="eyebrow">Full course online</p>
          <h2 id="online-title">Learn everything, <em>at your own pace</em></h2>
          <p class="lead">If you’re new to the field, studying the full course gives you the knowledge and practice you need – without sitting in a classroom.</p>
          <ul class="mini-features" role="list">
            <li>${icon('users')}<span><strong>Trainer support</strong> by phone, email or video</span></li>
            <li>${icon('calendar')}<span><strong>8–15 hours a week</strong> is typical alongside work ${tbc('Typical weekly hours – confirm')}</span></li>
            <li>${icon('briefcase')}<span><strong>Work placement</strong> for many care and education courses</span></li>
          </ul>
        </div>
      </div>

      <h3 class="subhead">How online study works</h3>
      ${timeline([
        { title: 'Choose and enrol', text: `${site.advisor} helps you pick a course; you enrol with the training organisation.` },
        { title: 'Learn online', text: 'Work through readings, videos and activities at a pace that suits you.' },
        { title: 'Complete assessments', text: 'Questions, case studies and projects, with feedback from your trainer.' },
        { title: 'Work placement', text: 'If your course needs one, practise your skills in a real workplace.' },
        { title: 'Get qualified', text: 'When every unit is complete, the RTO issues your qualification.' },
      ])}
    </div>
  </section>

  <section class="section section--soft" id="compare" aria-labelledby="compare-title">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow">Side by side</p>
        <h2 id="compare-title">Compare the three routes</h2>
      </div>
      <div class="table-wrap">
        <table class="compare-table">
          <caption class="visually-hidden">Recognition of prior learning, full online study and short courses compared</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col"><span class="compare-table__icon compare-table__icon--teal">${icon('award')}</span>Recognition of prior learning</th>
              <th scope="col"><span class="compare-table__icon compare-table__icon--sun">${icon('laptop')}</span>Full course online</th>
              <th scope="col"><span class="compare-table__icon compare-table__icon--coral">${icon('zap')}</span>Short course</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Best for</th>
              <td data-label="Recognition of prior learning">People with solid experience in the field</td>
              <td data-label="Full course online">People new to the field, or wanting to learn it all</td>
              <td data-label="Short course">Workers needing one skill or a refresher</td>
            </tr>
            <tr>
              <th scope="row">What you do</th>
              <td data-label="Recognition of prior learning">Gather evidence, talk with an assessor, fill any gaps</td>
              <td data-label="Full course online">Work through learning and assessments online</td>
              <td data-label="Short course">Complete a focused online module</td>
            </tr>
            <tr>
              <th scope="row">Typical time ${tbc('Typical timeframes – confirm with partner RTOs')}</th>
              <td data-label="Recognition of prior learning">Often 4–12 weeks</td>
              <td data-label="Full course online">6–18 months</td>
              <td data-label="Short course">About 1 to 20 hours</td>
            </tr>
            <tr>
              <th scope="row">Work placement</th>
              <td data-label="Recognition of prior learning">Your existing work experience is assessed</td>
              <td data-label="Full course online">Required for many care and education courses</td>
              <td data-label="Short course">Not required</td>
            </tr>
            <tr>
              <th scope="row">You receive</th>
              <td data-label="Recognition of prior learning">The full nationally recognised qualification</td>
              <td data-label="Full course online">The full nationally recognised qualification</td>
              <td data-label="Short course">A certificate of completion (not a qualification)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="hint-card" id="quiz">
        ${icon('compass')}
        <div>
          <h2 class="hint-card__title">Still not sure which route fits?</h2>
          <p>The course finder asks about your interests, experience and goals, then suggests courses and a likely pathway, with the reasons why.</p>
        </div>
        <a class="btn btn--primary" href="course-finder.html">Find my course ${icon('arrow-right')}</a>
      </div>
    </div>
  </section>

  ${ctaBand(d, { title: 'Still weighing it up?', text: `${site.advisor} can look at your experience and tell you honestly which route makes sense – and roughly how long it would take.` })}
  `;

  return {
    path: 'ways-to-study.html',
    title: 'Ways to study: RPL, online study and short courses',
    active: 'ways',
    bodyClass: 'page-ways',
    description: 'Compare recognition of prior learning (RPL), full online study and short courses. See how each works, how long it takes and which suits you.',
    body,
  };
}
