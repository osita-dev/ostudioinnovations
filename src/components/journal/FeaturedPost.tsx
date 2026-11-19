/**
 * FeaturedPost — the journal's cover story: the first post as a wide
 * poster card (image left, text right) that lifts in once. Link target
 * and copy come straight from the data file.
 */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/cinema/motion/Reveal";
import type { JournalPost as Post } from "@/types";

type FeaturedPostProps = {
  post: Post;
  categoryLabel: string;
};

export function FeaturedPost({ post, categoryLabel }: FeaturedPostProps) {
  return (
    <Reveal>
      <Link
        to={`/journal/${post.slug}`}
        data-cursor="view"
        className="group grid gap-8 md:grid-cols-2 md:items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
      >
        <div className="aspect-[4/3] rounded-2xl overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div>
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-3">
            {categoryLabel} &middot; {post.readTime}
          </p>
          <h2 className="font-serif-display text-2xl sm:text-3xl leading-snug mb-3">
            {post.title}
          </h2>
          <p className="text-foreground/60 leading-relaxed mb-5">{post.excerpt}</p>
          <span className="inline-flex items-center gap-2 text-sm text-foreground">
            Read the story
            <ArrowRight
              size={15}
              className="transition-transform duration-500 group-hover:translate-x-1"
            />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
