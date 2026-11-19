/**
 * SiteLayout — composes the cinema shell around every route: smooth scroll,
 * the intro gate, cursor and film overlays, then Navbar → PageTransition →
 * Footer. Scroll reset lives in PageTransition.
 */
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/cinema/core/SmoothScroll";
import { IntroGate } from "@/cinema/core/IntroGate";
import { PageTransition } from "@/cinema/core/PageTransition";
import { ExpandTransition } from "@/cinema/core/ExpandTransition";
import { Scrubber } from "@/cinema/core/Scrubber";
import { Cursor } from "@/cinema/core/Cursor";
import { FilmGrain } from "@/cinema/core/Overlays";

export function SiteLayout() {
  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-background">
        <IntroGate />
        <Cursor />
        <FilmGrain />
        <Scrubber />
        {/* Sits above the curtain and navbar: it owns the screen mid-expand. */}
        <ExpandTransition />
        <Navbar />
        <main className="flex-1">
          <PageTransition />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
