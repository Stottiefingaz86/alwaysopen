/** ElevenLabs Conversational AI — Chris */
export const ELEVENLABS_AGENT = {
  name: "Chris",
  id: "agent_8601ks0784njem2rdqg7yy725gnr",
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
