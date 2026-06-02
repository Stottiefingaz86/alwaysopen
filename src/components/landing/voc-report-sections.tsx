"use client";

import { VocSentimentChart } from "@/components/landing/voc-sentiment-chart";
import type { Messages } from "@/lib/i18n/messages/en";
import { normalizeSuggestionsForDisplay } from "@/lib/voc/suggestions";
import type { VocReportData } from "@/lib/voc/report-types";
import {
  buildReviewPool,
  countThemeMentionsInPool,
  filterReviewsByTheme,
  type ReviewSnippetData,
  splitQuoteForThemeHighlight,
  themeLabelWithoutCount,
} from "@/lib/voc/theme-reviews";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";

type VocIndustryDemo = Extract<
  Messages["vocDemos"]["industries"][keyof Messages["vocDemos"]["industries"]],
  { available: true }
>;

type MonthlyReport = VocIndustryDemo["monthlyReport"];
type PanelCopy = Messages["voc"]["panels"];

export function SectionSummary({ text }: { text?: string | null }) {
  if (!text?.trim()) return null;
  return (
    <p className="mb-4 rounded-lg border border-google-blue/15 bg-pastel-blue/30 px-3 py-2.5 text-sm leading-relaxed text-google-gray-700">
      {text}
    </p>
  );
}

function ReportSection({
  title,
  description,
  summary,
  children,
}: {
  title: string;
  description: string;
  summary?: string | null;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-google-gray-200 py-5 last:border-b-0">
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-google-gray-500">{description}</p>
      <div className="mt-4">
        <SectionSummary text={summary} />
        {children}
      </div>
    </section>
  );
}

export function MarketGapsBlock({
  data,
}: {
  data: NonNullable<VocReportData["marketGaps"]>;
}) {
  return (
    <div className="space-y-3">
      <SectionSummary text={data.summary} />
      <ul className="space-y-2">
        {data.gaps.map((gap) => (
          <li
            key={gap}
            className="flex items-start gap-2 rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-sm text-google-gray-700"
          >
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />
            {gap}
          </li>
        ))}
      </ul>
      {data.peersCompared.length > 0 ? (
        <p className="text-[10px] text-google-gray-500">
          Compared with: {data.peersCompared.join(", ")}
        </p>
      ) : null}
    </div>
  );
}

export type TrendingTopicItem = {
  topic: string;
  count: number;
  tone: "negative" | "positive" | "neutral";
};

export function TrendingTopicsBlock({
  items,
  title = "Trending topics",
}: {
  items: readonly TrendingTopicItem[];
  title?: string;
}) {
  if (!items.length) return null;

  return (
    <div>
      <p className="text-sm font-medium text-foreground md:text-base">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.topic}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
              item.tone === "negative"
                ? "border-google-red/25 bg-google-red/5 text-google-red"
                : item.tone === "positive"
                  ? "border-google-green/25 bg-google-green/5 text-google-green"
                  : "border-google-gray-200 bg-google-gray-50 text-google-gray-700"
            )}
          >
            {item.topic}
            <span className="rounded-full bg-white/80 px-1.5 text-xs font-medium tabular-nums">
              {item.count}
            </span>
          </span>
        ))}
      </div>
    </div>
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
    <ThemeReviewsBlock themes={items} tone={tone} featured={null} moreReviews={[]} />
  );
}

/** Clickable theme chips, expand reviews that match each theme from the scrape. */
export function ThemeReviewsBlock({
  themes,
  tone,
  featured,
  moreReviews = [],
  reviewCorpus,
  reviewsInPeriod,
  scrapedReviewTotal,
}: {
  themes: readonly string[];
  tone: "negative" | "positive";
  featured: ReviewSnippetData | null;
  moreReviews?: readonly ReviewSnippetData[];
  reviewCorpus?: VocReportData["reviewCorpus"];
  /** Reviews published in the report month */
  reviewsInPeriod?: number;
  /** Total reviews in the Google scrape */
  scrapedReviewTotal?: number;
}) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const pool = buildReviewPool({ tone, featured, moreReviews, reviewCorpus });
  const hasCorpus = Boolean(reviewCorpus?.length);

  const visibleThemes = themes
    .map((theme) => ({
      theme,
      count: countThemeMentionsInPool(pool, theme),
    }))
    .filter((item) => item.count > 0);
  const poolLabel =
    scrapedReviewTotal != null && scrapedReviewTotal > (reviewsInPeriod ?? 0)
      ? `${pool.length} in Google sample`
      : `${pool.length} in this scrape`;

  const matching = selectedTheme ? filterReviewsByTheme(pool, selectedTheme) : [];
  const verifiedCount = selectedTheme
    ? countThemeMentionsInPool(pool, selectedTheme)
    : null;

  const chipTone =
    tone === "negative"
      ? {
          base: "border-google-red/25 bg-google-red/5 text-google-red hover:border-google-red/40 hover:bg-google-red/10",
          active: "border-google-red bg-google-red/15 ring-2 ring-google-red/25",
        }
      : {
          base: "border-google-green/25 bg-google-green/5 text-google-green hover:border-google-green/40 hover:bg-google-green/10",
          active: "border-google-green bg-google-green/15 ring-2 ring-google-green/25",
        };

  return (
    <div className="space-y-3">
      <ul className="flex flex-wrap gap-2">
        {visibleThemes.length === 0 ? (
          <li className="text-xs text-google-gray-500">
            No verified themes in this sample, regenerate the report to refresh counts.
          </li>
        ) : null}
        {visibleThemes.map(({ theme, count }) => {
          const active = selectedTheme === theme;
          return (
            <li key={theme}>
              <button
                type="button"
                onClick={() =>
                  setSelectedTheme((prev) => (prev === theme ? null : theme))
                }
                aria-pressed={active}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-2 text-left text-sm font-medium transition-colors",
                  active ? chipTone.active : chipTone.base
                )}
              >
                {themeLabelWithoutCount(theme)}
                <span className="ml-1.5 tabular-nums opacity-80">
                  ({count} mention{count === 1 ? "" : "s"})
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {selectedTheme ? (
        <div className="space-y-3 border-t border-google-gray-200 pt-4">
          <p className="text-xs font-medium text-google-gray-700">
            Reviews matching &ldquo;{themeLabelWithoutCount(selectedTheme)}&rdquo;
            <span className="font-normal text-google-gray-500">
              {" "}
             , {matching.length} of {pool.length} matching review
              {pool.length === 1 ? "" : "s"} ({poolLabel}
              {reviewsInPeriod != null && reviewsInPeriod > 0
                ? ` · ${reviewsInPeriod} published in report month`
                : ""}
              )
              {hasCorpus ? "" : ", regenerate report for full corpus"}
            </span>
          </p>
          {matching.length > 0 ? (
            matching.map((review, idx) => (
              <ReviewSnippet
                key={`${review.author}-${idx}`}
                review={review}
                highlightTheme={selectedTheme}
                tone={tone}
              />
            ))
          ) : (
            <p className="text-sm text-google-gray-500">
              No reviews in this scrape matched this theme with our text matcher.
              {verifiedCount === 0
                ? " The mention count on the label is recounted from your scraped reviews, if this still shows 0, reviewers may describe the issue with different words (e.g. “slow” rather than “service speed”)."
                : ""}{" "}
              {!hasCorpus
                ? "Regenerate this report to attach all scraped quotes to theme filters."
                : ""}
            </p>
          )}
          <button
            type="button"
            onClick={() => setSelectedTheme(null)}
            className="text-sm font-medium text-google-blue hover:underline"
          >
            Clear theme filter
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-google-gray-500">
          Tap a theme to see matching reviews from your Google scrape. Counts are
          verified from review text, not AI estimates.
        </p>
      )}

      {featured != null && !selectedTheme ? (
        <ReviewSnippet review={featured} />
      ) : null}

      {!selectedTheme && moreReviews.length > 0 ? (
        <MoreReviewSnippets reviews={moreReviews} />
      ) : null}

      {hasCorpus && pool.length > 0 ? (
        <div className="border-t border-google-gray-200 pt-4">
          <button
            type="button"
            onClick={() => setShowAllReviews((v) => !v)}
            className="text-sm font-medium text-google-blue hover:underline"
          >
            {showAllReviews
              ? "Hide all reviews"
              : `Show all ${pool.length} ${tone === "negative" ? "low-star" : "positive"} reviews (${poolLabel})`}
          </button>
          {showAllReviews ? (
            <div className="mt-3 space-y-0">
              {pool.map((review, idx) => (
                <ReviewSnippet
                  key={`all-${review.author}-${idx}`}
                  review={review}
                  highlightTheme={selectedTheme}
                  tone={tone}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function HighlightedQuote({
  quote,
  theme,
  tone,
}: {
  quote: string;
  theme: string;
  tone: "negative" | "positive";
}) {
  const segments = splitQuoteForThemeHighlight(quote, theme);
  const markClass =
    tone === "negative"
      ? "rounded-sm bg-google-red/15 font-medium text-google-red"
      : "rounded-sm bg-google-green/15 font-medium text-google-green";

  return (
    <>
      &ldquo;
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark key={i} className={markClass}>
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
      &rdquo;
    </>
  );
}

export function ReviewSnippet({
  review,
  highlightTheme,
  tone = "neutral",
}: {
  review: ReviewSnippetData;
  highlightTheme?: string | null;
  tone?: "negative" | "positive" | "neutral";
}) {
  return (
    <div className="mt-3 rounded-xl border border-google-gray-200 bg-white p-3 shadow-google">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{review.author}</p>
        <div className="flex items-center gap-2 text-[10px] text-google-gray-500">
          {review.stars != null ? (
            <span className="tabular-nums">{review.stars}★</span>
          ) : null}
          {review.date ? <span>{review.date}</span> : null}
          <span>{review.source}</span>
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-google-gray-600">
        {highlightTheme && tone !== "neutral" ? (
          <HighlightedQuote quote={review.quote} theme={highlightTheme} tone={tone} />
        ) : (
          <>&ldquo;{review.quote}&rdquo;</>
        )}
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

type CompetitorData = MonthlyReport["competitors"] & {
  mentions?: readonly {
    name: string;
    quote: string;
    author: string;
    date?: string | null;
    stars?: number | null;
    source: string;
  }[];
};

export function CompetitorBlock({ data }: { data: CompetitorData }) {
  const maxRating = 5;
  const mentions = data.mentions ?? [];
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? mentions : mentions.slice(0, 2);

  return (
    <div>
      <p className="text-xs font-medium text-google-gray-700">{data.chartLabel}</p>
      <p className="mt-0.5 text-[10px] text-google-gray-500">{data.note}</p>
      {"areaBenchmark" in data && data.areaBenchmark ? (
        <p className="mt-1 text-[10px] text-google-blue">
          Portfolio benchmark, scores derived from VoC reports for businesses you manage
          with the same tag and location.
        </p>
      ) : null}
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
                {row.highlight ? (
                  <span className="ml-1 font-normal text-google-gray-500">(you)</span>
                ) : null}
              </span>
              <span className="shrink-0 tabular-nums text-google-gray-600">{row.rating}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-google-gray-100">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  row.highlight ? "bg-google-blue" : "bg-google-gray-400"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${(row.rating / maxRating) * 100}%` }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.45 }}
              />
            </div>
          </li>
        ))}
      </ul>

      {mentions.length > 0 ? (
        <div className="mt-5 border-t border-google-gray-200 pt-4">
          <p className="text-xs font-medium text-google-gray-700">
            What reviewers said when comparing venues
          </p>
          <p className="mt-0.5 text-[10px] text-google-gray-500">
            Verbatim quotes from scraped Google reviews, not generated.
          </p>
          <ul className="mt-3 space-y-3">
            {visible.map((m, idx) => (
              <li
                key={`${m.author}-${idx}`}
                className="rounded-xl border border-google-gray-200 bg-google-gray-50/80 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-foreground">
                    vs {m.name}
                  </span>
                  <span className="text-google-gray-500">
                    {m.author}
                    {m.date ? ` · ${m.date}` : ""}
                    {m.stars != null ? ` · ${m.stars}★` : ""}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-google-gray-600">
                  &ldquo;{m.quote}&rdquo;
                </p>
              </li>
            ))}
          </ul>
          {mentions.length > 2 ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 text-sm font-medium text-google-blue hover:underline"
            >
              {expanded
                ? "Show fewer comparison reviews"
                : `Show all ${mentions.length} comparison reviews`}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function getMoreReviews(section: unknown): readonly ReviewSnippetData[] {
  const list = (section as { moreReviews?: readonly ReviewSnippetData[] }).moreReviews;
  return Array.isArray(list) ? list : [];
}

function MoreReviewSnippets({
  reviews,
}: {
  reviews: readonly ReviewSnippetData[];
}) {
  if (!reviews.length) return null;
  return (
    <div className="mt-4 space-y-3 border-t border-google-gray-200 pt-4">
      <p className="text-xs font-medium text-google-gray-700">More from this month&apos;s scrape</p>
      {reviews.map((review, idx) => (
        <ReviewSnippet key={`${review.author}-${idx}`} review={review} />
      ))}
    </div>
  );
}

export function SuggestionBlock({
  data,
}: {
  data: MonthlyReport["suggestions"] | VocReportData["monthlyReport"]["suggestions"];
}) {
  const { summary, items } = normalizeSuggestionsForDisplay(
    data as VocReportData["monthlyReport"]["suggestions"]
  );
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, 3);

  if (!items.length) {
    return (
      <p className="text-sm text-google-gray-500">
        No unreplied 3-star or below reviews in this scrape, great job staying on top of Google
        replies.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {summary ? (
        <p className="text-sm font-medium text-foreground">{summary}</p>
      ) : null}
      {visible.map((item, idx) => (
        <div key={`${item.reviewAuthor}-${idx}`} className="space-y-3">
          <div className="rounded-xl border border-google-red/20 bg-google-red/5 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-google-red">
              {item.reviewLabel}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium text-foreground">{item.reviewAuthor}</p>
              {item.stars != null ? (
                <span className="text-[10px] tabular-nums text-google-gray-500">
                  {item.stars}★
                </span>
              ) : null}
              {item.date ? (
                <span className="text-[10px] text-google-gray-500">{item.date}</span>
              ) : null}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-google-gray-600">
              &ldquo;{item.reviewQuote}&rdquo;
            </p>
          </div>
          <div className="rounded-xl border border-google-gray-200 bg-white p-4 shadow-google-card">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-google-blue">
              {item.replyLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-google-gray-700">{item.replyText}</p>
          </div>
        </div>
      ))}
      {items.length > 3 ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-sm font-medium text-google-blue hover:underline"
        >
          {expanded
            ? "Show fewer reply suggestions"
            : `Show all ${items.length} reply suggestions`}
        </button>
      ) : null}
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

export type VocReportSectionSummaries = {
  complaints?: string | null;
  praise?: string | null;
  competitors?: string | null;
  googleStrategy?: string | null;
  actionPlan?: string | null;
};

type VocMonthlyReportBodyProps = {
  report: MonthlyReport;
  listingGaps: readonly string[];
  actions: readonly { priority: string; text: string }[];
  sentiment: VocIndustryDemo["sentiment"] & {
    explanation?: string;
    methodNote?: string;
  };
  panels: PanelCopy;
  summaries?: VocReportSectionSummaries;
  reviewCorpus?: VocReportData["reviewCorpus"];
  reviewsInPeriod?: number;
  scrapedReviewTotal?: number;
};

function readSummary(
  section: unknown,
  fallback?: string | null
): string | null | undefined {
  const s = (section as { summary?: string })?.summary;
  return s?.trim() ? s : fallback;
}

export function VocMonthlyReportBody({
  report,
  listingGaps,
  actions,
  sentiment,
  panels,
  summaries,
  reviewCorpus,
  reviewsInPeriod,
  scrapedReviewTotal,
}: VocMonthlyReportBodyProps) {
  return (
    <div className="divide-y divide-google-gray-200">
      <ReportSection
        title={panels.complaints.title}
        description={panels.complaints.description}
        summary={summaries?.complaints ?? readSummary(report.complaints)}
      >
        <ThemeReviewsBlock
          themes={report.complaints.themes}
          tone="negative"
          featured={report.complaints.review}
          moreReviews={getMoreReviews(report.complaints)}
          reviewCorpus={reviewCorpus}
          reviewsInPeriod={reviewsInPeriod}
          scrapedReviewTotal={scrapedReviewTotal}
        />
      </ReportSection>

      <ReportSection
        title={panels.praise.title}
        description={panels.praise.description}
        summary={summaries?.praise ?? readSummary(report.praise)}
      >
        <ThemeReviewsBlock
          themes={report.praise.themes}
          tone="positive"
          featured={report.praise.review}
          moreReviews={getMoreReviews(report.praise)}
          reviewCorpus={reviewCorpus}
          reviewsInPeriod={reviewsInPeriod}
          scrapedReviewTotal={scrapedReviewTotal}
        />
      </ReportSection>

      <ReportSection
        title={panels.sentiment.title}
        description={panels.sentiment.description}
      >
        {sentiment.explanation?.trim() ? (
          <p className="mb-4 text-sm leading-relaxed text-google-gray-700">
            {sentiment.explanation}
          </p>
        ) : null}
        <div className="rounded-xl border border-google-gray-200 bg-gradient-to-b from-white to-google-gray-50/80 p-4 shadow-google-card sm:p-5">
          <VocSentimentChart
            chartLabel={sentiment.chartLabel}
            trend={sentiment.trend}
            months={sentiment.months}
            bars={sentiment.bars}
            chartHeight={148}
          />
        </div>
      </ReportSection>

      <ReportSection
        title={panels.competitors.title}
        description={panels.competitors.description}
        summary={
          summaries?.competitors ?? readSummary(report.competitors as { summary?: string })
        }
      >
        <CompetitorBlock data={report.competitors} />
      </ReportSection>

      <ReportSection
        title={panels.suggestions.title}
        description={panels.suggestions.description}
      >
        <SuggestionBlock data={report.suggestions} />
      </ReportSection>

      <ReportSection
        title={panels.google.title}
        description={panels.google.description}
        summary={
          summaries?.googleStrategy ??
          (report as { googleStrategySummary?: string }).googleStrategySummary
        }
      >
        <GoogleStrategyBlock listingGaps={listingGaps} strategy={report.googleStrategy} />
      </ReportSection>

      <ReportSection
        title={panels.actions.title}
        description={panels.actions.description}
        summary={summaries?.actionPlan}
      >
        <ActionPlanBlock items={actions} />
      </ReportSection>
    </div>
  );
}
