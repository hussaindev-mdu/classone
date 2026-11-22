"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useMotionValue, useReducedMotion, useScroll } from "framer-motion";
import { HeroOverlays } from "./HeroOverlays";
import { DESKTOP_QUERY } from "./stage";
import { withBase } from "@/lib/base-path";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => null,
  );
}

/**
 * Pinned hero: a full-viewport canvas scrubbed through the frame sequence for
 * ~350vh of scroll. Scroll down opens the building; scroll up closes it.
 * Under prefers-reduced-motion the pin is removed (pure CSS, no layout jump)
 * and a static frame 1 is shown instead.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const still = useMotionValue(0);
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const reduced = useReducedMotion();
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="hero"
      ref={ref}
      aria-label="ClassOne Consulting"
      className="relative h-[calc(100svh+350vh)] motion-reduce:h-[100svh]"
    >
      {/* Start fetching frame 1 before hydration (fetch-mode, so the loader's fetch() reuses it). */}
      <link
        rel="preload"
        as="fetch"
        href={withBase("/frames/frame_0001.webp")}
        crossOrigin="anonymous"
        media="(min-width: 768px) and (prefers-reduced-motion: no-preference)"
      />
      <link
        rel="preload"
        as="fetch"
        href={withBase("/frames-mobile/frame_0001.webp")}
        crossOrigin="anonymous"
        media="(max-width: 767.98px) and (prefers-reduced-motion: no-preference)"
      />

      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink">
        {desktop !== null && reduced === false && (
          <HeroCanvas progress={scrollYProgress} desktop={desktop} active={onScreen} />
        )}

        {/* Reduced motion: static building (frame 1), placed like the canvas stage. */}
        <div className="absolute inset-x-0 top-[72px] hidden h-[min(64vw,55svh)] motion-reduce:block md:inset-x-[2vw] md:bottom-[calc(clamp(200px,30vh,300px)-6vh)] md:top-16 md:h-auto">
          <Image
            src={withBase("/frames/frame_0001.webp")}
            alt="The ClassOne Consulting office building"
            fill
            sizes="100vw"
            className="object-cover md:object-contain"
          />
        </div>

        <HeroOverlays progress={reduced ? still : scrollYProgress} />
      </div>
    </section>
  );
}
