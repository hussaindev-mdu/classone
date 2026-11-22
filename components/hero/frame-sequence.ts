/**
 * Progressive frame loader + bounded ImageBitmap cache for the hero scrub.
 *
 * - Frame 1 is fetched first, then the rest in a coarse-to-fine order
 *   (every 16th frame, then every 8th, 4th, 2nd, 1st) so the whole scroll
 *   range is scrubbable early and fills in detail as more frames arrive.
 * - Compressed blobs are kept for every frame (~50 MB desktop, ~18 MB mobile).
 * - Decoded ImageBitmaps are kept only for a window around the current frame
 *   (a 1920x1080 bitmap is ~8 MB, so decoding all 240 would need ~2 GB).
 *   Decoding happens off the main thread via createImageBitmap, biased in the
 *   direction of travel, so scrubbing never blocks on a decode: the renderer
 *   always draws the nearest decoded frames.
 */

export type FrameBracket = {
  lo: ImageBitmap;
  hi: ImageBitmap | null;
  /** Blend weight of `hi` over `lo` (0..1). */
  t: number;
};

type Options = {
  maxBitmaps: number;
  fetchConcurrency?: number;
  decodeConcurrency?: number;
  /** Only load every n-th frame (used for Save-Data). */
  stride?: number;
};

function progressiveOrder(count: number, stride: number): number[] {
  const seen = new Set<number>([0]);
  const order: number[] = [];
  for (let step = 16; step >= stride; step = step / 2) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
    if (step === 1) break;
  }
  const last = count - 1;
  if (!seen.has(last)) order.unshift(last);
  return order;
}

function afterLoadIdle(): Promise<void> {
  return new Promise((resolve) => {
    const idle = () =>
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => resolve(), { timeout: 1200 })
        : setTimeout(resolve, 200);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

export class FrameSequence {
  readonly count: number;
  private readonly urls: string[];
  private readonly opts: Required<Options>;
  private readonly blobs: (Blob | undefined)[];
  private readonly bitmaps = new Map<number, ImageBitmap>();
  private readonly decoding = new Set<number>();
  private readonly abort = new AbortController();
  private decodeWidth = 0;
  private focus = 0;
  private dir = 1;
  private destroyed = false;
  private resizeSupported = true;

  /** Called whenever a new frame becomes drawable. */
  onChange: () => void = () => {};

  constructor(urls: string[], opts: Options) {
    this.urls = urls;
    this.count = urls.length;
    this.opts = {
      fetchConcurrency: 6,
      decodeConcurrency: 3,
      stride: 1,
      ...opts,
    };
    this.blobs = new Array(urls.length);
  }

  async start() {
    await this.fetchFrame(0, "high");
    if (this.destroyed) return;
    // Let the page finish its critical loading before pulling ~240 frames.
    await afterLoadIdle();
    if (this.destroyed) return;

    const order = progressiveOrder(this.count, this.opts.stride);
    let cursor = 0;
    const worker = async () => {
      while (cursor < order.length && !this.destroyed) {
        const index = order[cursor++];
        if (!this.blobs[index]) await this.fetchFrame(index, "low");
      }
    };
    await Promise.all(Array.from({ length: this.opts.fetchConcurrency }, worker));
  }

  /** Target width (device pixels) to decode at; flushes the cache on big changes. */
  setDecodeWidth(width: number) {
    const w = Math.round(width);
    if (!this.decodeWidth) {
      this.decodeWidth = w;
      return;
    }
    const ratio = w / this.decodeWidth;
    if (ratio > 1.2 || ratio < 0.6) {
      this.decodeWidth = w;
      for (const [i, bmp] of this.bitmaps) {
        if (i !== 0) {
          bmp.close();
          this.bitmaps.delete(i);
        }
      }
      this.pump();
    }
  }

  /** Tell the cache where the playhead is (fractional frame index). */
  setFocus(index: number) {
    const delta = index - this.focus;
    if (Math.abs(delta) > 0.01) this.dir = delta > 0 ? 1 : -1;
    this.focus = index;
    this.pump();
  }

  /** Nearest decoded frames below and above the fractional index. */
  bracket(f: number): FrameBracket | null {
    const maxSearch = 64;
    const base = Math.floor(f);
    let lo = -1;
    let hi = -1;
    for (let k = 0; k <= maxSearch; k++) {
      if (lo < 0 && base - k >= 0 && this.bitmaps.has(base - k)) lo = base - k;
      if (hi < 0 && base + 1 + k < this.count && this.bitmaps.has(base + 1 + k)) hi = base + 1 + k;
      if (lo >= 0 && hi >= 0) break;
    }
    if (lo < 0 && hi < 0) {
      const first = this.bitmaps.get(0);
      return first ? { lo: first, hi: null, t: 0 } : null;
    }
    if (lo < 0) return { lo: this.bitmaps.get(hi)!, hi: null, t: 0 };
    if (hi < 0 || f <= lo) return { lo: this.bitmaps.get(lo)!, hi: null, t: 0 };
    const t = Math.min(1, Math.max(0, (f - lo) / (hi - lo)));
    return { lo: this.bitmaps.get(lo)!, hi: this.bitmaps.get(hi)!, t };
  }

  destroy() {
    this.destroyed = true;
    this.abort.abort();
    for (const bmp of this.bitmaps.values()) bmp.close();
    this.bitmaps.clear();
  }

  // ---------------------------------------------------------------------------

  private async fetchFrame(index: number, priority: "high" | "low") {
    try {
      const res = await fetch(this.urls[index], {
        signal: this.abort.signal,
        priority,
      } as RequestInit);
      if (!res.ok) return;
      this.blobs[index] = await res.blob();
      this.pump();
    } catch {
      // Aborted or offline: the renderer keeps using the nearest frame.
    }
  }

  private pump() {
    if (this.destroyed) return;
    const { maxBitmaps, decodeConcurrency } = this.opts;
    if (this.decoding.size >= decodeConcurrency) return;

    const center = Math.round(this.focus);
    const ahead = Math.floor((maxBitmaps - 2) * 0.65);
    const behind = maxBitmaps - 2 - ahead;

    const candidates: number[] = [];
    if (!this.bitmaps.has(0)) candidates.push(0); // frame 1 is always kept
    for (let k = 0; k <= Math.max(ahead, behind); k++) {
      if (k <= ahead) candidates.push(center + this.dir * k);
      if (k > 0 && k <= behind) candidates.push(center - this.dir * k);
    }

    for (const i of candidates) {
      if (this.decoding.size >= decodeConcurrency) break;
      if (i < 0 || i >= this.count) continue;
      if (this.bitmaps.has(i) || this.decoding.has(i) || !this.blobs[i]) continue;
      void this.decode(i);
    }
  }

  private async createBitmap(blob: Blob): Promise<ImageBitmap> {
    if (this.resizeSupported && this.decodeWidth > 0) {
      try {
        return await createImageBitmap(blob, {
          resizeWidth: this.decodeWidth,
          resizeQuality: "high",
        });
      } catch {
        this.resizeSupported = false;
      }
    }
    return createImageBitmap(blob);
  }

  private async decode(index: number) {
    const blob = this.blobs[index];
    if (!blob) return;
    this.decoding.add(index);
    try {
      const bmp = await this.createBitmap(blob);
      if (this.destroyed) {
        bmp.close();
        return;
      }
      this.bitmaps.get(index)?.close();
      this.bitmaps.set(index, bmp);
      this.evict();
      this.onChange();
    } catch {
      // Corrupt frame: skip it, neighbours will be drawn instead.
    } finally {
      this.decoding.delete(index);
      this.pump();
    }
  }

  private evict() {
    const { maxBitmaps } = this.opts;
    while (this.bitmaps.size > maxBitmaps) {
      let worst = -1;
      let worstScore = -1;
      for (const i of this.bitmaps.keys()) {
        if (i === 0) continue;
        const d = i - this.focus;
        // Frames behind the direction of travel are cheaper to drop.
        const score = Math.abs(d) * (Math.sign(d) === this.dir ? 1 : 1.6);
        if (score > worstScore) {
          worstScore = score;
          worst = i;
        }
      }
      if (worst < 0) break;
      this.bitmaps.get(worst)!.close();
      this.bitmaps.delete(worst);
    }
  }
}
