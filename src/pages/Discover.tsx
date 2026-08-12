import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { discoveryOptions } from "@/data/discovery";
import { getServiceBySlug } from "@/data/services";
import { portfolioProjects } from "@/data/portfolio";
import { getIcon } from "@/lib/icons";
import { CTABanner } from "@/components/layout/CTABanner";

const Discover = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = discoveryOptions.find((o) => o.id === selectedId);
  const recommendedServices = selected?.recommendedCategories.map(getServiceBySlug).filter(Boolean) ?? [];

  return (
    <div>
      <section className="bg-hero-gradient py-24">
        <div className="container text-center">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">Project Discovery</p>
          <h1 className="font-serif-display text-4xl sm:text-5xl max-w-2xl mx-auto leading-tight">
            {selected ? "Here's what we'd recommend." : "What are you trying to do?"}
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            {selected
              ? "Based on your answer, here's where to start."
              : "You don't need to know the exact service name — just tell us the outcome you want."}
          </p>
        </div>
      </section>

      {!selected ? (
        <section className="py-16">
          <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {discoveryOptions.map((option) => {
              const Icon = getIcon(option.icon);
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedId(option.id)}
                  className="text-left bg-card border border-border rounded-2xl p-7 hover:border-primary/50 transition-colors shadow-card"
                >
                  <Icon className="text-primary mb-4" size={26} strokeWidth={1.5} />
                  <h3 className="font-serif-display text-lg mb-1.5">{option.prompt}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{option.description}</p>
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="py-16">
          <div className="container max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedId(null)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
            >
              <ArrowLeft size={14} /> Choose a different objective
            </button>

            {recommendedServices.length > 0 ? (
              <div className="space-y-6">
                {recommendedServices.map((service) => {
                  if (!service) return null;
                  const Icon = getIcon(service.icon);
                  const example = portfolioProjects.find((p) => p.serviceCategory === service.slug);
                  return (
                    <div key={service.slug} className="bg-card border border-border rounded-2xl p-8 shadow-card">
                      <div className="flex items-start gap-4 mb-4">
                        <Icon className="text-primary shrink-0 mt-1" size={28} strokeWidth={1.5} />
                        <div>
                          <h2 className="font-serif-display text-2xl mb-1">{service.name}</h2>
                          <p className="text-sm text-muted-foreground">{service.tagline}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <Button asChild className="rounded-full">
                          <Link to={`/services/${service.slug}`}>
                            See Full Service Details <ArrowRight className="ml-2" size={15} />
                          </Link>
                        </Button>
                        {example && (
                          <Button asChild variant="outline" className="rounded-full">
                            <Link to={`/portfolio/${example.slug}`}>View Related Work</Link>
                          </Button>
                        )}
                        <Button asChild variant="ghost" className="rounded-full">
                          <Link to={`/start-project?service=${service.slug}`}>Start This Project</Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-10 text-center shadow-card">
                <h2 className="font-serif-display text-2xl mb-3">Let's talk it through.</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto">
                  Your project doesn't have to fit a preset category. Describe what you need and O Studio
                  will figure out the right approach with you.
                </p>
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link to="/start-project">
                    Start a Conversation <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      <CTABanner />
    </div>
  );
};

export default Discover;
