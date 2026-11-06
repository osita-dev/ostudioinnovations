import { NOT_CONNECTED_MESSAGE, supabase } from "@/lib/supabase";

// ============================================================
// APPLICATION LAYER — Studio Rental booking requests
// (stage 04 requirements / stage 13 Phase C3)
//
// INSERTed into `studio_bookings` with status "pending" — the
// admin confirms or declines from the Bookings screen. Like the
// other forms, the request goes straight into the database and
// nowhere else — no WhatsApp anywhere.
// ============================================================

export interface StudioBookingInput {
  studio: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  purpose: string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
}

export async function submitStudioBooking(data: StudioBookingInput): Promise<void> {
  if (!supabase) {
    console.error("[O Studio] Supabase env missing — see .env.example");
    throw new Error(NOT_CONNECTED_MESSAGE);
  }

  const { error } = await supabase.from("studio_bookings").insert({
    studio: data.studio,
    booking_date: data.bookingDate,
    booking_time: `${data.startTime} – ${data.endTime}`,
    purpose: data.purpose,
    name: data.name,
    phone: data.phone,
    email: data.email,
    notes: data.notes || null,
    status: "pending",
  });

  if (error) {
    console.error("[O Studio] booking insert failed:", error.message);
    throw new Error(NOT_CONNECTED_MESSAGE);
  }
}
