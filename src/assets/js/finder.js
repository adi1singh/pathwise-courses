/* Pathwise course finder: one question at a time, then suggestions with
   reasons. Suggestions use only the course data embedded in the page and are
   presented as initial guidance – no scores, no guarantees. */
(() => {
  'use strict';

  const root = document.querySelector('[data-finder]');
  if (!root) return;

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (d) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ARROW = svg('<path d="M5 12h14M13 6l6 6-6 6"/>');
  const CHECK = svg('<path d="M20 6 9 17l-5-5"/>');
  const ROUTE = svg('<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H17a3.5 3.5 0 0 0 0-7H7a3.5 3.5 0 0 1 0-7h8.5"/>');
  const config = (() => { try { return JSON.parse($('#site-config').textContent); } catch { return {}; } })();
  const data = JSON.parse($('#finder-data').textContent);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const draftMark = '';

  const form = $('[data-finder-form]', root);
  const results = $('[data-finder-results]', root);
  const count = $('[data-finder-count]', root);
  const error = $('[data-finder-error]', root);
  const back = $('[data-finder-back]', root);
  const next = $('[data-finder-next]', root);
  const fieldsets = Object.fromEntries($$('[data-q]', form).map((f) => [f.dataset.q, f]));

  const ORDER = { unit: 0, cert3: 1, cert4: 2, diploma: 3, 'adv-diploma': 4 };
  const HELD = { none: 0, cert3: 1, cert4: 2, diploma: 3 };
  const HELD_NAME = { cert3: 'Certificate III', cert4: 'Certificate IV', diploma: 'Diploma' };
  const YEARS = { none: 0, '<1': 0.5, '1-2': 1.5, '3-5': 4, '5+': 6 };
  const EXP_PHRASE = { '1-2': '1–2 years’ experience', '3-5': '3–5 years’ experience', '5+': 'more than 5 years’ experience' };
  const SHORT_Q = { interest: 'Interest', exp: 'Experience', held: 'Qualification', goal: 'Goal' };

  const answers = {};
  let index = 0;
  let editing = false;

  const active = () => data.questions.filter((q) => !(q.skipFor || []).includes(answers.interest));
  const label = (qid, value) => data.questions.find((q) => q.id === qid)?.options.find((o) => o.id === value)?.label ?? value;
  const firstUnanswered = () => active().findIndex((q) => !answers[q.id]);

  const syncUrl = (showingResults) => {
    const url = new URL(location.href);
    ['interest', 'exp', 'held', 'goal'].forEach((k) => {
      if (answers[k] && active().some((q) => q.id === k)) url.searchParams.set(k, answers[k]);
      else url.searchParams.delete(k);
    });
    url.hash = showingResults ? 'results' : '';
    history.replaceState(null, '', url);
  };

  /* ── Questions ─────────────────────────────────────────────────────── */
  const showQuestion = (i, { focus = true } = {}) => {
    const qs = active();
    index = Math.max(0, Math.min(i, qs.length - 1));
    const q = qs[index];
    form.hidden = false;
    results.hidden = true;
    error.hidden = true;
    Object.values(fieldsets).forEach((f) => { f.hidden = f !== fieldsets[q.id]; });
    const fs = fieldsets[q.id];
    $$('input', fs).forEach((r) => { r.checked = r.value === answers[q.id]; });
    if (!reduceMotion) {
      fs.classList.remove('is-entering');
      void fs.offsetWidth;
      fs.classList.add('is-entering');
    }
    count.textContent = `Question ${index + 1} of ${qs.length}`;
    $$('[data-track]', form).forEach((stop) => {
      const pos = qs.findIndex((x) => x.id === stop.dataset.track);
      stop.hidden = pos === -1;
      stop.classList.toggle('is-current', pos === index);
      stop.classList.toggle('is-done', pos > -1 && pos < index);
    });
    back.hidden = index === 0;
    const last = index === qs.length - 1 || (editing && qs.every((x) => x === q || answers[x.id]));
    next.innerHTML = last ? `See my suggestions ${ARROW}` : `Next ${ARROW}`;
    syncUrl(false);
    layout?.classList.remove('has-results');
    resting();
    renderAnswers();
    if (focus) $('[data-q-title]', fs).focus({ preventScroll: true });
    if (focus) root.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const advance = () => {
    const q = active()[index];
    const chosen = $(`input[name="${q.id}"]:checked`, form);
    if (!chosen) {
      error.hidden = false;
      $(`input[name="${q.id}"]`, form).focus();
      return;
    }
    answers[q.id] = chosen.value;
    error.hidden = true;
    const gap = firstUnanswered();
    if (gap === -1 && (editing || index === active().length - 1)) showResults();
    else if (editing && gap > -1) showQuestion(gap);
    else showQuestion(index + 1);
  };

  form.addEventListener('submit', (e) => { e.preventDefault(); advance(); });
  back.addEventListener('click', () => showQuestion(index - 1));
  form.addEventListener('change', () => { error.hidden = true; });
  // A pointer click on an answer moves on automatically; keyboard users
  // (arrow keys, Space) choose and then press Next or Enter.
  form.addEventListener('click', (e) => {
    const input = e.target.closest('input[type="radio"]');
    if (input && e.detail > 0) setTimeout(advance, reduceMotion ? 0 : 160);
  });

  /* ── Photo preview beside the questions ────────────────────────────── */
  const layout = root.closest('[data-finder-layout]');
  const preview = $('[data-finder-preview]');
  const slides = preview ? $$('[data-preview]', preview) : [];
  const answerList = preview && $('[data-preview-answers]', preview);
  const showSlide = (id) => slides.forEach((sl) => sl.classList.toggle('is-shown', sl.dataset.preview === (id || '')));
  const resting = () => showSlide(answers.interest || $('input[name="interest"]:checked', form)?.value);
  const renderAnswers = () => {
    if (!answerList) return;
    const done = active().filter((q) => answers[q.id]);
    answerList.hidden = !done.length;
    answerList.innerHTML = done.map((q) => `<li><span>${SHORT_Q[q.id]}</span><strong>${esc(label(q.id, answers[q.id]))}</strong></li>`).join('');
  };
  if (preview) {
    const pick = (e) => {
      const opt = e.target.closest('[data-preview-for]');
      if (opt) showSlide(opt.dataset.previewFor);
    };
    form.addEventListener('mouseover', pick);
    form.addEventListener('focusin', pick);
    form.addEventListener('mouseleave', resting);
    form.addEventListener('change', resting);
  }

  /* ── Suggestions ───────────────────────────────────────────────────── */
  const recommend = () => {
    const interest = data.interests[answers.interest];
    const held = answers.interest === 'firstaid' ? 0 : HELD[answers.held] ?? 0;
    const years = YEARS[answers.exp] ?? 0;
    const goal = answers.goal;
    const out = [];

    for (const code of interest.courses) {
      const c = data.courses[code];
      const L = ORDER[c.level];
      if (!c.unit && L <= held) continue; // already hold this level or higher
      const why = [];
      let score = 0;

      why.push(answers.interest === 'unsure' ? `A common starting point in ${c.area.toLowerCase()}.` : `Matches your interest in ${interest.phrase}.`);

      if (c.unit) {
        score += c.code === 'HLTAID011' ? 6 : 5;
        why.push(c.code === 'HLTAID011' ? 'The standard workplace first aid certificate, and it includes CPR.' : 'A short CPR certificate that many workplaces ask you to renew each year.');
      } else {
        const gap = L - held;
        if (gap === 1) {
          score += 6;
          why.push(held === 0 ? `${c.levelName} is the usual first qualification in this area when you don’t hold one yet.` : `It’s the next level up from your ${HELD_NAME[answers.held]}.`);
        } else if (gap === 2) {
          score += 3;
          if (years >= 3) {
            score += 2;
            why.push(`With ${EXP_PHRASE[answers.exp]}, you may be able to start at ${c.levelName} level. The training provider confirms the entry requirements.`);
          }
        } else {
          score += 1;
        }
        if (goal === 'start') {
          if (gap === 1) score += 3;
          if (L >= 3) score -= 2;
          if (c.placement?.required && years < 1) why.push('Includes a supervised work placement, so you build real experience while you study.');
        }
        if (goal === 'qualify') {
          if (gap === 1) score += 2;
          if (c.pathways.includes('rpl') && years >= 1) why.push('Your experience may count towards it through recognition of prior learning (RPL).');
        }
        if (goal === 'stepup') {
          if (data.stepUp.includes(code)) {
            score += 4;
            why.push(`Can lead to roles such as ${c.roles.slice(0, 2).map((r) => r.toLowerCase()).join(' or ')}.`);
          }
          if (L >= 3) score += 1;
        }
      }

      let pathway;
      if (c.unit) {
        pathway = { id: 'study', name: 'Online learning + a short practical session', time: c.study, text: 'Complete the theory online, then show the practical skills to an assessor in person.' };
      } else if (c.pathways.includes('rpl') && years >= 3) {
        pathway = { id: 'rpl', name: 'Recognition of prior learning (RPL)', time: (c.rpl || '').replace(/^Often /, ''), text: `Your ${EXP_PHRASE[answers.exp]} may be assessed against the qualification, so you only complete what’s missing.` };
      } else if (c.pathways.includes('rpl') && years >= 1) {
        pathway = { id: 'unsure', name: 'Online study, with credit for what you know', time: c.study, text: 'Some of your experience may be recognised through RPL, with online study for the rest. Poonam can help you work out the mix.' };
      } else {
        pathway = { id: 'study', name: 'Full course, studied online', time: c.study, text: c.placement?.required ? `Learn step by step with trainer support. ${c.placement.detail}.` : 'Learn step by step online with trainer support.' };
      }

      out.push({ c, score, why: why.slice(0, 3), pathway });
    }
    out.sort((a, b) => b.score - a.score || ORDER[a.c.level] - ORDER[b.c.level]);
    return out;
  };

  const linkFor = (s) => {
    const q = new URLSearchParams({ course: s.c.code, pathway: s.pathway.id, from: 'finder' });
    if (answers.exp) q.set('exp', answers.exp);
    return `eligibility.html?${q}`;
  };

  const suggestionCard = (s, i) => `
    <article class="suggestion${i === 0 ? ' suggestion--first' : ''}" aria-labelledby="sg-${s.c.code}">
      <div class="suggestion__top">
        <span class="chip chip--${s.c.sector}">${esc(s.c.area)}</span>
        <span class="suggestion__level">${esc(s.c.levelName)}, ${esc(s.c.code)}</span>
      </div>
      <h3 id="sg-${s.c.code}"><a href="${s.c.href}">${esc(s.c.title)}</a></h3>
      <div class="suggestion__cols">
        <div>
          <h4>Why it may fit</h4>
          <ul class="checklist" role="list">${s.why.map((w) => `<li>${CHECK}<span>${esc(w)}</span></li>`).join('')}</ul>
        </div>
        <div class="suggestion__path">
          <h4>${ROUTE} Possible pathway</h4>
          <p class="suggestion__path-name">${esc(s.pathway.name)}</p>
          <p class="suggestion__path-time">Typical time: ${esc(s.pathway.time)}${draftMark}</p>
          <p>${esc(s.pathway.text)}</p>
        </div>
      </div>
      <div class="suggestion__actions">
        <a class="btn btn--primary" href="${linkFor(s)}">Ask ${esc(config.advisor || 'Poonam')} about this course ${ARROW}</a>
        <a class="link-arrow" href="${s.c.href}">Course details ${ARROW}</a>
      </div>
    </article>`;

  const showResults = ({ focus = true } = {}) => {
    editing = false;
    const all = recommend();
    const top = all.slice(0, 3);
    const more = all.slice(3);
    const interest = data.interests[answers.interest];
    const summary = active().map((q) => `${SHORT_Q[q.id]}: ${label(q.id, answers[q.id])}`).join('; ');

    try {
      sessionStorage.setItem('pathwise-finder', JSON.stringify({
        answers,
        summary,
        suggestions: top.map((s) => ({ code: s.c.code, title: s.c.title, pathway: s.pathway.name })),
      }));
    } catch { /* storage unavailable */ }

    results.innerHTML = `
      <div class="results-head">
        <p class="eyebrow">Your suggestions</p>
        <h2 tabindex="-1" data-results-title>${top.length ? 'Courses that may suit you' : 'Let’s talk this one through'}</h2>
        <p>Based on your answers. This is initial guidance only: the training provider confirms eligibility after assessing your experience and documents.</p>
      </div>

      <div class="answers">
        <h3 class="answers__title">Your answers</h3>
        <ul class="answers__list" role="list">
          ${active().map((q) => `
            <li>
              <span class="answers__q">${SHORT_Q[q.id]}</span>
              <span class="answers__a">${esc(label(q.id, answers[q.id]))}</span>
              <button type="button" class="answers__edit" data-edit="${q.id}">Change<span class="visually-hidden"> your answer about ${SHORT_Q[q.id].toLowerCase()}</span></button>
            </li>`).join('')}
        </ul>
      </div>

      ${answers.goal === 'skill' ? `
        <div class="notice notice--info">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>
          <p><strong>Need one specific skill?</strong> A <a href="short-courses.html">short course</a> or <a href="courses.html?sector=firstaid">first aid certificate</a> may be quicker than a full qualification. The suggestions below are for if you also want a qualification.</p>
        </div>` : ''}

      ${top.length ? `<div class="suggestions">${top.map(suggestionCard).join('')}</div>` : `
        <div class="empty-state">
          <p>You may already hold the highest qualification we list for ${esc(interest.phrase)}. Poonam can suggest related options, such as leadership or training qualifications.</p>
          <div class="btn-row btn-row--center"><a class="btn btn--primary" href="contact.html?topic=course">Talk to Poonam</a><a class="btn btn--secondary" href="courses.html">Browse all courses</a></div>
        </div>`}

      ${more.length ? `
        <div class="results-more">
          <h3>Also worth a look</h3>
          <ul role="list">${more.map((s) => `<li><a href="${s.c.href}">${esc(s.c.title)}</a> <span>${esc(s.c.levelName)}</span></li>`).join('')}</ul>
        </div>` : ''}

      <div class="results-foot">
        <p>Not quite right? Change an answer above, or ask Poonam about all of your suggestions at once.</p>
        <div class="btn-row">
          <a class="btn btn--secondary" href="contact.html?topic=course&from=finder">Send my answers to Poonam</a>
          <button type="button" class="btn btn--text" data-restart>Start again</button>
        </div>
      </div>`;

    form.hidden = true;
    results.hidden = false;
    layout?.classList.add('has-results');
    if (!reduceMotion) {
      results.classList.remove('is-entering');
      void results.offsetWidth;
      results.classList.add('is-entering');
    }
    syncUrl(true);
    if (focus) {
      $('[data-results-title]', results).focus({ preventScroll: true });
      root.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  results.addEventListener('click', (e) => {
    const edit = e.target.closest('[data-edit]');
    if (edit) {
      editing = true;
      showQuestion(active().findIndex((q) => q.id === edit.dataset.edit));
      return;
    }
    if (e.target.closest('[data-restart]')) {
      Object.keys(answers).forEach((k) => delete answers[k]);
      editing = false;
      try { sessionStorage.removeItem('pathwise-finder'); } catch { /* ignore */ }
      showQuestion(0);
    }
  });

  /* ── Start: restore answers from the link (e.g. ?interest=early-childhood) ── */
  const params = new URLSearchParams(location.search);
  data.questions.forEach((q) => {
    const v = params.get(q.id);
    if (v && q.options.some((o) => o.id === v)) answers[q.id] = v;
  });
  const gap = firstUnanswered();
  if (gap === -1) showResults({ focus: false });
  else showQuestion(gap, { focus: gap > 0 });
})();
