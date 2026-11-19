/**
 * FAQ — the answers page: a compact hero slate, the stock Accordion
 * restyled on dark glass (see FaqAccordion), closed by the side-branch
 * exit bar. Questions and answers stay verbatim from data.
 */
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { BackToStory } from "@/components/shared/BackToStory";

const FAQ = () => {
  return (
    <div>
      <section className="bg-hero-gradient py-16 sm:py-20">
        <div className="container text-center">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">FAQ</p>
          <h1 className="font-serif-display text-3xl sm:text-4xl max-w-2xl mx-auto leading-tight">
            Answers before you have to ask.
          </h1>
          <p className="mt-4 text-foreground/60 max-w-xl mx-auto">
            The most common questions about working with O Studio.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <FaqAccordion />
        </div>
      </section>

      <BackToStory />
    </div>
  );
};

export default FAQ;
