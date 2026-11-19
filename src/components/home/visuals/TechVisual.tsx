/**
 * TechVisual — Technology's calm placeholder: a faint CSS grid with two
 * slow scan lines drifting across it. Stage 12 replaces this export with
 * the 3D piece, so keep the name; it takes no service props today.
 */
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { durations, easings } from "@/cinema/motion/presets";
import { useStaticMode } from "../useStaticMode";

// Grid pitch is layout, not motion: 64px cells of hairline foreground.
const GRID_STYLE: CSSProperties = {
  backgroundImage:
    "linear-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.05) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

// Rest positions (percent of the container) double as the static layout;
// the animated sweep carries each line fully off both edges.
const SCAN_TOPS = ["28%", "68%"];

export function TechVisual() {
  const staticMode = useStaticMode();

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={GRID_STYLE} />
      {SCAN_TOPS.map((top, i) => (
        <motion.div
          key={top}
          className="absolute inset-0"
          animate={staticMode ? undefined : { y: ["-100%", "100%"] }}
          transition={
            staticMode
              ? undefined
              : {
                  duration: durations.drift,
                  ease: easings.smooth,
                  repeat: Infinity,
                  delay: (i * durations.drift) / 3,
                }
          }
        >
          <div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-foreground/25 to-transparent"
            style={{ top }}
          />
        </motion.div>
      ))}
      <motion.div
        className="absolute inset-0"
        animate={staticMode ? undefined : { x: ["-100%", "100%"] }}
        transition={
          staticMode
            ? undefined
            : {
                duration: durations.drift,
                ease: easings.smooth,
                repeat: Infinity,
                delay: (durations.drift * 2) / 3,
              }
        }
      >
        <div
          className="absolute inset-y-0 left-[56%] w-px bg-gradient-to-b from-transparent via-foreground/25 to-transparent"
        />
      </motion.div>
    </div>
  );
}
