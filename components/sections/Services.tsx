import Link from "next/link";
import { hrServices, financeServices, type Service } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

function ServiceRow({ n, service }: { n: number; service: Service }) {
  return (
    <li className="border-b border-line">
      <Link href={`/services/${service.slug}`} className="group block focus-visible:outline-offset-[-2px]">
        <div className="flex gap-6 py-7 transition-transform duration-600 ease-brand group-hover:translate-x-2 md:gap-8">
          <span className="w-8 shrink-0 pt-0.5 font-display text-2xl font-medium leading-none text-red transition-colors duration-600 ease-brand group-hover:text-red-bright">
            {String(n).padStart(2, "0")}
          </span>
          <div className="flex-1">
            <h4 className="font-display text-2xl font-medium uppercase leading-tight tracking-[0.01em] text-fg md:text-[28px]">
              {service.name}
            </h4>
            <p className="mt-2 text-[15px] leading-relaxed">{service.description}</p>
          </div>
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="mt-2 h-4 w-4 shrink-0 text-fg-muted opacity-0 transition-[opacity,transform,color] duration-600 ease-brand group-hover:translate-x-1 group-hover:text-red-bright group-hover:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M1 8h13M9 3l5 5-5 5" />
          </svg>
        </div>
      </Link>
    </li>
  );
}

function Column({ title, items, offset }: { title: string; items: Service[]; offset: number }) {
  return (
    <div>
      <h3 className="label mb-2 border-b border-line pb-5 !text-fg">{title}</h3>
      <ul>
        {items.map((s, i) => (
          <ServiceRow key={s.slug} n={offset + i + 1} service={s} />
        ))}
      </ul>
    </div>
  );
}

export function Services({ index = "02", id = "services" }: { index?: string; id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="bg-charcoal py-28 md:py-40">
      <div className="container-site">
        <SectionHeader
          id={`${id}-title`}
          index={index}
          label="Services"
          title={
            <>
              Two disciplines.
              <br />
              One accountable partner.
            </>
          }
          intro="Eight services across HR consulting and financial advisory, delivered by one team that sees how they connect."
        />
        <Reveal className="grid gap-16 md:grid-cols-[1fr_1px_1fr] md:gap-14 lg:gap-20">
          <Column title="HR Consulting" items={hrServices} offset={0} />
          <div aria-hidden className="hidden w-px bg-red/70 md:block" />
          <Column title="Financial Advisory" items={financeServices} offset={4} />
        </Reveal>
      </div>
    </section>
  );
}
