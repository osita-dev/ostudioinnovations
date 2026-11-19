/**
 * StudioRentalVisual — the room itself: a slow dolly glides the studio
 * poster sideways under an oversized crop, with a soft white light
 * sweep drifting across on a long loop. Static mode holds the still
 * crop and drops the sweep.
 */
import { motion } from "framer-motion";
import { durations, easings } from "@/cinema/motion/presets";
import { assetFor } from "../sceneMedia";
import { useStaticMode } from "../useStaticMode";
import type { VisualProps } from "../serviceScenes.config";

// Sweep travel: x resolves against the band's own width (1/3 of the
// scene), so −100% sits it fully off-left and 300% fully off-right.
const SWEEP_OFF_LEFT = "-100%";
const SWEEP_OFF_RIGHT = "300%";

export function StudioRentalVisual({ service }: VisualProps) {
  const staticMode = useStaticMode();
  const asset = assetFor(service);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.img
        src={asset.poster}
        alt=""
        className="h-full w-full object-cover"
        style={{ scale: 1.12 }} // overscan so the ±2% dolly never shows an edge
        animate={staticMode ? undefined : { x: ["-2%", "2%"] }}
        transition={
          staticMode
            ? undefined
            : {
                duration: durations.drift,
                ease: easings.smooth,
                repeat: Infinity,
                repeatType: "reverse",
              }
        }
      />
      {!staticMode && (
        <motion.div
          className="absolute inset-y-[-20%] left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: SWEEP_OFF_LEFT }}
          animate={{ x: SWEEP_OFF_RIGHT }}
          transition={{
            duration: durations.drift,
            ease: easings.smooth,
            repeat: Infinity,
            repeatDelay: durations.drift, // one soft pass, then rest
          }}
        />
      )}
    </div>
  );
}
