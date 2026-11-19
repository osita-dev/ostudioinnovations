/**
 * Portfolio — "Now showing": a short hero, category pills whose active
 * value lives in the URL (?category=) so filtered views deep-link, and a
 * Grid/Index toggle — a reflowing poster wall or the shared WorkIndex
 * list — over the filtered projects.
 */
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { FilterChips } from "@/components/portfolio/FilterChips";
import { PosterGrid } from "@/components/portfolio/PosterGrid";
import { ViewToggle, type ProjectView } from "@/components/portfolio/ViewToggle";
import { WorkIndex } from "@/components/home/WorkIndex";
import { portfolioProjects } from "@/data/portfolio";
import { CreditsCTA } from "@/components/home/CreditsCTA";
import { usePageMeta } from "@/hooks/usePageMeta";

const Portfolio = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<ProjectView>("grid");
  const category = searchParams.get("category") ?? "all";

  usePageMeta(
    "Now showing — Portfolio | O Studio Innovations",
    "Real projects, by category — the O Studio Innovations portfolio of film, content, events and technology work."
  );

  const filteredProjects = useMemo(() => {
    if (category === "all") return portfolioProjects;
    return portfolioProjects.filter((p) => p.categories.includes(category));
  }, [category]);

  // Deep-linkable filter: the value lives in ?category= ("all" clears it).
  const selectCategory = (value: string) =>
    setSearchParams(value === "all" ? {} : { category: value });

  return (
    <div>
      <PortfolioHero />

      <section className="py-16">
        <div className="container">
          <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
            <FilterChips active={category} onSelect={selectCategory} />
            <ViewToggle view={view} onChange={setView} />
          </div>

          {filteredProjects.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">
              No projects in this category yet — check back soon.
            </p>
          ) : view === "grid" ? (
            <PosterGrid projects={filteredProjects} />
          ) : (
            <WorkIndex projects={filteredProjects} />
          )}
        </div>
      </section>

      <CreditsCTA />
    </div>
  );
};

export default Portfolio;
