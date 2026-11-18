# ostudio innovation: working rules

## Project
Cinematic redesign of the ostudio innovation site. Same routes, same data files, same forms. New visitor-facing layer. Work happens in numbered stages; do only the stage you are given.

## Brand (obey in every file)
- Surfaces: dark gray from layered transparency (white at 4-8% over near-black). Never flat pure black blocks.
- Text: white; secondary text white at 60%. One font family: Inter. Short, simple copy.
- Gold is for icons and one thin hairline thread only. No gold text, no gold buttons.
- Primary button: white fill, dark text. Secondary: white outline.
- No hard-coded colors in components. Use Tailwind classes and CSS variables from src/index.css.

## Architecture
- src/cinema/ is the reusable motion engine (core, motion, scenes, media, three). It knows nothing about ostudio content.
- src/components/<page>/ holds section components for each page.
- src/pages/ files are thin: they only compose sections. No animation code in pages.
- src/data/ holds content. All media paths come from src/data/media.ts.
- Motion values (durations, easings, distances, staggers) come only from src/cinema/motion/presets.ts.
- One component per file, typed props, about 200 lines max. Split if larger.
- Every file starts with a 2-3 line comment: what it does and why it exists.

## Never touch
src/lib/supabase.ts, src/lib/bookings.ts, src/lib/inquiries.ts, src/lib/applications.ts, src/lib/feedback.ts, any zod schema or form submit logic, src/components/ui/, supabase/, any .env file, public/OstudioInnovation.svg.

## Motion and accessibility
- Every animation has a reduced-motion fallback (use the CinemaProvider flag).
- Every heavy effect has a mobile/low-power fallback.
- Autoplay media is muted, playsInline, and paused when off-screen.
- Keep visible focus states and keyboard access for every interactive element.
- Animate only transform and opacity where possible.

## Packages
Use only what the current stage lists. Do not add other animation, scroll, UI or 3D libraries. Do not upgrade Tailwind, React or Vite. Use bun for installs.

## Working method
1. Read this file at the start of every session.
2. Before coding, list the files you will create or change.
3. Stay inside the current stage. Do not refactor unrelated code.
4. If something is unclear, make the simplest choice that follows these rules and note it in your final report.
5. When done run: bun run build and bun run lint. Both must pass. Report the results and the list of files changed.
