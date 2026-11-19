/**
 * TitleSequence — the project's full-screen opening: the same media the
 * expand transition just showed (so the handoff is seamless), the name
 * rising with SplitText, service and year chips, a scroll cue, and the
 * small back-to-portfolio link. This is the expand destination.
 */
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { ReelVideo } from "@/cinema/media/ReelVideo";
import { SplitText } from "@/cinema/motion/SplitText";
import { stagger, durations, easings } from "@/cinema/motion/presets";
import { getProjectMedia } from "@/data/media";
import type { PortfolioProject, ServiceCategory } from "@/types";

type TitleSequenceProps = {
  project: PortfolioProject;
  service?: ServiceCategory;
};

export function TitleSequence({ project, service }: TitleSequenceProps) {
  const { reducedMotion } = useCinema();
  const media = getProjectMedia(project);

  return (
    <section className="relative h-screen min-h-[540px] w-full overflow-hidden">
      <ReelVideo
        poster={media.poster}
        alt={project.title}
        src={media.video}
        className="absolute inset-0 h-full w-full"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/25 to-background/85"
      />

      <Link
        to="/portfolio"
        className="absolute left-4 top-20 z-10 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 py-2 text-xs text-foreground/80 backdrop-blur-md transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:left-6"
      >
        <ArrowLeft size={14} aria-hidden="true" /> Back to Portfolio
      </Link>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl">
          <SplitText text={project.title} delay={stagger.loose} />
        </h1>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {service && (
            <span className="glass rounded-full px-3.5 py-1.5 text-xs tracking-wide text-foreground/80">
              {service.name}
            </span>
          )}
          <span className="glass rounded-full px-3.5 py-1.5 text-xs tracking-wide text-foreground/80">
            {project.year}
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <motion.div
          aria-hidden
          animate={reducedMotion ? undefined : { y: [0, 8] }}
          transition={{ duration: durations.base, repeat: Infinity, repeatType: "reverse", ease: easings.smooth }}
        >
          <ChevronDown size={20} className="text-foreground/60" />
        </motion.div>
      </div>
    </section>
  );
}
