/**
 * useWebGL — gate for the 3D layer: whether WebGL exists at all, and
 * whether 3D may run (not reduced motion, not low power, not a phone-width
 * viewport under 768px, WebGL available). Weak devices stay on the static
 * visual, so the ring can never hurt the rest of the site.
 */
import { useEffect, useState } from "react";
import { useCinema } from "@/cinema/core/CinemaProvider";

const NARROW = "(max-width: 767px)";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export type WebGLGate = {
  /** WebGL context creation succeeds on this device. */
  webgl: boolean;
  /** 3D is allowed: WebGL + no reduced motion + not low power + not phone width. */
  allow3D: boolean;
};

export function useWebGL(): WebGLGate {
  const { reducedMotion, isLowPower } = useCinema();
  const [webgl] = useState(detectWebGL);
  const [narrow, setNarrow] = useState(
    () => window.matchMedia(NARROW).matches
  );

  // Follow resizes live so rotating a device re-evaluates the gate.
  useEffect(() => {
    const query = window.matchMedia(NARROW);
    const sync = () => setNarrow(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const allow3D = webgl && !reducedMotion && !isLowPower && !narrow;
  return { webgl, allow3D };
}
