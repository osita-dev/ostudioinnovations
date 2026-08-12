import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTABanner } from "@/components/layout/CTABanner";
import { getServiceBySlug } from "@/data/services";
import { portfolioProjects } from "@/data/portfolio";
import { getIcon } from "@/lib/icons";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug ?? "");

  if (!service) return <Navigate to="/services" replace />;

  const Icon = getIcon(service.icon);
  const relatedProjects = portfolioProjects
    .filter((p) => p.serviceCategory === service.slug)
    .slice(0, 3);

  return (
    <div>
      <section className="bg-hero-gradient py-24">
        <div className="container">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">
            <Link to="/services" className="hover:underline">Services</Link> / {service.shortName}
          </p>
          <div className="flex items-start gap-5">
            <Icon className="text-primary mt-1 shrink-0" size={40} strokeWidth={1.5} />
            <div>
              <h1 className="font-serif-display text-4xl sm:text-5xl leading-tight">{service.name}</h1>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl">{service.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-xs tracking-widest-plus uppercase text-primary mb-3">What It Is</h2>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>

            <div>
              <h2 className="text-xs tracking-widest-plus uppercase text-primary mb-3">Who It's For</h2>
              <p className="text-muted-foreground leading-relaxed">{service.whoItsFor}</p>
            </div>

            <div>
              <h2 className="text-xs tracking-widest-plus uppercase text-primary mb-4">What's Included</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {service.included.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check size={15} className="text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs tracking-widest-plus uppercase text-primary mb-4">Expected Deliverables</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check size={15} className="text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs tracking-widest-plus uppercase text-primary mb-6">Our Process</h2>
              <ol className="space-y-6 border-l border-border pl-6">
                {service.process.map((step, i) => (
                  <li key={step.title} className="relative">
                    <span className="absolute -left-[31px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                      {i + 1}
                    </span>
                    <h3 className="font-serif-display text-base mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>

            {relatedProjects.length > 0 && (
              <div>
                <h2 className="text-xs tracking-widest-plus uppercase text-primary mb-4">Relevant Examples</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedProjects.map((p) => (
                    <Link
                      key={p.id}
                      to={`/portfolio/${p.slug}`}
                      className="group block rounded-xl overflow-hidden border border-border"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <p className="text-xs p-3 text-muted-foreground group-hover:text-primary transition-colors">
                        {p.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card border border-border rounded-2xl p-8 shadow-card">
              <p className="text-xs tracking-widest-plus uppercase text-primary mb-2">Starting At</p>
              <p className="font-serif-display text-2xl mb-6">{service.startingPrice}</p>
              <p className="text-xs tracking-widest-plus uppercase text-primary mb-3">Includes</p>
              <ul className="space-y-2 mb-8">
                {service.subServices.map((s) => (
                  <li key={s} className="text-sm text-muted-foreground">{s}</li>
                ))}
              </ul>
              <Button asChild size="lg" className="w-full rounded-full">
                <Link to={`/start-project?service=${service.slug}`}>
                  Request This Service <ArrowRight className="ml-2" size={16} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="w-full rounded-full mt-2">
                <Link to="/faq">Have Questions First?</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title={`Ready to start your ${service.shortName.toLowerCase()} project?`}
        description="Tell us the details and O Studio will follow up with a tailored plan."
      />
    </div>
  );
};

export default ServiceDetail;
