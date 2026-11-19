/**
 * PromiseWords — the pinned promise scene: lines light up in turn while
 * the stills crossfade, scrubbed by scroll; `lines` makes it reusable
 * (About, Stage 11). Small touch screens and reduced motion stack instead.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import type { MediaAsset } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export type PromiseLine = { text: string; media: MediaAsset };

type PromiseWordsProps = {
  lines: PromiseLine[];
};

const FADE_FROM = 0.15; // each line starts at 15% (the brief)
const DIM = 0.4; // the previous line rests at 40% (the brief)
const RELEASE_SCALE = 1.08; // final line eases up as the pin lets go
const PHASE = 1; // one scroll-phase per line: scrub-mapped, not seconds

export function PromiseWords({ lines }: PromiseWordsProps) {
  const { reducedMotion, isTouch } = useCinema();
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [narrow, setNarrow] = useState(
    () => window.matchMedia("(max-width: 767px)").matches
  );

  // Track viewport width live so rotating a device re-evaluates the pin.
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setNarrow(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const staticMode = reducedMotion || (isTouch && narrow);

  useLayoutEffect(() => {
    if (staticMode || lines.length === 0) return;
    const section = sectionRef.current;
    if (!section) return;

    let active = true;
    const refresh = () => {
      if (active) ScrollTrigger.refresh();
    };

    const ctx = gsap.context(() => {
      const lineEls = lineRefs.current.filter(
        (el): el is HTMLParagraphElement => el !== null
      );
      const bgEls = bgRefs.current.filter((el): el is HTMLDivElement => el !== null);
      const last = lineEls[lineEls.length - 1];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%", // three viewport heights of scroll (the brief)
          pin: true,
          scrub: true,
        },
      });

      lineEls.forEach((line, i) => {
        // This line lights 15% → 100% across its phase; ease "none" keeps
        // the mapping linear under scrub (timeline durations are scroll
        // space, not clock time — nothing to source from presets).
        tl.fromTo(
          line,
          { opacity: FADE_FROM },
          { opacity: 1, ease: "none", duration: PHASE },
          i * PHASE
        );
        if (i === 0) return;
        // The line before it dims to 40% while the stills crossfade beneath.
        tl.to(lineEls[i - 1], { opacity: DIM, ease: "none", duration: PHASE }, i * PHASE);
        tl.fromTo(
          bgEls[i],
          { opacity: 0 },
          { opacity: 1, ease: "none", duration: PHASE },
          i * PHASE
        );
        tl.to(bgEls[i - 1], { opacity: 0, ease: "none", duration: PHASE }, i * PHASE);
      });

      // Release beat: the final line eases up slightly as the pin lets go.
      if (last) {
        tl.to(
          last,
          { scale: RELEASE_SCALE, ease: "none", duration: PHASE / 2 },
          lineEls.length * PHASE
        );
      }
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
  }, [staticMode, lines]);

  if (lines.length === 0) return null;

  // Static cut: no pin, the lines simply stack and reveal.
  if (staticMode) {
    return (
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <img src={lines[0].media.poster} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-28 text-center">
          {lines.map((line, i) => (
            <Reveal key={line.text} delay={stagger.loose * i}>
              <p className="text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                {line.text}
              </p>
            </Reveal>
          ))}
          <Reveal delay={stagger.loose * lines.length}>
            <p className="mt-4 max-w-md text-sm text-foreground/60 sm:text-base">
              One studio. Every stage of your creative vision.
            </p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {lines.map((line, i) => (
        <div
          key={line.text}
          ref={(el) => {
            bgRefs.current[i] = el;
          }}
          aria-hidden
          className="absolute inset-0"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <img src={line.media.poster} alt="" className="h-full w-full object-cover" />
        </div>
      ))}
      <div aria-hidden className="absolute inset-0 bg-background/80" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          {lines.map((line, i) => (
            <p
              key={line.text}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className="text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-7xl lg:text-8xl"
              style={{ opacity: FADE_FROM }}
            >
              {line.text}
            </p>
          ))}
        </div>
        <p className="mt-8 max-w-md text-sm text-foreground/60 sm:text-base">
          One studio. Every stage of your creative vision.
        </p>
      </div>
    </section>
  );
}
