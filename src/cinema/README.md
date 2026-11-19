# src/cinema — the motion engine

Reusable cinematic engine for the redesign. It knows nothing about O Studio
content: pages and section components consume it, never the other way round.
No file here may import from src/data (media paths come from src/data/media.ts).

- `core/` — app-wide plumbing: CinemaProvider (context), SmoothScroll (Lenis), PageTransition, IntroGate, Scrubber, Cursor, Overlays (FilmGrain, Letterbox, ProjectorBeam).
- `motion/` — presets.ts (the only allowed motion numbers), Reveal, SplitText, MagneticButton, TiltCard and shared hooks.
- `scenes/` — scene primitives: Scene, TitleCard, NextTeaser.
- `media/` — ReelVideo, MediaFrame, Lightbox.
- `three/` — 3D pieces (FilmRing), lazy-loaded; added in Stage 12 only.

`src/components/home/` sits outside this folder: home-page sections that
drive the engine with O Studio content (HeroReel, PromiseWords, …).
