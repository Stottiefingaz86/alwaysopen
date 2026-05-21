import type { ReviewLike } from "./review-metrics.ts";
import { formatReviewDate } from "./review-metrics.ts";

export type ThemeSnippet = {
  author: string;
  source: string;
  quote: string;
  tags: readonly string[];
  stars?: number;
  date?: string | null;
};

function themeLabelWithoutCount(theme: string): string {
  return theme.replace(/\s*\(\d+\s*mentions?\)\s*$/i, "").trim();
}

function normalizeMatchText(text: string): string {
  return text
    .toLowerCase()
    .replace(/crossaints?/gi, "croissant")
    .replace(/croissants/gi, "croissant");
}

function keywordHit(hay: string, key: string): boolean {
  if (hay.includes(key)) return true;
  if (key === "unavailable" || key.startsWith("unavail")) {
    return /\b(unavail|sold out|run out|out of|dont have|don't have|no longer|anymore|not have)\b/.test(
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

/** Regex tuned to AI theme labels — matches how people write in Google reviews. */
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
    return /\b(wait|waiting|waited|slow|delay|delayed|queue|minute|hour|rush|long time|took forever)\b/i;
  }

  return null;
}

const STOP = new Set([
  "the", "a", "an", "in", "on", "at", "during", "for", "and", "or", "to", "of", "with", "this", "that", "issues", "issue", "concerns", "concern",
]);

function keywordFallbackMatch(text: string, themeLine: string): boolean {
  const keys = themeLabelWithoutCount(themeLine)
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
  if (!keys.length) return false;
  const hay = normalizeMatchText(text);
  const hits = keys.filter((k) => keywordHit(hay, k));
  const hasStrongProduct = keys.some((k) => /\bcroiss|pastry\b/.test(k));
  if (hasStrongProduct && hits.length >= 1) return true;
  return hits.length >= Math.min(2, keys.length);
}

export function reviewTextMatchesTheme(text: string, themeLine: string): boolean {
  if (text.trim().length < 12) return false;
  const normalized = normalizeMatchText(text);
  const re = themeMatchRegex(themeLine);
  if (re?.test(normalized)) return true;
  return keywordFallbackMatch(normalized, themeLine);
}

export function countThemeMentions(reviews: ReviewLike[], themeLine: string): number {
  return reviews.filter((r) => reviewTextMatchesTheme(r.text, themeLine)).length;
}

export function themesWithVerifiedCounts(
  aiThemes: string[],
  reviews: ReviewLike[],
  minCount = 1
): string[] {
  return aiThemes.map((line) => {
    const label = themeLabelWithoutCount(line);
    const count = countThemeMentions(reviews, line);
    if (count < minCount) return `${label} (${count} mentions)`;
    return `${label} (${count} mention${count === 1 ? "" : "s"})`;
  });
}

/** Seed labels for server-side theme frequency across the full scrape. */
export const COMPLAINT_THEME_SEEDS = [
  "Service delays & wait times",
  "Slow service",
  "Order accuracy problems",
  "Food quality issues",
  "Value for money concerns",
  "Staff attitude",
  "Cleanliness & hygiene",
  "Parking & access",
  "Booking & reservations",
  "Unavailable items & stock",
];

export const PRAISE_THEME_SEEDS = [
  "Exceptional service",
  "Food quality",
  "Atmosphere & ambience",
  "Value for money",
  "Friendly staff",
  "Fresh ingredients",
  "Great location & views",
];

export type SectionThemeCandidate = {
  label: string;
  count: number;
  line: string;
};

/** Count theme mentions across every review with text (any star rating). */
export function computeSectionThemesFromReviews(
  reviews: ReviewLike[],
  seedLabels: readonly string[],
  maxThemes = 6
): SectionThemeCandidate[] {
  const corpus = reviews.filter((r) => r.text.trim().length > 12);
  return seedLabels
    .map((label) => ({
      label,
      count: countThemeMentions(corpus, label),
    }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, maxThemes)
    .map((t) => ({
      ...t,
      line: `${t.label} (${t.count} mention${t.count === 1 ? "" : "s"})`,
    }));
}

/** Merge AI theme labels with server counts from the full review corpus. */
export function resolveReportThemes(
  aiThemeLines: string[],
  reviews: ReviewLike[],
  seedLabels: readonly string[],
  maxThemes = 3
): string[] {
  const corpus = reviews.filter((r) => r.text.trim().length > 12);
  const computed = computeSectionThemesFromReviews(corpus, seedLabels, 8);
  const aiLabels = aiThemeLines
    .map((line) => themeLabelWithoutCount(line))
    .filter((l) => l.length > 2);

  const orderedLabels: string[] = [];
  const seen = new Set<string>();
  const add = (label: string) => {
    const key = label.toLowerCase();
    if (seen.has(key) || !label) return;
    seen.add(key);
    orderedLabels.push(label);
  };

  for (const c of computed) add(c.label);
  for (const a of aiLabels) add(a);

  if (!orderedLabels.length && computed.length) {
    return computed.slice(0, maxThemes).map((c) => c.line);
  }

  const lines = orderedLabels
    .slice(0, maxThemes)
    .map((l) => `${l} (0 mentions)`);
  const verified = themesWithVerifiedCounts(lines, corpus);
  const hasSignal = verified.some((t) => !/\(\s*0\s*mentions?\)/i.test(t));
  if (hasSignal) return verified;
  return computed.slice(0, maxThemes).map((c) => c.line);
}

function shortenAuthor(name: string): string {
  const t = name.trim();
  if (!t || t === "Anonymous") return "Reviewer";
  const parts = t.split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 24);
  return `${parts[0]} ${parts[parts.length - 1]!.charAt(0)}.`;
}

export function buildReviewCorpus(reviews: ReviewLike[]): ThemeSnippet[] {
  return reviews
    .filter((r) => r.text.trim().length > 12)
    .map((r) => ({
      author: shortenAuthor(r.author),
      source: "Google",
      stars: r.stars ?? undefined,
      quote: r.text.trim().slice(0, 400),
      tags: [] as string[],
      date: formatReviewDate(r.date),
    }));
}

export function filterCorpusByTone(
  corpus: ThemeSnippet[],
  tone: "negative" | "positive"
): ThemeSnippet[] {
  return corpus.filter((r) => {
    const stars = r.stars ?? (tone === "negative" ? 3 : 5);
    return tone === "negative" ? stars <= 3 : stars >= 4;
  });
}

export function filterSnippetsByTheme(
  corpus: ThemeSnippet[],
  themeLine: string
): ThemeSnippet[] {
  return corpus.filter((r) => reviewTextMatchesTheme(r.quote, themeLine));
}
