import {
  type BookingToolParams,
  formatBookingConfirmation,
} from "@/lib/elevenlabs-agent";
import { getPublicBookingUrl, openBookingPopup } from "@/lib/booking";
import type { ClientTool } from "@elevenlabs/react";

function openBookingPage(params: BookingToolParams) {
  if (typeof window === "undefined") return;
  const publicUrl = getPublicBookingUrl();
  if (!publicUrl) {
    window.open("/book-demo", "_blank", "noopener,noreferrer");
    return;
  }
  const url = new URL(publicUrl);
  if (params.name) url.searchParams.set("name", params.name);
  if (params.email) url.searchParams.set("email", params.email);
  openBookingPopup(url.toString());
}

/** Client tools — names should match tools configured on agent Chris in ElevenLabs */
export const bookingClientTools: Record<string, ClientTool> = {
  schedule_meeting: async (params) => {
    const p = params as BookingToolParams;
    openBookingPage(p);
    return `${formatBookingConfirmation(p)} I've opened our calendar so you can pick a time.`;
  },
  book_appointment: async (params) => {
    const p = params as BookingToolParams;
    openBookingPage(p);
    return `${formatBookingConfirmation(p)} I've opened our booking page.`;
  },
  book_meeting: async (params) => {
    const p = params as BookingToolParams;
    openBookingPage(p);
    return formatBookingConfirmation(p);
  },
  create_booking: async (params) => {
    const p = params as BookingToolParams;
    openBookingPage(p);
    return formatBookingConfirmation(p);
  },
};

export function attachWidgetClientTools(widget: HTMLElement) {
  const handler = (event: Event) => {
    const custom = event as CustomEvent<{
      config?: { clientTools?: Record<string, ClientTool> };
    }>;
    if (!custom.detail?.config) return;
    custom.detail.config.clientTools = {
      ...bookingClientTools,
      ...custom.detail.config.clientTools,
    };
  };

  widget.addEventListener("elevenlabs-convai:call", handler);
  return () => widget.removeEventListener("elevenlabs-convai:call", handler);
}
