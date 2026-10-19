import { faqGroups } from '../data/faqs.js';
import { html, icon } from '../templates/helpers.js';
import { pageHero, faqList, ctaBand } from '../templates/components.js';

export default function faq() {
  const d = 0;
  const body = html`
  ${pageHero({
    title: 'Questions, answered simply',
    lead: 'The things people most often ask before choosing a course. Can’t find yours? Just ask Poonam.',
    crumbs: [{ label: 'FAQ' }],
    depth: d,
  })}

  <section class="section section--tight">
    <div class="container faq-layout">
      <nav class="faq-nav" aria-label="FAQ topics">
        <p class="faq-nav__title">Topics</p>
        <ul role="list">
          ${faqGroups.map((g) => `<li><a href="#${g.id}">${g.name}</a></li>`)}
        </ul>
      </nav>
      <div class="faq-groups">
        ${faqGroups.map(
          (g) => html`<section class="faq-group" id="${g.id}" aria-labelledby="${g.id}-title">
            <h2 id="${g.id}-title">${g.name}</h2>
            ${faqList(g.items)}
          </section>`
        )}
        <div class="hint-card">
          ${icon('chat')}
          <div>
            <h2 class="hint-card__title">Still have a question?</h2>
            <p>Poonam is happy to help – there’s no such thing as a silly question.</p>
          </div>
          <a class="btn btn--primary" href="contact.html">Ask Poonam</a>
        </div>
      </div>
    </div>
  </section>

  ${ctaBand(d)}
  `;

  return {
    path: 'faq.html',
    title: 'Frequently asked questions',
    active: 'faq',
    description: 'Answers about recognition of prior learning (RPL), online study, work placements, costs, payment options and nationally recognised qualifications.',
    body,
  };
}
