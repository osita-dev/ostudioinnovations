/**
 * Kit — the dev-only Stage 4 gallery: every primitive shown once at /_kit.
 * The route is guarded by import.meta.env.DEV in App.tsx; remove both in
 * Stage 13 once the primitives are in use across the real pages.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { media } from "@/data/media";
import { portfolioProjects } from "@/data/portfolio";
import { Reveal } from "@/cinema/motion/Reveal";
import { SplitText } from "@/cinema/motion/SplitText";
import { MagneticButton } from "@/cinema/motion/MagneticButton";
import { TiltCard } from "@/cinema/motion/TiltCard";
import { useParallax } from "@/cinema/motion/useParallax";
import { durations } from "@/cinema/motion/presets";
import { ReelVideo } from "@/cinema/media/ReelVideo";
import { MediaFrame } from "@/cinema/media/MediaFrame";
import { Lightbox } from "@/cinema/media/Lightbox";
import { Scene } from "@/cinema/scenes/Scene";
import { TitleCard } from "@/cinema/scenes/TitleCard";

const featured = portfolioProjects[0];
const eyebrow = "text-xs uppercase tracking-widest-plus text-foreground/60";

const Kit = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { ref: parallaxRef, y: parallaxY } = useParallax<HTMLDivElement>();

  return (
    <div className="container py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Kit — Stage 4 primitives</h1>
      <p className="mt-2 max-w-xl text-sm text-foreground/60">
        Dev-only gallery at /_kit. Not linked from the site; the route is removed in Stage 13.
      </p>

      {/* Reveal */}
      <section className="mt-14">
        <h2 className={eyebrow}>Reveal</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Reveal className="glass rounded-xl p-6">
            <p className="text-sm text-foreground/80">Fade and rise on first sight.</p>
          </Reveal>
          <Reveal delay={durations.fast} className="glass rounded-xl p-6">
            <p className="text-sm text-foreground/80">The same reveal, 0.25s later.</p>
          </Reveal>
        </div>
      </section>

      {/* SplitText */}
      <section className="mt-14">
        <h2 className={eyebrow}>SplitText</h2>
        <p className="mt-3 text-3xl font-semibold tracking-tight">
          <SplitText text="Words arrive one at a time" />
        </p>
        <p className="mt-3 text-xl text-foreground/60">
          <SplitText text={"Lines split on a newline\nand stack into place"} split="lines" />
        </p>
      </section>

      {/* MagneticButton + TiltCard */}
      <section className="mt-14">
        <h2 className={eyebrow}>MagneticButton / TiltCard</h2>
        <div className="mt-3 flex flex-wrap items-start gap-10">
          <MagneticButton className="inline-block">
            <Button type="button">Pull me</Button>
          </MagneticButton>
          <TiltCard className="glass w-64 rounded-xl p-6">
            <p className="text-sm text-foreground/80">
              Tilts toward the pointer — 900px perspective, 8° ceiling, tracking sheen.
            </p>
          </TiltCard>
        </div>
      </section>

      {/* useParallax */}
      <section className="mt-14">
        <h2 className={eyebrow}>useParallax</h2>
        <div
          ref={parallaxRef}
          className="mt-3 h-44 overflow-hidden rounded-xl border border-border bg-foreground/5"
        >
          <motion.div
            style={{ y: parallaxY }}
            className="flex h-full items-center justify-center bg-gradient-to-b from-foreground/10 to-transparent"
          >
            <span className="text-sm text-foreground/60">This layer drifts with the scroll</span>
          </motion.div>
        </div>
      </section>

      {/* Media */}
      <section className="mt-14">
        <h2 className={eyebrow}>ReelVideo / MediaFrame</h2>
        <div className="mt-3 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs text-foreground/60">
              No video registered → poster with Ken Burns.
            </p>
            <ReelVideo
              poster={media.reel.poster}
              alt={media.reel.alt}
              className="h-56 rounded-xl border border-border"
            />
          </div>
          <div>
            <p className="mb-2 text-xs text-foreground/60">MediaFrame with the optional scrim.</p>
            <MediaFrame poster={media.studio.poster} alt={media.studio.alt} overlay>
              <p className="text-sm text-foreground">Caption over the footage</p>
            </MediaFrame>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <section className="mt-14">
        <h2 className={eyebrow}>Lightbox</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {featured.gallery.map((image, i) => (
            <button
              key={image}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="h-20 w-28 overflow-hidden rounded-lg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <img src={image} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <Lightbox
          images={featured.gallery}
          title={featured.title}
          startIndex={lightboxIndex ?? 0}
          open={lightboxIndex !== null}
          onOpenChange={(isOpen) => setLightboxIndex(isOpen ? (lightboxIndex ?? 0) : null)}
        />
      </section>

      {/* Scenes */}
      <section className="mt-14">
        <h2 className={eyebrow}>Scene / TitleCard / NextTeaser</h2>
      </section>
      <Scene
        id="kit-scene-1"
        index={1}
        total={2}
        label="Opening"
        next={{ label: "Gallery", targetId: "kit-scene-2" }}
        className="bg-gradient-to-b from-foreground/5 to-transparent"
      >
        <div className="px-6 sm:px-10">
          <TitleCard index={1} total={2} title="Scene one of the kit" />
        </div>
      </Scene>
      <Scene id="kit-scene-2" index={2} total={2} label="Gallery">
        <div className="px-6 sm:px-10">
          <TitleCard index={2} total={2} title="Scene two of the kit" />
        </div>
      </Scene>
    </div>
  );
};

export default Kit;
