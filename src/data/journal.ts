import type { JournalPost } from "@/types";

// ============================================================
// JOURNAL
// Sample entries structured for authority + SEO + storytelling.
// Replace with real O Studio content when ready.
// ============================================================

export const journalPosts: JournalPost[] = [
  {
    id: "post-001",
    slug: "behind-the-adeyemi-wedding",
    title: "Behind the Scenes: The Adeyemi Wedding",
    excerpt:
      "A look at how our team planned and executed full-day coverage for a 400-guest wedding across three locations.",
    category: "behind-the-scenes",
    date: "2025-11-02",
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop",
    content: [
      "Every large wedding is really three or four events stitched into one day — and the Adeyemi wedding was no exception. Planning began three weeks out, with a full site visit to each location.",
      "Our coverage plan split the day into clearly defined blocks: preparation, traditional ceremony, church service, and reception. Each block had its own shot list and a dedicated team member responsible for it.",
      "The biggest challenge wasn't the photography itself — it was movement. Getting a six-person crew between three locations without disrupting the family's schedule required tight coordination with the couple's planner.",
      "The result: over 400 edited photographs and a four-minute highlight film delivered within two weeks, ready for the family to share.",
    ],
  },
  {
    id: "post-002",
    slug: "choosing-between-website-and-digital-solution",
    title: "Website or Digital Solution? How to Know What You Actually Need",
    excerpt:
      "Not every business problem is solved by a website. Here's how we help clients figure out the right technology fit.",
    category: "technology",
    date: "2025-10-14",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    content: [
      "A surprising number of businesses come to us asking for 'a website' when what they actually need is something more specific — a booking system, an internal tool, or an automation that saves time on a repetitive task.",
      "Before we design anything, we start with a simple question: what should this actually do for your business? A brochure-style website solves visibility. A digital solution solves a workflow problem.",
      "This is also where AI solutions come in — not as a buzzword, but as a practical layer that can handle things like lead qualification, content generation, or customer support at a scale a small team can't manage manually.",
      "The right starting point is rarely the technology itself. It's the outcome you're trying to reach.",
    ],
  },
  {
    id: "post-003",
    slug: "documentary-storytelling-voices-of-lagos-island",
    title: "What We Learned Producing 'Voices of Lagos Island'",
    excerpt:
      "Documentary work moves at a different pace than event coverage. Here's what four weeks of interviews taught us.",
    category: "case-study",
    date: "2025-08-22",
    readTime: "6 min read",
    coverImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop",
    content: [
      "Documentary production starts long before the camera turns on. For 'Voices of Lagos Island', two full weeks went into identifying subjects and building enough trust for people to speak openly about their history.",
      "Unlike event coverage, where the day dictates the pace, documentary work is shaped in the edit. We recorded far more material than made the final 22 minutes — the story only became clear once we could see everything together.",
      "The biggest lesson: a good documentary isn't assembled from footage. It's built from a narrative decision made early, then supported by the footage you go out and capture.",
    ],
  },
  {
    id: "post-004",
    slug: "branding-and-print-working-together",
    title: "Why Branding and Print Shouldn't Be Separate Vendors",
    excerpt:
      "Design that looks right on screen doesn't always translate to print. Here's why we handle both under one roof.",
    category: "insights",
    date: "2025-07-05",
    readTime: "3 min read",
    coverImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1600&auto=format&fit=crop",
    content: [
      "A logo that looks sharp on a screen can fall apart on a printed gift box if color, material, and scale aren't considered from the start.",
      "When branding and print are handled by separate vendors, that disconnect becomes the client's problem to manage. We treat it as one project instead — the same team that designs the identity oversees how it's produced physically.",
      "It's a small operational decision that avoids a very common and very avoidable outcome: a brand that looks different in real life than it does on a screen.",
    ],
  },
];

export const getPostBySlug = (slug: string) =>
  journalPosts.find((p) => p.slug === slug);
