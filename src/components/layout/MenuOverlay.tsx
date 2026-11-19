/**
 * MenuOverlay — the full-screen lobby menu: four numbered doors with a
 * hover preview (gradient placeholder until media.ts arrives in Stage 4),
 * then the smaller secondary links, staggered in from presets. Radix Dialog
 * supplies the focus trap and Esc; route changes close it from the Navbar.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { durations, distances, easings, stagger } from "@/cinema/motion/presets";

type Door = {
  n: string;
  label: string;
  to: string;
  /** Filled from src/data/media.ts in Stage 4; undefined shows a gradient. */
  poster?: string;
};

/** The four doors — mirrors the links in Navbar.tsx. */
const doors: Door[] = [
  { n: "01", label: "Work", to: "/portfolio" },
  { n: "02", label: "Studio", to: "/studio-rental" },
  { n: "03", label: "About", to: "/about" },
  { n: "04", label: "Contact", to: "/start-project" },
];

const secondary = [
  { label: "Services", to: "/services" },
  { label: "Discover", to: "/discover" },
  { label: "Journal", to: "/journal" },
  { label: "FAQ", to: "/faq" },
  { label: "Careers", to: "/careers" },
];

type MenuOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MenuOverlay({ open, onOpenChange }: MenuOverlayProps) {
  const { reducedMotion } = useCinema();
  const [preview, setPreview] = useState<Door | null>(null);

  // Reset the preview when the menu closes (adjust-state, no effect).
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (!open) setPreview(null);
  }

  const itemDuration = reducedMotion ? 0 : durations.base;
  const itemVariant: Variants = {
    hidden: { opacity: 0, y: distances.rise },
    show: { opacity: 1, y: 0, transition: { duration: itemDuration, ease: easings.cinematic } },
  };
  const doorList: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reducedMotion ? 0 : stagger.base } },
  };
  const secondaryList: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reducedMotion ? 0 : stagger.tight } },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id="site-menu"
        // Full-screen glass: neutralize the stock centered-dialog slide-ins
        // (important, so they win regardless of stylesheet order).
        className="fixed inset-0 flex translate-x-0 translate-y-0 flex-col gap-0 overflow-y-auto border-0 bg-background/95 p-0 backdrop-blur-xl max-w-none sm:rounded-none data-[state=open]:!slide-in-from-left-[0px] data-[state=open]:!slide-in-from-top-[0px] data-[state=closed]:!slide-out-to-left-[0px] data-[state=closed]:!slide-out-to-top-[0px]"
      >
        <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center gap-10 px-6 py-16 sm:gap-14 sm:px-10">
          <DialogTitle className="text-xs font-medium uppercase tracking-widest-plus text-foreground/60">
            Menu
          </DialogTitle>
          <DialogDescription className="sr-only">
            Site navigation — four main sections and more links.
          </DialogDescription>

          <div className="flex flex-1 flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
            <motion.ul
              className="flex flex-col gap-1 sm:gap-3"
              initial="hidden"
              animate="show"
              variants={doorList}
            >
              {doors.map((door) => (
                <motion.li key={door.to} variants={itemVariant}>
                  <Link
                    to={door.to}
                    onClick={() => onOpenChange(false)}
                    onMouseEnter={() => setPreview(door)}
                    onFocus={() => setPreview(door)}
                    className="group flex items-baseline gap-4 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-5"
                  >
                    <span className="text-sm tabular-nums text-foreground/60">{door.n}</span>
                    <span className="text-4xl font-semibold tracking-tight text-foreground transition-opacity group-hover:opacity-70 sm:text-5xl lg:text-6xl">
                      {door.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            {/* Hover preview — gradient placeholder until Stage 4's media.ts */}
            <div className="hidden shrink-0 lg:block lg:w-80" aria-hidden="true">
              {preview && (
                <motion.div
                  key={preview.to}
                  initial={{ opacity: 0, y: distances.rise }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: itemDuration, ease: easings.cinematic }}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-foreground/10 via-foreground/5 to-transparent"
                >
                  {preview.poster ? (
                    <img src={preview.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-6xl font-semibold text-foreground/20">{preview.n}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          <motion.ul
            className="flex flex-wrap items-center gap-x-8 gap-y-3"
            initial="hidden"
            animate="show"
            variants={secondaryList}
          >
            {secondary.map((link) => (
              <motion.li key={link.to} variants={itemVariant}>
                <Link
                  to={link.to}
                  onClick={() => onOpenChange(false)}
                  className="text-sm text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
