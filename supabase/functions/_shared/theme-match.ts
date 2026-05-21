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

export type ReviewWithTags = ReviewLike & { tags?: string[] };

export type TagHint = { quote: string; tags: string[] };

export function themeLabelWithoutCount(theme: string): string {
  return theme.replace(/\s*\(\d+\s*mentions?\)\s*$/i, "").trim();
}

function formatThemeLine(label: string, count: number): string {
  return `${label} (${count} mention${count === 1 ? "" : "s"})`;
}

function labelKeywords(label: string): string[] {
  return themeLabelWithoutCount(label)
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function normalizeMatchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/crossaints?/gi, "croissant")
    .replace(/croissants/gi, "croissant");
}

function keywordHit(hay: string, key: string): boolean {
  if (hay.includes(key)) return true;
  if (key === "unavailable" || key.startsWith("unavail")) {
    return /\b(unavail|sold out|run out|out of|agotad|sin |no longer|anymore|not have|no qued)\b/.test(
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

/** Extra patterns for non-English reviews (Spanish-heavy portfolios). */
function multilingualThemePatterns(label: string): RegExp[] {
  const l = label.toLowerCase();
  const patterns: RegExp[] = [];

  if (/\bdissatisf|disappoint|unhappy\b/.test(l)) {
    patterns.push(
      /\b(decepci[oó]n|decepcionante|insatisf|disappoint|unhappy|malo|mal servicio|no recommend|no volver)\b/i
    );
  }
  if (/\bhair|colour|color|mechas|highlights|balayage|tinte\b/.test(l)) {
    patterns.push(
      /\b(pelo|cabello|mechas|highlights|balayage|tinte|coloraci[oó]n|color|colour|treatment|tratamiento)\b/i
    );
  }
  if (/\btreatment|result|outcome\b/.test(l)) {
    patterns.push(
      /\b(tratamiento|resultado|results|quedado|qued[oó]|igual|esperaba|expected|outcome)\b/i
    );
  }
  if (/\bfollow|aftercare|outcome\b/.test(l)) {
    patterns.push(
      /\b(seguimiento|follow[\s-]?up|aftercare|despu[eé]s|post|resultado|outcome)\b/i
    );
  }
  if (/\bcommunication|expectation\b/.test(l)) {
    patterns.push(
      /\b(comunicaci[oó]n|expectativa|expectation|explicar|explained|avisar)\b/i
    );
  }
  if (/\bstaff|attitude|rude|friendly\b/.test(l)) {
    patterns.push(
      /\b(personal|staff|emplead|atenci[oó]n|amable|rude|grosero|maleducad)\b/i
    );
  }
  if (/\bprice|value|expensive|cost\b/.test(l)) {
    patterns.push(
      /\b(precio|caro|expensive|value|vale|cost|bill|cuenta)\b/i
    );
  }
  if (/\bwait|delay|slow|speed\b/.test(l)) {
    patterns.push(
      /\b(espera|esperar|lento|delay|demora|minutos|hora|rush)\b/i
    );
  }
  if (/\bfood|quality|taste|meal\b/.test(l)) {
    patterns.push(
      /\b(comida|plato|menu|sabor|taste|quality|calidad|fresco|fresh)\b/i
    );
  }
  if (/\batmosphere|ambience|decor\b/.test(l)) {
    patterns.push(
      /\b(ambiente|atm[oó]sfera|decor|vista|music|acogedor)\b/i
    );
  }
  if (/\bbook|reserv|appointment\b/.test(l)) {
    patterns.push(
      /\b(reserv|cita|appointment|book|booking|turno|hora)\b/i
    );
  }

  return patterns;
}

/** Regex tuned to AI theme labels — matches how people write in Google reviews. */
export function themeMatchRegex(themeLine: string): RegExp | null {
  const label = themeLabelWithoutCount(themeLine).toLowerCase();

  if (
    /\b(service|speed|wait|slow|delay|rush)\b/.test(label) ||
    label.includes("service speed")
  ) {
    return /\b(wait|waiting|waited|slow|speed|delay|delayed|queue|minute|hour|rush|service|staff|table|order|espera|demora)\b/i;
  }
  if (/\bfood\b/.test(label) && /\b(quality|taste|dish|meal)\b/.test(label)) {
    return /\b(food|dish|meal|menu|taste|flavour|flavor|quality|comida|plato|sabor|calidad)\b/i;
  }
  if (/\bclean|hygien|dirty\b/.test(label)) {
    return /\b(clean|dirty|hygien|mess|sticky|floor|table|bathroom|sucio|limpio)\b/i;
  }
  if (/\bprice|value|expensive|cost\b/.test(label)) {
    return /\b(price|expensive|cheap|value|worth|overpriced|bill|cost|precio|caro)\b/i;
  }
  if (/\bpark|access|direction\b/.test(label)) {
    return /\b(park|parking|direction|find|located|access|aparcar)\b/i;
  }
  if (/\bbook|reserv|appointment\b/.test(label)) {
    return /\b(book|booking|reservation|table|appointment|reserved|cita|reserv)\b/i;
  }
  if (/\batmosphere|ambience|decor\b/.test(label)) {
    return /\b(atmosphere|ambience|ambiance|decor|view|vibe|music|ambiente)\b/i;
  }
  if (/\bfriendly|staff|team\b/.test(label)) {
    return /\b(friendly|staff|team|waiter|server|welcoming|rude|personal|atenci[oó]n)\b/i;
  }
  if (/\bcroiss|pastry|pastries|baked\b/.test(label)) {
    return /\b(croiss\w*|crossaint\w*|pastry|pastries|pain au|muffin|bakery)\b/i;
  }
  if (/\bunavail|not available|out of stock\b/.test(label)) {
    return /\b(unavail|sold out|run out|out of|dont have|don't have|no longer|anymore|agotad)\b/i;
  }
  if (/\border\b/.test(label) && /\b(accuracy|wrong|incorrect|mistake|missing)\b/.test(label)) {
    return /\b(order|ordered|wrong order|incorrect|missing item|mistake|pedido|error)\b/i;
  }
  if (/\bdissatisf|disappoint|treatment|hair|result|outcome|follow\b/.test(label)) {
    return null;
  }

  return null;
}

const STOP = new Set([
  "the", "a", "an", "in", "on", "at", "during", "for", "and", "or", "to", "of", "with",
  "this", "that", "your", "our", "issues", "issue", "concerns", "concern", "lack", "with",
]);

function keywordFallbackMatch(text: string, themeLine: string): boolean {
  const keys = labelKeywords(themeLine);
  if (!keys.length) return false;
  const hay = normalizeMatchText(text);
  const hits = keys.filter((k) => keywordHit(hay, k));
  const hasStrongProduct = keys.some((k) => /\bcroiss|pastry|hair|treatment\b/.test(k));
  if (hasStrongProduct && hits.length >= 1) return true;
  return hits.length >= Math.min(2, keys.length);
}

export function tagOverlapsTheme(tag: string, themeLine: string): boolean {
  const t = normalizeMatchText(tag);
  const label = themeLabelWithoutCount(themeLine).toLowerCase();
  if (!t || !label) return false;
  if (t.includes(label) || label.includes(t)) return true;

  const tagKeys = labelKeywords(tag);
  const themeKeys = labelKeywords(themeLine);
  if (!tagKeys.length || !themeKeys.length) return false;

  const overlap = tagKeys.filter((tk) =>
    themeKeys.some(
      (wk) =>
        tk === wk ||
        tk.includes(wk) ||
        wk.includes(tk) ||
        (tk.length >= 4 && wk.length >= 4 && tk.slice(0, 4) === wk.slice(0, 4))
    )
  );
  if (overlap.length >= 1) return true;

  const combined = `${tag} ${label}`;
  for (const re of multilingualThemePatterns(combined)) {
    if (re.test(t)) return true;
  }
  return false;
}

export function reviewTextMatchesTheme(text: string, themeLine: string): boolean {
  if (text.trim().length < 12) return false;
  const normalized = normalizeMatchText(text);
  const re = themeMatchRegex(themeLine);
  if (re?.test(normalized)) return true;
  for (const mre of multilingualThemePatterns(themeLine)) {
    if (mre.test(normalized)) return true;
  }
  return keywordFallbackMatch(normalized, themeLine);
}

export function reviewMatchesTheme(
  review: ReviewWithTags,
  themeLine: string
): boolean {
  if (review.tags?.length) {
    if (review.tags.some((tag) => tagOverlapsTheme(tag, themeLine))) return true;
  }
  return reviewTextMatchesTheme(review.text, themeLine);
}

export function countThemeMentions(
  reviews: ReviewWithTags[],
  themeLine: string
): number {
  return reviews.filter((r) => reviewMatchesTheme(r, themeLine)).length;
}

export function themesWithVerifiedCounts(
  aiThemes: string[],
  reviews: ReviewWithTags[],
  minCount = 1
): string[] {
  return aiThemes.map((line) => {
    const label = themeLabelWithoutCount(line);
    const count = countThemeMentions(reviews, line);
    return formatThemeLine(label, Math.max(count, 0));
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
  "Treatment results & outcomes",
  "Communication & expectations",
  "Follow-up & aftercare",
  "Overall dissatisfaction",
];

export const PRAISE_THEME_SEEDS = [
  "Exceptional service",
  "Food quality",
  "Atmosphere & ambience",
  "Value for money",
  "Friendly staff",
  "Fresh ingredients",
  "Great location & views",
  "Hair & colour results",
  "Professional expertise",
];

export type SectionThemeCandidate = {
  label: string;
  count: number;
  line: string;
};

export function computeSectionThemesFromReviews(
  reviews: ReviewWithTags[],
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
      line: formatThemeLine(t.label, t.count),
    }));
}

function scoreLabelSimilarity(a: string, b: string): number {
  const aw = new Set(labelKeywords(a));
  const bw = labelKeywords(b);
  if (!aw.size || !bw.length) return 0;
  let score = 0;
  for (const w of bw) {
    if (aw.has(w)) score += 2;
    else if ([...aw].some((x) => x.includes(w) || w.includes(x))) score += 1;
  }
  return score;
}

/** Merge AI theme labels with verified counts — never emit 0-mention themes. */
export function resolveReportThemes(
  aiThemeLines: string[],
  reviews: ReviewWithTags[],
  seedLabels: readonly string[],
  maxThemes = 3
): string[] {
  const corpus = reviews.filter((r) => r.text.trim().length > 12);
  const computed = computeSectionThemesFromReviews(corpus, seedLabels, 10);

  const candidates: SectionThemeCandidate[] = [];
  const seen = new Set<string>();

  const addCandidate = (label: string, count: number) => {
    const key = label.toLowerCase();
    if (!label || seen.has(key) || count < 1) return;
    seen.add(key);
    candidates.push({
      label,
      count,
      line: formatThemeLine(label, count),
    });
  };

  for (const c of computed) addCandidate(c.label, c.count);

  for (const line of aiThemeLines) {
    const label = themeLabelWithoutCount(line);
    if (!label) continue;
    let count = countThemeMentions(corpus, label);
    if (count < 1) {
      let best: SectionThemeCandidate | null = null;
      let bestScore = 0;
      for (const c of computed) {
        const s = scoreLabelSimilarity(label, c.label);
        if (s > bestScore) {
          bestScore = s;
          best = c;
        }
      }
      if (best && bestScore >= 2) count = best.count;
    }
    addCandidate(label, count);
  }

  candidates.sort((a, b) => b.count - a.count);

  if (candidates.length) {
    return candidates.slice(0, maxThemes).map((c) => c.line);
  }

  return computed.slice(0, maxThemes).map((c) => c.line);
}

function shortenAuthor(name: string): string {
  const t = name.trim();
  if (!t || t === "Anonymous") return "Reviewer";
  const parts = t.split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 24);
  return `${parts[0]} ${parts[parts.length - 1]!.charAt(0)}.`;
}

function quoteKey(text: string): string {
  return text.trim().slice(0, 120).toLowerCase();
}

export function buildReviewCorpus(
  reviews: ReviewLike[],
  tagHints: TagHint[] = []
): ThemeSnippet[] {
  const tagByQuote = new Map<string, string[]>();
  for (const hint of tagHints) {
    const key = quoteKey(hint.quote);
    if (!key) continue;
    tagByQuote.set(key, hint.tags);
  }

  return reviews
    .filter((r) => r.text.trim().length > 12)
    .map((r) => {
      const text = r.text.trim();
      const tags = tagByQuote.get(quoteKey(text)) ?? [];
      return {
        author: shortenAuthor(r.author),
        source: "Google",
        stars: r.stars ?? undefined,
        quote: text.slice(0, 400),
        tags,
        date: formatReviewDate(r.date),
      };
    });
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
  return corpus.filter((r) =>
    reviewMatchesTheme({ text: r.quote, author: r.author, stars: r.stars ?? null, tags: [...r.tags] }, themeLine)
  );
}
