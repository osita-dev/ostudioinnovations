/**
 * GalleryRow — one gallery row (full-width or two-column) whose images
 * drift gently against the scroll and open the Lightbox when clicked.
 * The scroll hooks live here so every row owns its own parallax range
 * (AGENTS: one component per file).
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { distances } from "@/cinema/motion/presets";
import { cn } from "@/lib/utils";

type GalleryImage = { src: string; index: number };

type GalleryRowProps = {
  images: GalleryImage[];
  type: "full" | "pair";
  /** Project title — also the image alt prefix. */
  title: string;
  onOpen: (index: number) => void;
};

/** A quarter of the full parallax distance: gentle, per the stage. */
const DRIFT = distances.parallax / 4;

export function GalleryRow({ images, type, title, onOpen }: GalleryRowProps) {
  const { reducedMotion } = useCinema();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [DRIFT, -DRIFT]);

  return (
    <div ref={ref} className={cn("grid gap-6", type === "pair" && "sm:grid-cols-2")}>
      {images.map((image) => (
        <button
          key={image.index}
          type="button"
          onClick={() => onOpen(image.index)}
          className={cn(
            "group relative block overflow-hidden rounded-xl border border-border bg-card shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            type === "full" ? "aspect-[16/9]" : "aspect-[4/3]"
          )}
        >
          {/* The wrapper overshoots the frame so the parallax never gaps. */}
          <motion.div
            style={{ y: reducedMotion ? 0 : y }}
            className="absolute inset-x-0 -inset-y-8"
          >
            <img
              src={image.src}
              alt={`${title} ${image.index + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
        </button>
      ))}
    </div>
  );
}
