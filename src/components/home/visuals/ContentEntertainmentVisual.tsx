/**
 * ContentEntertainmentVisual — three vertical 9:16 frames carrying the
 * behind-the-scenes stills, each a ReelVideo bobbing on its own phase
 * (offset by a third of the loop so they never move in lockstep). Static
 * mode drops the float and the Ken Burns for a clean trio.
 */
import { motion } from "framer-motion";
import { ReelVideo } from "@/cinema/media/ReelVideo";
import { media } from "@/data/media";
import { distances, durations, easings } from "@/cinema/motion/presets";
import { useStaticMode } from "../useStaticMode";

const FRAMES = media.bts.slice(0, 3);

export function ContentEntertainmentVisual() {
  const staticMode = useStaticMode();

  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center gap-3 px-6 sm:gap-5"
    >
      {FRAMES.map((asset, i) => (
        <motion.div
          key={asset.poster}
          className="aspect-[9/16] w-[24%] max-w-[230px] overflow-hidden rounded-lg border border-border"
          initial={{ y: 0 }}
          animate={staticMode ? undefined : { y: [0, -distances.rise, 0] }}
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
          {staticMode ? (
            <img src={asset.poster} alt="" className="h-full w-full object-cover" />
          ) : (
            <ReelVideo poster={asset.poster} alt="" className="h-full w-full" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
