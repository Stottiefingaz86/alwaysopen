# VoC admin platform

## URLs

| Route | Purpose |
|-------|---------|
| `/login` | Admin sign-in |
| `/dashboard` | Add businesses, generate reports, copy links |
| `/reports/{business-slug}/{period}` | Public client report (e.g. `/reports/la-vista-marina/2026-05`) |

## One-time setup

1. Copy `.env.example` → `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)
   - `APIFY_API_TOKEN`

2. In **Supabase Dashboard → Edge Functions → Secrets**, add:
   - `APIFY_API_TOKEN` — must match `.env.local`
   - `OPENAI_API_KEY` — enables full AI VoC reports (falls back to basic scoring if missing)

   Optional local CLI: `APIFY_CLI_TOKEN` in `.env.local` for `apify` CLI workflows.

3. Create the admin user:

```bash
ADMIN_EMAIL=christopher.hunt86@gmail.com \
ADMIN_PASSWORD='your-strong-password' \
node scripts/create-admin.mjs
```

The email must exist in `public.admin_allowlist` (migration seeds `christopher.hunt86@gmail.com`).

## Deploy edge function (after code changes)

```bash
npx supabase login
node scripts/deploy-voc-edge.mjs
```

Includes `_shared/voc-constants.ts`, `voc-ai-prompt.ts`, `review-metrics.ts`, `area-benchmark.ts`.

## Generate a report

1. Sign in at `/login`
2. Add business name + Google Place ID + **location** (e.g. Sotogrande) + **tags** (e.g. restaurant)
3. Click **Generate {YYYY-MM}**

**Area benchmark:** When two or more businesses share the same location and tag (e.g. restaurant + Sotogrande), each report’s competitor chart includes portfolio peers scored from their latest VoC report. Regenerate reports after adding tags to existing businesses.

**Tags column (required for area benchmarks):** In Supabase → **SQL Editor**, run:

```sql
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';
```

Or: `node scripts/apply-business-tags.mjs` (prints the same SQL). Wait ~10s, then save tags on the dashboard.
4. Pipeline: Apify scrape → **OpenAI (UX researcher persona)** analyses real reviews to match the [demo report layout](/#voc-demos) → saved to `voc_reports`
5. **Copy link** or open `/reports/{slug}/{period}`

AI rules (see `supabase/functions/_shared/voc-ai-prompt.ts`): evidence-only quotes from scraped reviews, demo-shaped JSON, British English, mention counts in themes.

## Later (not built yet)

- OpenAI enrichment in edge function
- Month-over-month trending
- Scheduled monthly refresh + email share
