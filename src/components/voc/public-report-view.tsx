"use client";

import {
  MarketGapsBlock,
  TrendingTopicsBlock,
  VocMonthlyReportBody,
  type VocReportSectionSummaries,
} from "@/components/landing/voc-report-sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VocReportData } from "@/lib/voc/report-types";
import { cn } from "@/lib/utils";
import { MapPin, Share2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const GOOGLE_ICON = "/google-my-business-icon.svg";

function reportSourceLabel(source: string): string {
  if (source === "tripadvisor") return "Tripadvisor";
  if (source === "trustpilot") return "Trustpilot";
  return "Google";
}

const panels = {
  complaints: {
    title: "Top complaints",
    description: "Themes from your full review sample, with an example quote.",
  },
  praise: {
    title: "What customers love",
    description: "What repeats across positive reviews this month.",
  },
  sentiment: {
    title: "Sentiment trend",
    description: "How scores moved month by month from review dates.",
  },
  competitors: {
    title: "Competitor & area benchmark",
    description:
      "Portfolio peers in your area (same tag) plus venues named in reviews.",
  },
  suggestions: {
    title: "Reply suggestions",
    description:
      "Draft replies for 3-star and below reviews with no owner response yet.",
  },
  google: {
    title: "Google listing strategy",
    description: "Profile updates tied to what reviewers mention.",
  },
  actions: {
    title: "Action plan",
    description: "Prioritised steps for the month ahead.",
  },
} as const;

export function PublicReportView({
  report,
  businessSlug,
  period,
}: {
  report: VocReportData;
  businessSlug: string;
  period: string;
}) {
  const [copied, setCopied] = useState(false);
  const mr = report.monthlyReport;

  const summaries: VocReportSectionSummaries = {
    complaints: mr.complaints.summary,
    praise: mr.praise.summary,
    competitors: mr.competitors.summary,
    googleStrategy: mr.googleStrategySummary,
    actionPlan: report.actionPlanSummary,
  };

  function copyLink() {
    const url = `${window.location.origin}/reports/${businessSlug}/${period}`;
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8 overflow-hidden rounded-2xl border border-google-gray-200 bg-white shadow-google-card">
        <div className="flex items-center justify-between gap-3 border-b border-google-gray-100 bg-google-gray-50/60 px-4 py-2.5 sm:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-google-gray-500">
            Voice of Customer · {report.period}
          </p>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-google-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-google-blue transition-colors hover:border-google-blue/30 hover:bg-pastel-blue/40"
          >
            <Share2 className="size-3.5" aria-hidden />
            {copied ? "Copied" : "Share"}
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
          <div className="flex min-w-0 flex-1 items-start gap-3.5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-google-gray-200 bg-white shadow-google">
              {report.source === "tripadvisor" ? (
                <span className="text-sm font-bold text-[#34e0a1]">TA</span>
              ) : (
                <Image src={GOOGLE_ICON} alt="" width={28} height={28} />
              )}
            </span>
            <div className="min-w-0 pt-0.5">
              <h1 className="text-xl font-medium leading-tight text-foreground sm:text-2xl">
                {report.businessName}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-1 text-sm text-google-gray-500">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                <span>
                  {report.location} · {reportSourceLabel(report.source)}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-google-gray-400">
                {report.reviewCount} review{report.reviewCount === 1 ? "" : "s"} published
                in {report.period}
                {report.scrapedReviewTotal != null &&
                report.scrapedReviewTotal > report.reviewCount ? (
                  <>
                    {" "}
                    <span className="text-google-gray-400">
                      · {report.scrapedReviewTotal} in full Google sample
                    </span>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-google-gray-100 pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 sm:text-right">
            <div className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0">
              <span className="text-4xl font-semibold leading-none tabular-nums text-foreground sm:text-[2.75rem]">
                {report.score}
              </span>
              <span className="text-sm font-medium text-google-gray-600 sm:mt-1">
                {report.scoreLabel}
              </span>
            </div>
          </div>
        </div>
      </header>

      {report.executiveSummary ? (
        <Card className="mb-8 border-google-blue/20 bg-pastel-blue/20 shadow-google-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Executive summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-google-gray-700">
              {report.executiveSummary}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="mb-8">
        {report.areaMetricBenchmark && report.areaMetricBenchmark.peerCount > 0 ? (
          <p className="mb-3 text-xs text-google-gray-500">
            Area average from {report.areaMetricBenchmark.peerCount} other{" "}
            {report.areaMetricBenchmark.tagLabel}
            {report.areaMetricBenchmark.peerCount === 1 ? "" : "s"} in{" "}
            {report.areaMetricBenchmark.location} (same tag and location in your
            portfolio).
          </p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          {report.metrics.map((m) => {
            const areaAvg = report.areaMetricBenchmark?.averages.find(
              (a) => a.key === m.key
            )?.average;
            const vsArea =
              areaAvg != null ? m.value - areaAvg : null;
            return (
              <Card key={m.key} className="border-google-gray-200 shadow-google-card">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium">{m.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold tabular-nums">{m.value}</p>
                  {areaAvg != null ? (
                    <p className="mt-1.5 text-xs text-google-gray-500">
                      Area avg{" "}
                      <span className="font-medium tabular-nums text-google-gray-700">
                        {areaAvg}
                      </span>
                      {vsArea !== 0 && vsArea != null ? (
                        <span
                          className={cn(
                            "font-medium",
                            vsArea > 0 ? "text-google-green" : "text-amber-700"
                          )}
                        >
                          {" "}
                          ({vsArea > 0 ? "+" : ""}
                          {vsArea} vs area)
                        </span>
                      ) : (
                        <span className="text-google-gray-400"> (matches area)</span>
                      )}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {report.marketGaps ? (
        <Card className="mb-8 border-amber-200/60 bg-amber-50/30 shadow-google-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              {report.marketGaps.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarketGapsBlock data={report.marketGaps} />
          </CardContent>
        </Card>
      ) : null}

      {report.trending.length > 0 ? (
        <Card className="mb-8 border-google-gray-200 shadow-google-card">
          <CardContent className="pt-6">
            <TrendingTopicsBlock items={report.trending} />
          </CardContent>
        </Card>
      ) : null}

      <Card className={cn("border-google-gray-200 shadow-google-card")}>
        <CardContent className="pt-6">
          <VocMonthlyReportBody
            {...({
              report: mr,
              listingGaps: report.menuGaps,
              actions: report.recommendations,
              sentiment: report.sentiment,
              panels,
              summaries,
              reviewCorpus: report.reviewCorpus,
              reviewsInPeriod: report.reviewCount,
            } as unknown as Parameters<typeof VocMonthlyReportBody>[0])}
          />
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs text-google-gray-500">
        Prepared by RingsAway · ringsaway.com
      </p>
    </div>
  );
}
