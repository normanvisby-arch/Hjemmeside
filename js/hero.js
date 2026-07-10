/* ============================================================
   HEDENSTED LÆGEHUS — 3D/WebGL hero
   DNA-helix + partikelfelt renderet med Three.js.
   Falder pænt tilbage til CSS-gradienten hvis WebGL mangler,
   og respekterer "prefers-reduced-motion".
   ============================================================ */

import * as THREE from "./vendor/three.module.min.js";

const canvas = document.getElementById("hero-canvas");

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

if (canvas && webglAvailable()) {
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

  /* ---------- DNA-helix ---------- */
  const dna = new THREE.Group();
  scene.add(dna);

  const TURNS = 2.6;
  const RUNGS = 34;
  const HELIX_HEIGHT = 9.5;
  const HELIX_RADIUS = 1.15;

  const sphereGeo = new THREE.SphereGeometry(0.16, 24, 24);
  const matA = new THREE.MeshStandardMaterial({
    color: 0x35d0c5, roughness: 0.25, metalness: 0.35,
    emissive: 0x0b5f58, emissiveIntensity: 0.55,
  });
  const matB = new THREE.MeshStandardMaterial({
    color: 0xdff7f2, roughness: 0.3, metalness: 0.2,
    emissive: 0x1a6a70, emissiveIntensity: 0.35,
  });
  const rungMat = new THREE.MeshStandardMaterial({
    color: 0x0e7c86, roughness: 0.45, metalness: 0.3,
    emissive: 0x0a4046, emissiveIntensity: 0.5,
    transparent: true, opacity: 0.9,
  });

  const strandA = new THREE.InstancedMesh(sphereGeo, matA, RUNGS);
  const strandB = new THREE.InstancedMesh(sphereGeo, matB, RUNGS);
  const rungGeo = new THREE.CylinderGeometry(0.035, 0.035, 1, 10, 1, true);
  const rungs = new THREE.InstancedMesh(rungGeo, rungMat, RUNGS);
  dna.add(strandA, strandB, rungs);

  const dummy = new THREE.Object3D();
  const up = new THREE.Vector3(0, 1, 0);

  function layoutHelix(phase) {
    for (let i = 0; i < RUNGS; i++) {
      const t = i / (RUNGS - 1);
      const angle = t * Math.PI * 2 * TURNS + phase;
      const y = (t - 0.5) * HELIX_HEIGHT;
      // Let "åndedræt" i radius, så helixen føles levende
      const r = HELIX_RADIUS * (1 + 0.05 * Math.sin(phase * 2 + t * 9));

      const ax = Math.cos(angle) * r, az = Math.sin(angle) * r;
      const bx = Math.cos(angle + Math.PI) * r, bz = Math.sin(angle + Math.PI) * r;

      dummy.position.set(ax, y, az);
      dummy.scale.setScalar(1 + 0.25 * Math.sin(phase * 3 + i));
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      strandA.setMatrixAt(i, dummy.matrix);

      dummy.position.set(bx, y, bz);
      dummy.scale.setScalar(1 + 0.25 * Math.cos(phase * 3 + i));
      dummy.updateMatrix();
      strandB.setMatrixAt(i, dummy.matrix);

      // Tværstang mellem de to strenge
      const mid = new THREE.Vector3((ax + bx) / 2, y, (az + bz) / 2);
      const dir = new THREE.Vector3(bx - ax, 0, bz - az);
      const len = dir.length();
      dummy.position.copy(mid);
      dummy.quaternion.setFromUnitVectors(up, dir.normalize());
      dummy.scale.set(1, len, 1);
      dummy.updateMatrix();
      rungs.setMatrixAt(i, dummy.matrix);
      dummy.quaternion.identity();
    }
    strandA.instanceMatrix.needsUpdate = true;
    strandB.instanceMatrix.needsUpdate = true;
    rungs.instanceMatrix.needsUpdate = true;
  }

  dna.position.set(3.1, 0, 0);
  dna.rotation.z = -0.18;

  /* ---------- Medicinsk kryds (omdrejningspunkt til venstre) ---------- */
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
    // På smalle skærme rykkes helixen ind i midten bag teksten
    dna.position.x = w < 760 ? 0.6 : 3.1;
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

    layoutHelix(t * 0.35);
    dna.rotation.y = t * 0.22;

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
    layoutHelix(1.2);
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
