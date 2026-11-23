import { services } from "@/lib/content";

/**
 * Mobile only: the service labels baked into the final frame are too small to
 * read on phones, so list the services directly below the hero.
 */
export function MobileServicesList() {
  const groups = [{ title: "HR Consulting", items: services, offset: 0 }];
  return (
    <section aria-label="Our HR services" className="border-y border-line bg-charcoal md:hidden">
      <div className="container-site grid gap-8 py-10">
        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="label mb-3 !text-fg">{g.title}</h2>
            <ul>
              {g.items.map((s, i) => (
                <li key={s.name} className="flex items-baseline gap-4 border-b border-line py-3 last:border-0">
                  <span className="font-display text-sm text-red-bright">{String(g.offset + i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-lg uppercase tracking-[0.02em] text-fg">{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
