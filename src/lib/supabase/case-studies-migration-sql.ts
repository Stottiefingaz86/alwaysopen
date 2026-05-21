/** Run once in Supabase SQL Editor (or via apply-case-studies-migration API). */
export const CASE_STUDIES_MIGRATION_SQL = `-- Published VoC reports for landing grid / carousel
CREATE TABLE IF NOT EXISTS public.voc_case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL UNIQUE REFERENCES public.voc_reports (id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES public.businesses (id) ON DELETE CASCADE,
  title text,
  tags text[] NOT NULL DEFAULT '{}',
  placements text[] NOT NULL DEFAULT '{voc-demos,voc-carousel}',
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS voc_case_studies_published_idx
  ON public.voc_case_studies (is_published, sort_order);

CREATE INDEX IF NOT EXISTS voc_case_studies_tags_idx
  ON public.voc_case_studies USING gin (tags);`;

export function isCaseStudiesTableMissing(message: string): boolean {
  return (
    /voc_case_studies/i.test(message) &&
    (/schema cache/i.test(message) ||
      /does not exist/i.test(message) ||
      /Could not find/i.test(message) ||
      /relation/i.test(message) ||
      /PGRST205/i.test(message))
  );
}
