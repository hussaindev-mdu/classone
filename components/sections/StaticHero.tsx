import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { intro } from "@/lib/content";
import { withBase } from "@/lib/base-path";

const highlights = ["14+ years of HR experience", "India & UAE", "Founder-led practice"];

/**
 * Static home-page hero (used while the scroll-scrubbed animation is off).
 * Desktop: building image on the right, fading into the page on the left.
 * Mobile: image on top, copy below.
 */
export function StaticHero() {
  return (
    <section aria-labelledby="home-title" className="relative overflow-hidden border-b border-line md:min-h-[100svh]">
      {/* Image */}
      <div className="relative mt-[72px] aspect-[16/10] w-full md:absolute md:inset-y-0 md:right-0 md:mt-0 md:aspect-auto md:w-[68%]">
        <Image
          src={withBase("/frames/frame_0001.webp")}
          alt="The ClassOne Consulting office building at night with red accent lighting"
          fill
          priority
          sizes="(min-width: 768px) 68vw, 100vw"
          className="object-cover object-center"
        />
        {/* Fade the image into the page background */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent md:hidden" />
        <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-r from-ink via-ink/60 to-transparent md:block" />
        <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-t from-ink via-transparent to-ink/40 md:block" />
      </div>

      {/* Copy */}
      <div className="container-site relative flex flex-col justify-center pb-16 pt-4 md:min-h-[100svh] md:pb-28 md:pt-32">
        <div className="max-w-2xl">
          <p className="label mb-6 flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-red" />
            HR Consulting · Chennai, India
          </p>
          <h1 id="home-title" className="display text-[clamp(3rem,7.5vw,7rem)] leading-[0.95]">
            People<span className="text-red">.</span>
            <br />
            Performance<span className="text-red">.</span>
            <br />
            Progress<span className="text-red">.</span>
          </h1>
          <p className="mt-8 max-w-lg text-pretty text-base leading-relaxed text-fg-body md:text-lg">
            {intro.subline} {intro.experience}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Book a consultation</ButtonLink>
            <ButtonLink href="/services" variant="outline" arrow={false}>
              Our services
            </ButtonLink>
          </div>
        </div>

        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 md:mt-20 md:max-w-2xl">
          {highlights.map((h) => (
            <li key={h} className="flex items-center gap-3 font-sans text-[11px] font-medium uppercase tracking-wide2 text-fg-body">
              <span aria-hidden className="h-1.5 w-1.5 bg-red" />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
