/* ============================================================
   HEDENSTED LÆGEHUS — 3D/WebGL hero
   "Ambient blobs": bløde, morfende, glasagtige organiske former
   i pastel — et roligt, omsorgsfuldt udtryk.
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
  scene.fog = new THREE.FogExp2(0x062028, 0.03);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.3, 11);

  /* ---------- Lys — blødt og diffust, ingen hårde highlights ---------- */
  scene.add(new THREE.AmbientLight(0x9fc9c4, 1.5));

  const keyLight = new THREE.DirectionalLight(0xfff4e8, 1.8); // varmt hovedlys
  keyLight.position.set(5, 7, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8ceade, 1.1); // kølig mint fra venstre
  fillLight.position.set(-6, -2, 4);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x35d0c5, 1.2); // kant-lys bagfra
  rimLight.position.set(0, 3, -6);
  scene.add(rimLight);

  const glow = new THREE.PointLight(0x35d0c5, 10, 24, 1.8);
  glow.position.set(2.5, 1, 2);
  scene.add(glow);

  /* ---------- Blob-fabrik ---------- */
  // Hver blob er en kugle, hvis punkter forskydes af et blødt bølgefelt,
  // så formen morfer organisk — som flydende glas.
  function makeBlob({ color, emissive, radius, detail, opacity, seed, amp, speed, glowStrength = 0.35 }) {
    const geo = new THREE.SphereGeometry(radius, detail, Math.round(detail * 0.75));
    const posAttr = geo.getAttribute("position");
    // Gem de oprindelige retninger og radius pr. punkt
    const base = new Float32Array(posAttr.array);

    const mat = new THREE.MeshPhysicalMaterial({
      color,
      emissive,
      emissiveIntensity: glowStrength,
      roughness: 0.16,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      transparent: true,
      opacity,
      side: THREE.FrontSide,
      depthWrite: false, // pænere overlap mellem gennemsigtige former
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData = { base, seed, amp, speed, radius };
    return mesh;
  }

  // Det bløde bølgefelt, der former blobberne
  function morph(mesh, t) {
    const { base, seed, amp, speed } = mesh.userData;
    const posAttr = mesh.geometry.getAttribute("position");
    const arr = posAttr.array;
    const tt = t * speed + seed;
    for (let i = 0; i < arr.length; i += 3) {
      const x = base[i], y = base[i + 1], z = base[i + 2];
      const n =
        Math.sin(x * 1.6 + tt * 0.9) +
        Math.sin(y * 2.1 - tt * 0.7 + seed) +
        Math.sin(z * 1.8 + tt * 0.8) +
        Math.sin((x + y + z) * 1.2 - tt * 0.5);
      const f = 1 + amp * (n / 4);
      arr[i] = x * f;
      arr[i + 1] = y * f;
      arr[i + 2] = z * f;
    }
    posAttr.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  }

  /* ---------- Blobberne — pastel, spredt over scenen ---------- */
  const blobs = [
    // Hovedblob — stor, mint, til højre for teksten
    makeBlob({ color: 0xaee9d8, emissive: 0x2e8a7a, radius: 2.1, detail: 72, opacity: 0.75, seed: 0.0, amp: 0.24, speed: 0.55 }),
    // Pudder-aqua — øverst til venstre, langt tilbage
    makeBlob({ color: 0x9fd8e8, emissive: 0x1f6a7e, radius: 1.5, detail: 56, opacity: 0.6, seed: 2.1, amp: 0.3, speed: 0.45 }),
    // Blød fersken — lille, varm kontrast nederst
    makeBlob({ color: 0xf6dcc8, emissive: 0xc27a45, radius: 0.95, detail: 48, opacity: 0.72, seed: 4.4, amp: 0.34, speed: 0.7, glowStrength: 0.75 }),
    // Sart lavendel — lille, øverst til højre
    makeBlob({ color: 0xd6c9f2, emissive: 0x7d63c9, radius: 0.8, detail: 48, opacity: 0.68, seed: 6.2, amp: 0.32, speed: 0.6, glowStrength: 0.65 }),
    // Havskum — mellemstor, bagved teksten til venstre
    makeBlob({ color: 0x8fe3cf, emissive: 0x1e7a68, radius: 1.25, detail: 56, opacity: 0.5, seed: 8.7, amp: 0.28, speed: 0.5 }),
  ];

  // Ankerpositioner (drift sker omkring dem)
  const anchors = [
    new THREE.Vector3(3.4, 0.2, -0.5),
    new THREE.Vector3(-4.4, 2.2, -3.5),
    new THREE.Vector3(1.1, -2.6, -1.5),
    new THREE.Vector3(5.6, 2.8, -2.5),
    new THREE.Vector3(-2.6, -0.8, -4.5),
  ];
  blobs.forEach((b, i) => {
    b.position.copy(anchors[i]);
    scene.add(b);
  });

  /* ---------- Partikelfelt — stille "støv" ---------- */
  const P_COUNT = 450;
  const positions = new Float32Array(P_COUNT * 3);
  const seeds = new Float32Array(P_COUNT);
  for (let i = 0; i < P_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
    seeds[i] = Math.random() * Math.PI * 2;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xbfeee2, size: 0.045, transparent: true, opacity: 0.5,
    sizeAttenuation: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(pGeo, pMat);
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
    // På smalle skærme samles blobberne mere omkring midten, bag teksten
    const narrow = w < 760;
    blobs.forEach((b, i) => {
      b.position.x = narrow ? anchors[i].x * 0.45 : anchors[i].x;
    });
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------- Render-løkke ---------- */
  const clock = new THREE.Clock();
  let rafId = null;

  function frame() {
    const t = clock.getElapsedTime();

    // Morf og lad blobberne drive roligt omkring deres anker
    blobs.forEach((b, i) => {
      morph(b, t);
      const s = b.userData.seed;
      b.position.y = anchors[i].y + Math.sin(t * 0.25 + s) * 0.45;
      const narrowX = b.position.x; // x styres af resize — driften lægges oveni via rotation
      b.rotation.y = t * 0.06 * (i % 2 ? 1 : -1) + s;
      b.rotation.z = Math.sin(t * 0.15 + s) * 0.15;
      void narrowX;
    });

    particles.rotation.y = t * 0.015;
    const pos = pGeo.attributes.position;
    for (let i = 0; i < P_COUNT; i += 3) { // opdater en tredjedel pr. frame — billigt og organisk
      pos.array[i * 3 + 1] += Math.sin(t * 0.5 + seeds[i]) * 0.002;
    }
    pos.needsUpdate = true;

    glow.intensity = 9 + Math.sin(t * 0.9) * 2.5;

    // Blød mus-parallakse
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    camera.position.x = pointer.x * 0.7;
    camera.position.y = 0.3 - pointer.y * 0.45;
    camera.lookAt(0.6, 0, 0);

    renderer.render(scene, camera);
  }

  if (reducedMotion) {
    // Ét statisk, flot frame — ingen animation
    blobs.forEach((b) => morph(b, 1.7));
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
