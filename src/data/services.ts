import type { ServiceCategory } from "@/types";

// ============================================================
// SERVICE CATEGORIES
// Structured per the agreed sitemap (Section 4): each category
// is presented as an understandable solution — what it is, who
// it's for, what's included, deliverables, process, and a
// starting-price placeholder (to be confirmed by O Studio).
// ============================================================

export const serviceCategories: ServiceCategory[] = [
  {
    id: "svc-media-events",
    slug: "media-events",
    name: "Media & Events",
    shortName: "Media & Events",
    tagline: "Your moments, captured with intention.",
    description:
      "From weddings and anniversaries to corporate events and product launches, O Studio documents your event as it happens — professionally, unobtrusively, and beautifully.",
    whoItsFor:
      "Individuals and organizations hosting an event — weddings, anniversaries, birthdays, conferences, product launches, and corporate functions — who want the moment captured properly.",
    included: [
      "Pre-event consultation and shot planning",
      "On-site photography and/or videography",
      "Coverage by an experienced O Studio team",
      "Post-production editing and color grading",
      "Highlight reel where applicable",
    ],
    deliverables: [
      "Edited high-resolution photographs",
      "Edited event video / highlight reel",
      "Digital delivery via secure online gallery",
    ],
    process: [
      { title: "Consultation", description: "We learn about your event, timeline, and what matters most to capture." },
      { title: "Planning", description: "A shot list and coverage plan is agreed before the day." },
      { title: "Coverage", description: "Our team covers the event with minimal disruption to your guests." },
      { title: "Post-Production", description: "Selected images and footage are edited to O Studio's standard." },
      { title: "Delivery", description: "Final deliverables are shared digitally within the agreed timeline." },
    ],
    subServices: [
      "Photography",
      "Videography",
      "Event Coverage",
      "Birthdays, Weddings & Anniversaries",
      "Church Events",
      "Post-Event Treats",
    ],
    startingPrice: "Contact for a quote",
    relatedProjectCategories: ["photography", "videography", "events"],
    icon: "Camera",
  },
  {
    id: "svc-film-production",
    slug: "film-production",
    name: "Film & Production",
    shortName: "Film & Production",
    tagline: "Stories worth telling, told properly.",
    description:
      "O Studio produces films, documentaries, and interview-driven projects that go beyond a simple recording — structured storytelling built around a real narrative.",
    whoItsFor:
      "Individuals, families, organizations, and institutions with a story, history, or message that deserves a proper cinematic treatment.",
    included: [
      "Story and narrative development",
      "Pre-production planning and research",
      "Professional filming across single or multiple locations",
      "Interview direction and setup",
      "Editing, sound design, and color grading",
    ],
    deliverables: [
      "Final edited film or documentary",
      "Interview footage (raw and edited where agreed)",
      "Short-form cutdowns for social/digital use where applicable",
    ],
    process: [
      { title: "Discovery", description: "We understand the story you want told and who it's for." },
      { title: "Pre-Production", description: "Research, scripting/outline, and logistics are locked in." },
      { title: "Production", description: "Filming takes place — interviews, footage, and supporting material." },
      { title: "Post-Production", description: "Editing, narration, sound, and color bring the story together." },
      { title: "Delivery", description: "The finished piece is delivered in the required formats." },
    ],
    subServices: ["Film Production", "Documentaries", "History Projects", "Interviews", "Storytelling"],
    startingPrice: "Contact for a quote",
    relatedProjectCategories: ["documentary", "videography"],
    icon: "Clapperboard",
  },
  {
    id: "svc-content-entertainment",
    slug: "content-entertainment",
    name: "Content & Entertainment",
    shortName: "Content & Entertainment",
    tagline: "Content built to be seen — and felt.",
    description:
      "O Studio produces content for creators, artists, and brands — from social content and music video shoots to broader entertainment production.",
    whoItsFor:
      "Musicians, creators, and brands who need consistent, high-quality content or a specific entertainment production such as a music video.",
    included: [
      "Concept development",
      "Production planning and location/talent coordination",
      "Filming and/or photography",
      "Editing and post-production",
      "Format optimization for the intended platform",
    ],
    deliverables: [
      "Edited content pieces (video and/or photo)",
      "Platform-ready exports",
      "Raw files where agreed",
    ],
    process: [
      { title: "Concept", description: "We shape the creative direction with you." },
      { title: "Planning", description: "Locations, talent, and schedule are organized." },
      { title: "Production", description: "The shoot happens — on set, on location, or in studio." },
      { title: "Post-Production", description: "Editing and finishing bring the content to life." },
      { title: "Delivery", description: "Final files are delivered ready for release." },
    ],
    subServices: ["Content Creation", "Music", "Music Video Shoots", "Entertainment Projects", "Podcast Production"],
    startingPrice: "Contact for a quote",
    relatedProjectCategories: ["videography", "photography"],
    icon: "Music",
  },
  {
    id: "svc-technology",
    slug: "technology",
    name: "Technology & Digital Solutions",
    shortName: "Technology",
    tagline: "Where your business meets the internet.",
    description:
      "O Studio designs and builds websites, apps, and digital/AI solutions — giving businesses a real, working online presence rather than just a template.",
    whoItsFor:
      "Businesses and individuals who need a website, a mobile app, a digital product, or an AI-powered solution built properly and maintained going forward.",
    included: [
      "Discovery and requirements gathering",
      "Design and structure planning",
      "Development and implementation",
      "Testing and quality checks",
      "Launch support",
    ],
    deliverables: [
      "A live, working website or digital solution",
      "Source files / access where agreed",
      "Basic handover documentation",
    ],
    process: [
      { title: "Discovery", description: "We understand your business, goals, and requirements." },
      { title: "Design", description: "Structure and visual direction are planned and agreed." },
      { title: "Development", description: "The solution is built to specification." },
      { title: "Testing", description: "Everything is checked before going live." },
      { title: "Launch", description: "The solution goes live, with support as needed." },
    ],
    subServices: ["Website Design & Development", "AI Solutions", "App Development", "Digital Solutions"],
    startingPrice: "Contact for a quote",
    relatedProjectCategories: ["websites", "ai-digital"],
    icon: "Code",
  },
  {
    id: "svc-creative-services",
    slug: "creative-services",
    name: "Creative Services",
    shortName: "Creative Services",
    tagline: "Design and branding that carries your identity.",
    description:
      "O Studio handles the design layer of your brand — from graphic design and corporate branding to gift packs and souvenirs.",
    whoItsFor:
      "Businesses and individuals who need graphic design, corporate branding, or gift packs and souvenirs produced to a high standard.",
    included: [
      "Design consultation",
      "Concept and draft design",
      "Revisions based on feedback",
      "Final files in required formats",
      "Print coordination where applicable",
    ],
    deliverables: [
      "Final design files",
      "Brand guideline where applicable",
      "Printed materials where ordered",
    ],
    process: [
      { title: "Brief", description: "We understand your brand and what you need designed." },
      { title: "Concept", description: "Initial design directions are presented." },
      { title: "Refinement", description: "Feedback is incorporated into a final direction." },
      { title: "Finalization", description: "Final files are prepared and approved." },
      { title: "Delivery", description: "Files are delivered, or materials are printed and produced." },
    ],
    subServices: ["Graphic Design", "Gift Packs", "Souvenirs", "Corporate Branding and Visual Material"],
    startingPrice: "Contact for a quote",
    relatedProjectCategories: ["design", "branding"],
    icon: "Palette",
  },
  {
    id: "svc-studio-rental",
    slug: "studio-rental",
    name: "Studio Rental",
    shortName: "Studio Rental",
    tagline: "The space is ready — bring the idea.",
    description:
      "O Studio rents out its studio spaces by the session — podcast and content rooms, a photo studio, and a film set — for creators, brands, and teams who need a professional space without building one.",
    whoItsFor:
      "Podcasters, content creators, brands, and production teams who need a professional space for a session, a series, or an ongoing project — without the cost of building one.",
    included: [
      "Podcast/Content Rooms",
      "Photo Studio",
      "Film set, etc.",
      "Basic setup guidance before your session",
    ],
    deliverables: [
      "The studio space for the agreed booking window",
      "A working setup, checked before your session",
      "Support during the booking if something isn't clear",
    ],
    process: [
      { title: "Request", description: "Tell us which space, the date, and what you're shooting." },
      { title: "Availability", description: "We confirm availability and agree the booking window and rate." },
      { title: "Preparation", description: "The space is set up and checked before your session." },
      { title: "Session", description: "You shoot. Our team stays reachable if you need support." },
      { title: "Wrap", description: "Session ends, the space is cleared, and the booking closes." },
    ],
    subServices: ["Podcast/Content Rooms", "Photo Studio", "Film set, etc."],
    startingPrice: "Contact for a quote",
    relatedProjectCategories: ["photography", "videography", "events"],
    icon: "Settings",
  },
];

export const getServiceBySlug = (slug: string) =>
  serviceCategories.find((s) => s.slug === slug);
