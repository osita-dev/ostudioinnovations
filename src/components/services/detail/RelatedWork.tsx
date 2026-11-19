/**
 * RelatedWork — the proof for this service: up to three related projects
 * as poster cards that expand into their pages, plus the button that
 * lands on the portfolio filtered to the first related category.
 */
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { startExpand } from "@/cinema/core/expandStore";
import { getProjectMedia } from "@/data/media";
import type { PortfolioProject, ServiceCategory } from "@/types";

type RelatedWorkProps = {
  service: ServiceCategory;
  projects: PortfolioProject[];
};

export function RelatedWork({ service, projects }: RelatedWorkProps) {
  const { isTouch } = useCinema();
  const category = service.relatedProjectCategories[0];

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, project: PortfolioProject) => {
    if (isTouch) return; // touch taps navigate through the Link itself
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    startExpand(
      { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      getProjectMedia(project).poster,
      `/portfolio/${project.slug}`
    );
  };

  // No related projects in the data (studio-rental) — same guard as before.
  if (projects.length === 0) return null;

  return (
    <section className="py-20 sm:py-24">
      <div className="container">
        <h2 className="text-xs uppercase tracking-widest-plus text-foreground/60">
          Relevant Examples
        </h2>

        <ul className="mt-6 grid gap-5 sm:grid-cols-3">
          {projects.map((project) => {
            const media = getProjectMedia(project);
            return (
              <li key={project.id}>
                <Link
                  to={`/portfolio/${project.slug}`}
                  data-cursor="view"
                  onClick={(e) => handleClick(e, project)}
                  className="group block overflow-hidden rounded-xl border border-border bg-card shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={media.poster}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="p-3 text-sm text-foreground/70 transition-colors group-hover:text-foreground">
                    {project.title}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        {category && (
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to={`/portfolio?category=${category}`}>
                See it in action <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
