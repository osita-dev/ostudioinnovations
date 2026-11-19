/**
 * ProcessTimeline — the service's process as a pinned, scroll-driven
 * timeline: a gold hairline fills while each step lights up and its
 * description fades in beside a still. Phones and reduced motion get a
 * simple vertical list instead (heavy effect, light fallback).
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import { getServiceMedia } from "@/data/media";
import type { ServiceCategory } from "@/types";

gsap.registerPlugin(ScrollTrigger);

type ProcessTimelineProps = {
  service: ServiceCategory;
};

const INACTIVE = 0.4; // resting opacity of a step that hasn't played yet
const BEAT = 1; // one scroll-phase per step (scrub space, not seconds)

export function ProcessTimeline({ service }: ProcessTimelineProps) {
  const { reducedMotion } = useCinema();
  const steps = service.process;
  const media = getServiceMedia(service.slug);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const headRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [narrow, setNarrow] = useState(
    () => window.matchMedia("(max-width: 1023px)").matches
  );

  // Track viewport width live so rotating a device re-evaluates the pin.
  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const sync = () => setNarrow(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const staticMode = reducedMotion || narrow;

  useLayoutEffect(() => {
    if (staticMode || steps.length === 0) return;
    const section = sectionRef.current;
    if (!section) return;

    let active = true;
    const refresh = () => {
      if (active) ScrollTrigger.refresh();
    };

    const ctx = gsap.context(() => {
      const heads = headRefs.current.filter(
        (el): el is HTMLDivElement => el !== null
      );
      const descs = descRefs.current.filter(
        (el): el is HTMLParagraphElement => el !== null
      );
      const progress = progressRef.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${steps.length * 100}%`,
          pin: true,
          scrub: true,
        },
      });

      // The gold hairline fills across the whole run; timeline durations
      // are scroll space, not clock time — nothing to source from presets.
      if (progress) {
        tl.fromTo(
          progress,
          { scaleY: 0, transformOrigin: "top" },
          { scaleY: 1, ease: "none", duration: steps.length * BEAT },
          0
        );
      }

      heads.forEach((head, i) => {
        tl.fromTo(
          head,
          { opacity: INACTIVE },
          { opacity: 1, ease: "none", duration: 0.35 * BEAT },
          i * BEAT
        );
        tl.fromTo(
          descs[i],
          { opacity: 0 },
          { opacity: 1, ease: "none", duration: 0.4 * BEAT },
          i * BEAT + 0.15 * BEAT
        );
      });
    }, section);

    // Re-measure once fonts and stills settle, so pin spacing matches layout.
    window.addEventListener("load", refresh);
    document.fonts.ready.then(refresh).catch(() => undefined);
    const images = Array.from(section.querySelectorAll("img"));
    images.forEach((img) => {
      if (!img.complete) img.addEventListener("load", refresh, { once: true });
    });

    return () => {
      active = false;
      window.removeEventListener("load", refresh);
      images.forEach((img) => img.removeEventListener("load", refresh));
      ctx.revert(); // kills the trigger and its pin-spacer
    };
  }, [staticMode, steps]);

  if (steps.length === 0) return null;

  // Simple vertical list: phones and reduced motion.
  if (staticMode) {
    return (
      <section className="border-t border-border py-20 sm:py-24">
        <div className="container max-w-3xl">
          <h2 className="text-xs uppercase tracking-widest-plus text-foreground/60">
            Our Process
          </h2>
          <ol className="mt-8 space-y-6 border-l border-border pl-6">
            {steps.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                delay={stagger.tight * i}
                className="relative"
              >
                <span className="absolute -left-[31px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                  {i + 1}
                </span>
                <h3 className="font-serif-display text-base">{step.title}</h3>
                <p className="mt-1 text-sm text-foreground/60">{step.description}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden border-t border-border"
    >
      <div className="grid h-full lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16">
          <h2 className="text-xs uppercase tracking-widest-plus text-foreground/60">
            Our Process
          </h2>
          <div className="relative mt-8 max-w-lg">
            <div aria-hidden className="absolute left-0 top-0 h-full w-px bg-border" />
            <div
              aria-hidden
              ref={progressRef}
              style={{ transform: "scaleY(0)" }}
              className="absolute left-0 top-0 h-full w-px origin-top bg-brand-gold"
            />
            <ol className="space-y-6">
              {steps.map((step, i) => (
                <li key={step.title} className="pl-6">
                  <div
                    ref={(el) => {
                      headRefs.current[i] = el;
                    }}
                    style={{ opacity: INACTIVE }}
                    className="flex items-baseline gap-3"
                  >
                    <span className="text-xs tracking-widest-plus text-foreground/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif-display text-lg sm:text-xl">
                      {step.title}
                    </h3>
                  </div>
                  <p
                    ref={(el) => {
                      descRefs.current[i] = el;
                    }}
                    style={{ opacity: 0 }}
                    className="mt-1.5 max-w-md text-sm leading-relaxed text-foreground/60"
                  >
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="relative hidden lg:block">
          {media && (
            <div aria-hidden className="absolute inset-0">
              <img src={media.poster} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
