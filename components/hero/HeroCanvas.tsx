"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import manifest from "@/lib/frames-manifest.json";
import { FrameSequence } from "./frame-sequence";
import { withBase } from "@/lib/base-path";
import { computeStage, displayedImageWidth, drawCover, expandAt, type Rect } from "./stage";

type Props = {
  progress: MotionValue<number>;
  desktop: boolean;
  /** Pause the render loop while the hero is off-screen. */
  active: boolean;
};

const ASPECT = manifest.width / manifest.height;
const BG = manifest.background;

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
}
const [BR, BGc, BB] = hexToRgb(BG);
const bgA = (a: number) => `rgba(${BR},${BGc},${BB},${a})`;

export function frameUrls(desktop: boolean) {
  const dir = withBase(desktop ? "/frames" : "/frames-mobile");
  return Array.from(
    { length: manifest.count },
    (_, i) => `${dir}/frame_${String(i + 1).padStart(4, "0")}.webp`,
  );
}

function featherEdges(ctx: CanvasRenderingContext2D, r: Rect, sides: boolean) {
  const fy = r.h * 0.1;
  let g = ctx.createLinearGradient(0, r.y, 0, r.y + fy);
  g.addColorStop(0, bgA(1));
  g.addColorStop(1, bgA(0));
  ctx.fillStyle = g;
  ctx.fillRect(r.x, r.y, r.w, fy);

  g = ctx.createLinearGradient(0, r.y + r.h - fy * 1.4, 0, r.y + r.h);
  g.addColorStop(0, bgA(0));
  g.addColorStop(1, bgA(1));
  ctx.fillStyle = g;
  ctx.fillRect(r.x, r.y + r.h - fy * 1.4, r.w, fy * 1.4 + 1);

  if (!sides) return;
  const fx = r.w * 0.05;
  g = ctx.createLinearGradient(r.x, 0, r.x + fx, 0);
  g.addColorStop(0, bgA(1));
  g.addColorStop(1, bgA(0));
  ctx.fillStyle = g;
  ctx.fillRect(r.x, r.y, fx, r.h);

  g = ctx.createLinearGradient(r.x + r.w - fx, 0, r.x + r.w, 0);
  g.addColorStop(0, bgA(0));
  g.addColorStop(1, bgA(1));
  ctx.fillStyle = g;
  ctx.fillRect(r.x + r.w - fx, r.y, fx + 1, r.h);
}

export default function HeroCanvas({ progress, desktop, active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const wakeRef = useRef<() => void>(() => {});

  useEffect(() => {
    activeRef.current = active;
    if (active) wakeRef.current();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const lowMemory = (nav.deviceMemory ?? 8) <= 4;
    const saveData = !!nav.connection?.saveData;

    const seq = new FrameSequence(frameUrls(desktop), {
      maxBitmaps: desktop ? (lowMemory ? 18 : 30) : lowMemory ? 28 : 44,
      fetchConcurrency: desktop ? 6 : 4,
      stride: saveData ? 4 : 1,
    });

    let cssW = 0;
    let cssH = 0;
    let stage: Rect = { x: 0, y: 0, w: 0, h: 0 };
    let current = progress.get() * (seq.count - 1);
    let dirty = true;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = canvas.clientWidth;
      cssH = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      stage = computeStage(cssW, cssH, desktop, ASPECT, expandAt(current / (seq.count - 1)));
      // Decode for the largest stage size (fully expanded) so growth never forces a re-decode.
      const largest = computeStage(cssW, cssH, desktop, ASPECT, 1);
      seq.setDecodeWidth(
        Math.min(desktop ? manifest.width : manifest.mobileWidth, displayedImageWidth(largest, ASPECT) * dpr),
      );
      dirty = true;
      wake();
    };

    const render = () => {
      raf = 0;
      if (!activeRef.current) return;

      const target = progress.get() * (seq.count - 1);
      const diff = target - current;
      // Light smoothing so trackpad/wheel steps glide; still a direct mapping.
      current = Math.abs(diff) < 0.02 ? target : current + diff * 0.22;
      seq.setFocus(current);

      if (dirty || Math.abs(diff) > 0) {
        if (desktop) stage = computeStage(cssW, cssH, desktop, ASPECT, expandAt(current / (seq.count - 1)));
        const frame = seq.bracket(current);
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, cssW, cssH);
        if (frame) {
          ctx.globalAlpha = 1;
          drawCover(ctx, frame.lo, stage);
          if (frame.hi && frame.t > 0.004) {
            ctx.globalAlpha = frame.t;
            drawCover(ctx, frame.hi, stage);
            ctx.globalAlpha = 1;
          }
          featherEdges(ctx, stage, desktop);
        }
        dirty = false;
      }

      if (current !== target) raf = requestAnimationFrame(render);
    };

    function wake() {
      if (!raf && activeRef.current) raf = requestAnimationFrame(render);
    }
    wakeRef.current = wake;

    seq.onChange = () => {
      dirty = true;
      wake();
    };
    const unsubscribe = progress.on("change", wake);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    void seq.start();

    return () => {
      unsubscribe();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      wakeRef.current = () => {};
      seq.destroy();
    };
  }, [desktop, progress]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block h-full w-full" />;
}
