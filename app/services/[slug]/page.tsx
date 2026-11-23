import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allServices, getService, serviceNumber } from "@/lib/content";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return {
    title: service.name,
    description: `${service.description} HR consulting by ClassOne Consulting, Chennai.`,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

/*
 * DRAFT COPY: service overviews, "what's included" and outcomes live in
 * lib/content.ts. Review them with ClassOne before launch.
 */
export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const related = allServices.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHeader
        label={`${serviceNumber(service)} — HR Consulting`}
        title={service.name}
        intro={service.description}
        crumbs={[{ label: "Services", href: "/services" }, { label: service.name }]}
      />

      <section aria-label="Overview" className="py-24 md:py-32">
        <div className="container-site grid gap-14 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-6">
            <p className="label mb-6 flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-red" />
              Overview
            </p>
            <p className="text-pretty font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-normal leading-[1.3] text-fg">
              {service.overview}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-5 md:col-start-8">
            <h2 className="label mb-2 border-b border-line pb-5 !text-fg">What&rsquo;s included</h2>
            <ol>
              {service.includes.map((item, i) => (
                <li key={item} className="flex gap-5 border-b border-line py-5">
                  <span className="w-7 shrink-0 font-display text-xl leading-none text-red">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] leading-relaxed text-fg">{item}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="outcomes-title" className="border-y border-line bg-charcoal py-20 md:py-24">
        <div className="container-site">
          <h2 id="outcomes-title" className="label mb-10 flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-red" />
            What you can expect
          </h2>
          <ul className="grid gap-px bg-line md:grid-cols-3">
            {service.outcomes.map((o, i) => (
              <li key={o} className="bg-charcoal">
                <Reveal delay={i * 0.08} className="p-8 md:p-10">
                  <span aria-hidden className="mb-6 block h-px w-8 bg-red" />
                  <p className="font-display text-2xl font-medium uppercase leading-tight text-fg md:text-[28px]">{o}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="related-title" className="py-24 md:py-32">
        <div className="container-site">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 id="related-title" className="display text-[clamp(1.75rem,3.5vw,2.75rem)]">
              More HR services
            </h2>
            <Link
              href="/services"
              className="group hidden items-center gap-3 font-sans text-[12px] font-medium uppercase tracking-wide2 text-fg hover:text-red-bright sm:inline-flex"
            >
              All services
              <span aria-hidden className="text-red-bright transition-transform duration-600 ease-brand group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
          <ul className="grid gap-px bg-line md:grid-cols-3">
            {related.map((s) => (
              <li key={s.slug} className="bg-ink">
                <Link href={`/services/${s.slug}`} className="group flex h-full flex-col gap-4 p-8 transition-colors duration-600 ease-brand hover:bg-charcoal md:p-10">
                  <span className="font-display text-2xl leading-none text-red transition-colors duration-600 ease-brand group-hover:text-red-bright">
                    {serviceNumber(s)}
                  </span>
                  <span className="font-display text-2xl font-medium uppercase leading-tight text-fg">{s.name}</span>
                  <span className="text-[15px] leading-relaxed">{s.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={`Talk to us about ${service.name.toLowerCase()}.`} />
    </>
  );
}
