/**
 * ServiceDetail — composes the service's film: hero title, story blocks,
 * included grids, the pinned process timeline, related work, and the
 * closing CTA. Unknown slugs still redirect to the services list.
 */
import { useParams, Navigate } from "react-router-dom";
import { DetailHero } from "@/components/services/detail/DetailHero";
import { WhatItIs } from "@/components/services/detail/WhatItIs";
import { IncludedGrid } from "@/components/services/detail/IncludedGrid";
import { ProcessTimeline } from "@/components/services/detail/ProcessTimeline";
import { RelatedWork } from "@/components/services/detail/RelatedWork";
import { DetailCTA } from "@/components/services/detail/DetailCTA";
import { getServiceBySlug } from "@/data/services";
import { portfolioProjects } from "@/data/portfolio";
import { usePageMeta } from "@/hooks/usePageMeta";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug ?? "");

  // Before the redirect so the hook order stays fixed across renders.
  usePageMeta(
    service ? `${service.name} | O Studio Innovations` : "Services | O Studio Innovations",
    service?.tagline ?? "Six services, one studio at O Studio Innovations."
  );

  if (!service) return <Navigate to="/services" replace />;

  const relatedProjects = portfolioProjects
    .filter((p) => p.serviceCategory === service.slug)
    .slice(0, 3);

  return (
    <div>
      <DetailHero service={service} />
      <WhatItIs service={service} />
      <IncludedGrid service={service} />
      <ProcessTimeline service={service} />
      <RelatedWork service={service} projects={relatedProjects} />
      <DetailCTA service={service} />
    </div>
  );
};

export default ServiceDetail;
