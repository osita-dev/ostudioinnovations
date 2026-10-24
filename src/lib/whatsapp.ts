import type { CategorySlug } from "@/types";
import { getServiceBySlug } from "@/data/services";

// ⚠️ REPLACE with O Studio's real WhatsApp Business number.
// International format, digits only — no +, spaces, or dashes.
// e.g. +234 801 234 5678  →  "2348012345678 2348035754289"
export const OSTUDIO_WHATSAPP_NUMBER = "2347042251787";

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

// ============================================================
// Content Creator Applications (the /careers page)
// Mirrors the project inquiry flow above: the application is
// summarised into a readable WhatsApp message and opened with
// the applicant's device.
// ============================================================

interface CreatorApplicationData {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  interests: string[];
  experience: string;
  equipment: string[];
  createdBefore: string;
  workSamples?: string;
  videoIdea: string;
  audienceInterest: string;
  resourcefulness: string;
  collaboration: string;
  localAvailability: string;
  schedule: string;
  motivation: string;
  creativeChallenge: string;
  practicalTask: string;
  finalNotes?: string;
}

export function buildApplicationMessage(data: CreatorApplicationData): string {
  const lines = [
    "*Content Creator Application — O Studio Innovations*",
    "",
    "*Section 1 — Personal Information*",
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Based in: ${data.location}`,
    "",
    "*Section 2 — Creative Interests*",
    `Interested in: ${data.interests.join(", ")}`,
    `Experience: ${data.experience}`,
    `Tools / equipment: ${data.equipment.join(", ")}`,
    "",
    "*Section 3 — Creative Portfolio*",
    `Content experience: ${data.createdBefore}`,
    data.workSamples ? `Work sample: ${data.workSamples}` : "Work sample: (not provided)",
    "",
    `Q10 — Short video idea:\n${data.videoIdea}`,
    "",
    `Q11 — What makes a video interesting:\n${data.audienceInterest}`,
    "",
    `Q12 — Good idea, limited resources:\n${data.resourcefulness}`,
    "",
    "*Section 4 — Collaboration and Availability*",
    `Collaboration type: ${data.collaboration}`,
    `Available around Gbagada Phase 1, Lagos: ${data.localAvailability}`,
    `Schedule: ${data.schedule}`,
    "",
    `Q16 — Why O Studio / what to contribute:\n${data.motivation}`,
    "",
    "*Section 5 — Your Creative Challenge*",
    `Q17 — One attention-grabbing video:\n${data.creativeChallenge}`,
    "",
    `Willing to complete a practical task: ${data.practicalTask}`,
    "",
    "*Section 6 — Final Confirmation*",
    "Declaration: confirmed (information accurate, work samples own/permissioned)",
    data.finalNotes ? `\nAnything else:\n${data.finalNotes}` : null,
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}

export function buildApplicationWhatsAppLink(data: CreatorApplicationData): string {
  const message = buildApplicationMessage(data);
  return `https://wa.me/${OSTUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
