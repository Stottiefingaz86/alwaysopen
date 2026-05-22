# VoC admin platform

## URLs

| Route | Purpose |
|-------|---------|
| `/login` | Admin sign-in |
| `/dashboard` | Add businesses, generate reports, copy links |
| `/reports/{business-slug}/{period}` | Public client report (e.g. `/reports/la-vista-marina/2026-05`) |

## Vercel (production — required for `/login` and `/dashboard`)

`NEXT_PUBLIC_*` variables are **embedded at build time**. After adding or changing them, trigger a **new deployment** (Redeploy).

| Variable | Scope | Required for |
|----------|--------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | Login, dashboard, public reports |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | Login, dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | Dashboard APIs, report pages, admin routes |
| `APIFY_API_TOKEN` | Production | Generate report (also set in Supabase Edge secrets) |
| `RESEND_API_KEY` | Production | Contact form (optional for VoC) |
| `LEADS_TO_EMAIL` | Production | Contact form |

Copy values from your local `.env.local` (Supabase → Project Settings → API).

**Symptom:** Login stuck on “Signing in…” with no error → almost always missing `NEXT_PUBLIC_SUPABASE_*` on Vercel or deploy without redeploy after adding them.

Edge function secrets (`OPENAI_API_KEY`, `APIFY_API_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`) are set in **Supabase Dashboard → Edge Functions → Secrets**, not Vercel.

## One-time setup

1. Copy `.env.example` → `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)
   - `APIFY_API_TOKEN`

2. In **Supabase Dashboard → Edge Functions → Secrets**, add (required for Generate to finish):
   - `APIFY_API_TOKEN` — must match `.env.local`
   - `OPENAI_API_KEY` — enables full AI VoC reports (falls back to basic scoring if missing)
   - `SUPABASE_SERVICE_ROLE_KEY` — same as Vercel (edge uses it for DB + analyze handoff)

   **Stuck on `scraping` with 0 reviews?** Usually the edge function is missing `APIFY_API_TOKEN`, was not redeployed after code changes, or hit the platform time limit. Dashboard → **Mark failed** → fix secrets → `node scripts/deploy-voc-edge.mjs` → **Generate** again.

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

**Case studies (landing carousel):** Run migration `supabase/migrations/20260521120000_voc_case_studies.sql` in SQL Editor.

4. Pipeline: **Apify scrape** (background edge) → **separate analyze invocation** (OpenAI + benchmarks, own edge run) → saved to `voc_reports`. This avoids production edge shutdown while stuck on `analyzing`.
5. If a report hangs on `analyzing` after logs show shutdown: dashboard → **Continue analysis** (reuses scraped reviews) or **Mark failed** → Generate again.
6. Reports are **not** auto-generated every 30 days — click **Generate** each month (cron can be added later).
7. **Copy link** or open `/reports/{slug}/{period}`

## Landing case studies

On the dashboard, when a report is **ready**, use **Landing case study**:

- **Publish on website** — adds the card to the homepage **Client reports** grid
- **Filter tags** — e.g. `salon` (filter pills on the landing grid)
- **Sort order** — lower numbers appear first

Visitors see cards in that grid; clicking opens a **blurred preview** with **Get full report** (booking mailto). Full public URL still works via **Copy link**.

AI rules (see `supabase/functions/_shared/voc-ai-prompt.ts`): evidence-only quotes from scraped reviews, demo-shaped JSON, British English, mention counts in themes.

## Later (not built yet)

- OpenAI enrichment in edge function
- Month-over-month trending
- Scheduled monthly refresh + email share
