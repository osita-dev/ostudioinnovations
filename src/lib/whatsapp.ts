import type { CategorySlug } from "@/types";
import { getServiceBySlug } from "@/data/services";

// ⚠️ REPLACE with O Studio's real WhatsApp Business number.
// International format, digits only — no +, spaces, or dashes.
// e.g. +234 801 234 5678  →  "2348012345678 2348035754289"
export const OSTUDIO_WHATSAPP_NUMBER = "2348035754289";

interface WhatsAppInquiryData {
  service: CategorySlug | string;
  projectType: string;
  date?: string;
  location?: string;
  expectedGuests?: string;
  budgetRange: string;
  description: string;
  additionalRequirements?: string;
  name: string;
  phone: string;
  email: string;
}

export function buildWhatsAppMessage(data: WhatsAppInquiryData): string {
  const serviceName = getServiceBySlug(data.service)?.name ?? data.service;

  const lines = [
    "*New Project Request — O Studio Innovations*",
    "",
    `*Service:* ${serviceName}`,
    `*Project Type:* ${data.projectType}`,
    data.date ? `*Date:* ${data.date}` : null,
    data.location ? `*Location:* ${data.location}` : null,
    data.expectedGuests ? `*Expected Guests:* ${data.expectedGuests}` : null,
    `*Budget Range:* ${data.budgetRange}`,
    "",
    "*Description:*",
    data.description,
    data.additionalRequirements ? `\n*Additional Requirements:*\n${data.additionalRequirements}` : null,
    "",
    "*Contact Details*",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}

export function buildWhatsAppLink(data: WhatsAppInquiryData): string {
  const message = buildWhatsAppMessage(data);
  return `https://wa.me/${OSTUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}