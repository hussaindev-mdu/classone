import { whyPoints } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ChartIcon, PartnerIcon, PersonIcon, ShieldIcon } from "@/components/ui/Icons";

const icons = { partner: PartnerIcon, shield: ShieldIcon, chart: ChartIcon, person: PersonIcon };

export function WhyClassOne({ index = "03" }: { index?: string }) {
  return (
    <section aria-labelledby="why-title" className="py-28 md:py-40">
      <div className="container-site">
        <SectionHeader id="why-title" index={index} label="Why ClassOne" title="Why businesses choose us." />
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {whyPoints.map((p, i) => {
            const Icon = icons[p.icon];
            return (
              <li key={p.title} className="bg-ink">
                <Reveal delay={i * 0.08} className="flex h-full flex-col gap-6 p-8 lg:p-10">
                  <Icon className="h-9 w-9 text-red" />
                  <h3 className="font-display text-2xl font-medium uppercase leading-tight text-fg">{p.title}</h3>
                  <p className="text-[15px] leading-relaxed">{p.text}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
