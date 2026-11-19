/**
 * NextTeaser — the quiet "Next: …" line at the foot of a scene; the arrow
 * drifts down, and clicking scrolls to the next scene through Lenis (or
 * native smooth scroll when Lenis is off under reduced motion).
 */
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useCinema } from "../core/CinemaProvider";
import { useLenis } from "../core/SmoothScroll";
import { distances, durations, easings } from "../motion/presets";

export type NextTeaserProps = {
  label: string;
  targetId: string;
};

export function NextTeaser({ label, targetId }: NextTeaserProps) {
  const { reducedMotion } = useCinema();
  const lenisRef = useLenis();

  const goToNext = () => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target);
    } else {
      target.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
    }
  };

  return (
    <button
      type="button"
      onClick={goToNext}
      className="group inline-flex items-center gap-3 rounded-full border border-border px-5 py-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="tracking-widest-plus text-foreground/60 transition-colors group-hover:text-foreground">
        Next: {label}
      </span>
      <motion.span
        aria-hidden="true"
        className="text-foreground/80 transition-colors group-hover:text-foreground"
        animate={reducedMotion ? undefined : { y: [0, distances.rise / 2, 0] }}
        transition={{ duration: durations.drift, ease: easings.smooth, repeat: Infinity }}
      >
        <ArrowDown size={14} />
      </motion.span>
    </button>
  );
}
