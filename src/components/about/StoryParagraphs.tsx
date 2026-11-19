/**
 * StoryParagraphs — the three origin paragraphs, verbatim from the old
 * page, each lifted into place once. Kept as one readable column so the
 * long-form text stays comfortable (max-w-3xl reading measure).
 */
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";

export function StoryParagraphs() {
  return (
    <section className="py-24">
      <div className="container max-w-3xl">
        <Reveal>
          <p className="text-lg leading-relaxed text-foreground/90 mb-6">
            O Studio Innovations began as a response to a simple observation: creative work and
            technology are usually treated as separate industries, handled by separate vendors, run
            on separate timelines — even when they're solving the same problem for the same client.
          </p>
        </Reveal>
        <Reveal delay={stagger.tight}>
          <p className="text-lg leading-relaxed text-foreground/90 mb-6">
            We built O Studio differently. Media and events, film and production, content and
            entertainment, technology, creative services, and studio rentals all live under one
            studio, run by one connected process. That means a wedding film, a documentary, a brand
            identity, a business website, and a studio session can all be handled with the same
            standard of care — and, when a project calls for more than one of them, without the usual
            friction of coordinating across vendors.
          </p>
        </Reveal>
        <Reveal delay={stagger.base}>
          <p className="text-lg leading-relaxed text-foreground/90">
            Our name reflects that intent: a studio built around innovation, not just output. Every
            project — whichever capability it draws on — is measured against the same bar: is this
            something we'd be proud to put our name on.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
