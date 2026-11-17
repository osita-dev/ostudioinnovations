# Launch Feedback (`/feedback`) — Setup Notes

The feedback page stores responses in **Supabase** (the same backend the
careers and inquiry forms already use) instead of a Google Sheet + Apps
Script, since your project already has a database wired up.

## 1. Create the table (one time)

1. Open the [Supabase dashboard](https://supabase.com/dashboard) → your project.
2. Go to **SQL Editor** → **New query**.
3. Paste the entire contents of [`feedback_migration.sql`](./feedback_migration.sql)
   and press **Run**.
4. You should see `Success. No rows returned`.

That creates `public.feedback_responses` with RLS enabled and an
**insert-only** policy for the anon key: the browser can add rows but can
never read or edit them. Nothing existing is dropped or renamed.

## 2. Environment variables (already done)

The page reuses the existing Vite env vars in `.env.local`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

No new variables are needed. If they're missing, the form shows a plain
English "temporarily unavailable" message instead of crashing (same
behaviour as the other forms).

## 3. View responses

**Supabase dashboard → Table Editor → feedback_responses**

Columns (one row per submission):

`created_at` (timestamp) · `guest_id` · `name` · `phone` · `how_heard` ·
`how_heard_other` · `rating` · `what_we_do` · `top_service` · `stood_out` ·
`do_better` · `expected_missing` · `add_one_thing` · `would_use` ·
`what_would_change` · `anything_else` · `questions` · `photo_consent` ·
`contact_consent` · `status` (defaults to `new`)

To export a spreadsheet: Table Editor → ⋯ menu → **Download as CSV**.

## 4. Personalised links

The page reads `?name=`, `?phone=` and `?id=`:

```
https://yourdomain.com/feedback?name=Ada&phone=%2B2348012345678&id=12
```

- `name` and `phone` prefill the form but stay editable by the guest.
- `id` is stored in `guest_id` so you can match the row to your guest list.
- Encode special characters in the phone (`+` → `%2B`). Anything missing
  simply starts blank — the link still works.

## 5. Access & privacy

- The page is **not** in the navigation; it's only reachable by link.
- It injects `<meta name="robots" content="noindex, nofollow">` while
  open, so search engines won't list it.
- No tracking or analytics are added anywhere.
- Photo consent is **required** and nothing is pre-selected; consent
  values are stored exactly as chosen (including the "keep private" option).

## 6. Spam protection

A hidden honeypot field (`website`) sits off-screen: bots that fill it
get a fake success and nothing is stored. Empty submissions are rejected
by validation (rating + photo consent are required), and all free-text
answers are trimmed and length-capped (300 chars for short answers,
1500 for the final "anything else").
