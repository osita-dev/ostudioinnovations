/**
 * MediaEventsVisual — the scene's contact sheet: six stills from the
 * related projects' galleries, a highlight racing across the sheet once
 * on entry and resting lit on the last cell. Static mode renders that
 * held state directly.
 */
import { motion } from "framer-motion";
import { durations, easings, viewport } from "@/cinema/motion/presets";
import { posterFor, relatedGalleryImages } from "../sceneMedia";
import { useStaticMode } from "../useStaticMode";
import type { VisualProps } from "../serviceScenes.config";

const CELLS = 6;
const DIM = 0.45; // resting opacity of an unselected cell

export function MediaEventsVisual({ service }: VisualProps) {
  const staticMode = useStaticMode();
  const images = relatedGalleryImages(service);
  const srcAt = (i: number) =>
    images.length > 0 ? images[i % images.length] : posterFor(service);

  return (
    <div
      aria-hidden
      className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 p-4 sm:p-6"
    >
      {Array.from({ length: CELLS }, (_, i) => {
        const held = i === CELLS - 1;
        return (
          <motion.div
            key={i}
            className="overflow-hidden"
            initial={{ opacity: staticMode ? (held ? 1 : DIM) : DIM }}
            whileInView={
              staticMode
                ? undefined
                : { opacity: held ? [DIM, 1] : [DIM, 1, DIM] }
            }
            viewport={viewport}
            transition={{
              duration: held ? durations.fast : durations.fast * 2,
              delay: i * durations.fast, // the wave crosses the sheet in 6 quick beats
              ease: easings.smooth,
            }}
          >
            <img src={srcAt(i)} alt="" loading="lazy" className="h-full w-full object-cover" />
          </motion.div>
        );
      })}
    </div>
  );
}
