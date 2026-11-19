/**
 * FeedbackSuccess — the warm completion screen for /feedback: the thank-you
 * copy verbatim from data, arriving with a soft rise so closing feels calm.
 * Reduced motion shows it already settled (Reveal handles the fallback).
 */
import { PartyPopper } from "lucide-react";
import { Reveal } from "@/cinema/motion/Reveal";
import { stagger } from "@/cinema/motion/presets";
import { Button } from "@/components/ui/button";
import { thankYouMessage } from "@/data/feedback";

export function FeedbackSuccess() {
  return (
    <div className="container py-24 sm:py-28 max-w-xl text-center">
      <Reveal>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <PartyPopper className="text-primary" size={28} />
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl leading-snug">
          {thankYouMessage}
        </h1>
      </Reveal>
      <Reveal delay={stagger.base}>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="rounded-full px-8 h-11 sm:h-9">
            <a href="/">Return Home</a>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
