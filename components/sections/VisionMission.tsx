import { vision, mission } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function VisionMission() {
  const items = [
    { label: "Vision", text: vision },
    { label: "Mission", text: mission },
  ];
  return (
    <section aria-label="Vision and mission" className="border-y border-line bg-charcoal">
      <div className="container-site grid md:grid-cols-2">
        {items.map((item, i) => (
          <Reveal
            key={item.label}
            delay={i * 0.1}
            className={`py-16 md:py-24 ${i === 1 ? "border-t border-line md:border-l md:border-t-0 md:pl-14 lg:pl-20" : "md:pr-14 lg:pr-20"}`}
          >
            <h2 className="label mb-6 flex items-center gap-4 !text-red-bright">
              <span aria-hidden className="h-px w-10 bg-red" />
              {item.label}
            </h2>
            <p className="text-pretty font-display text-[clamp(1.4rem,2.4vw,2rem)] font-normal leading-[1.3] text-fg">
              {item.text}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
