import { site } from '../data/site.js';
import { html, icon, tbc, contactLinks } from '../templates/helpers.js';
import { pageHero } from '../templates/components.js';

export function privacy() {
  const c = contactLinks();
  const contactLine = c.email ? `<a href="${c.email.href}">${c.email.label}</a>` : `<span class="placeholder">[email address]</span>`;
  const body = html`
  ${pageHero({
    eyebrow: 'Privacy',
    title: 'Privacy notice',
    lead: 'How we collect, use and look after the personal information you share through this website.',
    crumbs: [{ label: 'Privacy' }],
    depth: 0,
  })}
  <section class="section section--tight">
    <div class="container narrow prose">

      <h2>What we collect</h2>
      <p>When you send an enquiry or complete the eligibility check, we collect the details you enter – such as your name, email, phone number, state, the course you’re interested in, and information about your work experience and qualifications.</p>

      <h2>Why we collect it</h2>
      <p>We use your information to respond to your enquiry, assess which courses and pathways may suit you, and help you enrol if you choose to. We won’t add you to a marketing list without your permission.</p>

      <h2>Who we share it with</h2>
      <p>With your agreement, we share relevant details with the Registered Training Organisation (RTO) you decide to enrol with, so they can process your enrolment. Our website form service stores submissions on our behalf. We don’t sell your information.</p>

      <h2>How we look after it</h2>
      <p>We keep your information only as long as we need it to help you, and take reasonable steps to protect it from misuse, loss and unauthorised access.</p>

      <h2>Your choices</h2>
      <p>You can ask to see, correct or delete the information we hold about you at any time. Contact ${site.advisor} at ${contactLine}.</p>

      <h2>This website</h2>
      <p>This site does not use advertising or tracking cookies. The home page shows two official careers videos: the YouTube player (in privacy-enhanced mode) loads only if you press play, and YouTube’s own privacy policy then applies. The pathway check and RPL evidence checklist run entirely in your browser; the evidence checklist remembers your ticks on your own device only.</p>
    </div>
  </section>`;

  return {
    path: 'privacy.html',
    title: 'Privacy notice',
    description: `How ${site.name} collects, uses and protects the personal information you share through enquiry and eligibility forms.`,
    body,
  };
}

export function notFound() {
  const body = html`
  <section class="section">
    <div class="container narrow center not-found">
      <p class="eyebrow">Page not found</p>
      <h1>This path doesn’t lead anywhere.</h1>
      <p class="lead">The page may have moved. Try one of these instead:</p>
      <div class="btn-row btn-row--center">
        <a class="btn btn--primary" href="index.html">Go to the home page</a>
        <a class="btn btn--secondary" href="courses.html">Browse courses</a>
        <a class="btn btn--ghost" href="contact.html">Contact Poonam</a>
      </div>
    </div>
  </section>`;
  return { path: '404.html', title: 'Page not found', description: 'Page not found.', body };
}
