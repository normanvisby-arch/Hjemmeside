/* ============================================================
   HEDENSTED LÆGEHUS — 3D/WebGL hero til PERSONALESIDEN
   En stor, halvgennemsigtig arterie løber hen over skærmen, og
   indeni strømmer røde blodlegemer (bikonkave skiver). Udvalgte
   blodlegemer er "medaljoner": personalets portrætfoto fylder
   hele cellefladen på både for- og bagside, og cellerne tumler
   roligt gennem strømmen.
   Tilføj personale i MEDALJONER-listen nedenfor — én linje pr.
   person. Kan fotoet ikke indlæses, vises initialerne i stedet.
   Renderet med Three.js (global THREE fra js/vendor/three.min.js).
   Falder pænt tilbage til CSS-gradienten hvis WebGL mangler,
   og respekterer "prefers-reduced-motion".
   ============================================================ */

/* Personale i blodstrømmen — én linje pr. person.
   Medaljonen prøver i rækkefølge:
     1) rigtigt portræt:  assets/personale/<slug>.jpg
     2) tegnet avatar:    assets/avatars/<slug>.jpg  (fra laegeplans husplan)
     3) initialer på husets gradient
   Læg et rigtigt foto i assets/personale/, så vinder det automatisk. */
const MEDALJONER = [
  // Læger
  { slug: "tine-friis-andersen", initialer: "TF" },
  { slug: "troels-arent-olesen", initialer: "TA" },
  { slug: "norman-visby", initialer: "NV" },
  { slug: "jette-mikkelsen", initialer: "JM" },
  { slug: "anne-silkjaer-moeller", initialer: "AS" },
  { slug: "alena-litskalava-jensen", initialer: "AL" },
  { slug: "maiken-moeller-aasted", initialer: "MM" },
  { slug: "charlotte-paaskesen", initialer: "CP" },
  { slug: "ida-bech-roedgaard", initialer: "IB" },
  // Uddannelseslæger
  { slug: "mikkel-suurballe-lunen", initialer: "MS" },
  { slug: "elin-naes-beck", initialer: "EN" },
  // Sygeplejersker
  { slug: "dorte-ligaard", initialer: "DL" },
  { slug: "lone-rothausen", initialer: "LR" },
  { slug: "susanne-harrild-moeller", initialer: "SH" },
  { slug: "mette-sommerfeldt", initialer: "MS" },
  // Bioanalytikere
  { slug: "anna-petersen", initialer: "AP" },
  { slug: "susanne-westland", initialer: "SW" },
];

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
  let bloodGlow = null; // sættes i den mørke variant — pulsen får den til at blusse
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
    bloodGlow = new THREE.PointLight(0xff6a55, 9, 20, 1.9);
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

  /* ---------- Medaljon-teksturer ----------
     Portrættet tegnes cover-beskåret ind i en cirkel med lys kant.
     Indtil fotoet er hentet (eller hvis det fejler, fx uden netværk),
     viser medaljonen personens initialer på husets gradient. */
  function initialTexture(initials, gradIdx) {
    const S = 512;
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
    g.beginPath();
    g.arc(S / 2, S / 2, S / 2 - 8, 0, Math.PI * 2);
    g.fillStyle = grad;
    g.fill();
    g.lineWidth = 18;
    g.strokeStyle = "rgba(255,255,255,0.92)";
    g.stroke();
    g.fillStyle = "#ffffff";
    g.font = "700 190px Sora, Inter, system-ui, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(initials, S / 2, S / 2 + 12);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function fotoTexture(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const S = 512;
          const c = document.createElement("canvas");
          c.width = c.height = S;
          const g = c.getContext("2d");
          // Cover-beskæring ind i cirklen
          const s = Math.max(S / img.width, S / img.height);
          const w = img.width * s, h = img.height * s;
          g.save();
          g.beginPath();
          g.arc(S / 2, S / 2, S / 2 - 8, 0, Math.PI * 2);
          g.clip();
          g.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
          g.restore();
          // Lys medaljon-kant
          g.beginPath();
          g.arc(S / 2, S / 2, S / 2 - 12, 0, Math.PI * 2);
          g.lineWidth = 18;
          g.strokeStyle = "rgba(255,255,255,0.95)";
          g.stroke();
          const tex = new THREE.CanvasTexture(c);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
          resolve(tex);
        } catch (err) {
          reject(err); // fx tainted canvas ved file:// — initialerne bliver stående
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  /* ---------- Cellefysik ----------
     Cellerne simuleres i "rør-koordinater": a = position langs karret
     (buelængde), (x, y) = tværsnits-forskydning. Det gør kollisioner
     og vægafvisning enkle, selvom karret snor sig. */
  const cells = [];

  function placeFree(r) {
    // Placér uden overlap (op til 60 forsøg)
    let a = 0, x = 0, y = 0;
    for (let tries = 0; tries < 60; tries++) {
      a = Math.random() * CURVE_LEN;
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.sqrt(Math.random()) * (ARTERY_R - r - 0.08);
      x = Math.cos(ang) * rad;
      y = Math.sin(ang) * rad;
      const ok = cells.every((o) => {
        const da = Math.abs(a - o.a);
        const d = Math.min(da, CURVE_LEN - da);
        return d * d + (x - o.x) ** 2 + (y - o.y) ** 2 > (r + o.r) ** 2;
      });
      if (ok) break;
    }
    return { a, x, y };
  }

  function spawn(count, radMax, speedLo, speedHi, scaleLo, scaleHi, collR) {
    for (let i = 0; i < count; i++) {
      const scale = scaleLo + Math.random() * (scaleHi - scaleLo);
      const r = collR * scale;
      const { a, x, y } = placeFree(r);
      cells.push({
        a, x, y,
        va: 0, vx: 0, vy: 0,
        base: speedLo + Math.random() * (speedHi - speedLo),
        r, scale,
        rx: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        spin: 0.4 + Math.random() * 1.2,
      });
    }
  }

  // Røde blodlegemer i strømmen
  spawn(48, ARTERY_R * 0.95, 1.1, 2.1, 0.75, 1.05, 0.44);
  const rbcCount = cells.length;

  const rbcMesh = new THREE.InstancedMesh(rbcGeo, rbcMat, rbcCount);
  rbcMesh.renderOrder = 1;
  scene.add(rbcMesh);

  /* ---------- Medaljon-cellerne: personalet i strømmen ----------
     Rødt blodlegeme med portræt-skive på BEGGE sider — fotoet fylder
     hele cellefladen som en medaljon. Tumler roligt, så ansigtet ses. */
  MEDALJONER.forEach((person, i) => {
    const group = new THREE.Group();
    group.add(new THREE.Mesh(rbcGeo, rbcMat));

    const medMat = new THREE.MeshBasicMaterial({
      map: initialTexture(person.initialer || "?", i),
      transparent: true,
    });
    [1, -1].forEach((side) => {
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.5, 48), medMat);
      disc.rotation.x = -side * Math.PI / 2;
      disc.position.y = side * 0.14;
      group.add(disc);
    });
    // Rigtigt portræt vinder over tegnet avatar; initialerne er sidste udvej
    fotoTexture("assets/personale/" + person.slug + ".jpg")
      .catch(() => fotoTexture("assets/avatars/" + person.slug + ".jpg"))
      .then((tex) => {
        medMat.map = tex;
        medMat.needsUpdate = true;
        // Ved reduced-motion er der kun ét statisk billede — tegn det igen
        if (reducedMotion) renderer.render(scene, camera);
      })
      .catch(() => { /* initialerne bliver stående */ });

    group.renderOrder = 1;
    scene.add(group);

    const scale = 0.95; // samme størrelse som de almindelige blodlegemer
    const r = 0.52 * scale;
    const { x, y } = placeFree(r);
    // Fordel medaljonerne jævnt langs karret, startende i det synlige udsnit
    const a = CURVE_LEN * ((0.35 + i / MEDALJONER.length) % 1);
    cells.push({
      obj: group,
      a, x, y,
      va: 0, vx: 0, vy: 0,
      base: 0.7 + Math.random() * 0.25, // roligere fart end de røde celler
      r, scale,
      rx: Math.random() * Math.PI * 2,
      rz: Math.random() * Math.PI * 2,
      spin: 0.28 + Math.random() * 0.15, // langsom tumlen, så medaljonen kan ses
    });
  });

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
    let counter = 0;
    for (const c of cells) {
      // Kollisioner kan skubbe a udenfor [0; CURVE_LEN) — normalisér,
      // så kurveopslaget aldrig får en position udenfor kurven
      c.a = ((c.a % CURVE_LEN) + CURVE_LEN) % CURVE_LEN;
      const u = c.a / CURVE_LEN;
      const p = arteryCurve.getPointAt(u);
      const tan = arteryCurve.getTangentAt(u);
      tmpN.crossVectors(tan, up).normalize();
      tmpB.crossVectors(tan, tmpN).normalize();
      if (c.obj) {
        // Medaljon-celle: sit eget objekt i scenen
        c.obj.position.copy(p)
          .addScaledVector(tmpN, c.x)
          .addScaledVector(tmpB, c.y);
        c.obj.rotation.set(c.rx + t * c.spin, t * c.spin * 0.7, c.rz + t * c.spin * 0.5);
        c.obj.scale.setScalar(c.scale);
      } else {
        dummy.position.copy(p)
          .addScaledVector(tmpN, c.x)
          .addScaledVector(tmpB, c.y);
        dummy.rotation.set(c.rx + t * c.spin, t * c.spin * 0.7, c.rz + t * c.spin * 0.5);
        dummy.scale.setScalar(c.scale);
        dummy.updateMatrix();
        rbcMesh.setMatrixAt(counter++, dummy.matrix);
      }
    }
    rbcMesh.instanceMatrix.needsUpdate = true;
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


  /* ---------- Diskret EKG-linje i bunden — synkron med pulsen ----------
     Kurven løber fra venstre mod højre; R-takken fødes ved venstre kant
     præcis i det øjeblik, slaget skubber cellerne. Naturtro kompleks:
     P-tak, smal og høj QRS, T-tak. */
  const ekgCanvas = document.createElement("canvas");
  ekgCanvas.className = "hero-ekg-strip";
  ekgCanvas.setAttribute("aria-hidden", "true");
  canvas.parentElement.appendChild(ekgCanvas);
  const ekgCtx = ekgCanvas.getContext("2d");
  const EKG_VINDUE = 5; // sekunder synligt ad gangen

  function bump(p, c, w, a) {
    let d = p - c;
    d -= Math.round(d); // korteste afstand på den cykliske fase
    return a * Math.exp(-(d * d) / (w * w));
  }
  // Naturtro PQRST med R-takken i fase 0 (periode 2 s ved 30/min):
  // P ~180 ms før R, smal og høj QRS (~90 ms), T ~300 ms efter R
  function ekgVaerdi(fase) {
    return bump(fase, -0.090, 0.020, 0.11)  // P-tak
         + bump(fase, -0.014, 0.005, -0.08) // Q
         + bump(fase,  0.000, 0.007, 1.00)  // R — smal og høj
         + bump(fase,  0.016, 0.006, -0.16) // S
         + bump(fase,  0.150, 0.042, 0.22); // T-tak
  }

  function tegnEkg(t) {
    const w = ekgCanvas.width, h = ekgCanvas.height;
    if (!w) return;
    ekgCtx.clearRect(0, 0, w, h);
    ekgCtx.strokeStyle = "#041b1f"; // næsten sort — tydelig mod den lyse bund-fade
    ekgCtx.lineWidth = Math.max(2, h / 28);
    ekgCtx.lineJoin = "round";
    ekgCtx.shadowColor = "rgba(14, 124, 134, 0.55)";
    ekgCtx.shadowBlur = 6;
    const basis = h * 0.66, amp = h * 0.58;
    const fart = w / EKG_VINDUE; // px pr. sekund
    ekgCtx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const tx = t - x / fart; // nyeste ved VENSTRE kant -> kurven løber mod højre
      const fase = (tx - 1.5) / PULS_INTERVAL;
      const y = basis - ekgVaerdi(fase - Math.floor(fase)) * amp;
      if (x === 0) ekgCtx.moveTo(x, y); else ekgCtx.lineTo(x, y);
    }
    ekgCtx.stroke();
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
    camera.updateProjectionMatrix();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ekgCanvas.width = Math.round(w * dpr * 0.5) * 2; // lige tal, skarp streg
    ekgCanvas.height = Math.round(56 * dpr);
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------- Render-løkke ---------- */
  const clock = new THREE.Clock();
  let rafId = null;

  /* ---------- Hjerteslag: regelmæssig puls, 30/min ----------
     Hvert 2. sekund sender "hjertet" et slag gennem karret: cellerne
     får et skub og blæses afsted, flowet forstærkes kortvarigt, og den
     indre glød blusser op — hvorefter strømmen når at falde til ro,
     inden næste slag rammer. */
  const PULS_INTERVAL = 60 / 30;
  let naestePuls = 1.5;
  let puls = 0;

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    if (t >= naestePuls) {
      puls = 3.5;
      for (const c of cells) c.va += c.base * (1.2 + Math.random() * 0.6); // slaget skubber cellerne afsted
      naestePuls += PULS_INTERVAL; // fast rytme uden drift
    }
    puls = Math.max(0, puls - dt * 5.5); // klinger af inden næste slag

    physicsStep(dt, 1 + puls);
    if (bloodGlow) bloodGlow.intensity = 9 + puls * 5;
    writeMatrices(t);
    tegnEkg(t);

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
