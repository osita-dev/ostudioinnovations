/**
 * AboutHero — the opening slate over a studio still: eyebrow, the three
 * verb headline, and the one-line positioning. The image sits behind a
 * dark scrim so white text always clears contrast (AGENTS brand rule).
 */
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import { media } from "@/data/media";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0">
        <img
          src={media.studio.poster}
          alt={media.studio.alt}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/75" />
        <div className="absolute inset-0 bg-hero-gradient opacity-70" />
      </div>
      <div className="relative container py-28 text-center sm:py-36">
        <Reveal>
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-6">About O Studio</p>
        </Reveal>
        <Reveal delay={stagger.tight}>
          <h1 className="font-serif-display text-4xl sm:text-6xl leading-tight max-w-3xl mx-auto">
            We create. We build. We document.
          </h1>
        </Reveal>
        <Reveal delay={stagger.base}>
          <p className="mt-6 text-lg text-foreground/60 max-w-2xl mx-auto">
            O Studio Innovations sits at the intersection of creative production and technology.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
