import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CareersForm } from "@/components/sections/CareersForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Looking for your next role? Share your profile and resume with ClassOne Consulting, Chennai, and we'll contact you when a suitable opportunity comes up.",
  alternates: { canonical: "/careers" },
};

/* DRAFT COPY: confirm wording with ClassOne. */
const steps = [
  { title: "Share your profile", text: "Fill in your details and upload your resume." },
  { title: "We review it", text: "We match your profile against current and upcoming opportunities." },
  { title: "We get in touch", text: "If there's a suitable match, we contact you to discuss next steps." },
];

export default function CareersPage() {
  return (
    <>
      <PageHeader
        label="Careers"
        title="Find your next opportunity."
        intro="Share your profile with ClassOne. We'll review it against current and upcoming opportunities and contact you if there's a suitable match."
        crumbs={[{ label: "Careers" }]}
      />

      <section aria-labelledby="apply-title" className="py-24 md:py-32">
        <div className="container-site grid gap-16 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4">
            <p className="label mb-5 flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-red" />
              Apply
            </p>
            <h2 id="apply-title" className="display text-balance text-[clamp(2rem,4vw,3.25rem)]">
              Submit your application.
            </h2>

            <ol className="mt-10 border-t border-line">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-5 border-b border-line py-5">
                  <span className="w-7 shrink-0 font-display text-xl leading-none text-red">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-lg font-medium uppercase text-fg">{s.title}</span>
                    <span className="mt-1 block text-[15px] leading-relaxed">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-8 text-[14px] leading-relaxed text-fg-muted">
              Having trouble with the form? Email your resume to{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-fg hover:text-red-bright">
                {siteConfig.email}
              </a>
              .
            </p>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-8">
            <CareersForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
