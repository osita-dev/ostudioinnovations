import { serviceCategories } from "@/data/services";
import { getIcon } from "@/lib/icons";
import { CTABanner } from "@/components/layout/CTABanner";
import { SectionHeading } from "@/components/layout/SectionHeading";

const About = () => {
  return (
    <div>
      <section className="bg-hero-gradient py-28">
        <div className="container text-center">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-6">About O Studio</p>
          <h1 className="font-serif-display text-4xl sm:text-6xl leading-tight max-w-3xl mx-auto">
            We create. We build. We document.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            O Studio Innovations sits at the intersection of creative production and technology.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container max-w-3xl">
          <p className="text-lg leading-relaxed text-foreground/90 mb-6">
            O Studio Innovations began as a response to a simple observation: creative work and
            technology are usually treated as separate industries, handled by separate vendors, run
            on separate timelines — even when they're solving the same problem for the same client.
          </p>
          <p className="text-lg leading-relaxed text-foreground/90 mb-6">
            We built O Studio differently. Media and events, film and production, content and
            entertainment, technology, and creative services all live under one studio, run by one
            connected process. That means a wedding film, a documentary, a brand identity, and a
            business website can all be handled with the same standard of care — and, when a project
            calls for more than one of them, without the usual friction of coordinating across vendors.
          </p>
          <p className="text-lg leading-relaxed text-foreground/90">
            Our name reflects that intent: a studio built around innovation, not just output. Every
            project — whichever capability it draws on — is measured against the same bar: is this
            something we'd be proud to put our name on.
          </p>
        </div>
      </section>

      <section className="py-24 border-t border-border bg-card/30">
        <div className="container">
          <SectionHeading
            eyebrow="How It Fits Together"
            title="One studio, five connected capabilities"
            align="center"
            className="mb-14"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {serviceCategories.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <div key={s.slug} className="text-center bg-card border border-border rounded-2xl p-6 shadow-card">
                  <Icon className="text-primary mx-auto mb-3" size={24} strokeWidth={1.5} />
                  <p className="font-serif-display text-sm">{s.shortName}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-border">
        <div className="container grid sm:grid-cols-3 gap-10 text-center max-w-3xl mx-auto">
          <div>
            <p className="font-serif-display text-4xl text-primary mb-2">5</p>
            <p className="text-sm text-muted-foreground">Connected capabilities</p>
          </div>
          <div>
            <p className="font-serif-display text-4xl text-primary mb-2">1</p>
            <p className="text-sm text-muted-foreground">Studio, start to finish</p>
          </div>
          <div>
            <p className="font-serif-display text-4xl text-primary mb-2">100%</p>
            <p className="text-sm text-muted-foreground">Real, delivered work</p>
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
};

export default About;
