/**
 * DiscoverHero — the page's opening slate: one eyebrow and a headline that
 * swaps with the visitor's state (objective picker → recommendation). The
 * copy is the existing Discover copy, kept for both moments.
 */
type DiscoverHeroProps = {
  selected: boolean;
};

export function DiscoverHero({ selected }: DiscoverHeroProps) {
  return (
    <section className="bg-hero-gradient py-24">
      <div className="container text-center">
        <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">Project Discovery</p>
        <h1 className="font-serif-display text-4xl sm:text-5xl max-w-2xl mx-auto leading-tight">
          {selected ? "Here's what we'd recommend." : "What are you trying to do?"}
        </h1>
        <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
          {selected
            ? "Based on your answer, here's where to start."
            : "You don't need to know the exact service name — just tell us the outcome you want."}
        </p>
      </div>
    </section>
  );
}
