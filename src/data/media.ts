/**
 * Media registry — every poster and video the site can show, in one file.
 * Put compressed videos in public/media/ and set video here. No code changes needed.
 * Posters reuse the Unsplash URLs already present in the project for now.
 */
import type { CategorySlug, MediaAsset, PortfolioProject } from "@/types";
import { serviceCategories } from "@/data/services";

export type PageMediaKey =
  | "about"
  | "portfolio"
  | "services"
  | "journal"
  | "careers"
  | "discover"
  | "startProject"
  | "studioRental";

const reel: MediaAsset = {
  poster:
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop",
  alt: "Stage lights over a live performance",
};

const studio: MediaAsset = {
  poster:
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop",
  alt: "Interview setup with cameras and lighting",
};

const bts: MediaAsset[] = [
  {
    poster:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop",
    alt: "Crew covering a conference stage",
  },
  {
    poster:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop",
    alt: "Musician performing during a shoot",
  },
  {
    poster:
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1200&auto=format&fit=crop",
    alt: "Design work in progress on a desk",
  },
];

/** One entry per service slug — the Record type keeps it complete. */
const services: Record<CategorySlug, MediaAsset> = {
  "media-events": {
    poster:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop",
    alt: "Wedding celebration being photographed",
  },
  "film-production": {
    poster:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop",
    alt: "Documentary interview in progress",
  },
  "content-entertainment": {
    poster:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop",
    alt: "Artist performing on stage",
  },
  technology: {
    poster:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    alt: "Laptop showing a website build",
  },
  "creative-services": {
    poster:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1600&auto=format&fit=crop",
    alt: "Packaging design sample",
  },
  "studio-rental": {
    poster:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1200&auto=format&fit=crop",
    alt: "Studio space ready for a session",
  },
};

const pages: Record<PageMediaKey, MediaAsset> = {
  about: {
    poster:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop",
    alt: "Audience at a staged O Studio event",
  },
  portfolio: {
    poster:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    alt: "Wedding portrait from the portfolio",
  },
  services: {
    poster:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    alt: "Code on screen during a build",
  },
  journal: {
    poster:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    alt: "Analytics on a screen",
  },
  careers: {
    poster:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
    alt: "Team gathered at a conference",
  },
  discover: {
    poster:
      "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop",
    alt: "Event guests celebrating",
  },
  startProject: {
    poster:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
    alt: "Ceremony moment captured on the day",
  },
  studioRental: {
    poster:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop",
    alt: "Interview setup inside the studio",
  },
};

export const media = {
  reel,
  studio,
  bts,
  services,
  pages,
};

/** A service's media: its own override, else the registry entry. */
export const getServiceMedia = (slug: string): MediaAsset | undefined => {
  const service = serviceCategories.find((s) => s.slug === slug);
  if (!service) return undefined;
  return service.media ?? services[service.slug];
};

/** A project's media: its own override, else its cover image. */
export const getProjectMedia = (project: PortfolioProject): MediaAsset =>
  project.media ?? { poster: project.coverImage, alt: project.title };
