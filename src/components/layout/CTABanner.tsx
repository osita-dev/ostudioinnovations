import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTABannerProps {
  title?: string;
  description?: string;
}

export function CTABanner({
  title = "Ready to start your project?",
  description = "Tell us what you're trying to accomplish and O Studio will take it from there.",
}: CTABannerProps) {
  return (
    <section className="border-t border-border">
      <div className="container py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-serif-display mb-4">{title}</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">{description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/start-project">
              Start a Project <ArrowRight className="ml-2" size={16} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <Link to="/discover">Not Sure Yet? Discover</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
