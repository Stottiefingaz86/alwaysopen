"use client";

import { trackSectionView, type GtagSection } from "@/lib/analytics/gtag";
import { useEffect, useRef } from "react";

type SectionViewTrackerProps = {
  sections: GtagSection[];
  /** Fraction of element visible before counting (0–1). */
  threshold?: number;
};

/**
 * Sends GA4 `section_view` when each configured section id enters the viewport.
 */
export function SectionViewTracker({
  sections,
  threshold = 0.35,
}: SectionViewTrackerProps) {
  const seen = useRef(new Set<string>());

  useEffect(() => {
    const elements: { el: Element; section: GtagSection }[] = [];

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) elements.push({ el, section });
    }

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const match = elements.find((item) => item.el === entry.target);
          if (!match || seen.current.has(match.section.id)) continue;
          seen.current.add(match.section.id);
          trackSectionView(match.section);
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    for (const { el } of elements) observer.observe(el);

    return () => observer.disconnect();
  }, [sections, threshold]);

  return null;
}
