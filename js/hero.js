/* ============================================================
   HEDENSTED LÆGEHUS — 3D/WebGL hero til FORSIDEN
   En stor, halvgennemsigtig arterie løber hen over skærmen, og
   indeni strømmer røde blodlegemer (bikonkave skiver), enkelte
   hvide blodlegemer og små blodplader fra venstre mod højre.
   Flowet er pulserende i hvilepuls-takt — som rigtigt arterielt
   blod. Lyse, venlige farver.
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
  // Mørk, cinematisk variant når hero-sektionen har klassen "hero-deep"
  const DARK = canvas.parentElement.classList.contains("hero-deep");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(DARK ? 0x072a33 : 0xeaf5ef, DARK ? 0.028 : 0.016);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.3, 11);

  /* ---------- Lys ---------- */
  if (DARK) {
    // Dybt, indre "kropslys": dæmpet ambient, varmt bagfra-skær og køligt kant-lys
    scene.add(new THREE.HemisphereLight(0x6a8d90, 0x24151a, 1.0));
    const keyLight = new THREE.DirectionalLight(0xffd9c2, 2.4);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x35d0c5, 1.1);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);
    const bloodGlow = new THREE.PointLight(0xff6a55, 9, 20, 1.9);
    bloodGlow.position.set(1.5, 0.6, 1.5);
    scene.add(bloodGlow);
  } else {
    scene.add(new THREE.HemisphereLight(0xfdfaf2, 0xd2ebdd, 1.5));
    const keyLight = new THREE.DirectionalLight(0xfff1da, 1.9);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xbdeee2, 0.9);
    fillLight.position.set(-6, -1, 4);
    scene.add(fillLight);
  }

  /* ---------- Arteriens forløb — blød S-kurve fra venstre mod højre ---------- */
  const arteryCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-17, -0.4, -2.6),
    new THREE.Vector3(-10, 0.5, -2.0),
    new THREE.Vector3(-3.5, -0.3, -1.4),
    new THREE.Vector3(2.5, 0.7, -0.9),
    new THREE.Vector3(9.5, 0.1, -0.4),
    new THREE.Vector3(16, 0.8, 0),
  ]);
  arteryCurve.curveType = "centripetal";

  const ARTERY_R = 1.5;

  /* ---------- Karvæggen — halvgennemsigtig, varm rosa ---------- */
  const wallMat = new THREE.MeshPhysicalMaterial({
    color: DARK ? 0xb45a52 : 0xf2ac9f, roughness: 0.4, metalness: 0,
    transparent: true, opacity: DARK ? 0.24 : 0.3,
    clearcoat: 0.6, clearcoatRoughness: 0.35,
    side: THREE.DoubleSide, depthWrite: false,
    emissive: DARK ? 0x5c1f1a : 0x000000,
    emissiveIntensity: DARK ? 0.35 : 0,
  });
  const wall = new THREE.Mesh(new THREE.TubeGeometry(arteryCurve, 160, ARTERY_R, 28), wallMat);
  wall.renderOrder = 2; // tegnes efter cellerne, så de ses gennem væggen
  scene.add(wall);

  // Diskret indervæg giver karret dybde
  const innerMat = new THREE.MeshBasicMaterial({
    color: DARK ? 0x8e3a32 : 0xe89a8e, transparent: true, opacity: 0.12,
    side: THREE.BackSide, depthWrite: false,
  });
  const inner = new THREE.Mesh(new THREE.TubeGeometry(arteryCurve, 160, ARTERY_R * 0.97, 28), innerMat);
  inner.renderOrder = 2;
  scene.add(inner);

  /* ---------- Rødt blodlegeme: bikonkav skive (lathe-profil) ----------
     Profilen lukker helt i centrum (x -> 0), så der ikke opstår et
     synligt hul/søm midt i fordybningen. */
  const rbcProfile = [
    [0.0, 0.05], [0.06, 0.052], [0.14, 0.06], [0.27, 0.1], [0.40, 0.13],
    [0.49, 0.1], [0.52, 0.0], [0.49, -0.1], [0.40, -0.13],
    [0.27, -0.1], [0.14, -0.06], [0.06, -0.052], [0.0, -0.05],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const rbcGeo = new THREE.LatheGeometry(rbcProfile, 32);
  rbcGeo.computeVertexNormals();

  const rbcMat = new THREE.MeshPhysicalMaterial({
    color: DARK ? 0xe0524a : 0xd6453d, roughness: 0.42, metalness: 0,
    clearcoat: 0.5, clearcoatRoughness: 0.4,
    // I mørket gløder cellerne indefra
    emissive: DARK ? 0x9c221c : 0x7a1613, emissiveIntensity: DARK ? 0.55 : 0.18,
  });

  /* ---------- Cellerne — instanser med individuel bane ---------- */
  const up = new THREE.Vector3(0, 1, 0);
  const dummy = new THREE.Object3D();
  const tmpN = new THREE.Vector3(), tmpB = new THREE.Vector3();

  function makeFlock(count, radMax, speedLo, speedHi, scaleLo, scaleHi) {
    const items = [];
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      items.push({
        s: Math.random(),
        ang,
        rad: Math.sqrt(Math.random()) * radMax, // jævn fordeling i tværsnittet
        speed: speedLo + Math.random() * (speedHi - speedLo),
        scale: scaleLo + Math.random() * (scaleHi - scaleLo),
        rx: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        spin: 0.4 + Math.random() * 1.2,
      });
    }
    return items;
  }

  function placeFlock(mesh, items, t, flow) {
    items.forEach((c, i) => {
      // Celler i midten af karret flyder hurtigst — som rigtig laminar strømning
      const profile = 1.25 - 0.6 * (c.rad / ARTERY_R);
      c.s = (c.s + c.speed * profile * flow) % 1;

      const p = arteryCurve.getPointAt(c.s);
      const tan = arteryCurve.getTangentAt(c.s);
      tmpN.crossVectors(tan, up).normalize();
      tmpB.crossVectors(tan, tmpN).normalize();

      dummy.position.copy(p)
        .addScaledVector(tmpN, Math.cos(c.ang) * c.rad)
        .addScaledVector(tmpB, Math.sin(c.ang) * c.rad);
      dummy.rotation.set(c.rx + t * c.spin, t * c.spin * 0.7, c.rz + t * c.spin * 0.5);
      dummy.scale.setScalar(c.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }

  // Røde blodlegemer
  const RBC_COUNT = 110;
  const rbcs = makeFlock(RBC_COUNT, ARTERY_R * 0.78, 0.00055, 0.0011, 0.75, 1.05);
  const rbcMesh = new THREE.InstancedMesh(rbcGeo, rbcMat, RBC_COUNT);
  rbcMesh.renderOrder = 1;
  scene.add(rbcMesh);

  // Hvide blodlegemer: få, store, langsomme
  const wbcMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8f4ec, roughness: 0.75, metalness: 0,
    clearcoat: 0.2, clearcoatRoughness: 0.6,
  });
  const WBC_COUNT = 3;
  const wbcs = makeFlock(WBC_COUNT, ARTERY_R * 0.5, 0.00035, 0.0005, 0.9, 1.1);
  const wbcMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.42, 22, 18), wbcMat, WBC_COUNT);
  wbcMesh.renderOrder = 1;
  scene.add(wbcMesh);

  // Blodplader: små, lyse linser
  const pltMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0d7a8, roughness: 0.55, metalness: 0,
  });
  const pltGeo = new THREE.SphereGeometry(0.16, 14, 10);
  pltGeo.scale(1, 0.35, 1);
  const PLT_COUNT = 16;
  const plts = makeFlock(PLT_COUNT, ARTERY_R * 0.8, 0.0006, 0.0012, 0.8, 1.2);
  const pltMesh = new THREE.InstancedMesh(pltGeo, pltMat, PLT_COUNT);
  pltMesh.renderOrder = 1;
  scene.add(pltMesh);

  /* ---------- Gimmick: syv blodlegemer bærer lægernes avatarer ----------
     Initial-avatarer som på personalesiden — skiftes til rigtige
     fotos, når de er klar. En lille easter egg i blodstrømmen. */
  function makeAvatarTexture(initials, gradIdx) {
    const S = 256;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const g = c.getContext("2d");
    const grads = [
      ["#0d3b47", "#0e7c86"],
      ["#0e7c86", "#35d0c5"],
      ["#0a4b52", "#128c96"],
    ];
    const [c1, c2] = grads[gradIdx % grads.length];
    const grad = g.createLinearGradient(0, 0, S, S);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    // Cirkulær avatar med hvid kant
    g.beginPath();
    g.arc(S / 2, S / 2, S / 2 - 4, 0, Math.PI * 2);
    g.fillStyle = grad;
    g.fill();
    g.lineWidth = 10;
    g.strokeStyle = "rgba(255,255,255,0.92)";
    g.stroke();
    g.fillStyle = "#ffffff";
    g.font = "700 96px Sora, Inter, system-ui, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(initials, S / 2, S / 2 + 6);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const DOCTORS = ["TF", "TA", "NV", "JM", "AS", "AL", "MM"];
  const crew = [];
  DOCTORS.forEach((initials, i) => {
    const cell = new THREE.Group();
    const body = new THREE.Mesh(rbcGeo, rbcMat);
    cell.add(body);

    // Avatar-skilt i fordybningen på begge sider af cellen
    const avatarMat = new THREE.MeshBasicMaterial({
      map: makeAvatarTexture(initials, i),
      transparent: true,
    });
    [1, -1].forEach((side) => {
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.27, 32), avatarMat);
      disc.rotation.x = -side * Math.PI / 2;
      disc.position.y = side * 0.145;
      cell.add(disc);
    });

    cell.scale.setScalar(1.15); // lidt større end de almindelige celler
    scene.add(cell);
    crew.push({
      obj: cell,
      s: i / DOCTORS.length + Math.random() * 0.05,
      ang: Math.random() * Math.PI * 2,
      rad: Math.sqrt(Math.random()) * ARTERY_R * 0.6,
      speed: 0.00045,
      rx: Math.random() * Math.PI * 2,
      rz: Math.random() * Math.PI * 2,
      spin: 0.25 + Math.random() * 0.2, // roligt tumlende, så skiltet kan læses
    });
  });

  function placeCrew(t, flow) {
    crew.forEach((c) => {
      const profile = 1.25 - 0.6 * (c.rad / ARTERY_R);
      c.s = (c.s + c.speed * profile * flow) % 1;
      const p = arteryCurve.getPointAt(c.s);
      const tan = arteryCurve.getTangentAt(c.s);
      tmpN.crossVectors(tan, up).normalize();
      tmpB.crossVectors(tan, tmpN).normalize();
      c.obj.position.copy(p)
        .addScaledVector(tmpN, Math.cos(c.ang) * c.rad)
        .addScaledVector(tmpB, Math.sin(c.ang) * c.rad);
      c.obj.rotation.set(c.rx + t * c.spin, t * c.spin * 0.6, c.rz + t * c.spin * 0.4);
    });
  }

  /* ---------- Diskret støv udenfor karret ---------- */
  const P_COUNT = 200;
  const pPositions = new Float32Array(P_COUNT * 3);
  for (let i = 0; i < P_COUNT; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 26;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: DARK ? 0x8ceade : 0x2aa896, size: DARK ? 0.05 : 0.04,
    transparent: true, opacity: DARK ? 0.5 : 0.28,
    sizeAttenuation: true, depthWrite: false,
    blending: DARK ? THREE.AdditiveBlending : THREE.NormalBlending,
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
    const dt = Math.min(clock.getDelta ? 0.016 : 0.016, 0.05);

    // Pulserende flow: hastigheden stiger ved hvert hjerteslag (lub-dub)
    const phase = (t * BPS) % 1;
    const beat =
      Math.exp(-Math.pow((phase - 0.12) / 0.06, 2)) +
      0.45 * Math.exp(-Math.pow((phase - 0.34) / 0.06, 2));
    const flow = 1 + beat * 1.6;

    placeFlock(rbcMesh, rbcs, t, flow);
    placeFlock(wbcMesh, wbcs, t, flow);
    placeFlock(pltMesh, plts, t, flow);
    placeCrew(t, flow);

    // Karvæggen udvider sig umærkeligt ved pulsslaget
    const ws = 1 + beat * 0.018;
    wall.scale.set(1, ws, ws);
    inner.scale.set(1, ws, ws);

    particles.rotation.y = t * 0.01;

    // Blød mus-parallakse
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    camera.position.x = pointer.x * 0.6;
    camera.position.y = 0.3 - pointer.y * 0.4;
    camera.lookAt(0.4, 0.2, 0);

    renderer.render(scene, camera);
  }

  if (reducedMotion) {
    placeFlock(rbcMesh, rbcs, 1.5, 0);
    placeFlock(wbcMesh, wbcs, 1.5, 0);
    placeFlock(pltMesh, plts, 1.5, 0);
    placeCrew(1.5, 0);
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
