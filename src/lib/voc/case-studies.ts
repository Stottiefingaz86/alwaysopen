import { normalizeBusinessTags, formatTagLabel } from "@/lib/voc/business-tags";

/** Where a case study may appear on the marketing site */
export const CASE_STUDY_PLACEMENTS = [
  { id: "voc-carousel", label: "VoC carousel (landing)" },
  { id: "voc-demos", label: "VoC reports row (landing grid)" },
] as const;

export type CaseStudyPlacement = (typeof CASE_STUDY_PLACEMENTS)[number]["id"];

export function normalizePlacements(input: unknown): CaseStudyPlacement[] {
  if (!Array.isArray(input)) return ["voc-carousel"];
  const allowed = new Set(CASE_STUDY_PLACEMENTS.map((p) => p.id));
  const out: CaseStudyPlacement[] = [];
  for (const raw of input) {
    if (typeof raw !== "string") continue;
    const id = raw.trim() as CaseStudyPlacement;
    if (!allowed.has(id) || out.includes(id)) continue;
    out.push(id);
  }
  return out.length ? out : [...DEFAULT_CASE_STUDY_PLACEMENTS];
}

export function normalizeCaseStudyTags(input: unknown): string[] {
  return normalizeBusinessTags(input);
}

export type CaseStudyListItem = {
  id: string;
  title: string;
  businessName: string;
  location: string;
  slug: string;
  period: string;
  periodLabel: string;
  tags: string[];
  tagLabels: string[];
  score: number;
  scoreLabel: string;
  reviewCount: number;
  source: "google" | "tripadvisor";
  metrics: { key: string; label: string; value: number; color: "violet" | "amber" | "green" | "red" }[];
  placements: CaseStudyPlacement[];
};

/** Default placements for new publishes — main landing grid + legacy carousel id */
export const DEFAULT_CASE_STUDY_PLACEMENTS: CaseStudyPlacement[] = [
  "voc-demos",
  "voc-carousel",
];

export function caseStudyDisplayTitle(
  title: string | null | undefined,
  businessName: string
): string {
  const t = title?.trim();
  return t || businessName;
}

export function collectFilterTags(items: CaseStudyListItem[]): string[] {
  const set = new Set<string>();
  for (const item of items) {
    for (const tag of item.tags) set.add(tag);
  }
  return [...set].sort((a, b) => formatTagLabel(a).localeCompare(formatTagLabel(b)));
}
