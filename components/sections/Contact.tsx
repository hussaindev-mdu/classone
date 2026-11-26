import { siteConfig, whatsappHref, addressLine } from "@/lib/site-config";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";

export function Contact({ index = "07", headingLevel = "h2" }: { index?: string; headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel;
  return (
    <section id="contact" aria-labelledby="contact-title" className="py-28 md:py-40">
      <div className="container-site grid gap-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <p className="label mb-5 flex items-center gap-4">
            {index && <span className="text-red-bright">{index}</span>}
            <span aria-hidden className="h-px w-10 bg-red" />
            Contact
          </p>
          <Heading id="contact-title" className="display text-balance text-[clamp(2.5rem,5.5vw,4.75rem)]">
            Book a consultation.
          </Heading>
          <p className="mt-6 max-w-md text-base leading-relaxed md:text-lg">
            For HR consulting enquiries and partnership conversations, tell us where your business is today.
          </p>

          <dl className="mt-12 grid gap-6 border-t border-line pt-8 text-[15px]">
            <div>
              <dt className="label mb-1.5">Call</dt>
              <dd>
                <a href={`tel:${siteConfig.phone.tel}`} className="text-fg hover:text-red-bright">
                  {siteConfig.phone.display}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label mb-1.5">Email</dt>
              <dd>
                <a href={`mailto:${siteConfig.email}`} className="block text-fg hover:text-red-bright">
                  {siteConfig.email}
                </a>
                <a href={`mailto:${siteConfig.founderEmail}`} className="mt-1 block text-fg hover:text-red-bright">
                  {siteConfig.founderEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label mb-1.5">WhatsApp</dt>
              <dd>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-fg hover:text-red-bright">
                  Message us on WhatsApp
                </a>
              </dd>
            </div>
            <div>
              <dt className="label mb-1.5">Office</dt>
              <dd>
                {addressLine}
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
