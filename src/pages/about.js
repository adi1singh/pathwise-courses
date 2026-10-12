import { site } from '../data/site.js';
import { html, icon, tbc } from '../templates/helpers.js';
import { pageHero, sectionHead, ctaBand, checklist } from '../templates/components.js';

export default function about() {
  const d = 0;
  const p = site.advisor;

  const portrait = html`
    <div class="about-portrait" aria-hidden="true">
      <div class="portrait portrait--lg"><span class="portrait__initial">P</span></div>
      ${site.draft ? '<p class="meet__photo-note">Add a friendly photo of Poonam</p>' : ''}
    </div>`;

  const body = html`
  ${pageHero({
    eyebrow: `About ${p}`,
    title: `Hi, I’m ${p}. Let’s find your path.`,
    lead: 'I help people choose the right course, make the most of the experience they already have, and get through enrolment without the confusion.',
    crumbs: [{ label: `About ${p}` }],
    depth: d,
    aside: portrait,
  })}

  <section class="section section--tight" aria-labelledby="story-title">
    <div class="container narrow prose">
      <h2 id="story-title">Why I do this ${tbc('Poonam to write her own story – this is placeholder text')}</h2>
      <p>Choosing a course can feel overwhelming. There are hundreds of providers, unfamiliar codes and plenty of sales pressure. I started ${site.name} to be the person I would have wanted: someone who listens first, explains things simply, and gives an honest opinion.</p>
      <p>Many of the people I speak with already do skilled work in aged care, disability support, childcare and other fields, but don’t yet hold the qualification to prove it. Others are starting fresh and want to know the quickest sensible route into a new career. Either way, my job is to help you make a good decision – and then make the process as smooth as possible.</p>
      <p class="placeholder-note">[Placeholder – replace with Poonam’s background: her own work or study experience, how long she has been helping students, languages she speaks, and where she is based.]</p>
    </div>
  </section>

  <section class="section section--sand" aria-labelledby="help-title">
    <div class="container">
      ${sectionHead({ eyebrow: 'What I do', title: 'How I can help', id: 'help-title' })}
      <ul class="service-grid" role="list">
        <li class="service">
          <span class="service__icon">${icon('compass')}</span>
          <h3>Course advice</h3>
          <p>Talk through your goals and find a qualification that fits your experience, your timeline and the jobs you want.</p>
        </li>
        <li class="service">
          <span class="service__icon">${icon('shield')}</span>
          <h3>Free eligibility checks</h3>
          <p>Find out whether you meet the entry requirements – and whether RPL is realistic – before you spend anything.</p>
        </li>
        <li class="service">
          <span class="service__icon">${icon('file')}</span>
          <h3>RPL evidence support</h3>
          <p>Work out which documents to gather and how to organise them so your assessor can see your skills clearly.</p>
        </li>
        <li class="service">
          <span class="service__icon">${icon('route')}</span>
          <h3>Enrolment guidance</h3>
          <p>Understand the paperwork, the costs and the timeline, and get set up with the right training organisation.</p>
        </li>
        <li class="service">
          <span class="service__icon">${icon('chat')}</span>
          <h3>Check-ins along the way</h3>
          <p>A familiar person to ask when you’re stuck, unsure what’s next, or need a nudge to keep going.</p>
        </li>
        <li class="service">
          <span class="service__icon">${icon('users')}</span>
          <h3>Training for teams</h3>
          <p>Short courses and qualification pathways for employers who want to upskill their staff.</p>
        </li>
      </ul>
    </div>
  </section>

  <section class="section" aria-labelledby="expect-title">
    <div class="container">
      <div class="split split--top">
        <div>
          <p class="eyebrow">Your first conversation</p>
          <h2 id="expect-title">What to expect when we talk</h2>
          <p class="lead">Our first chat usually takes about 15 minutes, by phone, WhatsApp or video – whichever you prefer. ${tbc('Confirm how Poonam runs first calls')}</p>
          ${checklist([
            'I’ll ask about your work history, existing qualifications and goals',
            'We’ll look at the courses and pathways that suit you',
            'You’ll get a clear idea of time, costs and next steps',
            'There’s no obligation and no payment details needed',
          ])}
        </div>
        <div class="card card--soft">
          <h3 class="h4">Handy to have nearby</h3>
          ${checklist([
            'Your resume or a list of past roles',
            'Any certificates or qualifications you hold',
            'The course or job you have in mind (if you know)',
            'Questions about time, cost or placement',
          ])}
          <a class="btn btn--primary btn--block" href="contact.html">${icon('chat')} Book a chat</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--sand" aria-labelledby="honest-title">
    <div class="container narrow">
      ${sectionHead({ eyebrow: 'Being upfront', title: 'What I am – and what I’m not', id: 'honest-title', align: 'center' })}
      <div class="table-wrap">
        <table class="simple-table">
          <caption class="visually-hidden">Responsibilities of ${site.name} compared with the partner training organisation</caption>
          <thead><tr><th scope="col">${site.name} (${p})</th><th scope="col">Partner RTO</th></tr></thead>
          <tbody>
            <tr><td>Course and career guidance</td><td>Enrolment, training and assessment</td></tr>
            <tr><td>Eligibility checks and cost explanations</td><td>Decides whether you are competent</td></tr>
            <tr><td>Help organising RPL evidence</td><td>Reviews evidence and interviews you</td></tr>
            <tr><td>Ongoing support and check-ins</td><td>Issues your qualification and transcript</td></tr>
          </tbody>
        </table>
      </div>
      <p class="center small muted">${site.name} is not a Registered Training Organisation and does not issue qualifications. ${tbc('Add partner RTO names and RTO codes')}</p>
    </div>
  </section>

  ${ctaBand(d, { title: 'Let’s talk about your next step', text: 'Tell me a little about yourself and I’ll come back to you with options – not a sales pitch.' })}
  `;

  return {
    path: 'about.html',
    title: `About ${p}`,
    active: 'about',
    description: `Meet ${p}, the course advisor behind ${site.name}. Honest, plain-language help choosing a course, checking eligibility and preparing for RPL.`,
    body,
  };
}
