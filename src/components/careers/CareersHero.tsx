/**
 * CareersHero — the "Join the crew" opening: eyebrow, headline and the
 * form's descriptor line beside a framed reel still. Copy from the old
 * hero is kept verbatim; only the layout and motion are new.
 */
import { Reveal } from "@/cinema/motion/Reveal";
import { ReelVideo } from "@/cinema/media/ReelVideo";
import { stagger } from "@/cinema/motion/presets";
import { media } from "@/data/media";

export function CareersHero() {
  return (
    <section className="bg-hero-gradient py-20 sm:py-24">
      <div className="container grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="text-center lg:text-left">
          <Reveal>
            <p className="text-xs tracking-widest-plus uppercase text-primary mb-6">
              O Studio Innovations
            </p>
            <h1 className="font-serif-display text-4xl sm:text-6xl leading-tight">
              Join the crew
            </h1>
          </Reveal>
          <Reveal delay={stagger.tight}>
            <p className="mt-5 font-serif-display text-xl sm:text-2xl text-foreground/90">
              Content Creator / Editor Application Form
            </p>
          </Reveal>
          <Reveal delay={stagger.base}>
            <p className="mt-4 text-lg text-foreground/60">
              <span>Creativity. Storytelling. Collaboration.</span>
            </p>
          </Reveal>
        </div>

        {/* Reel frame — the crew's still, letterboxed in a glass frame */}
        <Reveal delay={stagger.base} className="mx-auto w-full max-w-xl lg:max-w-none">
          <div className="glass rounded-2xl p-2">
            <div className="aspect-video overflow-hidden rounded-xl">
              <ReelVideo
                poster={media.pages.careers.poster}
                alt={media.pages.careers.alt}
                className="h-full w-full"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
