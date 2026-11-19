/**
 * Journal — the stories index: slate hero, the cover story as a featured
 * card, the rest as a poster grid, closed by the side-branch exit bar.
 * Category labels stay here and are passed down to the cards.
 */
import { journalPosts } from "@/data/journal";
import { FeaturedPost } from "@/components/journal/FeaturedPost";
import { PostGrid } from "@/components/journal/PostGrid";
import { BackToStory } from "@/components/shared/BackToStory";
import { usePageMeta } from "@/hooks/usePageMeta";

const categoryLabels: Record<string, string> = {
  "case-study": "Case Study",
  "behind-the-scenes": "Behind The Scenes",
  insights: "Insights",
  technology: "Technology",
};

const Journal = () => {
  const [featured, ...rest] = journalPosts;

  usePageMeta(
    "Journal — Stories, process, and perspective | O Studio Innovations",
    "Project breakdowns, behind-the-scenes notes, and insights from across O Studio."
  );

  return (
    <div>
      <section className="bg-hero-gradient py-24">
        <div className="container text-center">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">Blog</p>
          <h1 className="font-serif-display text-4xl sm:text-5xl max-w-2xl mx-auto leading-tight">
            Stories, process, and perspective.
          </h1>
          <p className="mt-5 text-foreground/60 max-w-xl mx-auto">
            Project breakdowns, behind-the-scenes notes, and insights from across O Studio.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {featured && (
            <div className="mb-16 max-w-5xl">
              <FeaturedPost
                post={featured}
                categoryLabel={categoryLabels[featured.category]}
              />
            </div>
          )}
          <PostGrid posts={rest} categoryLabels={categoryLabels} />
        </div>
      </section>

      <BackToStory />
    </div>
  );
};

export default Journal;
