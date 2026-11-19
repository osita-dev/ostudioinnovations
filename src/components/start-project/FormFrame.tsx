/**
 * FormFrame — the two-column cinematic frame around the Start Project form:
 * a left visual panel (the ?project= poster with its "like" line, else the
 * selected service's poster, else the page poster) that crossfades when the
 * choice changes, and the form itself on the right. The panel hides on phones.
 */
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { durations, easings } from "@/cinema/motion/presets";
import { getProjectMedia, getServiceMedia, media } from "@/data/media";
import type { PortfolioProject, ServiceCategory } from "@/types";

type FormFrameProps = {
  /** The service chosen in step 1 — its poster fills the panel. */
  service?: ServiceCategory;
  /** ?project= from the URL — overrides the poster and adds the "like" line. */
  project?: PortfolioProject;
  children: ReactNode;
};

export function FormFrame({ service, project, children }: FormFrameProps) {
  const { reducedMotion } = useCinema();

  const asset = project
    ? getProjectMedia(project)
    : (service && getServiceMedia(service.slug)) || media.pages.startProject;

  return (
    <div className="container max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:items-start">
        <aside className="hidden lg:block">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card aspect-[4/5]">
            <AnimatePresence initial={false}>
              <motion.img
                key={asset.poster}
                src={asset.poster}
                alt={asset.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reducedMotion ? 0 : durations.base,
                  ease: easings.cinematic,
                }}
              />
            </AnimatePresence>
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/45 to-background/10"
            />
            {project && (
              <p className="absolute inset-x-0 bottom-0 p-6 text-sm leading-relaxed">
                You're starting a project like:{" "}
                <span className="font-medium text-foreground">{project.title}</span>
              </p>
            )}
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
