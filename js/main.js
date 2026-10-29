/* =========================================================
   Cali Aunties Cookies · site behavior & animation
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const TAU = Math.PI * 2;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const animate = hasGSAP && !reduceMotion;
  const FLAVORS = window.FLAVORS || [];
  const bySlug = Object.fromEntries(FLAVORS.map(f => [f.slug, f]));
  const MENU = FLAVORS.filter(f => f.available !== false);
  const SITE = window.SITE || {};
  const BOXES = SITE.boxes || [];
  document.documentElement.classList.toggle('preorders-open', !!SITE.preordersOpen);
  let lenis = null;

  /* ---------- Helpers ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  const n1 = v => v.toFixed(1);

  function smoothClosed(p) {
    const n = p.length;
    let d = `M${n1(p[0][0])},${n1(p[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
      d += `C${n1(p1[0] + (p2[0] - p0[0]) / 6)},${n1(p1[1] + (p2[1] - p0[1]) / 6)} ` +
           `${n1(p2[0] - (p3[0] - p1[0]) / 6)},${n1(p2[1] - (p3[1] - p1[1]) / 6)} ` +
           `${n1(p2[0])},${n1(p2[1])}`;
    }
    return d + 'Z';
  }
  function blobPath(cx, cy, r, rand, pts = 7, jitter = .38) {
    const p = [];
    for (let i = 0; i < pts; i++) {
      const a = i / pts * TAU + rand() * .3;
      const rr = r * (1 - jitter / 2 + rand() * jitter);
      p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .85]);
    }
    return smoothClosed(p);
  }

  /* ---------- Illustrated cookie generator ---------- */
  const SPRINKLE_COLORS = ['#B84F69', '#FFD45E', '#7FD8B6', '#8EC5FF', '#FFFFFF', '#C9A2F5', '#FF9E5E'];
  let svgCount = 0;

  function cookieSVG(f) {
    const rand = mulberry32(hashStr(f.slug));
    const t = f.toppings || {};
    const id = `ck${++svgCount}`;
    const C = 100, R = 82;

    const edge = [];
    for (let i = 0; i < 28; i++) {
      const a = i / 28 * TAU, r = R + (rand() - .5) * 8;
      edge.push([C + Math.cos(a) * r, C + Math.sin(a) * r]);
    }
    const shape = smoothClosed(edge);
    const inside = (max = R * .72) => {
      const a = rand() * TAU, d = Math.sqrt(rand()) * max;
      return [C + Math.cos(a) * d, C + Math.sin(a) * d];
    };

    let g = `<ellipse cx="86" cy="80" rx="54" ry="42" fill="#fff" opacity=".17"/>`;

    if (t.cracks !== false) {
      for (let i = 0; i < 5; i++) {
        const [x, y] = inside(R * .6);
        const a = rand() * TAU, l = 14 + rand() * 22;
        const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l;
        const mx = (x + x2) / 2 + (rand() - .5) * 14, my = (y + y2) / 2 + (rand() - .5) * 14;
        g += `<path d="M${n1(x)},${n1(y)} Q${n1(mx)},${n1(my)} ${n1(x2)},${n1(y2)}" stroke="${f.dough[1]}" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".45"/>`;
      }
    }
    if (t.sugar) {
      for (let i = 0; i < 80; i++) { const [x, y] = inside(R * .95); g += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(.7 + rand() * 1)}" fill="#fff" opacity="${n1(.5 + rand() * .45)}"/>`; }
      for (let i = 0; i < 34; i++) { const [x, y] = inside(R * .95); g += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(.6 + rand() * .9)}" fill="#8A4B22" opacity=".55"/>`; }
    }
    if (t.glaze) {
      for (let k = 0; k < 5; k++) {
        const y = 46 + k * 27 + (rand() - .5) * 6, amp = 8 + rand() * 6;
        const d = `M6,${n1(y)} Q36,${n1(y - amp)} 66,${n1(y)} T126,${n1(y)} T186,${n1(y)} T246,${n1(y)}`;
        g += `<path d="${d}" stroke="${t.glaze}" stroke-width="6.5" stroke-linecap="round" fill="none"/>`;
        g += `<path d="${d}" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".55" transform="translate(-1 -2)"/>`;
      }
    }
    if (t.chips) {
      const n = t.chipCount || 11;
      for (let i = 0; i < n; i++) {
        const [x, y] = inside();
        const s = 6 + rand() * 5;
        g += `<path d="${blobPath(x, y, s, rand)}" fill="${t.chips}" stroke="rgba(75,43,36,.35)" stroke-width="${t.chips.startsWith('#F') ? 1.2 : 0}"/>`;
        g += `<ellipse cx="${n1(x - s * .3)}" cy="${n1(y - s * .35)}" rx="${n1(s * .34)}" ry="${n1(s * .2)}" fill="#fff" opacity=".28"/>`;
      }
    }
    if (t.sprinkles) {
      const n = t.sprinkles === 'dense' ? 48 : 26;
      for (let i = 0; i < n; i++) {
        const [x, y] = inside(R * .82);
        const c = SPRINKLE_COLORS[Math.floor(rand() * SPRINKLE_COLORS.length)];
        g += `<rect x="${n1(x - 1.7)}" y="${n1(y - 5.5)}" width="3.4" height="11" rx="1.7" fill="${c}" stroke="rgba(75,43,36,.25)" stroke-width=".6" transform="rotate(${Math.round(rand() * 180)} ${n1(x)} ${n1(y)})"/>`;
      }
    }
    if (t.coconut) {
      for (let i = 0; i < 16; i++) {
        const [x, y] = inside(R * .85); const a = rand() * TAU;
        g += `<path d="M${n1(x)},${n1(y)} q${n1(Math.cos(a) * 4)},${n1(Math.sin(a) * 4 - 2)} ${n1(Math.cos(a) * 8)},${n1(Math.sin(a) * 8)}" stroke="#FFFDF4" stroke-width="2.2" stroke-linecap="round" fill="none"/>`;
      }
    }
    if (t.zest) {
      for (let i = 0; i < 20; i++) {
        const [x, y] = inside(R * .85); const a = rand() * TAU;
        g += `<path d="M${n1(x)},${n1(y)} l${n1(Math.cos(a) * 5)},${n1(Math.sin(a) * 5)}" stroke="#C9CF2A" stroke-width="2" stroke-linecap="round"/>`;
      }
    }
    if (t.salt) {
      for (let i = 0; i < 9; i++) {
        const [x, y] = inside(R * .8);
        g += `<rect x="${n1(x - 2)}" y="${n1(y - 2)}" width="4" height="3.4" rx=".6" fill="#fff" transform="rotate(${Math.round(rand() * 90)} ${n1(x)} ${n1(y)})"/>`;
      }
    }

    return `<svg class="cookie-svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="${id}g" cx="42%" cy="38%" r="70%">
          <stop offset="0" stop-color="${f.dough[0]}"/><stop offset=".62" stop-color="${f.dough[0]}"/><stop offset="1" stop-color="${f.dough[1]}"/>
        </radialGradient>
        <clipPath id="${id}c"><path d="${shape}"/></clipPath>
      </defs>
      <ellipse cx="104" cy="191" rx="64" ry="7" fill="#4B2B24" opacity=".14"/>
      <path d="${shape}" fill="url(#${id}g)"/>
      <g clip-path="url(#${id}c)">${g}</g>
      <path d="${shape}" fill="none" stroke="#4B2B24" stroke-width="3.2"/>
    </svg>`;
  }

  // Fill any [data-cookie] placeholder with its illustration
  $$('[data-cookie]').forEach(el => {
    const f = bySlug[el.dataset.cookie];
    if (f && !el.children.length) el.innerHTML = cookieSVG(f);
  });

  /* ---------- Flavor cards & form chips ---------- */
  const grid = $('#flavor-grid');
  const chipsWrap = $('#flavor-chips');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  if (grid) {
    grid.innerHTML = MENU.map(f => `
      <div class="card-wrap${f.boxable === false ? ' card-wrap--wide' : ''}">
        <article class="card" style="--card-bg:${f.bg}">
          <div class="card__media">
            ${f.photo
              ? `<img class="card__photo" src="${esc(f.photo)}" alt="${esc(f.alt || f.name)}" loading="lazy" width="800" height="1067"${f.photoPos ? ` style="object-position:${esc(f.photoPos)}"` : ''}>`
              : `<span class="card__burst" aria-hidden="true"></span>${cookieSVG(f)}`}
          </div>
          <div class="card__body">
            <h3 class="card__title">${esc(f.name)}</h3>
            ${f.nickname ? `<p class="card__nick">${esc(f.nickname)}</p>` : ''}
            <p class="card__blurb">${esc(f.blurb)}</p>
            ${f.boxable === false ? '' : `<button class="btn card__add" type="button" data-flavor="${f.slug}" aria-pressed="false">
              <span class="card__add-icon" aria-hidden="true">+</span>
              <span class="card__add-label">Add to box</span>
            </button>`}
          </div>
          <span class="card__glare" aria-hidden="true"></span>
        </article>
      </div>`).join('');
  }

  if (chipsWrap) {
    chipsWrap.innerHTML = MENU.filter(f => f.boxable !== false).map(f => `
      <label class="chip">
        <input type="checkbox" name="flavors" value="${esc(f.name)}" data-flavor="${f.slug}">
        <span><i class="chip__dot" style="background:${f.dough[0]}"></i>${esc(f.name)}</span>
      </label>`).join('');
  }

  const boxWrap = $('#box-chips');
  if (boxWrap) {
    boxWrap.innerHTML = BOXES.map(b => `
      <label class="chip">
        <input type="radio" name="box" value="${esc(b.label)}" data-box="${esc(b.id)}" required>
        <span>${esc(b.label)} <small>· ${esc(b.note)}</small>${b.price ? ` <b class="chip__price">${esc(b.price)}</b>` : ''}</span>
      </label>`).join('');
  }
  // "Three levels of temptation": one cookie per spot in the box
  const boxGrid = $('#box-grid');
  if (boxGrid) {
    const tones = ['pink', 'butter', 'mint'];
    boxGrid.innerHTML = BOXES.map((b, i) => `
      <article class="box-card box-card--${tones[i % tones.length]}" data-pop>
        <div class="box-card__tray">
          <img src="${esc(b.photo)}" alt="${esc(b.label)} gift box" loading="lazy" decoding="async" width="800" height="1067">
        </div>
        <h3 class="box-card__name">${esc(b.label)}</h3>
        <p class="box-card__price">${esc(b.price || '')}</p>
        <p class="box-card__blurb">${esc(b.blurb || b.note)}</p>
        <p class="box-card__rule">${b.size} cookies · ${esc(b.note.toLowerCase())}</p>
      </article>`).join('');
  }

  const qtySelect = $('#f-qty');
  if (qtySelect) {
    qtySelect.innerHTML = Array.from({ length: SITE.maxBoxes || 10 }, (_, i) =>
      `<option value="${i + 1}">${i + 1} ${i ? 'boxes' : 'box'}</option>`).join('');
  }

  const pickupNote = $('#pickup-note');
  if (pickupNote) pickupNote.textContent = SITE.pickupNote || '';

  /* ---------- Toast ---------- */
  const toastEl = $('.toast');
  let toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2600);
  }

  /* ---------- Selection ("cookie box") ---------- */
  const selected = new Set();
  const badge = $('.badge');
  const addLines = ['Ooh, great taste.', 'Auntie approves. 💅', 'Added! Treat yourself.', 'Excellent choice, sweetie.', 'Into the box it goes!', 'A person of culture, we see.'];
  let addIdx = 0;

  const currentBox = () => {
    const r = boxWrap && $('input[name="box"]:checked', boxWrap);
    return r ? BOXES.find(b => b.id === r.dataset.box) : null;
  };
  const quantity = () => (qtySelect && parseInt(qtySelect.value, 10)) || 1;
  // Each box brings its own flavor allowance, so 2 Flirty 4-Packs = 2 flavors
  const maxFlavors = () => {
    const b = currentBox();
    return (b ? b.maxFlavors : Math.max(1, ...BOXES.map(x => x.maxFlavors))) * quantity();
  };
  function updateFlavorHint() {
    const max = maxFlavors();
    const legend = $('#flavor-legend');
    const hint = $('#flavor-hint');
    if (legend) legend.textContent = max > 1 ? `Choose up to ${max} flavors` : 'Choose your flavor';
    if (hint) hint.textContent = `${selected.size} of ${max} picked · subject to availability`;
    updateTotal();
  }
  function updateTotal() {
    const out = $('#order-total');
    const b = currentBox();
    const price = b && parseFloat(String(b.price).replace(/[^\d.]/g, ''));
    if (out) out.textContent = price ? `Estimated total: $${(price * quantity()).toFixed(0)} · confirmed when we reply` : '';
  }

  function setSelected(slug, on, silent) {
    if (on && !selected.has(slug) && selected.size >= maxFlavors()) {
      $$(`#flavor-chips input[data-flavor="${slug}"]`).forEach(cb => { cb.checked = false; });
      const b = currentBox();
      const mixer = BOXES.find(x => x.maxFlavors > 1);
      toast(b && maxFlavors() === 1
        ? `${b.label} is one flavor.${mixer ? ` Go for ${mixer.label}, or add another box, to mix it up!` : ''}`
        : `Easy, tiger! Up to ${maxFlavors()} flavors for ${quantity() > 1 ? 'these boxes' : 'this box'}.`);
      return;
    }
    on ? selected.add(slug) : selected.delete(slug);
    $$(`.card__add[data-flavor="${slug}"]`).forEach(btn => {
      btn.setAttribute('aria-pressed', String(on));
      $('.card__add-label', btn).textContent = on ? 'In your box' : 'Add to box';
    });
    $$(`#flavor-chips input[data-flavor="${slug}"]`).forEach(cb => { cb.checked = on; });
    if (badge) {
      badge.textContent = selected.size;
      badge.classList.toggle('is-on', selected.size > 0);
      badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
    }
    updateFlavorHint();
    if (!silent) {
      const name = bySlug[slug] ? bySlug[slug].name : 'Cookie';
      toast(on ? `${name}: ${addLines[addIdx++ % addLines.length]}` : "Removed. Auntie's not mad, just disappointed.");
    }
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.card__add');
    if (!btn) return;
    const slug = btn.dataset.flavor;
    setSelected(slug, !selected.has(slug));
  });
  chipsWrap && chipsWrap.addEventListener('change', e => {
    const slug = e.target.dataset.flavor;
    if (slug) setSelected(slug, e.target.checked, true);
  });
  boxWrap && boxWrap.addEventListener('change', () => {
    [...selected].slice(maxFlavors()).forEach(s => setSelected(s, false, true));
    updateFlavorHint();
    const f = boxWrap.closest('.field'); f && f.classList.remove('is-invalid');
  });
  qtySelect && qtySelect.addEventListener('change', () => {
    [...selected].slice(maxFlavors()).forEach(s => setSelected(s, false, true));
    updateFlavorHint();
  });
  updateFlavorHint();

  /* ---------- Decorative sprinkles ---------- */
  const DECO_COLORS = ['#B84F69', '#EFCB7B', '#CFE3D6', '#E4D9EC', '#F4B7C0', '#B8925A'];
  $$('[data-sprinkles]').forEach((sec, si) => {
    const rand = mulberry32(si * 977 + 13);
    const n = parseInt(sec.dataset.sprinkles, 10) || 8;
    for (let i = 0; i < n; i++) {
      const el = document.createElement('span');
      const dot = rand() < .3;
      el.className = dot ? 'deco-dot' : 'deco-sprinkle';
      // keep sprinkles near the edges so they never sit on top of copy
      const side = rand() < .5 ? rand() * 4 : 95 + rand() * 3;
      el.style.left = `${side}%`;
      el.style.top = `${8 + rand() * 84}%`;
      el.style.background = DECO_COLORS[Math.floor(rand() * DECO_COLORS.length)];
      el.style.rotate = `${Math.round(rand() * 180)}deg`;
      el.setAttribute('aria-hidden', 'true');
      el.dataset.speed = (rand() * 1.6 - .4).toFixed(2);
      el.dataset.spin = '1';
      sec.prepend(el);
    }
  });

  /* ---------- Header, progress, menu ---------- */
  const header = $('.site-header');
  const progress = $('.progress span');
  const toggle = $('.nav__toggle');
  const menu = $('#mobile-menu');
  let lastY = 0, menuOpen = false;

  function onScroll(y) {
    header.classList.toggle('is-scrolled', y > 40);
    if (!menuOpen) {
      if (y > lastY + 6 && y > 600) header.classList.add('is-hidden');
      else if (y < lastY - 6 || y < 600) header.classList.remove('is-hidden');
    }
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  }

  function setMenu(open) {
    menuOpen = open;
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    if (open) header.classList.remove('is-hidden');
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open && animate) {
      gsap.fromTo($$('li', menu), { y: 40, opacity: 0, rotate: 3 }, { y: 0, opacity: 1, rotate: 0, duration: .7, stagger: .06, ease: 'power3.out', delay: .15 });
    }
  }
  if (menu) menu.inert = true;
  toggle && toggle.addEventListener('click', () => setMenu(!menuOpen));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) { setMenu(false); toggle.focus(); } });

  // Smooth anchor links
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (menuOpen) setMenu(false);
      const offset = id === '#top' ? 0 : -70;
      if (lenis) lenis.scrollTo(id === '#top' ? 0 : target, { offset, duration: 1.4 });
      else window.scrollTo({ top: id === '#top' ? 0 : target.getBoundingClientRect().top + scrollY + offset, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  // Active nav link
  const navLinks = $$('.nav__links a');
  if ('IntersectionObserver' in window && navLinks.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${en.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['flavors', 'boxes', 'story', 'how', 'faq', 'order', 'top'].forEach(id => { const s = document.getElementById(id); s && io.observe(s); });
  }

  /* ---------- 3D tilt on cards ---------- */
  if (finePointer && !reduceMotion) {
    $$('.card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', `${((px - .5) * 16).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${((.5 - py) * 12).toFixed(2)}deg`);
        card.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- Inquiry form ---------- */
  const form = $('#inquiry-form');
  const success = $('.success');
  if (form) {
    const dateInput = $('#f-date', form);
    if (dateInput) {
      const d = new Date(); d.setDate(d.getDate() + 3);
      dateInput.min = d.toISOString().slice(0, 10);
    }
    const status = $('.form-status', form);
    const submit = $('button[type="submit"]', form);

    form.addEventListener('input', e => { const f = e.target.closest('.field'); f && f.classList.remove('is-invalid'); });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      status.textContent = '';
      const invalid = $$('input, select, textarea', form).filter(el => !el.checkValidity());
      $$('.field', form).forEach(f => f.classList.remove('is-invalid'));
      const noFlavor = chipsWrap && selected.size === 0;
      if (noFlavor) invalid.push($('input', chipsWrap));
      if (invalid.length) {
        invalid.forEach(el => { const f = el.closest('.field'); f && f.classList.add('is-invalid'); });
        status.textContent = noFlavor && invalid.length === 1 ? 'Almost! Pick at least one flavor.' : 'Almost! Please fill in the highlighted fields.';
        invalid[0].focus();
        return;
      }

      // Send as JSON (Vercel functions don't parse multipart form data)
      const data = Object.fromEntries(new FormData(form));
      data.flavors = new FormData(form).getAll('flavors');
      submit.disabled = true;
      submit.classList.add('is-loading');
      $('.btn__label', submit).textContent = 'Sending';

      try {
        const res = await fetch(form.getAttribute('action'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.status === 503) throw new Error('not_configured');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        form.hidden = true;
        success.hidden = false;
        success.focus({ preventScroll: true });
        confetti(success.parentElement);
        if (animate) gsap.from(success.children, { y: 30, opacity: 0, stagger: .08, duration: .7, ease: 'back.out(1.6)' });
      } catch (err) {
        status.textContent = err.message === 'not_configured'
          ? "Online preorders aren't live just yet! To order now, message us on Instagram @caliauntiescookies or email caliauntiescookies@gmail.com."
          : "Oh crumbs! Something went wrong. Please try again, or email us at caliauntiescookies@gmail.com.";
      } finally {
        submit.disabled = false;
        submit.classList.remove('is-loading');
        $('.btn__label', submit).textContent = 'Send my request';
      }
    });

    $('[data-reset]', success).addEventListener('click', () => {
      form.reset();
      [...selected].forEach(s => setSelected(s, false, true));
      updateFlavorHint();
      success.hidden = true;
      form.hidden = false;
      $('#f-first', form).focus();
      if (lenis) lenis.resize();
    });
  }

  function confetti(host) {
    if (!animate || !host) return;
    const r = host.getBoundingClientRect();
    for (let i = 0; i < 46; i++) {
      const c = document.createElement('span');
      c.className = 'confetti';
      c.style.background = DECO_COLORS[i % DECO_COLORS.length];
      c.style.left = `${r.width / 2}px`;
      c.style.top = '120px';
      host.appendChild(c);
      const a = Math.random() * TAU, d = 120 + Math.random() * 260;
      gsap.to(c, {
        x: Math.cos(a) * d, y: Math.sin(a) * d * .7 + 140, rotation: Math.random() * 720 - 360,
        opacity: 0, duration: 1.4 + Math.random() * .8, ease: 'power3.out', onComplete: () => c.remove()
      });
    }
  }

  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Text splitting ---------- */
  function splitChars(el) {
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'word';
            w.style.display = 'inline-block';
            w.setAttribute('aria-hidden', 'true');
            [...part].forEach(ch => {
              const c = document.createElement('span');
              c.className = 'char';
              c.style.display = 'inline-block';
              c.textContent = ch;
              w.appendChild(c);
            });
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR' && child.namespaceURI !== 'http://www.w3.org/2000/svg') {
          walk(child);
        }
      });
    };
    walk(el);
    return $$('.char', el);
  }
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="w">${esc(w)}</span>`).join(' ');
    return $$('.w', el);
  }

  /* ---------- Preloader ---------- */
  function runPreloader(done) {
    const pre = $('.preloader');
    if (!pre) return done();
    if (!animate) { pre.remove(); return done(); }
    const num = $('.preloader__num span', pre);
    const counter = { v: 0 };
    const tick = () => { num.textContent = Math.round(counter.v); };
    gsap.to(counter, { v: 86, duration: 1.2, ease: 'power2.out', onUpdate: tick });

    const loaded = new Promise(r => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })));
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    const min = new Promise(r => setTimeout(r, 1200));
    const cap = new Promise(r => setTimeout(r, 4000));

    Promise.race([Promise.all([loaded, fonts, min]), cap]).then(() => {
      gsap.to(counter, {
        v: 100, duration: .35, onUpdate: tick, onComplete: () => {
          gsap.to(pre, { yPercent: -100, duration: 1, ease: 'power4.inOut', onComplete: () => pre.remove() });
          gsap.delayedCall(.35, done);
        }
      });
    });
  }

  /* ---------- Motion ---------- */
  function initMotion() {
    // Splits that are useful even without motion (closing hover letters)
    const closingChars = splitChars($('.closing__big'));

    if (!animate) {
      runPreloader(() => {});
      addEventListener('scroll', () => onScroll(scrollY), { passive: true });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      lenis = new Lenis({ lerp: .1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      lenis.on('scroll', ({ scroll }) => onScroll(scroll));
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      addEventListener('scroll', () => onScroll(scrollY), { passive: true });
    }

    /* Hero intro (built paused so the start state is set under the preloader) */
    const heroChars = splitChars($('.hero__title'));
    const underline = $('.hero__underline path');
    const ulLen = underline.getTotalLength();
    gsap.set(underline, { strokeDasharray: ulLen, strokeDashoffset: ulLen });

    const intro = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
      .from('.hero__eyebrow', { y: 24, opacity: 0, duration: .7 }, 0)
      .from(heroChars, { yPercent: 110, rotate: 14, opacity: 0, duration: 1.1, stagger: .035 }, .05)
      .from('.hero__is', { scale: 0, rotate: -60, duration: .9, ease: 'back.out(2.5)' }, .45)
      .to(underline, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, .8)
      .from(['.hero__lede', '.hero__actions', '.hero__perks'], { y: 34, opacity: 0, duration: .9, stagger: .1 }, .5)
      .from('.hero__visual-inner', { scale: .55, rotate: -14, opacity: 0, duration: 1.6, ease: 'elastic.out(1, .65)' }, .2)
      .from('.sticker', { scale: 0, rotate: -200, duration: 1.1, ease: 'back.out(1.8)' }, .9)
      .from('.hero__doodle', { scale: 0, rotate: 30, opacity: 0, duration: .9, ease: 'back.out(2)' }, 1.1)
      .from('.nav__inner > *', { y: -30, opacity: 0, duration: .8, stagger: .08 }, .1);

    runPreloader(() => intro.play());

    /* Hero parallax on scroll */
    gsap.to('.hero__content', { yPercent: -14, opacity: .4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__visual', { yPercent: 16, scale: .92, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    /* Ribbons: velocity-reactive marquee */
    $$('.ribbon').forEach((rb, i) => {
      const track = $('.ribbon__track', rb);
      track.innerHTML += track.innerHTML + track.innerHTML;
      let x = 0, w = track.scrollWidth / 3, boost = 0;
      const dir = i % 2 ? 1 : -1;
      addEventListener('resize', () => { w = track.scrollWidth / 3; });
      gsap.ticker.add((time, delta) => {
        const v = lenis ? lenis.velocity : 0;
        boost += ((Math.min(Math.abs(v), 40) * .35) - boost) * .1;
        const sign = v < -0.5 ? -1 : 1;
        x += (0.7 + boost) * dir * sign * (delta / 16.67);
        if (x <= -w) x += w;
        if (x > 0) x -= w;
        track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      });
    });
    gsap.from('.ribbon--a', { rotate: -10, xPercent: -8, scrollTrigger: { trigger: '.ribbons', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.ribbon--b', { rotate: 10, xPercent: 8, scrollTrigger: { trigger: '.ribbons', start: 'top bottom', end: 'bottom top', scrub: true } });

    /* Generic reveals */
    $$('[data-reveal]').forEach(el => {
      gsap.from(el, { y: 46, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    /* Section headings: letters hop in */
    $$('[data-split-reveal]').forEach(el => {
      const chars = splitChars(el);
      gsap.from(chars, {
        yPercent: 90, rotate: 10, opacity: 0, duration: .9, stagger: .022, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* Flavor cards: 3D flip-up in batches */
    gsap.set('.card-wrap', { y: 90, opacity: 0, rotateX: -28, transformPerspective: 1000, transformOrigin: '50% 100%' });
    ScrollTrigger.batch('.card-wrap', {
      start: 'top 92%',
      once: true,
      onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, rotateX: 0, duration: 1.1, stagger: .12, ease: 'power3.out', clearProps: 'transform' })
    });

    /* Story: words light up as you scroll */
    $$('[data-words]').forEach(el => {
      const words = splitWords(el);
      gsap.fromTo(words, { opacity: .14 }, {
        opacity: 1, stagger: .1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true }
      });
    });

    /* Polaroids drop in */
    // (y is driven by the parallax below, so the entrance uses scale + rotation)
    gsap.from('.polaroid--a', { scale: .7, rotation: -18, opacity: 0, duration: 1.3, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.polaroids', start: 'top 80%', once: true } });
    gsap.from('.polaroid--b', { scale: .7, rotation: 22, opacity: 0, duration: 1.3, delay: .15, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.polaroids', start: 'top 80%', once: true } });
    gsap.from('.sticky-note', { scale: 0, rotate: -40, duration: .9, delay: .5, ease: 'back.out(2)', scrollTrigger: { trigger: '.polaroids', start: 'top 80%', once: true } });

    /* Value cards pop */
    ['.values', '.box-grid'].forEach(sel => {
      if (!$(sel)) return;
      gsap.from(`${sel} [data-pop]`, {
        y: 70, scale: .85, rotate: (i) => [-6, 4, -3][i % 3], opacity: 0, duration: 1, stagger: .12, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: sel, start: 'top 85%', once: true }
      });
    });

    /* Steps: dotted path draws as you scroll */
    const reveal = $('.steps__reveal');
    if (reveal) {
      gsap.fromTo(reveal, { attr: { width: 0 } }, { attr: { width: 1000 }, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'center 45%', scrub: true } });
    }
    gsap.from('[data-step] .step__circle', { scale: 0, rotate: -90, duration: .9, stagger: .18, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.steps', start: 'top 80%', once: true } });
    gsap.from('[data-step] h3, [data-step] p', { y: 24, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.steps', start: 'top 75%', once: true } });

    /* Occasions bounce in */
    gsap.from('.occasions__list li', { y: 40, scale: .6, opacity: 0, duration: .7, stagger: .05, ease: 'back.out(2)', scrollTrigger: { trigger: '.occasions__list', start: 'top 90%', once: true } });

    /* Order form slides in */
    gsap.from('.form-card', { rotate: 3, scrollTrigger: { trigger: '.form-card', start: 'top bottom', end: 'top 40%', scrub: true } });

    /* Closing letters rise */
    gsap.from(closingChars, {
      yPercent: 100, opacity: 0, rotate: 8, duration: 1, stagger: .03, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '.closing__big', start: 'top 85%', once: true }
    });
    gsap.from('.closing__heart', { scale: 0, rotate: -30, duration: .8, ease: 'back.out(2.2)', scrollTrigger: { trigger: '.closing__heart', start: 'top 90%', once: true } });

    /* Parallax layers */
    $$('[data-speed]').forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0;
      const trigger = el.closest('section') || el.parentElement;
      const vars = {
        y: () => speed * -140,
        ease: 'none',
        scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
      };
      if (el.dataset.spin || el.classList.contains('deco-cookie')) vars.rotation = speed * 140;
      gsap.to(el, vars);
    });

    addEventListener('load', () => ScrollTrigger.refresh());
  }

  initMotion();
})();
