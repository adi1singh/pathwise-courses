import { site } from '../data/site.js';
import { html, icon, tbc } from '../templates/helpers.js';
import { pageHero, sectionHead, steps, ctaBand } from '../templates/components.js';

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

export default function ways() {
  const d = 0;
  const body = html`
  ${pageHero({
    eyebrow: 'Ways to study',
    title: 'Three ways to get qualified',
    lead: 'The right route depends on what you already know. Compare your options below, or take the two-minute pathway check.',
    crumbs: [{ label: 'Ways to study' }],
    depth: d,
    actions: `<a class="btn btn--primary" href="#quiz">Take the pathway check ${icon('arrow-right')}</a><a class="btn btn--secondary" href="#compare">Compare options</a>`,
  })}

  <section class="section section--tight" aria-labelledby="compare">
    <div class="container">
      <h2 id="compare" class="visually-hidden">Compare the three ways to study</h2>
      <div class="table-wrap">
        <table class="compare-table">
          <caption class="visually-hidden">Recognition of prior learning, full online study and short courses compared</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col"><span class="compare-table__icon compare-table__icon--teal">${icon('briefcase')}</span>Recognition of prior learning</th>
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
    </div>
  </section>

  <section class="section section--sand" aria-labelledby="quiz-title" id="quiz">
    <div class="container narrow">
      ${sectionHead({
        eyebrow: 'Pathway check',
        title: 'Which path suits me?',
        id: 'quiz-title',
        lead: 'Three quick questions. Nothing is sent anywhere – it just points you in the right direction.',
        align: 'center',
      })}
      <form class="quiz card" data-quiz novalidate>
        <fieldset class="quiz__q">
          <legend>1. How much experience do you have in the kind of work this course is for?</legend>
          <div class="option-grid">
            <label class="option"><input type="radio" name="exp" value="0" required><span>None yet</span></label>
            <label class="option"><input type="radio" name="exp" value="1"><span>Less than a year</span></label>
            <label class="option"><input type="radio" name="exp" value="2"><span>1–2 years</span></label>
            <label class="option"><input type="radio" name="exp" value="3"><span>3 years or more</span></label>
          </div>
        </fieldset>
        <fieldset class="quiz__q">
          <legend>2. What are you hoping to get?</legend>
          <div class="option-grid">
            <label class="option"><input type="radio" name="goal" value="qual" required><span>A full qualification</span></label>
            <label class="option"><input type="radio" name="goal" value="skill"><span>One specific skill or refresher</span></label>
            <label class="option"><input type="radio" name="goal" value="unsure"><span>I’m not sure yet</span></label>
          </div>
        </fieldset>
        <fieldset class="quiz__q">
          <legend>3. Could you show evidence of your work – references, duties, examples?</legend>
          <div class="option-grid">
            <label class="option"><input type="radio" name="evidence" value="yes" required><span>Yes, most of it</span></label>
            <label class="option"><input type="radio" name="evidence" value="some"><span>Some of it</span></label>
            <label class="option"><input type="radio" name="evidence" value="no"><span>Not really</span></label>
          </div>
        </fieldset>
        <p class="form-error" data-quiz-error hidden role="alert">Please answer all three questions to see your result.</p>
        <button class="btn btn--primary btn--lg" type="submit">See my result</button>
        <div class="quiz__result" data-quiz-result tabindex="-1" aria-live="polite"></div>
      </form>
    </div>
  </section>

  <section class="section" id="rpl" aria-labelledby="rpl-title">
    <div class="container">
      <div class="split">
        <div>
          <p class="eyebrow">Recognition of prior learning</p>
          <h2 id="rpl-title">Your experience counts</h2>
          <p class="lead">RPL is a formal way of having the skills you already use at work assessed against a nationally recognised qualification.</p>
          <p>If you’ve worked in care, education, training, building or management – paid or unpaid, here or overseas – you may already meet many of the requirements. An assessor from the training organisation reviews your evidence, talks with you about your work, and identifies any gaps. You then complete only what’s missing.</p>
          <div class="notice notice--info">
            ${icon('info')}
            <p><strong>RPL isn’t a shortcut.</strong> You still have to prove you’re competent, and you receive exactly the same qualification as someone who studied the full course.</p>
          </div>
        </div>
        <div class="card card--soft">
          <h3 class="h4">RPL could suit you if you…</h3>
          <ul class="checklist" role="list">
            <li>${icon('check')}<span>Have worked in the industry for a year or more</span></li>
            <li>${icon('check')}<span>Do the job well but don’t hold the qualification</span></li>
            <li>${icon('check')}<span>Gained skills or qualifications overseas</span></li>
            <li>${icon('check')}<span>Need a qualification for a promotion, registration or new role</span></li>
            <li>${icon('check')}<span>Want to avoid repeating what you already know</span></li>
          </ul>
        </div>
      </div>

      <h3 class="subhead">How RPL works</h3>
      ${steps([
        { title: 'Free chat and eligibility check', text: `${site.advisor} asks about your experience and suggests the qualification that best matches it.` },
        { title: 'Self-assessment', text: 'You complete a checklist comparing your skills with the units in the qualification.' },
        { title: 'Build your evidence', text: 'You gather documents that show your skills – Poonam helps you organise them.' },
        { title: 'Talk with an assessor', text: 'The RTO’s assessor discusses your work with you and may ask you to demonstrate tasks.' },
        { title: 'Fill any gaps', text: 'If anything is missing, you complete targeted training or extra assessment.' },
        { title: 'Receive your qualification', text: 'Once you’re assessed as competent in every unit, the RTO issues your qualification.' },
      ])}
    </div>
  </section>

  <section class="section section--sand" aria-labelledby="evidence-title">
    <div class="container">
      <div class="split split--top">
        <div>
          <p class="eyebrow">Get a head start</p>
          <h2 id="evidence-title">RPL evidence checklist</h2>
          <p class="lead">Tick off what you already have. It’s a quick way to see how ready you are before your first chat.</p>
          <p class="small muted">Your ticks are saved only in this browser. Exact evidence requirements are set by the assessor.</p>
          <div class="progress" data-evidence-progress>
            <div class="progress__bar"><span data-evidence-bar style="width:0%"></span></div>
            <p class="progress__label" aria-live="polite"><strong data-evidence-count>0</strong> of ${EVIDENCE.length} ready</p>
          </div>
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
        <div>
          <p class="eyebrow">Full course online</p>
          <h2 id="online-title">Learn everything, at your own pace</h2>
          <p class="lead">If you’re new to the field, studying the full course gives you the knowledge and practice you need – without sitting in a classroom.</p>
          <p>You work through learning materials and assessments on the training organisation’s online platform, with a trainer you can contact for help. Many care and education courses include a work placement, so you practise your skills in a real workplace under supervision.</p>
        </div>
        <ul class="feature-list" role="list">
          <li>${icon('laptop')}<div><strong>Study on any device</strong><span>Phone, tablet or computer – whenever suits you.</span></div></li>
          <li>${icon('users')}<div><strong>Trainer support</strong><span>Help by phone, email or video when you’re stuck.</span></div></li>
          <li>${icon('calendar')}<div><strong>Your pace</strong><span>Most people plan for 8–15 hours a week alongside work. ${tbc('Typical weekly hours – confirm')}</span></div></li>
          <li>${icon('briefcase')}<div><strong>Real-world placement</strong><span>Required for many care and education courses.</span></div></li>
        </ul>
      </div>

      <h3 class="subhead">How online study works</h3>
      ${steps([
        { title: 'Choose and enrol', text: `${site.advisor} helps you pick a course; you enrol with the training organisation and receive your login.` },
        { title: 'Learn online', text: 'Work through each unit’s readings, videos and activities in order, at a pace that suits you.' },
        { title: 'Complete assessments', text: 'Answer questions, complete case studies and projects, and get feedback from your trainer.' },
        { title: 'Work placement', text: 'If your course needs one, put your skills into practice in a real workplace.' },
        { title: 'Get qualified', text: 'When every unit is complete, the RTO issues your qualification and transcript.' },
      ])}
    </div>
  </section>

  <section class="section section--sand" aria-labelledby="short-title">
    <div class="container">
      <div class="split split--center">
        <div>
          <p class="eyebrow">Short courses</p>
          <h2 id="short-title">Need one skill, fast?</h2>
          <p class="lead">Short online courses help care and support workers build specific skills – medication support, dementia care, infection control and more – and meet workplace training requirements.</p>
        </div>
        <div class="btn-row">
          <a class="btn btn--primary" href="short-courses.html">Browse short courses ${icon('arrow-right')}</a>
          <a class="btn btn--secondary" href="courses.html?sector=firstaid">First aid & CPR</a>
        </div>
      </div>
    </div>
  </section>

  ${ctaBand(d, { title: 'Still weighing it up?', text: `${site.advisor} can look at your experience and tell you honestly which route makes sense – and roughly how long it would take.` })}
  `;

  return {
    path: 'ways-to-study.html',
    title: 'Ways to study: RPL, online study and short courses',
    active: 'ways',
    description: 'Compare recognition of prior learning (RPL), full online study and short courses. See how each works, how long it takes and which suits you.',
    body,
  };
}
