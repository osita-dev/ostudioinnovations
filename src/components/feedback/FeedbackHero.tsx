/**
 * FeedbackHero — the /feedback opener with a gentle one-shot lift on the
 * eyebrow, headline and intro. Copy is verbatim from the old inline hero;
 * only the entrance motion is new (flat under reduced motion via Reveal).
 */
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import { feedbackIntro } from "@/data/feedback";

export function FeedbackHero() {
  return (
    <section className="bg-hero-gradient py-20 sm:py-28">
      <div className="container text-center">
        <Reveal>
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-6">
            O Studio Innovations
          </p>
        </Reveal>
        <Reveal delay={stagger.tight}>
          <h1 className="font-serif-display text-4xl sm:text-6xl leading-tight max-w-3xl mx-auto">
            Launch Feedback
          </h1>
        </Reveal>
        <Reveal delay={stagger.base}>
          <p className="mt-6 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            {feedbackIntro}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
