import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { portfolioProjects, portfolioFilters } from "@/data/portfolio";
import { CTABanner } from "@/components/layout/CTABanner";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return portfolioProjects;
    return portfolioProjects.filter((p) => p.categories.includes(activeFilter));
  }, [activeFilter]);

  return (
    <div>
      <section className="bg-hero-gradient py-24">
        <div className="container text-center">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">Proof, Not Promises</p>
          <h1 className="font-serif-display text-4xl sm:text-5xl max-w-2xl mx-auto leading-tight">
            Work speaks louder than a service list.
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Browse real O Studio projects, organized by category.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {portfolioFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={cn(
                  "text-xs tracking-wide px-4 py-2 rounded-full border transition-colors",
                  activeFilter === f.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredProjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">
              No projects in this category yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/portfolio/${project.slug}`}
                  className="group block rounded-2xl overflow-hidden border border-border bg-card shadow-card"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs tracking-widest-plus uppercase text-primary mb-2">{project.year}</p>
                    <h3 className="font-serif-display text-lg mb-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner
        title="Have a project like this in mind?"
        description="Let's talk through what you're trying to create."
      />
    </div>
  );
};

export default Portfolio;
