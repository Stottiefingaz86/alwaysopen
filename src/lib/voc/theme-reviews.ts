import type { VocReportData } from "@/lib/voc/report-types";

export type ReviewSnippetData = {
  author: string;
  source: string;
  quote: string;
  tags: readonly string[];
  stars?: number;
  date?: string | null;
};

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "in",
  "on",
  "at",
  "during",
  "for",
  "and",
  "or",
  "to",
  "of",
  "with",
  "this",
  "that",
  "your",
  "our",
  "issues",
  "issue",
  "concerns",
  "concern",
]);

export function themeLabelWithoutCount(theme: string): string {
  return theme
    .replace(/\s*\(\s*\d+\s+mention[s]?\s*\)\s*$/i, "")
    .replace(/\s*\(\d+\s*mentions?\)\s*$/i, "")
    .trim();
}

/** Normalise common typos in scraped Google review text before matching. */
function normalizeMatchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/crossaints?/gi, "croissant")
    .replace(/croissants/gi, "croissant");
}

function labelKeywords(label: string): string[] {
  return themeLabelWithoutCount(label)
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function multilingualThemePatterns(label: string): RegExp[] {
  const l = label.toLowerCase();
  const patterns: RegExp[] = [];
  if (/\bdissatisf|disappoint|unhappy\b/.test(l)) {
    patterns.push(
      /\b(decepci[oó]n|decepcionante|insatisf|disappoint|unhappy|malo|no recommend)\b/i
    );
  }
  if (/\bhair|colour|color|mechas|highlights|balayage|tinte\b/.test(l)) {
    patterns.push(
      /\b(pelo|cabello|mechas|highlights|balayage|tinte|coloraci[oó]n|color|colour|tratamiento)\b/i
    );
  }
  if (/\btreatment|result|outcome\b/.test(l)) {
    patterns.push(/\b(tratamiento|resultado|quedado|qued[oó]|igual|esperaba|outcome)\b/i);
  }
  if (/\bfollow|aftercare|outcome\b/.test(l)) {
    patterns.push(/\b(seguimiento|follow[\s-]?up|aftercare|despu[eé]s|resultado)\b/i);
  }
  if (/\bcommunication|expectation\b/.test(l)) {
    patterns.push(/\b(comunicaci[oó]n|expectativa|expectation|explicar)\b/i);
  }
  if (/\bstaff|attitude|rude|friendly\b/.test(l)) {
    patterns.push(/\b(personal|staff|atenci[oó]n|amable|rude|grosero)\b/i);
  }
  if (/\bprice|value|expensive|cost\b/.test(l)) {
    patterns.push(/\b(precio|caro|expensive|value|bill|cuenta)\b/i);
  }
  if (/\bwait|delay|slow|speed\b/.test(l)) {
    patterns.push(/\b(espera|esperar|lento|delay|demora|minutos|hora)\b/i);
  }
  if (/\bfood|quality|taste|meal\b/.test(l)) {
    patterns.push(/\b(comida|plato|menu|sabor|taste|quality|calidad)\b/i);
  }
  return patterns;
}

function tagOverlapsTheme(tag: string, themeLine: string): boolean {
  const t = normalizeMatchText(tag);
  const label = themeLabelWithoutCount(themeLine).toLowerCase();
  if (!t || !label) return false;
  if (t.includes(label) || label.includes(t)) return true;
  const tagKeys = labelKeywords(tag);
  const themeKeys = labelKeywords(themeLine);
  if (!tagKeys.length || !themeKeys.length) return false;
  return tagKeys.some((tk) =>
    themeKeys.some(
      (wk) => tk === wk || tk.includes(wk) || wk.includes(tk)
    )
  );
}

function keywordHit(hay: string, key: string): boolean {
  if (hay.includes(key)) return true;
  if (key === "unavailable" || key.startsWith("unavail")) {
    return /\b(unavail|sold out|run out|out of|agotad|sin |dont have|don't have|no longer|anymore|not have|no qued)\b/.test(
      hay
    );
  }
  if (key.includes("croiss")) {
    return /\bcroiss\w*|crossaint\w*/.test(hay);
  }
  if (key.endsWith("s") && key.length > 4 && hay.includes(key.slice(0, -1))) return true;
  if (!key.endsWith("s") && hay.includes(`${key}s`)) return true;
  return key.length >= 5 && hay.includes(key.slice(0, 5));
}

export function parseMentionCount(theme: string): number | null {
  const m = theme.match(/\((\d+)\s*mentions?\)\s*$/i);
  return m ? Number(m[1]) : null;
}

/** Regex tuned to AI theme labels — matches real Google review wording. */
export function themeMatchRegex(themeLine: string): RegExp | null {
  const label = themeLabelWithoutCount(themeLine).toLowerCase();

  if (
    /\b(service|speed|wait|slow|delay|rush)\b/.test(label) ||
    label.includes("service speed")
  ) {
    return /\b(wait|waiting|waited|slow|speed|delay|delayed|queue|minute|hour|rush|service|staff|table|order)\b/i;
  }
  if (/\bfood\b/.test(label) && /\b(quality|taste|dish|meal)\b/.test(label)) {
    return /\b(food|dish|meal|menu|taste|flavour|flavor|quality|bland|cold|warm|fresh|overcooked|undercooked|portion)\b/i;
  }
  if (/\bclean|hygien|dirty\b/.test(label)) {
    return /\b(clean|dirty|hygien|mess|sticky|floor|table|bathroom|washroom|smell)\b/i;
  }
  if (/\bprice|value|expensive|cost\b/.test(label)) {
    return /\b(price|expensive|cheap|value|worth|overpriced|bill|cost)\b/i;
  }
  if (/\bpark|access|direction\b/.test(label)) {
    return /\b(park|parking|direction|find|located|access)\b/i;
  }
  if (/\bbook|reserv|appointment\b/.test(label)) {
    return /\b(book|booking|reservation|table|appointment|reserved)\b/i;
  }
  if (/\batmosphere|ambience|decor\b/.test(label)) {
    return /\b(atmosphere|ambience|ambiance|decor|view|vibe|music)\b/i;
  }
  if (/\bfriendly|staff|team\b/.test(label)) {
    return /\b(friendly|staff|team|waiter|server|welcoming|rude)\b/i;
  }
  if (/\bcroiss|pastry|pastries|baked\b/.test(label)) {
    return /\b(croiss\w*|crossaint\w*|pastry|pastries|pain au|muffin|bakery)\b/i;
  }
  if (/\bunavail|not available|out of stock\b/.test(label)) {
    return /\b(unavail|sold out|run out|out of|dont have|don't have|no longer|anymore|not have)\b/i;
  }
  if (/\bmorning|breakfast\b/.test(label) && /\bcroiss|pastry|unavail\b/.test(label)) {
    return /\b(morning|breakfast|croiss\w*|crossaint\w*|pastry|dont have|don't have|anymore|unavail)\b/i;
  }
  if (/\border\b/.test(label) && /\b(accuracy|wrong|incorrect|mistake|missing)\b/.test(label)) {
    return /\b(order|ordered|wrong order|incorrect|missing item|got the wrong|mistake|accura\w*|delivered wrong)\b/i;
  }
  if (/\bdelay|slow|wait\b/.test(label)) {
    return /\b(wait|waiting|waited|slow|delay|delayed|queue|minute|hour|rush|long time|took forever|espera|demora)\b/i;
  }
  if (/\bdissatisf|disappoint|treatment|hair|result|outcome|follow\b/.test(label)) {
    return null;
  }

  return null;
}

function keywordFallbackMatch(text: string, themeLine: string): boolean {
  const keys = labelKeywords(themeLine);
  if (!keys.length) return false;
  const hay = normalizeMatchText(text);
  const hits = keys.filter((k) => keywordHit(hay, k));
  const hasStrong = keys.some((k) => /\bcroiss|pastry|hair|treatment\b/.test(k));
  if (hasStrong && hits.length >= 1) return true;
  return hits.length >= Math.min(2, keys.length);
}

export function reviewMatchesTheme(review: ReviewSnippetData, theme: string): boolean {
  if (review.tags.length) {
    if (review.tags.some((tag) => tagOverlapsTheme(tag, theme))) return true;
  }
  const hay = normalizeMatchText(review.quote);
  const re = themeMatchRegex(theme);
  if (re?.test(hay)) return true;
  for (const mre of multilingualThemePatterns(theme)) {
    if (mre.test(hay)) return true;
  }
  return keywordFallbackMatch(hay, theme);
}

export function countThemeMentionsInPool(
  pool: readonly ReviewSnippetData[],
  theme: string
): number {
  return pool.filter((r) => reviewMatchesTheme(r, theme)).length;
}

export function filterReviewsByTheme(
  reviews: readonly ReviewSnippetData[],
  theme: string
): ReviewSnippetData[] {
  return reviews.filter((r) => reviewMatchesTheme(r, theme));
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Combined pattern for in-quote highlighting (aligned with theme matching). */
export function buildThemeHighlightRegex(themeLine: string): RegExp | null {
  const sources: string[] = [];
  const themeRe = themeMatchRegex(themeLine);
  if (themeRe) sources.push(themeRe.source);

  const label = themeLabelWithoutCount(themeLine).toLowerCase();
  for (const k of label.split(/\W+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w))) {
    if (k.includes("croiss")) {
      sources.push("croiss\\w*", "crossaint\\w*");
    } else if (k === "unavailable" || k.startsWith("unavail")) {
      sources.push("unavail\\w*", "sold out", "run out", "don't have", "dont have", "anymore");
    } else if (k.length >= 4) {
      sources.push(`${escapeRegExp(k)}\\w*`);
    } else {
      sources.push(`\\b${escapeRegExp(k)}\\w*`);
    }
  }

  const unique = [...new Set(sources.filter(Boolean))];
  if (!unique.length) return null;

  try {
    return new RegExp(`(${unique.join("|")})`, "gi");
  } catch {
    return null;
  }
}

export type QuoteHighlightSegment = { text: string; highlight: boolean };

export function splitQuoteForThemeHighlight(
  quote: string,
  themeLine: string
): QuoteHighlightSegment[] {
  const re = buildThemeHighlightRegex(themeLine);
  if (!re) return [{ text: quote, highlight: false }];

  const segments: QuoteHighlightSegment[] = [];
  let lastIndex = 0;
  re.lastIndex = 0;

  for (const match of quote.matchAll(re)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ text: quote.slice(lastIndex, index), highlight: false });
    }
    segments.push({ text: match[0], highlight: true });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < quote.length) {
    segments.push({ text: quote.slice(lastIndex), highlight: false });
  }

  return segments.length ? segments : [{ text: quote, highlight: false }];
}

function reviewKey(r: ReviewSnippetData): string {
  return `${r.author}:${r.quote.slice(0, 80)}`;
}

export function collectSectionReviews(section: {
  review: ReviewSnippetData;
  moreReviews?: readonly ReviewSnippetData[];
}): ReviewSnippetData[] {
  const out: ReviewSnippetData[] = [section.review];
  const seen = new Set([reviewKey(section.review)]);

  for (const r of section.moreReviews ?? []) {
    const k = reviewKey(r);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(r);
  }

  return out;
}

export function filterCorpusByTone(
  corpus: readonly ReviewSnippetData[],
  tone: "negative" | "positive"
): ReviewSnippetData[] {
  return corpus.filter((r) => {
    const stars = r.stars ?? (tone === "negative" ? 3 : 5);
    return tone === "negative" ? stars <= 3 : stars >= 4;
  });
}

export function buildReviewPool(input: {
  tone: "negative" | "positive";
  featured: ReviewSnippetData | null;
  moreReviews?: readonly ReviewSnippetData[];
  reviewCorpus?: readonly ReviewSnippetData[];
}): ReviewSnippetData[] {
  const extras: ReviewSnippetData[] = [];
  if (input.featured) extras.push(input.featured);
  for (const r of input.moreReviews ?? []) extras.push(r);

  const corpusTone = input.reviewCorpus?.length
    ? filterCorpusByTone(input.reviewCorpus, input.tone)
    : [];

  const seen = new Set<string>();
  const out: ReviewSnippetData[] = [];
  for (const r of [...extras, ...corpusTone]) {
    const k = reviewKey(r);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(r);
  }
  return out;
}

type ScrapedReviewRow = {
  stars?: number | null;
  text?: string | null;
  name?: string | null;
  publishedAtDate?: string | null;
};

export function parseReviewMonth(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function countReviewsInPeriod(
  reviews: readonly ScrapedReviewRow[],
  periodKey: string
): number {
  return reviews.filter((r) => {
    if ((r.text ?? "").trim().length <= 12) return false;
    return parseReviewMonth(r.publishedAtDate) === periodKey;
  }).length;
}

export function filterScrapedToPeriod(
  reviews: readonly ScrapedReviewRow[],
  periodKey: string
): ScrapedReviewRow[] {
  return reviews.filter((r) => {
    if ((r.text ?? "").trim().length <= 12) return false;
    return parseReviewMonth(r.publishedAtDate) === periodKey;
  });
}

export function mapScrapedReviewsForCorpus(
  reviews: readonly ScrapedReviewRow[]
): ReviewSnippetData[] {
  const mapped = reviews
    .filter((r) => (r.text ?? "").trim().length > 12)
    .map((r) => ({
      author: (r.name ?? "Anonymous").trim(),
      text: (r.text ?? "").trim(),
      stars: r.stars ?? null,
      date: r.publishedAtDate ?? null,
    }));
  return snippetsFromMappedReviews(mapped);
}

export function enrichReportWithReviewCorpus(
  report: VocReportData,
  scrapedReviews: readonly ScrapedReviewRow[] | null | undefined,
  periodKey?: string
): VocReportData {
  const scrapedTotal =
    scrapedReviews?.length ?? report.scrapedReviewTotal ?? report.reviewCount;
  const inPeriod =
    periodKey && scrapedReviews?.length
      ? countReviewsInPeriod(scrapedReviews, periodKey)
      : report.reviewCount;

  const base: VocReportData = {
    ...report,
    reviewCount: periodKey && scrapedReviews?.length ? inPeriod : report.reviewCount,
    scrapedReviewTotal: scrapedTotal,
  };

  if (base.reviewCorpus?.length) return base;
  if (!scrapedReviews?.length) return base;

  const corpus = mapScrapedReviewsForCorpus(scrapedReviews);
  if (!corpus.length) return base;
  return { ...base, reviewCorpus: corpus };
}

export function snippetsFromMappedReviews(
  reviews: readonly {
    author: string;
    text: string;
    stars: number | null;
    date: string | null;
  }[]
): ReviewSnippetData[] {
  return reviews
    .filter((r) => r.text.trim().length > 12)
    .map((r) => ({
      author: r.author,
      source: "Google",
      stars: r.stars ?? undefined,
      quote: r.text.trim().slice(0, 400),
      tags: [] as string[],
      date: formatReviewDateDisplay(r.date),
    }));
}

function formatReviewDateDisplay(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export type ComplaintsOrPraiseSection =
  VocReportData["monthlyReport"]["complaints"];
