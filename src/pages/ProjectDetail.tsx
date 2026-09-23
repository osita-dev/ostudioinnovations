import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/data/portfolio";
import { getServiceBySlug } from "@/data/services";
import { CTABanner } from "@/components/layout/CTABanner";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = getProjectBySlug(slug ?? "");

  if (!project) return <Navigate to="/portfolio" replace />;

  const service = getServiceBySlug(project.serviceCategory);

  return (
    <div>
      <section className="pt-10 pb-6">
        <div className="container">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> Back to Portfolio
          </Link>
        </div>
      </section>

      <section className="pb-12">
        <div className="container">
          <div className="rounded-2xl overflow-hidden mb-10">
            <img src={project.coverImage} alt={project.title} className="w-full max-h-[560px] object-cover" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-xs tracking-widest-plus uppercase text-primary mb-3">
                {service?.shortName} &middot; {project.year}
              </p>
              <h1 className="font-serif-display text-3xl sm:text-4xl mb-6">{project.title}</h1>
              <p className="text-muted-foreground leading-relaxed mb-10">{project.description}</p>

              {project.gallery.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4 mb-10">
                  {project.gallery.map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden aspect-[4/3]">
                      <img src={img} alt={`${project.title} ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {project.behindTheScenes && (
                <div className="mb-10">
                  <h2 className="text-xs tracking-widest-plus uppercase text-primary mb-3">Behind The Scenes</h2>
                  <p className="text-muted-foreground leading-relaxed">{project.behindTheScenes}</p>
                </div>
              )}

              {project.testimonial && (
                <blockquote className="border-l-2 border-primary pl-6 py-2 mb-10">
                  <p className="font-serif-display text-xl italic text-foreground leading-relaxed mb-3">
                    &ldquo;{project.testimonial.quote}&rdquo;
                  </p>
                  <footer className="text-sm text-muted-foreground">
                    {project.testimonial.author}
                    {project.testimonial.role ? `, ${project.testimonial.role}` : ""}
                  </footer>
                </blockquote>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card border border-border rounded-2xl p-8 shadow-card space-y-6">
                <div>
                  <p className="text-xs tracking-widest-plus uppercase text-primary mb-2">Client</p>
                  <p className="text-sm text-foreground">{project.client}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest-plus uppercase text-primary mb-2">Service</p>
                  {service && (
                    <Link to={`/services/${service.slug}`} className="text-sm text-foreground hover:text-primary transition-colors">
                      {service.name}
                    </Link>
                  )}
                </div>
                <div>
                  <p className="text-xs tracking-widest-plus uppercase text-primary mb-2">Deliverables</p>
                  <ul className="space-y-1.5">
                    {project.deliverables.map((d) => (
                      <li key={d} className="text-sm text-muted-foreground">{d}</li>
                    ))}
                  </ul>
                </div>
                {project.results && (
                  <div>
                    <p className="text-xs tracking-widest-plus uppercase text-primary mb-2">Results</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{project.results}</p>
                  </div>
                )}
                <Button asChild className="w-full rounded-full">
                  <Link to={`/start-project?service=${project.serviceCategory}`}>
                    Start a Similar Project <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
};

export default ProjectDetail;
