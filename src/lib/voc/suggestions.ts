import type { VocReportData } from "@/lib/voc/report-types";

export type SuggestionItem = VocReportData["monthlyReport"]["suggestions"]["items"][number];

/** Support legacy single-review suggestions stored in older reports. */
export function normalizeSuggestionsForDisplay(
  data: VocReportData["monthlyReport"]["suggestions"] | Record<string, unknown>
): { summary?: string; items: SuggestionItem[] } {
  if (Array.isArray((data as { items?: unknown }).items)) {
    const d = data as VocReportData["monthlyReport"]["suggestions"];
    return { summary: d.summary, items: [...d.items] };
  }

  const legacy = data as {
    reviewLabel?: string;
    reviewAuthor?: string;
    reviewQuote?: string;
    replyLabel?: string;
    replyText?: string;
    stars?: number;
    date?: string | null;
  };

  if (legacy.reviewQuote?.trim()) {
    return {
      items: [
        {
          reviewLabel: legacy.reviewLabel ?? "Review",
          reviewAuthor: legacy.reviewAuthor ?? "Reviewer",
          reviewQuote: legacy.reviewQuote,
          stars: legacy.stars,
          date: legacy.date ?? null,
          replyLabel: legacy.replyLabel ?? "Suggested Google reply",
          replyText: legacy.replyText ?? "",
        },
      ],
    };
  }

  return { items: [] };
}
