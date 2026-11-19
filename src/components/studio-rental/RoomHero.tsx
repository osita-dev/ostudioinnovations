/**
 * RoomHero — the booking page's opening: the studio reel drifting behind
 * the existing title and intro copy, which stay exactly as the page had
 * them. The layered scrim keeps the text high-contrast over the still.
 */
import { ReelVideo } from "@/cinema/media/ReelVideo";
import { media } from "@/data/media";

export function RoomHero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0">
        <ReelVideo poster={media.studio.poster} alt={media.studio.alt} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/90" />
      </div>
      <div className="relative container py-24 text-center max-w-3xl mx-auto">
        <p className="text-xs tracking-widest-plus uppercase text-primary mb-6">Studio Rental</p>
        <h1 className="font-serif-display text-4xl sm:text-6xl leading-tight">
          Book a studio session
        </h1>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          Studio Rental is the space. A booking is your request to hold a slot. Tell us the space,
          the date, and how you'll use it — we reply with availability and a quote.
        </p>
      </div>
    </section>
  );
}
