/**
 * EndCredits — the project's closing credits (replacing the old sticky
 * sidebar): client, linked service, deliverables and results in a
 * centered grid with a staggered reveal, then the booking button whose
 * link carries service and project for the prefill in Stage 10.
 */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import type { PortfolioProject, ServiceCategory } from "@/types";

type EndCreditsProps = {
  project: PortfolioProject;
  service?: ServiceCategory;
};

const label = "text-xs uppercase tracking-widest-plus text-foreground/60";

export function EndCredits({ project, service }: EndCreditsProps) {
  return (
    <section className="border-t border-border py-20 sm:py-24">
      <div className="container">
        <div className="mx-auto grid max-w-3xl gap-10 text-center sm:grid-cols-2">
          <Reveal>
            <p className={label}>Client</p>
            <p className="mt-2 font-serif-display text-xl">{project.client}</p>
          </Reveal>

          <Reveal delay={stagger.base}>
            <p className={label}>Service</p>
            {service ? (
              <Link
                to={`/services/${service.slug}`}
                className="mt-2 inline-block font-serif-display text-xl underline-offset-4 transition-all hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {service.name}
              </Link>
            ) : (
              <p className="mt-2 font-serif-display text-xl">{project.serviceCategory}</p>
            )}
          </Reveal>

          <Reveal delay={stagger.base * 2}>
            <p className={label}>Deliverables</p>
            <ul className="mt-3 space-y-1.5 text-sm text-foreground/70">
              {project.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>

          {project.results && (
            <Reveal delay={stagger.base * 3}>
              <p className={label}>Results</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                {project.results}
              </p>
            </Reveal>
          )}
        </div>

        <Reveal delay={stagger.base * 4} className="mt-12 flex justify-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link
              to={`/start-project?service=${project.serviceCategory}&project=${project.slug}`}
            >
              Start a similar project <ArrowRight className="ml-2" size={16} />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
