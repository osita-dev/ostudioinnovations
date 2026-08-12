import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { CTABanner } from "@/components/layout/CTABanner";
import { serviceCategories } from "@/data/services";
import { portfolioProjects } from "@/data/portfolio";
import { journalPosts } from "@/data/journal";
import { getIcon } from "@/lib/icons";

const differentiators = [
  "One studio, five connected capabilities — not five disconnected vendors",
  "Real production quality across media, film, content, tech, and design",
  "A structured process, from first inquiry to final delivery",
  "Work you can see — not just services you're told about",
];

const Home = () => {
  return (
    <div>
      {/* HERO */}
      <section className="bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden>
          <div className="w-full h-full" style={{
            backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--primary)) 0px, hsl(var(--primary)) 1px, transparent 1px, transparent 40px)"
          }} />
        </div>
        <div className="container relative py-28 sm:py-36 text-center">
          <p className="text-xs sm:text-sm tracking-widest-plus uppercase text-primary mb-6 animate-fade-up">
            Creative. Digital. Production.
          </p>
          <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl leading-[1.1] max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "0.05s" }}>
            One studio for every stage of your{" "}
            <span className="text-gold-gradient">creative vision.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            O Studio Innovations sits at the intersection of creative production and technology —
            covering media &amp; events, film, content, technology, and design under one roof, so your
            vision doesn't get lost between vendors.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/portfolio">
                Explore Our Work <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link to="/start-project">Start a Project</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="py-24 border-t border-border">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              eyebrow="What Is O Studio"
              title="We create. We build. We document."
              description="O Studio Innovations is a creative and technology studio — not a single-service vendor. We bring media production, storytelling, content, technology, and design together into one connected process, built around what you're actually trying to achieve."
            />
            <Button asChild variant="link" className="px-0 mt-4 text-primary">
              <Link to="/about">
                Learn about O Studio <ArrowRight className="ml-1" size={14} />
              </Link>
            </Button>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
            <h3 className="font-serif-display text-xl mb-6">What makes O Studio different</h3>
            <ul className="space-y-4">
              {differentiators.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check size={12} className="text-primary" />
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SERVICE PILLARS */}
      <section className="py-24 border-t border-border bg-card/30">
        <div className="container">
          <SectionHeading
            eyebrow="What We Do"
            title="Five capabilities. One studio."
            description="Every service connects back to the same goal: bringing your idea to life, properly."
            align="center"
            className="mb-14"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((service) => {
              const Icon = getIcon(service.icon);
              return (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="group relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors shadow-card"
                >
                  <Icon className="text-primary mb-5" size={28} strokeWidth={1.5} />
                  <h3 className="font-serif-display text-xl mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.tagline}</p>
                  <span className="text-xs tracking-widest-plus uppercase text-primary inline-flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                    Explore <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
            <Link
              to="/discover"
              className="group relative bg-primary/10 border border-primary/30 rounded-2xl p-8 hover:bg-primary/15 transition-colors flex flex-col justify-center"
            >
              <h3 className="font-serif-display text-xl mb-2">Not sure what you need?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Tell us what you're trying to accomplish and we'll point you to the right service.
              </p>
              <span className="text-xs tracking-widest-plus uppercase text-primary inline-flex items-center gap-1.5">
                Start Discovery <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="py-24 border-t border-border">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <SectionHeading eyebrow="Proof, Not Promises" title="A few recent projects" />
            <Button asChild variant="outline" className="rounded-full shrink-0">
              <Link to="/portfolio">View Full Portfolio</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioProjects.slice(0, 3).map((project) => (
              <Link
                key={project.id}
                to={`/portfolio/${project.slug}`}
                className="group block rounded-2xl overflow-hidden border border-border bg-card shadow-card"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs tracking-widest-plus uppercase text-primary mb-2">{project.year}</p>
                  <h3 className="font-serif-display text-lg mb-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL TEASER */}
      <section className="py-24 border-t border-border bg-card/30">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <SectionHeading eyebrow="From The Journal" title="Insights, stories, and process" />
            <Button asChild variant="outline" className="rounded-full shrink-0">
              <Link to="/journal">Visit the Journal</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journalPosts.map((post) => (
              <Link key={post.id} to={`/journal/${post.slug}`} className="group block">
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif-display text-base leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">{post.readTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
};

export default Home;
