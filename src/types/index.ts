// ============================================================
// O Studio Innovations — Core Domain Types
// Mirrors the agreed data model (Section 8) for the current
// implementation stage (public layer + structured inquiries).
// ============================================================

export type CategorySlug =
  | "media-events"
  | "film-production"
  | "content-entertainment"
  | "technology"
  | "creative-services";

export interface ServiceCategory {
  id: string;
  slug: CategorySlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  whoItsFor: string;
  included: string[];
  deliverables: string[];
  process: { title: string; description: string }[];
  subServices: string[];
  startingPrice?: string; // display only — placeholder until real pricing supplied by O Studio
  relatedProjectCategories: string[]; // portfolio filter slugs this service maps to
  icon: string; // lucide icon name
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: number;
  categories: string[]; // portfolio filter slugs, e.g. ["photography","events"]
  serviceCategory: CategorySlug;
  description: string;
  coverImage: string;
  gallery: string[];
  deliverables: string[];
  results?: string;
  behindTheScenes?: string;
  testimonial?: {
    quote: string;
    author: string;
    role?: string;
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "booking" | "pricing" | "delivery" | "services" | "general";
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "case-study" | "behind-the-scenes" | "insights" | "technology";
  date: string;
  readTime: string;
  coverImage: string;
  content: string[];
}

export interface DiscoveryOption {
  id: string;
  prompt: string;
  description: string;
  recommendedCategories: CategorySlug[];
  icon: string;
}

// Structured project inquiry — matches the "Project Inquiry" entity
export interface ProjectInquiry {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  service: CategorySlug | "";
  projectType: string;
  date?: string;
  location?: string;
  expectedGuests?: string;
  budgetRange: string;
  description: string;
  additionalRequirements?: string;
  status: "new" | "reviewing" | "quoted" | "booked" | "closed";
}
