import Link from "next/link";
import { partnership, getService } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function Partnership({ index = "03" }: { index?: string }) {
  const service = getService(partnership.relatedServiceSlug);
  return (
    <section aria-labelledby="partnership-title" className="border-t border-line py-24 md:py-32">
      <div className="container-site grid gap-10 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-5">
          <p className="label mb-5 flex items-center gap-4">
            <span className="text-red-bright">{index}</span>
            <span aria-hidden className="h-px w-10 bg-red" />
            Partnership
          </p>
          <h2 id="partnership-title" className="display text-balance text-[clamp(2rem,4vw,3.25rem)]">
            Authorised recruitment partner.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-7">
          <div className="cut-corner bg-white/[0.04] p-8 md:p-10">
            <p className="label mb-4 !text-red-bright">{partnership.role}</p>
            <p className="text-pretty font-display text-[clamp(1.4rem,2.4vw,2rem)] font-normal leading-[1.3] text-fg">
              ClassOne Consulting is an {partnership.role} with {partnership.partner}.
            </p>
            {service && (
              <Link
                href={`/services/${service.slug}`}
                className="group mt-6 inline-block font-sans text-[12px] font-medium uppercase leading-relaxed tracking-wide2 text-fg hover:text-red-bright"
              >
                {service.name}
                <span aria-hidden className="ml-3 inline-block text-red-bright transition-transform duration-600 ease-brand group-hover:translate-x-1">
                  →
                </span>
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
