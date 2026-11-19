/**
 * serviceScenes.config — which visual component each Home service scene
 * renders, keyed by slug; the Record type keeps the map complete. Scene
 * order lives in sceneOrder.ts, media helpers in sceneMedia.ts.
 */
import type { ComponentType } from "react";
import type { CategorySlug, ServiceCategory } from "@/types";
import { MediaEventsVisual } from "./visuals/MediaEventsVisual";
import { FilmProductionVisual } from "./visuals/FilmProductionVisual";
import { ContentEntertainmentVisual } from "./visuals/ContentEntertainmentVisual";
import { StudioRentalVisual } from "./visuals/StudioRentalVisual";
import { TechSceneVisual } from "./visuals/TechSceneVisual";
import { CreativeServicesVisual } from "./visuals/CreativeServicesVisual";

export type VisualProps = { service: ServiceCategory };

export const serviceVisuals: Record<CategorySlug, ComponentType<VisualProps>> = {
  "media-events": MediaEventsVisual,
  "film-production": FilmProductionVisual,
  "content-entertainment": ContentEntertainmentVisual,
  "studio-rental": StudioRentalVisual,
  technology: TechSceneVisual,
  "creative-services": CreativeServicesVisual,
};
