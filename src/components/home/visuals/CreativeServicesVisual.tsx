/**
 * CreativeServicesVisual — three brand-piece cards floating on gentle,
 * phase-offset bobs, each wrapped in TiltCard for pointer depth (touch
 * and reduced motion stay flat by TiltCard's own guard). Static mode
 * holds the cards still.
 */
import { motion } from "framer-motion";
import { TiltCard } from "@/cinema/motion/TiltCard";
import { distances, durations, easings } from "@/cinema/motion/presets";
import { posterFor, relatedGalleryImages } from "../sceneMedia";
import { useStaticMode } from "../useStaticMode";
import type { VisualProps } from "../serviceScenes.config";

const CARDS = 3;

export function CreativeServicesVisual({ service }: VisualProps) {
  const staticMode = useStaticMode();
  const images = relatedGalleryImages(service);
  const srcAt = (i: number) =>
    images.length > 0 ? images[i % images.length] : posterFor(service);

  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center gap-4 px-6 sm:gap-8"
    >
      {Array.from({ length: CARDS }, (_, i) => (
        <TiltCard
          key={i}
          className="w-[26%] max-w-[260px] overflow-hidden rounded-xl border border-border"
        >
          <motion.div
            className="aspect-[4/5]"
            initial={{ y: 0 }}
            animate={staticMode ? undefined : { y: [0, -distances.rise / 2, 0] }}
            transition={
              staticMode
                ? undefined
                : {
                    duration: durations.drift,
                    ease: easings.smooth,
                    repeat: Infinity,
                    delay: (i * durations.drift) / 3,
                  }
            }
          >
            <img src={srcAt(i)} alt="" className="h-full w-full object-cover" />
          </motion.div>
        </TiltCard>
      ))}
    </div>
  );
}
