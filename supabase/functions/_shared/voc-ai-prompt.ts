import {
  computeSentimentFromReviews,
  fallbackGoogleReply,
  findComparisonReviews,
  findUnrepliedLowStarReviews,
  formatReviewDate,
  parseReviewMonth,
  pickMoreReviewSnippets,
  resolveTrendingTopics,
  starReviewLabel,
} from "./review-metrics.ts";
import type { ReplySuggestionItem, ReviewLike } from "./review-metrics.ts";
import { DEMO_REPORT_EXAMPLE, VOC_UX_RESEARCHER_SYSTEM } from "./voc-constants.ts";
import {
  buildReviewCorpus,
  COMPLAINT_THEME_SEEDS,
  computeSectionThemesFromReviews,
  PRAISE_THEME_SEEDS,
  resolveReportThemes,
  reviewMatchesTheme,
  type TagHint,
} from "./theme-match.ts";

export { DEMO_REPORT_EXAMPLE, VOC_UX_RESEARCHER_SYSTEM };

export type ReviewForAi = {
  stars: number | null;
  text: string;
  author: string;
  date: string | null;
  hasOwnerReply?: boolean;
};

export function buildReviewStats(reviews: ReviewForAi[]) {
  const withStars = reviews.filter((r) => r.stars != null && r.stars > 0);
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of withStars) {
    const s = Math.round(r.stars!);
    if (s >= 1 && s <= 5) dist[s] = (dist[s] ?? 0) + 1;
  }
  const avg = withStars.length
    ? withStars.reduce((a, r) => a + (r.stars ?? 0), 0) / withStars.length
    : null;
  return { total: reviews.length, withText: reviews.filter((r) => r.text.length > 10).length, starDistribution: dist, averageStars: avg };
}

export function buildAnalysisUserPayload(input: {
  businessName: string;
  location: string;
  period: string;
  periodKey: string;
  placeRating: number | null;
  reviews: ReviewForAi[];
  areaPeerReportInsights?: {
    name: string;
    score: number;
    negatives: string[];
    positives: string[];
    menuGaps: string[];
  }[];
}) {
  const computedSentiment = computeSentimentFromReviews(
    input.reviews,
    input.periodKey,
    input.placeRating
  );
  const comparisonReviewCandidates = findComparisonReviews(input.reviews).map((r) => ({
    ...r,
    dateFormatted: formatReviewDate(r.date),
  }));
  const unrepliedLowStarReviews = findUnrepliedLowStarReviews(input.reviews, 12).map(
    (r) => ({
      stars: r.stars,
      text: r.text.slice(0, 500),
      author: r.author,
      date: r.date,
      dateFormatted: formatReviewDate(r.date),
    })
  );

  const corpus = input.reviews.filter((r) => r.text.length > 12);
  const complaintThemeCandidates = computeSectionThemesFromReviews(
    corpus,
    COMPLAINT_THEME_SEEDS,
    6
  );
  const praiseThemeCandidates = computeSectionThemesFromReviews(
    corpus,
    PRAISE_THEME_SEEDS,
    6
  );

  return JSON.stringify({
    task: "Produce a VoC monthly report JSON matching demoReportLayout exactly.",
    client: {
      businessName: input.businessName,
      location: input.location,
      period: input.period,
      placeRating: input.placeRating,
    },
    analysisScope: {
      instruction:
        "Analyze EVERY review in reviews[]. Complaint and praise themes must reflect patterns across the full scrape (reviewStats.withText), not a single review or only the report month. Use complaintThemeCandidates and praiseThemeCandidates for mention counts unless you recount across all reviews.",
      reviewsInPayload: input.reviews.length,
      reviewsWithText: corpus.length,
      lowStarInPayload: corpus.filter((r) => (r.stars ?? 5) <= 3).length,
    },
    computedSentiment,
    comparisonReviewCandidates,
    unrepliedLowStarReviews,
    complaintThemeCandidates,
    praiseThemeCandidates,
    areaPeerReportInsights: input.areaPeerReportInsights ?? [],
    reviewStats: buildReviewStats(input.reviews),
    reviews: input.reviews,
    demoReportLayout: DEMO_REPORT_EXAMPLE,
    outputContract: {
      note: "Copy the shape of demoReportLayout. Use computedSentiment for score/sentiment. All quotes must come from the reviews array. Theme mention counts must match the full reviews array (see complaintThemeCandidates). Include date on complaint/praise reviews and competitor mentions.",
      requiredTopLevelKeys: [
        "businessName",
        "location",
        "listingGapsTitle",
        "source",
        "reviewCount",
        "score",
        "scoreLabel",
        "period",
        "metrics",
        "sentiment",
        "menuGaps",
        "trending",
        "positives",
        "negatives",
        "recommendations",
        "monthlyReport",
      ],
    },
  });
}

const SCORE_LABELS: [number, string][] = [
  [80, "Excellent"],
  [70, "Good"],
  [55, "Fair"],
  [0, "Needs attention"],
];

export function scoreLabelFromScore(score: number): string {
  for (const [min, label] of SCORE_LABELS) {
    if (score >= min) return label;
  }
  return "Needs attention";
}

/** Light normalization so UI always gets demo-shaped data. */
export function normalizeVocReport(
  raw: Record<string, unknown>,
  input: {
    businessName: string;
    location: string;
    period: string;
    periodKey: string;
    reviewCount: number;
    placeRating: number | null;
    reviews: ReviewForAi[];
    generatedAt?: string;
  }
) {
  const computed = computeSentimentFromReviews(
    input.reviews,
    input.periodKey,
    input.placeRating
  );
  const score = computed.score;

  const pickQuote = (preferLow: boolean, pool: ReviewForAi[]) => {
    const withText = pool.filter((r) => r.text.length > 12);
    const sorted = [...withText].sort((a, b) => (a.stars ?? 3) - (b.stars ?? 3));
    const r = preferLow ? sorted[0] : sorted[sorted.length - 1];
    if (!r) return null;
    return {
      author: shortenAuthor(r.author),
      stars: r.stars ?? undefined,
      quote: r.text.slice(0, 280),
      date: formatReviewDate(r.date),
    };
  };

  const pickQuoteForTheme = (
    pool: ReviewForAi[],
    themeLine: string | undefined,
    preferLow: boolean
  ) => {
    const withText = pool.filter((r) => r.text.length > 12);
    if (!withText.length) return null;
    const lowStar = withText.filter((r) => (r.stars ?? 5) <= 3);
    const searchPool = preferLow && lowStar.length ? lowStar : withText;
    if (themeLine) {
      const match = searchPool.find((r) =>
        reviewMatchesTheme({ text: r.text, author: r.author, stars: r.stars }, themeLine)
      );
      if (match) {
        return {
          author: shortenAuthor(match.author),
          stars: match.stars ?? undefined,
          quote: match.text.slice(0, 280),
          date: formatReviewDate(match.date),
        };
      }
    }
    return pickQuote(preferLow, searchPool);
  };

  const periodReviews = input.reviews.filter(
    (r) => r.text.length > 12 && parseReviewMonth(r.date) === input.periodKey
  );
  const reviewsInPeriod = periodReviews.length;
  const scrapedTotal = input.reviewCount;

  const corpusAll = input.reviews.filter((r) => r.text.length > 12);

  const monthly = (raw.monthlyReport ?? {}) as Record<string, unknown>;
  const complaints = (monthly.complaints ?? {}) as Record<string, unknown>;
  const praise = (monthly.praise ?? {}) as Record<string, unknown>;
  const suggestions = (monthly.suggestions ?? {}) as Record<string, unknown>;
  const competitors = (monthly.competitors ?? {}) as Record<string, unknown>;

  const complaintReview = (complaints.review ?? {}) as Record<string, unknown>;
  const praiseReview = (praise.review ?? {}) as Record<string, unknown>;

  const tagHints: TagHint[] = [];
  const pushTagHints = (review: Record<string, unknown>) => {
    const quote = String(review.quote ?? "").trim();
    const tags = stringArray(review.tags, 0).slice(0, 4);
    if (quote.length > 12 && tags.length) tagHints.push({ quote, tags });
  };
  pushTagHints(complaintReview);
  pushTagHints(praiseReview);
  for (const row of Array.isArray(complaints.moreReviews) ? complaints.moreReviews : []) {
    if (row && typeof row === "object") pushTagHints(row as Record<string, unknown>);
  }
  for (const row of Array.isArray(praise.moreReviews) ? praise.moreReviews : []) {
    if (row && typeof row === "object") pushTagHints(row as Record<string, unknown>);
  }

  const reviewCorpus = buildReviewCorpus(input.reviews, tagHints);

  const reviewDate = (r: Record<string, unknown>, fallback?: { date: string | null }) =>
    typeof r.date === "string" && r.date.trim()
      ? r.date
      : fallback?.date ?? null;

  const complaintThemes = resolveReportThemes(
    stringArray(complaints.themes, 3),
    corpusAll,
    COMPLAINT_THEME_SEEDS,
    3
  );
  const praiseThemes = resolveReportThemes(
    stringArray(praise.themes, 3),
    corpusAll,
    PRAISE_THEME_SEEDS,
    3
  );

  const topComplaintTheme = complaintThemes[0];
  const topPraiseTheme = praiseThemes[0];
  const complaintFallback = pickQuoteForTheme(
    corpusAll,
    topComplaintTheme,
    true
  );
  const praiseFallback = pickQuoteForTheme(corpusAll, topPraiseTheme, false);

  const negativeLines = stringArray(raw.negatives, 2);
  const positiveLines = stringArray(raw.positives, 2);

  const sentimentExplanation = buildSentimentExplanation(
    computed,
    raw.sentiment,
    reviewsInPeriod
  );

  return {
    businessName: input.businessName,
    location: input.location || "—",
    listingGapsTitle: String(raw.listingGapsTitle ?? "Listing & profile gaps"),
    source: "google",
    reviewCount: reviewsInPeriod,
    scrapedReviewTotal: scrapedTotal,
    score,
    scoreLabel: computed.scoreLabel,
    period: input.period,
    executiveSummary: String(
      raw.executiveSummary ??
        buildExecutiveSummaryFallback({
          businessName: input.businessName,
          period: input.period,
          score,
          scoreLabel: computed.scoreLabel,
          negatives: negativeLines,
          positives: positiveLines,
        })
    ),
    metrics: normalizeMetrics(raw.metrics, score),
    sentiment: {
      ...computed.sentiment,
      explanation: sentimentExplanation,
      methodNote: computed.sentimentMethod,
    },
    marketGaps: normalizeMarketGaps(raw.marketGaps),
    menuGaps: stringArray(raw.menuGaps, 2),
    trending: resolveTrendingTopics(
      normalizeTrending(raw.trending),
      corpusAll,
      stringArray(raw.positives, 0),
      stringArray(raw.negatives, 0)
    ),
    positives: positiveLines,
    negatives: negativeLines,
    recommendations: normalizeRecommendations(raw.recommendations),
    actionPlanSummary: String(
      raw.actionPlanSummary ??
        "Focus on high-priority actions below — especially Google replies and listing fixes called out in complaints."
    ),
    reviewCorpus,
    monthlyReport: {
      complaints: {
        summary: String(
          complaints.summary ??
            buildSectionSummaryFallback(complaintThemes, negativeLines, "negative")
        ),
        themes: complaintThemes,
        review: {
          author: String(complaintReview.author ?? complaintFallback?.author ?? "Reviewer"),
          source: "Google",
          stars: num(complaintReview.stars) ?? complaintFallback?.stars,
          quote: String(complaintReview.quote ?? complaintFallback?.quote ?? ""),
          tags: stringArray(complaintReview.tags, 1).slice(0, 3),
          date: reviewDate(complaintReview, complaintFallback ?? undefined),
        },
        moreReviews: normalizeMoreReviews(
          complaints.moreReviews,
          pickMoreReviewSnippets(corpusAll, {
            preferLow: true,
            excludeQuote: String(complaintReview.quote ?? complaintFallback?.quote ?? ""),
          })
        ),
      },
      praise: {
        summary: String(
          praise.summary ??
            buildSectionSummaryFallback(praiseThemes, positiveLines, "positive")
        ),
        themes: praiseThemes,
        review: {
          author: String(praiseReview.author ?? praiseFallback?.author ?? "Reviewer"),
          source: "Google",
          stars: num(praiseReview.stars) ?? praiseFallback?.stars,
          quote: String(praiseReview.quote ?? praiseFallback?.quote ?? ""),
          tags: stringArray(praiseReview.tags, 1).slice(0, 3),
          date: reviewDate(praiseReview, praiseFallback ?? undefined),
        },
        moreReviews: normalizeMoreReviews(
          praise.moreReviews,
          pickMoreReviewSnippets(corpusAll, {
            preferLow: false,
            excludeQuote: String(praiseReview.quote ?? praiseFallback?.quote ?? ""),
          })
        ),
      },
      competitors: {
        ...normalizeCompetitors(
          competitors,
          input.businessName,
          input.placeRating,
          computed.averageStars,
          input.reviews
        ),
        summary: String(
          competitors.summary ??
            "See themes above and comparison quotes below where reviewers mention other venues."
        ),
      },
      suggestions: normalizeSuggestions(
        suggestions,
        input.reviews,
        complaintFallback?.author
      ),
      googleStrategy: stringArray(monthly.googleStrategy ?? raw.googleStrategy, 2),
      googleStrategySummary: String(
        monthly.googleStrategySummary ??
          "Tighten your Google Business Profile so it reflects what reviewers ask about most."
      ),
    },
  };
}

function buildSentimentExplanation(
  computed: ReturnType<typeof computeSentimentFromReviews>,
  sentimentRaw: unknown,
  reviewCount: number
): string {
  const s = (sentimentRaw ?? {}) as Record<string, unknown>;
  const ai = typeof s.explanation === "string" ? s.explanation.trim() : "";
  if (ai) return ai;

  const bars = computed.sentiment.bars;
  const first = bars[0] ?? computed.score;
  const last = bars[bars.length - 1] ?? computed.score;
  const delta = last - first;
  const direction =
    delta >= 8 ? "improved" : delta <= -8 ? "softened" : "held fairly steady";

  return `Each bar is the average sentiment score (from star ratings) for reviews published that month, based on ${reviewCount} Google reviews in this scrape. Your overall score is ${computed.score} (${computed.scoreLabel}). The last six months have ${direction} (${first} → ${last}). ${computed.sentiment.trend}`;
}

function buildExecutiveSummaryFallback(input: {
  businessName: string;
  period: string;
  score: number;
  scoreLabel: string;
  negatives: string[];
  positives: string[];
}): string {
  const risk = input.negatives[0] ?? "recurring friction themes in low-star reviews";
  const win = input.positives[0] ?? "consistent praise in four- and five-star reviews";
  return `${input.period} overview for ${input.businessName}: sentiment score ${input.score} (${input.scoreLabel}). Customers highlight ${win}. The main drag is ${risk}. Address high-priority actions and unreplied low-star Google reviews this month.`;
}

function buildSectionSummaryFallback(
  themes: string[],
  bullets: string[],
  tone: "negative" | "positive"
): string {
  const joined = themes.length ? themes.join("; ") : bullets.join("; ");
  if (!joined) {
    return tone === "negative"
      ? "Limited negative text in this sample — expand the scrape or watch low-star reviews."
      : "Limited positive text in this sample.";
  }
  return tone === "negative"
    ? `Across all scraped Google reviews, customers most often raise: ${joined}. The quote below is one example — themes are counted across the full review set, not a single reviewer.`
    : `Across all scraped Google reviews, customers most often praise: ${joined}. The standout quote illustrates what repeats in positive feedback.`;
}

function normalizeMarketGaps(val: unknown) {
  const m = (val ?? {}) as Record<string, unknown>;
  const gaps = Array.isArray(m.gaps)
    ? (m.gaps as string[]).filter((g) => typeof g === "string" && g.trim())
    : [];
  const peers = Array.isArray(m.peersCompared)
    ? (m.peersCompared as string[]).filter((p) => typeof p === "string" && p.trim())
    : [];
  if (!gaps.length && !String(m.summary ?? "").trim()) return undefined;
  return {
    title: String(m.title ?? "Market gaps"),
    summary: String(m.summary ?? ""),
    gaps: gaps.length ? gaps.slice(0, 6) : ["Add tagged peers in the same area to unlock market comparisons."],
    peersCompared: peers,
  };
}

function normalizeMoreReviews(
  val: unknown,
  fallback: ReviewLike[]
): {
  author: string;
  source: string;
  stars?: number;
  quote: string;
  tags: string[];
  date?: string | null;
}[] {
  const fromAi = Array.isArray(val)
    ? val
        .map((r) => {
          const item = r as Record<string, unknown>;
          const quote = String(item.quote ?? "").trim();
          if (!quote) return null;
          return {
            author: String(item.author ?? "Reviewer"),
            source: "Google",
            stars: num(item.stars),
            quote: quote.slice(0, 320),
            tags: stringArray(item.tags, 0).slice(0, 2),
            date:
              typeof item.date === "string" && item.date.trim()
                ? item.date
                : null,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x != null)
    : [];

  if (fromAi.length >= 2) return fromAi.slice(0, 5);

  return fallback.map((r) => ({
    author: shortenAuthor(r.author),
    source: "Google",
    stars: r.stars ?? undefined,
    quote: r.text.slice(0, 320),
    tags: [] as string[],
    date: formatReviewDate(r.date),
  }));
}

function normalizeSuggestions(
  suggestions: Record<string, unknown>,
  reviews: ReviewForAi[],
  fallbackAuthor?: string
): { summary: string; items: ReplySuggestionItem[] } {
  const unreplied = findUnrepliedLowStarReviews(reviews, 12);
  const aiItems: ReplySuggestionItem[] = [];

  if (Array.isArray(suggestions.items)) {
    for (const raw of suggestions.items.slice(0, 12)) {
      const item = raw as Record<string, unknown>;
      const quote = String(item.reviewQuote ?? item.quote ?? "").trim();
      if (!quote) continue;
      aiItems.push({
        reviewLabel: String(item.reviewLabel ?? starReviewLabel(num(item.stars))),
        reviewAuthor: String(item.reviewAuthor ?? item.author ?? "Reviewer"),
        reviewQuote: quote.slice(0, 400),
        stars: num(item.stars) ?? undefined,
        date:
          typeof item.date === "string" && item.date.trim()
            ? item.date
            : null,
        replyLabel: String(item.replyLabel ?? "Suggested Google reply"),
        replyText: String(item.replyText ?? "").trim(),
      });
    }
  } else if (typeof suggestions.reviewQuote === "string" && suggestions.reviewQuote.trim()) {
    aiItems.push({
      reviewLabel: String(suggestions.reviewLabel ?? "3-star review"),
      reviewAuthor: String(suggestions.reviewAuthor ?? fallbackAuthor ?? "Reviewer"),
      reviewQuote: String(suggestions.reviewQuote).slice(0, 400),
      stars: num(suggestions.stars),
      date: null,
      replyLabel: String(suggestions.replyLabel ?? "Suggested Google reply"),
      replyText: String(suggestions.replyText ?? "").trim(),
    });
  }

  const merged: ReplySuggestionItem[] = [];
  const usedQuotes = new Set<string>();

  for (const r of unreplied) {
    const quoteKey = r.text.trim().slice(0, 60);
    if (usedQuotes.has(quoteKey)) continue;
    usedQuotes.add(quoteKey);

    const author = shortenAuthor(r.author);
    const match = aiItems.find(
      (a) =>
        a.reviewQuote.slice(0, 40) === r.text.slice(0, 40) ||
        a.reviewAuthor === author
    );

    merged.push({
      reviewLabel: starReviewLabel(r.stars),
      reviewAuthor: author,
      reviewQuote: r.text.slice(0, 400),
      stars: r.stars ?? undefined,
      date: formatReviewDate(r.date),
      replyLabel: "Suggested Google reply",
      replyText:
        match?.replyText?.trim() || fallbackGoogleReply(author),
    });
  }

  if (!merged.length && aiItems.length) {
    return {
      summary: String(
        suggestions.summary ??
          `${aiItems.length} suggested repl${aiItems.length === 1 ? "y" : "ies"}`
      ),
      items: aiItems.filter((a) => a.replyText).slice(0, 12),
    };
  }

  const count = merged.length;
  return {
    summary: String(
      suggestions.summary ??
        (count
          ? `${count} low-star review${count === 1 ? "" : "s"} still need a Google reply`
          : "No unreplied low-star reviews in this scrape")
    ),
    items: merged,
  };
}

function shortenAuthor(name: string): string {
  const t = name.trim();
  if (!t || t === "Anonymous") return "Reviewer";
  const parts = t.split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 24);
  return `${parts[0]} ${parts[parts.length - 1]!.charAt(0)}.`;
}

function estimateScoreFromReviews(reviews: ReviewForAi[], placeRating: number | null): number {
  const stars = reviews.map((r) => r.stars).filter((s): s is number => s != null && s > 0);
  const avg = stars.length
    ? stars.reduce((a, b) => a + b, 0) / stars.length
    : placeRating ?? 4;
  return Math.round(Math.min(100, Math.max(0, (avg / 5) * 100)));
}

function stringArray(val: unknown, min: number): string[] {
  if (!Array.isArray(val)) return Array(min).fill("—");
  const arr = val.filter((x) => typeof x === "string" && x.trim()) as string[];
  return arr.length >= min ? arr : [...arr, ...Array(min - arr.length).fill("—")];
}

function num(val: unknown): number | undefined {
  return typeof val === "number" && !Number.isNaN(val) ? val : undefined;
}

function normalizeMetrics(val: unknown, score: number) {
  const colors = ["violet", "amber", "green", "red"] as const;
  if (Array.isArray(val) && val.length >= 4) {
    return val.slice(0, 4).map((m, i) => {
      const item = m as Record<string, unknown>;
      return {
        key: String(item.key ?? `m${i}`),
        label: String(item.label ?? "Metric"),
        value: Math.round(Math.min(100, Math.max(0, num(item.value) ?? score))),
        color: colors.includes(item.color as typeof colors[number])
          ? item.color
          : colors[i % 4],
      };
    });
  }
  return [
    { key: "overall", label: "Overall sentiment", value: score, color: "violet" },
    { key: "service", label: "Service", value: Math.min(100, score + 6), color: "green" },
    { key: "quality", label: "Quality", value: Math.max(45, score - 4), color: "amber" },
    { key: "value", label: "Value", value: Math.max(40, score - 10), color: "red" },
  ];
}

function normalizeSentiment(val: unknown, score: number) {
  const s = (val ?? {}) as Record<string, unknown>;
  const bars = Array.isArray(s.bars)
    ? (s.bars as number[]).slice(0, 6).map((n) => Math.round(Math.min(100, Math.max(0, n))))
    : [score - 18, score - 12, score - 8, score - 4, score - 2, score].map((n) =>
        Math.max(20, n)
      );
  while (bars.length < 6) bars.unshift(Math.max(20, (bars[0] ?? score) - 4));
  return {
    chartLabel: String(s.chartLabel ?? "Sentiment score"),
    trend: String(s.trend ?? "→ Stable"),
    months: Array.isArray(s.months)
      ? (s.months as string[]).slice(0, 6)
      : ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    bars,
  };
}

function normalizeTrending(val: unknown) {
  if (!Array.isArray(val)) return [];
  return val.slice(0, 5).map((t) => {
    const item = t as Record<string, unknown>;
    return {
      topic: String(item.topic ?? "Topic"),
      count: Math.max(1, Math.round(num(item.count) ?? 1)),
      tone: item.tone === "positive" ? "positive" : "negative",
    };
  });
}

function normalizeRecommendations(val: unknown) {
  if (!Array.isArray(val)) return [];
  return val.slice(0, 4).map((r) => {
    const item = r as Record<string, unknown>;
    const p = String(item.priority ?? "Medium");
    return {
      priority: ["High", "Medium", "Low"].includes(p) ? p : "Medium",
      text: String(item.text ?? ""),
    };
  }).filter((r) => r.text);
}

function normalizeCompetitorMentions(val: unknown, reviews: ReviewForAi[]) {
  const fromAi = Array.isArray(val) ? val : [];
  const parsed = fromAi
    .map((m) => {
      const item = m as Record<string, unknown>;
      const quote = String(item.quote ?? "").trim();
      if (!quote) return null;
      return {
        name: String(item.name ?? "Other venue"),
        quote: quote.slice(0, 400),
        author: String(item.author ?? "Reviewer"),
        date:
          typeof item.date === "string" && item.date.trim()
            ? item.date
            : formatReviewDate(typeof item.date === "string" ? item.date : null),
        stars: num(item.stars) ?? null,
        source: "Google",
      };
    })
    .filter((x): x is NonNullable<typeof x> => x != null);

  if (parsed.length > 0) return parsed.slice(0, 12);

  return findComparisonReviews(reviews).slice(0, 8).map((r) => ({
    name: "Mentioned in review",
    quote: r.text.slice(0, 400),
    author: shortenAuthor(r.author),
    date: formatReviewDate(r.date),
    stars: r.stars,
    source: "Google",
  }));
}

function normalizeCompetitors(
  val: Record<string, unknown>,
  businessName: string,
  placeRating: number | null,
  averageStars: number,
  reviews: ReviewForAi[]
) {
  const clientRating = Math.round((placeRating ?? averageStars) * 10) / 10;
  const rows = Array.isArray(val.rows) ? val.rows : [];
  const parsed = rows.map((r) => {
    const item = r as Record<string, unknown>;
    return {
      name: String(item.name ?? ""),
      rating: Math.round((num(item.rating) ?? clientRating) * 10) / 10,
      highlight: Boolean(item.highlight),
    };
  }).filter((r) => r.name);

  if (!parsed.some((r) => r.highlight)) {
    parsed.unshift({
      name: businessName,
      rating: clientRating,
      highlight: true,
    });
  }

  const mentions = normalizeCompetitorMentions(val.mentions, reviews);

  return {
    chartLabel: String(val.chartLabel ?? "Average rating when mentioned"),
    note: String(
      val.note ??
        (mentions.length
          ? `${mentions.length} comparison mention${mentions.length === 1 ? "" : "s"} in scraped Google reviews`
          : "No named competitors in this review sample — only your Google rating shown")
    ),
    rows: parsed.length ? parsed.slice(0, 6) : [
      { name: businessName, rating: clientRating, highlight: true },
    ],
    mentions,
  };
}
