import { processSteps } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Hexagon } from "@/components/ui/Hexagon";

export function Process({ index = "04", header = true }: { index?: string; header?: boolean }) {
  // Without the section heading (on /process) steps sit directly under the page h1.
  const StepHeading = header ? "h3" : "h2";
  return (
    <section id="process" aria-labelledby={header ? "process-title" : undefined} aria-label={header ? undefined : "Our five-step process"} className="py-28 md:py-40">
      <div className="container-site">
        {header && (
        <SectionHeader
          id="process-title"
          index={index}
          label="Process"
          title="How we work."
          intro="A clear five-step method, so you always know what happens next and why."
        />
        )}

        <ol className="relative grid gap-10 md:grid-cols-5 md:gap-6">
          {/* Connecting rule: vertical on mobile, horizontal on desktop */}
          <span aria-hidden className="absolute bottom-2 left-[13px] top-2 w-px bg-line md:bottom-auto md:left-0 md:right-0 md:top-[14px] md:h-px md:w-auto" />
          {processSteps.map((step, i) => (
            <li key={step.title} className="relative pl-12 md:pl-0">
              <Reveal delay={i * 0.1}>
                <div className="absolute left-0 top-0 flex h-[28px] w-[28px] items-center justify-center bg-ink text-red md:relative md:mb-8">
                  <Hexagon className="absolute inset-0 h-full w-full" />
                  <span className="relative h-1.5 w-1.5 bg-red" />
                </div>
                <p className="label mb-3 !text-red-bright">Step {String(i + 1).padStart(2, "0")}</p>
                <StepHeading className="font-display text-2xl font-medium uppercase text-fg md:text-[26px]">{step.title}</StepHeading>
                <p className="mt-3 max-w-xs text-[15px] leading-relaxed">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
