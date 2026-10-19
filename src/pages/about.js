import { site } from '../data/site.js';
import { html, icon, tbc, esc } from '../templates/helpers.js';
import { pageHero, sectionHead, ctaBand, checklist, advisorPortrait, advisorAvatar } from '../templates/components.js';

export default function about() {
  const d = 0;
  const p = site.advisor;

  const portrait = html`
    <div class="about-portrait">
      <div class="portrait portrait--lg">${advisorPortrait(d, { sizes: '300px', lazy: false })}</div>
      ${site.draft && !site.advisorPhoto ? '<p class="meet__photo-note">Add a friendly photo of Poonam</p>' : ''}
    </div>`;

  const body = html`
  ${pageHero({
    eyebrow: 'About us',
    title: `Hi, I’m ${p}. Let’s find your path.`,
    lead: 'I help people choose the right course, make the most of the experience they already have, and get through enrolment without the confusion.',
    crumbs: [{ label: 'About us' }],
    depth: d,
    aside: portrait,
    fill: true,
    actions: `<a class="btn btn--primary btn--lg" href="contact.html">${icon('chat')} Talk to ${p}</a><a class="btn btn--secondary btn--lg" href="#help-title">How I can help</a>`,
  })}

  <section class="section" aria-labelledby="story-title">
    <div class="container story">
      <figure class="story__quote">
        <svg class="story__mark" viewBox="0 0 48 36" aria-hidden="true" focusable="false"><path d="M0 36V22C0 9 7 2 19 0l2 6c-7 2-10 6-10 12h9v18zm27 0V22C27 9 34 2 46 0l2 6c-7 2-10 6-10 12h9v18z" fill="currentColor"/></svg>
        <blockquote><p>I wanted to be the person I would have wanted: someone who listens first, explains things simply, and gives an honest opinion.</p></blockquote>
        <figcaption><span class="avatar" aria-hidden="true">${advisorAvatar(d)}</span><span><strong>${p}</strong><span>Founder, ${site.name}</span></span></figcaption>
      </figure>
      <div class="story__text prose">
        <p class="eyebrow">My story</p>
        <h2 id="story-title">Why I do this ${tbc('Poonam to write her own story – this is placeholder text')}</h2>
        <p>Choosing a course can feel overwhelming. There are hundreds of providers, unfamiliar codes and plenty of sales pressure. I started ${site.name} to make that simpler.</p>
        <p>Many of the people I speak with already do skilled work in aged care, disability support, childcare and other fields, but don’t yet hold the qualification to prove it. Others are starting fresh and want to know the quickest sensible route into a new career. Either way, my job is to help you make a good decision – and then make the process as smooth as possible.</p>
      </div>
    </div>
  </section>

  <section class="section section--navy" aria-labelledby="help-title">
    <div class="container">
      <div class="section-head"><p class="eyebrow eyebrow--on-dark">What I do</p><h2 id="help-title">How I can help</h2></div>
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

  <section class="section section--soft" aria-labelledby="honest-title">
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

  <section class="section partner" aria-labelledby="partner-title">
    <div class="container">
      <div class="partner-card">
        <span class="partner-card__orbit" aria-hidden="true"></span>
        <div class="partner-card__intro">
          <p class="partner-card__label"><span aria-hidden="true">✳</span> Our technology partner</p>
          <h2 id="partner-title"><a class="partner-card__brand" href="https://jobgen.ai" rel="noopener">JOBGEN<span>.AI</span></a></h2>
          <h3>Human expertise.<br><em>Smarter technology.</em></h3>
          <p class="partner-card__copy">JOBGEN.AI brings websites, AI assistants and business automation together—helping businesses answer enquiries, connect with customers and grow.</p>
          <ul class="partner-card__services" role="list">
            <li>${icon('laptop')} Websites</li>
            <li>${icon('chat')} AI assistants</li>
            <li>${icon('zap')} Automation</li>
          </ul>
          <div class="partner-card__actions">
            <a class="partner-card__primary" href="https://jobgen.ai" rel="noopener">Explore JOBGEN.AI ${icon('arrow-right')}</a>
            <a class="partner-card__social" href="https://www.linkedin.com/company/jobgenai/" rel="noopener"><span class="partner-card__linkedin" aria-hidden="true">in</span> Follow on LinkedIn ${icon('external')}</a>
          </div>
        </div>
        <figure class="partner-card__photo">
          <img src="assets/img/partner/partnership-handshake-720.jpg" srcset="assets/img/partner/partnership-handshake-720.jpg 720w, assets/img/partner/partnership-handshake-1440.jpg 1440w" sizes="(min-width: 1000px) 600px, 90vw" width="1440" height="960" alt="AI-created portrait of Poonam and Kush shaking hands against a shared dark green and amber background" loading="lazy" decoding="async">
          <figcaption><span><strong>Poonam × Kush</strong><span>Pathwise Courses × JOBGEN.AI</span></span><small>AI-created portrait</small></figcaption>
        </figure>
      </div>
    </div>
  </section>

  ${ctaBand(d, { title: 'Let’s talk about your next step', text: 'Tell me a little about yourself and I’ll come back to you with options – not a sales pitch.' })}
  `;

  return {
    path: 'about.html',
    title: 'About us',
    active: 'about',
    bodyClass: 'page-about',
    description: `Meet ${p}, the course advisor behind ${site.name}. Honest, plain-language help choosing a course, checking eligibility and preparing for RPL.`,
    body,
  };
}
