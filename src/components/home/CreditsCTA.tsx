/**
 * CreditsCTA — the film's closing card: the giant "Let's make something."
 * line, the planning prompt, and the two ways to start — the white primary
 * into the brief form, and a WhatsApp button straight from contact data.
 */
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import { contactWhatsAppUrl } from "@/data/contact";

export function CreditsCTA() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="container text-center">
        <Reveal>
          <h2 className="font-serif-display text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
            Let&apos;s make something.
          </h2>
        </Reveal>
        <Reveal delay={stagger.base}>
          <p className="mt-6 text-lg text-foreground/60">Tell us what you&apos;re planning.</p>
        </Reveal>
        <Reveal delay={stagger.base * 2} className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/start-project">
              Start a project <ArrowRight className="ml-2" size={16} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <a href={contactWhatsAppUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
