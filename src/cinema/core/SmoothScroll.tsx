/**
 * SmoothScroll — one Lenis instance for the whole site, driven by GSAP's
 * ticker and wired into ScrollTrigger so scrolling and scrubbing share a
 * single clock. The instance lives in a ref (null under reduced motion)
 * and is reached through useLenis().
 */
import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCinema } from "./CinemaProvider";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const { reducedMotion } = useCinema();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      lenisRef.current = null; // native scroll under reduced motion
      return;
    }

    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });

    const onScroll = () => ScrollTrigger.update();
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", onScroll);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenisRef.current = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components -- provider + its hook belong in one file
export function useLenis(): RefObject<Lenis | null> {
  const ref = useContext(LenisContext);
  if (!ref) throw new Error("useLenis must be used inside <SmoothScroll>");
  return ref;
}
