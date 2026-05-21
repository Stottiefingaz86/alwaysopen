/** ElevenLabs Conversational AI — Chris (homepage hero) */
export const ELEVENLABS_AGENT = {
  name: "Chris",
  id: "agent_8601ks0784njem2rdqg7yy725gnr",
} as const;

/** Restaurant industry demo agent */
export const RESTAURANT_AGENT = {
  name: "Restaurant",
  id: "agent_6001ks4pwkcgep3smf9jcfg9phvy",
} as const;

export type IndustryAgentKey = "restaurant" | "salon" | "estateAgency" | "clinic";

export const INDUSTRY_AGENT_IDS: Partial<Record<IndustryAgentKey, string>> = {
  restaurant: RESTAURANT_AGENT.id,
};

/** Siri orb palettes per industry demo */
export const INDUSTRY_ORB_COLORS: Partial<
  Record<
    IndustryAgentKey,
    { bg: string; c1: string; c2: string; c3: string; glow: string }
  >
> = {
  restaurant: {
    bg: "oklch(98% 0.02 85)",
    c1: "oklch(52% 0.14 45)",
    c2: "oklch(72% 0.16 75)",
    c3: "oklch(48% 0.12 25)",
    glow: "bg-amber-500/15",
  },
};

export const DEFAULT_ORB_COLORS = {
  bg: "oklch(98% 0.008 240)",
  c1: "oklch(55% 0.14 240)",
  c2: "oklch(72% 0.12 220)",
  c3: "oklch(65% 0.1 235)",
  glow: "bg-google-blue/10",
} as const;

export const ELEVENLABS_WIDGET_SCRIPT =
  "https://elevenlabs.io/convai-widget/index.js";

/** Calendly / booking link — set in .env.local as NEXT_PUBLIC_BOOKING_URL */
export const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://calendly.com";

export type BookingToolParams = {
  name?: string;
  email?: string;
  phone?: string;
  preferred_time?: string;
  preferred_date?: string;
  service?: string;
};

export function formatBookingConfirmation(params: BookingToolParams): string {
  const parts = [
    params.name && `Name: ${params.name}`,
    params.email && `Email: ${params.email}`,
    params.phone && `Phone: ${params.phone}`,
    (params.preferred_date || params.preferred_time) &&
      `Preferred time: ${[params.preferred_date, params.preferred_time].filter(Boolean).join(" ")}`,
    params.service && `Service: ${params.service}`,
  ].filter(Boolean);

  return parts.length
    ? `Booking noted. ${parts.join(". ")}. Our team will confirm shortly.`
    : `Booking request received. Our team will confirm your appointment shortly.`;
}
