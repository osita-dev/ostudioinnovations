/**
 * FilmProductionVisual — the scene's cinema frame: the poster fills the
 * background while letterbox bars close in to a 2.39:1 window on entry,
 * ReelVideo's slow push-in breathing behind them. Static mode holds the
 * finished frame with the bars already closed.
 */
import { motion } from "framer-motion";
import { ReelVideo } from "@/cinema/media/ReelVideo";
import { durations, easings, viewport } from "@/cinema/motion/presets";
import { assetFor } from "../sceneMedia";
import { useStaticMode } from "../useStaticMode";
import type { VisualProps } from "../serviceScenes.config";

// Bar height that leaves a 2.39:1 window: (container − frame) / 2, with
// frame = width / 2.39. min() zeroes the bars on wide-short viewports
// where the ratio already fills the frame.
const BAR_HEIGHT = "calc((100% - min(100%, 100vw / 2.39)) / 2)";

export function FilmProductionVisual({ service }: VisualProps) {
  const staticMode = useStaticMode();
  const asset = assetFor(service);

  // Static mode starts and ends at scaleY 1, so the tween is a no-op.
  const bar = {
    initial: { scaleY: staticMode ? 1 : 0 },
    whileInView: { scaleY: 1 },
    viewport,
    transition: { duration: durations.slow, ease: easings.cinematic },
  } as const;

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {staticMode ? (
        <img src={asset.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <ReelVideo poster={asset.poster} alt="" className="h-full w-full" />
      )}
      <motion.div
        className="absolute inset-x-0 top-0 origin-top bg-background"
        style={{ height: BAR_HEIGHT }}
        {...bar}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 origin-bottom bg-background"
        style={{ height: BAR_HEIGHT }}
        {...bar}
      />
    </div>
  );
}
