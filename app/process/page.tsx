import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Process } from "@/components/sections/Process";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Discovery, assessment, strategy, implementation and review: how ClassOne Consulting works with your business.",
  alternates: { canonical: "/process" },
};

/** PLACEHOLDER answers: confirm details (especially timelines and pricing) with ClassOne. */
const faqs = [
  {
    q: "How long does a typical engagement take?",
    a: "Discovery and assessment usually take one to two weeks. Implementation depends on scope: a single hire can close in a few weeks, while a payroll or compliance overhaul typically runs over one to three months.",
  },
  {
    q: "Can we engage you only for HR, or only for finance?",
    a: "Yes. Many clients start with one service and add others later. Because both disciplines sit under one team, anything you add later builds on what we already know about your business.",
  },
  {
    q: "Do you work with startups and small businesses?",
    a: "Yes. We work with businesses from early-stage startups to established companies with several hundred employees, and scale the engagement to fit.",
  },
  {
    q: "How is pricing structured?",
    a: "[PLACEHOLDER] Pricing depends on scope: project-based fees for one-off work, and monthly retainers for ongoing services like payroll and compliance. We share a clear proposal after the discovery call.",
  },
  {
    q: "Who will we work with?",
    a: "You get one dedicated consultant who stays with you from discovery to review, and brings in specialists from our HR and finance teams as needed.",
  },
];

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        label="Process"
        title="How we work."
        intro="A clear five-step method, so you always know what happens next and why."
        crumbs={[{ label: "Process" }]}
      />
      <Process header={false} />

      <section aria-labelledby="faq-title" className="border-t border-line bg-charcoal py-24 md:py-32">
        <div className="container-site grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p className="label mb-5 flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-red" />
              FAQ
            </p>
            <h2 id="faq-title" className="display text-[clamp(2rem,4vw,3.25rem)]">
              Common questions.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-8">
            <ul className="border-t border-line">
              {faqs.map((f) => (
                <li key={f.q} className="border-b border-line">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl font-medium uppercase text-fg md:text-2xl [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span
                        aria-hidden
                        className="relative h-3 w-3 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-3 before:bg-red-bright after:absolute after:left-1/2 after:top-0 after:h-3 after:w-px after:bg-red-bright after:transition-transform after:duration-600 after:ease-brand group-open:after:scale-y-0"
                      />
                    </summary>
                    <p className="max-w-2xl pb-6 text-[15px] leading-relaxed md:text-base">{f.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
