/**
 * ServiceScenes — renders the six service scenes in the canonical order
 * from sceneOrder.ts inside one wrapper, wiring each scene's teaser to
 * the one that follows; the last scene teases "The work" (id="work").
 */
import { serviceCategories } from "@/data/services";
import { ServiceScene } from "./ServiceScene";
import { SERVICE_SCENE_ORDER } from "./sceneOrder";

const findService = (slug: string) =>
  serviceCategories.find((service) => service.slug === slug);

export function ServiceScenes() {
  const total = SERVICE_SCENE_ORDER.length;

  return (
    <div>
      {SERVICE_SCENE_ORDER.map((slug, i) => {
        const service = findService(slug);
        if (!service) return null;
        const nextSlug = SERVICE_SCENE_ORDER[i + 1];
        const nextService = nextSlug ? findService(nextSlug) : undefined;
        const next = nextService
          ? { label: nextService.shortName, targetId: `service-${nextService.slug}` }
          : { label: "The work", targetId: "work" };
        return (
          <ServiceScene
            key={slug}
            service={service}
            index={i + 1}
            total={total}
            next={next}
          />
        );
      })}
    </div>
  );
}
