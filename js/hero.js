/* ============================================================
   HEDENSTED LÆGEHUS — 3D/WebGL hero til FORSIDEN
   Stiliseret stetoskop: to buede metal-ørebøjler samles i en
   blød, mintgrøn slange, der løber i et elegant S ned til
   bryststykket, hvis membran "banker" roligt som et hjerteslag.
   Lyse, venlige farver — champagne-metal og frisk mint.
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

  /* ---------- Lys — lyst og venligt ---------- */
  scene.add(new THREE.HemisphereLight(0xfdfaf2, 0xd2ebdd, 1.5));

  const keyLight = new THREE.DirectionalLight(0xfff1da, 1.9);
  keyLight.position.set(5, 7, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xbdeee2, 0.9);
  fillLight.position.set(-6, -1, 4);
  scene.add(fillLight);

  /* ---------- Materialer ---------- */
  const metalMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0d8a6, roughness: 0.25, metalness: 0.55, // lys champagne
    clearcoat: 0.7, clearcoatRoughness: 0.2,
  });
  const tubeMat = new THREE.MeshPhysicalMaterial({
    color: 0x66dfc9, roughness: 0.35, metalness: 0.02, // lys, frisk mint
    clearcoat: 0.65, clearcoatRoughness: 0.25,
    emissive: 0x2a8f7f, emissiveIntensity: 0.07,
  });
  const oliveMat = new THREE.MeshPhysicalMaterial({
    color: 0x35b3a0, roughness: 0.45, metalness: 0, // dybere mint til øreoliven
    clearcoat: 0.4, clearcoatRoughness: 0.35,
  });
  const membraneMat = new THREE.MeshPhysicalMaterial({
    color: 0xfbfaf5, roughness: 0.35, metalness: 0.05,
    emissive: 0x35d0c5, emissiveIntensity: 0.0, // pulserer i render-løkken
  });

  /* ---------- Stetoskopet ---------- */
  const steto = new THREE.Group();
  scene.add(steto);

  // -- Ørebøjler i metal: klassisk lyre-form, samles i Y'et --
  const Y_POINT = new THREE.Vector3(0, 1.3, 0.05);

  function earTube(side) {
    const pts = [
      new THREE.Vector3(side * 0.72, 3.25, 0),
      new THREE.Vector3(side * 0.84, 2.8, 0.06),
      new THREE.Vector3(side * 0.62, 2.1, 0.1),
      new THREE.Vector3(side * 0.22, 1.55, 0.08),
      Y_POINT.clone(),
    ];
    const curve = new THREE.CatmullRomCurve3(pts);
    curve.curveType = "centripetal";
    return curve;
  }

  [-1, 1].forEach((side) => {
    const curve = earTube(side);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.055, 14), metalMat);
    steto.add(tube);

    // Øreoliven: blød, afrundet dråbe, vinklet ind mod øret
    const olive = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 16), oliveMat);
    olive.scale.set(1, 1.25, 1);
    olive.position.set(side * 0.7, 3.38, 0);
    olive.rotation.z = -side * 0.35;
    steto.add(olive);
  });

  // Lille fjederbøjle mellem de to metalrør
  const springCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.52, 2.25, 0.12),
    new THREE.Vector3(0, 2.05, 0.16),
    new THREE.Vector3(0.52, 2.25, 0.12),
  ]);
  const spring = new THREE.Mesh(new THREE.TubeGeometry(springCurve, 32, 0.028, 10), metalMat);
  steto.add(spring);

  // -- Y-muffe hvor metal møder gummislangen --
  const yoke = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.34, 16), metalMat);
  yoke.position.copy(Y_POINT);
  steto.add(yoke);

  // -- Gummislangen: elegant S-forløb ned til bryststykket --
  const CHEST = new THREE.Vector3(-0.55, -2.85, 0.2); // hvor slangen ender
  const tubePts = [
    Y_POINT.clone(),
    new THREE.Vector3(0.28, 0.55, 0.22),
    new THREE.Vector3(0.62, -0.5, 0.12),
    new THREE.Vector3(0.35, -1.6, -0.05),
    new THREE.Vector3(-0.25, -2.35, 0.1),
    CHEST.clone(),
  ];
  const tubeCurve = new THREE.CatmullRomCurve3(tubePts);
  tubeCurve.curveType = "centripetal";
  const rubber = new THREE.Mesh(new THREE.TubeGeometry(tubeCurve, 140, 0.085, 16), tubeMat);
  steto.add(rubber);

  // -- Bryststykket: stilk, klokke og lys membran --
  const chest = new THREE.Group();

  const stemDir = tubeCurve.getTangent(1).normalize();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 0.5, 16), metalMat);
  stem.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), stemDir.clone().negate());
  stem.position.copy(stemDir.clone().multiplyScalar(0.22));
  chest.add(stem);

  // Klokken: affaset dobbelt-cylinder — membranen vender mod beskueren
  const drum = new THREE.Group();
  const bellBack = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.16, 36), metalMat);
  bellBack.position.z = -0.08;
  bellBack.rotation.x = Math.PI / 2;
  drum.add(bellBack);
  const bellFront = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.52, 0.12, 36), metalMat);
  bellFront.position.z = 0.06;
  bellFront.rotation.x = Math.PI / 2;
  drum.add(bellFront);
  const membrane = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.025, 36), membraneMat);
  membrane.position.z = 0.135;
  membrane.rotation.x = Math.PI / 2;
  drum.add(membrane);

  drum.position.copy(stemDir.clone().multiplyScalar(0.55));
  drum.rotation.x = 0.35; // membranen vipper op mod beskueren
  drum.rotation.y = -0.25;
  chest.add(drum);

  chest.position.copy(CHEST);
  steto.add(chest);

  steto.position.set(3.2, 0.4, 0);
  steto.rotation.z = -0.05;
  steto.scale.setScalar(0.95); // hele stetoskopet, inkl. bryststykke, i billedet

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
    // På smalle skærme rykkes stetoskopet ind i midten bag teksten
    steto.position.x = w < 760 ? 0.7 : 3.2;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------- Render-løkke ---------- */
  const clock = new THREE.Clock();
  let rafId = null;
  const BPS = 63 / 60; // roligt hvilepuls-tempo

  function frame() {
    const t = clock.getElapsedTime();

    // Blid svajen og løft — som om stetoskopet hænger og dingler let
    steto.rotation.y = Math.sin(t * 0.3) * 0.3;
    steto.rotation.z = -0.05 + Math.sin(t * 0.42) * 0.03;
    steto.position.y = 0.4 + Math.sin(t * 0.55) * 0.14;

    // Bryststykket svinger ganske let som et pendul
    chest.rotation.z = Math.sin(t * 0.8) * 0.06;
    chest.rotation.x = Math.sin(t * 0.65 + 0.8) * 0.05;

    // Membranen "banker" roligt — dobbeltslag som et hjerte (lub-dub)
    const phase = (t * BPS) % 1;
    const beat =
      Math.exp(-Math.pow((phase - 0.12) / 0.045, 2)) +
      0.55 * Math.exp(-Math.pow((phase - 0.32) / 0.05, 2));
    membrane.material.emissiveIntensity = beat * 0.45;
    const s = 1 + beat * 0.035;
    membrane.scale.set(s, 1, s);

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
    renderer.render(scene, camera);
    window.addEventListener("resize", () => { resize(); renderer.render(scene, camera); });
  } else {
    const loop = () => { frame(); rafId = requestAnimationFrame(loop); };
    loop();
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
