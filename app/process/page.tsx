import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Process } from "@/components/sections/Process";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Understand, design, implement: how ClassOne Consulting works with your business.",
  alternates: { canonical: "/process" },
};

/** Answers based on the company profile. PLACEHOLDER: confirm pricing with ClassOne. */
const faqs = [
  {
    q: "How can we work with ClassOne?",
    a: "There are three ways to engage: an HR diagnostic and roadmap (a focused review of current practices with prioritized recommendations), a defined HR project (a scoped delivery such as a policy refresh, performance cycle setup or recruitment process improvement), or ongoing HR advisory (recurring support for leaders and managers, with agreed availability and priorities).",
  },
  {
    q: "Can you work with a business of our size?",
    a: "Yes. We partner with startups, SMEs and established organisations. The scope of every engagement is agreed to fit each organization’s size, sector, priorities and applicable local requirements.",
  },
  {
    q: "Which areas of HR do you cover?",
    a: "The complete employee lifecycle: HR strategic management, talent acquisition and workforce planning, HR policies and governance, HR operations, performance management, payroll, compensation and benefits, learning and organisational development, training, employee engagement and welfare, and employee separation and statutory settlements.",
  },
  {
    q: "How is pricing structured?",
    a: "[PLACEHOLDER] Pricing depends on the engagement option and scope. We share a clear proposal once we understand the business and the immediate challenge.",
  },
  {
    q: "Who will we work with?",
    a: "Kumaran Ilangovan, Founder & CEO and Principal Consultant, a senior HR professional with more than 14 years of experience across India and the UAE.",
  },
];

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        label="Process"
        title="How we work."
        intro="Three clear steps, so you always know what happens next and why."
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
