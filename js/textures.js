// Procedural texture generation so every world has real surface detail
// (bands, craters, storms) without depending on fragile third-party image hosts.
import * as THREE from "three";

/* ---------------- Value noise (seeded) ---------------- */
function makeNoise2D(seed) {
  const perm = new Uint8Array(512);
  let s = seed;
  const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  const table = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [table[i], table[j]] = [table[j], table[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = table[i & 255];

  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  const grad = (hash, x, y) => {
    const h = hash & 3;
    const u = h < 2 ? x : y, v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  };
  return function noise(x, y) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x), yf = y - Math.floor(y);
    const u = fade(xf), v = fade(yf);
    const aa = perm[X + perm[Y]], ab = perm[X + perm[Y + 1]];
    const ba = perm[X + 1 + perm[Y]], bb = perm[X + 1 + perm[Y + 1]];
    const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
    const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);
    return (lerp(x1, x2, v) + 1) / 2;
  };
}

function fbm(noise, x, y, octaves = 5, wrapX = 1) {
  let total = 0, amp = 0.5, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    total += noise(x * freq, y * freq) * amp;
    max += amp;
    amp *= 0.5; freq *= 2;
  }
  return total / max;
}

function lerpColor(c1, c2, t) {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t)
  ];
}
function rampColor(stops, t) {
  t = Math.max(0, Math.min(1, t));
  const n = stops.length - 1;
  const seg = t * n;
  const i = Math.min(Math.floor(seg), n - 1);
  return lerpColor(stops[i], stops[i + 1], seg - i);
}

function newCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return c;
}

/* ---------------- Rocky / cratered worlds (Mercury, Mars, Moon fallback) ---------------- */
export function crateredTexture({ seed = 1, w = 1024, h = 512, stops, craterCount = 90, polarCaps = false }) {
  const noise = makeNoise2D(seed);
  const canvas = newCanvas(w, h);
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x / w, ny = y / h;
      const n = fbm(noise, nx * 4, ny * 4, 5);
      const [r, g, b] = rampColor(stops, n);
      const idx = (y * w + x) * 4;
      img.data[idx] = r; img.data[idx + 1] = g; img.data[idx + 2] = b; img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // Impact craters
  let cs = seed * 9301 + 49297;
  const rand = () => { cs = (cs * 9301 + 49297) % 233280; return cs / 233280; };
  for (let i = 0; i < craterCount; i++) {
    const cx = rand() * w, cy = rand() * h * 0.9 + h * 0.05;
    const r = 4 + rand() * (w * 0.035);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    const shade = 0.55 + rand() * 0.25;
    grad.addColorStop(0, `rgba(0,0,0,${0.001})`);
    grad.addColorStop(0.7, `rgba(0,0,0,${1 - shade})`);
    grad.addColorStop(0.82, `rgba(255,255,255,0.18)`);
    grad.addColorStop(1, `rgba(0,0,0,0)`);
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  }

  if (polarCaps) {
    const capGrad = ctx.createLinearGradient(0, 0, 0, h * 0.12);
    capGrad.addColorStop(0, "rgba(255,255,255,0.95)");
    capGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = capGrad;
    ctx.fillRect(0, 0, w, h * 0.12);
    const capGrad2 = ctx.createLinearGradient(0, h, 0, h * 0.88);
    capGrad2.addColorStop(0, "rgba(255,255,255,0.95)");
    capGrad2.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = capGrad2;
    ctx.fillRect(0, h * 0.88, w, h * 0.12);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* ---------------- Swirling clouds (Venus) ---------------- */
export function cloudyTexture({ seed = 2, w = 1024, h = 512, stops }) {
  const noise = makeNoise2D(seed);
  const canvas = newCanvas(w, h);
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x / w, ny = y / h;
      const swirl = Math.sin(ny * Math.PI * 6 + fbm(noise, nx * 3, ny * 3, 4) * 6) * 0.5 + 0.5;
      const n = fbm(noise, nx * 5 + swirl, ny * 5, 5) * 0.6 + swirl * 0.4;
      const [r, g, b] = rampColor(stops, n);
      const idx = (y * w + x) * 4;
      img.data[idx] = r; img.data[idx + 1] = g; img.data[idx + 2] = b; img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* ---------------- Banded gas/ice giants (Jupiter, Saturn, Uranus, Neptune) ---------------- */
export function bandedTexture({ seed = 3, w = 1024, h = 512, stops, bandFreq = 10, turbulence = 0.15, spot = null }) {
  const noise = makeNoise2D(seed);
  const canvas = newCanvas(w, h);
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    const ny = y / h;
    for (let x = 0; x < w; x++) {
      const nx = x / w;
      const distort = fbm(noise, nx * 3, ny * 8, 4) * turbulence;
      const band = Math.sin((ny + distort) * Math.PI * bandFreq) * 0.5 + 0.5;
      const fine = fbm(noise, nx * 8, ny * 24, 3) * 0.15;
      let t = band * 0.8 + fine;
      let [r, g, b] = rampColor(stops, t);

      if (spot) {
        const dx = (nx - spot.x) * w, dy = (ny - spot.y) * h * (w / h) * 0.5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const rad = spot.r * w;
        if (dist < rad) {
          const f = 1 - dist / rad;
          r = Math.round(r + (spot.color[0] - r) * f);
          g = Math.round(g + (spot.color[1] - g) * f);
          b = Math.round(b + (spot.color[2] - b) * f);
        }
      }
      const idx = (y * w + x) * 4;
      img.data[idx] = r; img.data[idx + 1] = g; img.data[idx + 2] = b; img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* ---------------- Turbulent plasma (Sun) ---------------- */
export function sunTexture({ seed = 7, w = 1024, h = 512 }) {
  const noise = makeNoise2D(seed);
  const canvas = newCanvas(w, h);
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(w, h);
  const stops = [[120, 20, 0], [255, 90, 0], [255, 170, 20], [255, 235, 130], [255, 255, 220]];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x / w, ny = y / h;
      const n = fbm(noise, nx * 6, ny * 6, 6);
      const granule = fbm(noise, nx * 30, ny * 30, 2) * 0.25;
      const [r, g, b] = rampColor(stops, n * 0.75 + granule);
      const idx = (y * w + x) * 4;
      img.data[idx] = r; img.data[idx + 1] = g; img.data[idx + 2] = b; img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* ---------------- Saturn ring texture ---------------- */
export function ringTexture({ seed = 5, w = 512 }) {
  const canvas = newCanvas(w, 8);
  const ctx = canvas.getContext("2d");
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let x = 0; x < w; x++) {
    const t = x / w;
    const base = 150 + Math.sin(t * 60) * 25 + rand() * 20;
    const alpha = 0.25 + fbm(makeNoise2D(seed + 1), t * 20, 0, 3) * 0.6;
    ctx.fillStyle = `rgba(${base + 60},${base + 40},${base},${alpha})`;
    ctx.fillRect(x, 0, 1, 8);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
