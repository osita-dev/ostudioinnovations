import type { FeedbackResponse } from "@/types";
import { NOT_CONNECTED_MESSAGE, supabase } from "@/lib/supabase";

// ============================================================
// APPLICATION LAYER — Launch Feedback
//
// Storage is Supabase (same rule as every other public form):
// each submission is INSERTed into `feedback_responses` — one
// row per guest. RLS (supabase/feedback_migration.sql) allows
// anon INSERT and nothing else, so answers can never be read
// or edited from the browser.
//
// Failure contract: this function THROWS a plain-English error
// and never rejects silently — Feedback.tsx keeps the answers
// on screen, shows the error, and lets the guest retry.
//
// No tracking, no analytics: this is the only place the form
// data goes.
// ============================================================

type FeedbackInput = Omit<FeedbackResponse, "id" | "createdAt">;

// Server-side limits (defence in depth — the form validates first).
const SHORT_LIMIT = 300;
const LONG_LIMIT = 1500;

/** Trim, drop empties, and hard-cap length so no column can be flooded. */
function clean(value: string | undefined, limit: number): string | null {
  const text = (value ?? "").trim();
  if (!text) return null;
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
}

export async function submitFeedback(data: FeedbackInput): Promise<void> {
  if (!supabase) {
    console.error("[O Studio] Supabase env missing — see .env.example");
    throw new Error(NOT_CONNECTED_MESSAGE);
  }

  // Reject empty / incomplete submissions outright: the two
  // required answers (rating + photo consent) must be present.
  if (!data.rating || data.rating < 1 || data.rating > 5 || !data.photoConsent?.trim()) {
    throw new Error("Please answer the required questions before sending.");
  }

  const { error } = await supabase.from("feedback_responses").insert({
    guest_id: clean(data.guestId, 100),
    name: clean(data.name, 120),
    phone: clean(data.phone, 40),
    how_heard: clean(data.howHeard, 120),
    how_heard_other: clean(data.howHeardOther, SHORT_LIMIT),
    rating: data.rating,
    what_we_do: clean(data.whatWeDo, SHORT_LIMIT),
    top_service: clean(data.topService, 120),
    stood_out: clean(data.stoodOut, SHORT_LIMIT),
    do_better: clean(data.doBetter, SHORT_LIMIT),
    expected_missing: clean(data.expectedMissing, SHORT_LIMIT),
    add_one_thing: clean(data.addOneThing, SHORT_LIMIT),
    would_use: clean(data.wouldUse, 60),
    what_would_change: clean(data.whatWouldChange, SHORT_LIMIT),
    anything_else: clean(data.anythingElse, LONG_LIMIT),
    questions: clean(data.questions, SHORT_LIMIT),
    photo_consent: data.photoConsent.trim(),
    contact_consent: clean(data.contactConsent, 10),
    status: "new",
  });

  if (error) {
    // Raw message is logged for debugging, never shown to the guest.
    console.error("[O Studio] feedback insert failed:", error.message);
    throw new Error(NOT_CONNECTED_MESSAGE);
  }
}
