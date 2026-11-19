/**
 * sceneMedia — the media helpers the Home scene visuals share: the
 * service's poster asset and the gallery stills pulled from the
 * service's related portfolio projects. Kept out of serviceScenes.config.ts
 * so visuals never import their own map at runtime.
 */
import { getServiceMedia, media } from "@/data/media";
import { portfolioProjects } from "@/data/portfolio";
import type { MediaAsset, ServiceCategory } from "@/types";

/** The scene's asset: the service's registry entry, reel still as safety net. */
export const assetFor = (service: ServiceCategory): MediaAsset =>
  getServiceMedia(service.slug) ?? media.reel;

/** Just the poster URL for a scene (registry is complete for all six slugs). */
export const posterFor = (service: ServiceCategory): string =>
  assetFor(service).poster;

/** Gallery stills from the projects whose categories match this service. */
export const relatedGalleryImages = (service: ServiceCategory): string[] =>
  portfolioProjects
    .filter((project) =>
      project.categories.some((category) =>
        service.relatedProjectCategories.includes(category)
      )
    )
    .flatMap((project) => project.gallery);
