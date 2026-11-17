-- ============================================================
-- O Studio Innovations — Studio Rental booking upgrade
--
-- Run this once in the Supabase SQL editor. Until it is run the
-- booking form still works: it folds the same information into
-- `purpose` and `notes` on the original columns. After it is run
-- the form writes the structured columns directly.
--
-- Nothing existing is dropped or renamed, so the current
-- Bookings screen keeps working.
-- ============================================================

alter table public.studio_bookings
  -- the fork: "space" = they bring crew & gear, "crew" = O Studio shoots
  add column if not exists mode text
    check (mode in ('space', 'crew')),

  -- a real time window instead of only the "HH:MM – HH:MM" display string
  add column if not exists start_time text,
  add column if not exists end_time text,
  add column if not exists duration_minutes integer,

  add column if not exists party_size integer,

  -- Space Only
  add column if not exists guest_gear text,
  add column if not exists studio_gear text,
  add column if not exists needs_technician text,
  add column if not exists load_in text,

  -- With O Studio
  add column if not exists deliverables jsonb,
  add column if not exists usage text,
  add column if not exists turnaround text;

comment on column public.studio_bookings.mode is
  'How the guest will use the studio: space = self-operated, crew = O Studio shoots it.';
comment on column public.studio_bookings.deliverables is
  'What O Studio should hand over, e.g. ["Edited video","Photos"].';

-- Availability lookups and duration maths need real times, so
-- backfill them from the existing display string where possible.
update public.studio_bookings
set start_time = split_part(booking_time, ' – ', 1),
    end_time   = split_part(booking_time, ' – ', 2)
where start_time is null
  and booking_time like '% – %';

-- ============================================================
-- Optional: make double-booking harder to cause. The app still
-- confirms manually, but this stops two accepted requests from
-- claiming the same space and date.
-- ============================================================
-- create unique index if not exists studio_bookings_slot_uidx
--   on public.studio_bookings (studio, booking_date, start_time)
--   where status = 'confirmed' and start_time is not null;
