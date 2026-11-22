"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Fade-up on first entry into view. Transforms are dropped under reduced motion (MotionConfig). */
export function Reveal({ delay = 0, y = 28, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: DURATION, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
