/**
 * SplitText — words (or lines) that rise in one after another on first
 * sight. The wrapper carries the full text in aria-label and every split
 * span is aria-hidden, so screen readers hear the sentence once.
 */
import { motion, type Variants } from "framer-motion";
import { useCinema } from "../core/CinemaProvider";
import { distances, durations, easings, stagger, viewport } from "./presets";

type SplitTextProps = {
  text: string;
  /** "words" splits on spaces, "lines" on newlines. */
  split?: "words" | "lines";
  /** Extra seconds before the stagger begins. */
  delay?: number;
  className?: string;
};

export function SplitText({ text, split = "words", delay = 0, className }: SplitTextProps) {
  const { reducedMotion } = useCinema();
  const items = (split === "lines" ? text.split("\n") : text.split(" "))
    .map((part) => part.trim())
    .filter(Boolean);
  const duration = reducedMotion ? 0 : durations.base;

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : split === "lines" ? stagger.base : stagger.tight,
        delayChildren: reducedMotion ? 0 : delay,
      },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: distances.rise },
    show: { opacity: 1, y: 0, transition: { duration, ease: easings.cinematic } },
  };

  return (
    <motion.span
      aria-label={text}
      className={className}
      initial={reducedMotion ? "show" : "hidden"}
      whileInView="show"
      viewport={viewport}
      variants={container}
    >
      {items.map((segment, i) => (
        <motion.span
          key={`${segment}-${i}`}
          aria-hidden="true"
          variants={item}
          className={split === "lines" ? "block" : "inline-block whitespace-pre"}
        >
          {split === "lines" || i === items.length - 1 ? segment : `${segment} `}
        </motion.span>
      ))}
    </motion.span>
  );
}
