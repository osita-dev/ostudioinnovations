/**
 * BackToStory — the side-branch exit: a slim bar above the footer that
 * walks visitors back to the home story. Replaces the retired CTABanner
 * on pages that sit off the main journey (About, Journal, FAQ, Careers).
 */
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/cinema/motion/Reveal";

export function BackToStory() {
  return (
    <section className="border-t border-border">
      <div className="container py-14 text-center">
        <Reveal>
          <p className="text-xs tracking-widest-plus uppercase text-foreground/60 mb-5">
            End of this chapter
          </p>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link to="/">
              <ArrowLeft className="mr-2" size={16} />
              Back to the story
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
