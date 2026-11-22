"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { whatsappHref } from "@/lib/site-config";
import { WhatsAppIcon } from "./Icons";

/**
 * Floating WhatsApp button. Hidden during the first 25% of the hero pin so it
 * never covers the opening frame, then fades in. On pages without the hero
 * it is always visible.
 */
export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("hero");
      const vh = window.innerHeight;
      let threshold = -1; // pages without the hero: always visible
      if (hero) {
        const top = hero.getBoundingClientRect().top + window.scrollY;
        const pin = hero.offsetHeight - vh;
        threshold = pin > 10 ? top + pin * 0.25 : top + vh * 0.25;
      }
      setVisible(window.scrollY > threshold);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 transition-[opacity,transform] duration-800 ease-brand md:bottom-8 md:right-8 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        tabIndex={visible ? 0 : -1}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform duration-600 ease-brand hover:scale-[1.06] focus-visible:outline-white"
      >
        <WhatsAppIcon className="h-7 w-7" />
        <span
          role="tooltip"
          className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 translate-x-1 whitespace-nowrap bg-charcoal px-3 py-2 font-sans text-xs font-medium uppercase tracking-wide2 text-fg opacity-0 transition-[opacity,transform] duration-600 ease-brand group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block"
        >
          Chat with us
        </span>
      </a>
    </div>
  );
}
