/**
 * Scrubber — the thin progress line pinned to the bottom of the viewport:
 * white at 70% filling a white-10% track as the page scrolls. It stays
 * visible under reduced motion, where it acts as a static indicator.
 */
import { motion, useScroll } from "framer-motion";

export const Scrubber = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div aria-hidden className="fixed inset-x-0 bottom-0 z-[65] h-[2px] bg-white/10">
      <motion.div className="h-full origin-left bg-white/70" style={{ scaleX: scrollYProgress }} />
    </div>
  );
};
