import type { GtagSection } from "@/lib/analytics/gtag";

/** Homepage sections tracked via Intersection Observer → GA4 `section_view`. */
export const HOME_PAGE_SECTIONS: GtagSection[] = [
  { id: "hero", name: "Hero" },
  { id: "phone-receptionist", name: "How it works" },
  { id: "services", name: "Services" },
  { id: "ai-receptionist", name: "AI Receptionist" },
  { id: "industry-demos", name: "Live demos" },
  { id: "voice-of-customer", name: "Voice of Customer" },
  { id: "voc-demos", name: "VoC demos" },
  { id: "stats", name: "Stats" },
  { id: "problems", name: "The problem" },
  { id: "integrations", name: "Integrations" },
  { id: "voc", name: "VoC overview" },
  { id: "pricing", name: "Pricing" },
  { id: "news", name: "News" },
  { id: "about", name: "About" },
  { id: "faq", name: "FAQ" },
  { id: "final-cta", name: "Final CTA" },
  { id: "contact", name: "Contact" },
];
