import type { ProjectInquiry } from "@/types";

// ============================================================
// APPLICATION LAYER — Project Inquiry handling
//
// This implements the Section 7 submission behavior:
//   1. Validate (handled by the form's zod schema)
//   2. Submit the inquiry
//   3. Store the project request
//   4. Confirm to the user
//   5. Make the request available to O Studio
//   6. Trigger notifications where implemented
//
// PHASE NOTE: There is no live backend in this stage of the
// build, so step 3/5 are implemented with a local persistence
// stub (localStorage) standing in for the future Data Layer
// (Section 10). This keeps the real request/response contract
// intact — swapping this module for a real API call (e.g.
// POST /api/inquiries) is a drop-in replacement later, with no
// changes needed to the form or UI layer.
// ============================================================

const STORAGE_KEY = "ostudio_project_inquiries";

function readInquiries(): ProjectInquiry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProjectInquiry[]) : [];
  } catch {
    return [];
  }
}

function writeInquiries(inquiries: ProjectInquiry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
  } catch {
    // Storage unavailable (e.g. private browsing) — fail silently,
    // the inquiry is still logged to console for this phase.
  }
}

export function submitProjectInquiry(
  data: Omit<ProjectInquiry, "id" | "createdAt" | "status">
): ProjectInquiry {
  const inquiry: ProjectInquiry = {
    ...data,
    id: `inq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };

  const existing = readInquiries();
  writeInquiries([...existing, inquiry]);

  // Stand-in for a real notification trigger (email/Slack/CRM webhook).
  // eslint-disable-next-line no-console
  console.info("[O Studio] New structured project inquiry received:", inquiry);

  return inquiry;
}

export function getStoredInquiries(): ProjectInquiry[] {
  return readInquiries();
}
