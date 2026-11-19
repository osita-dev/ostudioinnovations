/**
 * PageTransition — the film cut between routes: a curtain covers the screen,
 * the outlet swaps underneath (the exiting page stays mounted until the
 * curtain fully covers), then it uncovers. Reduced motion and 'expand' mode
 * fall back to a plain fade; scroll resets while the screen is covered.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";
import { useCinema } from "./CinemaProvider";
import { useLenis } from "./SmoothScroll";
import { durations, easings } from "../motion/presets";

type Phase = "idle" | "cover" | "uncover";

export const PageTransition = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const { reducedMotion, transitionMode } = useCinema();
  const lenisRef = useLenis();

  const curtain = !reducedMotion && transitionMode === "curtain";
  const fade = reducedMotion ? durations.reduced : durations.fast;

  const [phase, setPhase] = useState<Phase>("idle");
  const [prevPath, setPrevPath] = useState(location.pathname);
  const firstRun = useRef(true);

  const resetScroll = useCallback(() => {
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [lenisRef]);

  // Detect navigation during render (React's adjust-state pattern): start the
  // curtain covering while the old page begins its exit, in the same commit.
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    if (curtain) setPhase("cover");
  }
  // If reduced motion turns on mid-cut, park the curtain immediately.
  if (!curtain && phase !== "idle") setPhase("idle");

  // Initial load always resets, as SiteLayout did. Later resets are instant
  // in fade modes; curtain mode resets while covered (see handleExitComplete).
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      resetScroll();
      return;
    }
    if (!curtain) resetScroll();
  }, [location.pathname, curtain, resetScroll]);

  // The exit finished: the curtain fully covers, so reset scroll underneath
  // and uncover — the new page fades in as the curtain rises away.
  const handleExitComplete = () => {
    if (!curtain) return;
    resetScroll();
    setPhase("uncover");
  };

  // Park the curtain off-screen again (instant, so it never sweeps back).
  useEffect(() => {
    if (phase !== "uncover") return;
    const timer = window.setTimeout(() => setPhase("idle"), durations.cut * 1000);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const curtainTarget = phase === "cover" ? "0%" : phase === "uncover" ? "-100%" : "100%";

  return (
    <>
      <AnimatePresence mode="wait" initial={false} onExitComplete={handleExitComplete}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: curtain ? durations.cut : fade } }}
          transition={{ duration: curtain ? durations.cut : fade, ease: easings.smooth }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>

      {/* The curtain: rises bottom-to-top, continues off the top, then parks
          instantly below the viewport so the next cut starts from the bottom. */}
      <motion.div
        aria-hidden
        className={`fixed inset-0 z-[80] bg-background ${phase === "idle" ? "pointer-events-none" : ""}`}
        initial={{ y: "100%" }}
        animate={{ y: curtainTarget }}
        transition={
          phase === "idle" ? { duration: 0 } : { duration: durations.cut, ease: easings.cinematic }
        }
      />
    </>
  );
};
