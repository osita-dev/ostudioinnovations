/**
 * ServicePanel — one full-width cinematic panel per service in canonical
 * scene order: large number, gold icon, name, tagline, sub-service chips,
 * hover-played background media, an Explore link, and the longer copy
 * behind a "Read more" Collapsible.
 */
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ReelVideo } from "@/cinema/media/ReelVideo";
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import { getServiceMedia } from "@/data/media";
import { serviceCategories } from "@/data/services";
import { getIcon } from "@/lib/icons";
import type { ServiceCategory } from "@/types";

// Icons resolve once at module load: react-hooks/static-components rejects
// getIcon() bound to a capitalized name during render.
const PANEL_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  serviceCategories.map(
    (service): [string, LucideIcon] => [service.icon, getIcon(service.icon)]
  )
);

type ServicePanelProps = {
  service: ServiceCategory;
  /** 1-based position in SERVICE_SCENE_ORDER (01–06). */
  index: number;
};

const pad = (value: number) => String(value).padStart(2, "0");
const eyebrow = "text-xs uppercase tracking-widest-plus text-foreground/60";

export function ServicePanel({ service, index }: ServicePanelProps) {
  const media = getServiceMedia(service.slug);
  const Icon = PANEL_ICONS[service.icon];

  return (
    <section className="group relative overflow-hidden border-b border-border bg-hero-gradient">
      {media && (
        <div aria-hidden className="absolute inset-0">
          <ReelVideo
            poster={media.poster}
            alt={media.alt}
            src={media.video}
            hoverPlay
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-background/60 lg:hidden" />
          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-background via-background/85 to-background/40 lg:block" />
        </div>
      )}

      {/* Pointer passes through the copy so the media underneath can hover. */}
      <div className="pointer-events-none relative container py-20 lg:py-28">
        <div className="max-w-2xl">
          <div className="flex items-center gap-5">
            <span
              aria-hidden
              className="font-serif-display text-6xl leading-none text-foreground/30 sm:text-7xl"
            >
              {pad(index)}
            </span>
            <Icon size={32} strokeWidth={1.5} className="icon-gold" aria-hidden="true" />
          </div>

          <Reveal>
            <h2 className="mt-6 font-serif-display text-3xl sm:text-4xl">{service.name}</h2>
            <p className="mt-3 text-foreground/60">{service.tagline}</p>
          </Reveal>

          <ul className="mt-6 flex flex-wrap gap-2">
            {service.subServices.map((chip, i) => (
              <Reveal
                key={chip}
                as="li"
                delay={stagger.tight * i}
                className="glass rounded-full px-3 py-1.5 text-xs text-foreground/80"
              >
                {chip}
              </Reveal>
            ))}
          </ul>

          <Reveal delay={stagger.tight} className="mt-6">
            <Collapsible>
              <CollapsibleTrigger className="group/more pointer-events-auto inline-flex items-center gap-2 rounded-sm text-xs uppercase tracking-widest-plus text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Read more
                <ChevronDown
                  size={14}
                  className="transition-transform group-data-[state=open]/more:rotate-180"
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4 border-l border-border pl-4">
                <p className="text-sm leading-relaxed text-foreground/70">
                  {service.description}
                </p>
                <div>
                  <p className={eyebrow}>Who It's For</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">
                    {service.whoItsFor}
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Reveal>

          <Reveal delay={stagger.tight * 2} className="mt-8">
            <Link
              to={`/services/${service.slug}`}
              className="pointer-events-auto inline-block border-b border-foreground/30 pb-1 text-xs uppercase tracking-widest-plus text-foreground/60 transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Explore
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
