import { normalizeBusinessTags, formatTagLabel } from "@/lib/voc/business-tags";

/** Internal placement ids (landing grid queries either id). */
const CASE_STUDY_PLACEMENT_IDS = ["voc-carousel", "voc-demos"] as const;

export type CaseStudyPlacement = (typeof CASE_STUDY_PLACEMENT_IDS)[number];

export function normalizePlacements(input: unknown): CaseStudyPlacement[] {
  if (!Array.isArray(input)) return ["voc-carousel"];
  const allowed = new Set(CASE_STUDY_PLACEMENT_IDS);
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

/** All publishes appear on the homepage Client reports grid. */
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
