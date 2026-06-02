export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-LKZ1X78WD4";

export type GtagSection = {
  id: string;
  name: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function gtagEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}

/** Fires once per section when it enters the viewport (GA4 custom event). */
export function trackSectionView(section: GtagSection) {
  gtagEvent("section_view", {
    section_id: section.id,
    section_name: section.name,
  });
}
