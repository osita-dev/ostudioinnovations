/**
 * NextProject — the full-width closing strip: the next poster in the
 * reel (looping back to the first) under its "Next project" label.
 * Clicking expands the poster into the following title sequence; touch
 * taps navigate directly.
 */
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { startExpand } from "@/cinema/core/expandStore";
import { getProjectMedia } from "@/data/media";
import type { PortfolioProject } from "@/types";

type NextProjectProps = {
  /** The following item in portfolioProjects (wraps to the first). */
  next: PortfolioProject;
};

export function NextProject({ next }: NextProjectProps) {
  const { isTouch } = useCinema();
  const media = getProjectMedia(next);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isTouch) return; // touch taps navigate through the Link itself
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    startExpand(
      { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      media.poster,
      `/portfolio/${next.slug}`
    );
  };

  return (
    <section>
      <Link
        to={`/portfolio/${next.slug}`}
        data-cursor="view"
        onClick={handleClick}
        className="group relative block h-[45vh] min-h-[300px] w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <img
          src={media.poster}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/45 to-background/60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="text-xs uppercase tracking-widest-plus text-foreground/60">
            Next project
          </span>
          <span className="font-serif-display text-3xl sm:text-5xl">{next.title}</span>
        </div>
      </Link>
    </section>
  );
}
