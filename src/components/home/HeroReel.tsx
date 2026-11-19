/**
 * HeroReel — Scene 1, the cold open: the reel fills the viewport behind
 * the hook line, REC chip and letterbox; the bars release once the intro
 * ends, and the video layer relaxes from 1.1 to 1 as you scroll past it.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { media } from "@/data/media";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { Letterbox, ProjectorBeam } from "@/cinema/core/Overlays";
import { ReelVideo } from "@/cinema/media/ReelVideo";
import { MagneticButton } from "@/cinema/motion/MagneticButton";
import { SplitText } from "@/cinema/motion/SplitText";
import { durations, easings } from "@/cinema/motion/presets";
import { ReelPlayer } from "./ReelPlayer";

// Scroll-past states (module-level so the identities stay stable): at
// rest the reel sits zoomed at 1.1; past the hero it eases to 1 with a
// slight dip to 60% — the "fades slightly" of the brief.
const SCROLL_RANGE: number[] = [0, 1];
const SCALE_REST: number[] = [1.1, 1];
const SCALE_FLAT: number[] = [1, 1];
const FADE_REST: number[] = [1, 0.6];
const FADE_FLAT: number[] = [1, 1];

const pad = (value: number) => String(value).padStart(2, "0");

export function HeroReel() {
  const { introDone, reducedMotion } = useCinema();
  const sectionRef = useRef<HTMLElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  const reelVideo = media.reel.video;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, SCROLL_RANGE, reducedMotion ? SCALE_FLAT : SCALE_REST);
  const fade = useTransform(scrollYProgress, SCROLL_RANGE, reducedMotion ? FADE_FLAT : FADE_REST);

  // Cosmetic mm:ss:ff counter — a clock, so it freezes when motion is reduced.
  useEffect(() => {
    if (reducedMotion) return;
    const start = performance.now();
    const id = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const seconds = Math.floor(elapsed / 1000);
      const mm = pad(Math.floor(seconds / 60) % 100);
      const ss = pad(seconds % 60);
      const ff = pad(Math.floor((elapsed % 1000) / (1000 / 30)));
      if (timeRef.current) timeRef.current.textContent = `${mm}:${ss}:${ff}`;
    }, 1000 / 30);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Reel layer — scroll-past scale and fade */}
      <motion.div style={{ scale, opacity: fade }} className="absolute inset-0">
        <div data-cursor={reelVideo ? "play" : undefined} className="h-full w-full">
          <ReelVideo
            poster={media.reel.poster}
            alt={media.reel.alt}
            src={reelVideo}
            className="h-full w-full"
          />
        </div>
      </motion.div>

      {/* Contrast gradient + projector atmosphere + letterbox bars */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/90"
      />
      <ProjectorBeam />
      <Letterbox open={!introDone} />

      <div className="relative z-20 flex h-full flex-col">
        {/* REC chip */}
        <div className="absolute left-6 top-24 z-10 flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 backdrop-blur-sm sm:left-10">
          <span aria-hidden className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-[10px] font-medium uppercase tracking-widest-plus text-foreground/80">
            REC
          </span>
          <span ref={timeRef} className="text-[10px] font-medium tabular-nums text-foreground/60">
            00:00:00
          </span>
        </div>

        {/* The hook */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {introDone ? (
              <SplitText text="Where Creativity Meets Innovation." />
            ) : (
              <span className="invisible">Where Creativity Meets Innovatio'.</span>
            )}
          </h1>
          <p className="mt-6 max-w-xl text-base text-foreground/60 sm:text-lg">
            From your best moments to your biggest dreams, we make them real.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <MagneticButton className="inline-block">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/start-project">Start a project</Link>
              </Button>
            </MagneticButton>
            {reelVideo && (
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8"
                onClick={() => setPlayerOpen(true)}
              >
                Watch the reel
              </Button>
            )}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="flex flex-col items-center gap-3 pb-10">
          <div aria-hidden className="relative h-10 w-px overflow-hidden bg-foreground/20">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-foreground"
              animate={reducedMotion ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: durations.intro, ease: easings.smooth, repeat: Infinity }}
            />
          </div>
          <span className="text-[10px] uppercase tracking-widest-plus text-foreground/60">
            Here&apos;s how we make them
          </span>
        </div>
      </div>

      {reelVideo && (
        <ReelPlayer
          open={playerOpen}
          onOpenChange={setPlayerOpen}
          src={reelVideo}
          title="Watch the reel"
          description={media.reel.alt}
        />
      )}
    </section>
  );
}
