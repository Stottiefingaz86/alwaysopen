/**
 * Public demo booking URL — must be an **appointment schedule** page, not your
 * signed-in calendar week view (…/calendar/u/0/r/week/… will not work for visitors).
 *
 * Google Workspace: Calendar → Create → Appointment schedule → enable Google Meet
 * → copy the **booking page** link (calendar.app.google/… or …/calendar/appointments/).
 */
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ?? "";

/** Google scheduling-button embed URL (…/appointments/schedules/…?gv=true) */
export const BOOKING_SCHEDULE_EMBED_URL =
  process.env.NEXT_PUBLIC_BOOKING_SCHEDULE_EMBED_URL?.trim() ?? "";

export const BOOK_DEMO_PATH = "/book-demo";

/** Personal calendar UI — not shareable for booking */
export function isCalendarAdminViewUrl(url: string): boolean {
  try {
    const { pathname } = new URL(url);
    return (
      pathname.includes("/calendar/u/") &&
      (pathname.includes("/r/week") ||
        pathname.includes("/r/month") ||
        pathname.includes("/r/day") ||
        pathname.includes("/r/agenda"))
    );
  } catch {
    return false;
  }
}

/** URL visitors can use to pick a slot (appointment schedule, Calendly, etc.) */
export function isPublicBookingUrl(url: string): boolean {
  if (!url) return false;
  if (isCalendarAdminViewUrl(url)) return false;

  try {
    const { hostname, pathname } = new URL(url);
    if (
      hostname === "calendar.google.com" &&
      (pathname.includes("/appointments") || pathname.includes("/appointments/schedules"))
    ) {
      return true;
    }
    if (
      hostname.includes("calendly.com") ||
      hostname.includes("cal.com") ||
      hostname.includes("calendar.app.google")
    ) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export function getPublicBookingUrl(): string | null {
  return isPublicBookingUrl(BOOKING_URL) ? BOOKING_URL : null;
}

export function isBookingConfigured(): boolean {
  return Boolean(getPublicBookingUrl() || getBookingScheduleEmbedUrl());
}

/** URL for Google's official scheduling-button (opens appointment popup). */
export function getBookingScheduleEmbedUrl(): string | null {
  if (!BOOKING_SCHEDULE_EMBED_URL) return null;
  const raw = BOOKING_SCHEDULE_EMBED_URL;

  try {
    const url = new URL(raw);
    if (
      url.hostname === "calendar.google.com" &&
      url.pathname.includes("/appointments/schedules/")
    ) {
      url.searchParams.set("gv", "true");
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

/** Centred popup for Google appointment booking (falls back to new tab if blocked). */
export function openBookingPopup(url: string): void {
  if (typeof window === "undefined") return;

  const width = 520;
  const height = Math.min(780, Math.round(window.screen.availHeight * 0.9));
  const left = Math.round((window.screen.width - width) / 2);
  const top = Math.round((window.screen.height - height) / 2);
  const features = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    "noopener",
    "noreferrer",
    "scrollbars=yes",
    "resizable=yes",
  ].join(",");

  const popup = window.open(url, "ringsaway-book-demo", features);
  if (popup) {
    popup.focus();
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}
