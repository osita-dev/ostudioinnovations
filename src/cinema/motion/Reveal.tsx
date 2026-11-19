/**
 * Reveal — the shared fade-and-rise entrance: content lifts into place the
 * first time it enters the viewport (once), with an optional delay. `as`
 * picks the element so sections and list items keep their semantics.
 */
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useCinema } from "../core/CinemaProvider";
import { distances, durations, easings, viewport } from "./presets";

type RevealTag = "div" | "section" | "span" | "li" | "p" | "figure";

type RevealProps = {
  children: ReactNode;
  /** Extra seconds before the reveal starts. */
  delay?: number;
  as?: RevealTag;
  className?: string;
};

const tags = {
  div: motion.div,
  section: motion.section,
  span: motion.span,
  li: motion.li,
  p: motion.p,
  figure: motion.figure,
};

export function Reveal({ children, delay = 0, as = "div", className }: RevealProps) {
  const { reducedMotion } = useCinema();
  const Component = tags[as];
  const duration = reducedMotion ? 0 : durations.base;

  return (
    <Component
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: distances.rise }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration, delay: reducedMotion ? 0 : delay, ease: easings.cinematic }}
    >
      {children}
    </Component>
  );
}
