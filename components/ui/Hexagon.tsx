/** Thin hexagon outline echoing the C1 mark. Used sparingly as a marker. */
export function Hexagon({ className = "", strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 24 26" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
      <path d="M12 1.2 22.5 7.1v11.8L12 24.8 1.5 18.9V7.1Z" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
