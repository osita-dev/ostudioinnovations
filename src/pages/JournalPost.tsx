import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug } from "@/data/journal";
import { CTABanner } from "@/components/layout/CTABanner";

const categoryLabels: Record<string, string> = {
  "case-study": "Case Study",
  "behind-the-scenes": "Behind The Scenes",
  insights: "Insights",
  technology: "Technology",
};

const JournalPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug ?? "");

  if (!post) return <Navigate to="/journal" replace />;

  return (
    <div>
      <section className="pt-10 pb-6">
        <div className="container">
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> Back to Journal
          </Link>
        </div>
      </section>

      <section className="pb-16">
        <div className="container max-w-3xl">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">
            {categoryLabels[post.category]} &middot; {post.readTime}
          </p>
          <h1 className="font-serif-display text-3xl sm:text-4xl leading-tight mb-8">{post.title}</h1>
          <div className="rounded-2xl overflow-hidden mb-10">
            <img src={post.coverImage} alt={post.title} className="w-full max-h-[440px] object-cover" />
          </div>
          <div className="space-y-6">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
};

export default JournalPost;
