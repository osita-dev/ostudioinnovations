/**
 * JournalPost — one story as a film: full-bleed parallax opener, the
 * reading column (paragraphs verbatim from data), then the next-story
 * strip and the side-branch exit bar.
 */
import { useParams, Navigate } from "react-router-dom";
import { getPostBySlug, journalPosts } from "@/data/journal";
import { PostHero } from "@/components/journal/PostHero";
import { NextStory } from "@/components/journal/NextStory";
import { BackToStory } from "@/components/shared/BackToStory";
import { usePageMeta } from "@/hooks/usePageMeta";

const categoryLabels: Record<string, string> = {
  "case-study": "Case Study",
  "behind-the-scenes": "Behind The Scenes",
  insights: "Insights",
  technology: "Technology",
};

const JournalPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug ?? "");

  // Before the redirect so the hook order stays fixed across renders.
  usePageMeta(
    post ? `${post.title} — Journal | O Studio Innovations` : "Journal | O Studio Innovations",
    post?.excerpt ??
      "Stories, process and perspective from O Studio Innovations."
  );

  if (!post) return <Navigate to="/journal" replace />;

  // The strip links onward, wrapping from the last post back to the first.
  const index = journalPosts.findIndex((p) => p.id === post.id);
  const next = journalPosts[(index + 1) % journalPosts.length];

  return (
    <div>
      <PostHero post={post} categoryLabel={categoryLabels[post.category]} />

      <article className="py-16">
        <div className="container max-w-3xl">
          <div className="space-y-6">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-foreground/60 leading-relaxed text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      {next && <NextStory post={next} />}
      <BackToStory />
    </div>
  );
};

export default JournalPost;
