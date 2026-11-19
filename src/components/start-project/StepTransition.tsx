/**
 * StepTransition — the direction-aware slide-and-fade between form steps:
 * forward steps enter from the right, backward from the left, and mode="wait"
 * keeps exactly one step on stage. Reduced motion collapses it to a swap.
 */
import type { ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { distances, durations, easings } from "@/cinema/motion/presets";

type StepTransitionProps = {
  step: number;
  direction: 1 | -1;
  children: ReactNode;
};

export function StepTransition({ step, direction, children }: StepTransitionProps) {
  const { reducedMotion } = useCinema();
  const slide = reducedMotion ? 0 : distances.rise;
  const duration = reducedMotion ? 0 : durations.fast;

  // Function variants so AnimatePresence's custom can re-resolve the exit
  // direction while the old step is still on its way out.
  const variants: Variants = {
    enter: (d: number) => ({ opacity: 0, x: d * slide }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -slide }),
  };

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={step}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration, ease: easings.cinematic }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
