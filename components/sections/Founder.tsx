import { founder } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

export function Founder({ index = "02" }: { index?: string }) {
  return (
    <section aria-labelledby="founder-title" className="py-28 md:py-40">
      <div className="container-site">
        <SectionHeader id="founder-title" index={index} label="Founder and principal consultant" title={founder.name} />
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p className="label !text-fg">{founder.role}</p>
            <a
              href={`mailto:${siteConfig.founderEmail}`}
              className="mt-4 inline-block text-[15px] text-fg-body hover:text-red-bright"
            >
              {siteConfig.founderEmail}
            </a>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-base leading-relaxed md:col-span-8 md:text-lg">
            {founder.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
