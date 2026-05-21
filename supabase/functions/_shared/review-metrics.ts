export type ReviewLike = {
  stars: number | null;
  text: string;
  author: string;
  date: string | null;
  hasOwnerReply?: boolean;
};

export type ReplySuggestionItem = {
  reviewLabel: string;
  reviewAuthor: string;
  reviewQuote: string;
  stars?: number;
  date?: string | null;
  replyLabel: string;
  replyText: string;
};

export type CompetitorMention = {
  name: string;
  quote: string;
  author: string;
  date: string | null;
  stars: number | null;
  source: string;
};

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function parseReviewMonth(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthKeyToLabel(key: string): string {
  const [, m] = key.split("-");
  const i = Number(m) - 1;
  const y = key.slice(0, 4);
  if (i < 0 || i > 11) return key;
  return `${MONTH_SHORT[i]} ${y.slice(2)}`;
}

/** Last 6 calendar months ending at periodKey (YYYY-MM). */
function lastSixMonthKeys(periodKey: string): string[] {
  const [y, m] = periodKey.split("-").map(Number);
  if (!y || !m) return [];
  const keys: string[] = [];
  let year = y;
  let month = m;
  for (let i = 0; i < 6; i += 1) {
    keys.unshift(`${year}-${String(month).padStart(2, "0")}`);
    month -= 1;
    if (month < 1) {
      month = 12;
      year -= 1;
    }
  }
  return keys;
}

export function computeSentimentFromReviews(
  reviews: ReviewLike[],
  periodKey: string,
  placeRating: number | null
) {
  const withStars = reviews.filter((r) => r.stars != null && r.stars > 0);
  const avgStars = withStars.length
    ? withStars.reduce((a, r) => a + (r.stars ?? 0), 0) / withStars.length
    : placeRating ?? 4;
  const score = Math.round(Math.min(100, Math.max(0, (avgStars / 5) * 100)));

  const monthKeys = lastSixMonthKeys(periodKey);
  const buckets = new Map<string, number[]>();
  for (const key of monthKeys) buckets.set(key, []);

  for (const r of withStars) {
    const mk = parseReviewMonth(r.date);
    if (!mk || !buckets.has(mk)) continue;
    buckets.get(mk)!.push(r.stars!);
  }

  const bars = monthKeys.map((mk) => {
    const stars = buckets.get(mk) ?? [];
    if (!stars.length) return null;
    const avg = stars.reduce((a, b) => a + b, 0) / stars.length;
    return Math.round((avg / 5) * 100);
  });

  let lastFilled = score;
  const filledBars = bars.map((b) => {
    if (b != null) {
      lastFilled = b;
      return b;
    }
    return lastFilled;
  });

  const first = filledBars.find((b) => b != null) ?? score;
  const last = filledBars[filledBars.length - 1] ?? score;
  const trend =
    last > first + 4 ? "↑ Improving" : last < first - 4 ? "↓ Declining" : "→ Stable";

  const monthsWithData = monthKeys.filter((mk) => (buckets.get(mk)?.length ?? 0) > 0).length;

  return {
    score,
    scoreLabel:
      score >= 80 ? "Excellent" : score >= 70 ? "Good" : score >= 55 ? "Fair" : "Needs attention",
    sentiment: {
      chartLabel: "Sentiment score",
      trend,
      months: monthKeys.map(monthKeyToLabel),
      bars: filledBars,
    },
    sentimentMethod:
      monthsWithData >= 2
        ? `Overall score from average star rating in scraped reviews (${withStars.length} rated). Chart bars are monthly averages from review publish dates in this sample.`
        : `Overall score from average star rating (${withStars.length} rated). Trend bars use the overall score where this month's sample has too few dated reviews.`,
    averageStars: Math.round(avgStars * 10) / 10,
  };
}

/** Pull reviews that likely compare to another venue (heuristic + passed to AI for naming). */
export function findComparisonReviews(reviews: ReviewLike[]): ReviewLike[] {
  const patterns =
    /\b(compared to|compare to|better than|worse than|prefer|instead of|vs\.?|versus|other restaurant|another place|competitor|next door|nearby)\b/i;
  return reviews.filter((r) => r.text.length > 20 && patterns.test(r.text));
}

export type TrendingTopic = {
  topic: string;
  count: number;
  tone: "negative" | "positive";
};

const TRENDING_BUCKETS: { topic: string; re: RegExp; tone: "negative" | "positive" }[] = [
  { topic: "Wait times", re: /wait|queue|delay|slow service|booking/i, tone: "negative" },
  { topic: "Food quality", re: /food|dish|meal|menu|taste|delicious|flavour|flavor/i, tone: "positive" },
  { topic: "Service & staff", re: /staff|service|friendly|rude|waiter|team/i, tone: "positive" },
  { topic: "Atmosphere", re: /atmosphere|ambience|ambiance|view|decor|clean/i, tone: "positive" },
  { topic: "Value for money", re: /price|value|expensive|cheap|worth|overpriced/i, tone: "negative" },
  { topic: "Reservations", re: /book|reserv|table|appointment/i, tone: "positive" },
  { topic: "Parking & access", re: /park|direction|find|location|access/i, tone: "negative" },
];

/** Keyword counts from scraped review text (fallback when AI omits trending). */
export function computeTrendingFromReviews(reviews: ReviewLike[]): TrendingTopic[] {
  const counts = TRENDING_BUCKETS.map((b) => ({
    ...b,
    count: 0,
  }));

  for (const r of reviews) {
    if ((r.text ?? "").length < 10) continue;
    const text = r.text;
    for (const bucket of counts) {
      if (bucket.re.test(text)) bucket.count += 1;
    }
  }

  return counts
    .filter((b) => b.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(({ topic, count, tone }) => ({ topic, count, tone }));
}

function parseThemeLine(line: string): TrendingTopic | null {
  const m = line.match(/^(.+?)\s*\((\d+)\s*mentions?\)/i);
  if (!m) return null;
  const topic = m[1]!.trim();
  const count = Number(m[2]);
  if (!topic || !count) return null;
  return { topic, count, tone: "negative" };
}

/** Merge AI trending with keyword fallback and theme lines. */
export function resolveTrendingTopics(
  aiTrending: TrendingTopic[],
  reviews: ReviewLike[],
  positiveLines: string[],
  negativeLines: string[]
): TrendingTopic[] {
  if (aiTrending.length >= 4) return aiTrending.slice(0, 5);

  const fromThemes: TrendingTopic[] = [];
  for (const line of negativeLines) {
    const p = parseThemeLine(line);
    if (p) fromThemes.push({ ...p, tone: "negative" });
  }
  for (const line of positiveLines) {
    const p = parseThemeLine(line);
    if (p) fromThemes.push({ ...p, tone: "positive" });
  }

  const merged = [...aiTrending];
  const seen = new Set(merged.map((t) => t.topic.toLowerCase()));
  for (const t of [...fromThemes, ...computeTrendingFromReviews(reviews)]) {
    if (merged.length >= 5) break;
    const key = t.topic.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(t);
  }

  return merged.slice(0, 5);
}

export function hasOwnerResponse(
  responseFromOwnerText?: string | null
): boolean {
  return Boolean(responseFromOwnerText?.trim());
}

/** Low-star Google reviews with no owner reply yet — candidates for reply drafts. */
export function findUnrepliedLowStarReviews(
  reviews: ReviewLike[],
  limit = 12
): ReviewLike[] {
  return [...reviews]
    .filter(
      (r) =>
        r.text.trim().length > 12 &&
        (r.stars ?? 5) <= 3 &&
        !r.hasOwnerReply
    )
    .sort((a, b) => {
      const da = a.date ?? "";
      const db = b.date ?? "";
      if (db !== da) return db.localeCompare(da);
      return (a.stars ?? 3) - (b.stars ?? 3);
    })
    .slice(0, limit);
}

export function starReviewLabel(stars: number | null | undefined): string {
  const s = stars ?? 3;
  if (s <= 1) return "1-star review";
  if (s === 2) return "2-star review";
  if (s === 3) return "3-star review";
  return `${s}-star review`;
}

export function fallbackGoogleReply(author: string): string {
  const first = author.trim().split(/\s+/)[0];
  const name = first && first !== "Reviewer" && first !== "Anonymous" ? `, ${first}` : "";
  return `Thank you for your feedback${name}. We are sorry your visit did not meet expectations. We are reviewing what happened and would welcome the chance to make this right — please contact us directly.`;
}

export function pickMoreReviewSnippets(
  reviews: ReviewLike[],
  options: {
    preferLow: boolean;
    excludeQuote?: string;
    limit?: number;
  }
): ReviewLike[] {
  const { preferLow, excludeQuote, limit = 4 } = options;
  const norm = (q: string) => q.trim().slice(0, 80);
  const excluded = excludeQuote ? norm(excludeQuote) : "";

  return [...reviews]
    .filter((r) => {
      if (r.text.trim().length < 16) return false;
      if (excluded && norm(r.text) === excluded) return false;
      const stars = r.stars ?? (preferLow ? 3 : 5);
      return preferLow ? stars <= 3 : stars >= 4;
    })
    .sort((a, b) => {
      const da = a.date ?? "";
      const db = b.date ?? "";
      return db.localeCompare(da);
    })
    .slice(0, limit);
}

export function formatReviewDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
