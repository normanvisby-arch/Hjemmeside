/* ============================================================
   HEDENSTED LÆGEHUS — 3D/WebGL hero
   Æskulapstav (slangen om staven) + partikelfelt renderet med
   Three.js (global THREE fra js/vendor/three.min.js — virker
   også direkte fra disk).
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
  scene.fog = new THREE.FogExp2(0x062028, 0.055);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.4, 11);

  /* ---------- Lys ---------- */
  scene.add(new THREE.AmbientLight(0x2a6b70, 1.4));

  const keyLight = new THREE.DirectionalLight(0x9ff0e2, 2.2);
  keyLight.position.set(4, 6, 6);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x0e7c86, 1.6);
  rimLight.position.set(-6, -3, -4);
  scene.add(rimLight);

  const glow = new THREE.PointLight(0x35d0c5, 14, 22, 1.8);
  glow.position.set(2.5, 1, 2);
  scene.add(glow);

  /* ---------- Æskulapstav ---------- */
  const aesculap = new THREE.Group();
  scene.add(aesculap);

  const staffMat = new THREE.MeshStandardMaterial({
    color: 0xe8f6f1, roughness: 0.3, metalness: 0.55,
    emissive: 0x1a6a70, emissiveIntensity: 0.25,
  });
  const snakeMat = new THREE.MeshStandardMaterial({
    color: 0x35d0c5, roughness: 0.35, metalness: 0.3,
    emissive: 0x0b5f58, emissiveIntensity: 0.55,
  });

  // Staven — let konisk med knop i toppen
  const STAFF_H = 8.2;
  const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, STAFF_H, 24), staffMat);
  aesculap.add(staff);

  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), staffMat);
  knob.position.y = STAFF_H / 2 + 0.18;
  aesculap.add(knob);

  const foot = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 20), staffMat);
  foot.position.y = -STAFF_H / 2;
  aesculap.add(foot);

  // Slangen — en jævn spiral omkring staven, tegnet som et rør
  const TURNS = 4;
  const SNAKE_TOP = 3.1;
  const SNAKE_BOTTOM = -3.5;
  const COIL_R = 0.46;

  const pts = [];
  const N = 140;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const angle = t * Math.PI * 2 * TURNS;
    // Spiralen strammer let til opad — som på det klassiske symbol
    const r = COIL_R * (1.06 - 0.18 * t);
    pts.push(new THREE.Vector3(
      Math.cos(angle) * r,
      SNAKE_BOTTOM + (SNAKE_TOP - SNAKE_BOTTOM) * t,
      Math.sin(angle) * r
    ));
  }
  // Halen svinger ud forneden, hovedet løfter sig fri af staven foroven
  pts[0].multiplyScalar(1.9).setY(SNAKE_BOTTOM - 0.25);
  const last = pts[N];
  pts.push(new THREE.Vector3(last.x * 1.7, SNAKE_TOP + 0.45, last.z * 1.7));

  const snakeCurve = new THREE.CatmullRomCurve3(pts);
  const snake = new THREE.Mesh(new THREE.TubeGeometry(snakeCurve, 320, 0.15, 14), snakeMat);
  aesculap.add(snake);

  // Hale-spids og hoved
  const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 14), snakeMat);
  tailTip.position.copy(snakeCurve.getPoint(0));
  aesculap.add(tailTip);

  const headPos = snakeCurve.getPoint(1);
  const headTangent = snakeCurve.getTangent(1);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), snakeMat);
  head.scale.set(1.55, 1.05, 1.15);
  head.position.copy(headPos).addScaledVector(headTangent, 0.18);
  head.lookAt(headPos.clone().addScaledVector(headTangent, 2));
  aesculap.add(head);

  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x062028, roughness: 0.2, metalness: 0.1,
    emissive: 0x9ff0e2, emissiveIntensity: 0.6,
  });
  [-1, 1].forEach((side) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), eyeMat);
    eye.position.copy(head.position);
    eye.position.y += 0.09;
    // Placér øjnene på hver side af hovedet, vinkelret på kigge-retningen
    const sideDir = new THREE.Vector3().crossVectors(headTangent, new THREE.Vector3(0, 1, 0)).normalize();
    eye.position.addScaledVector(sideDir, side * 0.13);
    eye.position.addScaledVector(headTangent, 0.16);
    aesculap.add(eye);
  });

  aesculap.position.set(3.1, 0, 0);
  aesculap.rotation.z = -0.1;
  aesculap.scale.setScalar(0.82); // hele symbolet, inkl. knop og hoved, skal være i billedet

  /* ---------- Medicinsk kryds (svæver til venstre) ---------- */
  const cross = new THREE.Group();
  const crossMat = new THREE.MeshStandardMaterial({
    color: 0x9ff0e2, roughness: 0.2, metalness: 0.5,
    emissive: 0x2ba89f, emissiveIntensity: 0.7,
  });
  const barGeo = new THREE.BoxGeometry(0.9, 0.3, 0.3);
  const bar1 = new THREE.Mesh(barGeo, crossMat);
  const bar2 = new THREE.Mesh(barGeo, crossMat);
  bar2.rotation.z = Math.PI / 2;
  cross.add(bar1, bar2);
  cross.position.set(-4.6, 1.6, -2);
  scene.add(cross);

  /* ---------- Partikelfelt ---------- */
  const P_COUNT = 700;
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
    color: 0x8ceade, size: 0.05, transparent: true, opacity: 0.65,
    sizeAttenuation: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ---------- Store bløde "celler" i baggrunden ---------- */
  const cellMat = new THREE.MeshStandardMaterial({
    color: 0x0e7c86, roughness: 0.9, metalness: 0,
    transparent: true, opacity: 0.16,
  });
  const cells = [];
  for (let i = 0; i < 5; i++) {
    const cell = new THREE.Mesh(new THREE.SphereGeometry(0.7 + Math.random() * 0.9, 24, 24), cellMat);
    cell.position.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 9, -5 - Math.random() * 5);
    cell.userData.seed = Math.random() * Math.PI * 2;
    cells.push(cell);
    scene.add(cell);
  }

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
    // På smalle skærme rykkes staven ind i midten bag teksten
    aesculap.position.x = w < 760 ? 0.6 : 3.1;
    cross.visible = w >= 760;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------- Render-løkke ---------- */
  const clock = new THREE.Clock();
  let rafId = null;

  function frame() {
    const t = clock.getElapsedTime();

    // Staven drejer roligt om sin egen akse og "ånder" let op og ned
    aesculap.rotation.y = t * 0.3;
    aesculap.position.y = Math.sin(t * 0.6) * 0.18;
    aesculap.rotation.z = -0.1 + Math.sin(t * 0.4) * 0.03;

    // Slangen pulserer svagt — som et roligt åndedræt
    snakeMat.emissiveIntensity = 0.55 + Math.sin(t * 1.6) * 0.15;

    cross.rotation.x = t * 0.5;
    cross.rotation.y = t * 0.35;
    cross.position.y = 1.6 + Math.sin(t * 0.8) * 0.3;

    particles.rotation.y = t * 0.02;
    const pos = pGeo.attributes.position;
    for (let i = 0; i < P_COUNT; i += 3) { // opdater en tredjedel pr. frame — billigt og organisk
      pos.array[i * 3 + 1] += Math.sin(t * 0.6 + seeds[i]) * 0.0025;
    }
    pos.needsUpdate = true;

    cells.forEach((c, i) => {
      c.position.y += Math.sin(t * 0.3 + c.userData.seed) * 0.003;
      c.rotation.y = t * 0.05 * (i % 2 ? 1 : -1);
    });

    glow.intensity = 12 + Math.sin(t * 1.4) * 3;

    // Blød mus-parallakse
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    camera.position.x = pointer.x * 0.7;
    camera.position.y = 0.4 - pointer.y * 0.45;
    camera.lookAt(0.6, 0, 0);

    renderer.render(scene, camera);
  }

  if (reducedMotion) {
    // Ét statisk, flot frame — ingen animation
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
