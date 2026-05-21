import type { Messages } from "@/lib/i18n/messages/en";
import type { VocReportCardModel } from "@/lib/voc/report-card";

type VocIndustryDemo =
  Messages["vocDemos"]["industries"][keyof Messages["vocDemos"]["industries"]];

export function industryDemoToReportCard(
  demo: VocIndustryDemo,
  industryLabel: string
): VocReportCardModel {
  return {
    available: demo.available,
    industryLabel,
    tagLabels: [industryLabel],
    businessName: demo.businessName,
    location: demo.location,
    source: demo.source as "google" | "tripadvisor",
    reviewCount: demo.reviewCount,
    score: demo.score,
    period: demo.period,
    metrics: demo.available
      ? demo.metrics.slice(0, 3).map((m) => ({
          key: m.key,
          label: m.label,
          value: m.value,
          color: m.color,
        }))
      : [],
  };
}
