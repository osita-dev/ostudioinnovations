import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { CTABanner } from "@/components/layout/CTABanner";
import { serviceCategories } from "@/data/services";
import { getIcon } from "@/lib/icons";

const Services = () => {
  return (
    <div>
      <section className="bg-hero-gradient py-24">
        <div className="container text-center">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">What We Do</p>
          <h1 className="font-serif-display text-4xl sm:text-5xl max-w-3xl mx-auto leading-tight">
            Five capabilities, working as one studio.
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Rather than a raw list of services, here's how each part of O Studio solves a real problem —
            and how they connect when your project needs more than one.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container space-y-8">
          {serviceCategories.map((service, i) => {
            const Icon = getIcon(service.icon);
            return (
              <div
                key={service.slug}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-card ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="lg:col-span-7">
                  <Icon className="text-primary mb-5" size={30} strokeWidth={1.5} />
                  <h2 className="font-serif-display text-2xl sm:text-3xl mb-3">{service.name}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-5">{service.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.subServices.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-primary tracking-wide"
                  >
                    View Service Details <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="lg:col-span-5 bg-secondary/40 rounded-xl p-6">
                  <p className="text-xs tracking-widest-plus uppercase text-primary mb-3">Who It's For</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.whoItsFor}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20 border-t border-border bg-card/30">
        <div className="container">
          <SectionHeading
            eyebrow="Combining Services"
            title="Not sure which category fits your project?"
            description="Most real projects touch more than one service. Use our Project Discovery tool to describe what you're trying to accomplish, and we'll point you to the right combination."
            align="center"
            className="mb-8"
          />
          <div className="text-center">
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 text-sm tracking-widest-plus uppercase text-primary"
            >
              Start Project Discovery <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
};

export default Services;
