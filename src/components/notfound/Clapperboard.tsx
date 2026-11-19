/**
 * Clapperboard — the 404 slate: a hand-built SVG clapperboard whose top bar
 * snaps shut once on arrival, like a take being called. Reduced motion (and
 * the mobile/low-power flag) shows it already closed, no movement at all.
 */
import { motion, useReducedMotion } from "framer-motion";
import { durations, easings } from "@/cinema/motion/presets";

export function Clapperboard() {
  const reducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 200 150"
      role="img"
      aria-label="A film clapperboard"
      className="mx-auto h-36 w-auto sm:h-44"
    >
      {/* Slate body */}
      <rect x="24" y="72" width="152" height="62" rx="8" className="fill-primary/10" />
      <rect
        x="24"
        y="72"
        width="152"
        height="62"
        rx="8"
        fill="none"
        className="stroke-primary/40"
        strokeWidth="2"
      />
      {/* Chalk lines on the slate */}
      <line x1="40" y1="94" x2="160" y2="94" className="stroke-primary/30" strokeWidth="2" />
      <line x1="40" y1="112" x2="160" y2="112" className="stroke-primary/30" strokeWidth="2" />

      {/* The clapper bar — hinged at the left, snaps shut once */}
      <motion.g
        style={{ transformOrigin: "24px 72px" }}
        initial={reducedMotion ? { rotate: 0 } : { rotate: -26 }}
        animate={{ rotate: 0 }}
        transition={{ duration: durations.cut, ease: easings.snap, delay: durations.fast }}
      >
        <rect x="24" y="48" width="152" height="24" rx="5" className="fill-primary/15" />
        <rect
          x="24"
          y="48"
          width="152"
          height="24"
          rx="5"
          fill="none"
          className="stroke-primary/40"
          strokeWidth="2"
        />
        {/* Diagonal stripes */}
        <g className="fill-primary/60">
          <polygon points="40,48 56,48 44,72 28,72" />
          <polygon points="72,48 88,48 76,72 60,72" />
          <polygon points="104,48 120,48 108,72 92,72" />
          <polygon points="136,48 152,48 140,72 124,72" />
          <polygon points="168,48 176,48 176,64 156,72" />
        </g>
      </motion.g>
      {/* Hinge pin */}
      <circle cx="24" cy="72" r="5" className="fill-primary/70" />
    </svg>
  );
}
