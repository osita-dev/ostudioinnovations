/**
 * DetailHero — the service's opening title card: full-bleed reel still
 * behind a scrim, breadcrumb back to Services, gold icon, SplitText name
 * and tagline. Sets the filmic tone the sections below continue.
 */
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ReelVideo } from "@/cinema/media/ReelVideo";
import { SplitText } from "@/cinema/motion/SplitText";
import { getServiceMedia } from "@/data/media";
import { serviceCategories } from "@/data/services";
import { getIcon } from "@/lib/icons";
import type { ServiceCategory } from "@/types";

// Icons resolve once at module load: react-hooks/static-components rejects
// getIcon() bound to a capitalized name during render.
const HERO_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  serviceCategories.map(
    (service): [string, LucideIcon] => [service.icon, getIcon(service.icon)]
  )
);

type DetailHeroProps = {
  service: ServiceCategory;
};

export function DetailHero({ service }: DetailHeroProps) {
  const media = getServiceMedia(service.slug);
  const Icon = HERO_ICONS[service.icon];

  return (
    <section className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden pb-16 pt-28">
      {media && (
        <div aria-hidden className="absolute inset-0">
          <ReelVideo
            poster={media.poster}
            alt={media.alt}
            src={media.video}
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        </div>
      )}

      <div className="relative container">
        <p className="text-xs uppercase tracking-widest-plus text-foreground/60">
          <Link
            to="/services"
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Services
          </Link>{" "}
          / {service.shortName}
        </p>

        <div className="mt-6 flex items-start gap-5">
          <Icon
            size={40}
            strokeWidth={1.5}
            className="icon-gold mt-1 shrink-0"
            aria-hidden="true"
          />
          <div>
            <h1 className="font-serif-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              <SplitText text={service.name} />
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-foreground/60">{service.tagline}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
