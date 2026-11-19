/**
 * Cursor — desktop-only companion ring that springs toward the pointer and
 * grows into a labelled bubble over [data-cursor] targets. The native cursor
 * stays visible; the ring hides on touch, coarse pointers, reduced motion,
 * and over form fields.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useCinema } from "./CinemaProvider";
import { durations, easings, springs } from "../motion/presets";

const LABELS = ["view", "play", "drag"];

export const Cursor = () => {
  const { isTouch, reducedMotion } = useCinema();
  const [finePointer] = useState(() => window.matchMedia("(pointer: fine)").matches);
  const [label, setLabel] = useState<string | null>(null);
  const [overField, setOverField] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, springs.cursor);
  const springY = useSpring(y, springs.cursor);

  const enabled = finePointer && !isTouch && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement | null;
      const inField = Boolean(target?.closest("input, textarea, select, [contenteditable='true']"));
      const holder = target?.closest<HTMLElement>("[data-cursor]");
      const raw = holder?.dataset.cursor ?? null;
      const next = raw && LABELS.includes(raw) ? raw : null;
      setOverField((was) => (was === inField ? was : inField));
      setLabel((was) => (was === next ? was : next)); // unchanged value = no re-render
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      className="pointer-events-none fixed left-0 top-0 z-[110]"
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="flex items-center justify-center rounded-full border border-white/60 bg-white/5 backdrop-blur-sm"
          animate={{
            width: label && !overField ? 72 : 28,
            height: label && !overField ? 72 : 28,
            opacity: overField ? 0 : 1,
          }}
          transition={{ duration: durations.fast, ease: easings.snap }}
        >
          <AnimatePresence>
            {label && !overField && (
              <motion.span
                className="text-[10px] font-medium uppercase tracking-widest-plus text-foreground"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: durations.fast, ease: easings.snap }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};
