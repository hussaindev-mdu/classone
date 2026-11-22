/**
 * Where the building is drawn inside the full-viewport canvas.
 *
 * The source frames are 16:9 and the building fills almost the entire frame,
 * so there is no empty space inside the image for text. The canvas therefore
 * covers the whole viewport with the page background (sampled from frame 1),
 * and draws the frames with object-fit: cover into a "stage" rectangle that
 * leaves a dark band for the narrative overlays:
 *
 *  - Desktop: stage above a bottom text band. Edges are feathered into the
 *    background, so the frame boundary is invisible.
 *  - Mobile:  full-width stage, slightly taller than 16:9 (cover crops a
 *    few px off each side), building centred, overlay text stacked below.
 *
 * On desktop the stage grows into the text band over the last part of the
 * pin (85–100%), where there is no text and the baked-in service labels
 * benefit from the extra size.
 *
 * Keep these numbers in sync with the overlay positions in HeroOverlays.tsx.
 */

export const DESKTOP_QUERY = "(min-width: 768px)";
export const HEADER_H = 64;

/** Desktop bottom band reserved for overlay text: clamp(200px, 30vh, 300px). */
export function desktopBand(h: number) {
  return Math.min(300, Math.max(200, h * 0.3));
}

/** Mobile stage height as a fraction of viewport width. */
export const MOBILE_STAGE_RATIO = 0.64;
export const MOBILE_STAGE_TOP = HEADER_H + 8;

export type Rect = { x: number; y: number; w: number; h: number };

/** Desktop band height when the stage is fully expanded (room for the "Explore" link). */
const EXPANDED_BAND = 76;

export function computeStage(w: number, h: number, desktop: boolean, aspect: number, expand = 0): Rect {
  if (!desktop) {
    const sh = Math.min(w * MOBILE_STAGE_RATIO, h * 0.55);
    return { x: 0, y: MOBILE_STAGE_TOP, w, h: sh };
  }
  const top = HEADER_H;
  // The floor reflection at the bottom of each frame may sit slightly behind
  // the text band; it is dark and feathered.
  const band = desktopBand(h) + (EXPANDED_BAND - desktopBand(h)) * expand;
  const availH = h - top - band + h * 0.06 * (1 - expand);
  const availW = w * 0.96;
  const sw = Math.min(availW, availH * aspect);
  const sh = sw / aspect;
  return { x: (w - sw) / 2, y: top + Math.max(0, (availH - sh) / 2), w: sw, h: sh };
}

/** 0 until 85% of the pin, eased to 1 by 97%. */
export function expandAt(progress: number) {
  const t = Math.min(1, Math.max(0, (progress - 0.85) / 0.12));
  return t * t * (3 - 2 * t);
}

/** Draw `img` into `r` with object-fit: cover semantics. */
export function drawCover(ctx: CanvasRenderingContext2D, img: CanvasImageSource & { width: number; height: number }, r: Rect) {
  const iw = img.width;
  const ih = img.height;
  const scale = Math.max(r.w / iw, r.h / ih);
  const sw = r.w / scale;
  const sh = r.h / scale;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, r.x, r.y, r.w, r.h);
}

/** Width (in source-aspect pixels) at which a frame is actually displayed. */
export function displayedImageWidth(r: Rect, aspect: number) {
  // cover: scale = max(r.w / iw, r.h / ih) -> displayed width = max(r.w, r.h * aspect)
  return Math.max(r.w, r.h * aspect);
}
