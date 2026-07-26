import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJECTS, PLANET_KEYS } from "./data.js";
import { crateredTexture, cloudyTexture, bandedTexture, sunTexture, ringTexture } from "./textures.js";

/* ---------------- Real photographic textures (Earth & Moon, NASA imagery via three.js CDN) ---------------- */
const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = "anonymous";
function loadRealTexture(url) {
  const tex = textureLoader.load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
const EARTH_TEX_URL = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg";
const MOON_TEX_URL = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg";

/* ---------------- Procedural surface textures for the rest ---------------- */
const PLANET_TEXTURES = {
  mercury: () => crateredTexture({ seed: 11, stops: [[70,66,64],[120,114,108],[160,152,142],[100,94,88]], craterCount: 140 }),
  venus: () => cloudyTexture({ seed: 22, stops: [[145,105,45],[210,175,100],[240,215,150],[200,150,80]] }),
  mars: () => crateredTexture({ seed: 33, stops: [[90,35,20],[160,70,35],[205,110,60],[130,55,30]], craterCount: 70, polarCaps: true }),
  jupiter: () => bandedTexture({ seed: 44, stops: [[190,150,110],[220,190,150],[170,120,85],[225,205,175],[150,95,65]], bandFreq: 14, turbulence: 0.2, spot: { x: 0.32, y: 0.62, r: 0.09, color: [190,80,55] } }),
  saturn: () => bandedTexture({ seed: 55, stops: [[210,190,140],[235,220,180],[195,175,130],[225,205,165]], bandFreq: 10, turbulence: 0.1 }),
  uranus: () => bandedTexture({ seed: 66, stops: [[150,215,215],[175,230,230],[140,205,210]], bandFreq: 4, turbulence: 0.05 }),
  neptune: () => bandedTexture({ seed: 77, stops: [[35,70,180],[60,100,210],[25,55,150],[80,120,220]], bandFreq: 6, turbulence: 0.12, spot: { x: 0.62, y: 0.4, r: 0.06, color: [15,30,90] } })
};

/* ---------------- Scene setup ---------------- */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(0, 60, 140);

const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 4;
controls.maxDistance = 1200;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ---------------- Lighting ---------------- */
scene.add(new THREE.AmbientLight(0x334, 0.6));
const sunLight = new THREE.PointLight(0xffffff, 3.2, 0, 0);
scene.add(sunLight);

/* ---------------- Starfield background ---------------- */
function makeStarfield(count, spread, size, color) {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = spread * (0.4 + Math.random() * 0.6);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color, size, sizeAttenuation: true, transparent: true, opacity: 0.9 });
  return new THREE.Points(geo, mat);
}
scene.add(makeStarfield(6000, 1800, 1.1, 0xffffff));
scene.add(makeStarfield(2000, 900, 1.6, 0x88bbff));

/* ---------------- Milky Way band ---------------- */
// A tilted disc of dense particles simulating the edge-on view of our galaxy's band across the sky.
function makeMilkyWayBand() {
  const group = new THREE.Group();
  const count = 14000;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color(0xbfaaff),
    new THREE.Color(0xffffff),
    new THREE.Color(0x8fd0ff),
    new THREE.Color(0xffe3b0)
  ];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 600 + Math.pow(Math.random(), 2) * 900;
    const thickness = (Math.random() - 0.5) * 60 * Math.exp(-((radius - 600) / 900));
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = thickness;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 2.2, vertexColors: true, transparent: true, opacity: 0.85, sizeAttenuation: true });
  const points = new THREE.Points(geo, mat);
  group.add(points);
  group.rotation.x = THREE.MathUtils.degToRad(63); // tilt so we view it edge-on, like from Earth
  group.rotation.z = THREE.MathUtils.degToRad(15);
  group.userData.clickable = "milkyway";
  return group;
}
const milkyWay = makeMilkyWayBand();
scene.add(milkyWay);

/* ---------------- Black hole (Sagittarius A*) ---------------- */
function makeBlackHole() {
  const group = new THREE.Group();
  group.position.set(750, 40, -300); // out in the galactic band, distant from the solar system

  const horizonGeo = new THREE.SphereGeometry(6, 48, 48);
  const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const horizon = new THREE.Mesh(horizonGeo, horizonMat);
  group.add(horizon);

  // Glowing accretion disc
  const diskGeo = new THREE.RingGeometry(8, 22, 96);
  const diskMat = new THREE.MeshBasicMaterial({
    color: 0xffa040, side: THREE.DoubleSide, transparent: true, opacity: 0.85
  });
  const disk = new THREE.Mesh(diskGeo, diskMat);
  disk.rotation.x = Math.PI / 2.3;
  group.add(disk);

  const diskGeo2 = new THREE.RingGeometry(22, 30, 96);
  const diskMat2 = new THREE.MeshBasicMaterial({ color: 0xff5030, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
  const disk2 = new THREE.Mesh(diskGeo2, diskMat2);
  disk2.rotation.x = Math.PI / 2.3;
  group.add(disk2);

  const glow = new THREE.PointLight(0xff8b3d, 4, 300);
  group.add(glow);

  group.userData.clickable = "blackhole";
  group.userData.spinDisk = disk;
  group.userData.spinDisk2 = disk2;
  return group;
}
const blackHole = makeBlackHole();
scene.add(blackHole);

/* ---------------- Sun ---------------- */
const sunData = OBJECTS.sun;
const sunGeo = new THREE.SphereGeometry(sunData.radius, 96, 96);
const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture({}) });
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
sunMesh.userData.clickable = "sun";
scene.add(sunMesh);

const sunGlowGeo = new THREE.SphereGeometry(sunData.radius * 1.35, 32, 32);
const sunGlowMat = new THREE.MeshBasicMaterial({ color: 0xffcc33, transparent: true, opacity: 0.18 });
sunMesh.add(new THREE.Mesh(sunGlowGeo, sunGlowMat));

/* ---------------- Planets ---------------- */
const planetMeshes = {};
const orbitPivots = {};
let india = null;

function makeOrbitRing(radius, color) {
  const points = [];
  const segs = 160;
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  // Faint tint of the planet's own color keeps rings distinguishable without visual clutter.
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.22 });
  return new THREE.LineLoop(geo, mat);
}

PLANET_KEYS.forEach((key) => {
  const d = OBJECTS[key];
  scene.add(makeOrbitRing(d.orbitRadius, d.color));

  const pivot = new THREE.Object3D();
  pivot.rotation.y = Math.random() * Math.PI * 2;
  scene.add(pivot);
  orbitPivots[key] = pivot;

  const geo = new THREE.SphereGeometry(d.radius, 64, 64);
  const surfaceMap = key === "earth" ? loadRealTexture(EARTH_TEX_URL) : PLANET_TEXTURES[key]();
  const mat = new THREE.MeshStandardMaterial({ map: surfaceMap, roughness: 0.85, metalness: 0.05 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.x = d.orbitRadius;
  mesh.userData.clickable = key;
  pivot.add(mesh);
  planetMeshes[key] = mesh;

  if (d.hasRing) {
    const ringGeo = new THREE.RingGeometry(d.radius * 1.5, d.radius * 2.6, 128);
    // UVs default to radial gradient poorly for rings; map along the ring's radial axis for banded detail.
    const pos = ringGeo.attributes.position;
    const uv = ringGeo.attributes.uv;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      const r = v3.length();
      const t = (r - d.radius * 1.5) / (d.radius * 2.6 - d.radius * 1.5);
      uv.setXY(i, t, 0.5);
    }
    const ringMat = new THREE.MeshBasicMaterial({ map: ringTexture({}), side: THREE.DoubleSide, transparent: true });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    mesh.add(ring);
  }

  if (key === "earth") {
    const moonData = OBJECTS.moon;
    const moonPivot = new THREE.Object3D();
    mesh.add(moonPivot);
    const moonGeo = new THREE.SphereGeometry(moonData.radius, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({ map: loadRealTexture(MOON_TEX_URL), roughness: 0.95 });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.x = moonData.orbitRadius;
    moonMesh.userData.clickable = "moon";
    moonPivot.add(moonMesh);
    orbitPivots["moon"] = moonPivot;
    planetMeshes["moon"] = moonMesh;

    // India marker — attached to the Earth mesh so it rotates naturally with the planet's surface.
    const indiaGroup = new THREE.Group();
    const lat = 22.0, lon = 79.0;
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon + 180);
    const r = d.radius * 1.01;
    indiaGroup.position.set(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    indiaGroup.lookAt(indiaGroup.position.clone().multiplyScalar(2));

    const pinGeo = new THREE.SphereGeometry(d.radius * 0.055, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xff5a30 });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    indiaGroup.add(pin);

    const ringGeo2 = new THREE.RingGeometry(d.radius * 0.08, d.radius * 0.11, 32);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xff5a30, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const pulseRing = new THREE.Mesh(ringGeo2, ringMat2);
    indiaGroup.add(pulseRing);

    indiaGroup.userData.clickable = "india";
    indiaGroup.userData.pulseRing = pulseRing;
    mesh.add(indiaGroup);
    india = indiaGroup;
  }
});

/* ---------------- Raycasting / click interaction ---------------- */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downPos = null;

function getClickableAncestor(obj) {
  let o = obj;
  while (o) {
    if (o.userData && o.userData.clickable) return o.userData.clickable;
    o = o.parent;
  }
  return null;
}

function handlePointerDown(e) {
  const p = e.touches ? e.touches[0] : e;
  downPos = { x: p.clientX, y: p.clientY };
}

function handlePointerUp(e) {
  const p = e.changedTouches ? e.changedTouches[0] : e;
  if (downPos) {
    const dx = p.clientX - downPos.x, dy = p.clientY - downPos.y;
    if (Math.sqrt(dx * dx + dy * dy) > 6) return; // was a drag, not a click
  }
  pointer.x = (p.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(p.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  let matched = false;
  for (const hit of hits) {
    const key = getClickableAncestor(hit.object);
    if (key) { openInfo(key); focusOn(key); matched = true; break; }
  }
  if (!matched) clearFocus(); // clicking empty space releases the camera to move freely again
}
renderer.domElement.addEventListener("pointerdown", handlePointerDown);
renderer.domElement.addEventListener("pointerup", handlePointerUp);

/* ---------------- Hover tooltip ---------------- */
const tooltip = document.getElementById("tooltip");
const tooltipName = document.getElementById("tooltipName");
const tooltipType = document.getElementById("tooltipType");
let hoveredKey = null;

function handlePointerMove(e) {
  tooltip.style.left = e.clientX + "px";
  tooltip.style.top = e.clientY + "px";

  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  let key = null;
  for (const hit of hits) {
    key = getClickableAncestor(hit.object);
    if (key) break;
  }

  if (key !== hoveredKey) {
    hoveredKey = key;
    if (key && OBJECTS[key]) {
      tooltipName.textContent = OBJECTS[key].name;
      tooltipType.textContent = OBJECTS[key].type;
      tooltip.classList.add("visible");
      renderer.domElement.style.cursor = "pointer";
    } else {
      tooltip.classList.remove("visible");
      renderer.domElement.style.cursor = "default";
    }
  }
}
renderer.domElement.addEventListener("pointermove", handlePointerMove);

/* ---------------- Info panel UI ---------------- */
const infoPanel = document.getElementById("infoPanel");
const infoName = document.getElementById("infoName");
const infoType = document.getElementById("infoType");
const infoDesc = document.getElementById("infoDesc");
const infoStats = document.getElementById("infoStats");
const infoImage = document.getElementById("infoImage");
const closePanel = document.getElementById("closePanel");
const funFactsEl = document.getElementById("funFacts");
const funFactsTitle = document.getElementById("funFactsTitle");

function openInfo(key) {
  const d = OBJECTS[key];
  if (!d) return;
  infoName.textContent = d.name;
  infoType.textContent = d.type;
  infoDesc.textContent = d.desc;
  infoImage.style.background = d.color === 0x000000 ? "#000" : `#${d.color.toString(16).padStart(6, "0")}`;
  infoImage.style.setProperty("--glow", d.glow || "#7fd7ff88");
  infoStats.innerHTML = "";
  Object.entries(d.stats || {}).forEach(([k, v]) => {
    const row = document.createElement("div");
    row.className = "statRow";
    row.innerHTML = `<span>${k}</span><span>${v}</span>`;
    infoStats.appendChild(row);
  });
  funFactsEl.innerHTML = "";
  const facts = d.funFacts || [];
  funFactsTitle.style.display = facts.length ? "block" : "none";
  facts.forEach((fact) => {
    const li = document.createElement("li");
    li.textContent = fact;
    funFactsEl.appendChild(li);
  });
  infoPanel.classList.add("open");
}
closePanel.addEventListener("click", () => {
  infoPanel.classList.remove("open");
  clearFocus();
});

/* ---------------- Object jump buttons ---------------- */
const objButtonsEl = document.getElementById("objectButtons");
const jumpTargets = { sun: sunMesh, milkyway: milkyWay, blackhole: blackHole, india, ...planetMeshes };
["sun", ...PLANET_KEYS, "milkyway", "blackhole"].forEach((key) => {
  const btn = document.createElement("button");
  btn.className = "objBtn";
  btn.textContent = OBJECTS[key].name;
  btn.addEventListener("click", () => {
    openInfo(key);
    focusOn(key);
  });
  objButtonsEl.appendChild(btn);
});

let focusedKey = null;
let focusedPrevWorldPos = null;

function focusOn(key) {
  const obj = jumpTargets[key];
  if (!obj) return;
  const worldPos = new THREE.Vector3();
  obj.getWorldPosition(worldPos);
  // Close, deliberate zoom so the surface detail is actually visible, not just "nearby".
  const dist = key === "sun" ? 22 : key === "milkyway" ? 380 : key === "blackhole" ? 45 : key === "india" ? 5 : (OBJECTS[key].radius || 1) * 4 + 2.5;
  let dir;
  if (key === "india") {
    // Approach along the surface normal from Earth's center, so the globe can't occlude the tiny marker.
    const earthWorldPos = new THREE.Vector3();
    planetMeshes.earth.getWorldPosition(earthWorldPos);
    dir = worldPos.clone().sub(earthWorldPos).normalize();
  } else {
    dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
  }
  const targetCamPos = worldPos.clone().add(dir.multiplyScalar(dist));
  animateCamera(targetCamPos, worldPos);
  focusedKey = key;
  focusedPrevWorldPos = worldPos.clone();
}

function clearFocus() {
  focusedKey = null;
  focusedPrevWorldPos = null;
}

let camAnim = null;
function animateCamera(toPos, toTarget) {
  camAnim = { fromPos: camera.position.clone(), toPos, fromTarget: controls.target.clone(), toTarget, t: 0 };
}

/* ---------------- Pause control ---------------- */
let paused = false;
const pauseBtn = document.getElementById("pauseBtn");
function setPaused(val) {
  paused = val;
  pauseBtn.textContent = paused ? "▶ Play" : "⏸ Pause";
  pauseBtn.classList.toggle("active", paused);
}
pauseBtn.addEventListener("click", () => setPaused(!paused));

/* ---------------- Reset view ---------------- */
const DEFAULT_CAM_POS = new THREE.Vector3(0, 60, 140);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
  clearFocus();
  infoPanel.classList.remove("open");
  animateCamera(DEFAULT_CAM_POS.clone(), DEFAULT_TARGET.clone());
});

/* ---------------- Intro overlay ---------------- */
document.getElementById("enterBtn").addEventListener("click", () => {
  document.getElementById("intro").style.display = "none";
});
document.getElementById("loading").classList.add("hidden");

/* ---------------- Animation loop ---------------- */
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  tick(clock.getDelta());
}
function tick(dt) {
  const elapsed = clock.elapsedTime;

  if (!paused) {
    sunMesh.rotation.y += sunData.rotationSpeed;

    PLANET_KEYS.forEach((key) => {
      const d = OBJECTS[key];
      orbitPivots[key].rotation.y += d.orbitSpeed * dt * 5;
      planetMeshes[key].rotation.y += d.rotationSpeed;
    });
    if (orbitPivots["moon"]) orbitPivots["moon"].rotation.y += OBJECTS.moon.orbitSpeed * dt * 5;

    milkyWay.rotation.y += 0.00015;
    blackHole.userData.spinDisk.rotation.z += 0.01;
    blackHole.userData.spinDisk2.rotation.z -= 0.006;
  }

  if (india && india.userData.pulseRing) {
    const s = 1 + Math.sin(elapsed * 3) * 0.25;
    india.userData.pulseRing.scale.set(s, s, s);
  }

  // Keep the camera anchored to whatever's focused so it doesn't drift away as the object orbits.
  if (focusedKey && !camAnim) {
    const obj = jumpTargets[focusedKey];
    if (obj) {
      const worldPos = new THREE.Vector3();
      obj.getWorldPosition(worldPos);
      const delta = worldPos.clone().sub(focusedPrevWorldPos);
      camera.position.add(delta);
      controls.target.add(delta);
      focusedPrevWorldPos = worldPos;
    }
  }

  if (camAnim) {
    camAnim.t += dt / 1.1;
    const t = Math.min(camAnim.t, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    camera.position.lerpVectors(camAnim.fromPos, camAnim.toPos, ease);
    controls.target.lerpVectors(camAnim.fromTarget, camAnim.toTarget, ease);
    if (t >= 1) camAnim = null;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();
