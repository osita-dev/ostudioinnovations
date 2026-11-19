/**
 * PosterGrid — the poster wall: a varied-height grid of project posters
 * (masonry rhythm from stable per-project ratios) where each card plays
 * its clip on hover, overlays the title, and reflows with framer-motion
 * layout when the filter changes. Clicking expands the poster into the
 * project page; touch taps navigate directly.
 */
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { startExpand } from "@/cinema/core/expandStore";
import { durations, easings } from "@/cinema/motion/presets";
import { ReelVideo } from "@/cinema/media/ReelVideo";
import { TiltCard } from "@/cinema/motion/TiltCard";
import { getProjectMedia } from "@/data/media";
import { portfolioProjects } from "@/data/portfolio";
import type { PortfolioProject } from "@/types";
import { cn } from "@/lib/utils";

type PosterGridProps = {
  projects: PortfolioProject[];
};

// Varied poster ratios give the wall its staggered, masonry-like rhythm.
const RATIOS = ["aspect-[4/5]", "aspect-[3/4]", "aspect-square", "aspect-[4/3]"];

// Stable per project, so filtering reflows cards without re-cropping them.
const RATIO_BY_ID: Record<string, string> = Object.fromEntries(
  portfolioProjects.map((project, i) => [project.id, RATIOS[i % RATIOS.length]])
);

export function PosterGrid({ projects }: PosterGridProps) {
  const { isTouch, reducedMotion } = useCinema();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, project: PortfolioProject) => {
    if (isTouch) return; // touch taps navigate through the Link itself
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    startExpand(
      { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      getProjectMedia(project).poster,
      `/portfolio/${project.slug}`
    );
  };

  return (
    <motion.ul layout={!reducedMotion} className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence initial={false} mode="popLayout">
        {projects.map((project) => {
          const media = getProjectMedia(project);
          return (
            <motion.li
              key={project.id}
              layout={!reducedMotion}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{
                duration: reducedMotion ? 0 : durations.base,
                ease: easings.cinematic,
                layout: { duration: reducedMotion ? 0 : durations.fast, ease: easings.cinematic },
              }}
            >
              <TiltCard className="rounded-2xl">
                <Link
                  to={`/portfolio/${project.slug}`}
                  data-cursor="view"
                  onClick={(e) => handleClick(e, project)}
                  className="group relative block overflow-hidden rounded-2xl border border-border bg-card shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ReelVideo
                    poster={media.poster}
                    alt={project.title}
                    src={media.video}
                    hoverPlay
                    className={cn("w-full", RATIO_BY_ID[project.id])}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 flex items-end bg-gradient-to-t from-background/85 via-background/20 to-transparent p-5 transition-opacity duration-500",
                      isTouch
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    )}
                  >
                    <h3 className="font-serif-display text-lg leading-tight">{project.title}</h3>
                  </div>
                </Link>
              </TiltCard>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </motion.ul>
  );
}
