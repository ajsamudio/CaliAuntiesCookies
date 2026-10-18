/* =========================================================
   Cali Aunties Cookies · 3D hero cookie (Three.js r149)
   A procedurally sculpted chocolate chip cookie with two
   little cookie friends, floating sprinkles and crumbs.
   Drag to spin, tap to boop.
   ========================================================= */
(function () {
  'use strict';

  const host = document.getElementById('cookie-stage');
  if (!host) return;
  const visual = host.closest('.hero__visual');
  const fail = () => { visual && visual.classList.add('no-webgl'); };
  if (!window.THREE) return fail();

  const THREE = window.THREE;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { return fail(); }
  if (!renderer.getContext()) return fail();

  THREE.ColorManagement.legacyMode = false;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  /* ---------- Noise ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function makeNoise(seed) {
    const r = mulberry32(seed);
    const base = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [base[i], base[j]] = [base[j], base[i]]; }
    const p = new Uint16Array(512);
    for (let i = 0; i < 512; i++) p[i] = base[i & 255];
    const vals = new Float32Array(256);
    for (let i = 0; i < 256; i++) vals[i] = r();
    const h = (x, y, z) => vals[p[p[p[x & 255] + (y & 255)] + (z & 255)]];
    const s = t => t * t * (3 - 2 * t);
    const l = (a, b, t) => a + (b - a) * t;
    function noise(x, y, z) {
      const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
      const u = s(x - X), v = s(y - Y), w = s(z - Z);
      return l(
        l(l(h(X, Y, Z), h(X + 1, Y, Z), u), l(h(X, Y + 1, Z), h(X + 1, Y + 1, Z), u), v),
        l(l(h(X, Y, Z + 1), h(X + 1, Y, Z + 1), u), l(h(X, Y + 1, Z + 1), h(X + 1, Y + 1, Z + 1), u), v),
        w);
    }
    function fbm(x, y, z, oct = 4) {
      let a = .5, f = 1, sum = 0, norm = 0;
      for (let i = 0; i < oct; i++) { sum += a * noise(x * f, y * f, z * f); norm += a; a *= .5; f *= 2.03; }
      return sum / norm;
    }
    return { noise, fbm };
  }

  // SphereGeometry duplicates seam/pole vertices; merge them so normals stay smooth
  function mergeVerts(geo) {
    const pos = geo.attributes.position;
    const map = new Map(), out = [], remap = new Uint32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const k = `${Math.round(x * 1e4)}_${Math.round(y * 1e4)}_${Math.round(z * 1e4)}`;
      let idx = map.get(k);
      if (idx === undefined) { idx = out.length / 3; map.set(k, idx); out.push(x, y, z); }
      remap[i] = idx;
    }
    const src = geo.index.array, idxs = [];
    for (let i = 0; i < src.length; i += 3) {
      const a = remap[src[i]], b = remap[src[i + 1]], c = remap[src[i + 2]];
      if (a !== b && b !== c && a !== c) idxs.push(a, b, c);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
    g.setIndex(idxs);
    geo.dispose();
    return g;
  }

  /* ---------- Cookie sculptor ---------- */
  const dummy = new THREE.Object3D();

  function makeCookie(o) {
    const R = o.radius || 1.5, H = o.height || .42, seed = o.seed || 1;
    const N = makeNoise(seed);
    const seg = o.seg || 150;
    const geo = mergeVerts(new THREE.SphereGeometry(1, seg, Math.round(seg / 2)));
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const cTop = new THREE.Color(o.top), cEdge = new THREE.Color(o.edge);
    const cCrack = new THREE.Color(o.crack || o.top), cBottom = new THREE.Color(o.bottom || o.edge);
    const c = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const ang = Math.atan2(z, x);
      const wob = 1 + (N.fbm(Math.cos(ang) * 1.8 + 5, Math.sin(ang) * 1.8 + 5, 3, 3) - .5) * .13;
      const n = N.fbm(x * 2.4 + 11, y * 2.4, z * 2.4 + 7, 5);
      const ridge = 1 - Math.abs(N.noise(x * 3.1 + 3, z * 3.1 + 9, 1.5) * 2 - 1);
      const crack = Math.pow(ridge, 9);
      const top = y > 0 ? Math.pow(y, .7) : 0;

      let yy = Math.sign(y) * Math.pow(Math.abs(y), .6) * H * (y > 0 ? 1 : .42);
      yy += top * ((n - .5) * H * .95 - crack * H * .24);
      const rr = R * wob * (1 + (n - .5) * .08);
      pos.setXYZ(i, x * rr, yy, z * rr);

      const side = 1 - top;
      c.copy(cTop).lerp(cEdge, Math.min(1, Math.pow(side, 2.4) * .95 + (1 - n) * .2));
      if (y <= 0) c.copy(cEdge).lerp(cBottom, Math.min(1, -y * 1.6));
      c.lerp(cCrack, crack * top * .8);
      if (N.noise(x * 38, y * 38, z * 38) > .84) c.multiplyScalar(.9);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const group = new THREE.Group();
    const body = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: o.roughness ?? .9, metalness: 0 }));
    group.add(body);
    body.updateMatrixWorld(true);

    const rand = mulberry32(seed * 7 + 3);
    const ray = new THREE.Raycaster();
    const down = new THREE.Vector3(0, -1, 0);
    const from = new THREE.Vector3();
    const onTop = maxR => {
      const a = rand() * TAU, d = Math.sqrt(rand()) * maxR;
      ray.set(from.set(Math.cos(a) * d, 3, Math.sin(a) * d), down);
      const hit = ray.intersectObject(body)[0];
      return hit ? hit.point : null;
    };
    const onRim = () => {
      const a = rand() * TAU;
      const dir = new THREE.Vector3(-Math.cos(a), 0, -Math.sin(a));
      ray.set(from.set(Math.cos(a) * 4, H * (.05 + rand() * .3), Math.sin(a) * 4), dir);
      const hit = ray.intersectObject(body)[0];
      return hit ? hit.point : null;
    };

    // Chocolate chunks: faceted, slightly lumpy
    if (o.chips) {
      const chipMat = new THREE.MeshStandardMaterial({ color: o.chipColor, roughness: .42, metalness: 0, flatShading: true });
      const variants = [0, 1, 2, 3, 4].map(k => {
        const g = new THREE.IcosahedronGeometry(1, 1);
        const p = g.attributes.position, cn = makeNoise(seed + k * 31);
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
          const s = .65 + cn.noise(x * 1.6 + 3, y * 1.6 + 3, z * 1.6 + 3) * .7;
          p.setXYZ(i, x * s, y * s, z * s);
        }
        g.computeVertexNormals();
        return g;
      });
      const place = (pt, k, size) => {
        const m = new THREE.Mesh(variants[k % 5], chipMat);
        const s = size * (.75 + rand() * .7);
        m.scale.set(s * (1 + rand() * .4), s * .8, s * (1 + rand() * .4));
        m.position.copy(pt);
        m.rotation.set(rand() * .8, rand() * TAU, rand() * .8);
        group.add(m);
        return m;
      };
      for (let k = 0; k < o.chips; k++) {
        const pt = onTop(R * .86);
        if (pt) { const m = place(pt, k, o.chipSize || .11); m.position.y -= m.scale.y * .3; }
      }
      for (let k = 0; k < (o.rimChips || 0); k++) {
        const pt = onRim();
        if (pt) place(pt, k + 2, (o.chipSize || .11) * .9);
      }
    }

    // Sprinkles: one instanced mesh, many colors
    if (o.sprinkles) {
      const count = o.sprinkleCount || 80;
      const im = new THREE.InstancedMesh(new THREE.CapsuleGeometry(.03, .12, 3, 8), new THREE.MeshStandardMaterial({ roughness: .35 }), count);
      const col = new THREE.Color();
      for (let k = 0; k < count; k++) {
        const pt = onTop(R * .88) || new THREE.Vector3(0, H, 0);
        dummy.position.copy(pt); dummy.position.y += .02;
        dummy.rotation.set(0, 0, 0); dummy.rotation.order = 'YXZ';
        dummy.rotation.y = rand() * TAU; dummy.rotation.x = Math.PI / 2 + (rand() - .5) * .3;
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        im.setMatrixAt(k, dummy.matrix);
        im.setColorAt(k, col.set(o.sprinkles[k % o.sprinkles.length]));
      }
      group.add(im);
    }

    // Flaky sea salt
    if (o.salt) {
      const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: .2 }), o.salt);
      for (let k = 0; k < o.salt; k++) {
        const pt = onTop(R * .82) || new THREE.Vector3(0, H, 0);
        dummy.position.copy(pt); dummy.position.y += .008;
        dummy.rotation.order = 'XYZ';
        dummy.rotation.set((rand() - .5) * .5, rand() * TAU, (rand() - .5) * .5);
        dummy.scale.set(.035 + rand() * .03, .012, .03 + rand() * .025);
        dummy.updateMatrix();
        im.setMatrixAt(k, dummy.matrix);
      }
      group.add(im);
    }

    return group;
  }

  /* ---------- Scene ---------- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 100);
  camera.position.set(0, 0, 10);

  scene.add(new THREE.HemisphereLight('#FFF4EA', '#FFB3CF', .55));
  const key = new THREE.DirectionalLight('#FFFFFF', 1.25); key.position.set(3, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight('#FF7FAE', 1.3); rim.position.set(-5, 2, -4); scene.add(rim);
  const fill = new THREE.DirectionalLight('#FFE2B8', .55); fill.position.set(-3, -2, 4); scene.add(fill);

  const root = new THREE.Group(); scene.add(root);
  const tilt = new THREE.Group(); root.add(tilt);
  const spin = new THREE.Group(); tilt.add(spin);

  const SPRINKLES = ['#B84F69', '#FFD45E', '#7FD8B6', '#8EC5FF', '#FFFFFF', '#C9A2F5'];

  const main = makeCookie({
    seed: 7, top: '#D99A52', edge: '#9A5520', crack: '#F0C98A', bottom: '#7A4218',
    chips: 30, rimChips: 9, chipColor: '#3A1D12', chipSize: .095, salt: 34
  });
  spin.add(main);

  const minis = [
    {
      obj: makeCookie({ seed: 21, seg: 96, top: '#F9BCCD', edge: '#DE9A78', crack: '#FFD9E4', bottom: '#C37F55', sprinkles: SPRINKLES, sprinkleCount: 90, roughness: .65 }),
      pos: [2.3, -1.45, -.8], scale: .42, speed: 1.1, phase: 0, rot: .5, depth: .5
    },
    {
      obj: makeCookie({ seed: 33, seg: 96, top: '#6E3C27', edge: '#4A2617', crack: '#8E5638', bottom: '#331A10', chips: 20, chipColor: '#FFF1DA', chipSize: .13 }),
      pos: [-2.35, 1.55, -.6], scale: .38, speed: .9, phase: 2, rot: -.4, depth: .7
    }
  ].map(m => {
    const wrap = new THREE.Group();
    const inner = new THREE.Group();
    inner.add(m.obj);
    inner.rotation.x = 1;
    wrap.add(inner);
    wrap.position.set(...m.pos);
    wrap.scale.setScalar(m.scale);
    root.add(wrap);
    return Object.assign(m, { wrap, inner });
  });

  // Soft contact shadow
  const shadowTex = (() => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 128;
    const ctx = cv.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(75,43,36,.55)'); g.addColorStop(1, 'rgba(75,43,36,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding;
    return t;
  })();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  shadow.scale.set(3.4, .55, 1);
  shadow.position.set(0, -1.95, -.6);
  scene.add(shadow);

  // Floating sprinkles + chocolate bits
  const floaters = [];
  (() => {
    const r = mulberry32(99);
    const sprGeo = new THREE.CapsuleGeometry(.05, .2, 3, 8);
    const chunkGeo = new THREE.IcosahedronGeometry(.09, 0);
    const chunkMat = new THREE.MeshStandardMaterial({ color: '#3A1D12', roughness: .45, flatShading: true });
    for (let i = 0; i < 26; i++) {
      const isChunk = i % 3 === 0;
      const mesh = new THREE.Mesh(isChunk ? chunkGeo : sprGeo, isChunk ? chunkMat : new THREE.MeshStandardMaterial({ color: SPRINKLES[i % SPRINKLES.length], roughness: .35 }));
      const a = r() * TAU, d = 2.2 + r() * 1.4;
      mesh.position.set(Math.cos(a) * d * 1.15, Math.sin(a) * d * .85, -1.5 + r() * 2.2);
      mesh.rotation.set(r() * TAU, r() * TAU, r() * TAU);
      mesh.userData = { base: mesh.position.clone(), phase: r() * TAU, sp: .6 + r() * .8, rs: (r() - .5) * 2 };
      scene.add(mesh);
      floaters.push(mesh);
    }
  })();

  // Crumb burst on boop
  const crumbs = [];
  (() => {
    const g = new THREE.IcosahedronGeometry(.06, 0);
    const mats = ['#E9B56E', '#C98A45', '#3A1D12'].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: .8, flatShading: true }));
    for (let i = 0; i < 28; i++) {
      const m = new THREE.Mesh(g, mats[i % 3]);
      m.visible = false;
      m.userData = { v: new THREE.Vector3(), life: 0 };
      scene.add(m);
      crumbs.push(m);
    }
  })();
  function burst() {
    crumbs.forEach(m => {
      const a = Math.random() * TAU, s = 2 + Math.random() * 3.5;
      m.position.set(root.position.x, root.position.y, .4);
      m.userData.v.set(Math.cos(a) * s, Math.sin(a) * s + 2, (Math.random() - .2) * 2);
      m.userData.life = 1;
      m.scale.setScalar(.6 + Math.random() * 1.1);
      m.visible = true;
    });
  }

  /* ---------- Interaction ---------- */
  let targetMX = 0, targetMY = 0, mx = 0, my = 0;
  window.addEventListener('pointermove', e => {
    targetMX = e.clientX / window.innerWidth * 2 - 1;
    targetMY = e.clientY / window.innerHeight * 2 - 1;
  }, { passive: true });

  const canvas = renderer.domElement;
  let dragging = false, lastX = 0, dragDist = 0, velocity = 0, angle = 0, squash = 0;
  canvas.addEventListener('pointerdown', e => {
    dragging = true; lastX = e.clientX; dragDist = 0;
    canvas.setPointerCapture(e.pointerId);
    host.classList.add('is-grabbing');
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    dragDist += Math.abs(dx);
    angle += dx * .012;
    velocity = dx * .012;
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    host.classList.remove('is-grabbing');
    if (dragDist < 5) boop();
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', () => { dragging = false; host.classList.remove('is-grabbing'); });

  function boop() {
    velocity += .5;
    squash = 1;
    burst();
    host.dispatchEvent(new CustomEvent('cookie:boop', { bubbles: true }));
  }
  window.CookieScene = { boop };

  /* ---------- Sizing & visibility ---------- */
  const section = host.closest('section');
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = 10 * Math.max(1, 1 / camera.aspect);
    camera.updateProjectionMatrix();
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
  else window.addEventListener('resize', resize);
  resize();

  let inView = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { inView = en.isIntersecting; }, { rootMargin: '120px' }).observe(host);
  }

  /* ---------- Loop ---------- */
  const clock = new THREE.Clock();
  let t = 0, first = true;

  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), .05);
    if (!inView || document.hidden) return;
    t += dt;
    const k = dt * 60;
    const motion = reduce ? 0 : 1;

    mx += (targetMX - mx) * .05 * k;
    my += (targetMY - my) * .05 * k;

    const sp = section ? Math.min(1, Math.max(0, window.scrollY / (section.offsetHeight || 1))) : 0;

    if (!dragging) {
      velocity *= Math.pow(.93, k);
      angle += velocity * k + dt * .32 * motion;
    }
    spin.rotation.y = angle + sp * Math.PI * 1.1;
    tilt.rotation.x = 1.02 + my * .22 * motion - sp * .55 + Math.sin(t * .8) * .03 * motion;
    tilt.rotation.z = -mx * .2 * motion + Math.sin(t * .6) * .04 * motion;
    root.rotation.y = mx * .22 * motion;
    root.position.y = Math.sin(t * 1.2) * .08 * motion + sp * .6;

    squash *= Math.pow(.9, k);
    const wob = Math.sin((1 - squash) * 16) * squash * .09;
    main.scale.set(1 + wob, 1 - wob, 1 + wob);

    shadow.material.opacity = .85 - root.position.y * .6 - sp * .5;
    shadow.scale.x = 3.4 * (1 - root.position.y * .12);

    minis.forEach(m => {
      m.wrap.position.x = m.pos[0] + mx * m.depth * .35 * motion;
      m.wrap.position.y = m.pos[1] + Math.sin(t * m.speed + m.phase) * .14 * motion - my * m.depth * .25 * motion - sp * m.pos[1] * .4;
      m.inner.rotation.y += dt * m.rot * (1 + Math.abs(velocity) * 6);
      m.inner.rotation.z = Math.sin(t * .7 + m.phase) * .15 * motion;
    });

    floaters.forEach(f => {
      const u = f.userData;
      f.position.x = u.base.x + mx * .3 * motion;
      f.position.y = u.base.y + Math.sin(t * u.sp + u.phase) * .18 * motion - my * .2 * motion;
      f.rotation.x += dt * u.rs * motion;
      f.rotation.y += dt * u.rs * .7 * motion;
    });

    crumbs.forEach(m => {
      const u = m.userData;
      if (u.life <= 0) return;
      u.life -= dt * .9;
      u.v.y -= 9 * dt;
      m.position.addScaledVector(u.v, dt);
      m.rotation.x += dt * 8; m.rotation.z += dt * 6;
      if (u.life <= 0) m.visible = false;
    });

    renderer.render(scene, camera);

    if (first) { first = false; host.classList.add('is-ready'); }
  }
  frame();
})();
