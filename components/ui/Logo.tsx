import Image from "next/image";
import { withBase } from "@/lib/base-path";

/** Full ClassOne lockup from /public/logo.png (827x242). */
export function Logo({ height = 36, priority = false, className = "" }: { height?: number; priority?: boolean; className?: string }) {
  const width = Math.round((height * 827) / 242);
  return (
    <Image
      src={withBase("/logo.png")}
      alt="ClassOne Consulting"
      width={width}
      height={height}
      priority={priority}
      sizes={`${width}px`}
      className={className}
    />
  );
}
