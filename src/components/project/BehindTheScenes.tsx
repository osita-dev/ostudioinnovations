/**
 * BehindTheScenes — the short making-of note: an eyebrow label over one
 * paragraph, rendered only when the project actually has one (the data
 * field is optional). Label and copy come straight from existing strings.
 */
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";

type BehindTheScenesProps = {
  text?: string;
};

export function BehindTheScenes({ text }: BehindTheScenesProps) {
  if (!text) return null;

  return (
    <section className="pb-16">
      <div className="container max-w-3xl">
        <Reveal>
          <p className="text-xs uppercase tracking-widest-plus text-foreground/60">
            Behind The Scenes
          </p>
        </Reveal>
        <Reveal delay={stagger.tight}>
          <p className="mt-3 leading-relaxed text-foreground/80">{text}</p>
        </Reveal>
      </div>
    </section>
  );
}
