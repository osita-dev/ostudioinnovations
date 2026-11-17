-- ============================================================
-- O Studio Innovations — Launch feedback (/feedback page)
--
-- Run this once in the Supabase SQL editor. One row per
-- submission. RLS allows anon INSERT only — the same rule as
-- the rest of the public site: feedback can be added from the
-- browser, never read or edited.
--
-- Nothing existing is dropped or renamed, so every other screen
-- keeps working.
-- ============================================================

create table if not exists public.feedback_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Personalised links (?id=) so rows can be matched to the guest list
  guest_id text,
  name text,
  phone text,

  -- Q1–Q2
  how_heard text,
  how_heard_other text,
  rating integer not null check (rating between 1 and 5),

  -- Q3–Q5
  what_we_do text,
  top_service text,
  stood_out text,

  -- Q6–Q8
  do_better text,
  expected_missing text,
  add_one_thing text,

  -- Q9–Q11
  would_use text,
  what_would_change text,
  anything_else text,
  questions text,

  -- Consent — required, nothing is ever assumed
  photo_consent text not null,
  contact_consent text,

  -- Same status vocabulary as the other public forms
  status text not null default 'new'
);

comment on column public.feedback_responses.guest_id is
  'Value of the ?id= parameter on the personalised /feedback link.';
comment on column public.feedback_responses.photo_consent is
  'Guest''s explicit photo consent choice — never defaulted server-side.';

create index if not exists feedback_responses_guest_id_idx
  on public.feedback_responses (guest_id);

alter table public.feedback_responses enable row level security;

-- Idempotent: safe to re-run.
drop policy if exists "anon can insert feedback" on public.feedback_responses;

create policy "anon can insert feedback"
  on public.feedback_responses
  for insert
  to anon
  with check (true);

-- ============================================================
-- Admin dashboard access (authenticated role — the signed-in
-- admin session). Read + status updates only; anon stays
-- insert-only. Safe to re-run: the drop/create pairs below.
-- ============================================================

drop policy if exists "admin can read feedback" on public.feedback_responses;

create policy "admin can read feedback"
  on public.feedback_responses
  for select
  to authenticated
  using (true);

drop policy if exists "admin can update feedback" on public.feedback_responses;

create policy "admin can update feedback"
  on public.feedback_responses
  for update
  to authenticated
  using (true)
  with check (true);
