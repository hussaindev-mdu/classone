#!/usr/bin/env node
/**
 * prepare-frames
 *
 * Reads every image in /public/frames (JPG, PNG or WebP, any file name), sorts
 * them in natural numeric order, and writes:
 *   /public/frames/frame_0001.webp ...        1920px wide, WebP q80
 *   /public/frames-mobile/frame_0001.webp ... 960px wide copies
 *   /lib/frames-manifest.json                  frame count + sampled background colour
 *
 * Originals are only removed after every frame has converted successfully.
 * Running it again on an already-prepared folder does not re-encode the
 * desktop frames (no generational quality loss); it just refreshes the mobile
 * set and the manifest.
 */
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";

const ROOT = process.cwd();
const FRAMES_DIR = path.join(ROOT, "public", "frames");
const MOBILE_DIR = path.join(ROOT, "public", "frames-mobile");
const STAGING_DIR = path.join(ROOT, "public", ".frames-staging");
const MANIFEST = path.join(ROOT, "lib", "frames-manifest.json");

const DESKTOP_WIDTH = 1920;
const MOBILE_WIDTH = 960;
const QUALITY = 80;
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const PREPARED_NAME = /^frame_\d{4}\.webp$/;

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
const frameName = (i) => `frame_${String(i + 1).padStart(4, "0")}.webp`;

async function pool(items, limit, worker) {
  let next = 0;
  let done = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      await worker(items[i], i);
      done++;
      if (done % 20 === 0 || done === items.length) {
        process.stdout.write(`\r  ${done}/${items.length}`);
      }
    }
  });
  await Promise.all(runners);
  process.stdout.write("\n");
}

/**
 * Sample the page background from frame 1: median colour of the top band and
 * the upper parts of the left/right edges (the floor reflection at the
 * bottom is excluded on purpose).
 */
async function sampleBackground(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const rs = [];
  const gs = [];
  const bs = [];
  const push = (x, y) => {
    const i = (y * width + x) * 3;
    rs.push(data[i]);
    gs.push(data[i + 1]);
    bs.push(data[i + 2]);
  };
  const band = Math.max(4, Math.round(height * 0.03));
  for (let y = 0; y < band; y++) for (let x = 0; x < width; x += 2) push(x, y);
  for (let y = band; y < height * 0.55; y += 2) {
    for (let x = 0; x < band; x++) {
      push(x, y);
      push(width - 1 - x, y);
    }
  }
  const median = (arr) => {
    arr.sort((a, b) => a - b);
    return arr[Math.floor(arr.length / 2)];
  };
  const hex = [median(rs), median(gs), median(bs)]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("");
  return `#${hex}`;
}

async function main() {
  const entries = (await fs.readdir(FRAMES_DIR)).filter(
    (f) => IMAGE_EXT.test(f) && !f.startsWith("."),
  );
  if (entries.length === 0) {
    console.error(`No images found in ${path.relative(ROOT, FRAMES_DIR)}.`);
    process.exit(1);
  }
  entries.sort(collator.compare);

  const alreadyPrepared =
    entries.every((f) => PREPARED_NAME.test(f)) &&
    entries.every((f, i) => f === frameName(i));

  const cpu = Math.max(2, Math.min(8, os.cpus().length));
  sharp.concurrency(1); // parallelism comes from the pool below

  if (alreadyPrepared) {
    console.log(`Frames already prepared (${entries.length}). Refreshing mobile set and manifest.`);
  } else {
    console.log(`Converting ${entries.length} frames -> ${DESKTOP_WIDTH}px WebP q${QUALITY}`);
    await fs.rm(STAGING_DIR, { recursive: true, force: true });
    await fs.mkdir(STAGING_DIR, { recursive: true });

    // 1) Convert everything into a staging folder. If anything fails we stop
    //    here and the originals are untouched.
    await pool(entries, cpu, async (file, i) => {
      await sharp(path.join(FRAMES_DIR, file))
        .resize({ width: DESKTOP_WIDTH, withoutEnlargement: false })
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(path.join(STAGING_DIR, frameName(i)));
    });

    // 2) Every frame converted: remove originals, then move the new frames in.
    for (const file of entries) await fs.rm(path.join(FRAMES_DIR, file));
    for (let i = 0; i < entries.length; i++) {
      await fs.rename(path.join(STAGING_DIR, frameName(i)), path.join(FRAMES_DIR, frameName(i)));
    }
    await fs.rm(STAGING_DIR, { recursive: true, force: true });
  }

  const count = entries.length;

  console.log(`Writing ${MOBILE_WIDTH}px mobile copies`);
  await fs.rm(MOBILE_DIR, { recursive: true, force: true });
  await fs.mkdir(MOBILE_DIR, { recursive: true });
  const names = Array.from({ length: count }, (_, i) => frameName(i));
  await pool(names, cpu, async (name) => {
    await sharp(path.join(FRAMES_DIR, name))
      .resize({ width: MOBILE_WIDTH })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(path.join(MOBILE_DIR, name));
  });

  const first = path.join(FRAMES_DIR, frameName(0));
  const meta = await sharp(first).metadata();
  const mobileMeta = await sharp(path.join(MOBILE_DIR, frameName(0))).metadata();
  const background = await sampleBackground(first);

  const manifest = {
    count,
    width: meta.width,
    height: meta.height,
    mobileWidth: mobileMeta.width,
    mobileHeight: mobileMeta.height,
    background,
    pattern: "frame_{index}.webp",
    generatedAt: new Date().toISOString(),
  };
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

  const sizeOf = async (dir) => {
    let total = 0;
    for (const n of names) total += (await fs.stat(path.join(dir, n))).size;
    return (total / 1024 / 1024).toFixed(1);
  };
  console.log(
    `Done: ${count} frames (${meta.width}x${meta.height}). ` +
      `Desktop ${await sizeOf(FRAMES_DIR)} MB, mobile ${await sizeOf(MOBILE_DIR)} MB. ` +
      `Background ${background}. Manifest -> ${path.relative(ROOT, MANIFEST)}`,
  );
}

main().catch((err) => {
  console.error("\nprepare-frames failed:", err);
  process.exit(1);
});
