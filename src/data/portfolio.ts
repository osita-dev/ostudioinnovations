import type { PortfolioProject } from "@/types";

// ============================================================
// PORTFOLIO PROJECTS
// Sample entries built to the agreed Portfolio Project schema.
// Replace with real O Studio project content/media when ready —
// the structure below is production-ready as-is.
// ============================================================

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "proj-001",
    slug: "adeyemi-wedding",
    title: "The Adeyemi Wedding",
    client: "Adeyemi Family",
    year: 2025,
    categories: ["photography", "videography", "events"],
    serviceCategory: "media-events",
    description:
      "Full-day wedding coverage from traditional ceremony through reception — photography and cinematic highlight film for a 400-guest celebration in Lagos.",
    coverImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
    ],
    deliverables: ["400+ edited photographs", "4-minute highlight film", "Full ceremony video"],
    results: "Delivered within 2 weeks; used across the family's traditional and church ceremony announcements.",
    behindTheScenes: "A 6-person crew covered three locations across a single day, coordinating around a tight ceremony schedule.",
    testimonial: {
      quote: "O Studio understood exactly what our families wanted captured, without getting in the way of the day itself.",
      author: "Bisi Adeyemi",
      role: "Client",
    },
  },
  {
    id: "proj-002",
    slug: "lagos-tech-summit",
    title: "Lagos Tech Summit 2025",
    client: "Lagos Tech Summit",
    year: 2025,
    categories: ["photography", "videography", "events"],
    serviceCategory: "media-events",
    description:
      "Two-day conference coverage — keynote photography, panel videography, and same-day recap content for social distribution.",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
    ],
    deliverables: ["Event photography set", "Same-day recap video", "Speaker highlight clips"],
    results: "Recap video published within 24 hours, driving early registration for the following year's summit.",
    testimonial: {
      quote: "Fast turnaround, professional crew, and content we could use immediately.",
      author: "Summit Organizing Team",
    },
  },
  {
    id: "proj-003",
    slug: "voices-of-lagos-island",
    title: "Voices of Lagos Island",
    client: "Independent / Cultural Project",
    year: 2024,
    categories: ["documentary", "videography"],
    serviceCategory: "film-production",
    description:
      "A short documentary preserving the oral histories of long-time residents of Lagos Island, produced across four weeks of interviews and archival research.",
    coverImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1200&auto=format&fit=crop",
    ],
    deliverables: ["22-minute documentary film", "5 individual interview cutdowns", "Photo archive"],
    results: "Screened at a local community event and shared across cultural heritage platforms.",
    behindTheScenes: "Research and subject identification took two weeks before filming began.",
  },
  {
    id: "proj-004",
    slug: "nova-fintech-launch",
    title: "Nova Fintech — Brand & Website Launch",
    client: "Nova Fintech",
    year: 2025,
    categories: ["websites", "branding", "design"],
    serviceCategory: "technology",
    description:
      "Full brand identity and a marketing website built to support a fintech product launch — from logo through a responsive, conversion-focused site.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    ],
    deliverables: ["Brand identity + guideline", "Marketing website", "Launch collateral"],
    results: "Website launched alongside the product, supporting early sign-ups.",
    testimonial: {
      quote: "O Studio handled our brand and website as one connected project instead of two disconnected vendors.",
      author: "Nova Fintech Founding Team",
    },
  },
  {
    id: "proj-005",
    slug: "kesi-music-video",
    title: "KESI — \"Homebound\" Music Video",
    client: "KESI",
    year: 2025,
    categories: ["videography", "photography"],
    serviceCategory: "content-entertainment",
    description:
      "Concept, production, and post for an independent artist's single release, shot across two locations in a single day.",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop",
    ],
    deliverables: ["Full music video", "Behind-the-scenes reel", "Cover art photography"],
    results: "Released alongside the single across streaming and social platforms.",
  },
  {
    id: "proj-006",
    slug: "amara-gift-collection",
    title: "Amara Gift Collection — Packaging & Print",
    client: "Amara",
    year: 2024,
    categories: ["design", "branding"],
    serviceCategory: "creative-services",
    description:
      "Custom gift packaging design and print production for a seasonal retail collection.",
    coverImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1200&auto=format&fit=crop",
    ],
    deliverables: ["Packaging design files", "Print production", "Product photography"],
    results: "Full seasonal collection produced and delivered ahead of the retail window.",
  },
];

export const getProjectBySlug = (slug: string) =>
  portfolioProjects.find((p) => p.slug === slug);

export const portfolioFilters = [
  { label: "All", value: "all" },
  { label: "Photography", value: "photography" },
  { label: "Videography", value: "videography" },
  { label: "Events", value: "events" },
  { label: "Documentary", value: "documentary" },
  { label: "Design", value: "design" },
  { label: "Branding", value: "branding" },
  { label: "Websites", value: "websites" },
  { label: "AI / Digital", value: "ai-digital" },
];
