"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/lib/site-config";
import { EASE } from "@/lib/motion";
import { Logo } from "./Logo";
import { ButtonLink } from "./Button";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
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
        scrolled || open ? "border-b border-line bg-charcoal" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-site flex h-full items-center justify-between">
        <Link href="/" aria-label="ClassOne Consulting, home" className="relative z-10 shrink-0" onClick={() => setOpen(false)}>
          <Logo height={34} priority />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
          <ul className="flex items-center gap-8">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className="relative py-2 font-sans text-[12px] font-medium uppercase tracking-wide2 text-fg-body transition-colors duration-600 ease-brand after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-red after:transition-transform after:duration-600 after:ease-brand hover:text-fg hover:after:scale-x-100 aria-[current=page]:text-fg aria-[current=page]:after:scale-x-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
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
          onClick={() => setOpen((v) => !v)}
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
            className="fixed inset-0 top-16 z-40 flex flex-col justify-between bg-ink px-5 pb-10 pt-10 md:hidden"
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
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className="flex items-baseline justify-between py-4 font-display text-5xl font-semibold uppercase text-fg aria-[current=page]:text-red-bright"
                  >
                    {l.label}
                    <span className="font-sans text-xs font-medium tracking-label text-red-bright">0{i + 1}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <ButtonLink href="/contact" onClick={() => setOpen(false)} className="w-full">
              Book a consultation
            </ButtonLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
