import Link from "next/link";
import { Reveal } from "./Reveal";
import { Hexagon } from "./Hexagon";

type Crumb = { label: string; href?: string };

/** Header for inner pages: breadcrumb, label, h1 and intro. */
export function PageHeader({
  label,
  title,
  intro,
  crumbs = [],
}: {
  label: string;
  title: React.ReactNode;
  intro?: string;
  crumbs?: Crumb[];
}) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...crumbs];
  return (
    <header className="relative overflow-hidden border-b border-line pb-20 pt-36 md:pb-28 md:pt-48">
      <Hexagon
        className="pointer-events-none absolute -right-24 top-16 h-[420px] w-[390px] text-white/[0.05] md:right-[6%] md:h-[520px] md:w-[480px]"
        strokeWidth={1}
      />
      <div className="container-site relative">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex flex-wrap items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-wide2 text-fg-muted">
            {trail.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {c.href ? (
                  <Link href={c.href} className="hover:text-fg">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-fg-body">
                    {c.label}
                  </span>
                )}
                {i < trail.length - 1 && <span aria-hidden className="text-red-bright">/</span>}
              </li>
            ))}
          </ol>
        </nav>
        <Reveal>
          <p className="label mb-6 flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-red" />
            {label}
          </p>
          <h1 className="display max-w-5xl text-balance text-[clamp(2.75rem,7vw,6.5rem)]">{title}</h1>
          {intro && <p className="mt-8 max-w-2xl text-pretty text-base leading-relaxed md:text-lg">{intro}</p>}
        </Reveal>
      </div>
    </header>
  );
}
