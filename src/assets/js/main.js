/* Pathwise Courses – progressive enhancements.
   Every page works without this script; it adds the mobile menu, filters,
   course comparison, the pathway check, the evidence checklist and form
   validation/submission. */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const config = (() => {
    try { return JSON.parse($('#site-config')?.textContent || '{}'); } catch { return {}; }
  })();
  const params = new URLSearchParams(location.search);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ } },
  };
  const ICON = {
    check: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    x: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    info: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>',
    alert: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.01"/></svg>',
    arrow: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };
  // Pages live at the root or one folder down (courses/); work out the prefix
  // back to the root from the stylesheet link so generated links stay relative.
  const rootPrefix = ($('link[rel="stylesheet"]')?.getAttribute('href') || '').replace(/assets\/css\/styles\.css$/, '');

  /* ── Header & mobile menu ─────────────────────────────────────────────── */
  const header = $('[data-header]');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = $('[data-nav-toggle]');
  const menu = $('[data-nav-menu]');
  if (toggle && menu) {
    const setOpen = (open, { focusToggle = false } = {}) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.nav-toggle__label').textContent = open ? 'Close' : 'Menu';
      menu.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      document.body.classList.toggle('menu-open', open);
      if (!open && focusToggle) toggle.focus();
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, { focusToggle: true });
    });
    document.addEventListener('click', (e) => {
      if (toggle.getAttribute('aria-expanded') === 'true' && !menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    window.matchMedia('(min-width: 1080px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  /* ── Filters (courses + short courses) ────────────────────────────────── */
  $$('[data-filters]').forEach((form) => {
    const section = form.closest('section') || document;
    const cards = $$('[data-course-card]', $('[data-results]', section));
    const countEl = $('[data-results-count]', section);
    const emptyEl = $('[data-empty]', section);
    const search = $('[data-filter-search]', form);
    const chipGroups = $$('[data-filter-chips]', form);
    const selects = $$('[data-filter-select]', form);
    const toggles = $$('[data-filter-toggle]', form);
    const resets = $$('[data-filter-reset]', section);
    const noun = form.dataset.filters === 'short' ? 'short courses' : 'courses';
    const state = {};

    const readParams = () => {
      chipGroups.forEach((g) => { state[g.dataset.filterChips] = params.get(g.dataset.filterChips) || ''; });
      selects.forEach((s) => { state[s.dataset.filterSelect] = params.get(s.dataset.filterSelect) || ''; });
      toggles.forEach((t) => { state[t.dataset.filterToggle] = params.get(t.dataset.filterToggle) === '1'; });
      state.q = params.get('q') || '';
    };

    const syncControls = () => {
      chipGroups.forEach((g) => {
        const key = g.dataset.filterChips;
        let matched = false;
        $$('.filter-chip', g).forEach((chip) => {
          const on = chip.dataset.value === state[key];
          matched ||= on;
          chip.setAttribute('aria-pressed', String(on));
        });
        if (!matched) { state[key] = ''; $('.filter-chip', g).setAttribute('aria-pressed', 'true'); }
      });
      selects.forEach((s) => {
        s.value = state[s.dataset.filterSelect];
        if (s.value !== state[s.dataset.filterSelect]) { state[s.dataset.filterSelect] = ''; s.value = ''; }
      });
      toggles.forEach((t) => { t.checked = !!state[t.dataset.filterToggle]; });
      if (search) search.value = state.q;
    };

    const writeParams = () => {
      const url = new URL(location.href);
      Object.entries(state).forEach(([k, v]) => {
        if (v === '' || v === false) url.searchParams.delete(k);
        else url.searchParams.set(k, v === true ? '1' : v);
      });
      history.replaceState(null, '', url);
    };

    const apply = () => {
      const terms = state.q.toLowerCase().trim().split(/\s+/).filter(Boolean);
      let shown = 0;
      cards.forEach((card) => {
        const d = card.dataset;
        const ok =
          chipGroups.every((g) => !state[g.dataset.filterChips] || d[g.dataset.filterChips] === state[g.dataset.filterChips]) &&
          selects.every((s) => !state[s.dataset.filterSelect] || d[s.dataset.filterSelect] === state[s.dataset.filterSelect]) &&
          toggles.every((t) => !state[t.dataset.filterToggle] || (d.pathways || '').split(' ').includes(t.dataset.filterToggle)) &&
          terms.every((term) => (d.search || '').includes(term));
        card.hidden = !ok;
        if (ok) shown++;
      });
      const active = Object.values(state).some((v) => v !== '' && v !== false);
      if (countEl) {
        countEl.innerHTML = active
          ? `Showing <strong>${shown}</strong> of ${cards.length} ${noun}`
          : `Showing all ${cards.length} ${noun}`;
      }
      if (emptyEl) emptyEl.hidden = shown > 0;
      resets.forEach((r) => { if (r.closest('[data-filters]')) r.hidden = !active; });
      writeParams();
    };

    chipGroups.forEach((g) =>
      g.addEventListener('click', (e) => {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;
        state[g.dataset.filterChips] = chip.dataset.value;
        syncControls();
        apply();
      })
    );
    selects.forEach((s) => s.addEventListener('change', () => { state[s.dataset.filterSelect] = s.value; apply(); }));
    toggles.forEach((t) => t.addEventListener('change', () => { state[t.dataset.filterToggle] = t.checked; apply(); }));
    let timer;
    search?.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => { state.q = search.value; apply(); }, 120);
    });
    resets.forEach((r) =>
      r.addEventListener('click', () => {
        Object.keys(state).forEach((k) => { state[k] = typeof state[k] === 'boolean' ? false : ''; });
        syncControls();
        apply();
        search?.focus();
      })
    );

    readParams();
    syncControls();
    apply();
  });

  /* ── Course comparison ────────────────────────────────────────────────── */
  const tray = $('[data-compare-tray]');
  const dialog = $('[data-compare-dialog]');
  if (tray && dialog) {
    const MAX = 3;
    let data = {};
    try { data = JSON.parse($('#compare-data').textContent); } catch { /* no data */ }
    const boxes = $$('[data-compare]');
    const list = $('[data-compare-list]', tray);
    const countEl = $('[data-compare-count]', tray);
    const openBtn = $('[data-compare-open]', tray);
    const live = document.createElement('p');
    live.className = 'visually-hidden';
    live.setAttribute('aria-live', 'polite');
    document.body.append(live);
    let selected = (store.get('pathwise-compare') || []).filter((c) => data[c]).slice(0, MAX);

    const render = () => {
      boxes.forEach((b) => {
        b.checked = selected.includes(b.value);
        b.closest('[data-course-card]')?.classList.toggle('is-selected', b.checked);
      });
      tray.hidden = selected.length === 0;
      document.body.classList.toggle('tray-open', selected.length > 0);
      countEl.textContent = selected.length;
      list.innerHTML = selected
        .map((c) => `<li>${esc(c)}<button type="button" data-remove="${esc(c)}" aria-label="Remove ${esc(data[c].title)} from comparison">${ICON.x}</button></li>`)
        .join('');
      openBtn.disabled = selected.length < 2;
      openBtn.title = selected.length < 2 ? 'Choose at least two courses to compare' : '';
      store.set('pathwise-compare', selected);
    };

    boxes.forEach((b) =>
      b.addEventListener('change', () => {
        if (b.checked) {
          if (selected.length >= MAX) {
            b.checked = false;
            live.textContent = `You can compare up to ${MAX} courses. Remove one to add another.`;
            tray.animate?.([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 250 });
            return;
          }
          selected.push(b.value);
          live.textContent = `${data[b.value].title} added to comparison. ${selected.length} of ${MAX} selected.`;
        } else {
          selected = selected.filter((c) => c !== b.value);
          live.textContent = `${data[b.value].title} removed from comparison.`;
        }
        render();
      })
    );
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove]');
      if (!btn) return;
      selected = selected.filter((c) => c !== btn.dataset.remove);
      render();
      (openBtn.disabled ? $('[data-compare-clear]', tray) : openBtn).focus();
      if (!selected.length) $('[data-results]')?.querySelector('[data-compare]')?.focus();
    });
    $('[data-compare-clear]', tray).addEventListener('click', () => {
      selected = [];
      render();
      live.textContent = 'Comparison cleared.';
      $('[data-results] [data-compare]')?.focus();
    });

    const rows = [
      ['Area', 'sector'],
      ['Level', 'level'],
      ['Good for', 'suits'],
      ['Study online (typical)', 'study'],
      ['Through RPL (typical)', 'rpl'],
      ['Work placement', 'placement'],
      ['Example jobs', 'roles'],
      ['Ways to study', 'ways'],
    ];
    openBtn.addEventListener('click', () => {
      const cols = selected.map((c) => data[c]);
      $('[data-compare-body]', dialog).innerHTML = `
        <table class="cmp">
          <caption class="visually-hidden">Comparison of ${cols.length} courses</caption>
          <thead><tr><td></td>${cols.map((c) => `<th scope="col"><span>${esc(c.code)}</span><a href="${rootPrefix}${esc(c.href)}">${esc(c.title)}</a></th>`).join('')}</tr></thead>
          <tbody>${rows.map(([label, key]) => `<tr><th scope="row">${label}</th>${cols.map((c) => `<td>${esc(c[key])}</td>`).join('')}</tr>`).join('')}</tbody>
          <tfoot><tr><td></td>${cols.map((c) => `<td><a class="btn btn--primary" href="${rootPrefix}eligibility.html?course=${encodeURIComponent(c.code)}">Check eligibility</a></td>`).join('')}</tr></tfoot>
        </table>`;
      dialog.showModal();
    });
    $('[data-compare-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => openBtn.focus());
    render();
  }

  /* ── Pathway check ────────────────────────────────────────────────────── */
  const quiz = $('[data-quiz]');
  if (quiz) {
    const result = $('[data-quiz-result]', quiz);
    const error = $('[data-quiz-error]', quiz);
    quiz.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(quiz);
      const exp = fd.get('exp');
      const goal = fd.get('goal');
      const evidence = fd.get('evidence');
      if (exp === null || !goal || !evidence) {
        error.hidden = false;
        const firstMissing = ['exp', 'goal', 'evidence'].find((n) => !fd.get(n));
        quiz.querySelector(`input[name="${firstMissing}"]`)?.focus();
        return;
      }
      error.hidden = true;
      const years = Number(exp);
      let r;
      if (goal === 'skill') {
        r = {
          title: 'A short course is probably your best fit',
          text: 'Short courses build one specific skill quickly – ideal for refreshers and workplace training requirements. If your role needs a formal qualification later, your experience could count towards RPL.',
          links: [['short-courses.html', 'Browse short courses', true], ['courses.html?sector=firstaid', 'First aid & CPR']],
        };
      } else if (years >= 2 && evidence !== 'no') {
        r = {
          title: 'Recognition of prior learning looks promising',
          text: 'With your experience and evidence, RPL could recognise much of what you already know – so you only complete what’s missing. Poonam can confirm this in a short chat.',
          links: [['eligibility.html?pathway=rpl', 'Check my RPL eligibility', true], ['#rpl', 'How RPL works']],
        };
      } else if (years >= 1) {
        r = {
          title: 'Online study, with credit for what you know',
          text: 'You have a head start, but may not yet have enough evidence for full RPL. Many people study online and have some units recognised along the way. Poonam can help you work out the mix.',
          links: [['eligibility.html', 'Check my eligibility', true], ['#online', 'How online study works']],
        };
      } else {
        r = {
          title: 'Studying the full course online suits you',
          text: 'Starting fresh is completely normal. Online study teaches you everything step by step, with trainer support and a work placement where the course needs one.',
          links: [['courses.html', 'Browse courses', true], ['#online', 'How online study works']],
        };
      }
      result.innerHTML = `
        <p class="quiz__result-label">Your result</p>
        <h3>${r.title}</h3>
        <p>${r.text}</p>
        <div class="btn-row">${r.links.map(([href, label, primary]) => `<a class="btn ${primary ? 'btn--primary' : 'btn--secondary'}" href="${href}">${label}${primary ? ' ' + ICON.arrow : ''}</a>`).join('')}</div>`;
      result.focus();
    });
  }

  /* ── RPL evidence checklist ───────────────────────────────────────────── */
  const evidence = $('[data-evidence]');
  if (evidence) {
    const boxes = $$('input[type="checkbox"]', evidence);
    const bar = $('[data-evidence-bar]');
    const count = $('[data-evidence-count]');
    const saved = store.get('pathwise-evidence') || [];
    boxes.forEach((b) => { b.checked = saved.includes(b.name); });
    const update = () => {
      const done = boxes.filter((b) => b.checked);
      bar.style.width = `${Math.round((done.length / boxes.length) * 100)}%`;
      count.textContent = done.length;
      store.set('pathwise-evidence', done.map((b) => b.name));
    };
    evidence.addEventListener('change', update);
    update();
  }

  /* ── Sticky enquiry bar on course pages (mobile) ──────────────────────── */
  const mobileCta = $('[data-mobile-cta]');
  const heroActions = $('.course-hero .btn-row');
  if (mobileCta && heroActions && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      mobileCta.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0);
    }).observe(heroActions);
  }

  /* ── Forms ────────────────────────────────────────────────────────────── */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_DIGITS = /^\+?\d{8,15}$/;

  const labelText = (el) => {
    const field = el.closest('[data-field]');
    const label = field?.querySelector('legend, .field__label');
    return (label?.childNodes[0]?.textContent || 'this field').trim();
  };

  // Returns an error message, or '' when the control is valid.
  const checkControl = (el, form) => {
    if (el.type === 'radio') {
      const group = $$(`input[name="${el.name}"]`, form);
      return el.required && !group.some((r) => r.checked) ? 'Please choose one option.' : '';
    }
    if (el.type === 'checkbox') {
      return el.required && !el.checked ? 'Please tick this box so Poonam can contact you about your enquiry.' : '';
    }
    const value = el.value.trim();
    let required = el.required;
    const when = el.dataset.requiredWhen;
    if (when) {
      const [name, values] = when.split(':');
      const chosen = form.querySelector(`input[name="${name}"]:checked`)?.value;
      required = values.split(',').includes(chosen);
    }
    if (!value) {
      if (!required) return '';
      if (when) return 'Please add a phone number so Poonam can call or message you.';
      return el.dataset.msg || (el.tagName === 'SELECT' ? 'Please choose an option.' : `Please enter your ${labelText(el).toLowerCase()}.`);
    }
    if (el.type === 'email' && !EMAIL.test(value)) return 'Enter an email address like name@example.com.';
    if (el.type === 'tel' && !PHONE_DIGITS.test(value.replace(/[\s()-]/g, ''))) return 'Enter a phone number with 8–15 digits, such as 0412 345 678.';
    return '';
  };

  const showError = (el, message, form) => {
    const field = el.closest('[data-field]');
    const slot = field?.querySelector('[data-error]');
    if (slot) slot.textContent = message;
    const targets = el.type === 'radio' ? $$(`input[name="${el.name}"]`, form) : [el];
    targets.forEach((t) => (message ? t.setAttribute('aria-invalid', 'true') : t.removeAttribute('aria-invalid')));
    if (field) field.toggleAttribute('data-invalid', !!message);
  };

  const controlsIn = (root) => {
    const seen = new Set();
    return $$('input, select, textarea', root).filter((el) => {
      if (el.name === '_gotcha' || el.type === 'hidden' || el.disabled) return false;
      if (el.type === 'radio') { if (seen.has(el.name)) return false; seen.add(el.name); }
      return true;
    });
  };

  const validate = (root, form) => {
    let first = null;
    controlsIn(root).forEach((el) => {
      const msg = checkControl(el, form);
      showError(el, msg, form);
      if (msg && !first) first = el;
    });
    return first;
  };

  const collect = (form) => {
    const out = {};
    new FormData(form).forEach((value, key) => {
      if (key === '_gotcha') return;
      const v = String(value).trim();
      if (v) out[key] = out[key] ? `${out[key]}, ${v}` : v;
    });
    // Friendlier values for the email Poonam receives.
    $$('select', form).forEach((s) => {
      if (out[s.name] && s.selectedOptions[0]) out[s.name] = s.selectedOptions[0].textContent.trim();
    });
    $$('input[type="radio"]:checked', form).forEach((r) => {
      out[r.name] = r.closest('label')?.textContent.trim() || r.value;
    });
    return out;
  };

  const directContacts = () => {
    const items = [];
    if (config.phone) items.push(`<a href="tel:${esc(config.phone.replace(/[^\d+]/g, ''))}">Call ${esc(config.phone)}</a>`);
    if (config.whatsapp) items.push(`<a href="https://wa.me/${esc(config.whatsapp)}">WhatsApp</a>`);
    if (config.email) items.push(`<a href="mailto:${esc(config.email)}">Email ${esc(config.email)}</a>`);
    return items.length
      ? `<p>Please contact Poonam directly: ${items.join(' · ')}</p>`
      : '<p>Poonam’s phone and email details are being added to this site – please check back soon.</p>';
  };

  const summaryText = (data) =>
    Object.entries(data)
      .filter(([k]) => !['consent'].includes(k))
      .map(([k, v]) => `${k.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}: ${v}`)
      .join('\n');

  const setStatus = (form, html) => {
    const status = $('[data-form-status]', form);
    status.innerHTML = html;
    status.focus();
    return status;
  };

  const notConnected = (form, data) => {
    const status = setStatus(
      form,
      `<div class="notice notice--warn" role="alert">${ICON.alert}<div>
        <p><strong>Your details have not been sent.</strong> This form isn’t connected to an inbox yet, so nothing was submitted.</p>
        ${directContacts()}
        ${config.draft ? '<p class="notice__dev">Site owner: set <code>forms.endpoint</code> in <code>src/data/site.js</code> and rebuild – see “Connecting the forms” in the README.</p>' : ''}
        <div class="btn-row"><button type="button" class="btn btn--secondary" data-copy>Copy my answers</button></div>
      </div></div>`
    );
    const copy = $('[data-copy]', status);
    copy?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(summaryText(data));
        copy.textContent = 'Copied – paste them into a message to Poonam';
      } catch {
        copy.textContent = 'Copy didn’t work in this browser';
      }
    });
  };

  const sendFailed = (form, detail) =>
    setStatus(
      form,
      `<div class="notice notice--error" role="alert">${ICON.alert}<div>
        <p><strong>Sorry – your details were not sent.</strong> ${esc(detail)} Please try again in a moment.</p>
        ${directContacts()}
      </div></div>`
    );

  const succeeded = (form, data) => {
    const name = (data.first_name || data.name || '').split(' ')[0];
    const how = { phone: 'by phone', whatsapp: 'on WhatsApp', email: 'by email' }[form.querySelector('input[name="preferred"]:checked')?.value] || '';
    const isElig = form.dataset.form === 'eligibility';
    const card = form.closest('.form-card') || form.parentElement;
    card.innerHTML = `
      <div class="form-success" tabindex="-1">
        <div class="form-success__icon">${ICON.check}</div>
        <h2>Thanks${name ? `, ${esc(name)}` : ''} – that’s on its way.</h2>
        <p class="lead">Your ${isElig ? 'eligibility check' : 'enquiry'} has been sent to Poonam. She’ll be in touch ${how} to talk through your options.</p>
        <div class="btn-row btn-row--center"><a class="btn btn--secondary" href="${rootPrefix}courses.html">Keep browsing courses</a></div>
      </div>`;
    $('.form-success', card).focus();
  };

  const submitForm = async (form, button) => {
    const data = collect(form);
    if (form.querySelector('[name="_gotcha"]')?.value) return; // likely a bot
    if (!config.endpoint) {
      notConnected(form, data);
      return;
    }
    button.classList.add('is-loading');
    button.disabled = true;
    try {
      const subject = form.dataset.subject || 'Website enquiry';
      const res = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...config.extraFields, ...data, _subject: subject, subject, form: form.dataset.form, page: location.href }),
      });
      if (res.ok) succeeded(form, data);
      else sendFailed(form, `The form service responded with an error (${res.status}).`);
    } catch {
      sendFailed(form, 'We couldn’t reach the form service – check your internet connection.');
    } finally {
      button.classList.remove('is-loading');
      button.disabled = false;
    }
  };

  $$('[data-form]').forEach((form) => {
    form.noValidate = true;
    let attempted = false;
    const submitBtn = $('[data-submit]', form);

    // Live feedback once someone has tried to submit or left a field.
    form.addEventListener('focusout', (e) => {
      const el = e.target;
      if (!el.matches('input, select, textarea') || el.name === '_gotcha') return;
      if (el.type === 'radio' || el.type === 'checkbox') return;
      if (attempted || el.value.trim()) showError(el, checkControl(el, form), form);
    });
    form.addEventListener('input', (e) => {
      const el = e.target;
      if (el.getAttribute('aria-invalid') === 'true' || (el.type === 'radio' && el.closest('[data-invalid]'))) showError(el, checkControl(el, form), form);
    });
    form.addEventListener('change', (e) => {
      const el = e.target;
      if (el.type === 'radio' || el.type === 'checkbox' || el.tagName === 'SELECT') {
        if (el.closest('[data-invalid]') || el.getAttribute('aria-invalid') === 'true') showError(el, checkControl(el, form), form);
      }
      // Phone becomes required when someone picks a call or WhatsApp.
      if (el.name === 'preferred') {
        $$('[data-required-when]', form).forEach((dep) => { if (attempted || dep.getAttribute('aria-invalid')) showError(dep, checkControl(dep, form), form); });
      }
    });

    // Prefill from links such as eligibility.html?course=CHC33021
    const course = params.get('course');
    const topic = params.get('topic');
    const courseSelect = form.querySelector('select[name="course"]');
    if (courseSelect && course) {
      if ([...courseSelect.options].some((o) => o.value === course)) courseSelect.value = course;
      else if (topic === 'short-course') {
        courseSelect.value = 'short-course';
        const msg = form.querySelector('textarea[name="message"]');
        if (msg && !msg.value) msg.value = `I’m interested in the short course: ${course.slice(0, 120)}.`;
      }
    }
    const topicSelect = form.querySelector('select[name="topic"]');
    if (topicSelect) {
      const t = topic || (course ? 'course' : '');
      if ([...topicSelect.options].some((o) => o.value === t)) topicSelect.value = t;
    }
    const pathway = params.get('pathway');
    if (pathway) form.querySelector(`input[name="pathway"][value="${CSS.escape(pathway)}"]`)?.click();

    // Multi-step behaviour (eligibility check).
    const steps = $$('[data-step]', form);
    let current = 0;
    const back = $('[data-step-back]', form);
    const next = $('[data-step-next]', form);
    const stepper = $$('.stepper__item', form);
    const showStep = (i, { focus = true } = {}) => {
      current = i;
      steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
      stepper.forEach((s, n) => {
        s.classList.toggle('is-current', n === i);
        s.classList.toggle('is-done', n < i);
        if (n === i) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current');
      });
      back.hidden = i === 0;
      next.hidden = i === steps.length - 1;
      submitBtn.hidden = i !== steps.length - 1;
      $('[data-form-status]', form).innerHTML = '';
      if (focus) {
        const title = $('[data-step-title]', steps[i]);
        title?.focus();
        form.closest('.form-card')?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    };
    if (steps.length) {
      showStep(0, { focus: false });
      next.addEventListener('click', () => {
        const bad = validate(steps[current], form);
        if (bad) { bad.focus(); return; }
        showStep(current + 1);
      });
      back.addEventListener('click', () => showStep(current - 1));
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Enter on an earlier step moves forward rather than submitting.
      if (steps.length && current < steps.length - 1) { next.click(); return; }
      attempted = true;
      const bad = validate(form, form);
      if (bad) {
        const stepIndex = steps.findIndex((s) => s.contains(bad));
        if (stepIndex > -1 && stepIndex !== current) showStep(stepIndex, { focus: false });
        bad.focus();
        return;
      }
      submitForm(form, submitBtn);
    });
  });
})();
