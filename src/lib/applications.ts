import type { CreatorApplication } from "@/types";

// ============================================================
// APPLICATION LAYER — Content Creator Applications
//
// Submission behavior:
//   1. Validate (handled by the page's zod schema)
//   2. Accept the application
//   3. Store the application
//   4. Confirm to the applicant
//   5. Make the application available to O Studio
//
// DELIVERY SEAM
// There is no live backend yet, so step 3/5 currently use a
// localStorage stub — the same stand-in used by inquiries.ts.
// Applications are therefore only visible on the applicant's own
// device until a real transport is wired in.
//
// To make submissions land at O Studio, replace the body of
// `deliver()` below with a POST to your endpoint of choice.
// The function signature is the whole contract, so nothing in
// Careers.tsx needs to change when that happens:
//   - Google Apps Script  → fetch(url, { method: "POST" })
//   - Formspree/Web3Forms → fetch(endpoint, { method: "POST" })
//   - Vercel API route     → fetch("/api/applications")
//
// Keep it non-blocking and let it resolve after the UI confirms,
// so a slow or failed network call never strands the applicant
// on a loading screen.
// ============================================================

const STORAGE_KEY = "ostudio_creator_applications";

function readApplications(): CreatorApplication[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CreatorApplication[]) : [];
  } catch {
    return [];
  }
}

function writeApplications(applications: CreatorApplication[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch {
    // Storage unavailable (e.g. private browsing) — fail silently.
  }
}

/**
 * Deliver an application to O Studio.
 * Intentionally fire-and-forget: the applicant UI must never
 * depend on this resolving.
 */
async function deliver(application: CreatorApplication): Promise<void> {
  // --- Wire a real endpoint here (see note above). ---
  void application;
}

export async function submitCreatorApplication(
  data: Omit<CreatorApplication, "id" | "createdAt" | "status">
): Promise<CreatorApplication> {
  const application: CreatorApplication = {
    ...data,
    id: `app-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };

  const existing = readApplications();
  writeApplications([...existing, application]);

  void deliver(application).catch(() => {
    // Delivery is handled separately from the applicant's confirmation.
  });

  // Stand-in for a real notification trigger (email/Slack/CRM webhook).
  console.info("[O Studio] New content creator application received:", application);

  return application;
}

export function getStoredApplications(): CreatorApplication[] {
  return readApplications();
}