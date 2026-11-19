/**
 * StoryPicker — Home's slice of project discovery: four large visual
 * choices from discoveryOptions; picking one reveals the recommended
 * service and a related project in place, with routes into the full
 * service, the brief form, and /discover for the remaining options.
 * The recommendation logic lives in useDiscovery (shared with Discover).
 */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import { useDiscovery } from "@/hooks/useDiscovery";
import { discoveryOptions } from "@/data/discovery";
import { serviceCategories } from "@/data/services";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const storyOptions = discoveryOptions.slice(0, 4);

// Icons resolve once at module load: react-hooks/static-components rejects
// getIcon() bound to a capitalized name during render (see ServiceScene).
const OPTION_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  storyOptions.map((option): [string, LucideIcon] => [option.icon, getIcon(option.icon)])
);

const SERVICE_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  serviceCategories.map((service): [string, LucideIcon] => [service.icon, getIcon(service.icon)])
);

export function StoryPicker() {
  const { selectedId, setSelectedId, recommendedServices, exampleProject } = useDiscovery();
  // The first recommendation stands in for the card; /discover shows the rest.
  const service = recommendedServices.find((s) => s !== undefined);
  const ServiceIcon = service ? SERVICE_ICONS[service.icon] : undefined;
  const project = service ? exampleProject(service.slug) : undefined;

  return (
    <section className="py-24 sm:py-32">
      <div className="container max-w-5xl">
        <Reveal className="text-center">
          <h2 className="font-serif-display text-3xl sm:text-5xl">
            What&apos;s your story?
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {storyOptions.map((option, i) => {
            const Icon = OPTION_ICONS[option.icon];
            const active = selectedId === option.id;
            return (
              <Reveal key={option.id} delay={stagger.base * i}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(option.id)}
                  className={cn(
                    "h-full w-full rounded-2xl border bg-card p-7 text-left shadow-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-9",
                    active ? "border-primary/50" : "border-border hover:border-primary/50"
                  )}
                >
                  <Icon className="icon-gold mb-4" size={30} strokeWidth={1.5} aria-hidden />
                  <h3 className="font-serif-display mb-1.5 text-xl sm:text-2xl">
                    {option.prompt}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              </Reveal>
            );
          })}
        </div>

        {service && ServiceIcon && (
          <Reveal
            key={service.slug}
            className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-card"
          >
            <div className="flex items-start gap-4">
              <ServiceIcon
                className="icon-gold mt-1 shrink-0"
                size={28}
                strokeWidth={1.5}
                aria-hidden
              />
              <div>
                <h3 className="font-serif-display text-2xl">{service.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{service.tagline}</p>
              </div>
            </div>

            {project && (
              <figure className="mt-6 overflow-hidden rounded-xl border border-border">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
                <figcaption className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm">
                  <span>{project.title}</span>
                  <span className="text-foreground/60">
                    {project.client}, {project.year}
                  </span>
                </figcaption>
              </figure>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <Link to={`/services/${service.slug}`}>
                  See the service <ArrowRight className="ml-2" size={15} />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to={`/start-project?service=${service.slug}`}>Start this project</Link>
              </Button>
            </div>
          </Reveal>
        )}

        <Reveal className="mt-10 text-center">
          <Link
            to="/discover"
            className="inline-block border-b border-foreground/30 pb-1 text-xs uppercase tracking-widest-plus text-foreground/60 transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            More options
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
