/**
 * WorkIndex — the proof scene: numbered project rows (title, client and
 * year, category tags) where hovering one dims the rest and floats its
 * clip-or-poster behind the text; clicking expands the image into the
 * full-screen transition. Touch devices get poster thumbnails and plain
 * navigation instead.
 */
import { useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger, springs } from "@/cinema/motion/presets";
import { startExpand } from "@/cinema/core/expandStore";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { getProjectMedia } from "@/data/media";
import type { PortfolioProject } from "@/types";
import { cn } from "@/lib/utils";

type WorkIndexProps = {
  /** Home passes all projects; Stage 8 reuses the section for Portfolio. */
  projects: PortfolioProject[];
};

export function WorkIndex({ projects }: WorkIndexProps) {
  const { isTouch, reducedMotion } = useCinema();
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef({ x: 0, y: 0 });
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const springX = useSpring(targetX, springs.cursor);
  const springY = useSpring(targetY, springs.cursor);
  // Reduced motion: the preview snaps to the row instead of trailing it.
  const x = reducedMotion ? targetX : springX;
  const y = reducedMotion ? targetY : springY;

  const active = hovered !== null ? projects[hovered] : undefined;
  const activeAsset = active ? getProjectMedia(active) : undefined;

  /** Park the preview on a row (hover or keyboard focus) and reset drift. */
  const anchorTo = (el: HTMLElement) => {
    const container = containerRef.current;
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const ax = r.left - cr.left + r.width / 2;
    const ay = r.top - cr.top + r.height / 2;
    anchorRef.current = { x: ax, y: ay };
    targetX.set(ax);
    targetY.set(ay);
  };

  /** Drift slightly toward the pointer, clamped around the row anchor. */
  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (isTouch || reducedMotion || hovered === null) return;
    const container = containerRef.current;
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const anchor = anchorRef.current;
    const dx = e.clientX - cr.left - anchor.x;
    const dy = e.clientY - cr.top - anchor.y;
    targetX.set(anchor.x + Math.max(-60, Math.min(60, dx)));
    targetY.set(anchor.y + Math.max(-40, Math.min(40, dy)));
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, project: PortfolioProject) => {
    if (isTouch) return; // touch taps navigate through the Link itself
    e.preventDefault();
    const preview = hovered !== null ? previewRef.current : null;
    const rect = preview?.getBoundingClientRect() ?? e.currentTarget.getBoundingClientRect();
    startExpand(
      { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      getProjectMedia(project).poster,
      `/portfolio/${project.slug}`
    );
  };

  return (
    <section id="work" className="relative overflow-hidden py-24 sm:py-32">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <h2 className="font-serif-display text-3xl sm:text-4xl">
              Don&apos;t take our word for it.
            </h2>
          </Reveal>
          <Reveal delay={stagger.tight}>
            <Link
              to="/portfolio"
              data-cursor="view"
              className="inline-block border-b border-foreground/30 pb-1 text-xs uppercase tracking-widest-plus text-foreground/60 transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              See all work
            </Link>
          </Reveal>
        </div>

        <div
          ref={containerRef}
          className="relative mt-12"
          onPointerMove={handleMove}
          onPointerLeave={() => setHovered(null)}
        >
          {/* The clip-or-poster sits behind the rows and trails the pointer. */}
          {!isTouch && (
            <motion.div
              ref={previewRef}
              aria-hidden
              className={cn(
                "pointer-events-none absolute left-0 top-0 z-0 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-opacity duration-500",
                active ? "opacity-100" : "opacity-0"
              )}
              style={{ x, y, marginLeft: -160, marginTop: -90 }}
            >
              {activeAsset?.video ? (
                <video
                  src={activeAsset.video}
                  poster={activeAsset.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="aspect-video w-full object-cover"
                />
              ) : activeAsset ? (
                <img
                  src={activeAsset.poster}
                  alt=""
                  className="aspect-video w-full object-cover"
                />
              ) : null}
            </motion.div>
          )}

          <ul className="relative z-10">
            {projects.map((project, i) => {
              const asset = getProjectMedia(project);
              return (
                <Reveal
                  as="li"
                  key={project.id}
                  delay={stagger.base * i}
                  className="border-b border-border"
                >
                  <Link
                    to={`/portfolio/${project.slug}`}
                    data-cursor="view"
                    onClick={(e) => handleClick(e, project)}
                    onPointerEnter={(e) => {
                      if (isTouch) return;
                      anchorTo(e.currentTarget);
                      setHovered(i);
                    }}
                    onFocus={(e) => {
                      if (isTouch) return;
                      anchorTo(e.currentTarget);
                      setHovered(i);
                    }}
                    onBlur={() => {
                      if (!isTouch) setHovered(null);
                    }}
                    className={cn(
                      "relative flex items-center gap-5 py-6 transition-opacity duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:py-8",
                      hovered !== null && hovered !== i && "opacity-30"
                    )}
                  >
                    <span className="w-8 shrink-0 text-xs tabular-nums text-foreground/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif-display text-2xl leading-tight sm:text-4xl lg:text-5xl">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-foreground/60">
                        {project.client}, {project.year}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {project.categories.map((cat) => (
                          <li
                            key={cat}
                            className="rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-widest-plus text-foreground/60"
                          >
                            {cat.replace("-", " ")}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {isTouch && (
                      <img
                        src={asset.poster}
                        alt=""
                        className="h-16 w-24 shrink-0 rounded-lg object-cover"
                      />
                    )}
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
