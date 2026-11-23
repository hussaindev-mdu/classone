#!/usr/bin/env node
/**
 * Removes the semi-transparent "sparkle" watermark burned into the bottom-right
 * of the source hero frames (white, ~30% opacity, near x=1740 y=905 at 1920x1080).
 *
 * How it works:
 *  1. Measures the sparkle's shape and opacity from frames where it sits on a
 *     plain dark background (observed = a*255 + (1-a)*bg  ->  a).
 *  2. For every frame, locates the sparkle (it can drift slightly because the
 *     frames come from a generated video) and fits its opacity and edge
 *     softness, which vary a little with video compression.
 *  3. Reverses the alpha blend: bg = (observed - a*255) / (1 - a). Whatever was
 *     under the sparkle (planter texture, label text) is recovered rather than
 *     painted over.
 *  4. Runs a 3x3 median along the sparkle's 1-2px rim to remove the remaining
 *     compression halo without blurring text.
 *
 * Usage:
 *   node scripts/remove-watermark.mjs <inputDir> <outputDir> [frameNumbers...]
 * Writes lossless PNGs named frame_NNNN.png so frames are lossy-encoded only once
 * (afterwards, by `npm run prepare-frames`).
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [inDir, outDir, ...only] = process.argv.slice(2);
if (!inDir || !outDir) {
  console.error("Usage: node scripts/remove-watermark.mjs <inputDir> <outputDir> [frameNumbers...]");
  process.exit(1);
}

// Search window around the sparkle (full-res pixels).
const BOX = { left: 1660, top: 830, width: 160, height: 140 };
const W = BOX.width;
const H = BOX.height;
const N = W * H;
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

const files = (await fs.readdir(inDir))
  .filter((f) => IMAGE_EXT.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
if (files.length === 0) throw new Error(`No frames in ${inDir}`);

const readBox = (file) => sharp(path.join(inDir, file)).extract(BOX).removeAlpha().raw().toBuffer();
const lumOf = (d) => {
  const L = new Float64Array(N);
  for (let p = 0; p < N; p++) L[p] = 0.299 * d[p * 3] + 0.587 * d[p * 3 + 1] + 0.114 * d[p * 3 + 2];
  return L;
};

// ---------------------------------------------------------------------------
// 1. Shape + opacity from clean (dark, flat background) frames.
// ---------------------------------------------------------------------------
const sum = new Float64Array(N);
let used = 0;
for (const f of files) {
  const L = lumOf(await readBox(f));
  const border = [];
  for (let x = 0; x < W; x++) border.push(L[x], L[(H - 1) * W + x]);
  for (let y = 0; y < H; y++) border.push(L[y * W], L[y * W + W - 1]);
  border.sort((a, b) => a - b);
  const bg = border[Math.floor(border.length / 2)];
  const spread = border[Math.floor(border.length * 0.95)] - border[Math.floor(border.length * 0.05)];
  if (bg > 30 || spread > 25) continue;
  for (let p = 0; p < N; p++) sum[p] += Math.max(0, (L[p] - bg) / (255 - bg));
  used++;
}
if (used < 3) throw new Error("Not enough clean frames to measure the watermark");
const avg = Float64Array.from(sum, (s) => s / used);
const inside = [...avg].filter((a) => a > 0.2).sort((a, b) => a - b);
const A = inside[Math.floor(inside.length / 2)];
const hard = Float64Array.from(avg, (a) => (a > A / 2 ? 1 : 0));
let cx = 0;
let cy = 0;
let mass = 0;
for (let p = 0; p < N; p++) {
  cx += (p % W) * hard[p];
  cy += Math.floor(p / W) * hard[p];
  mass += hard[p];
}
cx /= mass;
cy /= mass;
console.log(`Watermark measured from ${used} clean frames: opacity ≈ ${(A * 100).toFixed(1)}%`);

/** Hard shape blurred with a Gaussian of the given sigma (edge softness), 0..1. */
function softShape(sigma) {
  const r = Math.ceil(sigma * 3);
  const k = [];
  let ks = 0;
  for (let i = -r; i <= r; i++) {
    const v = Math.exp(-(i * i) / (2 * sigma * sigma));
    k.push(v);
    ks += v;
  }
  const tmp = new Float64Array(N);
  const out = new Float64Array(N);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      let s = 0;
      for (let i = -r; i <= r; i++) {
        const xx = Math.min(W - 1, Math.max(0, x + i));
        s += hard[y * W + xx] * k[i + r];
      }
      tmp[y * W + x] = s / ks;
    }
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      let s = 0;
      for (let i = -r; i <= r; i++) {
        const yy = Math.min(H - 1, Math.max(0, y + i));
        s += tmp[yy * W + x] * k[i + r];
      }
      out[y * W + x] = s / ks;
    }
  return out;
}

function warp(shape, dx, dy, s) {
  const out = new Float64Array(N);
  const g = (xx, yy) => (xx < 0 || yy < 0 || xx >= W || yy >= H ? 0 : shape[yy * W + xx]);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const sx = cx + (x - cx - dx) / s;
      const sy = cy + (y - cy - dy) / s;
      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      const fx = sx - x0;
      const fy = sy - y0;
      out[y * W + x] =
        g(x0, y0) * (1 - fx) * (1 - fy) + g(x0 + 1, y0) * fx * (1 - fy) + g(x0, y0 + 1) * (1 - fx) * fy + g(x0 + 1, y0 + 1) * fx * fy;
    }
  return out;
}

const SIGMAS = [0.9, 1.2, 2];
const shapes = new Map(SIGMAS.map((s) => [s, softShape(s)]));
const BASE_SIGMA = 0.9;

/**
 * Measured profile (1 = interior opacity A). Keeps the real edge, including the
 * faint brighter rim the sparkle has; only the interior is flattened to remove
 * noise, and pixels away from the shape are zeroed.
 */
const measured = (() => {
  const soft = shapes.get(1.2);
  const out = new Float64Array(N);
  for (let p = 0; p < N; p++) {
    if (soft[p] < 0.01) continue;
    out[p] = soft[p] > 0.995 ? 1 : Math.max(0, avg[p] / A);
  }
  return out;
})();

// ---------------------------------------------------------------------------
// 2a. Locate: the sparkle's edges always step *up* in brightness going inward,
//     so the signed correlation of shape and image gradients finds it while
//     scene texture (random edge directions) averages out. Normalised so the
//     candidate's size doesn't bias the score.
// ---------------------------------------------------------------------------
function locateScore(L, a) {
  let dot = 0;
  let norm = 0;
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      const ax = a[p + 1] - a[p - 1];
      const ay = a[p + W] - a[p - W];
      if (ax === 0 && ay === 0) continue;
      dot += ax * (L[p + 1] - L[p - 1]) + ay * (L[p + W] - L[p - W]);
      norm += ax * ax + ay * ay;
    }
  return dot / Math.sqrt(norm || 1);
}

const warpCache = new Map();
function warpCached(sigma, dx, dy, s) {
  const key = `${sigma}|${dx}|${dy}|${s}`;
  let v = warpCache.get(key);
  if (!v) {
    v = warp(shapes.get(sigma), dx, dy, s);
    warpCache.set(key, v);
  }
  return v;
}

function locate(L) {
  let best = { dx: 0, dy: 0, s: 1, score: -Infinity };
  for (const s of [0.96, 1, 1.04])
    for (let dy = -6; dy <= 6; dy += 2)
      for (let dx = -6; dx <= 6; dx += 2) {
        const sc = locateScore(L, warpCached(BASE_SIGMA, dx, dy, s));
        if (sc > best.score) best = { dx, dy, s, score: sc };
      }
  const c = best;
  for (const s of [c.s - 0.02, c.s, c.s + 0.02])
    for (let dy = c.dy - 1.5; dy <= c.dy + 1.5; dy += 0.5)
      for (let dx = c.dx - 1.5; dx <= c.dx + 1.5; dx += 0.5) {
        const sc = locateScore(L, warp(shapes.get(BASE_SIGMA), dx, dy, s));
        if (sc > best.score) best = { dx, dy, s, score: sc };
      }
  return best;
}

// ---------------------------------------------------------------------------
// 2b. Opacity + edge softness: pick the pair that leaves the least structure
//     (bright or dark outline) along the rim after un-blending.
// ---------------------------------------------------------------------------
function rimMask(shape) {
  // Edge band of the profile (values strictly between background and interior).

  const rim = new Uint8Array(N);
  for (let y = 2; y < H - 2; y++)
    for (let x = 2; x < W - 2; x++) {
      const p = y * W + x;
      if (shape[p] > 0.03 && shape[p] < 0.97) for (const q of [p, p - 1, p + 1, p - W, p + W]) rim[q] = 1;
    }
  return rim;
}

const unblend = (L, a) => L.map((v, p) => (v - a[p] * 255) / (1 - a[p]));

/**
 * Pairs of pixels 4px inside / 4px outside the sparkle's outline (along the
 * edge normal), clear of the rim itself so its profile doesn't bias the result.
 */
function edgePairs(dirs) {
  const pairs = [];
  for (let y = 5; y < H - 5; y++)
    for (let x = 5; x < W - 5; x++) {
      const p = y * W + x;
      if (Math.abs(dirs[p] - 0.5) > 0.12) continue;
      const gx = dirs[p + 1] - dirs[p - 1];
      const gy = dirs[p + W] - dirs[p - W];
      const g = Math.hypot(gx, gy);
      if (g < 0.1) continue; // near the sharp tips the normal is unreliable
      const nx = gx / g;
      const ny = gy / g;
      const at = (d) => Math.round(y + ny * d) * W + Math.round(x + nx * d);
      const inn = at(4);
      const out = at(-4);
      if (dirs[inn] > 0.99 && dirs[out] < 0.01) pairs.push([inn, out]);
    }
  return pairs;
}

/** Median brightness difference inside-minus-outside after un-blending with opacity `alpha`. */
function leftoverStep(L, pairs, alpha) {
  const diffs = pairs.map(([i, o]) => (L[i] - alpha * 255) / (1 - alpha) - L[o]);
  diffs.sort((a, b) => a - b);
  return diffs[Math.floor(diffs.length / 2)];
}

/** Mean |Laplacian| over a fixed rim region (same pixels for every candidate). */
function rimRoughness(L, a, rim) {
  const R = unblend(L, a);
  let e = 0;
  let n = 0;
  for (let p = 0; p < N; p++) {
    if (!rim[p]) continue;
    e += Math.abs(4 * R[p] - R[p - 1] - R[p + 1] - R[p - W] - R[p + W]);
    n++;
  }
  return e / n;
}

function fitBlend(L, loc) {
  const plain = warp(shapes.get(BASE_SIGMA), loc.dx, loc.dy, loc.s);
  const meas = warp(measured, loc.dx, loc.dy, loc.s);
  const dirs = warp(shapes.get(1.2), loc.dx, loc.dy, loc.s);
  const rim = rimMask(dirs); // fixed band, identical for every candidate
  // Opacity: bisection so the inside matches the outside (monotonic in k).
  const pairs = edgePairs(dirs);
  // Kept close to the clean-frame measurement so busy frames (text) can't drag it off.
  let lo = 0.97;
  let hi = 1.08;
  for (let it = 0; it < 16; it++) {
    const mid = (lo + hi) / 2;
    if (leftoverStep(L, pairs, A * mid) > 0) lo = mid;
    else hi = mid;
  }
  const k = (lo + hi) / 2;
  // Edge profile: blend between a plain soft edge (e=0) and the measured one
  // with its bright rim (e=1); compression changes how strong that rim is.
  let best = { k, e: 0, cost: Infinity, shape: plain };
  for (let e = 0; e <= 1.0001; e += 0.125) {
    const shape = plain.map((v, p) => v + e * (meas[p] - v));
    const cost = rimRoughness(L, shape.map((v) => Math.min(0.9, v * A * k)), rim);
    if (cost < best.cost) best = { k, e, cost, shape };
  }
  return best;
}

// ---------------------------------------------------------------------------
// 3 + 4. Un-blend, then median along the rim.
// ---------------------------------------------------------------------------
function clean(d, shape, alpha, wide, narrow) {
  const out = Buffer.from(d);
  for (let p = 0; p < N; p++) {
    const a = Math.min(0.9, shape[p] * alpha);
    if (a < 0.003) continue;
    for (let c = 0; c < 3; c++) {
      const v = (d[p * 3 + c] - a * 255) / (1 - a);
      out[p * 3 + c] = Math.max(0, Math.min(255, Math.round(v)));
    }
  }
  // Outline removal: what's left after un-blending is a faint line whose
  // brightness depends only on the distance across the edge, the same all the
  // way round, while real detail (text, texture) varies. So: bin rim pixels by
  // position across the edge (via a wide soft shape), take the *median*
  // deviation from a local 5x5 median per bin (robust to text), and subtract
  // that profile.
  // A few passes, since each pass's local median still sees some of the line.
  const BINS = 40;
  const binOf = (v) => Math.min(BINS - 1, Math.floor(v * BINS));
  const win = [];
  for (let pass = 0; pass < 3; pass++) {
    const Y = lumOf(out);
    const perBin = Array.from({ length: BINS }, () => []);
    for (let y = 2; y < H - 2; y++)
      for (let x = 2; x < W - 2; x++) {
        const p = y * W + x;
        const v = wide[p];
        if (v < 0.01 || v > 0.99) continue;
        win.length = 0;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) win.push(Y[p + dy * W + dx]);
        win.sort((m, n) => m - n);
        perBin[binOf(v)].push(Y[p] - win[12]);
      }
    const profile = perBin.map((arr) => {
      if (arr.length < 8) return 0;
      arr.sort((m, n) => m - n);
      return arr[Math.floor(arr.length / 2)];
    });
    for (let p = 0; p < N; p++) {
      const v = wide[p];
      if (v < 0.01 || v > 0.99) continue;
      const off = profile[binOf(v)];
      for (let c = 0; c < 3; c++) out[p * 3 + c] = Math.max(0, Math.min(255, Math.round(out[p * 3 + c] - off)));
    }
  }
  // Any remaining sub-pixel hairline is darker than its surroundings: on the
  // ~2px outline band, lift only too-dark pixels up to their 3x3 median (bright
  // detail such as text is never darkened).
  const src = Buffer.from(out);
  const m = new Array(9);
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      if (narrow[p] < 0.05 || narrow[p] > 0.95) continue;
      for (let c = 0; c < 3; c++) {
        let k = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) m[k++] = src[(p + dy * W + dx) * 3 + c];
        m.sort((a, b) => a - b);
        if (src[p * 3 + c] < m[4]) out[p * 3 + c] = m[4];
      }
    }
  return out;
}

await fs.mkdir(outDir, { recursive: true });
const wanted = only.length ? new Set(only.map(Number)) : null;
let i = 0;
for (const f of files) {
  i++;
  if (wanted && !wanted.has(i)) continue;
  const d = await readBox(f);
  const L = lumOf(d);
  const loc = locate(L);
  const blend = fitBlend(L, loc);
  const wide = warp(shapes.get(2), loc.dx, loc.dy, loc.s);
  const narrow = warp(shapes.get(1.2), loc.dx, loc.dy, loc.s);
  const patch = clean(d, blend.shape, A * blend.k, wide, narrow);
  const name = `frame_${String(i).padStart(4, "0")}.png`;
  await sharp(path.join(inDir, f))
    .removeAlpha()
    .composite([{ input: patch, raw: { width: W, height: H, channels: 3 }, left: BOX.left, top: BOX.top }])
    .png({ compressionLevel: 6 })
    .toFile(path.join(outDir, name));
  if (i % 20 === 0 || wanted)
    console.log(
      `${name}  offset (${loc.dx}, ${loc.dy}) scale ${loc.s.toFixed(2)}  opacity ${(A * blend.k * 100).toFixed(1)}%  rim ${blend.e}`,
    );
}
console.log(`Done: ${outDir}`);
