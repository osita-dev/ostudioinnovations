/**
 * ServiceScene — one full-screen act for one service: an iris-in
 * background visual under a dark scrim, a gold icon over a TitleCard
 * slate, the tagline, up to four glass chips staggering in, an Explore
 * link, and the teaser that cuts to the next scene.
 */
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Scene } from "@/cinema/scenes/Scene";
import type { NextTeaserProps } from "@/cinema/scenes/NextTeaser";
import { TitleCard } from "@/cinema/scenes/TitleCard";
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import { serviceCategories } from "@/data/services";
import { getIcon } from "@/lib/icons";
import type { ServiceCategory } from "@/types";
import { IrisLayer } from "./IrisLayer";
import { serviceVisuals } from "./serviceScenes.config";

// Icons resolve once at module load: react-hooks/static-components rejects
// getIcon() bound to a capitalized name during render (ServiceDetail keeps
// a temporary eslint override for the same pattern).
const SCENE_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  serviceCategories.map(
    (service): [string, LucideIcon] => [service.icon, getIcon(service.icon)]
  )
);

type ServiceSceneProps = {
  service: ServiceCategory;
  /** 1-based position in SERVICE_SCENE_ORDER. */
  index: number;
  total: number;
  /** Teaser pointing at the following scene ("The work" on the last). */
  next: NextTeaserProps;
};

export function ServiceScene({ service, index, total, next }: ServiceSceneProps) {
  const Visual = serviceVisuals[service.slug];
  const Icon = SCENE_ICONS[service.icon];
  const chips = service.subServices.slice(0, 4);

  return (
    <Scene
      id={`service-${service.slug}`}
      index={index}
      total={total}
      label={service.shortName}
      next={next}
      background={
        <IrisLayer>
          <Visual service={service} />
          {/* Scrim paints above the visual (siblings in order) and lets
              the pointer through so background TiltCards can hover. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/65 via-background/85 to-background/75"
          />
        </IrisLayer>
      }
    >
      {/* Pointer passes through the copy to the scene's background. */}
      <div className="pointer-events-none flex flex-col items-center px-6 text-center">
        <Icon size={32} strokeWidth={1.5} className="icon-gold mb-5" aria-hidden />
        <TitleCard className="text-center" index={index} total={total} title={service.shortName} />
        <p className="mt-4 max-w-xl text-base text-foreground/60">{service.tagline}</p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {chips.map((chip, i) => (
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
        <Reveal className="mt-7" delay={stagger.tight * chips.length}>
          <Link
            to={`/services/${service.slug}`}
            className="pointer-events-auto inline-block border-b border-foreground/30 pb-1 text-xs uppercase tracking-widest-plus text-foreground/60 transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Explore
          </Link>
        </Reveal>
      </div>
    </Scene>
  );
}
