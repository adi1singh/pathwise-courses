import { site } from '../data/site.js';
import { courses, sectors } from '../data/courses.js';
import { faqGroups } from '../data/faqs.js';
import { html, link, icon, tbc } from '../templates/helpers.js';
import { courseCard, sectionHead, steps, faqList, ctaBand } from '../templates/components.js';

export default function home() {
  const d = 0;
  const popular = courses.filter((c) => c.popular).slice(0, 6);
  const faqs = [faqGroups[0].items[0], faqGroups[1].items[1], faqGroups[0].items[2], faqGroups[3].items[0]];

  const body = html`
  <section class="hero">
    <div class="container hero__inner">
      <div class="hero__text">
        <p class="eyebrow eyebrow--pill">${icon('route')} Course guidance with ${site.advisor}</p>
        <h1>Find the right course, with a real person to guide you.</h1>
        <p class="lead">
          Nationally recognised qualifications in care, education, training, leadership and building – through
          recognition of prior learning, online study or short courses. Talk it through with ${site.advisor} first.
          No pressure, no jargon.
        </p>
        <div class="btn-row">
          <a class="btn btn--primary btn--lg" href="eligibility.html">Check my eligibility ${icon('arrow-right')}</a>
          <a class="btn btn--secondary btn--lg" href="courses.html">Browse courses</a>
        </div>
        <ul class="hero__points" role="list">
          <li>${icon('check')} Free, no-obligation chat</li>
          <li>${icon('check')} Use your experience to get qualified sooner</li>
          <li>${icon('check')} Study online, around work and family</li>
        </ul>
      </div>

      <div class="hero__aside">
        <div class="path-card">
          <p class="path-card__title">Your path to a qualification</p>
          <ol class="path-card__steps" role="list">
            <li><span class="path-card__dot">${icon('chat')}</span><div><strong>Have a chat</strong><span>Share your experience and goals</span></div></li>
            <li><span class="path-card__dot">${icon('compass')}</span><div><strong>Choose your course</strong><span>And the best way to get it</span></div></li>
            <li><span class="path-card__dot">${icon('file')}</span><div><strong>Show or build your skills</strong><span>Evidence for RPL, or study online</span></div></li>
            <li><span class="path-card__dot path-card__dot--done">${icon('award')}</span><div><strong>Get qualified</strong><span>Issued by a registered training organisation</span></div></li>
          </ol>
        </div>
        <form class="finder" action="courses.html" method="get" data-finder>
          <label for="finder-sector" class="finder__label">I’d like to work in…</label>
          <div class="finder__row">
            <select id="finder-sector" name="sector">
              <option value="">Any area</option>
              ${sectors.map((s) => `<option value="${s.id}">${s.name}</option>`)}
            </select>
            <button class="btn btn--primary" type="submit">Show courses</button>
          </div>
        </form>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="start-title">
    <div class="container">
      ${sectionHead({
        eyebrow: 'Start here',
        title: 'Where are you starting from?',
        id: 'start-title',
        lead: 'Everyone’s path is different. Pick the one that sounds most like you.',
      })}
      <div class="grid grid--3">
        <a class="choice-card" href="ways-to-study.html#rpl">
          <span class="choice-card__icon choice-card__icon--teal">${icon('briefcase')}</span>
          <h3>“I’ve been doing this work for a while.”</h3>
          <p>Have your experience formally assessed through <strong>recognition of prior learning (RPL)</strong> and only study the parts you’re missing.</p>
          <span class="link-arrow">How RPL works ${icon('arrow-right')}</span>
        </a>
        <a class="choice-card" href="ways-to-study.html#online">
          <span class="choice-card__icon choice-card__icon--sun">${icon('laptop')}</span>
          <h3>“I’m new to this kind of work.”</h3>
          <p>Study the <strong>full course online</strong> at your own pace, with trainer support and a work placement where the course needs one.</p>
          <span class="link-arrow">How online study works ${icon('arrow-right')}</span>
        </a>
        <a class="choice-card" href="short-courses.html">
          <span class="choice-card__icon choice-card__icon--coral">${icon('zap')}</span>
          <h3>“I need a specific skill or refresher.”</h3>
          <p>Pick up a <strong>short course</strong> – from first aid and CPR to dementia, medication or behaviour support.</p>
          <span class="link-arrow">See short courses ${icon('arrow-right')}</span>
        </a>
      </div>
    </div>
  </section>

  <section class="section section--sand" aria-labelledby="sectors-title">
    <div class="container">
      ${sectionHead({
        eyebrow: 'Browse by area',
        title: 'Courses for careers that matter',
        id: 'sectors-title',
        lead: 'Every qualification here is part of Australia’s national training system.',
      })}
      <ul class="sector-grid" role="list">
        ${sectors.map((s) => {
          const n = courses.filter((c) => c.sector === s.id).length;
          return html`<li>
            <a class="sector-tile sector-tile--${s.id}" href="courses.html?sector=${s.id}">
              <span class="sector-tile__icon">${icon(s.icon)}</span>
              <span class="sector-tile__body">
                <span class="sector-tile__name">${s.name}</span>
                <span class="sector-tile__blurb">${s.blurb}</span>
              </span>
              <span class="sector-tile__count">${n} ${n === 1 ? 'course' : 'courses'}</span>
            </a>
          </li>`;
        })}
      </ul>
    </div>
  </section>

  <section class="section" aria-labelledby="popular-title">
    <div class="container">
      <div class="section-head section-head--row">
        <div>
          <p class="eyebrow">Popular choices</p>
          <h2 id="popular-title">Courses people ask about most</h2>
        </div>
        <a class="btn btn--secondary" href="courses.html">See all ${courses.length} courses ${icon('arrow-right')}</a>
      </div>
      <div class="course-grid course-grid--home">
        ${popular.map((c) => courseCard(c, d))}
      </div>
    </div>
  </section>

  <section class="section section--ink" aria-labelledby="how-title">
    <div class="container how">
      <div class="how__intro">
        <p class="eyebrow eyebrow--on-dark">How it works</p>
        <h2 id="how-title">Four simple steps, with ${site.advisor} beside you</h2>
        <p class="lead">You’ll always know what happens next, who you’re dealing with and what it costs – before you commit to anything.</p>
        <a class="btn btn--sun" href="ways-to-study.html">Compare ways to study ${icon('arrow-right')}</a>
      </div>
      ${steps([
        { title: 'Have a chat', text: `Tell ${site.advisor} about your work history, any qualifications you hold and where you’d like to go next.` },
        { title: 'Check your eligibility', text: 'Together you’ll pick the right course and pathway, and confirm the entry requirements with the training provider.' },
        { title: 'Enrol and get started', text: 'You enrol with a registered training organisation, then either build your RPL evidence or start studying online.' },
        { title: 'Get qualified', text: 'Once you’re assessed as competent, the training organisation issues your nationally recognised qualification.' },
      ])}
    </div>
  </section>

  <section class="section" aria-labelledby="meet-title">
    <div class="container meet">
      <div class="meet__portrait" aria-hidden="true">
        <div class="portrait">
          <span class="portrait__initial">P</span>
        </div>
        ${site.draft ? '<p class="meet__photo-note">Photo of Poonam goes here</p>' : ''}
      </div>
      <div class="meet__text">
        <p class="eyebrow">Meet your advisor</p>
        <h2 id="meet-title">Hi, I’m ${site.advisor}.</h2>
        <p class="lead">I help people turn the skills they already have into qualifications that open doors – and I’ll give you a straight answer about what’s right for you.${tbc('Poonam to review and personalise this introduction')}</p>
        <ul class="values" role="list">
          <li>${icon('shield')}<div><strong>Honest advice.</strong> If a course or pathway isn’t right for you, I’ll tell you.</div></li>
          <li>${icon('chat')}<div><strong>Plain language.</strong> No jargon – just clear next steps and clear costs.</div></li>
          <li>${icon('user')}<div><strong>One familiar contact.</strong> Questions go to me, from your first chat to your certificate.</div></li>
        </ul>
        <div class="btn-row">
          <a class="btn btn--primary" href="contact.html">${icon('chat')} Talk to ${site.advisor}</a>
          <a class="btn btn--ghost" href="about.html">More about me</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--sand" aria-labelledby="clear-title">
    <div class="container">
      ${sectionHead({
        eyebrow: 'Clear from the start',
        title: 'Who does what',
        id: 'clear-title',
        lead: 'Only a Registered Training Organisation (RTO) can issue a nationally recognised qualification. Here’s how the work is shared.',
      })}
      <div class="grid grid--2 who">
        <div class="who__card">
          <h3>${icon('user')} ${site.advisor} at ${site.shortName}</h3>
          <ul class="checklist" role="list">
            <li>${icon('check')}<span>Helps you choose the right course and pathway</span></li>
            <li>${icon('check')}<span>Checks your eligibility and explains the costs</span></li>
            <li>${icon('check')}<span>Guides you through enrolment and organising evidence</span></li>
            <li>${icon('check')}<span>Checks in and answers questions along the way</span></li>
          </ul>
        </div>
        <div class="who__card">
          <h3>${icon('award')} The partner RTO ${tbc('Add partner RTO names and RTO codes')}</h3>
          <ul class="checklist" role="list">
            <li>${icon('check')}<span>Enrols you and provides the training</span></li>
            <li>${icon('check')}<span>Assesses your skills and evidence</span></li>
            <li>${icon('check')}<span>Arranges work placement requirements</span></li>
            <li>${icon('check')}<span>Issues your qualification and transcript</span></li>
          </ul>
        </div>
      </div>
      <p class="who__note">${icon('info')}<span>You’ll always know which RTO you’re enrolling with before you pay anything. You can look up any course or RTO on <a href="https://training.gov.au" rel="noopener">training.gov.au</a>.</span></p>
    </div>
  </section>

  <section class="section" aria-labelledby="faq-title">
    <div class="container narrow">
      ${sectionHead({ eyebrow: 'Questions', title: 'Good questions to ask first', id: 'faq-title', align: 'center' })}
      ${faqList(faqs)}
      <p class="center"><a class="link-arrow" href="faq.html">Read all FAQs ${icon('arrow-right')}</a></p>
    </div>
  </section>

  ${ctaBand(d)}
  `;

  return {
    path: 'index.html',
    title: '',
    description: `Friendly course guidance from ${site.advisor}. Find nationally recognised courses in care, early childhood, training, leadership and building – via RPL, online study or short courses.`,
    body,
  };
}
