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

export type AnalyticsParams = Record<string, string | number | boolean>;

export function gtagEvent(eventName: string, params?: AnalyticsParams) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}

export function trackPageView(path: string, title?: string) {
  gtagEvent("page_view", {
    page_path: path,
    page_title: title ?? document.title,
    page_location: window.location.href,
  });
}

/** Any button, link, or explicit trackable control. */
export function trackClick(params: {
  clickText: string;
  clickTag?: string;
  linkUrl?: string;
  elementId?: string;
  pagePath?: string;
  location?: string;
}) {
  gtagEvent("click", {
    event_category: "engagement",
    click_text: params.clickText.slice(0, 120),
    click_tag: params.clickTag ?? "",
    link_url: params.linkUrl ?? "",
    element_id: params.elementId ?? "",
    page_path: params.pagePath ?? window.location.pathname,
    click_location: params.location ?? "",
  });
}

export function trackCtaClick(params: {
  label: string;
  href: string;
  location: string;
  variant?: string;
}) {
  gtagEvent("cta_click", {
    event_category: "cta",
    cta_label: params.label.slice(0, 120),
    link_url: params.href,
    cta_location: params.location,
    cta_variant: params.variant ?? "primary",
  });
}

export function trackBookDemoClick(location: string) {
  gtagEvent("book_demo_click", {
    event_category: "cta",
    cta_location: location,
  });
}

export function trackVideoPlay(location: string) {
  gtagEvent("video_play", {
    event_category: "video",
    video_location: location,
  });
}

export function trackVideoStop(location: string) {
  gtagEvent("video_stop", {
    event_category: "video",
    video_location: location,
  });
}

/** User opened live AI call UI (card button). */
export function trackLiveDemoOpen(industry: string, location: string) {
  gtagEvent("live_demo_open", {
    event_category: "demo",
    demo_industry: industry,
    demo_location: location,
  });
}

/** User started WebRTC / mic session inside demo dialog. */
export function trackLiveDemoCallStart(industry: string, location: string) {
  gtagEvent("live_demo_call_start", {
    event_category: "demo",
    demo_industry: industry,
    demo_location: location,
  });
}

export function trackLiveDemoCallEnd(industry: string, location: string) {
  gtagEvent("live_demo_call_end", {
    event_category: "demo",
    demo_industry: industry,
    demo_location: location,
  });
}

export function trackLiveDemoWorkflow(industry: string, location: string) {
  gtagEvent("live_demo_workflow", {
    event_category: "demo",
    demo_industry: industry,
    demo_location: location,
  });
}

export function trackVocReportOpen(params: {
  reportType: "sample" | "published";
  industry?: string;
  reportId?: string;
  reportTitle?: string;
  location: string;
}) {
  gtagEvent("voc_report_open", {
    event_category: "voc",
    report_type: params.reportType,
    demo_industry: params.industry ?? "",
    report_id: params.reportId ?? "",
    report_title: (params.reportTitle ?? "").slice(0, 120),
    voc_location: params.location,
  });
}

export function trackVocFilter(tag: string | null, location: string) {
  gtagEvent("voc_filter", {
    event_category: "voc",
    filter_tag: tag ?? "all",
    voc_location: location,
  });
}

export function trackContactFormSubmit(success: boolean) {
  gtagEvent("contact_form_submit", {
    event_category: "form",
    form_success: success,
  });
}

export function trackSectionView(section: GtagSection) {
  gtagEvent("section_view", {
    event_category: "engagement",
    section_id: section.id,
    section_name: section.name,
  });
}

export function getClickLabel(el: HTMLElement): string {
  const aria = el.getAttribute("aria-label")?.trim();
  if (aria) return aria;
  const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
  if (text) return text;
  const img = el.querySelector("img[alt]");
  if (img) return img.getAttribute("alt") ?? "image";
  return el.tagName.toLowerCase();
}
