import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ============================================================
// SUPABASE CLIENT — public site (stage 09 / 13 Phase C)
//
// The site uses the ANON key and only ever INSERTs (RLS in
// supabase/setup.sql allows anon INSERT and nothing else), so
// this key is safe to ship in the browser bundle.
//
// If .env.local is missing the client is null: the forms then
// fail with a plain-English message instead of crashing the
// page (stage 07 honesty rule applies to the public site too).
//
// Required env (Vite reads .env.local at startup):
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
// ============================================================

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

/** Shown to visitors when the data layer isn't wired up yet. */
export const NOT_CONNECTED_MESSAGE =
  "We couldn't send that just now — this form is temporarily unavailable. Please try again in a moment, or reach us at info@ostudioinnovations.com.";
