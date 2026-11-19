/**
 * PostGrid — the remaining journal posts as a poster wall of cards, each
 * lifting in with a light stagger. Excerpt, cover and read time come from
 * the data file; category labels are passed in from the page.
 */
import { Link } from "react-router-dom";
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import type { JournalPost as Post } from "@/types";

type PostGridProps = {
  posts: Post[];
  categoryLabels: Record<string, string>;
};

export function PostGrid({ posts, categoryLabels }: PostGridProps) {
  if (posts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, i) => (
        <Reveal key={post.id} delay={stagger.base * i}>
          <Link
            to={`/journal/${post.slug}`}
            data-cursor="view"
            className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
          >
            <div className="aspect-[4/3] rounded-xl overflow-hidden mb-5">
              <img
                src={post.coverImage}
                alt={post.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-xs tracking-widest-plus uppercase text-primary mb-2">
              {categoryLabels[post.category]} &middot; {post.readTime}
            </p>
            <h2 className="font-serif-display text-xl leading-snug mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-foreground/60 leading-relaxed">{post.excerpt}</p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
