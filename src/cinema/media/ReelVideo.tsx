/**
 * ReelVideo — a poster that upgrades itself: the still shows at once, a
 * registered muted video takes over when it can play (in view, allowed),
 * and any failure drops back to the still. No video → Ken Burns drift.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCinema } from "../core/CinemaProvider";
import { durations, easings, viewport } from "../motion/presets";
import { cn } from "@/lib/utils";

type ReelVideoProps = {
  poster: string;
  alt: string;
  /** Registered path under public/, e.g. "/media/reel.mp4". */
  src?: string;
  /** When true the video only plays while the pointer is over it. */
  hoverPlay?: boolean;
  className?: string;
};

export function ReelVideo({ poster, alt, src, hoverPlay = false, className }: ReelVideoProps) {
  const { reducedMotion } = useCinema();
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [failed, setFailed] = useState(false);

  const wantsVideo = Boolean(src) && !reducedMotion && !failed;
  const shouldPlay = wantsVideo && inView && (!hoverPlay || hovering);

  // observe visibility so the video pauses itself when scrolled away
  useEffect(() => {
    const node = ref.current;
    if (!node || !wantsVideo) return;
    const observer = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { threshold: viewport.amount },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [wantsVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) video.play().catch(() => setFailed(true));
    else video.pause();
  }, [shouldPlay]);

  const kenBurns = !src && !reducedMotion;

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      onPointerEnter={hoverPlay ? () => setHovering(true) : undefined}
      onPointerLeave={hoverPlay ? () => setHovering(false) : undefined}
    >
      <motion.img
        src={poster}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        animate={kenBurns ? { scale: [1, 1.08] } : undefined}
        transition={
          kenBurns
            ? {
                duration: durations.drift,
                ease: easings.smooth,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
      />
      {wantsVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
