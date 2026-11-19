/**
 * ProjectDetail — composes the film: title sequence (the expand
 * destination), story with lightbox gallery, optional BTS and pull quote,
 * end credits with the booking button, then the next-project strip.
 * Unknown slugs still redirect to the portfolio.
 */
import { useParams, Navigate } from "react-router-dom";
import { TitleSequence } from "@/components/project/TitleSequence";
import { ProjectStory } from "@/components/project/ProjectStory";
import { BehindTheScenes } from "@/components/project/BehindTheScenes";
import { PullQuote } from "@/components/project/PullQuote";
import { EndCredits } from "@/components/project/EndCredits";
import { NextProject } from "@/components/project/NextProject";
import { getProjectBySlug, portfolioProjects } from "@/data/portfolio";
import { getServiceBySlug } from "@/data/services";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = getProjectBySlug(slug ?? "");

  if (!project) return <Navigate to="/portfolio" replace />;

  const service = getServiceBySlug(project.serviceCategory);
  const index = portfolioProjects.findIndex((p) => p.id === project.id);
  const next = portfolioProjects[(index + 1) % portfolioProjects.length];

  return (
    <div>
      <TitleSequence project={project} service={service} />
      <ProjectStory project={project} />
      <BehindTheScenes text={project.behindTheScenes} />
      <PullQuote testimonial={project.testimonial} />
      <EndCredits project={project} service={service} />
      <NextProject next={next} />
    </div>
  );
};

export default ProjectDetail;
