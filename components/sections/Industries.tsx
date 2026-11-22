import { industries } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/** Industry tags. PLACEHOLDER list: edit `industries` in lib/content.ts. */
export function Industries({ index = "05" }: { index?: string }) {
  return (
    <section aria-labelledby="industries-title" className="border-t border-line py-24 md:py-32">
      <div className="container-site grid gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <p className="label mb-5 flex items-center gap-4">
            <span className="text-red-bright">{index}</span>
            <span aria-hidden className="h-px w-10 bg-red" />
            Industries
          </p>
          <h2 id="industries-title" className="display text-[clamp(2rem,4vw,3.25rem)]">
            Sectors we serve.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-8 md:self-end">
          <ul className="flex flex-wrap gap-3">
            {industries.map((name) => (
              <li
                key={name}
                className="cut-corner bg-white/[0.06] px-5 py-3 font-sans text-[12px] font-medium uppercase tracking-wide2 text-fg"
              >
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
