/**
 * useParallax — returns a ref plus a y MotionValue that drifts the
 * attached layer from +80px to -80px across the element's scroll span.
 * Flat (0) under reduced motion so the layer never moves on its own.
 */
import { useRef, type RefObject } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";
import { useCinema } from "../core/CinemaProvider";
import { distances } from "./presets";

type ParallaxHandle<T> = {
  ref: RefObject<T | null>;
  y: MotionValue<number>;
};

// stable array identities so the interpolation is only rebuilt when the
// reduced-motion flag actually flips
const SCROLL_RANGE: number[] = [0, 1];
const FULL_RANGE: number[] = [distances.parallax, -distances.parallax];
const FLAT_RANGE: number[] = [0, 0];

export function useParallax<T extends HTMLElement = HTMLDivElement>(): ParallaxHandle<T> {
  const { reducedMotion } = useCinema();
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, SCROLL_RANGE, reducedMotion ? FLAT_RANGE : FULL_RANGE);

  return { ref, y };
}
