#!/usr/bin/env node
/**
 * Generates brand assets from brand/logo-source.jpg (a photo/screenshot of the
 * ClassOne logo on a dark background):
 *   - public/logo.png        full lockup (C1 mark + CLASSONE / CONSULTING), transparent
 *   - public/logo-mark.png   C1 mark only, transparent
 *   - app/icon.png           favicon (C1 mark on the page background)
 *   - app/apple-icon.png     180px touch icon
 *   - public/og-image.jpg    1200x630 social card built from hero frame 1
 *
 * When the official vector/PNG logo is available, drop it in as public/logo.png
 * (and public/logo-mark.png) and you can skip this script.
 *
 * Usage: npm run brand-assets   (run after `npm run prepare-frames`)
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "brand", "logo-source.jpg");
const manifest = JSON.parse(
  await fs.readFile(path.join(ROOT, "lib", "frames-manifest.json"), "utf8"),
);
const PAGE_BG = manifest.background ?? "#0b0c0e";

// Crop boxes measured on the 1206x709 source image.
const LOCKUP = { left: 150, top: 168, width: 860, height: 262 };
const MARK = { left: 158, top: 168, width: 252, height: 256 };

/** Remove the dark background: luminance-keyed alpha + un-premultiply. */
async function keyOut(box, mask) {
  const { data, info } = await sharp(SRC)
    .extract(box)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Estimate the background from the crop's border pixels.
  const bg = [0, 0, 0];
  let n = 0;
  for (let x = 0; x < info.width; x++) {
    for (const y of [0, 1, info.height - 2, info.height - 1]) {
      const i = (y * info.width + x) * 3;
      bg[0] += data[i];
      bg[1] += data[i + 1];
      bg[2] += data[i + 2];
      n++;
    }
  }
  bg.forEach((_, k) => (bg[k] /= n));

  const out = Buffer.alloc(info.width * info.height * 4);
  const LO = 62; // below this (max channel) -> fully transparent (kills texture dots)
  const HI = 150; // above this -> fully opaque
  for (let p = 0; p < info.width * info.height; p++) {
    const r = data[p * 3];
    const g = data[p * 3 + 1];
    const b = data[p * 3 + 2];
    const v = Math.max(r, g, b);
    const px = p % info.width;
    const py = Math.floor(p / info.width);
    if (mask && px >= mask.x && py >= mask.y) continue; // stays transparent
    let a = (v - LO) / (HI - LO);
    a = Math.min(1, Math.max(0, a));
    a = a * a * (3 - 2 * a); // smoothstep
    const un = (c, k) =>
      a > 0 ? Math.min(255, Math.max(0, (c - bg[k] * (1 - a)) / a)) : 0;
    out[p * 4] = un(r, 0);
    out[p * 4 + 1] = un(g, 1);
    out[p * 4 + 2] = un(b, 2);
    out[p * 4 + 3] = Math.round(a * 255);
  }
  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).trim({ threshold: 1 });
}

async function sampleRed() {
  const { data, info } = await sharp(SRC)
    .extract(LOCKUP)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const acc = [0, 0, 0];
  let n = 0;
  for (let p = 0; p < info.width * info.height; p++) {
    const r = data[p * 3];
    const g = data[p * 3 + 1];
    const b = data[p * 3 + 2];
    if (r > 170 && g < 60 && b < 60) {
      acc[0] += r;
      acc[1] += g;
      acc[2] += b;
      n++;
    }
  }
  const hex = acc
    .map((c) => Math.round(c / n).toString(16).padStart(2, "0"))
    .join("");
  return `#${hex.toUpperCase()}`;
}

await fs.mkdir(path.join(ROOT, "public"), { recursive: true });

// The mark is taller than the wordmark; blank the "HR Consulting | Financial
// Advisory" line that sits under the wordmark inside the same crop.
const lockup = await keyOut(LOCKUP, { x: 270, y: 222 });
await lockup.clone().png({ compressionLevel: 9 }).toFile(path.join(ROOT, "public", "logo.png"));

const markBuf = await (await keyOut(MARK)).png().toBuffer();
await sharp(markBuf).png({ compressionLevel: 9 }).toFile(path.join(ROOT, "public", "logo-mark.png"));

async function icon(size, file, pad) {
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(markBuf)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: PAGE_BG },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(file);
}
await icon(64, path.join(ROOT, "app", "icon.png"), 0.1);
await icon(180, path.join(ROOT, "app", "apple-icon.png"), 0.16);

// Open Graph image: frame 1 (assembled building) centred on the page background.
const frame1 = path.join(ROOT, "public", "frames", "frame_0001.webp");
const building = await sharp(frame1).resize(1120, 630, { fit: "cover" }).toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 3, background: PAGE_BG },
})
  .composite([{ input: building, gravity: "center" }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(ROOT, "public", "og-image.jpg"));

console.log(`Brand assets written. Sampled logo red: ${await sampleRed()}`);
