import type { ProjectInquiry } from "@/types";
import { getServiceBySlug } from "@/data/services";
import { NOT_CONNECTED_MESSAGE, supabase } from "@/lib/supabase";

// ============================================================
// APPLICATION LAYER — Project Inquiries (Start a Project)
//
// Storage is Supabase (stage 09 / 13 Phase C1): every brief is
// INSERTed into `project_inquiries`, which is what the O Studio
// Admin dashboard reads. The localStorage stub is gone.
//
// Failure contract: THROWS a plain-English error — StartProject
// keeps the visitor's answers, shows the error inline, and lets
// them retry. The brief is never lost.
//
// Supabase is the ONLY submission path (stage 03): no WhatsApp
// handoff exists anywhere — the admin dashboard is the single
// view for O Studio.
// ============================================================

type InquiryInput = Omit<ProjectInquiry, "id" | "createdAt" | "status">;

export async function submitProjectInquiry(data: InquiryInput): Promise<void> {
  if (!supabase) {
    console.error("[O Studio] Supabase env missing — see .env.example");
    throw new Error(NOT_CONNECTED_MESSAGE);
  }

  // Store the readable service name ("Film & Production"), not the
  // URL slug — matches how the admin displays and seeds this field.
  const serviceName = getServiceBySlug(data.service)?.name ?? data.service;

  const { error } = await supabase.from("project_inquiries").insert({
    service: serviceName,
    project_type: data.projectType,
    event_date: data.date ?? null,
    location: data.location ?? null,
    expected_guests: data.expectedGuests ?? null,
    budget_range: data.budgetRange,
    description: data.description,
    additional_requirements: data.additionalRequirements ?? null,
    name: data.name,
    phone: data.phone,
    email: data.email,
    status: "new",
  });

  if (error) {
    console.error("[O Studio] inquiry insert failed:", error.message);
    throw new Error(NOT_CONNECTED_MESSAGE);
  }
}
