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
  // Animate each workforce total once, leaving the full value for assistive technology.
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const counts = new IntersectionObserver((entries) => {
      entries.filter((entry) => entry.isIntersecting).forEach(({ target }) => {
        counts.unobserve(target);
        const total = Number(target.dataset.count);
        const start = performance.now();
        const frame = (now) => {
          const progress = Math.min(1, (now - start) / 1200);
          target.textContent = Math.round(total * (1 - (1 - progress) ** 3)).toLocaleString('en-AU');
          if (progress < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach((number) => counts.observe(number));
  }

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

  /* ── Filters and search (courses + short courses) ─────────────────────── */
  // Everyday words people type, mapped to the terms used in course data.
  const SYNONYMS = {
    childcare: ['child care', 'early childhood'], 'child care': ['childcare'], daycare: ['childcare'], kindy: ['kindergarten'],
    'aged care': ['aged-care', 'nursing home'], 'nursing home': ['aged care'], carer: ['care worker', 'support worker'],
    caregiver: ['carer'], ndis: ['disability'], oshc: ['outside school hours care'], 'teachers aide': ['teacher aide'],
    ohs: ['whs'], 'oh&s': ['whs'], safety: ['whs'], counsellor: ['counselling'], counselor: ['counselling'], counseling: ['counselling'],
    trainer: ['training'], teach: ['trainer'], boss: ['manager'], supervisor: ['team leader'], builder: ['building'],
    'first-aid': ['first aid'], resus: ['cpr'], 'cert 3': ['certificate iii'], 'cert iii': ['certificate iii'],
    'cert 4': ['certificate iv'], 'cert iv': ['certificate iv'], 'certificate 3': ['certificate iii'], 'certificate 4': ['certificate iv'],
  };
  const FIELD_WEIGHT = { title: 12, keywords: 9, roles: 6, text: 2 };
  const normalise = (q) => q.toLowerCase().replace(/[’']/g, '').replace(/[^\w&+\- ]+/g, ' ').replace(/\s+/g, ' ').trim();
  // Splits a query into terms, keeping known phrases ("aged care", "cert 3") together.
  const terms = (q) => {
    let rest = ` ${normalise(q)} `;
    const out = [];
    Object.keys(SYNONYMS).filter((k) => k.includes(' ')).sort((a, b) => b.length - a.length).forEach((phrase) => {
      if (rest.includes(` ${phrase} `)) { out.push(phrase); rest = rest.replace(` ${phrase} `, ' '); }
    });
    return out.concat(rest.trim().split(' ').filter((t) => t.length > 1 && !['a', 'an', 'the', 'in', 'of', 'for', 'and', 'to', 'course', 'courses'].includes(t)));
  };
  // Level words ("cert 3", "diploma") should match the course itself, not a
  // description that mentions another level.
  const LEVEL_TERM = /^(cert|certificate|diploma|advanced)\b|^(iii|iv|3|4)$/;
  const matchTerm = (card, term) => {
    const variants = [term, ...(SYNONYMS[term] || [])];
    const levelOnly = LEVEL_TERM.test(term);
    let best = 0;
    for (const [field, weight] of Object.entries(FIELD_WEIGHT)) {
      if (levelOnly && (field === 'roles' || field === 'text')) continue;
      const text = card.dataset[`s${field[0].toUpperCase()}${field.slice(1)}`] || '';
      for (const v of variants) {
        if (v !== term && field === 'text') continue; // synonyms only count in titles, keywords and job titles
        const at = text.indexOf(v);
        if (at === -1) continue;
        const wholeWord = (at === 0 || /\W/.test(text[at - 1])) && !/\w/.test(text[at + v.length] || '');
        best = Math.max(best, weight * (wholeWord ? 1 : 0.5) * (v === term ? 1 : 0.85));
      }
    }
    const code = (card.dataset.code || '').toLowerCase();
    if (code && (code === term || code.startsWith(term)) && term.length >= 3) best = Math.max(best, 40);
    return best;
  };
  const scoreCard = (card, query) => {
    const ts = terms(query);
    if (!ts.length) return 1;
    let total = 0;
    for (const t of ts) {
      const s = matchTerm(card, t);
      if (!s) return 0; // every word must match something
      total += s;
    }
    return total;
  };

  // Shared with the chat assistant (assistant.js).
  window.PathwiseSearch = { scoreCard, terms, SYNONYMS };

  $$('[data-filters]').forEach((form) => {
    const section = form.closest('section') || document;
    const grid = $('[data-results]', section);
    const cards = $$('[data-course-card]', grid);
    const countEl = $('[data-results-count]', section);
    const emptyEl = $('[data-empty]', section);
    const emptyQuery = $('[data-empty-query]', section);
    const search = $('[data-filter-search]', form);
    const chipGroups = $$('[data-filter-chips]', form);
    const selects = $$('[data-filter-select]', form);
    const toggles = $$('[data-filter-toggle]', form);
    const resets = $$('[data-filter-reset]', section);
    const activeBox = $('[data-active-filters]', section);
    const activeList = $('[data-active-list]', section);
    const moreToggle = $('[data-filters-toggle]', form);
    const more = $('[data-filters-more]', form);
    const badge = $('[data-filters-badge]', form);
    const noun = form.dataset.filters === 'short' ? 'short courses' : 'courses';
    const usesRanking = !!cards[0]?.dataset.sTitle;
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
      if (search && search.value !== state.q) search.value = state.q;
    };

    const writeParams = () => {
      const url = new URL(location.href);
      Object.entries(state).forEach(([k, v]) => {
        if (v === '' || v === false) url.searchParams.delete(k);
        else url.searchParams.set(k, v === true ? '1' : v);
      });
      history.replaceState(null, '', url);
    };

    // Chips describing every active filter, each with its own remove button.
    const renderActive = () => {
      if (!activeBox) return;
      const items = [];
      if (state.q.trim()) items.push({ key: 'q', label: `“${state.q.trim()}”` });
      chipGroups.forEach((g) => {
        const v = state[g.dataset.filterChips];
        if (v) items.push({ key: g.dataset.filterChips, label: $(`.filter-chip[data-value="${CSS.escape(v)}"]`, g)?.dataset.label || v });
      });
      selects.forEach((s) => { if (state[s.dataset.filterSelect]) items.push({ key: s.dataset.filterSelect, label: s.selectedOptions[0]?.textContent.trim() }); });
      toggles.forEach((t) => { if (state[t.dataset.filterToggle]) items.push({ key: t.dataset.filterToggle, label: t.dataset.label || 'On' }); });
      activeBox.hidden = items.length === 0;
      activeList.innerHTML = items
        .map((i) => `<li><button type="button" class="active-chip" data-remove-filter="${esc(i.key)}">${esc(i.label)}${ICON.x}<span class="visually-hidden"> – remove this filter</span></button></li>`)
        .join('');
      const secondary = selects.filter((s) => state[s.dataset.filterSelect]).length + toggles.filter((t) => state[t.dataset.filterToggle]).length;
      if (badge) { badge.hidden = !secondary; badge.textContent = secondary; }
    };

    const apply = () => {
      const query = state.q.trim();
      const scored = cards.map((card, i) => {
        const d = card.dataset;
        const passes =
          chipGroups.every((g) => !state[g.dataset.filterChips] || d[g.dataset.filterChips] === state[g.dataset.filterChips]) &&
          selects.every((s) => !state[s.dataset.filterSelect] || d[s.dataset.filterSelect] === state[s.dataset.filterSelect]) &&
          toggles.every((t) => !state[t.dataset.filterToggle] || (d.pathways || '').split(' ').includes(t.dataset.filterToggle));
        let score = passes ? 1 : 0;
        if (passes && query) {
          score = usesRanking
            ? scoreCard(card, query)
            : terms(query).every((t) => [t, ...(SYNONYMS[t] || [])].some((v) => (d.search || '').includes(v))) ? 1 : 0;
        }
        return { card, i, score };
      });
      const shown = scored.filter((s) => s.score > 0);
      // Best matches first while searching; otherwise the usual order.
      const order = query && usesRanking ? [...shown].sort((a, b) => b.score - a.score || a.i - b.i) : shown;
      scored.forEach(({ card, score }) => { card.hidden = score === 0; });
      order.concat(scored.filter((s) => s.score === 0)).forEach(({ card }) => grid.append(card));

      const active = Object.values(state).some((v) => v !== '' && v !== false);
      if (countEl) {
        countEl.innerHTML = active
          ? `Showing <strong>${shown.length}</strong> of ${cards.length} ${noun}${query && usesRanking && shown.length > 1 ? ', best matches first' : ''}`
          : `Showing all ${cards.length} ${noun}`;
      }
      if (emptyEl) {
        emptyEl.hidden = shown.length > 0;
        if (emptyQuery) emptyQuery.textContent = query ? `“${query}”` : 'those filters';
      }
      resets.forEach((r) => { if (r.closest('[data-filters], .results-bar')) r.hidden = !active; });
      renderActive();
      writeParams();
    };

    const reset = (keys = Object.keys(state)) => {
      keys.forEach((k) => { state[k] = typeof state[k] === 'boolean' ? false : ''; });
      syncControls();
      apply();
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
    resets.forEach((r) => r.addEventListener('click', () => { reset(); search?.focus(); }));
    activeList?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove-filter]');
      if (!btn) return;
      reset([btn.dataset.removeFilter]);
      (activeList.querySelector('button') || search)?.focus();
    });
    section.addEventListener('click', (e) => {
      const s = e.target.closest('[data-suggest]');
      if (!s) return;
      reset();
      state.q = s.dataset.suggest;
      syncControls();
      apply();
      search?.focus();
    });

    // Secondary filters fold away on small screens.
    if (moreToggle && more) {
      const mq = matchMedia('(max-width: 759.98px)');
      const setOpen = (open) => {
        moreToggle.setAttribute('aria-expanded', String(open));
        more.classList.toggle('is-open', open);
      };
      const hasSecondary = () => selects.some((s) => state[s.dataset.filterSelect]) || toggles.some((t) => state[t.dataset.filterToggle]);
      moreToggle.addEventListener('click', () => setOpen(moreToggle.getAttribute('aria-expanded') !== 'true'));
      setOpen(!mq.matches || hasSecondary());
      mq.addEventListener('change', (e) => setOpen(!e.matches || hasSecondary()));
    }

    readParams();
    syncControls();
    apply();
  });

  /* ── Search bar that stays in view while scrolling the results ──────── */
  $$('[data-filters-dock]').forEach((dock) => {
    const bar = $('[data-filters-bar]', dock);
    const section = dock.closest('section');
    const form = $('[data-filters]', dock);
    const header = $('.site-header');
    const firstResult = $('.results-bar, [data-results-count]', section);
    let stuck = false;
    let ticking = false;
    const measure = () => { if (!stuck) dock.style.minHeight = `${bar.offsetHeight}px`; };
    const headerBottom = () => (header ? Math.max(0, header.getBoundingClientRect().bottom) : 0);
    const update = () => {
      ticking = false;
      const top = headerBottom();
      const should = dock.getBoundingClientRect().top < top && section.getBoundingClientRect().bottom > top + bar.offsetHeight + 80;
      if (should === stuck) return;
      if (should) measure();
      stuck = should;
      dock.classList.toggle('is-stuck', stuck);
      if (stuck) pinnedH = bar.offsetHeight;
    };
    // After a filter change made while pinned, bring the first results into
    // view under the pinned bar (the list may have got much shorter).
    let pinnedH = 0;
    const settle = (wasStuck) => {
      if (!wasStuck || !firstResult) return;
      const want = headerBottom() + pinnedH + 16;
      const at = firstResult.getBoundingClientRect().top;
      if (Math.abs(at - want) > 4) window.scrollBy(0, at - want);
      update();
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', () => { measure(); update(); });
    form.addEventListener('input', () => { const was = stuck; setTimeout(() => settle(was), 180); });
    form.addEventListener('change', () => { const was = stuck; setTimeout(() => settle(was), 30); });
    form.addEventListener('click', (e) => { const was = stuck; if (e.target.closest('.filter-chip')) setTimeout(() => settle(was), 30); });
    measure();
    update();
  });

  /* ── Home hero: search suggestions, typing hints, background video ───── */
  const heroForm = $('[data-hero-search]');
  if (heroForm) {
    const input = $('[data-hero-input]', heroForm);
    const panel = $('[data-hero-panel]', heroForm);
    const list = $('[data-hero-results]', heroForm);
    const status = $('[data-hero-status]', heroForm);
    let data = [];
    try { data = JSON.parse($('[data-hero-data]', heroForm).textContent); } catch { /* suggestions off */ }
    const items = data.map((d) => ({ ...d, card: { dataset: { sTitle: d.s.title, sKeywords: d.s.keywords, sRoles: d.s.roles, sText: d.s.text, code: d.code } } }));
    const allHref = (q) => `courses.html?q=${encodeURIComponent(q)}`;
    let options = [];
    let active = -1;
    let statusTimer;

    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', 'hero-results');

    // Bold the parts of a title that match what was typed.
    const highlight = (title, q) => {
      const words = terms(q).flatMap((t) => [t, ...(SYNONYMS[t] || [])]).filter((t) => t.length > 1);
      if (!words.length) return esc(title);
      const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
      return title.split(re).map((part, i) => (i % 2 ? `<mark>${esc(part)}</mark>` : esc(part))).join('');
    };

    const setActive = (i) => {
      options.forEach((o, n) => o.setAttribute('aria-selected', String(n === i)));
      active = i;
      if (i >= 0) {
        input.setAttribute('aria-activedescendant', options[i].id);
        options[i].scrollIntoView({ block: 'nearest' });
      } else input.removeAttribute('aria-activedescendant');
    };

    const close = () => {
      panel.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      setActive(-1);
    };

    const render = () => {
      const q = input.value.trim();
      if (q.length < 2 || !items.length) { close(); list.innerHTML = ''; return; }
      const ranked = items
        .map((it, i) => ({ it, i, score: scoreCard(it.card, q) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score || a.i - b.i)
        .slice(0, 5)
        .map((r) => r.it);
      const rows = ranked.map((it, n) => `
        <li class="hs-option" role="option" id="hs-opt-${n}" aria-selected="false" data-href="${esc(it.href)}">
          <img src="${esc(it.img)}" alt="" width="64" height="48" loading="lazy">
          <span><span class="hs-option__title">${highlight(it.title, q)}</span><span class="hs-option__meta">${esc(it.level)} · ${esc(it.code)}</span></span>
          ${it.from ? `<span class="hs-option__price">from $${Number(it.from).toLocaleString('en-AU')}<small>typical price</small></span>` : '<span></span>'}
        </li>`);
      if (!ranked.length) {
        rows.push(`<li class="hs-option hs-option--finder" role="option" id="hs-opt-0" aria-selected="false" data-href="course-finder.html">${ICON.info}<span>No course matches “${esc(q)}”. Answer 4 quick questions instead</span>${ICON.arrow}</li>`);
      }
      rows.push(`<li class="hs-option hs-option--all" role="option" id="hs-opt-${rows.length}" aria-selected="false" data-href="${esc(allHref(q))}"><span>${ranked.length ? `See all results for “${esc(q)}”` : 'Browse all courses'}</span>${ICON.arrow}</li>`);
      list.innerHTML = rows.join('');
      options = $$('.hs-option', list);
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      setActive(-1);
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => {
        status.textContent = ranked.length
          ? `${ranked.length} ${ranked.length === 1 ? 'course' : 'courses'} suggested. Use the up and down arrows to choose.`
          : 'No matching course. Suggestions are available with the arrow keys.';
      }, 400);
    };

    const go = (option) => { if (option) location.href = option.dataset.href; };

    input.addEventListener('input', render);
    input.addEventListener('focus', () => { if (input.value.trim().length >= 2) render(); });
    input.addEventListener('keydown', (e) => {
      const open = !panel.hidden;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!open) render();
        if (options.length) setActive((active + 1) % options.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (options.length) setActive(active <= 0 ? options.length - 1 : active - 1);
      } else if (e.key === 'Enter' && open && active >= 0) {
        e.preventDefault();
        go(options[active]);
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        close();
      }
    });
    list.addEventListener('mousedown', (e) => e.preventDefault()); // keep focus in the input
    list.addEventListener('click', (e) => go(e.target.closest('.hs-option')));
    list.addEventListener('mousemove', (e) => {
      const o = e.target.closest('.hs-option');
      if (o && options.indexOf(o) !== active) setActive(options.indexOf(o));
    });
    input.addEventListener('blur', () => setTimeout(close, 120));
    heroForm.addEventListener('submit', (e) => {
      if (!input.value.trim()) { e.preventDefault(); location.href = 'courses.html'; }
    });
  }

  /* ── Typing hints: search boxes show example searches while empty ─────── */
  const reduceHints = window.matchMedia('(prefers-reduced-motion: reduce)');
  $$('[data-typing-hints]').forEach((input) => {
    if (reduceHints.matches) return;
    const hints = input.dataset.typingHints.split('|');
    const resting = input.getAttribute('placeholder');
    let h = 0; let c = 0; let deleting = false; let timer;
    const tick = () => {
      if (document.activeElement === input || input.value) { input.setAttribute('placeholder', resting); timer = setTimeout(tick, 1200); return; }
      const word = hints[h];
      c += deleting ? -1 : 1;
      input.setAttribute('placeholder', `Try “${word.slice(0, c)}”`);
      let wait = deleting ? 35 : 75;
      if (!deleting && c === word.length) { deleting = true; wait = 1700; }
      else if (deleting && c === 0) { deleting = false; h = (h + 1) % hints.length; wait = 350; }
      timer = setTimeout(tick, wait);
    };
    timer = setTimeout(tick, 1500);
    reduceHints.addEventListener('change', (e) => { if (e.matches) { clearTimeout(timer); input.setAttribute('placeholder', resting); } });
  });

  // Background video: larger screens only, never with reduced motion or data saver.
  const video = $('[data-hero-video]');
  if (video) {
    const pauseBtn = $('[data-hero-pause]');
    const pauseLabel = $('[data-hero-pause-label]');
    const wide = window.matchMedia('(min-width: 900px)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let userPaused = false;
    let inView = true;
    const allowed = () => wide.matches && !still.matches && !navigator.connection?.saveData;
    const setPausedUI = (paused) => {
      pauseBtn.setAttribute('aria-pressed', String(paused));
      pauseLabel.textContent = paused ? 'Play video' : 'Pause video';
    };
    const play = () => {
      if (!allowed() || userPaused || !inView) return;
      if (!video.src) {
        const h264 = video.canPlayType('video/mp4; codecs="avc1.42E01E"');
        video.src = !h264 && video.canPlayType('video/webm; codecs="vp9"') ? video.dataset.srcWebm : video.dataset.src;
      }
      video.play().then(() => {
        video.classList.add('is-playing');
        pauseBtn.hidden = false;
        setPausedUI(false);
      }).catch(() => { /* autoplay blocked: the poster stays */ });
    };
    const stop = () => { if (!video.paused) video.pause(); };
    pauseBtn.addEventListener('click', () => {
      userPaused = !video.paused;
      if (userPaused) { stop(); setPausedUI(true); } else play();
    });
    const check = () => {
      if (allowed()) play();
      else { stop(); video.classList.remove('is-playing'); pauseBtn.hidden = true; }
    };
    wide.addEventListener('change', check);
    still.addEventListener('change', check);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) play(); else stop();
      }).observe(video.closest('.hero'));
    }
    if (document.readyState === 'complete') check();
    else window.addEventListener('load', check, { once: true });
  }

  /* ── Pathway Map: drag (or click) an area onto the board ──────────────── */
  const pmap = $('[data-pmap]');
  if (pmap) {
    const tabs = $$('[data-pmap-tab]', pmap);
    const panels = $$('[data-pmap-panel]', pmap);
    const zone = $('[data-pmap-zone]', pmap);
    const nameEl = $('[data-pmap-name]', pmap);
    const resetBtn = $('[data-pmap-reset]', pmap);
    let exp = 'new';
    let current = null;

    const draw = (panel) => {
      panel.classList.remove('is-drawn');
      void panel.offsetWidth; // restart the route animation
      panel.classList.add('is-drawn');
    };

    const apply = () => {
      const panel = panels.find((p) => p.dataset.pmapPanel === current);
      if (!panel) return;
      const stops = $$('.pmap__stop', panel);
      const start = exp === 'qual' ? Math.min(1, stops.length - 1) : 0;
      stops.forEach((st, i) => {
        st.classList.toggle('is-done', i < start);
        st.classList.toggle('is-start', i === start);
        st.classList.toggle('is-ahead', i >= start);
        st.style.setProperty('--i', Math.max(i - start, 0));
        $('[data-you]', st).hidden = i !== start;
        $('[data-done]', st).hidden = i >= start;
        const note = $('[data-rpl-note]', st);
        if (note) note.hidden = !((exp === 'some' && i === start) || (exp === 'exp' && (i === start || i === start + 1)));
      });
      draw(panel);
    };

    const select = (tab, { focus = false, dropped = false } = {}) => {
      current = tab.dataset.pmapTab;
      pmap.classList.add('has-choice');
      zone.style.cssText = tab.getAttribute('style');
      nameEl.textContent = tab.querySelector('strong').textContent;
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach((p) => { p.toggleAttribute('data-inactive', p.dataset.pmapPanel !== current); });
      if (focus) tab.focus();
      if (dropped) { zone.classList.remove('is-landed'); void zone.offsetWidth; zone.classList.add('is-landed'); }
      apply();
    };

    const clear = () => {
      current = null;
      pmap.classList.remove('has-choice');
      zone.style.cssText = '';
      tabs.forEach((t, i) => { t.setAttribute('aria-selected', 'false'); t.tabIndex = i === 0 ? 0 : -1; });
      panels.forEach((p) => p.setAttribute('data-inactive', ''));
      tabs[0].focus();
    };

    let skipClick = false;
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => { if (skipClick) { skipClick = false; return; } select(tab); });
      tab.addEventListener('keydown', (e) => {
        const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], { focus: true }); }
        else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], { focus: true }); }
        else if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], { focus: true }); }
      });
      tab.addEventListener('dragstart', (e) => e.preventDefault());
    });
    $$('input[name="pmap-exp"]', pmap).forEach((r) => r.addEventListener('change', () => { exp = r.value; apply(); }));
    resetBtn.addEventListener('click', clear);

    // Dragging with a mouse or pen. Touch keeps a simple tap, so the page
    // still scrolls normally on phones.
    let drag = null;
    const overZone = (x, y) => {
      const r = zone.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };
    const endDrag = (dropped) => {
      const { tab, ghost } = drag;
      pmap.classList.remove('is-dragging');
      zone.classList.remove('is-over');
      tab.classList.remove('is-lifted');
      if (dropped) {
        ghost.remove();
      } else {
        const r = tab.getBoundingClientRect();
        ghost.classList.add('is-returning');
        ghost.style.transform = `translate(${r.left}px, ${r.top}px)`;
        setTimeout(() => ghost.remove(), 260);
      }
      drag = null;
    };
    pmap.addEventListener('pointerdown', (e) => {
      const tab = e.target.closest('[data-pmap-tab]');
      if (!tab || e.pointerType === 'touch' || e.button !== 0) return;
      const r = tab.getBoundingClientRect();
      drag = { tab, id: e.pointerId, x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, w: r.width, ghost: null };
    });
    window.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.ghost) {
        if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) return;
        const ghost = drag.tab.cloneNode(true);
        ['id', 'role', 'aria-controls', 'aria-selected', 'tabindex', 'data-pmap-tab'].forEach((a) => ghost.removeAttribute(a));
        ghost.setAttribute('aria-hidden', 'true');
        ghost.className = 'pmap__token pmap__ghost';
        ghost.style.width = `${drag.w}px`;
        document.body.append(ghost);
        drag.ghost = ghost;
        drag.tab.classList.add('is-lifted');
        pmap.classList.add('is-dragging');
        zone.style.setProperty('--drag-acc', getComputedStyle(drag.tab).getPropertyValue('--acc'));
      }
      drag.ghost.style.transform = `translate(${e.clientX - drag.dx}px, ${e.clientY - drag.dy}px) rotate(-4deg)`;
      zone.classList.toggle('is-over', overZone(e.clientX, e.clientY));
    });
    window.addEventListener('pointerup', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.ghost) { drag = null; return; } // a plain click: handled by the click event
      skipClick = true;
      setTimeout(() => { skipClick = false; }, 0);
      const tab = drag.tab;
      const dropped = overZone(e.clientX, e.clientY);
      endDrag(dropped);
      if (dropped) select(tab, { dropped: true });
    });
    window.addEventListener('pointercancel', () => { if (drag?.ghost) endDrag(false); drag = null; });
  }

  /* ── Student stories: moving wall with a pause button ─────────────────── */
  const wall = $('[data-wall]');
  if (wall) {
    const btn = $('[data-wall-pause]', wall);
    const label = $('[data-wall-pause-label]', wall);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const setPaused = (p) => {
      wall.classList.toggle('is-paused', p);
      btn.setAttribute('aria-pressed', String(p));
      label.textContent = p ? 'Play stories' : 'Pause stories';
    };
    btn.addEventListener('click', () => setPaused(!wall.classList.contains('is-paused')));
    // The stories keep moving under the mouse; a click on them pauses or plays.
    $('.wall__rows', wall)?.addEventListener('click', () => setPaused(!wall.classList.contains('is-paused')));
    const sync = () => { btn.hidden = still.matches; };
    still.addEventListener('change', sync);
    sync();
  }

  /* ── Video previews: load the YouTube player only when asked ─────────── */
  $$('[data-yt]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(btn.dataset.yt)}?autoplay=1&rel=0`;
      frame.title = btn.dataset.ytTitle;
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.loading = 'lazy';
      btn.closest('[data-yt-frame]').replaceChildren(frame);
      frame.focus();
    });
  });

  /* ── Gentle reveal as sections scroll into view ─────────────────────── */
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const targets = $$([
      '.section-head', '.area-tile', '.about-poonam__photo', '.about-poonam__text', '.wall__head',
      '.demand__item', '.watch', '.route__stop', '.faq-split > *', '.invite', '.finder-entry__inner > *',
      '.path', '.timeline li', '.split > *', '.subhead', '.teams-band', '.compare-table', '.hint-card',
      '.prose-section', '.glance', '.service', '.why-matters .facts-grid > li',
    ].join(','));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen: no animation
      const siblings = Array.from(el.parentElement.children).filter((c) => targets.includes(c));
      el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 5) * 70}ms`);
      el.classList.add('reveal');
      io.observe(el);
    });
  }

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
        .map((c) => `<li><span class="compare-tray__name">${esc(data[c].short || data[c].title)}</span><button type="button" data-remove="${esc(c)}" aria-label="Remove ${esc(data[c].title)} from comparison">${ICON.x}</button></li>`)
        .join('');
      openBtn.disabled = selected.length < 2;
      openBtn.title = selected.length < 2 ? 'Choose at least two courses to compare' : '';
      $('[data-compare-hint]', tray)?.toggleAttribute('hidden', selected.length !== 1);
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
      ['Typical price', 'price'],
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
        <div class="cmp-stack">
          ${cols.map((c) => `
            <section class="cmp-card" aria-label="${esc(c.title)}">
              <p class="cmp-card__code">${esc(c.code)}</p>
              <h3><a href="${rootPrefix}${esc(c.href)}">${esc(c.title)}</a></h3>
              <dl>${rows.map(([label, key]) => `<div><dt>${label}</dt><dd>${esc(c[key])}</dd></div>`).join('')}</dl>
              <a class="btn btn--primary btn--block" href="${rootPrefix}eligibility.html?course=${encodeURIComponent(c.code)}">Ask about this course</a>
            </section>`).join('')}
        </div>
        <table class="cmp">
          <caption class="visually-hidden">Comparison of ${cols.length} courses</caption>
          <thead><tr><td></td>${cols.map((c) => `<th scope="col"><span>${esc(c.code)}</span><a href="${rootPrefix}${esc(c.href)}">${esc(c.title)}</a></th>`).join('')}</tr></thead>
          <tbody>${rows.map(([label, key]) => `<tr><th scope="row">${label}</th>${cols.map((c) => `<td>${esc(c[key])}</td>`).join('')}</tr>`).join('')}</tbody>
          <tfoot><tr><td></td>${cols.map((c) => `<td><a class="btn btn--primary" href="${rootPrefix}eligibility.html?course=${encodeURIComponent(c.code)}">Ask about this course</a></td>`).join('')}</tr></tfoot>
        </table>`;
      dialog.showModal();
    });
    $('[data-compare-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => openBtn.focus());
    render();
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
  const heroActions = $('.page-hero--course .btn-row');
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
    const nextStepsHtml = $('.next-steps')?.outerHTML || '';
    const card = form.closest('.form-card') || form.parentElement;
    card.innerHTML = `
      <div class="form-success" tabindex="-1">
        <div class="form-success__icon">${ICON.check}</div>
        <h2>Thanks${name ? `, ${esc(name)}` : ''} – that’s on its way.</h2>
        <p class="lead">Your ${isElig ? 'details have' : 'enquiry has'} been received. ${esc(config.advisor || 'Poonam')} will be in touch ${how} to talk through your options.</p>
        ${nextStepsHtml ? `<div class="form-success__next"><h3>What happens next</h3>${nextStepsHtml}</div>` : ''}
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
      // Some services answer 200 with { success: false }, so check the body too.
      let body = {};
      try { body = await res.clone().json(); } catch { /* not JSON */ }
      if (res.ok && body.ok !== false && body.success !== false) succeeded(form, data);
      else sendFailed(form, `The form service didn’t accept it (error ${res.status}). Everything you entered is still here.`);
    } catch {
      sendFailed(form, 'We couldn’t reach the form service, so please check your internet connection. Everything you entered is still here.');
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
    const pathwayInput = pathway && form.querySelector(`input[name="pathway"][value="${CSS.escape(pathway)}"]`);
    if (pathwayInput) pathwayInput.checked = true;
    const exp = params.get('exp');
    const expInput = exp && form.querySelector(`input[name="experience"][value="${CSS.escape(exp)}"]`);
    if (expInput) expInput.checked = true;

    // Show what they're asking about, and pass course finder answers along.
    const selectionBox = $('[data-selection]', form);
    const finderField = $('[data-finder-field]', form);
    let finder = null;
    if (params.get('from') === 'finder') {
      try { finder = JSON.parse(sessionStorage.getItem('pathwise-finder')); } catch { /* none */ }
    }
    const chosen = courseSelect && courseSelect.value && courseSelect.value !== 'short-course' && courseSelect.value !== 'other' ? courseSelect.selectedOptions[0].textContent.trim() : '';
    if (selectionBox && (chosen || finder)) {
      const bits = [];
      if (pathwayInput) bits.push(`Possible pathway: ${pathwayInput.closest('label').textContent.trim()}`);
      if (expInput) bits.push(`Experience: ${expInput.closest('label').textContent.trim()}`);
      selectionBox.innerHTML = `
        <p class="selection__label">${chosen ? 'You’re asking about' : 'Your course finder suggestions'}</p>
        ${chosen ? `<p class="selection__course">${esc(chosen)}</p>` : ''}
        ${!chosen && finder?.suggestions?.length ? `<ul class="selection__list">${finder.suggestions.map((x) => `<li>${esc(x.title)} <span>· ${esc(x.pathway)}</span></li>`).join('')}</ul>` : ''}
        ${bits.length ? `<p class="selection__meta">${esc(bits.join(' · '))}</p>` : ''}
        ${finder ? `<p class="selection__meta">Your course finder answers are included: ${esc(finder.summary)}. <a href="${rootPrefix}course-finder.html${finder.answers ? `?${new URLSearchParams(finder.answers)}#results` : ''}">Change them</a></p>` : ''}`;
      selectionBox.hidden = false;
    }
    if (finderField && finder) {
      finderField.value = `${finder.summary}. Suggested: ${(finder.suggestions || []).map((x) => `${x.title} (${x.pathway})`).join('; ')}`;
    }

    // Online enquiries not open yet: the form is shown switched off.
    if (form.hasAttribute('data-unavailable')) {
      $('[data-step]', form)?.classList.add('is-active');
      return;
    }

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
