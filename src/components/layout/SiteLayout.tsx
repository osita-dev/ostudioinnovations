/**
 * SiteLayout — composes the cinema shell around every route: smooth scroll,
 * the intro gate, cursor and film overlays, then Navbar → PageTransition →
 * Footer. A skip link leads to <main>; Suspense shows a dark minimal
 * fallback while a lazy route loads. Scroll reset lives in PageTransition.
 */
import { Suspense } from "react";
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:text-foreground"
        >
          Skip to content
        </a>
        <IntroGate />
        <Cursor />
        <FilmGrain />
        <Scrubber />
        {/* Sits above the curtain and navbar: it owns the screen mid-expand. */}
        <ExpandTransition />
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {/* Dark minimal fallback while a lazy route loads. */}
          <Suspense
            fallback={
              <div
                role="status"
                aria-label="Loading page"
                className="min-h-screen animate-pulse bg-background"
              />
            }
          >
            <PageTransition />
          </Suspense>
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
