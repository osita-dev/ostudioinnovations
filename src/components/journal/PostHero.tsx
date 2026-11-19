/**
 * PostHero — the full-bleed story opener: the cover image drifts slowly
 * behind a scrim while the title sits still over it. Parallax is flat
 * under reduced motion (useParallax handles the fallback).
 */
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useParallax } from "@/cinema/motion/useParallax";
import { Reveal } from "@/cinema/motion/Reveal";
import type { JournalPost as Post } from "@/types";

type PostHeroProps = {
  post: Post;
  categoryLabel: string;
};

export function PostHero({ post, categoryLabel }: PostHeroProps) {
  const { ref, y } = useParallax<HTMLDivElement>();

  return (
    <section ref={ref} className="relative overflow-hidden min-h-[52vh] flex items-end">
      <motion.div aria-hidden style={{ y }} className="absolute inset-x-0 -top-20 bottom-[-80px]">
        <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </motion.div>
      <div className="relative container pt-28 pb-14">
        <Link
          to="/journal"
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Journal
        </Link>
        <Reveal>
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">
            {categoryLabel} &middot; {post.readTime}
          </p>
          <h1 className="font-serif-display text-3xl sm:text-5xl leading-tight max-w-3xl">
            {post.title}
          </h1>
        </Reveal>
      </div>
    </section>
  );
}
