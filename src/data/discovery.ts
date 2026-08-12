import type { DiscoveryOption } from "@/types";

// ============================================================
// PROJECT DISCOVERY
// "What are you trying to do?" — maps a visitor's objective to
// the relevant service categor(y/ies), per the agreed system
// behavior in Section 7.
// ============================================================

export const discoveryOptions: DiscoveryOption[] = [
  {
    id: "event",
    prompt: "I have an event.",
    description: "A wedding, anniversary, birthday, conference, or launch that needs to be covered.",
    recommendedCategories: ["media-events", "creative-services"],
    icon: "PartyPopper",
  },
  {
    id: "story",
    prompt: "I want to tell a story.",
    description: "A documentary, history project, interview series, or narrative piece.",
    recommendedCategories: ["film-production"],
    icon: "BookOpen",
  },
  {
    id: "content",
    prompt: "I need content.",
    description: "Ongoing content, music video shoots, or entertainment production.",
    recommendedCategories: ["content-entertainment"],
    icon: "Film",
  },
  {
    id: "online",
    prompt: "I need my business online.",
    description: "A website, digital product, or online presence built properly.",
    recommendedCategories: ["technology"],
    icon: "Globe",
  },
  {
    id: "brand",
    prompt: "I want to improve my brand.",
    description: "Visual identity, branded materials, printing, or design work.",
    recommendedCategories: ["creative-services"],
    icon: "Sparkles",
  },
  {
    id: "automate",
    prompt: "I want to automate something.",
    description: "An AI-powered or digital solution for your business.",
    recommendedCategories: ["technology"],
    icon: "Bot",
  },
  {
    id: "other",
    prompt: "I need something else.",
    description: "Not sure which category fits — let's talk it through.",
    recommendedCategories: [],
    icon: "MessageCircle",
  },
];
