/* Parchment paper grain, ported from the home letter's drawParchment
   (public/paper/paper-texture.js, itself from ~/Developer/parchment):
   cloudy formation + fine tooth + fibers + specks, drawn once to an N × N
   canvas with transparency. The zine book multiplies it over each page and
   uses it as a bump map, so the pages share the letter's paper. */

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function hash(x: number, y: number, s: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(s, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function vnoise(x: number, y: number, s: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s);
  const b = hash(xi + 1, yi, s);
  const c = hash(xi, yi + 1, s);
  const d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number, s: number, oct: number) {
  let sum = 0;
  let amp = 0.5;
  let f = 1;
  let norm = 0;
  for (let i = 0; i < oct; i++) {
    sum += amp * vnoise(x * f, y * f, s + i * 17);
    norm += amp;
    amp *= 0.5;
    f *= 2.03;
  }
  return sum / norm;
}

function drawGrain(N: number) {
  const fibers = 2800;
  const fiberLen = 42;
  const spread = 2.4;
  const specks = 260;
  const area = (N / 1024) ** 2; // fibers and specks scale with area
  const cv = document.createElement("canvas");
  cv.width = cv.height = N;
  const ctx = cv.getContext("2d")!;
  const img = ctx.createImageData(N, N);
  const px = img.data;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const f = fbm(x / 230, y / 230, 3, 4); // large cloudy formation
      const m = fbm(x / 54, y / 30, 11, 3); // fiber flocs, stretched along machine direction
      const g = Math.random(); // fine tooth
      const a = clamp(0.5 + ((f - 0.5) * 1.25 + (m - 0.5) * 0.45) + (g - 0.5) * 0.12, 0.28, 0.94);
      const lum = (g - 0.5) * 7 + (m - 0.5) * 10;
      const i = (y * N + x) * 4;
      px[i] = 242 + lum;
      px[i + 1] = 239 + lum;
      px[i + 2] = 231 + lum * 0.9;
      px[i + 3] = a * 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // Fibers: mostly light, a few darker, loosely aligned. Light ones get a
  // faint darker edge so they still show on a white page.
  const machine = -0.12;
  for (let i = 0; i < fibers * area; i++) {
    const x = Math.random() * N;
    const y = Math.random() * N;
    const len = 4 + Math.pow(Math.random(), 2) * fiberLen;
    const ang = machine + (Math.random() - 0.5) * spread;
    const ex = x + Math.cos(ang) * len;
    const ey = y + Math.sin(ang) * len;
    const bend = (Math.random() - 0.5) * len * 0.5;
    const cx = (x + ex) / 2 - Math.sin(ang) * bend;
    const cy = (y + ey) / 2 + Math.cos(ang) * bend;
    const light = Math.random() < 0.72;
    const a = Math.random();
    const stroke = (dx: number, dy: number) => {
      ctx.beginPath();
      ctx.moveTo(x + dx, y + dy);
      ctx.quadraticCurveTo(cx + dx, cy + dy, ex + dx, ey + dy);
      ctx.stroke();
    };
    ctx.lineWidth = 0.35 + Math.random() * 0.9;
    if (light) {
      ctx.strokeStyle = `rgba(120,98,66,${0.05 + a * 0.1})`;
      stroke(0.9, 1.1);
      ctx.strokeStyle = `rgba(255,253,246,${0.14 + a * 0.3})`;
      stroke(0, 0);
    } else {
      ctx.strokeStyle = `rgba(150,128,92,${0.03 + a * 0.07})`;
      stroke(0, 0);
    }
  }

  for (let i = 0; i < specks * area; i++) {
    ctx.fillStyle = `rgba(120,98,66,${0.05 + Math.random() * 0.1})`;
    ctx.beginPath();
    ctx.arc(Math.random() * N, Math.random() * N, 0.4 + Math.random() * 1.1, 0, Math.PI * 2);
    ctx.fill();
  }
  return cv;
}

let cached: HTMLCanvasElement | null = null;

/** The grain, drawn on first use and shared after that. It doesn't tile:
    like the letter's sheet, draw it once over the whole page. */
export function paperGrain(): HTMLCanvasElement {
  return (cached ??= drawGrain(1024));
}
