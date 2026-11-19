/**
 * WhatItIs — the service's story in two large readable blocks: what it
 * is and who it's for, each rising in with Reveal.
 */
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import type { ServiceCategory } from "@/types";

type WhatItIsProps = {
  service: ServiceCategory;
};

const eyebrow = "text-xs uppercase tracking-widest-plus text-foreground/60";

export function WhatItIs({ service }: WhatItIsProps) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container max-w-3xl space-y-12">
        <Reveal>
          <p className={eyebrow}>What It Is</p>
          <p className="mt-3 text-xl leading-relaxed text-foreground/80 sm:text-2xl">
            {service.description}
          </p>
        </Reveal>
        <Reveal delay={stagger.base}>
          <p className={eyebrow}>Who It's For</p>
          <p className="mt-3 text-xl leading-relaxed text-foreground/80 sm:text-2xl">
            {service.whoItsFor}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
