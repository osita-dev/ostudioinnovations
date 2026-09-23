import type { FAQItem } from "@/types";

// ============================================================
// FAQ
// NOTE: Per the brief, answers must reflect O Studio's actual
// policies — nothing here invents specific prices, deposit
// percentages, or delivery windows. Where a real policy number
// is required (e.g. deposit %, exact delivery days), the answer
// is written to be accurate-by-default and easy to edit once
// O Studio confirms the specifics.
// ============================================================

export const faqItems: FAQItem[] = [
  {
    id: "faq-001",
    question: "How do I book O Studio?",
    answer:
      "Start by submitting a project request through our Start a Project page, or use the Project Discovery tool if you're not sure which service you need. Our team will follow up to discuss your project and confirm availability.",
    category: "booking",
  },
  {
    id: "faq-002",
    question: "How far in advance should I book?",
    answer:
      "We recommend reaching out as early as possible, especially for time-sensitive dates like weddings and events. Availability is confirmed on a first-come basis once details are agreed.",
    category: "booking",
  },
  {
    id: "faq-003",
    question: "Do you cover events outside Lagos?",
    answer:
      "We take on projects outside Lagos on a case-by-case basis. Let us know your location when you submit a project request and we'll confirm feasibility and any additional logistics involved.",
    category: "booking",
  },
  {
    id: "faq-004",
    question: "How does pricing work?",
    answer:
      "Pricing depends on the scope, duration, and specifics of your project. After you submit a project request, our team reviews the details and provides a tailored estimate or quote.",
    category: "pricing",
  },
  {
    id: "faq-005",
    question: "Do you require a deposit?",
    answer:
      "Booking terms, including any deposit requirements, are confirmed with you directly once your project is scoped and a quote is agreed.",
    category: "pricing",
  },
  {
    id: "faq-006",
    question: "How long does delivery take?",
    answer:
      "Delivery timelines vary by project type and scope. Your expected delivery window is communicated and agreed as part of the quote and booking process.",
    category: "delivery",
  },
  {
    id: "faq-007",
    question: "How are files delivered?",
    answer:
      "Final deliverables are shared digitally, typically via a secure online gallery or file-sharing link, unless another delivery method has been agreed for your project.",
    category: "delivery",
  },
  {
    id: "faq-008",
    question: "Can I request a custom package?",
    answer:
      "Yes. If your project doesn't fit neatly into a standard service, describe what you need on the Start a Project page and our team will put together a custom scope.",
    category: "services",
  },
  {
    id: "faq-009",
    question: "Can multiple O Studio services be combined?",
    answer:
      "Yes — many projects combine services, for example event photography with branded print materials, or a documentary with a companion website. Mention all relevant needs in your project request.",
    category: "services",
  },
  {
    id: "faq-010",
    question: "Do you build custom websites?",
    answer:
      "Yes. Our Technology service covers custom website design and development, built around your specific business needs rather than a generic template.",
    category: "services",
  },
  {
    id: "faq-011",
    question: "Do you build AI solutions?",
    answer:
      "Yes. We work on AI-powered and digital solutions as part of our Technology service. Share what you're trying to solve or automate in your project request and we'll advise on the right approach.",
    category: "services",
  },
];
