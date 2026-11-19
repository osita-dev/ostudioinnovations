/**
 * sceneOrder — the single source of truth for the Home service reel's
 * order. Reordering the Home scenes is a one-line edit right here.
 */
import type { CategorySlug } from "@/types";

export const SERVICE_SCENE_ORDER: CategorySlug[] = [
  "media-events",
  "film-production",
  "content-entertainment",
  "studio-rental",
  "technology",
  "creative-services",
];
