/**
 * JournalStrip — a quiet row of the four journal posts (thumbnail plus
 * title) sitting between the credits card and the footer, giving the film
 * one last doorway into deeper reading. Content comes straight from data.
 */
import { Link } from "react-router-dom";
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import { journalPosts } from "@/data/journal";

export function JournalStrip() {
  return (
    <section className="border-t border-border py-16">
      <div className="container">
        <Reveal>
          <h2 className="text-xs uppercase tracking-widest-plus text-foreground/60">
            More stories
          </h2>
        </Reveal>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {journalPosts.map((post, i) => (
            <Reveal as="li" key={post.slug} delay={stagger.base * i}>
              <Link
                to={`/journal/${post.slug}`}
                data-cursor="view"
                className="group flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <img
                  src={post.coverImage}
                  alt=""
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-lg border border-border object-cover"
                />
                <span className="min-w-0 text-sm leading-snug text-foreground/60 transition-colors group-hover:text-foreground">
                  {post.title}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
