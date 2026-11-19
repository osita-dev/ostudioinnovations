/**
 * IncludedGrid — the two lists a visitor checks before booking: what's
 * included and what arrives, as staggered grids of glass cards with
 * gold check icons.
 */
import { Check } from "lucide-react";
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import type { ServiceCategory } from "@/types";

type IncludedGridProps = {
  service: ServiceCategory;
};

const eyebrow = "text-xs uppercase tracking-widest-plus text-foreground/60";

export function IncludedGrid({ service }: IncludedGridProps) {
  const groups = [
    { label: "What's included", items: service.included },
    { label: "Deliverables", items: service.deliverables },
  ];

  return (
    <section className="pb-20 sm:pb-24">
      <div className="container space-y-12">
        {groups.map((group) => (
          <div key={group.label}>
            <h2 className={eyebrow}>{group.label}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item, i) => (
                <Reveal
                  as="li"
                  key={item}
                  delay={stagger.tight * i}
                  className="glass flex items-start gap-3 rounded-xl p-4"
                >
                  <Check
                    size={16}
                    className="icon-gold mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-relaxed text-foreground/70">{item}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
