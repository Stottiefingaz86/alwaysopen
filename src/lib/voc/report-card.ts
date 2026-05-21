import type { CaseStudyListItem } from "@/lib/voc/case-studies";
import { formatPeriodLabel } from "@/lib/voc/period";
import type { VocReportData } from "@/lib/voc/report-types";

export type VocReportCardMetric = {
  key: string;
  label: string;
  value: number;
  color: "violet" | "amber" | "green" | "red";
};

/** Shared card shape for sample and published VoC reports on the landing page. */
export type VocReportCardModel = {
  available: boolean;
  /** @deprecated Use tagLabels — kept for sample industry cards */
  industryLabel: string;
  tagLabels: string[];
  businessName: string;
  location: string;
  source: "google" | "tripadvisor";
  reviewCount: number;
  score: number;
  period: string;
  metrics: VocReportCardMetric[];
};

export function caseStudyToReportCard(item: CaseStudyListItem): VocReportCardModel {
  const tagLabels = item.tagLabels.length ? item.tagLabels : ["Client report"];
  return {
    available: true,
    industryLabel: tagLabels[0] ?? "Client report",
    tagLabels,
    businessName: item.title,
    location: item.location,
    source: item.source,
    reviewCount: item.reviewCount,
    score: item.score,
    period: item.periodLabel,
    metrics: item.metrics,
  };
}

export function reportDataToCardMetrics(
  data: Pick<VocReportData, "metrics">
): VocReportCardMetric[] {
  return (data.metrics ?? []).slice(0, 3).map((m) => ({
    key: m.key,
    label: m.label,
    value: m.value,
    color: m.color,
  }));
}

export function caseStudyCardFieldsFromReport(
  data: VocReportData,
  periodKey: string
): Pick<
  CaseStudyListItem,
  "score" | "scoreLabel" | "reviewCount" | "metrics" | "periodLabel" | "source"
> {
  const source =
    data.source === "tripadvisor" ? "tripadvisor" : "google";
  return {
    score: data.score,
    scoreLabel: data.scoreLabel,
    reviewCount: data.reviewCount,
    periodLabel: data.period?.trim() || formatPeriodLabel(periodKey),
    source,
    metrics: reportDataToCardMetrics(data),
  };
}
