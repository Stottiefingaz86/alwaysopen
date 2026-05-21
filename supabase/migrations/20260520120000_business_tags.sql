-- Tags for grouping businesses (e.g. restaurant) + area benchmarking in VoC reports
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.businesses.tags IS
  'Category labels (e.g. restaurant, salon) used to compare scores with other businesses in the same location.';
