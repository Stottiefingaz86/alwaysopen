/** Preset tags for portfolio grouping and area benchmarks. */
export const BUSINESS_TAG_OPTIONS = [
  "restaurant",
  "bar",
  "cafe",
  "salon",
  "clinic",
  "dental",
  "hotel",
  "shop",
  "gym",
  "trades",
] as const;

export type BusinessTag = (typeof BUSINESS_TAG_OPTIONS)[number];

export function normalizeBusinessTags(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input) {
    if (typeof raw !== "string") continue;
    const t = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out.slice(0, 8);
}

export function normalizeAreaKey(location: string | null | undefined): string {
  if (!location?.trim()) return "";
  return location.trim().toLowerCase();
}

export function tagsOverlap(a: string[], b: string[]): boolean {
  if (!a.length || !b.length) return false;
  const set = new Set(a);
  return b.some((t) => set.has(t));
}

export function formatTagLabel(tag: string): string {
  return tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, " ");
}

export function primaryTagLabel(tags: string[]): string {
  if (!tags.length) return "business";
  return formatTagLabel(tags[0]!);
}
