import Link from "next/link";
import { siteConfig, navLinks } from "@/lib/site-config";
import { allServices } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/Icons";

export function Footer() {
  const year = new Date().getFullYear();
  const { address } = siteConfig;
  return (
    <footer className="border-t border-line bg-charcoal">
      <div className="container-site grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Link href="/" aria-label="ClassOne Consulting, home" className="inline-block">
            <Logo height={44} />
          </Link>
          <p className="label mt-6 !text-fg-body">{siteConfig.tagline}</p>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed">
            {address.street}, {address.locality}, {address.region} {address.postalCode}
          </p>
        </div>

        <div className="md:col-span-2">
          <h2 className="label mb-5 !text-fg">Quick links</h2>
          <ul className="space-y-3 text-[15px]">
            <li>
              <Link href="/" className="hover:text-fg">
                Home
              </Link>
            </li>
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="label mb-5 !text-fg">Services</h2>
          <ul className="space-y-3 text-[15px]">
            {allServices.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-fg">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="label mb-5 !text-fg">Get in touch</h2>
          <ul className="space-y-3 text-[15px]">
            <li>
              <a href={`tel:${siteConfig.phone.tel}`} className="hover:text-fg">
                {siteConfig.phone.display}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-fg">
                {siteConfig.email}
              </a>
            </li>
          </ul>
          <div className="mt-6 flex gap-3">
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ClassOne on LinkedIn"
              className="cut-corner flex h-11 w-11 items-center justify-center bg-white/[0.06] text-fg transition-colors duration-600 ease-brand hover:bg-red"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ClassOne on Instagram"
              className="cut-corner flex h-11 w-11 items-center justify-center bg-white/[0.06] text-fg transition-colors duration-600 ease-brand hover:bg-red"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-fg-muted md:flex-row md:justify-between">
          <p>© {year} ClassOne Consulting. All rights reserved.</p>
          <p className="uppercase tracking-wide2">HR Consulting | Financial Advisory</p>
        </div>
      </div>
    </footer>
  );
}
