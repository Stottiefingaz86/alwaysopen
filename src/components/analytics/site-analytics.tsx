"use client";

import {
  getClickLabel,
  trackClick,
  trackPageView,
} from "@/lib/analytics/gtag";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const INTERACTIVE_SELECTOR =
  'a[href], button, [role="button"], input[type="submit"], input[type="button"], [data-ga-track]';

function readGaParams(el: HTMLElement): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of Array.from(el.attributes)) {
    if (key.name.startsWith("data-ga-") && key.name !== "data-ga-track") {
      out[key.name.replace("data-ga-", "")] = key.value;
    }
  }
  return out;
}

function RouteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    const path = search ? `${pathname}?${search}` : pathname;
    trackPageView(path);
  }, [pathname, search]);

  return null;
}

function GlobalClickAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const el = target.closest(INTERACTIVE_SELECTOR) as HTMLElement | null;
      if (!el) return;

      if (el.closest("[data-ga-ignore]")) return;
      if (el.closest("[data-ga-skip-global]")) return;

      const explicitEvent = el.getAttribute("data-ga-event");
      const gaParams = readGaParams(el);
      const label = getClickLabel(el);
      const anchor = el.closest("a");
      const linkUrl =
        anchor?.getAttribute("href") ??
        el.getAttribute("href") ??
        undefined;

      if (explicitEvent) {
        trackClick({
          clickText: label,
          clickTag: el.tagName.toLowerCase(),
          linkUrl,
          elementId: el.id || undefined,
          pagePath: pathname,
          location: gaParams.location ?? explicitEvent,
        });
        return;
      }

      if (el.hasAttribute("data-ga-skip-global")) return;

      trackClick({
        clickText: label,
        clickTag: el.tagName.toLowerCase(),
        linkUrl,
        elementId: el.id || undefined,
        pagePath: pathname,
        location: gaParams.location ?? "",
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return null;
}

export function SiteAnalytics() {
  return (
    <>
      <Suspense fallback={null}>
        <RouteAnalytics />
      </Suspense>
      <GlobalClickAnalytics />
    </>
  );
}
