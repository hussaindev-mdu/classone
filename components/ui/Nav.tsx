"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/lib/site-config";
import { services } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { Logo } from "./Logo";
import { ButtonLink } from "./Button";

const linkClass =
  "relative py-2 font-sans text-[12px] font-medium uppercase tracking-wide2 text-fg-body transition-colors duration-600 ease-brand after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-red after:transition-transform after:duration-600 after:ease-brand hover:text-fg hover:after:scale-x-100 aria-[current=page]:text-fg aria-[current=page]:after:scale-x-100";

function Chevron({ open, className = "h-3 w-3" }: { open: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`${className} transition-transform duration-600 ease-brand ${open ? "rotate-180" : ""}`}
    >
      <path d="M2 4.5 6 8.5l4-4" />
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Desktop "Services" dropdown
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);
  const servicesToggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  // Mobile "Services" sub-list
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hover opens the dropdown; a short delay lets the pointer travel to the panel.
  const openServices = () => {
    window.clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const closeServicesSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 150);
  };
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!servicesOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        servicesToggleRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  const closeMobile = () => {
    setOpen(false);
    setMobileServicesOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMobile();
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 transition-[background-color,border-color] duration-600 ease-brand ${
        scrolled || open || servicesOpen ? "border-b border-line bg-charcoal" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-site flex h-full items-center justify-between">
        <Link href="/" aria-label="ClassOne Consulting, home" className="relative z-10 shrink-0" onClick={closeMobile}>
          <Logo height={42} priority />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
          <ul className="flex items-center gap-8">
            {navLinks.map((l) =>
              l.href === "/services" ? (
                <li
                  key={l.href}
                  ref={servicesRef}
                  className="flex items-center gap-1.5"
                  onMouseEnter={openServices}
                  onMouseLeave={closeServicesSoon}
                >
                  <Link
                    href={l.href}
                    onClick={() => setServicesOpen(false)}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={linkClass}
                  >
                    {l.label}
                  </Link>
                  <button
                    ref={servicesToggleRef}
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-controls="services-menu"
                    aria-label={servicesOpen ? "Hide services" : "Show services"}
                    onClick={() => setServicesOpen((v) => !v)}
                    className="-m-2 flex h-8 w-8 items-center justify-center text-fg-body transition-colors duration-600 ease-brand hover:text-fg"
                  >
                    <Chevron open={servicesOpen} />
                  </button>

                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        id="services-menu"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="absolute inset-x-0 top-16 border-b border-line bg-charcoal shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
                      >
                        <div className="container-site grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-14">
                          <div className="hidden lg:block">
                            <p className="label mb-4 flex items-center gap-4">
                              <span aria-hidden className="h-px w-10 bg-red" />
                              Services
                            </p>
                            <p className="font-display text-2xl font-medium uppercase leading-tight text-fg">
                              Your complete HR consulting partner.
                            </p>
                            <Link
                              href="/services"
                              onClick={() => setServicesOpen(false)}
                              className="group mt-6 inline-flex items-center gap-3 font-sans text-[12px] font-medium uppercase tracking-wide2 text-fg hover:text-red-bright"
                            >
                              View all services
                              <span aria-hidden className="text-red-bright transition-transform duration-600 ease-brand group-hover:translate-x-1">
                                →
                              </span>
                            </Link>
                          </div>
                          <ul className="grid gap-x-8 md:grid-cols-2 xl:grid-cols-3">
                            {services.map((s, i) => (
                              <li key={s.slug} className="border-b border-line">
                                <Link
                                  href={`/services/${s.slug}`}
                                  onClick={() => setServicesOpen(false)}
                                  aria-current={pathname === `/services/${s.slug}` ? "page" : undefined}
                                  className="group flex items-baseline gap-4 py-3.5 text-[14px] leading-snug text-fg-body transition-colors duration-600 ease-brand hover:text-fg aria-[current=page]:text-fg"
                                >
                                  <span className="w-6 shrink-0 font-display text-sm text-red transition-colors duration-600 ease-brand group-hover:text-red-bright">
                                    {String(i + 1).padStart(2, "0")}
                                  </span>
                                  {s.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={linkClass}
                >
                  {l.label}
                </Link>
              </li>
              ),
            )}
          </ul>
          <ButtonLink href="/contact" arrow={false} className="!px-5 !py-2.5 !text-[13px]">
            Book a consultation
          </ButtonLink>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => (open ? closeMobile() : setOpen(true))}
        >
          <span aria-hidden className="relative block h-3 w-6">
            <span
              className={`absolute left-0 top-0 h-px w-6 bg-white transition-transform duration-600 ease-brand ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-600 ease-brand ${
                open ? "w-6 -translate-y-1.5 -rotate-45" : "w-4"
              }`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-0 top-16 z-40 flex flex-col justify-between gap-10 overflow-y-auto bg-ink px-5 pb-10 pt-10 md:hidden"
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.08 + i * 0.06 }}
                  className="border-b border-line"
                >
                  {l.href === "/services" ? (
                    <>
                      <div className="flex items-center justify-between">
                        <Link
                          href={l.href}
                          onClick={closeMobile}
                          aria-current={isActive(l.href) ? "page" : undefined}
                          className="py-4 font-display text-5xl font-semibold uppercase text-fg aria-[current=page]:text-red-bright"
                        >
                          {l.label}
                        </Link>
                        <button
                          type="button"
                          aria-expanded={mobileServicesOpen}
                          aria-controls="mobile-services"
                          aria-label={mobileServicesOpen ? "Hide services" : "Show services"}
                          onClick={() => setMobileServicesOpen((v) => !v)}
                          className="-mr-2 flex h-11 w-11 items-center justify-center text-red-bright"
                        >
                          <Chevron open={mobileServicesOpen} className="h-4 w-4" />
                        </button>
                      </div>
                      {mobileServicesOpen && (
                        <ul id="mobile-services" className="pb-4">
                          {services.map((s, si) => (
                            <li key={s.slug}>
                              <Link
                                href={`/services/${s.slug}`}
                                onClick={closeMobile}
                                aria-current={pathname === `/services/${s.slug}` ? "page" : undefined}
                                className="flex items-baseline gap-4 py-2.5 text-[15px] text-fg-body aria-[current=page]:text-fg"
                              >
                                <span className="w-6 shrink-0 font-display text-sm text-red-bright">
                                  {String(si + 1).padStart(2, "0")}
                                </span>
                                {s.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={l.href}
                      onClick={closeMobile}
                      aria-current={isActive(l.href) ? "page" : undefined}
                      className="flex items-baseline justify-between py-4 font-display text-5xl font-semibold uppercase text-fg aria-[current=page]:text-red-bright"
                    >
                      {l.label}
                      <span className="font-sans text-xs font-medium tracking-label text-red-bright">0{i + 1}</span>
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
            <ButtonLink href="/contact" onClick={closeMobile} className="w-full">
              Book a consultation
            </ButtonLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
