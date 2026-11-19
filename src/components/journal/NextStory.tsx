/**
 * NextStory — the "next story" strip closing a journal post: a thumbnail
 * plus title that links to the following post (wraps to the first when
 * the reader has reached the end). One lift-in, no loop.
 */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/cinema/motion/Reveal";
import type { JournalPost as Post } from "@/types";

type NextStoryProps = {
  post: Post;
};

export function NextStory({ post }: NextStoryProps) {
  return (
    <section className="border-t border-border">
      <div className="container py-14">
        <Reveal>
          <p className="text-xs tracking-widest-plus uppercase text-foreground/60 mb-6">
            Next story
          </p>
          <Link
            to={`/journal/${post.slug}`}
            data-cursor="view"
            className="group flex items-center gap-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
          >
            <img
              src={post.coverImage}
              alt=""
              className="h-24 w-32 shrink-0 rounded-lg object-cover sm:h-28 sm:w-44"
            />
            <span className="min-w-0">
              <span className="block font-serif-display text-lg sm:text-2xl leading-snug group-hover:text-primary transition-colors">
                {post.title}
              </span>
              <span className="mt-2 inline-flex items-center gap-2 text-sm text-foreground/60">
                Read next
                <ArrowRight
                  size={14}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
