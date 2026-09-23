import { Link } from "react-router-dom";
import { journalPosts } from "@/data/journal";
import { CTABanner } from "@/components/layout/CTABanner";

const categoryLabels: Record<string, string> = {
  "case-study": "Case Study",
  "behind-the-scenes": "Behind The Scenes",
  insights: "Insights",
  technology: "Technology",
};

const Journal = () => {
  return (
    <div>
      <section className="bg-hero-gradient py-24">
        <div className="container text-center">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">Journal</p>
          <h1 className="font-serif-display text-4xl sm:text-5xl max-w-2xl mx-auto leading-tight">
            Stories, process, and perspective.
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Project breakdowns, behind-the-scenes notes, and insights from across O Studio.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {journalPosts.map((post) => (
            <Link key={post.id} to={`/journal/${post.slug}`} className="group block">
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
              <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <CTABanner />
    </div>
  );
};

export default Journal;
