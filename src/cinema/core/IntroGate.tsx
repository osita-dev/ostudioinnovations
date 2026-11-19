/**
 * IntroGate — the "take your seat" entrance on the first visit of a session
 * to "/": curtains part into a 3-2-1 leader, then the cinema opens. It skips
 * itself under reduced motion, locks scroll, traps focus and always offers Skip.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCinema } from "./CinemaProvider";
import { durations, easings } from "../motion/presets";

const STORAGE_KEY = "ostudio.intro";

export const IntroGate = () => {
  const { reducedMotion, introDone, setIntroDone } = useCinema();
  const location = useLocation();
  const [seen] = useState(() => sessionStorage.getItem(STORAGE_KEY) !== null);
  const [phase, setPhase] = useState<"gate" | "open">("gate");
  const [count, setCount] = useState(3);
  const seatRef = useRef<HTMLButtonElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const timersRef = useRef<number[]>([]);

  const onHome = location.pathname === "/";
  const visible = onHome && !introDone && !seen && !reducedMotion;

  const dismiss = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setIntroDone(true);
  }, [setIntroDone]);

  // Reduced motion, already seen, or entering on another route: intro over now.
  useEffect(() => {
    if (!introDone && (reducedMotion || !onHome || seen)) dismiss();
  }, [introDone, reducedMotion, onHome, seen, dismiss]);

  // Lock body scroll while the gate is up.
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  // Focus management: seat button first, Tab trapped until the countdown
  // starts, then focus moves to the only remaining control — Skip.
  useEffect(() => {
    if (!visible) return;
    if (phase === "open") {
      skipRef.current?.focus();
      return;
    }
    seatRef.current?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      event.preventDefault();
      const current = document.activeElement;
      const next = current === seatRef.current ? skipRef.current : seatRef.current;
      next?.focus();
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [visible, phase]);

  // Clear any pending countdown timers on unmount.
  useEffect(() => () => timersRef.current.forEach((id) => window.clearTimeout(id)), []);

  const takeSeat = () => {
    setPhase("open");
    setCount(3);
    const beat = durations.intro / 3;
    let remaining = 3;
    const tick = () => {
      remaining -= 1;
      if (remaining <= 0) {
        dismiss();
        return;
      }
      setCount(remaining);
      timersRef.current.push(window.setTimeout(tick, beat));
    };
    timersRef.current.push(window.setTimeout(tick, beat));
  };

  if (!visible) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Welcome" className="fixed inset-0 z-[100]">
      {/* Curtain halves — they part when the visitor takes their seat. */}
      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/2 bg-background"
        initial={false}
        animate={{ x: phase === "gate" ? "0%" : "-100%" }}
        transition={{ duration: durations.cut, ease: easings.cinematic }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2 bg-background"
        initial={false}
        animate={{ x: phase === "gate" ? "0%" : "100%" }}
        transition={{ duration: durations.cut, ease: easings.cinematic }}
      />

      <div className="relative flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
        <AnimatePresence>
          {phase === "gate" && (
            <motion.div
              key="gate"
              className="flex flex-col items-center gap-6"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: durations.fast } }}
            >
              <img
                src="/OstudioInnovation.svg"
                alt="O Studio Innovations"
                className="h-16 w-auto sm:h-20"
              />
              <Button ref={seatRef} onClick={takeSeat}>
                Take your seat
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "open" && (
          <motion.span
            key={count}
            className="text-7xl font-semibold tabular-nums text-foreground"
            initial={{ opacity: 0, scale: 1.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: durations.fast, ease: easings.cinematic }}
          >
            {count}
          </motion.span>
        )}

        <Button
          ref={skipRef}
          variant="outline"
          size="sm"
          className="absolute bottom-8 rounded-full"
          onClick={dismiss}
        >
          Skip
        </Button>
      </div>
    </div>
  );
};
