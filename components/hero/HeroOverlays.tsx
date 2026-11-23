"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

/**
 * Narrative overlays for the pinned hero. Each fades in/out over its scroll
 * range and sits in the dark band the stage leaves free (see stage.ts):
 * - desktop: bottom band, clamp(200px, 30vh, 300px)
 * - mobile:  stacked below the 64vw-tall stage
 */

function useFade(progress: MotionValue<number>, input: number[], output: number[]) {
  const opacity = useTransform(progress, input, output);
  const y = useTransform(opacity, [0, 1], [18, 0]);
  const visibility = useTransform(opacity, (o) => (o > 0.02 ? "visible" : "hidden"));
  return { opacity, y, visibility };
}

const panel =
  "absolute inset-x-0 top-[calc(72px+min(64vw,55svh)+24px)] md:top-auto md:bottom-0 md:flex md:h-[clamp(200px,30vh,300px)] md:items-end";

function Chapter({
  style,
  index,
  label,
  title,
  text,
}: {
  style: ReturnType<typeof useFade>;
  index: string;
  label: string;
  title: string;
  text: string;
}) {
  return (
    <motion.div style={style} className={panel}>
      <div className="container-site pb-0 md:grid md:grid-cols-12 md:items-end md:gap-10 md:pb-12">
        <div className="md:col-span-7">
          <p className="label mb-4 flex items-center gap-4">
            <span className="text-red-bright">{index}</span>
            <span aria-hidden className="h-px w-10 bg-red" />
            {label}
          </p>
          <h2 className="display text-balance text-[clamp(2rem,4.2vw,4rem)]">{title}</h2>
        </div>
        <p className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-fg-body md:col-span-5 md:mt-0 md:justify-self-end md:text-base">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

export function HeroOverlays({ progress }: { progress: MotionValue<number> }) {
  const intro = useFade(progress, [0, 0.18, 0.25], [1, 1, 0]);
  const foundations = useFade(progress, [0.25, 0.31, 0.49, 0.55], [0, 1, 1, 0]);
  const growth = useFade(progress, [0.55, 0.61, 0.79, 0.85], [0, 1, 1, 0]);
  const explore = useFade(progress, [0.86, 0.93], [0, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 [&_a]:pointer-events-auto">
      {/* 0–25%: building closed */}
      <motion.div style={intro} className={panel}>
        <div className="container-site flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10 md:pb-12">
          <div>
            <Logo height={40} className="h-8 w-auto md:h-10" />
            <h1 className="display mt-5 text-balance text-[clamp(2.4rem,4.4vw,4.75rem)]">
              People<span className="text-red">.</span> Performance<span className="text-red">.</span>{" "}
              Progress<span className="text-red">.</span>
            </h1>
          </div>
          <div className="flex flex-col gap-5 md:shrink-0 md:items-end">
            <p className="label whitespace-nowrap !tracking-[0.2em] !text-fg-body md:!tracking-label">
              People-Centred <span className="mx-2 text-red-bright">|</span> HR Consulting
            </p>
            <ButtonLink href="/contact" className="self-start md:self-auto">
              Book a consultation
            </ButtonLink>
          </div>
        </div>
      </motion.div>

      {/* 25–55%: building opening */}
      <Chapter
        style={foundations}
        index="01"
        label="Foundations"
        title="Practical HR partnership."
        text="A founder-led HR consulting practice shaped by more than 14 years of experience across India and the UAE."
      />

      {/* 55–85%: services emerging */}
      <Chapter
        style={growth}
        index="02"
        label="HR lifecycle"
        title="Stronger, more capable workplaces."
        text="Support that connects recruitment, performance, development, employee relations and HR operations."
      />

      {/* 85–100%: fully exploded. The final frame already shows the service labels. */}
      <motion.div style={explore} className="absolute inset-x-0 top-[calc(72px+min(64vw,55svh)+24px)] flex justify-center md:bottom-6 md:top-auto">
        <a
          href="#services"
          className="group flex items-center gap-3 px-4 py-3 font-sans text-[11px] font-medium uppercase tracking-label text-fg-body transition-colors duration-600 ease-brand hover:text-fg"
        >
          Explore our services
          <span aria-hidden className="text-red transition-transform duration-600 ease-brand group-hover:translate-y-1">
            ↓
          </span>
        </a>
      </motion.div>

      <span className="sr-only">{siteConfig.descriptor}</span>
    </div>
  );
}
