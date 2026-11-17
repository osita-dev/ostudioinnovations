import { NOT_CONNECTED_MESSAGE, supabase } from "@/lib/supabase";

// ============================================================
// APPLICATION LAYER — Studio Rental booking requests
//
// A booking is a REQUEST, not a transaction. There is no system
// pricing and no payment taken here: the request INSERTs into
// `studio_bookings` with status "pending" and the O Studio team
// replies with availability and a quote.
//
// Two modes carry the real distinction the page is built around:
//   "space" — the guest brings their own crew and gear
//   "crew"  — O Studio shoots it and delivers the files
//
// The write is schema-tolerant. It always lands a readable
// summary on the original columns so nothing is ever lost, and
// additionally attempts the structured columns once the migration
// in supabase/studio_bookings_migration.sql has been run. If
// those columns are absent it falls back to the original shape
// instead of failing the booking.
// ============================================================

export type StudioMode = "space" | "crew";

export interface StudioBookingInput {
  mode: StudioMode;
  studio: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  partySize: number;
  purpose: string;
  name: string;
  phone: string;
  email: string;
  // Space Only
  guestGear?: string;
  studioGear?: string;
  needsTechnician?: string;
  loadIn?: string;
  // With O Studio
  deliverables?: string[];
  usage?: string;
  turnaround?: string;
  notes?: string;
}

export const STUDIO_MODE_LABEL: Record<StudioMode, string> = {
  space: "Space only",
  crew: "With O Studio",
};

/** Whole hours, rounded to 1dp — null when the window is unusable. */
const durationHours = (start: string, end: string): number | null => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return null;
  const minutes = eh * 60 + em - (sh * 60 + sm);
  return minutes > 0 ? Math.round((minutes / 60) * 10) / 10 : null;
};

/**
 * A plain-language block describing the whole request. Used as a
 * safety net so the request stays fully readable even before the
 * structured columns exist.
 */
const buildSummary = (data: StudioBookingInput): string => {
  const hours = durationHours(data.startTime, data.endTime);
  const lines = [
    `Mode: ${STUDIO_MODE_LABEL[data.mode]}`,
    `Slot: ${data.studio} — ${data.bookingDate}, ${data.startTime} to ${data.endTime}` +
      (hours ? ` (${hours} hrs)` : ""),
    `Party: ${data.partySize}`,
  ];

  if (data.mode === "space") {
    if (data.guestGear) lines.push(`Bringing: ${data.guestGear}`);
    if (data.studioGear) lines.push(`Needs from us: ${data.studioGear}`);
    if (data.needsTechnician) lines.push(`Technician on site: ${data.needsTechnician}`);
    if (data.loadIn) lines.push(`Load-in / access: ${data.loadIn}`);
  } else {
    if (data.deliverables?.length) lines.push(`Deliverables: ${data.deliverables.join(", ")}`);
    if (data.usage) lines.push(`Will be used for: ${data.usage}`);
    if (data.turnaround) lines.push(`Turnaround: ${data.turnaround}`);
  }

  return lines.join("\n");
};

// PostgREST says PGRST204 when a column is not in the schema
// cache; Postgres itself says the column does not exist. Either
// means the migration has not been run yet.
const isMissingColumn = (message: string) =>
  /PGRST204|schema cache|column .* does not exist|could not find the '.*' column/i.test(message);

export async function submitStudioBooking(data: StudioBookingInput): Promise<void> {
  if (!supabase) {
    console.error("[O Studio] Supabase env missing — see .env.example");
    throw new Error(NOT_CONNECTED_MESSAGE);
  }

  const core = {
    studio: data.studio,
    booking_date: data.bookingDate,
    // Kept as a display string: the existing Bookings screen reads it.
    booking_time: `${data.startTime} – ${data.endTime}`,
    name: data.name,
    phone: data.phone,
    email: data.email,
    status: "pending",
  };

  const hours = durationHours(data.startTime, data.endTime);

  // 1) Preferred write — structured columns, one row per field.
  const { error } = await supabase.from("studio_bookings").insert({
    ...core,
    purpose: data.purpose,
    notes: data.notes || null,
    mode: data.mode,
    start_time: data.startTime,
    end_time: data.endTime,
    duration_minutes: hours ? Math.round(hours * 60) : null,
    party_size: data.partySize,
    guest_gear: data.guestGear || null,
    studio_gear: data.studioGear || null,
    needs_technician: data.needsTechnician || null,
    load_in: data.loadIn || null,
    deliverables: data.deliverables?.length ? data.deliverables : null,
    usage: data.usage || null,
    turnaround: data.turnaround || null,
  });

  if (!error) return;

  // 2) Any other failure is real — do not retry, or we risk a
  //    duplicate row if the first write actually landed.
  if (!isMissingColumn(error.message)) {
    console.error("[O Studio] booking insert failed:", error.message);
    throw new Error(NOT_CONNECTED_MESSAGE);
  }

  // 3) Migration not run yet — fold everything into the original
  //    columns so the request is still complete and readable.
  const fallback = await supabase.from("studio_bookings").insert({
    ...core,
    purpose: `[${STUDIO_MODE_LABEL[data.mode]}] ${data.purpose}`,
    notes: [buildSummary(data), data.notes || ""].filter(Boolean).join("\n\n"),
  });

  if (fallback.error) {
    console.error("[O Studio] booking insert failed:", fallback.error.message);
    throw new Error(NOT_CONNECTED_MESSAGE);
  }
}
