/**
 * useStaticMode — the shared "keep it still" flag for the Home service
 * scenes: reduced motion, or a touch screen under 768px. Iris transitions
 * become plain fades and every visual renders its static fallback there.
 */
import { useEffect, useState } from "react";
import { useCinema } from "@/cinema/core/CinemaProvider";

const NARROW = "(max-width: 767px)";

export function useStaticMode(): boolean {
  const { reducedMotion, isTouch } = useCinema();
  const [narrow, setNarrow] = useState(
    () => window.matchMedia(NARROW).matches
  );

  // Follow resizes live so rotating a device re-evaluates the mode.
  useEffect(() => {
    const query = window.matchMedia(NARROW);
    const sync = () => setNarrow(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reducedMotion || (isTouch && narrow);
}
