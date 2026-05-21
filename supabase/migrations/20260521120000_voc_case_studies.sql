-- Published VoC reports for landing carousel / demo placements
CREATE TABLE IF NOT EXISTS public.voc_case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL UNIQUE REFERENCES public.voc_reports (id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES public.businesses (id) ON DELETE CASCADE,
  title text,
  tags text[] NOT NULL DEFAULT '{}',
  placements text[] NOT NULL DEFAULT '{voc-carousel}',
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS voc_case_studies_published_idx
  ON public.voc_case_studies (is_published, sort_order);

CREATE INDEX IF NOT EXISTS voc_case_studies_tags_idx
  ON public.voc_case_studies USING gin (tags);

COMMENT ON TABLE public.voc_case_studies IS
  'Curated ready reports shown on the marketing site (carousel, demos). Filter by tags and placement.';
