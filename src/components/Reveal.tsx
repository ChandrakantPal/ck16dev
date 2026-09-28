"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type RevealDirection = "up" | "right";

const DIRECTION_OFFSETS: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  right: { x: -24, y: 0 },
};

interface RevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  className?: string;
}

/**
 * Scroll-triggered reveal, replacing aos.
 *
 * motion does not opt into reduced motion on its own — its default is
 * `reducedMotion: "never"` — so the preference is honoured explicitly here:
 * no travel, no duration, content simply present.
 */
const Reveal = ({ children, direction = "up", className }: RevealProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const offset = prefersReducedMotion
    ? { x: 0, y: 0 }
    : DIRECTION_OFFSETS[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
