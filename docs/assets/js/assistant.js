/* Pathwise Courses – chat assistant.
   A rule-based helper: it answers only from this site's own content (courses,
   typical prices, FAQs) and points people to the right page or to Poonam.
   No outside AI service is called and nothing typed here is sent anywhere. */
(() => {
  'use strict';

  const root = document.querySelector('[data-assistant]');
  if (!root) return;
  const toggle = root.querySelector('[data-assistant-toggle]');
  const panel = root.querySelector('[data-assistant-panel]');
  const base = root.dataset.root || '';
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (d) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICON = {
    x: icon('<path d="M18 6 6 18M6 6l12 12"/>'),
    send: icon('<path d="M4 12 20 4l-6 16-3-7z"/>'),
    arrow: icon('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  };
  const QUICK = [
    ['find', 'Help me find a course'],
    ['rpl', 'What is RPL?'],
    ['cost', 'How much do courses cost?'],
    ['talk', `Talk to a person`],
  ];

  let data = null;
  let log;
  let input;
  let built = false;

  const load = async () => {
    if (data) return data;
    try {
      const res = await fetch(`${base}assets/data/assistant.json`);
      data = await res.json();
    } catch {
      data = { advisor: 'Poonam', courses: [], faqs: [], contact: {} };
    }
    return data;
  };

  const add = (who, html) => {
    const msg = document.createElement('div');
    msg.className = `assistant__msg assistant__msg--${who}`;
    msg.innerHTML = html;
    log.append(msg);
    log.scrollTop = log.scrollHeight;
    return msg;
  };

  const chips = (items) =>
    `<div class="assistant__chips">${items.map(([id, label]) => `<button type="button" class="assistant__chip" data-quick="${id}">${esc(label)}</button>`).join('')}</div>`;

  const link = (href, label) => `<a class="assistant__link" href="${base}${href}">${esc(label)} ${ICON.arrow}</a>`;

  const priceLine = (c) => {
    if (c.fees) return esc(c.fees);
    if (!c.price?.study) return 'ask for a quote';
    return `typically ${esc(c.price.study)} to study${c.price.rpl ? `, ${esc(c.price.rpl)} with RPL` : ''}`;
  };

  const courseCards = (list) =>
    `<ul class="assistant__courses">${list
      .map((c) => `<li><a href="${base}${c.href}"><img src="${base}${c.img}" alt="" width="56" height="42" loading="lazy"><span><strong>${esc(c.title)}</strong><span>${esc(c.level)} · ${priceLine(c)}</span></span></a></li>`)
      .join('')}</ul>`;

  // Rank courses with the same search the course catalogue uses.
  const findCourses = (q) => {
    const S = window.PathwiseSearch;
    if (!S) return [];
    return data.courses
      .map((c, i) => ({ c, i, score: S.scoreCard({ dataset: { sTitle: c.s.title, sKeywords: c.s.keywords, sRoles: c.s.roles, sText: c.s.text, code: c.code } }, q) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || a.i - b.i)
      .map((r) => r.c);
  };

  // Search with the meaningful words only; if the whole phrase finds nothing,
  // fall back to the best single-word matches.
  const INTENT = /\b(price|prices|cost|costs|fee|fees|much|expensive|cheap|afford|pay|course|courses|about|tell|want|need|looking|find|study|info|information|please)\b/g;
  const findLoose = (q) => {
    const core = words(q.replace(INTENT, ' ')).join(' ');
    if (!core) return [];
    const all = findCourses(core);
    if (all.length) { all.strict = true; return all; }
    const seen = new Map();
    for (const w of core.split(' ')) findCourses(w).forEach((c, i) => { if (!seen.has(c.code) || seen.get(c.code) > i) seen.set(c.code, i); });
    return [...seen.entries()].sort((a, b) => a[1] - b[1]).map(([code]) => data.courses.find((c) => c.code === code));
  };

  const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'do', 'does', 'i', 'my', 'me', 'to', 'of', 'and', 'or', 'in', 'for', 'can', 'how', 'what', 'it', 'you', 'be', 'with', 'on', 'this', 'that', 'much', 'get']);
  const words = (s) => s.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  const bestFaq = (q) => {
    const qw = new Set(words(q));
    if (!qw.size) return null;
    let best = null;
    let bestScore = 0;
    for (const f of data.faqs) {
      const fw = words(f.q);
      const hits = fw.filter((w) => qw.has(w) || [...qw].some((x) => x.length > 4 && (w.startsWith(x.slice(0, 5)) || x.startsWith(w.slice(0, 5))))).length;
      const score = hits / Math.max(3, Math.sqrt(fw.length * qw.size));
      if (score > bestScore) { bestScore = score; best = f; }
    }
    return bestScore >= 0.45 ? best : null;
  };

  const talk = () => {
    const c = data.contact || {};
    const ways = [
      c.phone && `<a class="assistant__link" href="tel:${esc(c.phone.replace(/[^\d+]/g, ''))}">Call ${esc(c.phone)}</a>`,
      c.whatsapp && `<a class="assistant__link" href="https://wa.me/${esc(c.whatsapp)}">Message on WhatsApp</a>`,
      c.email && `<a class="assistant__link" href="mailto:${esc(c.email)}">Email ${esc(c.email)}</a>`,
    ].filter(Boolean);
    return `<p>I’m an automated helper. For real advice about your situation, talk to ${esc(data.advisor)}: she’ll listen to your experience and suggest what fits.</p>${ways.join('')}${link('contact.html', `Contact ${data.advisor}`)}`;
  };

  const answer = (q) => {
    const text = q.toLowerCase();
    const found = findLoose(q);
    const top = found.slice(0, 3);

    if (/\b(talk|call|phone|contact|person|human|speak|whatsapp|email)\b/.test(text)) return talk();

    if (/\b(price|prices|cost|costs|fee|fees|how much|expensive|cheap|afford|pay)\b/.test(text)) {
      if (top.length && found.length < data.courses.length) {
        return `<p>Here are typical prices across Australian providers. These are not ${esc(data.advisor)}’s prices: she’ll give you an exact quote.</p>${courseCards(top)}`;
      }
      return `<p>Prices depend on the course, the provider and whether you study the full course or use RPL. For example, first aid is around $95–$190, and most Certificate III and IV courses are a few thousand dollars. Every course page shows a typical range.</p>${link('courses.html', 'See courses with typical prices')}${link('contact.html', 'Ask for an exact quote')}`;
    }

    if (/\b(rpl|recognition|prior learning|experience|already work|skills recognised)\b/.test(text)) {
      const f = data.faqs.find((x) => /what is recognition of prior learning/i.test(x.q));
      return `<p>${esc(f ? f.a : 'Recognition of prior learning (RPL) assesses the skills you already have against a qualification, so you only complete what’s missing.')}</p>${link('ways-to-study.html#rpl', 'How RPL works')}${link('ways-to-study.html#evidence-title', 'RPL evidence checklist')}`;
    }

    const faq = bestFaq(q);
    if (faq && !found.strict) return `<p><strong>${esc(faq.q)}</strong></p><p>${esc(faq.a)}</p>${link('faq.html', 'More questions answered')}`;
    if (top.length && found.length < data.courses.length) {
      return `<p>These courses match “${esc(q)}”:</p>${courseCards(top)}${found.length > 3 ? link(`courses.html?q=${encodeURIComponent(q)}`, `See all ${found.length} matches`) : ''}`;
    }
    if (faq) return `<p><strong>${esc(faq.q)}</strong></p><p>${esc(faq.a)}</p>${link('faq.html', 'More questions answered')}`;

    return `<p>I’m not sure about that one. Try a job or topic, like “aged care”, “childcare” or “first aid”, or let the course finder suggest options.</p>${link('course-finder.html', 'Answer 4 quick questions')}${link('contact.html', `Ask ${data.advisor}`)}`;
  };

  const quick = (id) => {
    if (id === 'find') {
      add('user', esc('Help me find a course'));
      add('bot', `<p>What kind of work interests you? Type a job or topic (like “disability support” or “teacher aide”), or try the course finder.</p>${link('course-finder.html', 'Answer 4 quick questions')}`);
      input.focus();
      return;
    }
    const label = QUICK.find(([k]) => k === id)?.[1] || id;
    add('user', esc(label));
    add('bot', id === 'talk' ? talk() : answer(id === 'rpl' ? 'what is rpl' : 'how much do courses cost'));
  };

  const build = async () => {
    panel.innerHTML = `
      <header class="assistant__head">
        <span class="assistant__face" aria-hidden="true">${toggle.querySelector('.assistant__face').innerHTML}</span>
        <div><h2 class="assistant__title">Course questions</h2><p class="assistant__sub">Automated helper · answers from this site</p></div>
        <button type="button" class="assistant__close" aria-label="Close" data-assistant-close>${ICON.x}</button>
      </header>
      <div class="assistant__log" role="log" aria-live="polite" tabindex="0" aria-label="Conversation"></div>
      <form class="assistant__form" autocomplete="off">
        <label class="visually-hidden" for="assistant-input">Type your question</label>
        <input id="assistant-input" class="assistant__input" type="text" placeholder="Ask about a course, RPL or prices…" maxlength="200">
        <button class="assistant__send" type="submit" aria-label="Send">${ICON.send}</button>
      </form>`;
    log = panel.querySelector('.assistant__log');
    input = panel.querySelector('.assistant__input');
    await load();
    add('bot', `<p>Hi! I’m an automated helper for ${esc(data.advisor)}’s course advice. I can help you find a course, explain RPL or show typical prices.</p>${chips(QUICK)}`);
    panel.addEventListener('click', (e) => {
      const q = e.target.closest('[data-quick]');
      if (q) quick(q.dataset.quick);
      if (e.target.closest('[data-assistant-close]')) setOpen(false);
    });
    panel.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      input.value = '';
      add('user', esc(q));
      const reply = add('bot', '<p class="assistant__typing" aria-label="Typing"><span></span><span></span><span></span></p>');
      setTimeout(() => { reply.innerHTML = answer(q); log.scrollTop = log.scrollHeight; }, 450);
    });
    built = true;
  };

  const setOpen = async (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-open', open);
    panel.hidden = !open;
    if (open) {
      if (!built) await build();
      input.focus();
    } else {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
  });
})();
