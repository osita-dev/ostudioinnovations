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
  | "creative-services"
  | "studio-rental";

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

// Content creator application — submitted via the /careers page.
// Mirrors the 20-question application form, grouped into the
// form's six sections.
export interface CreatorApplication {
  id: string;
  createdAt: string;
  // Section 1 — personal information (Q1–Q4)
  fullName: string;
  phone: string;
  email: string;
  location: string;
  // Section 2 — creative interests (Q5–Q7)
  interests: string[];
  experience: string;
  equipment: string[];
  // Section 3 — creative portfolio (Q8–Q12)
  createdBefore: string;
  workSamples?: string;
  videoIdea: string;
  audienceInterest: string;
  resourcefulness: string;
  // Section 4 — collaboration and availability (Q13–Q16)
  collaboration: string;
  localAvailability: string;
  schedule: string;
  motivation: string;
  // Section 5 — creative challenge (Q17–Q18)
  creativeChallenge: string;
  practicalTask: string;
  // Section 6 — final confirmation (Q19–Q20)
  confirmedAccuracy: boolean;
  confirmedOwnership: boolean;
  finalNotes?: string;
  status: "new" | "reviewing" | "shortlisted" | "contacted" | "closed";
}

// Launch feedback — submitted via the /feedback page after the
// soft launch of the innovation studio. One row per guest.
export interface FeedbackResponse {
  id: string;
  createdAt: string;
  guestId?: string; // ?id= on personalised links — matches the guest list
  name?: string;
  phone?: string;
  // Q1–Q2
  howHeard?: string;
  howHeardOther?: string; // free text when Q1 = "Other"
  rating: number; // required, 1–5
  // Q3–Q5
  whatWeDo?: string;
  topService?: string;
  stoodOut?: string;
  // Q6–Q8
  doBetter?: string;
  expectedMissing?: string;
  addOneThing?: string;
  // Q9–Q10
  wouldUse?: string;
  whatWouldChange?: string; // revealed when Q9 = "Maybe" / "Not yet"
  anythingElse?: string;
  questions?: string; // "Any questions for us?" (optional)
  // Consent — required, nothing is assumed
  photoConsent: string;
  contactConsent?: string;
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
