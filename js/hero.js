/* ============================================================
   HEDENSTED LÆGEHUS — 3D/WebGL hero til FORSIDEN
   Stiliseret æskulapstav: gylden stav med en venlig, mintgrøn
   slange — glatte, blanke former i lyse farver som en moderne
   3D-illustration. Tydeligt slangehoved med store øjne og
   spillende tunge.
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

/* ---------- Rør-geometri med varierende radius (hale → krop → hals) ---------- */
function taperedTube(curve, segments, radial, radiusAt) {
  const frames = curve.computeFrenetFrames(segments, false);
  const positions = [], normals = [], uvs = [], indices = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const N = frames.normals[i], B = frames.binormals[i];
    const r = radiusAt(t);
    for (let j = 0; j <= radial; j++) {
      const ang = (j / radial) * Math.PI * 2;
      const sin = Math.sin(ang), cos = Math.cos(ang);
      const nx = cos * N.x + sin * B.x;
      const ny = cos * N.y + sin * B.y;
      const nz = cos * N.z + sin * B.z;
      positions.push(p.x + r * nx, p.y + r * ny, p.z + r * nz);
      normals.push(nx, ny, nz);
      uvs.push(t, j / radial);
    }
  }
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b = a + radial + 1;
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
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
  scene.fog = new THREE.FogExp2(0xeaf5ef, 0.018);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.3, 11);

  /* ---------- Lys — lyst og venligt, ingen tunge skygger ---------- */
  scene.add(new THREE.HemisphereLight(0xfdfaf2, 0xd2ebdd, 1.5));

  const keyLight = new THREE.DirectionalLight(0xfff1da, 1.9); // varm sol
  keyLight.position.set(5, 7, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xbdeee2, 0.9); // frisk mint
  fillLight.position.set(-6, -1, 4);
  scene.add(fillLight);

  /* ---------- Materialer — glatte og blanke, som poleret legetøj ---------- */
  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xe8c27e, roughness: 0.28, metalness: 0.45,
    clearcoat: 0.6, clearcoatRoughness: 0.25,
  });
  const snakeMat = new THREE.MeshPhysicalMaterial({
    color: 0x2fc4ad, roughness: 0.3, metalness: 0.05,
    clearcoat: 0.7, clearcoatRoughness: 0.2,
    emissive: 0x0f6a5c, emissiveIntensity: 0.12,
  });

  /* ---------- Æskulapstaven ---------- */
  const aesculap = new THREE.Group();
  scene.add(aesculap);

  const STAFF_H = 8.2;
  const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, STAFF_H, 28), goldMat);
  aesculap.add(staff);

  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.32, 28, 28), goldMat);
  knob.position.y = STAFF_H / 2 + 0.2;
  aesculap.add(knob);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.05, 12, 24), goldMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = STAFF_H / 2 - 0.12;
  aesculap.add(collar);

  const foot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 22, 22), goldMat);
  foot.position.y = -STAFF_H / 2;
  aesculap.add(foot);

  /* ---------- Slangen — blød spiral med fyldig krop ---------- */
  const TURNS = 3.5;
  const SNAKE_TOP = 2.9;
  const SNAKE_BOTTOM = -3.4;
  const COIL_R = 0.5;

  const pts = [];
  const N = 130;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const angle = t * Math.PI * 2 * TURNS;
    const r = COIL_R * (1.05 - 0.14 * t);
    pts.push(new THREE.Vector3(
      Math.cos(angle) * r,
      SNAKE_BOTTOM + (SNAKE_TOP - SNAKE_BOTTOM) * t,
      Math.sin(angle) * r
    ));
  }
  // Halen svinger blødt ud forneden, hovedet løfter sig frit foroven
  pts[0].multiplyScalar(1.8).setY(SNAKE_BOTTOM - 0.3);
  const last = pts[N];
  pts.push(new THREE.Vector3(last.x * 1.8, SNAKE_TOP + 0.5, last.z * 1.8));

  const snakeCurve = new THREE.CatmullRomCurve3(pts);

  // Fyldig, "buttet" krop: spids hale → tyk midte → hals
  const BODY_R = 0.21;
  const radiusAt = (t) => {
    const tail = Math.min(1, t / 0.25);
    const ease = tail * tail * (3 - 2 * tail);
    const r = 0.03 + (BODY_R - 0.03) * ease;
    const neck = t > 0.86 ? (t - 0.86) / 0.14 : 0;
    return r * (1 - 0.3 * neck * neck);
  };

  const snake = new THREE.Mesh(taperedTube(snakeCurve, 380, 20, radiusAt), snakeMat);
  aesculap.add(snake);

  const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), snakeMat);
  tailTip.position.copy(snakeCurve.getPoint(0));
  aesculap.add(tailTip);

  /* ---------- Hovedet — stort, venligt og tydeligt (bygget mod +Z) ---------- */
  const headPivot = new THREE.Group();
  const head = new THREE.Group();
  headPivot.add(head);

  // Kranium: stor afrundet dråbeform
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 26), snakeMat);
  skull.scale.set(1.0, 0.82, 1.35);
  head.add(skull);

  // Snude: blødt afrundet, let opadvendt
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.2, 26, 20), snakeMat);
  snout.scale.set(0.78, 0.6, 1.1);
  snout.position.set(0, -0.05, 0.33);
  head.add(snout);

  // Store, venlige øjne: hvid sklera + mørk pupil + lysglimt
  const scleraMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x123033 });
  const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  [-1, 1].forEach((side) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.115, 22, 22), scleraMat);
    eye.position.set(side * 0.19, 0.12, 0.22);
    head.add(eye);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 16), pupilMat);
    pupil.position.set(side * 0.2, 0.12, 0.315);
    head.add(pupil);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), glintMat);
    glint.position.set(side * 0.175, 0.155, 0.36);
    head.add(glint);
    // blødt øjenbryn giver karakter
    const brow = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), snakeMat);
    brow.scale.set(1.1, 0.38, 0.9);
    brow.position.set(side * 0.19, 0.235, 0.2);
    head.add(brow);
  });

  // Næsebor
  const nostrilMat = new THREE.MeshBasicMaterial({ color: 0x0d4b42 });
  [-1, 1].forEach((side) => {
    const nostril = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), nostrilMat);
    nostril.position.set(side * 0.07, -0.02, 0.51);
    head.add(nostril);
  });

  // Kløftet koral-tunge, der spiller
  const tongue = new THREE.Group();
  const tongueMat = new THREE.MeshStandardMaterial({ color: 0xf2766b, roughness: 0.5 });
  const tongueBase = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.26, 8), tongueMat);
  tongueBase.rotation.x = Math.PI / 2;
  tongueBase.position.z = 0.13;
  tongue.add(tongueBase);
  [-1, 1].forEach((side) => {
    const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.017, 0.14, 6), tongueMat);
    fork.rotation.x = Math.PI / 2;
    fork.rotation.z = side * 0.5;
    fork.position.set(side * 0.033, 0, 0.3);
    tongue.add(fork);
  });
  tongue.position.set(0, -0.1, 0.5);
  tongue.scale.z = 0.001;
  tongue.visible = false;
  head.add(tongue);

  // Placér og orientér hovedet for enden af kroppen
  const headPos = snakeCurve.getPoint(1);
  const headTangent = snakeCurve.getTangent(1);
  headPivot.position.copy(headPos).addScaledVector(headTangent, 0.2);
  headPivot.lookAt(headPivot.position.clone().addScaledVector(headTangent, 2));
  aesculap.add(headPivot);

  aesculap.position.set(3.1, 0, 0);
  aesculap.rotation.z = -0.08;
  aesculap.scale.setScalar(0.8); // hele symbolet, inkl. knop og hoved, i billedet

  /* ---------- Diskret støv i luften ---------- */
  const P_COUNT = 260;
  const pPositions = new Float32Array(P_COUNT * 3);
  for (let i = 0; i < P_COUNT; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 26;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x2aa896, size: 0.04, transparent: true, opacity: 0.32,
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
    // På smalle skærme rykkes staven ind i midten bag teksten
    aesculap.position.x = w < 760 ? 0.6 : 3.1;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------- Render-løkke ---------- */
  const clock = new THREE.Clock();
  let rafId = null;

  function frame() {
    const t = clock.getElapsedTime();

    // Staven drejer roligt og "ånder" let
    aesculap.rotation.y = t * 0.28;
    aesculap.position.y = Math.sin(t * 0.55) * 0.16;
    aesculap.rotation.z = -0.08 + Math.sin(t * 0.4) * 0.025;

    // Hovedet vejrer nysgerrigt
    head.rotation.y = Math.sin(t * 0.6) * 0.16;
    head.rotation.x = Math.sin(t * 0.45 + 1.2) * 0.08;

    // Tungen spiller ud cirka hvert 4. sekund — to hurtige flik
    const cycle = t % 4.2;
    let ext = 0;
    if (cycle < 0.55) ext = Math.abs(Math.sin((cycle / 0.55) * Math.PI * 2));
    tongue.visible = ext > 0.03;
    tongue.scale.z = Math.max(0.001, ext);

    particles.rotation.y = t * 0.012;

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

if (canvas && typeof THREE !== "undefined" && webglAvailable()) {
  init(canvas);
}
