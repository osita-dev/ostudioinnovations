/**
 * SuccessScene — the shared ending for both forms: an animated checkmark,
 * the fixed heading, the form's own success line and its action buttons.
 * Used by StartProject and StudioRental so the finish reads the same film.
 */
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { durations, easings } from "@/cinema/motion/presets";

type SuccessSceneProps = {
  /** The form's existing success copy, composed by the page. */
  message: ReactNode;
  /** The form's existing action buttons. */
  actions: ReactNode;
};

export function SuccessScene({ message, actions }: SuccessSceneProps) {
  const { reducedMotion } = useCinema();
  const beat = (delay: number) => ({
    duration: reducedMotion ? 0 : durations.base,
    delay: reducedMotion ? 0 : delay,
    ease: easings.cinematic,
  });

  return (
    <div className="container py-28 max-w-xl text-center">
      <motion.div
        initial={reducedMotion ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={beat(0)}
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15"
      >
        <motion.span
          initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={beat(0.2)}
          className="flex"
        >
          <Check className="text-primary" size={28} strokeWidth={2.5} />
        </motion.span>
      </motion.div>
      <h1 className="font-serif-display text-3xl sm:text-4xl mb-4">We have your request</h1>
      <p className="text-muted-foreground leading-relaxed mb-8">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">{actions}</div>
    </div>
  );
}
