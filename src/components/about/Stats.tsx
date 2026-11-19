/**
 * Stats — the closing proof numbers as a quiet three-up row. Values come
 * in as data (the page derives them from data files), so this component
 * only renders — no content hard-coded here.
 */
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";

export type StatItem = { value: string; label: string };

type StatsProps = {
  items: StatItem[];
};

export function Stats({ items }: StatsProps) {
  return (
    <section className="py-24 border-t border-border">
      <div className="container grid sm:grid-cols-3 gap-10 text-center max-w-3xl mx-auto">
        {items.map((stat, i) => (
          <Reveal key={stat.label} delay={stagger.base * i}>
            <p className="font-serif-display text-4xl text-primary mb-2">{stat.value}</p>
            <p className="text-sm text-foreground/60">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
