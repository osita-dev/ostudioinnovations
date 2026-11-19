/**
 * App — the route table. Home stays eager (first paint); every other page
 * loads through React.lazy with SiteLayout's Suspense fallback, so the
 * initial bundle only carries the hero story. The dev-only /_kit gallery
 * is gone as of Stage 13.
 */
import { lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { CinemaProvider } from "@/cinema/core/CinemaProvider";
import Home from "./pages/Home";

const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Discover = lazy(() => import("./pages/Discover"));
const StartProject = lazy(() => import("./pages/StartProject"));
const StudioRental = lazy(() => import("./pages/StudioRental"));
const Careers = lazy(() => import("./pages/Careers"));
const FAQ = lazy(() => import("./pages/FAQ"));
const About = lazy(() => import("./pages/About"));
const Journal = lazy(() => import("./pages/Journal"));
const JournalPost = lazy(() => import("./pages/JournalPost"));
const Feedback = lazy(() => import("./pages/Feedback"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <CinemaProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner richColors position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<ProjectDetail />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/start-project" element={<StartProject />} />
              <Route path="/studio-rental" element={<StudioRental />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:slug" element={<JournalPost />} />
              {/* Link-only page (noindex, not in the nav) — launch feedback */}
              <Route path="/feedback" element={<Feedback />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </CinemaProvider>
);

export default App;
