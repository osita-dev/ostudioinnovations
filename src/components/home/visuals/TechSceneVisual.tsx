/**
 * TechSceneVisual — the Technology scene's visual: the 3D film ring when the
 * device allows it, TechVisual's static grid as the fallback. The poster pool
 * is built here so the cinema three/ layer stays free of ostudio content.
 */
import { useMemo } from "react";
import { FilmRingScene } from "@/cinema/three/FilmRingScene";
import { media } from "@/data/media";
import { portfolioProjects } from "@/data/portfolio";
import type { ServiceCategory } from "@/types";
import { posterFor, relatedGalleryImages } from "../sceneMedia";
import type { VisualProps } from "../serviceScenes.config";
import { TechVisual } from "./TechVisual";

// The ring draws this many slots (set by three/RingFrames geometry).
const SLOTS = 12;

// Posters render as 512px-max textures; swap Unsplash's width param down.
const downscale = (url: string) => url.replace(/w=\d+/, "w=512");

const posterPool = (service: ServiceCategory): string[] =>
  [
    ...new Set([
      posterFor(service),
      ...relatedGalleryImages(service),
      ...portfolioProjects.map((project) => project.coverImage),
      ...media.bts.map((asset) => asset.poster),
    ].map(downscale)),
  ].slice(0, SLOTS);

export function TechSceneVisual({ service }: VisualProps) {
  // Cycled to the ring's slot count so every frame carries a still.
  const posters = useMemo(() => {
    const pool = posterPool(service);
    return Array.from({ length: SLOTS }, (_, i) => pool[i % pool.length]);
  }, [service]);

  return <FilmRingScene posters={posters} fallback={<TechVisual />} />;
}
