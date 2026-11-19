# O Studio Innovations — cinematic site

The redesigned visitor-facing site for O Studio Innovations: same routes,
same data, same forms, rebuilt as a dark, cinematic experience. Bun for
tooling — `bun run dev`, `bun run build`, `bun run lint`.

## Cinema architecture

The film layer lives in `src/cinema/` and knows nothing about O Studio
content; pages and section components consume it, never the other way
round (details in `src/cinema/README.md`).

### Folder structure

```
src/
  cinema/          the reusable motion engine (no site content imports)
    core/          CinemaProvider, SmoothScroll, PageTransition, IntroGate,
                   Scrubber, Cursor, Overlays, ExpandTransition
    motion/        presets.ts (the only allowed motion numbers), Reveal,
                   SplitText, MagneticButton, TiltCard, useParallax
    scenes/        Scene, TitleCard, NextTeaser
    media/         ReelVideo, MediaFrame, Lightbox
    three/         FilmRing, FilmRingScene + WebGL gate (lazy, separate chunk)
  components/      one folder per page/feature: home/, about/, journal/, …
  pages/           thin route files — they only compose sections
  data/            content: services, portfolio, journal, media, contact
  hooks/           usePageMeta, useDiscovery, use-mobile, use-toast
  lib/             Supabase clients and form logic (never touched)
  types/           shared TypeScript interfaces
```

Rules of thumb (AGENTS.md): motion values come only from
`src/cinema/motion/presets.ts`, media paths only from
`src/data/media.ts`, and no component hard-codes a color — use the CSS
variables from `src/index.css`.

### Motion presets

`src/cinema/motion/presets.ts` is the single source of truth:

| Export     | Values                                                        | Use for |
| ---------- | ------------------------------------------------------------- | ------- |
| `durations`| fast 0.25 · base 0.6 · cut 0.5 · slow 1.1 · intro 2.4 · reduced 0.2 · drift 8 | hover feedback, reveals, route wipe, scene moves, opening curtain, reduced-motion crossfades, ambient loops |
| `easings`  | cinematic (0.22, 1, 0.36, 1) · smooth (0.4, 0, 0.2, 1) · snap (0.7, 0, 0.3, 1) | reveals, scrubbed timelines, magnetic/cursor moves |
| `distances`| rise 24 · parallax 80                                          | lift-in offset, scroll drift |
| `stagger`  | tight 0.04 · base 0.08 · loose 0.16                            | sibling delays |
| `viewport` | once, 30% visible                                              | reveal triggers |
| `springs`  | cursor                                                         | companion ring lag |

Every animation must honor the `CinemaProvider` `reducedMotion` flag.

### How to add a scene

1. Create a section component under `src/components/<page>/` (about 200
   lines max, one component per file, 2-3 line comment at the top).
2. Compose primitives from `src/cinema` — `Reveal` for entrances,
   `Scene`/`TitleCard` for stages, `ReelVideo` for poster-with-video —
   and take every duration/ease/distance from `presets.ts`.
3. Provide a reduced-motion or static fallback (see `useStaticMode`
   under `src/components/home/`) and a mobile/low-power path.
4. Register its media through `src/data/media.ts` (never inline URLs).
5. Mount it from the thin page file in `src/pages/` — no animation
   code in pages.

### How to add real media

1. Drop the compressed file into `public/media/` (videos: MP4/H.264,
   `preload`-friendly size).
2. Register it in `src/data/media.ts` by adding a `video` field to the
   matching `MediaAsset` (`{ poster, video?, alt }`), e.g.
   `video: "/media/your-clip.mp4"`.
3. Swap the `poster` URL for your own image if you have one — every
   `MediaAsset` needs `poster` and `alt`; `video` stays optional, so
   components keep working as stills until the file exists.
4. Service posters live in `media.services[slug]`, project media in
   `getProjectMedia(project)`, page posters in `media.pages.*`. No
   component changes are needed — `ReelVideo` and friends read the
   registry.
