import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { aboutParagraphs } from "@/lib/content";

export function About({ index = "01", moreLink = false }: { index?: string; moreLink?: boolean }) {
  return (
    <section id="about" aria-labelledby="about-title" className="py-28 md:py-40">
      <div className="container-site grid gap-14 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-7">
          <p className="label mb-6 flex items-center gap-4">
            <span className="text-red-bright">{index}</span>
            <span aria-hidden className="h-px w-10 bg-red" />
            About ClassOne
          </p>
          <h2 id="about-title" className="display text-balance text-[clamp(2.5rem,6vw,5.5rem)]">
            Clear, consistent, <span className="text-red">people-centred</span> HR.
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="space-y-6 text-base leading-relaxed md:col-span-5 md:self-end md:text-lg">
          {aboutParagraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          {moreLink && (
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 pt-2 font-sans text-[12px] font-medium uppercase tracking-wide2 text-fg hover:text-red-bright"
            >
              More about ClassOne
              <span aria-hidden className="text-red-bright transition-transform duration-600 ease-brand group-hover:translate-x-1">
                →
              </span>
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
