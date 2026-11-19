/**
 * Motion presets — the single source of truth for durations, easings,
 * distances and staggers. No scene or component may hard-code motion
 * numbers; everything imports from here (AGENTS.md, Architecture).
 */

/** Seconds. fast = hovers/taps, base = standard reveals, slow = scene
 *  moves, intro = the opening curtain, cut = the route wipe each way,
 *  reduced = crossfades under prefers-reduced-motion, drift = ambient
 *  loops like the projector beam. */
export const durations = {
  fast: 0.25,
  base: 0.6,
  slow: 1.1,
  intro: 2.4,
  cut: 0.5,
  reduced: 0.2,
  drift: 8,
} as const;

type CubicBezier = [number, number, number, number];

/** Seconds. cinematic = the signature ease-out for reveals; smooth =
 *  neutral in-out for scrubbed timelines; snap = quick in-out for
 *  magnetic moves and the cursor. */
export const easings = {
  cinematic: [0.22, 1, 0.36, 1],
  smooth: [0.4, 0, 0.2, 1],
  snap: [0.7, 0, 0.3, 1],
} satisfies Record<string, CubicBezier>;

/** Pixels. rise = elements lifting into place, parallax = scroll drift. */
export const distances = {
  rise: 24,
  parallax: 80,
} as const;

/** Seconds between siblings. tight = packed words/icons, base = list
 *  items, loose = deliberate, dramatic reveals. */
export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.16,
} as const;

/** Default viewport settings for scroll reveals: fire once, at 30% visible. */
export const viewport = {
  once: true,
  amount: 0.3,
} as const;

/** framer-motion spring configs. cursor = the companion ring's lag. */
export const springs = {
  cursor: { stiffness: 350, damping: 30, mass: 0.6 },
} as const;
