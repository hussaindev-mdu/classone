import { Reveal } from "./Reveal";

export function SectionHeader({
  index,
  label,
  title,
  intro,
  id,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  intro?: string;
  id?: string;
}) {
  return (
    <Reveal className="mb-14 md:mb-20">
      <p className="label mb-5 flex items-center gap-4">
        <span className="text-red-bright">{index}</span>
        <span aria-hidden className="h-px w-10 bg-red" />
        <span>{label}</span>
      </p>
      <h2 id={id} className="display text-balance text-[clamp(2.25rem,5vw,4.25rem)]">
        {title}
      </h2>
      {intro && <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed md:text-lg">{intro}</p>}
    </Reveal>
  );
}
