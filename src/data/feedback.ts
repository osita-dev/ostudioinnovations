// ============================================================
// O Studio Innovations — Launch Feedback (/feedback)
// 10 questions across 4 short steps. Question text and option
// ordering live here so the page component stays focused on
// layout and behaviour (same convention as careerApplication).
// ============================================================

/** Intro copy shown at the top of the page (spec-verbatim). */
export const feedbackIntro =
  "Thank you for joining our launch. Your honest answers help us improve. There are no right or wrong answers, and it takes about 2 minutes. Your photos are on their way and will be sent separately.";

/** Shown in a small line near the submit button. */
export const privacyNote =
  "Your answers are only used to help us improve, and we won't share them publicly.";

/** Success screen copy (spec-verbatim). */
export const thankYouMessage =
  "Thank you! Your feedback means a lot to us. We'll be in touch with your photos soon.";

// --- Contact used in the photo-consent note ([CONTACT]) ---

export const contactWhatsApp = "+234 704 225 1787";
export const contactWhatsAppUrl = "https://wa.me/2347042251787";
export const contactEmail = "info@ostudioinnovations.com";

// --- Question options -------------------------------

/** Q1 — how did you hear about the launch (Other reveals a text box). */
export const howHeardOptions = [
  "Invite",
  "Saw us in the mobile space",
  "A friend",
  "Social media",
  "Other",
];

/** Q4 — which service interests you most. */
export const serviceOptions = [
  "Content room",
  "Photography",
  "Event coverage",
  "Tech & AI",
  "Not sure yet",
];

/** Q9 — would you use our services or recommend us. */
export const wouldUseOptions = ["Yes", "Maybe", "Not yet"];

/** Photo consent — required, and nothing is ever pre-selected. */
export const photoConsentOptions = ["Yes", "No"];

/** Last section — optional contact permission. */
export const contactOptions = ["Yes", "No"];

// --- Steps --------------------------------------------

export const feedbackSections = [
  {
    short: "Warm-up",
    title: "Section 1 — Warm-up",
    purpose: "Two quick taps to get started.",
  },
  {
    short: "The space",
    title: "Section 2 — The Space & the Business",
    purpose: "Help us see the studio the way you saw it.",
  },
  {
    short: "Better",
    title: "Section 3 — Improvement",
    purpose: "One honest thought each is plenty.",
  },
  {
    short: "Photos",
    title: "Section 4 — Last Bit & Your Photos",
    purpose: "Anything you didn't get to say, then your photo choice — then you're done.",
  },
];
