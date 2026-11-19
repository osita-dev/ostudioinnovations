/**
 * IrisLayer — the match cut between service scenes: the incoming scene's
 * background opens through a circular clip-path scrubbed by scroll (the
 * clip-path exception the stage tasks for). Static mode — reduced motion
 * or touch under 768px — swaps the scrub for a plain fade.
 */
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { durations, easings, viewport } from "@/cinema/motion/presets";
import { cn } from "@/lib/utils";
import { useStaticMode } from "./useStaticMode";

gsap.registerPlugin(ScrollTrigger);

type IrisLayerProps = {
  children: ReactNode;
  className?: string;
};

// circle() percentages resolve against sqrt(w²+h²)/√2, so 100% from the
// center always covers the corners of any viewport.
const IRIS_FROM = "circle(0% at 50% 50%)";
const IRIS_TO = "circle(100% at 50% 50%)";

export function IrisLayer({ children, className }: IrisLayerProps) {
  const staticMode = useStaticMode();
  const { reducedMotion } = useCinema();
  const ref = useRef<HTMLDivElement>(null);

  // Scrub the iris open as the scene's top travels from the viewport
  // bottom to the top — the background is fully revealed on arrival.
  useLayoutEffect(() => {
    if (staticMode) return;
    const node = ref.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { clipPath: IRIS_FROM },
        {
          clipPath: IRIS_TO,
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        }
      );
    }, node);
    return () => ctx.revert();
  }, [staticMode]);

  if (staticMode) {
    return (
      <motion.div
        className={cn("absolute inset-0", className)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewport}
        transition={{
          duration: reducedMotion ? durations.reduced : durations.base,
          ease: easings.cinematic,
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div ref={ref} className={cn("absolute inset-0", className)}>
      {children}
    </div>
  );
}
