/**
 * TrustScene — the proof scene: the studio's looping frame with its
 * "Inside the content room" label, three behind-the-scenes stills
 * staggering in, counters computed from the data (projects, services),
 * and the first project's testimonial. No number or quote is invented.
 */
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger, durations, easings } from "@/cinema/motion/presets";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { media } from "@/data/media";
import { portfolioProjects } from "@/data/portfolio";
import { serviceCategories } from "@/data/services";

// Straight from the data: project and service counts, plus the first
// testimonial that exists on a project.
const counters = [
  { value: portfolioProjects.length, label: "Projects" },
  { value: serviceCategories.length, label: "Services" },
] as const;

const testimonial = portfolioProjects.find((p) => p.testimonial)?.testimonial;

export function TrustScene() {
  const { reducedMotion } = useCinema();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.4 });
  const [progress, setProgress] = useState(0);

  // Count up once the section enters view; reduced motion shows the total.
  useEffect(() => {
    if (!inView || reducedMotion) return;
    const controls = animate(0, 1, {
      duration: durations.slow,
      ease: easings.cinematic,
      onUpdate: setProgress,
    });
    return () => controls.stop();
  }, [inView, reducedMotion]);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* The studio frame: poster-only today, so it loops as a slow
              Ken Burns drift (motion values from presets only). */}
          <Reveal className="relative overflow-hidden rounded-2xl border border-border">
            <motion.img
              src={media.studio.poster}
              alt={media.studio.alt}
              className="aspect-video w-full object-cover"
              animate={reducedMotion ? undefined : { scale: [1, 1.08, 1] }}
              transition={
                reducedMotion
                  ? undefined
                  : { duration: durations.drift, repeat: Infinity, ease: easings.smooth }
              }
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent"
            />
            <span className="glass absolute bottom-4 left-4 rounded-full px-3 py-1.5 text-xs uppercase tracking-widest-plus text-foreground/80">
              Inside the content room
            </span>
          </Reveal>

          {/* Three BTS stills, offset downward in steps. */}
          <div className="grid grid-cols-3 gap-4">
            {media.bts.map((still, i) => (
              <Reveal
                key={still.alt}
                delay={stagger.base * i}
                className={i === 1 ? "mt-8" : i === 2 ? "mt-16" : ""}
              >
                <img
                  src={still.poster}
                  alt={still.alt}
                  className="aspect-[3/4] w-full rounded-xl border border-border object-cover"
                />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Counters animate on enter; the labels come from the data set. */}
        <Reveal className="mt-16 grid grid-cols-2 gap-6 border-y border-border py-10 sm:gap-10">
          {counters.map((counter) => (
            <div key={counter.label}>
              <p className="font-serif-display text-5xl tabular-nums sm:text-6xl">
                {reducedMotion ? counter.value : Math.round(counter.value * progress)}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest-plus text-foreground/60">
                {counter.label}
              </p>
            </div>
          ))}
        </Reveal>

        {testimonial && (
          <Reveal className="mx-auto mt-16 max-w-3xl text-center">
            <blockquote className="font-serif-display text-2xl leading-snug sm:text-3xl">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <footer className="mt-5 text-sm text-foreground/60">
              {testimonial.author}
              {testimonial.role ? `, ${testimonial.role}` : ""}
            </footer>
          </Reveal>
        )}
      </div>
    </section>
  );
}
