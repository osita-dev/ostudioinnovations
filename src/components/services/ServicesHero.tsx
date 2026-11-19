/**
 * ServicesHero — the short, dark opening slate: one title, one line,
 * nothing else. The six panels below carry the page.
 */
export function ServicesHero() {
  return (
    <section className="bg-hero-gradient py-14 text-center sm:py-16">
      <div className="container">
        <h1 className="font-serif-display text-4xl sm:text-5xl">What we do</h1>
        <p className="mt-3 text-muted-foreground">Six services, one studio.</p>
      </div>
    </section>
  );
}
