/* ============================================================
   HEDENSTED LÆGEHUS — 3D/WebGL hero til FORSIDEN
   En stor, halvgennemsigtig arterie løber hen over skærmen, og
   indeni strømmer røde blodlegemer (bikonkave skiver), enkelte
   hvide blodlegemer og små blodplader fra venstre mod højre.
   Cellerne har fast fysik: de kolliderer og bouncer blødt mod
   hinanden og mod karvæggen, og flowet pulserer i hvilepuls-takt.
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
  const CURVE_LEN = arteryCurve.getLength();

  /* ---------- Karvæggen — halvgennemsigtig ---------- */
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

  /* ---------- Cellefysik ----------
     Cellerne simuleres i "rør-koordinater": a = position langs karret
     (buelængde), (x, y) = tværsnits-forskydning. Det gør kollisioner
     og vægafvisning enkle, selvom karret snor sig. */
  const cells = [];

  function spawn(count, type, radMax, speedLo, speedHi, scaleLo, scaleHi, collR) {
    for (let i = 0; i < count; i++) {
      const scale = scaleLo + Math.random() * (scaleHi - scaleLo);
      const r = collR * scale;
      // Placér uden overlap (op til 60 forsøg pr. celle)
      let a = 0, x = 0, y = 0, ok = false;
      for (let tries = 0; tries < 60 && !ok; tries++) {
        a = Math.random() * CURVE_LEN;
        const ang = Math.random() * Math.PI * 2;
        const rad = Math.sqrt(Math.random()) * Math.min(radMax, ARTERY_R - r - 0.08);
        x = Math.cos(ang) * rad;
        y = Math.sin(ang) * rad;
        ok = cells.every((o) => {
          const da = Math.abs(a - o.a);
          const d = Math.min(da, CURVE_LEN - da);
          return d * d + (x - o.x) ** 2 + (y - o.y) ** 2 > (r + o.r) ** 2;
        });
      }
      cells.push({
        type, a, x, y,
        va: 0, vx: 0, vy: 0,
        base: speedLo + Math.random() * (speedHi - speedLo),
        r, scale,
        rx: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        spin: 0.4 + Math.random() * 1.2,
      });
    }
  }

  // Kun røde blodlegemer i strømmen
  spawn(52, 0, ARTERY_R * 0.95, 1.1, 2.1, 0.75, 1.05, 0.44);

  const rbcMesh = new THREE.InstancedMesh(rbcGeo, rbcMat, cells.length);
  rbcMesh.renderOrder = 1;
  scene.add(rbcMesh);
  const meshes = [rbcMesh];

  const up = new THREE.Vector3(0, 1, 0);
  const dummy = new THREE.Object3D();
  const tmpN = new THREE.Vector3(), tmpB = new THREE.Vector3();

  function physicsStep(dt, flow) {
    // 1) Flow-kraft og bevægelse
    for (const c of cells) {
      const dist = Math.hypot(c.x, c.y);
      // Laminar profil: hurtigst i midten, langsomst ved væggen
      const profile = 1.25 - 0.6 * (dist / ARTERY_R);
      const target = c.base * profile * flow;
      c.va += (target - c.va) * Math.min(1, dt * 2.5);
      c.a += c.va * dt;
      if (c.a >= CURVE_LEN) c.a -= CURVE_LEN;

      // Sideværts: dæmpning, så stød ebber roligt ud
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vx *= Math.max(0, 1 - 1.8 * dt);
      c.vy *= Math.max(0, 1 - 1.8 * dt);

      // Karvæggen er en fast grænse — blødt bounce indad
      const lim = ARTERY_R - 0.06 - c.r;
      const d = Math.hypot(c.x, c.y);
      if (d > lim) {
        const nx = c.x / d, ny = c.y / d;
        c.x = nx * lim;
        c.y = ny * lim;
        const vn = c.vx * nx + c.vy * ny;
        if (vn > 0) {
          c.vx -= 1.5 * vn * nx; // restitution ~0.5
          c.vy -= 1.5 * vn * ny;
        }
      }
    }

    // 2) Celle-mod-celle kollisioner (sweep along a-aksen)
    cells.sort((p, q) => p.a - q.a);
    const n = cells.length;
    for (let i = 0; i < n; i++) {
      const ci = cells[i];
      for (let j = i + 1; j < n; j++) {
        const cj = cells[j];
        const da = cj.a - ci.a;
        if (da > 1.2) break; // ingen større kollisionsradius end dette
        const dx = cj.x - ci.x, dy = cj.y - ci.y;
        const rsum = ci.r + cj.r;
        const distSq = da * da + dx * dx + dy * dy;
        if (distSq >= rsum * rsum || distSq < 1e-8) continue;

        const dist = Math.sqrt(distSq);
        const nxA = da / dist, nxX = dx / dist, nxY = dy / dist;
        // Skub cellerne fri af hinanden (halvt til hver)
        const push = (rsum - dist) / 2;
        ci.a -= nxA * push; cj.a += nxA * push;
        ci.x -= nxX * push; cj.x += nxX * push;
        ci.y -= nxY * push; cj.y += nxY * push;
        // Blødt elastisk stød langs kollisionsnormalen
        const rel = (cj.va - ci.va) * nxA + (cj.vx - ci.vx) * nxX + (cj.vy - ci.vy) * nxY;
        if (rel < 0) {
          const imp = -rel * 0.75 / 2; // restitution 0.75, ens masse
          ci.va -= imp * nxA; cj.va += imp * nxA;
          ci.vx -= imp * nxX; cj.vx += imp * nxX;
          ci.vy -= imp * nxY; cj.vy += imp * nxY;
        }
      }
    }
  }

  function writeMatrices(t) {
    const counters = [0, 0, 0];
    for (const c of cells) {
      // Kollisioner kan skubbe a udenfor [0; CURVE_LEN) — normalisér,
      // så kurveopslaget aldrig får en position udenfor kurven
      c.a = ((c.a % CURVE_LEN) + CURVE_LEN) % CURVE_LEN;
      const u = c.a / CURVE_LEN;
      const p = arteryCurve.getPointAt(u);
      const tan = arteryCurve.getTangentAt(u);
      tmpN.crossVectors(tan, up).normalize();
      tmpB.crossVectors(tan, tmpN).normalize();
      dummy.position.copy(p)
        .addScaledVector(tmpN, c.x)
        .addScaledVector(tmpB, c.y);
      dummy.rotation.set(c.rx + t * c.spin, t * c.spin * 0.7, c.rz + t * c.spin * 0.5);
      dummy.scale.setScalar(c.scale);
      dummy.updateMatrix();
      meshes[c.type].setMatrixAt(counters[c.type]++, dummy.matrix);
    }
    meshes.forEach((m) => { m.instanceMatrix.needsUpdate = true; });
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

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // Roligt, jævnt flow uden pulsation
    physicsStep(dt, 1);
    writeMatrices(t);

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
    writeMatrices(1.5);
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
