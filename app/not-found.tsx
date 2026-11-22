import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Hexagon } from "@/components/ui/Hexagon";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden pb-24 pt-36">
      <Hexagon className="pointer-events-none absolute -right-20 top-24 h-[480px] w-[440px] text-white/[0.05]" strokeWidth={1} />
      <div className="container-site relative">
        <p className="label mb-6 flex items-center gap-4">
          <span className="text-red-bright">404</span>
          <span aria-hidden className="h-px w-10 bg-red" />
          Page not found
        </p>
        <h1 className="display max-w-3xl text-balance text-[clamp(2.75rem,7vw,6rem)]">This page doesn&rsquo;t exist.</h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed md:text-lg">
          The link may be out of date. Head back to the homepage or browse our services.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <ButtonLink href="/">Back to home</ButtonLink>
          <Link href="/services" className="font-sans text-[12px] font-medium uppercase tracking-wide2 text-fg hover:text-red-bright">
            Our services →
          </Link>
        </div>
      </div>
    </section>
  );
}
