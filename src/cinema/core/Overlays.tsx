/**
 * Overlays — film atmosphere pieces: the grain that sits over everything,
 * the letterbox bars for scenes, and the drifting projector beam. All are
 * pointer-transparent and become static under reduced motion.
 */
import { motion, type Transition } from "framer-motion";
import { useCinema } from "./CinemaProvider";
import { durations, easings } from "../motion/presets";

/** Full-screen SVG noise at 4% opacity; steps-animated, static when reduced. */
export const FilmGrain = () => {
  const { reducedMotion } = useCinema();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] overflow-hidden opacity-[0.04]">
      <style>{`
        @keyframes ostudio-grain {
          0% { transform: translate3d(0, 0, 0); }
          25% { transform: translate3d(-4%, 6%, 0); }
          50% { transform: translate3d(6%, -4%, 0); }
          75% { transform: translate3d(-6%, -6%, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .ostudio-grain {
          animation: ostudio-grain ${durations.base}s steps(4) infinite;
        }
      `}</style>
      <svg className={`absolute left-[-10%] top-[-10%] h-[120%] w-[120%] ${reducedMotion ? "" : "ostudio-grain"}`}>
        <filter id="ostudio-grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ostudio-grain-filter)" />
      </svg>
    </div>
  );
};

/** Two cinema bars (top and bottom) whose height follows the `open` prop. */
export const Letterbox = ({ open }: { open: boolean }) => {
  const { reducedMotion } = useCinema();
  const transition: Transition = reducedMotion
    ? { duration: 0 }
    : { duration: durations.base, ease: easings.cinematic };
  const height = open ? "10vh" : "0vh";

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[85] bg-background"
        initial={false}
        animate={{ height }}
        transition={transition}
      />
      <motion.div
        aria-hidden
        className="fixed inset-x-0 bottom-0 z-[85] bg-background"
        initial={false}
        animate={{ height }}
        transition={transition}
      />
    </>
  );
};

/** Soft diagonal light that drifts slowly — atmosphere behind scenes. */
export const ProjectorBeam = () => {
  const { reducedMotion } = useCinema();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-[-20%] h-[140%] w-[55%] -translate-x-1/2 rotate-12">
        <motion.div
          className="h-full w-full bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-3xl"
          initial={{ opacity: 0.8, x: 0 }}
          animate={
            reducedMotion
              ? { opacity: 0.8, x: 0 }
              : { x: ["-6%", "6%", "-6%"], opacity: [0.7, 1, 0.7] }
          }
          transition={{
            duration: durations.drift,
            repeat: reducedMotion ? 0 : Infinity,
            ease: easings.smooth,
          }}
        />
      </div>
    </div>
  );
};
