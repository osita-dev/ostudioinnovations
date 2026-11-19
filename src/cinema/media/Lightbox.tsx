/**
 * Lightbox — full-screen still viewer: arrows, keys and swipe move through
 * the set with wrap-around; Escape and the backdrop close it. The stock
 * slide-in is neutralized (menu-overlay recipe) so only the fade remains.
 */
import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCinema } from "../core/CinemaProvider";
import { durations, easings } from "../motion/presets";

type LightboxProps = {
  images: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Image shown first when the viewer opens. */
  startIndex?: number;
  /** Names the set — also used in the image alt text. */
  title?: string;
  /** Longer description for screen readers. */
  description?: string;
};

const SWIPE_MIN = 40; // px of horizontal travel before a swipe counts
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export function Lightbox({
  images,
  open,
  onOpenChange,
  startIndex = 0,
  title,
  description,
}: LightboxProps) {
  const { reducedMotion } = useCinema();
  const count = images.length;
  const [index, setIndex] = useState(startIndex);
  const [wasOpen, setWasOpen] = useState(open);
  const touchX = useRef<number | null>(null);

  // re-sync to the clicked thumbnail each time the viewer opens
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) setIndex(clamp(startIndex, 0, Math.max(count - 1, 0)));
  }

  const safeIndex = count > 0 ? clamp(index, 0, count - 1) : 0;

  const go = (delta: number) => {
    if (count < 2) return;
    setIndex((current) => (clamp(current, 0, count - 1) + delta + count) % count);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchX.current;
    const end = event.changedTouches[0]?.clientX;
    touchX.current = null;
    if (start === null || end === undefined) return;
    const delta = end - start;
    if (Math.abs(delta) >= SWIPE_MIN) go(delta > 0 ? -1 : 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="fixed inset-0 flex translate-x-0 translate-y-0 items-center justify-center gap-0 overflow-hidden border-0 bg-background/95 p-0 backdrop-blur-xl max-w-none sm:rounded-none data-[state=open]:!slide-in-from-left-[0px] data-[state=open]:!slide-in-from-top-[0px] data-[state=closed]:!slide-out-to-left-[0px] data-[state=closed]:!slide-out-to-top-[0px]"
      >
        <DialogTitle className="sr-only">{title ?? "Image viewer"}</DialogTitle>
        <DialogDescription className="sr-only">
          {description ??
            `${count} images in this set. Use the arrow keys or swipe to move between them, and Escape to close.`}
        </DialogDescription>

        {count > 0 && (
          <>
            <motion.img
              key={safeIndex}
              src={images[safeIndex]}
              alt={`${title ?? "Gallery image"} — image ${safeIndex + 1} of ${count}`}
              className="max-h-[85vh] max-w-[92vw] rounded-xl object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reducedMotion ? 0 : durations.fast,
                ease: easings.cinematic,
              }}
            />
            <span
              aria-live="polite"
              className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-widest-plus text-foreground/60"
            >
              {safeIndex + 1} / {count}
            </span>
          </>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(-1)}
              className="absolute left-4 rounded-full border border-border bg-foreground/5 p-2.5 text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:left-8"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(1)}
              className="absolute right-4 rounded-full border border-border bg-foreground/5 p-2.5 text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:right-8"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
