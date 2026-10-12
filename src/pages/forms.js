import { site } from '../data/site.js';
import { html, icon, esc, tbc } from '../templates/helpers.js';
import { pageHero, contactOptions, formNotConnected, courseOptions, STATES } from '../templates/components.js';

// ── Field helpers ───────────────────────────────────────────────────────────
// Each field gets a hint and an error slot linked by aria-describedby. The
// browser script fills the error slot and toggles aria-invalid.

const describedBy = (id, hint) => [hint ? `${id}-hint` : '', `${id}-error`].filter(Boolean).join(' ');

const fieldWrap = ({ id, label, hint, required, optional, control }) => html`
  <div class="field" data-field>
    <label class="field__label" for="${id}">${label}${required ? '<span class="req" aria-hidden="true">*</span>' : ''}${optional ? '<span class="optional">optional</span>' : ''}</label>
    ${hint && `<p class="field__hint" id="${id}-hint">${hint}</p>`}
    ${control}
    <p class="field__error" id="${id}-error" data-error></p>
  </div>`;

const input = ({ id, name = id, label, type = 'text', required = false, optional = false, hint = '', autocomplete = '', attrs = '', msg = '' }) =>
  fieldWrap({
    id, label, hint, required, optional,
    control: `<input class="input" id="${id}" name="${name}" type="${type}"${required ? ' required' : ''}${msg ? ` data-msg="${esc(msg)}"` : ''}${autocomplete ? ` autocomplete="${autocomplete}"` : ''} aria-describedby="${describedBy(id, hint)}" ${attrs}>`,
  });

const select = ({ id, name = id, label, options, required = false, optional = false, hint = '', msg = '' }) =>
  fieldWrap({
    id, label, hint, required, optional,
    control: `<div class="select"><select class="input" id="${id}" name="${name}"${required ? ' required' : ''}${msg ? ` data-msg="${esc(msg)}"` : ''} aria-describedby="${describedBy(id, hint)}">${options}</select>${icon('chevron-down')}</div>`,
  });

const textarea = ({ id, name = id, label, optional = false, hint = '', rows = 4, maxlength = 1500 }) =>
  fieldWrap({
    id, label, hint, optional,
    control: `<textarea class="input" id="${id}" name="${name}" rows="${rows}" maxlength="${maxlength}" aria-describedby="${describedBy(id, hint)}"></textarea>`,
  });

const radios = ({ name, legend, options, required = true, hint = '', cols = '' }) => html`
  <fieldset class="field field--group" data-field${required ? ' data-required-group' : ''} aria-describedby="${hint ? `${name}-hint ` : ''}${name}-error">
    <legend class="field__label">${legend}${required ? '<span class="req" aria-hidden="true">*</span>' : ''}</legend>
    ${hint && `<p class="field__hint" id="${name}-hint">${hint}</p>`}
    <div class="option-grid${cols ? ` option-grid--${cols}` : ''}">
      ${options.map(([value, text]) => `<label class="option"><input type="radio" name="${name}" value="${esc(value)}"${required ? ' required' : ''}><span>${text}</span></label>`)}
    </div>
    <p class="field__error" id="${name}-error" data-error></p>
  </fieldset>`;

const consent = (id) => html`
  <div class="field" data-field>
    <label class="checkbox" for="${id}">
      <input type="checkbox" id="${id}" name="consent" value="yes" required aria-describedby="${id}-error">
      <span class="checkbox__box" aria-hidden="true">${icon('check')}</span>
      <span>I agree to ${esc(site.name)} contacting me about this enquiry and handling my details as described in the <a href="privacy.html">privacy notice</a>.<span class="req" aria-hidden="true">*</span></span>
    </label>
    <p class="field__error" id="${id}-error" data-error></p>
  </div>`;

// Spam trap: hidden from people and assistive tech, often filled by bots.
const honeypot = () => `<div class="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>`;

const statusArea = () => `<div class="form-status" data-form-status tabindex="-1" aria-live="polite"></div>`;

const noscript = () =>
  site.forms.endpoint
    ? ''
    : `<noscript><div class="notice notice--warn"><p>This form needs JavaScript and isn’t connected yet. Please contact ${esc(site.advisor)} directly using the details on this page.</p></div></noscript>`;

const PREFERRED = [
  ['phone', `${icon('phone')} Phone call`],
  ['whatsapp', `${icon('chat')} WhatsApp`],
  ['email', `${icon('mail')} Email`],
];

const formAttrs = (name) =>
  `class="form" data-form="${name}" method="post" action="${esc(site.forms.endpoint || '#')}" accept-charset="utf-8"`;

// ── Contact page ────────────────────────────────────────────────────────────

export function contact() {
  const d = 0;
  const body = html`
  ${pageHero({
    eyebrow: 'Contact',
    title: `Talk to ${site.advisor}`,
    lead: 'Ask a question, request a call back or tell us about your team’s training needs. However you get in touch, you’ll hear back from a real person.',
    crumbs: [{ label: 'Contact' }],
    depth: d,
  })}

  <section class="section section--tight">
    <div class="container contact-layout">
      <div class="card form-card">
        <h2 class="h3-size">Send an enquiry</h2>
        <p class="muted">Fields marked <span class="req" aria-hidden="true">*</span><span class="visually-hidden">with an asterisk</span> are required.</p>
        ${formNotConnected()}
        ${noscript()}
        <form ${formAttrs('contact')} data-subject="New enquiry from the ${esc(site.name)} website">
          ${select({
            id: 'topic', label: 'What can we help with?', required: true, msg: 'Please choose what your enquiry is about.',
            options: `<option value="">Choose one</option>
              <option value="course">A course or qualification</option>
              <option value="rpl">Recognition of prior learning (RPL)</option>
              <option value="short-course">Short courses</option>
              <option value="team">Training for my team or business</option>
              <option value="callback">Please call me back</option>
              <option value="other">Something else</option>`,
          })}
          ${select({ id: 'course', label: 'Course you’re interested in', optional: true, options: courseOptions() })}
          <div class="field-row">
            ${input({ id: 'name', label: 'Your name', required: true, msg: 'Please enter your name.', autocomplete: 'name', attrs: 'maxlength="100"' })}
            ${input({ id: 'email', label: 'Email', type: 'email', required: true, msg: 'Please enter your email address.', autocomplete: 'email', attrs: 'maxlength="150" inputmode="email"' })}
          </div>
          ${radios({ name: 'preferred', legend: 'How should Poonam contact you?', options: PREFERRED, cols: '3' })}
          <div class="field-row">
            ${input({ id: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel', hint: 'Needed for a call or WhatsApp.', attrs: 'maxlength="20" inputmode="tel" data-required-when="preferred:phone,whatsapp"' })}
            ${select({
              id: 'best_time', label: 'Best time to reach you', optional: true,
              options: `<option value="">Any time</option><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Weekend</option>`,
            })}
          </div>
          ${textarea({ id: 'message', label: 'Your message', optional: true, hint: 'Tell us a little about your experience or what you’d like to know.' })}
          ${consent('contact-consent')}
          ${honeypot()}
          <button class="btn btn--primary btn--lg" type="submit" data-submit>Send enquiry ${icon('arrow-right')}</button>
          ${statusArea()}
        </form>
      </div>

      <aside class="contact-side" aria-label="Other ways to get in touch">
        <div class="card">
          <h2 class="h4">Other ways to reach ${site.advisor}</h2>
          ${contactOptions()}
        </div>
        <div class="card card--soft">
          <h2 class="h4">${icon('clock')} Hours</h2>
          <p>${site.contact.hours ? esc(site.contact.hours) : `<span class="placeholder">Contact hours to be added</span>${tbc('Add Poonam’s contact hours')}`}</p>
          <h2 class="h4">${icon('pin')} Where we help</h2>
          <p>${site.contact.serviceArea ? esc(site.contact.serviceArea) : `<span class="placeholder">Service area to be added</span>${tbc('Add where Poonam is based and which states she helps')}`}</p>
        </div>
        <a class="side-link" href="eligibility.html">
          ${icon('shield')}
          <span><strong>Prefer a quick eligibility check?</strong><span>Answer a few questions in about 2 minutes</span></span>
          ${icon('arrow-right', 'icon--sm')}
        </a>
      </aside>
    </div>
  </section>
  `;

  return {
    path: 'contact.html',
    title: `Talk to ${site.advisor}`,
    active: 'contact',
    description: `Contact ${site.advisor} at ${site.name} about courses, recognition of prior learning, short courses or training for your team.`,
    body,
  };
}

// ── Eligibility check (multi-step) ──────────────────────────────────────────

export function eligibility() {
  const d = 0;
  const stepHead = (n, title, text) => html`
    <div class="step-head">
      <p class="step-head__count">Step ${n} of 3</p>
      <h2 class="step-head__title" tabindex="-1" data-step-title>${title}</h2>
      ${text && `<p class="muted">${text}</p>`}
    </div>`;

  const body = html`
  ${pageHero({
    eyebrow: 'Free eligibility check',
    title: 'See if you’re eligible',
    lead: `Answer a few quick questions – it takes about two minutes. ${site.advisor} will review your answers and get in touch to talk through your options. Free, with no obligation to enrol.`,
    crumbs: [{ label: 'Eligibility check' }],
    depth: d,
  })}

  <section class="section section--tight">
    <div class="container elig-layout">
      <div class="card form-card">
        ${formNotConnected()}
        ${noscript()}
        <form ${formAttrs('eligibility')} data-steps data-subject="New eligibility check from the ${esc(site.name)} website">
          <ol class="stepper" role="list" data-stepper aria-label="Progress">
            <li class="stepper__item is-current" aria-current="step"><span>1</span> Your goal</li>
            <li class="stepper__item"><span>2</span> Experience</li>
            <li class="stepper__item"><span>3</span> Your details</li>
          </ol>

          <fieldset class="form-step" data-step="1">
            <legend class="visually-hidden">Step 1 of 3: Your goal</legend>
            ${stepHead(1, 'What would you like to study?', 'If you’re not sure yet, that’s fine – Poonam can help you choose.')}
            ${select({ id: 'e-course', name: 'course', label: 'Course', options: courseOptions() })}
            ${radios({
              name: 'pathway', legend: 'Which sounds most like you?',
              options: [
                ['rpl', 'I have experience and want it recognised (RPL)'],
                ['study', 'I want to study the full course'],
                ['unsure', 'I’m not sure – please advise me'],
              ],
            })}
          </fieldset>

          <fieldset class="form-step" data-step="2">
            <legend class="visually-hidden">Step 2 of 3: Your experience</legend>
            ${stepHead(2, 'Tell us about your experience', 'Paid, unpaid, local and overseas experience all count.')}
            ${radios({
              name: 'experience', legend: 'Years of experience in this field', cols: '3',
              options: [['none', 'None yet'], ['<1', 'Less than 1'], ['1-2', '1–2 years'], ['3-5', '3–5 years'], ['5+', 'More than 5']],
            })}
            ${radios({ name: 'working_now', legend: 'Are you working in this field now?', cols: '2', options: [['yes', 'Yes'], ['no', 'No']] })}
            ${input({ id: 'e-role', name: 'role', label: 'Current or most recent job title', optional: true, autocomplete: 'organization-title', attrs: 'maxlength="120"' })}
            ${textarea({ id: 'e-quals', name: 'qualifications', label: 'Qualifications or certificates you already have', optional: true, rows: 3, hint: 'Include overseas qualifications, first aid and short courses.' })}
            ${select({
              id: 'e-state', name: 'state', label: 'Where do you live?', required: true, msg: 'Please choose your state or territory.',
              options: `<option value="">Choose your state or territory</option>${STATES.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}`,
            })}
          </fieldset>

          <fieldset class="form-step" data-step="3">
            <legend class="visually-hidden">Step 3 of 3: Your details</legend>
            ${stepHead(3, 'How can Poonam reach you?', 'Your details are only used to respond to your eligibility check.')}
            <div class="field-row">
              ${input({ id: 'e-first', name: 'first_name', label: 'First name', required: true, msg: 'Please enter your first name.', autocomplete: 'given-name', attrs: 'maxlength="60"' })}
              ${input({ id: 'e-last', name: 'last_name', label: 'Last name', required: true, msg: 'Please enter your last name.', autocomplete: 'family-name', attrs: 'maxlength="60"' })}
            </div>
            <div class="field-row">
              ${input({ id: 'e-email', name: 'email', label: 'Email', type: 'email', required: true, msg: 'Please enter your email address.', autocomplete: 'email', attrs: 'maxlength="150" inputmode="email"' })}
              ${input({ id: 'e-phone', name: 'phone', label: 'Mobile', type: 'tel', required: true, msg: 'Please enter your mobile number.', autocomplete: 'tel', attrs: 'maxlength="20" inputmode="tel"' })}
            </div>
            ${radios({ name: 'preferred', legend: 'Preferred way to be contacted', options: PREFERRED, cols: '3' })}
            ${consent('e-consent')}
            ${honeypot()}
          </fieldset>

          <div class="form-nav">
            <button class="btn btn--secondary" type="button" data-step-back hidden>${icon('arrow-left')} Back</button>
            <button class="btn btn--primary btn--lg" type="button" data-step-next hidden>Next ${icon('arrow-right')}</button>
            <button class="btn btn--primary btn--lg" type="submit" data-submit>Send my eligibility check ${icon('arrow-right')}</button>
          </div>
          ${statusArea()}
        </form>
      </div>

      <aside class="elig-side" aria-label="About the eligibility check">
        <div class="card card--soft">
          <h2 class="h4">What happens next?</h2>
          <ol class="mini-steps" role="list">
            <li><span>1</span>${site.advisor} reviews your answers.</li>
            <li><span>2</span>She contacts you the way you prefer to talk through options.</li>
            <li><span>3</span>If you decide to go ahead, she helps you enrol with the right training organisation.</li>
          </ol>
        </div>
        <div class="card">
          <h2 class="h4">Rather talk now?</h2>
          ${contactOptions()}
        </div>
      </aside>
    </div>
  </section>
  `;

  return {
    path: 'eligibility.html',
    title: 'Free eligibility check',
    active: 'eligibility',
    description: `Find out if you're eligible for a nationally recognised course or RPL. Answer a few quick questions and ${site.advisor} will be in touch – free, with no obligation.`,
    body,
  };
}
