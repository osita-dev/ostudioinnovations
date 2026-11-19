/**
 * ChoiceTiles — the choose-your-path scene: eight large dark glass tiles with
 * a gold icon and a faint looping backdrop stagger in; picking one collapses
 * the wall so the recommendation scene animates in, and "Choose a different
 * objective" reverses the swap. One AnimatePresence owns both states.
 */
import { Link } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { ReelVideo } from "@/cinema/media/ReelVideo";
import { distances, durations, easings, stagger } from "@/cinema/motion/presets";
import { discoveryOptions } from "@/data/discovery";
import { getProjectMedia, getServiceMedia, media } from "@/data/media";
import { serviceCategories } from "@/data/services";
import { getIcon } from "@/lib/icons";
import type { useDiscovery } from "@/hooks/useDiscovery";

type DiscoveryState = ReturnType<typeof useDiscovery>;

// Resolved once at module load so render never calls getIcon
// (react-hooks/static-components).
const OPTION_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  discoveryOptions.map((option) => [option.icon, getIcon(option.icon)]),
);
const SERVICE_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  serviceCategories.map((service) => [service.slug, getIcon(service.icon)]),
);

// Each tile loops the still of its first recommended service; the "something
// else" option has no category, so it falls back to the page's own poster.
const tileAsset = (recommended: string[]) =>
  (recommended[0] && getServiceMedia(recommended[0])) || media.pages.discover;

export function ChoiceTiles({
  setSelectedId,
  selected,
  recommendedServices,
  exampleProject,
}: DiscoveryState) {
  const { reducedMotion } = useCinema();
  const rise = reducedMotion ? 0 : distances.rise;

  // One vocabulary for both states: enter from below, leave with a small
  // collapse — transform and opacity only.
  const item: Variants = {
    hidden: { opacity: 0, y: rise },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : durations.base, ease: easings.cinematic },
    },
  };
  const wall: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : stagger.base,
        delayChildren: reducedMotion ? 0 : stagger.tight,
      },
    },
    out: {
      opacity: 0,
      y: -rise,
      scale: reducedMotion ? 1 : 0.97,
      transition: { duration: reducedMotion ? 0 : durations.fast, ease: easings.cinematic },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {!selected ? (
        <motion.section
          key="tiles"
          className="py-16"
          variants={wall}
          initial="hidden"
          animate="show"
          exit="out"
        >
          <div className="container grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {discoveryOptions.map((option) => {
              const Icon = OPTION_ICONS[option.icon];
              const asset = tileAsset(option.recommendedCategories);
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  variants={item}
                  onClick={() => setSelectedId(option.id)}
                  className="glass group relative overflow-hidden rounded-2xl p-7 text-left transition-colors hover:border-primary/50"
                >
                  <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25">
                    <ReelVideo poster={asset.poster} alt="" className="h-full w-full" />
                  </div>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/65 to-background/40"
                  />
                  <div className="relative">
                    <Icon className="icon-gold mb-4" size={26} strokeWidth={1.5} />
                    <h3 className="font-serif-display text-lg mb-1.5">{option.prompt}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.section>
      ) : (
        <motion.section
          key="recs"
          className="py-16"
          variants={wall}
          initial="hidden"
          animate="show"
          exit="out"
        >
          <div className="container max-w-3xl mx-auto">
            <motion.button
              type="button"
              variants={item}
              onClick={() => setSelectedId(null)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
            >
              <ArrowLeft size={14} /> Choose a different objective
            </motion.button>

            {recommendedServices.length > 0 ? (
              <div className="space-y-6">
                {recommendedServices.map((service) => {
                  if (!service) return null;
                  const Icon = SERVICE_ICONS[service.slug];
                  const example = exampleProject(service.slug);
                  const examplePoster = example && getProjectMedia(example);
                  return (
                    <motion.article
                      key={service.slug}
                      variants={item}
                      className="bg-card border border-border rounded-2xl p-8 shadow-card"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4 min-w-0">
                          <Icon
                            className="text-primary shrink-0 mt-1"
                            size={28}
                            strokeWidth={1.5}
                          />
                          <div className="min-w-0">
                            <h2 className="font-serif-display text-2xl mb-1">{service.name}</h2>
                            <p className="text-sm text-muted-foreground">{service.tagline}</p>
                          </div>
                        </div>
                        {example && examplePoster && (
                          <Link
                            to={`/portfolio/${example.slug}`}
                            className="group/project relative block w-36 shrink-0 overflow-hidden rounded-xl border border-border"
                          >
                            <span className="block aspect-[4/5] overflow-hidden">
                              <img
                                src={examplePoster.poster}
                                alt={examplePoster.alt}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover/project:scale-105"
                              />
                            </span>
                            <span
                              aria-hidden
                              className="absolute inset-x-0 bottom-0 block bg-gradient-to-t from-background/95 via-background/70 to-transparent p-3 pt-8"
                            >
                              <span className="block text-xs font-medium leading-snug">
                                {example.title}
                              </span>
                            </span>
                          </Link>
                        )}
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button asChild className="rounded-full">
                          <Link to={`/services/${service.slug}`}>
                            See Full Service Details <ArrowRight className="ml-2" size={15} />
                          </Link>
                        </Button>
                        {example && (
                          <Button asChild variant="outline" className="rounded-full">
                            <Link to={`/portfolio/${example.slug}`}>View Related Work</Link>
                          </Button>
                        )}
                        <Button asChild variant="ghost" className="rounded-full">
                          <Link
                            to={
                              service.slug === "studio-rental"
                                ? "/studio-rental"
                                : `/start-project?service=${service.slug}`
                            }
                          >
                            {service.slug === "studio-rental"
                              ? "Book the Studio"
                              : "Start This Project"}
                          </Link>
                        </Button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            ) : (
              <motion.article
                variants={item}
                className="bg-card border border-border rounded-2xl p-10 text-center shadow-card"
              >
                <h2 className="font-serif-display text-2xl mb-3">Let's talk it through.</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto">
                  Your project doesn't have to fit a preset category. Describe what you need and O
                  Studio will figure out the right approach with you.
                </p>
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link to="/start-project">
                    Start a Conversation <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
              </motion.article>
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
