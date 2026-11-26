import Link from "next/link";
import { siteConfig, navLinks, addressLine } from "@/lib/site-config";
import { allServices } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/Icons";

export function Footer() {
  const year = new Date().getFullYear();
  const reg = siteConfig.registration;
  return (
    <footer className="border-t border-line bg-charcoal">
      <div className="container-site grid gap-10 py-12 md:grid-cols-12 md:gap-8 md:py-14">
        {/* Brand + contact */}
        <div className="md:col-span-4">
          <Link href="/" aria-label="ClassOne Consulting, home" className="inline-block">
            <Logo height={40} />
          </Link>
          <p className="label mt-5 !text-fg-body">{siteConfig.tagline}</p>
          <ul className="mt-6 space-y-2 text-[14px]">
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
            <li>
              <a href={`mailto:${siteConfig.founderEmail}`} className="hover:text-fg">
                {siteConfig.founderEmail}
              </a>
            </li>
          </ul>
          <div className="mt-5 flex gap-3">
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ClassOne on LinkedIn"
              className="cut-corner flex h-10 w-10 items-center justify-center bg-white/[0.06] text-fg transition-colors duration-600 ease-brand hover:bg-red"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ClassOne on Instagram"
              className="cut-corner flex h-10 w-10 items-center justify-center bg-white/[0.06] text-fg transition-colors duration-600 ease-brand hover:bg-red"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="label mb-4 !text-fg">Quick links</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] md:block md:space-y-2">
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

        <div className="md:col-span-6">
          <h2 className="label mb-4 !text-fg">Services</h2>
          <ul className="grid gap-x-8 gap-y-2 text-[14px] sm:grid-cols-2">
            {allServices.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-fg">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-3 py-5 text-xs text-fg-muted">
          <dl className="flex flex-col gap-x-8 gap-y-2 sm:flex-row sm:flex-wrap">
            <div className="flex gap-2">
              <dt className="uppercase tracking-wide2 text-fg-body">CIN</dt>
              <dd className="tabular-nums">{reg.cin}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="uppercase tracking-wide2 text-fg-body">GSTIN</dt>
              <dd className="tabular-nums">{reg.gstin}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="uppercase tracking-wide2 text-fg-body">Registered office</dt>
              <dd>{addressLine}</dd>
            </div>
          </dl>
          <div className="flex flex-col gap-2 border-t border-line pt-3 md:flex-row md:justify-between">
            <p>© {year} {siteConfig.legalName}. All rights reserved.</p>
            <p className="uppercase tracking-wide2">People | Performance | Progress</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
