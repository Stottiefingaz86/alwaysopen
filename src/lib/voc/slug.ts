/** Client-side slug helper (matches Postgres `slugify`). */
export function slugify(input: string): string {
  const s = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return s || "business";
}

export function uniqueSlug(base: string, taken: Set<string>): string {
  let slug = slugify(base);
  if (!taken.has(slug)) return slug;
  let n = 2;
  while (taken.has(`${slug}-${n}`)) n += 1;
  return `${slug}-${n}`;
}

export function reportPublicSlug(businessSlug: string, period: string): string {
  return `${businessSlug}/${period}`;
}

export function reportPath(businessSlug: string, period: string): string {
  return `/reports/${businessSlug}/${period}`;
}
