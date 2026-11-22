"use client";

/*
 * PLACEHOLDER TESTIMONIALS: the quotes and names in lib/content.ts are not real.
 * Replace them with genuine, approved client reviews before launch.
 */
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { testimonials } from "@/lib/content";
import { EASE } from "@/lib/motion";

const INTERVAL = 7000;

export function Testimonials({ sectionIndex = "06" }: { sectionIndex?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const reduced = useReducedMotion();
  const count = testimonials.length;

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    if (paused || reduced || interacted) return;
    const id = window.setInterval(() => go(1), INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, reduced, interacted, go]);

  const t = testimonials[index];

  return (
    <section aria-labelledby="clients-title" className="bg-charcoal py-28 md:py-40">
      <div className="container-site">
        <p className="label mb-5 flex items-center gap-4">
          <span className="text-red-bright">{sectionIndex}</span>
          <span aria-hidden className="h-px w-10 bg-red" />
          <span id="clients-title">Client words</span>
        </p>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="grid gap-12 md:grid-cols-12"
        >
          <div className="relative min-h-[300px] md:col-span-10 md:min-h-[280px]" aria-live={interacted ? "polite" : "off"}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <figure>
                <span aria-hidden className="block font-display text-7xl leading-none text-red">
                  &ldquo;
                </span>
                <blockquote className="mt-2 text-balance font-display text-[clamp(1.6rem,3.2vw,2.75rem)] font-normal leading-[1.2] text-fg">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span aria-hidden className="h-px w-10 bg-red" />
                  <span>
                    <span className="block font-sans text-sm font-semibold uppercase tracking-wide2 text-fg">{t.name}</span>
                    <span className="block text-sm">{t.role}</span>
                  </span>
                </figcaption>
                </figure>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-end gap-6 md:col-span-2 md:flex-col md:items-end md:justify-end">
            <p className="label tabular-nums">
              <span className="text-fg">{String(index + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}
            </p>
            <div className="flex gap-2">
              {[
                { dir: -1, label: "Previous testimonial", d: "M15 3 6 12l9 9" },
                { dir: 1, label: "Next testimonial", d: "m9 3 9 9-9 9" },
              ].map((b) => (
                <button
                  key={b.label}
                  type="button"
                  aria-label={b.label}
                  onClick={() => {
                    setInteracted(true);
                    go(b.dir);
                  }}
                  className="cut-corner flex h-12 w-12 items-center justify-center bg-white/[0.06] text-fg transition-colors duration-600 ease-brand hover:bg-red"
                >
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={b.d} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
