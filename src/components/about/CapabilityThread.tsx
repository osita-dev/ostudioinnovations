/**
 * CapabilityThread — the six capabilities as one thread: gold icons on a
 * single gold hairline that draws itself across the row on first sight.
 * The line is decoration only (aria-hidden); reduced motion shows it full.
 */
import { Reveal } from "@/cinema/motion/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { motion, useReducedMotion } from "framer-motion";
import { durations, easings, stagger } from "@/cinema/motion/presets";
import { serviceCategories } from "@/data/services";
import { getIcon } from "@/lib/icons";

export function CapabilityThread() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="py-24 border-t border-border">
      <div className="container">
        <SectionHeading
          eyebrow="How It Fits Together"
          title="One studio, six connected capabilities"
          align="center"
          className="mb-14"
        />
        <div className="relative max-w-5xl mx-auto">
          {/* The thread: one gold hairline behind the icon row */}
          <motion.div
            aria-hidden
            className="hairline-gold absolute left-0 right-0 top-7 hidden sm:block"
            initial={reducedMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: durations.slow, ease: easings.cinematic }}
            style={{ transformOrigin: "left center" }}
          />
          <ul className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-6">
            {serviceCategories.map((s, i) => {
              const Icon = getIcon(s.icon);
              return (
                <Reveal as="li" key={s.slug} delay={stagger.base * i} className="text-center">
                  <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full glass">
                    <Icon className="icon-gold" size={24} strokeWidth={1.5} />
                  </span>
                  <p className="font-serif-display text-sm text-foreground/90">{s.shortName}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
