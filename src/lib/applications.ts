import type { CreatorApplication } from "@/types";
import { NOT_CONNECTED_MESSAGE, supabase } from "@/lib/supabase";

// ============================================================
// APPLICATION LAYER — Content Creator Applications
//
// Storage is Supabase (stage 09 / 13 Phase C1): every
// application is INSERTed into `creator_applications`, which is
// exactly what the O Studio Admin dashboard reads. The
// localStorage stub is gone.
//
// Failure contract: this function THROWS a plain-English error
// and never rejects silently — Careers.tsx keeps the form data,
// shows the error, and lets the applicant retry. Answers are
// never lost.
//
// Supabase is the ONLY submission path (stage 03): no WhatsApp
// handoff exists anywhere — the admin dashboard is the single
// view for O Studio.
// ============================================================

type ApplicationInput = Omit<CreatorApplication, "id" | "createdAt" | "status">;

export async function submitCreatorApplication(data: ApplicationInput): Promise<void> {
  if (!supabase) {
    console.error("[O Studio] Supabase env missing — see .env.example");
    throw new Error(NOT_CONNECTED_MESSAGE);
  }

  const { error } = await supabase.from("creator_applications").insert({
    full_name: data.fullName,
    phone: data.phone,
    email: data.email,
    location: data.location,
    interests: data.interests,
    experience: data.experience,
    equipment: data.equipment,
    created_before: data.createdBefore,
    work_samples: data.workSamples ?? null,
    video_idea: data.videoIdea,
    audience_interest: data.audienceInterest,
    resourcefulness: data.resourcefulness,
    collaboration: data.collaboration,
    local_availability: data.localAvailability,
    schedule: data.schedule,
    motivation: data.motivation,
    creative_challenge: data.creativeChallenge,
    practical_task: data.practicalTask,
    confirmed_accuracy: data.confirmedAccuracy,
    confirmed_ownership: data.confirmedOwnership,
    final_notes: data.finalNotes ?? null,
    status: "new",
  });

  if (error) {
    // Raw message is logged for debugging, never shown to the applicant.
    console.error("[O Studio] application insert failed:", error.message);
    throw new Error(NOT_CONNECTED_MESSAGE);
  }
}
