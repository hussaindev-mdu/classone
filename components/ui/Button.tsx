import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline";

const base =
  "cut-corner group inline-flex items-center justify-center gap-3 px-6 py-3.5 font-display text-[15px] font-medium uppercase tracking-[0.14em] transition-[background-color,color,transform] duration-600 ease-brand focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-red text-white hover:bg-red-deep",
  outline: "bg-white/[0.06] text-fg hover:bg-white/[0.12]",
};

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 transition-transform duration-600 ease-brand group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M1 8h13M9 3l5 5-5 5" />
    </svg>
  );
}

type LinkProps = { href: string; variant?: Variant; arrow?: boolean; children: ReactNode; className?: string } & Omit<
  ComponentProps<typeof Link>,
  "href" | "className" | "children"
>;

export function ButtonLink({ href, variant = "primary", arrow = true, className = "", children, ...rest }: LinkProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

type BtnProps = { variant?: Variant; arrow?: boolean } & ComponentProps<"button">;

export function Button({ variant = "primary", arrow = false, className = "", children, ...rest }: BtnProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
