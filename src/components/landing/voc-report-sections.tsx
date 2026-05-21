"use client";

import { VocSentimentChart } from "@/components/landing/voc-sentiment-chart";
import type { Messages } from "@/lib/i18n/messages/en";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type VocIndustryDemo = Extract<
  Messages["vocDemos"]["industries"][keyof Messages["vocDemos"]["industries"]],
  { available: true }
>;

type MonthlyReport = VocIndustryDemo["monthlyReport"];
type PanelCopy = Messages["voc"]["panels"];

function ReportSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-google-gray-200 py-5 last:border-b-0">
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-google-gray-500">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ThemeList({
  items,
  tone,
}: {
  items: readonly string[];
  tone: "negative" | "positive";
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "rounded-lg border px-3 py-2 text-sm text-google-gray-700",
            tone === "negative"
              ? "border-google-red/20 bg-google-red/5"
              : "border-google-green/20 bg-google-green/5"
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

type ReviewSnippetData = {
  author: string;
  source: string;
  quote: string;
  tags: readonly string[];
};

export function ReviewSnippet({ review }: { review: ReviewSnippetData }) {
  return (
    <div className="mt-3 rounded-xl border border-google-gray-200 bg-white p-3 shadow-google">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{review.author}</p>
        <span className="text-[10px] text-google-gray-500">{review.source}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-google-gray-600">
        &ldquo;{review.quote}&rdquo;
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {review.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-google-gray-100 px-2 py-0.5 text-[10px] font-medium text-google-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CompetitorBlock({
  data,
}: {
  data: MonthlyReport["competitors"];
}) {
  const maxRating = 5;

  return (
    <div>
      <p className="text-xs font-medium text-google-gray-700">{data.chartLabel}</p>
      <p className="mt-0.5 text-[10px] text-google-gray-500">{data.note}</p>
      <ul className="mt-4 space-y-3">
        {data.rows.map((row, i) => (
          <li key={row.name}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs">
              <span
                className={cn(
                  "truncate font-medium",
                  row.highlight ? "text-google-blue" : "text-google-gray-700"
                )}
              >
                {row.name}
              </span>
              <span className="shrink-0 tabular-nums text-google-gray-600">{row.rating}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-google-gray-100">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  row.highlight ? "bg-google-blue" : "bg-google-gray-300"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${(row.rating / maxRating) * 100}%` }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.45 }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SuggestionBlock({
  data,
}: {
  data: MonthlyReport["suggestions"];
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-google-red/20 bg-google-red/5 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-google-red">
          {data.reviewLabel}
        </p>
        <p className="mt-1 text-xs font-medium text-foreground">{data.reviewAuthor}</p>
        <p className="mt-1 text-xs leading-relaxed text-google-gray-600">
          &ldquo;{data.reviewQuote}&rdquo;
        </p>
      </div>
      <div className="rounded-xl border border-google-gray-200 bg-white p-4 shadow-google-card">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-google-blue">
          {data.replyLabel}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-google-gray-700">{data.replyText}</p>
      </div>
    </div>
  );
}

export function GoogleStrategyBlock({
  listingGaps,
  strategy,
}: {
  listingGaps: readonly string[];
  strategy: readonly string[];
}) {
  return (
    <ul className="space-y-2">
      {[...listingGaps, ...strategy].map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 rounded-lg border border-google-gray-200 bg-pastel-blue/40 px-3 py-2 text-sm text-google-gray-700"
        >
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-google-blue" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ActionPlanBlock({
  items,
}: {
  items: readonly { priority: string; text: string }[];
}) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li
          key={item.text}
          className="flex items-start gap-3 rounded-xl border border-google-gray-200 bg-white p-3 text-sm"
        >
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
              item.priority === "High" || item.priority === "Alta"
                ? "bg-google-red/10 text-google-red"
                : item.priority === "Medium" || item.priority === "Media"
                  ? "bg-pastel-blue text-google-blue"
                  : "bg-google-gray-100 text-google-gray-600"
            )}
          >
            {item.priority}
          </span>
          <span className="text-google-gray-700">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

type VocMonthlyReportBodyProps = {
  report: MonthlyReport;
  listingGaps: readonly string[];
  actions: readonly { priority: string; text: string }[];
  sentiment: VocIndustryDemo["sentiment"];
  panels: PanelCopy;
};

export function VocMonthlyReportBody({
  report,
  listingGaps,
  actions,
  sentiment,
  panels,
}: VocMonthlyReportBodyProps) {
  return (
    <div className="divide-y divide-google-gray-200">
      <ReportSection
        title={panels.complaints.title}
        description={panels.complaints.description}
      >
        <ThemeList items={report.complaints.themes} tone="negative" />
        <ReviewSnippet review={report.complaints.review} />
      </ReportSection>

      <ReportSection title={panels.praise.title} description={panels.praise.description}>
        <ThemeList items={report.praise.themes} tone="positive" />
        <ReviewSnippet review={report.praise.review} />
      </ReportSection>

      <ReportSection
        title={panels.sentiment.title}
        description={panels.sentiment.description}
      >
        <div className="rounded-xl border border-google-gray-200 bg-white p-4 shadow-google-card">
          <VocSentimentChart
            chartLabel={sentiment.chartLabel}
            trend={sentiment.trend}
            months={sentiment.months}
            bars={sentiment.bars}
            chartHeight={112}
          />
        </div>
      </ReportSection>

      <ReportSection
        title={panels.competitors.title}
        description={panels.competitors.description}
      >
        <CompetitorBlock data={report.competitors} />
      </ReportSection>

      <ReportSection
        title={panels.suggestions.title}
        description={panels.suggestions.description}
      >
        <SuggestionBlock data={report.suggestions} />
      </ReportSection>

      <ReportSection title={panels.google.title} description={panels.google.description}>
        <GoogleStrategyBlock listingGaps={listingGaps} strategy={report.googleStrategy} />
      </ReportSection>

      <ReportSection title={panels.actions.title} description={panels.actions.description}>
        <ActionPlanBlock items={actions} />
      </ReportSection>
    </div>
  );
}
