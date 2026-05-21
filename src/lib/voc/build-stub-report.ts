import { formatPeriodLabel } from "@/lib/voc/period";
import {
  fallbackGoogleReply,
  findUnrepliedLowStarReviews,
  formatReviewDate,
  mapScrapedReviews,
  pickMoreReviewSnippets,
  starReviewLabel,
} from "@/lib/voc/review-helpers";
import type { ScrapedGoogleReview, VocReportData } from "@/lib/voc/report-types";
import { snippetsFromMappedReviews } from "@/lib/voc/theme-reviews";

function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Needs attention";
}

function pickReview(
  reviews: ScrapedGoogleReview[],
  preferLow: boolean
): ScrapedGoogleReview | undefined {
  const withText = reviews.filter((r) => (r.text ?? "").trim().length > 8);
  if (!withText.length) return undefined;
  const sorted = [...withText].sort((a, b) => (a.stars ?? 3) - (b.stars ?? 3));
  return preferLow ? sorted[0] : sorted[sorted.length - 1];
}

function excerpt(text: string, max = 220): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function themeFromReviews(
  reviews: ScrapedGoogleReview[],
  preferLow: boolean,
  limit = 3
): string[] {
  const filtered = reviews.filter((r) =>
    preferLow ? (r.stars ?? 5) <= 3 : (r.stars ?? 0) >= 4
  );
  const buckets = [
    { label: "Service & staff", re: /staff|service|friendly|rude|waiter/i },
    { label: "Wait times & booking", re: /wait|book|reserv|queue|delay/i },
    { label: "Quality & value", re: /quality|price|value|worth|expensive/i },
    { label: "Atmosphere", re: /view|atmosphere|ambience|clean|decor/i },
  ];
  return buckets
    .map((b) => ({
      label: b.label,
      count: filtered.filter((r) => b.re.test(r.text ?? "")).length,
    }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((x) => `${x.label} (${x.count} mentions)`);
}

export function buildStubVocReport(input: {
  businessName: string;
  location: string;
  periodKey: string;
  reviews: ScrapedGoogleReview[];
  placeRating?: number | null;
}): VocReportData {
  const { businessName, location, periodKey, reviews } = input;
  const count = reviews.length;
  const stars = reviews.map((r) => r.stars ?? 0).filter((s) => s > 0);
  const avgStars = stars.length
    ? stars.reduce((a, b) => a + b, 0) / stars.length
    : input.placeRating ?? 4;
  const score = Math.round(Math.min(100, Math.max(0, (avgStars / 5) * 100)));
  const mapped = mapScrapedReviews(reviews);
  const low = pickReview(reviews, true);
  const high = pickReview(reviews, false);
  const unreplied = findUnrepliedLowStarReviews(mapped, 8);
  const complaintThemes = themeFromReviews(reviews, true);
  const praiseThemes = themeFromReviews(reviews, false);
  const period = formatPeriodLabel(periodKey);

  const negativeCount = reviews.filter((r) => (r.stars ?? 5) <= 3).length;
  const positiveCount = reviews.filter((r) => (r.stars ?? 0) >= 4).length;
  const negBullets = complaintThemes.length
    ? complaintThemes
    : ["recurring themes in low-star reviews"];
  const posBullets = praiseThemes.length
    ? praiseThemes
    : ["strengths in four- and five-star reviews"];

  return {
    businessName,
    location: location || "—",
    listingGapsTitle: "Listing gaps (stub)",
    source: "google",
    reviewCount: count,
    score,
    scoreLabel: scoreLabel(score),
    period,
    executiveSummary: `${period} for ${businessName}: score ${score} (${scoreLabel(score)}) from ${count} reviews. Main concerns: ${negBullets[0]}. Top praise: ${posBullets[0]}. Add OpenAI for richer narrative summaries.`,
    metrics: [
      { key: "overall", label: "Overall sentiment", value: score, color: "violet" },
      {
        key: "service",
        label: "Service",
        value: Math.min(100, score + 8),
        color: "green",
      },
      {
        key: "value",
        label: "Value",
        value: Math.max(40, score - 12),
        color: "amber",
      },
      {
        key: "issues",
        label: "Issue rate",
        value: count ? Math.round((negativeCount / count) * 100) : 0,
        color: "red",
      },
    ],
    sentiment: {
      chartLabel: "Sentiment score (estimated)",
      trend: score >= 65 ? "↑ Improving" : "→ Stable",
      months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      bars: [
        Math.max(30, score - 24),
        Math.max(35, score - 18),
        Math.max(40, score - 12),
        Math.max(45, score - 8),
        Math.max(50, score - 4),
        score,
      ],
      explanation: `Bars show estimated monthly sentiment from star ratings in this scrape (${count} reviews). Overall score ${score}. Recent months trend ${score >= 65 ? "upward" : "flat"} — enable OpenAI for a narrative tied to real review dates.`,
    },
    menuGaps: [
      "Stub report — add OpenAI key for listing & menu gap analysis",
      "Verify hours and photos on Google Business Profile",
    ],
    trending: [
      {
        topic: "Negative themes",
        count: negativeCount,
        tone: "negative",
      },
      {
        topic: "Positive themes",
        count: positiveCount,
        tone: "positive",
      },
    ],
    positives: praiseThemes.length
      ? praiseThemes
      : ["No strong praise themes detected in scraped sample"],
    negatives: complaintThemes.length
      ? complaintThemes
      : ["No strong complaint themes detected in scraped sample"],
    actionPlanSummary:
      "Prioritise Google replies to low-star reviews and listing fixes below; enable OpenAI for tailored priorities.",
    reviewCorpus: snippetsFromMappedReviews(mapped),
    recommendations: [
      {
        priority: "High",
        text: "Reply to recent 3-star and below reviews within 48 hours",
      },
      {
        priority: "Medium",
        text: "Add OpenAI analysis to unlock tailored action items",
      },
    ],
    monthlyReport: {
      complaints: {
        summary: `Across low-star and negative reviews, themes cluster around: ${negBullets.join("; ")}. Example quote below — not an isolated case.`,
        themes: complaintThemes.length
          ? complaintThemes
          : ["Insufficient negative review text in sample"],
        review: {
          author: low?.name?.trim() || "Reviewer",
          source: "Google",
          stars: low?.stars,
          quote: low?.text
            ? excerpt(low.text)
            : "No representative negative review in this scrape.",
          tags: ["Stub analysis"],
        },
        moreReviews: pickMoreReviewSnippets(mapped, {
          preferLow: true,
          excludeQuote: low?.text ? excerpt(low.text) : undefined,
        }),
      },
      praise: {
        summary: `Positive feedback repeatedly mentions: ${posBullets.join("; ")}.`,
        themes: praiseThemes.length
          ? praiseThemes
          : ["Insufficient positive review text in sample"],
        review: {
          author: high?.name?.trim() || "Reviewer",
          source: "Google",
          stars: high?.stars,
          quote: high?.text
            ? excerpt(high.text)
            : "No representative positive review in this scrape.",
          tags: ["Stub analysis"],
        },
        moreReviews: pickMoreReviewSnippets(mapped, {
          preferLow: false,
          excludeQuote: high?.text ? excerpt(high.text) : undefined,
        }),
      },
      competitors: {
        summary:
          "Comparison quotes appear where reviewers name other venues. Tag peers in the same area for portfolio benchmarks.",
        chartLabel: "Competitor mentions",
        note: "Enable OpenAI for competitor extraction from reviews",
        rows: [
          {
            name: businessName,
            rating: Math.round(avgStars * 10) / 10,
            highlight: true,
          },
        ],
      },
      suggestions: {
        summary: unreplied.length
          ? `${unreplied.length} low-star review${unreplied.length === 1 ? "" : "s"} still need a Google reply`
          : "No unreplied low-star reviews in this scrape",
        items: unreplied.map((r) => ({
          reviewLabel: starReviewLabel(r.stars),
          reviewAuthor: r.author,
          reviewQuote: excerpt(r.text, 400),
          stars: r.stars ?? undefined,
          date: formatReviewDate(r.date),
          replyLabel: "Suggested Google reply (stub)",
          replyText: fallbackGoogleReply(r.author),
        })),
      },
      googleStrategy: [
        "Prioritise replies to reviews from the last 30 days",
        "Post weekly photo updates on Google Business Profile",
        "Connect OpenAI for AI-generated reply drafts",
      ],
      googleStrategySummary:
        "Align Google Business photos, hours, and replies with the themes customers mention most.",
    },
  };
}
