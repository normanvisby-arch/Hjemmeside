/* ============================================================
   HEDENSTED LÆGEHUS — 3D/WebGL hero
   Animeret EKG-signal: en glødende 3D-kurve med realistiske
   komplekser (P-tak, QRS, T-tak) der pulserer hen over skærmen
   på klassisk millimeterpapir — i lyse, luftige farver.
   Renderet med Three.js (global THREE fra js/vendor/three.min.js).
   Falder pænt tilbage til CSS-gradienten hvis WebGL mangler,
   og respekterer "prefers-reduced-motion".
   ============================================================ */

const canvas = document.getElementById("hero-canvas");

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

if (canvas && typeof THREE !== "undefined" && webglAvailable()) {
  init(canvas);
}

/* ------------------------------------------------------------
   EKG-kurven — én hjertecyklus, u ∈ [0;1).
   Opbygget af gaussiske komponenter med realistisk morfologi
   og timing (PR-interval ~0.16 s, QRS ~0.08 s, QT ~0.36 s ved
   en cyklus på ~0.95 s):
     P-tak   : lille, rund forkammer-depolarisering
     Q-tak   : lille negativ udsving
     R-tak   : høj, smal spids
     S-tak   : negativt udsving efter R
     T-tak   : bredere, asymmetrisk repolarisering
   ------------------------------------------------------------ */
function gauss(u, mu, sigma, amp) {
  const d = u - mu;
  return amp * Math.exp(-(d * d) / (2 * sigma * sigma));
}

function ecg(s) {
  const u = s - Math.floor(s); // én cyklus
  let y = 0;
  y += gauss(u, 0.17, 0.022, 0.13);   // P
  y += gauss(u, 0.235, 0.009, -0.10); // Q
  y += gauss(u, 0.255, 0.011, 1.0);   // R
  y += gauss(u, 0.278, 0.010, -0.24); // S
  y += gauss(u, 0.30, 0.02, 0.02);    // let ST-løft op mod T
  y += gauss(u, 0.44, 0.045, 0.30);   // T
  y += gauss(u, 0.47, 0.025, 0.06);   // T'ens asymmetri (stejlere bagkant)
  y += 0.012 * Math.sin(s * 2.1);     // diskret baseline-vandring
  return y;
}

/* ---------- Millimeterpapir (klassisk lys rosa EKG-grid) ---------- */
function makePaperTexture() {
  const S = 200; // én stor rude = 5 små
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const g = c.getContext("2d");
  g.clearRect(0, 0, S, S);
  // små ruder
  g.strokeStyle = "rgba(226, 150, 150, 0.35)";
  g.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const p = (i * S) / 5 + 0.5;
    g.beginPath(); g.moveTo(p, 0); g.lineTo(p, S); g.stroke();
    g.beginPath(); g.moveTo(0, p); g.lineTo(S, p); g.stroke();
  }
  // stor rude
  g.strokeStyle = "rgba(219, 120, 120, 0.55)";
  g.lineWidth = 1.6;
  g.strokeRect(0.8, 0.8, S - 1.6, S - 1.6);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/* ---------- Blød glød-sprite til kurvens "hoved" ---------- */
function makeGlowTexture() {
  const S = 128;
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0, "rgba(53, 208, 197, 0.95)");
  grad.addColorStop(0.35, "rgba(53, 208, 197, 0.45)");
  grad.addColorStop(1, "rgba(53, 208, 197, 0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function init(canvas) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xe9f5f0, 0.02);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.3, 11);

  /* ---------- Gruppe med let 3D-tilt ---------- */
  const ekg = new THREE.Group();
  ekg.rotation.y = -0.14;
  ekg.rotation.x = 0.05;
  scene.add(ekg);

  /* ---------- Papiret ---------- */
  const paperTex = makePaperTexture();
  const PAPER_W = 30, PAPER_H = 13;
  const CELL = 1.25; // én stor rude i world-units
  paperTex.repeat.set(PAPER_W / CELL, PAPER_H / CELL);
  const paper = new THREE.Mesh(
    new THREE.PlaneGeometry(PAPER_W, PAPER_H),
    new THREE.MeshBasicMaterial({ map: paperTex, transparent: true, opacity: 0.5, depthWrite: false })
  );
  paper.position.set(0, -0.1, -0.9);
  ekg.add(paper);

  /* ---------- EKG-kurven som rør med aftagende hale ----------
     Geometrien allokeres én gang; y-værdier, tykkelse og retning
     opdateres på plads hver frame — ingen ny hukommelse pr. frame. */
  const SAMPLES = 460;
  const RADIAL = 8;
  const X_MIN = -10.5, X_MAX = 6.1; // kurven ender i "skrivespidsen" i højre side
  const DX = (X_MAX - X_MIN) / (SAMPLES - 1);
  const AMP = 1.55;         // R-takkens højde i world-units
  const BASE_Y = -0.15;     // kurvens baselinje
  const BEATS_PER_UNIT = 1 / 3.3; // bølgelængde: én cyklus ≈ 3,3 world-units
  const BPS = 1.05;         // ~63 slag/min

  const ringCos = [], ringSin = [];
  for (let j = 0; j < RADIAL; j++) {
    const a = (j / RADIAL) * Math.PI * 2;
    ringCos.push(Math.cos(a));
    ringSin.push(Math.sin(a));
  }

  const vertCount = SAMPLES * RADIAL;
  const positions = new Float32Array(vertCount * 3);
  const colors = new Float32Array(vertCount * 3);
  const indices = [];
  for (let i = 0; i < SAMPLES - 1; i++) {
    for (let j = 0; j < RADIAL; j++) {
      const a = i * RADIAL + j;
      const b = i * RADIAL + ((j + 1) % RADIAL);
      const c2 = (i + 1) * RADIAL + j;
      const d = (i + 1) * RADIAL + ((j + 1) % RADIAL);
      indices.push(a, c2, b, b, c2, d);
    }
  }

  // Farve: bleg mod halen (venstre), dyb teal mod hovedet (højre)
  const tail = new THREE.Color(0xbfe3d9);
  const headCol = new THREE.Color(0x0e7c86);
  const tmpCol = new THREE.Color();
  for (let i = 0; i < SAMPLES; i++) {
    const f = Math.pow(i / (SAMPLES - 1), 1.6);
    tmpCol.copy(tail).lerp(headCol, f);
    for (let j = 0; j < RADIAL; j++) {
      const o = (i * RADIAL + j) * 3;
      colors[o] = tmpCol.r; colors[o + 1] = tmpCol.g; colors[o + 2] = tmpCol.b;
    }
  }

  const traceGeo = new THREE.BufferGeometry();
  traceGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  traceGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  traceGeo.setIndex(indices);
  const traceMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  const trace = new THREE.Mesh(traceGeo, traceMat);
  ekg.add(trace);

  // Radius: tynd hale → kraftigt hoved
  function radiusAt(i) {
    const f = i / (SAMPLES - 1);
    return 0.014 + 0.05 * Math.pow(f, 1.5);
  }

  const ys = new Float32Array(SAMPLES);

  function updateTrace(time) {
    // 1) Beregn kurvens y-værdier (signalet ruller mod venstre)
    for (let i = 0; i < SAMPLES; i++) {
      const x = X_MIN + i * DX;
      ys[i] = BASE_Y + AMP * ecg(x * BEATS_PER_UNIT + time * BPS);
    }
    // 2) Byg røret omkring kurven — retningen følger kurvens hældning,
    //    så selv de stejle QRS-flanker får jævn tykkelse
    for (let i = 0; i < SAMPLES; i++) {
      const x = X_MIN + i * DX;
      const yPrev = ys[Math.max(0, i - 1)];
      const yNext = ys[Math.min(SAMPLES - 1, i + 1)];
      let tx = 2 * DX, ty = yNext - yPrev;
      const tl = Math.hypot(tx, ty);
      tx /= tl; ty /= tl;
      // normal i kurvens plan (peger "op" i forhold til retningen)
      const nx = -ty, ny = tx;
      const r = radiusAt(i);
      for (let j = 0; j < RADIAL; j++) {
        const o = (i * RADIAL + j) * 3;
        positions[o] = x + r * ringCos[j] * nx;
        positions[o + 1] = ys[i] + r * ringCos[j] * ny;
        positions[o + 2] = r * ringSin[j]; // dybde giver rørets runding
      }
    }
    traceGeo.attributes.position.needsUpdate = true;
    traceGeo.computeBoundingSphere();
  }

  /* ---------- Glødende "hoved" + puls-lys ---------- */
  const glowTex = makeGlowTexture();
  const headGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, opacity: 0.9,
  }));
  headGlow.scale.setScalar(0.9);
  ekg.add(headGlow);

  const headDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x0e7c86 })
  );
  ekg.add(headDot);

  const pulseLight = new THREE.PointLight(0x35d0c5, 4, 14, 2);
  ekg.add(pulseLight);

  /* ---------- Diskret støv i luften ---------- */
  const P_COUNT = 260;
  const pPositions = new Float32Array(P_COUNT * 3);
  const pSeeds = new Float32Array(P_COUNT);
  for (let i = 0; i < P_COUNT; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 26;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    pSeeds[i] = Math.random() * Math.PI * 2;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x2aa896, size: 0.04, transparent: true, opacity: 0.35,
    sizeAttenuation: true, depthWrite: false,
  }));
  scene.add(particles);

  /* ---------- Interaktion ---------- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function resize() {
    const hero = canvas.parentElement;
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // På smalle skærme skaleres sceneriet ned og forskydes,
    // så skrivespidsen forbliver synlig i højre side
    const narrow = w < 760;
    ekg.scale.setScalar(narrow ? 0.72 : 1);
    ekg.position.y = narrow ? 0.6 : 0;
    ekg.position.x = narrow ? -2.9 : 0;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------- Render-løkke ---------- */
  const clock = new THREE.Clock();
  let rafId = null;

  // Skrivespidsen sidder for enden af kurven — signalet strømmer ud fra den
  const HEAD_I = SAMPLES - 1;
  const HEAD_X = X_MIN + HEAD_I * DX;

  function frame() {
    const t = clock.getElapsedTime();

    updateTrace(t);

    // Hovedets position + puls ved hver R-tak
    const headY = ys[HEAD_I];
    headDot.position.set(HEAD_X, headY, 0.05);
    headGlow.position.set(HEAD_X, headY, 0.1);
    pulseLight.position.set(HEAD_X, headY, 1.2);

    const u = HEAD_X * BEATS_PER_UNIT + t * BPS;
    const phase = u - Math.floor(u);
    const dR = phase - 0.255;
    const pulse = Math.exp(-(dR * dR) / (2 * 0.03 * 0.03));
    headGlow.scale.setScalar(0.7 + 1.4 * pulse);
    headGlow.material.opacity = 0.55 + 0.45 * pulse;
    pulseLight.intensity = 3 + 22 * pulse;

    // Papiret ånder næsten umærkeligt i takt med pulsen
    paper.material.opacity = 0.46 + 0.08 * pulse;

    particles.rotation.y = t * 0.012;

    // Blød mus-parallakse
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    camera.position.x = pointer.x * 0.6;
    camera.position.y = 0.3 - pointer.y * 0.4;
    camera.lookAt(0.4, 0, 0);

    renderer.render(scene, camera);
  }

  if (reducedMotion) {
    // Ét statisk, flot frame — kurven står stille med et pænt kompleks
    updateTrace(0.35);
    headDot.position.set(HEAD_X, ys[HEAD_I], 0.05);
    headGlow.position.set(HEAD_X, ys[HEAD_I], 0.1);
    renderer.render(scene, camera);
    window.addEventListener("resize", () => { resize(); renderer.render(scene, camera); });
  } else {
    const loop = () => { frame(); rafId = requestAnimationFrame(loop); };
    loop();
    // Pausér når fanen er skjult eller hero er scrollet ud af syne
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { cancelAnimationFrame(rafId); rafId = null; }
      else if (!rafId) loop();
    });
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) { cancelAnimationFrame(rafId); rafId = null; }
      else if (!rafId && !document.hidden) loop();
    }, { threshold: 0.02 });
    io.observe(canvas.parentElement);
  }
}
