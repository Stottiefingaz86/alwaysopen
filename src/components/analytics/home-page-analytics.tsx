"use client";

import { SectionViewTracker } from "@/components/analytics/section-view-tracker";
import { HOME_PAGE_SECTIONS } from "@/lib/analytics/home-sections";

export function HomePageAnalytics() {
  return <SectionViewTracker sections={HOME_PAGE_SECTIONS} />;
}
