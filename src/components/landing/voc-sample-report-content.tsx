"use client";

import {
  ActionPlanBlock,
  CompetitorBlock,
  GoogleStrategyBlock,
  SuggestionBlock,
  ThemeReviewsBlock,
  TrendingTopicsBlock,
} from "@/components/landing/voc-report-sections";
import { VocSentimentChart } from "@/components/landing/voc-sentiment-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Messages } from "@/lib/i18n/messages/en";
import { cn } from "@/lib/utils";
import {
  ListChecks,
  MapPin,
  PenLine,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Users,
} from "lucide-react";

type VocIndustryDemo = Extract<
  Messages["vocDemos"]["industries"][keyof Messages["vocDemos"]["industries"]],
  { available: true }
>;

type VocPanels = Messages["voc"]["panels"];

type VocSampleReportContentProps = {
  demo: VocIndustryDemo;
  ui: Messages["vocDemos"];
  panels: VocPanels;
  showHeading?: boolean;
  className?: string;
};

export function VocSampleReportContent({
  demo,
  ui,
  panels: p,
  showHeading = true,
  className,
}: VocSampleReportContentProps) {
  const report = demo.monthlyReport;

  return (
    <div className={cn("space-y-4", className)}>
      {showHeading ? (
        <p className="text-xs font-medium uppercase tracking-wider text-google-gray-500">
          {ui.report.sampleHeading}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-google-gray-200 shadow-google-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium md:text-base">
              <TrendingUp className="size-4 text-google-blue" />
              {p.sentiment.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VocSentimentChart
              chartLabel={demo.sentiment.chartLabel}
              trend={demo.sentiment.trend}
              months={demo.sentiment.months}
              bars={demo.sentiment.bars}
              chartHeight={96}
            />
          </CardContent>
        </Card>

        <Card className="border-google-gray-200 shadow-google-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium md:text-base">
              <Users className="size-4 text-google-blue" />
              {p.competitors.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CompetitorBlock data={report.competitors} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-google-gray-200 shadow-google-card">
        <CardContent className="pt-6">
          <TrendingTopicsBlock items={demo.trending} title={ui.report.trendingTitle} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-google-green/30 bg-google-green/5 shadow-google-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-google-green md:text-base">
              <ThumbsUp className="size-4" />
              {p.praise.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeReviewsBlock
              themes={report.praise.themes}
              tone="positive"
              featured={report.praise.review}
            />
          </CardContent>
        </Card>

        <Card className="border-google-red/30 bg-google-red/5 shadow-google-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-google-red md:text-base">
              <ThumbsDown className="size-4" />
              {p.complaints.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeReviewsBlock
              themes={report.complaints.themes}
              tone="negative"
              featured={report.complaints.review}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-google-gray-200 shadow-google-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium md:text-base">
              <MapPin className="size-4 text-google-blue" />
              {p.google.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoogleStrategyBlock
              listingGaps={demo.menuGaps}
              strategy={report.googleStrategy}
            />
          </CardContent>
        </Card>

        <Card className="border-google-gray-200 shadow-google-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium md:text-base">
              <PenLine className="size-4 text-google-blue" />
              {p.suggestions.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SuggestionBlock data={report.suggestions} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-google-blue/25 bg-pastel-blue/40 shadow-google-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-google-blue md:text-base">
            <ListChecks className="size-4" />
            {p.actions.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActionPlanBlock items={demo.recommendations} />
        </CardContent>
      </Card>
    </div>
  );
}
