import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/data/faq";
import { CTABanner } from "@/components/layout/CTABanner";

const FAQ = () => {
  return (
    <div>
      <section className="bg-hero-gradient py-24">
        <div className="container text-center">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">FAQ</p>
          <h1 className="font-serif-display text-4xl sm:text-5xl max-w-2xl mx-auto leading-tight">
            Answers before you have to ask.
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            The most common questions about working with O Studio.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="bg-card border border-border rounded-xl px-6 shadow-card"
              >
                <AccordionTrigger className="text-left font-serif-display text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTABanner
        title="Still have a question?"
        description="Reach out directly and O Studio will get back to you."
      />
    </div>
  );
};

export default FAQ;
