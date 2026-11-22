"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { stats } from "@/lib/content";
import { EASE } from "@/lib/motion";

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const fmt = (v: number) => Math.round(v).toLocaleString("en-IN");

  // Server HTML carries the real figure (good for SEO / no-JS). With motion
  // allowed, reset to 0 while still off-screen, then count up on entry.
  useEffect(() => {
    if (reduced || !ref.current || inView) return;
    ref.current.textContent = fmt(0);
  }, [reduced, inView]);

  useEffect(() => {
    if (!inView || reduced) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => {
        if (node) node.textContent = fmt(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span className="tabular-nums">
      <span ref={ref}>{fmt(value)}</span>
      <span className="text-red">{suffix}</span>
    </span>
  );
}

/** PLACEHOLDER figures live in lib/content.ts (`stats`). Replace before launch. */
export function Numbers() {
  return (
    <section aria-label="ClassOne in numbers" className="border-y border-line bg-charcoal">
      <div className="container-site">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-3 py-12 md:py-16 ${i % 2 === 1 ? "pl-6 md:pl-10" : ""} ${
                i > 0 ? "lg:border-l lg:border-line lg:pl-10" : ""
              } ${i % 2 === 1 ? "border-l border-line" : ""} ${i < 2 ? "border-b border-line lg:border-b-0" : ""}`}
            >
              <dt className="label order-2">{s.label}</dt>
              <dd className="order-1 font-display text-[clamp(2.75rem,6vw,5rem)] font-semibold leading-none text-fg">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
