/**
 * PullQuote — the testimonial as one oversized pull quote with its
 * attribution, shown only when the project has a testimonial (the data
 * field is optional). All wording comes from the project record.
 */
import { Reveal } from "@/cinema/motion/Reveal";
import type { PortfolioProject } from "@/types";

type PullQuoteProps = {
  testimonial?: PortfolioProject["testimonial"];
};

export function PullQuote({ testimonial }: PullQuoteProps) {
  if (!testimonial) return null;

  return (
    <section className="pb-20">
      <div className="container max-w-4xl">
        <Reveal className="text-center">
          <blockquote>
            <p className="font-serif-display text-3xl leading-snug sm:text-4xl lg:text-5xl">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <footer className="mt-6 text-sm text-foreground/60">
              {testimonial.author}
              {testimonial.role ? `, ${testimonial.role}` : ""}
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
