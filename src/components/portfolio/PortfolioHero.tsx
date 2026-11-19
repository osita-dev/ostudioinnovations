/**
 * PortfolioHero — the short, dark "Now showing" slate over the hero
 * gradient: one title, one line, nothing else — the poster wall below
 * is the point of the page.
 */
export function PortfolioHero() {
  return (
    <section className="bg-hero-gradient py-14 text-center sm:py-16">
      <div className="container">
        <h1 className="font-serif-display text-4xl sm:text-5xl">Now showing</h1>
        <p className="mt-3 text-muted-foreground">Real projects, by category.</p>
      </div>
    </section>
  );
}
