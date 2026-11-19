/**
 * FaqAccordion — the FAQ list on dark glass: each row is a translucent
 * panel with a gold plus that turns to a cross while open. Uses the stock
 * Accordion (height animation unchanged = smooth open); only classNames
 * and the icon swap live here. Questions and answers come from data.
 */
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/data/faq";

export function FaqAccordion() {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {faqItems.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="glass rounded-xl px-6 overflow-hidden"
        >
          <AccordionTrigger
            className="group text-left font-serif-display text-base hover:no-underline py-5
              [&>svg:last-child]:hidden
              [&[data-state=open]>svg:first-of-type]:rotate-45"
          >
            {item.question}
            <Plus
              aria-hidden
              className="icon-gold h-4 w-4 shrink-0 transition-transform duration-500 ml-4"
            />
          </AccordionTrigger>
          <AccordionContent className="text-foreground/60 leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
