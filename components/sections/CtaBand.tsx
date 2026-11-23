import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/** Closing call-to-action used at the end of inner pages. */
export function CtaBand({
  title = "Let’s build better people practices.",
  text = "For HR consulting enquiries and partnership conversations, talk to ClassOne.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section aria-label="Book a consultation" className="border-t border-line py-24 md:py-32">
      <Reveal className="container-site flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label mb-5 flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-red" />
            Next step
          </p>
          <h2 className="display max-w-3xl text-balance text-[clamp(2.25rem,5vw,4.5rem)]">{title}</h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed md:text-lg">{text}</p>
        </div>
        <ButtonLink href="/contact" className="self-start md:self-auto">
          Book a consultation
        </ButtonLink>
      </Reveal>
    </section>
  );
}
