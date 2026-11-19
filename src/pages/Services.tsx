/**
 * Services — "What we do": the short hero, six cinematic panels in the
 * canonical scene order (large number, hover-played media, Read more),
 * the discovery block, and the closing credits card.
 */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicePanel } from "@/components/services/ServicePanel";
import { SERVICE_SCENE_ORDER } from "@/components/home/sceneOrder";
import { serviceCategories } from "@/data/services";
import { CreditsCTA } from "@/components/home/CreditsCTA";
import { usePageMeta } from "@/hooks/usePageMeta";

const Services = () => {
  usePageMeta(
    "What we do — Services | O Studio Innovations",
    "Six services, one studio: Media & Events, Film & Production, Content & Entertainment, Technology, Creative Services, and Studio Rental."
  );

  return (
    <div>
      <ServicesHero />

      {SERVICE_SCENE_ORDER.map((slug, i) => {
        const service = serviceCategories.find((s) => s.slug === slug);
        if (!service) return null;
        return <ServicePanel key={slug} service={service} index={i + 1} />;
      })}

      <section className="py-20 text-center">
        <div className="container">
          <Link
            to="/discover"
            className="group inline-flex items-center gap-3 font-serif-display text-3xl tracking-tight text-foreground sm:text-4xl"
          >
            Not sure which fits?
            <ArrowRight
              size={26}
              className="shrink-0 text-foreground/60 transition-colors group-hover:text-foreground"
            />
          </Link>
        </div>
      </section>

      <CreditsCTA />
    </div>
  );
};

export default Services;
