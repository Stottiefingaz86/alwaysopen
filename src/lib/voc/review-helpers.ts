import type { ScrapedGoogleReview } from "@/lib/voc/report-types";

export function hasOwnerResponse(
  responseFromOwnerText?: string | null
): boolean {
  return Boolean(responseFromOwnerText?.trim());
}

export function mapScrapedReviews(reviews: ScrapedGoogleReview[]) {
  const withText = reviews.filter((r) => (r.text ?? "").trim().length > 8);
  const sorted = [...withText].sort((a, b) => {
    const da = a.publishedAtDate ?? "";
    const db = b.publishedAtDate ?? "";
    return db.localeCompare(da);
  });
  return sorted.map((r) => ({
    stars: r.stars ?? null,
    text: (r.text ?? "").trim(),
    author: (r.name ?? "Anonymous").trim(),
    date: r.publishedAtDate ?? null,
    hasOwnerReply: hasOwnerResponse(r.responseFromOwnerText),
  }));
}

export function findUnrepliedLowStarReviews(
  reviews: ReturnType<typeof mapScrapedReviews>,
  limit = 8
) {
  return [...reviews]
    .filter(
      (r) =>
        r.text.length > 12 &&
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

export function pickMoreReviewSnippets(
  reviews: ReturnType<typeof mapScrapedReviews>,
  options: {
    preferLow: boolean;
    excludeQuote?: string;
    limit?: number;
  }
) {
  const { preferLow, excludeQuote, limit = 4 } = options;
  const norm = (q: string) => q.trim().slice(0, 80);
  const excluded = excludeQuote ? norm(excludeQuote) : "";

  return [...reviews]
    .filter((r) => {
      if (r.text.length < 16) return false;
      if (excluded && norm(r.text) === excluded) return false;
      const stars = r.stars ?? (preferLow ? 3 : 5);
      return preferLow ? stars <= 3 : stars >= 4;
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, limit)
    .map((r) => ({
      author: r.author,
      source: "Google",
      stars: r.stars ?? undefined,
      quote: r.text.slice(0, 320),
      tags: [] as string[],
      date: formatReviewDate(r.date),
    }));
}
