/**
 * StepProgress — the Start Project step indicator as one filling bar: a
 * hairline track whose fill advances per step, with the existing step labels
 * beneath. Replaces the numbered circles without touching any step logic.
 */
import { motion } from "framer-motion";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { durations, easings } from "@/cinema/motion/presets";
import { cn } from "@/lib/utils";

type StepProgressProps = {
  /** Zero-based current step. */
  step: number;
  /** The page's existing steps array — labels and count both come from it. */
  labels: readonly string[];
};

export function StepProgress({ step, labels }: StepProgressProps) {
  const { reducedMotion } = useCinema();
  const ratio = (step + 1) / labels.length;

  return (
    <div className="mb-12">
      <div
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={1}
        aria-valuemax={labels.length}
        aria-valuenow={step + 1}
        className="h-1 w-full overflow-hidden rounded-full bg-border"
      >
        <motion.div
          className="h-full w-full origin-left bg-primary"
          initial={false}
          animate={{ scaleX: ratio }}
          transition={{
            duration: reducedMotion ? 0 : durations.base,
            ease: easings.cinematic,
          }}
        />
      </div>
      <div className="mt-3 hidden justify-between gap-2 sm:flex">
        {labels.map((label, i) => (
          <span
            key={label}
            className={cn(
              "text-[11px] transition-colors",
              i <= step ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
