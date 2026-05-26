# RingsAway Backoffice

Internal operations dashboard at `/admin` (after sign-in at `/login` → `/admin/start`).

## First-time setup

1. Run migration `supabase/migrations/20260522120000_backoffice.sql` in Supabase SQL editor, **or**
2. Set `SUPABASE_DB_URL` and click **Apply backoffice migration** on `/admin` when tables are missing.

## Environment variables

| Variable | Required for |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | All admin |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Login session |
| `SUPABASE_SERVICE_ROLE_KEY` | Backoffice data APIs |
| `SUPABASE_DB_URL` | One-click migration (optional) |
| `RESEND_API_KEY` | Contact form |
| `ELEVENLABS_API_KEY` | **Required** — billable minutes come only from ElevenLabs API sync |
| `WORKFLOW_LOG_SECRET` | n8n `POST /api/workflow-log` (Bearer token) |
| `RESEND_API_KEY` | Send invoice emails from hello@ringsaway.com |
| `RESEND_FROM_EMAIL` | Prefer `RingsAway <hello@ringsaway.com>` after domain verification |
| `STRIPE_SECRET_KEY` | Optional — future hosted invoice links |
| `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` | Twilio (future) |
| `N8N_API_BASE_URL` | n8n instance, e.g. `https://stottiefingaz.app.n8n.cloud` |
| `N8N_API_KEY` | n8n Settings → API — lists workflows in client Integrations |
| `N8N_WEBHOOK_BASE_URL` | Optional base for webhook URLs in docs |

## n8n workflow health (live API)

**Admin → Workflows** loads all workflows and the last ~100 executions from n8n, then shows:

- Last run time and status
- Health (healthy / warning / failed)
- Success % over recent runs
- **Client workflows** vs **unlinked** workflows

On each page load, client-linked workflows are synced into `workflow_health` for the dashboard and client detail.

`POST /api/admin/backoffice/n8n/sync-health` — manual refresh.

**Preferred — n8n MCP** (Settings → MCP → Access Token):

```bash
N8N_MCP_URL=https://stottiefingaz.app.n8n.cloud/mcp-server/http
N8N_MCP_TOKEN=your_mcp_access_token
N8N_API_BASE_URL=https://stottiefingaz.app.n8n.cloud
```

In each workflow’s n8n settings, enable **MCP access** so execution history appears in Admin → Workflows.

**Optional — REST API** (`N8N_API_KEY`) for execution sync without per-workflow MCP toggle.

For **Cursor IDE**, copy `docs/n8n-mcp-cursor.example.json` into your Cursor MCP config (never commit tokens).

## Linking n8n workflows to clients

1. **Integrations tab** (per client): pick from your n8n instance or paste the **editor** URL  
   (`https://…/workflow/mzpH8ceGar3qjnuN`). That is not the webhook URL ElevenLabs calls.
2. **Naming**: prefix workflows in n8n with the client name so the picker is obvious.
3. **Admin → Workflows**: run health rows appear when workflows POST to `/api/workflow-log` with `client_id`.

## n8n workflow logging

```http
POST https://ringsaway.com/api/workflow-log
Authorization: Bearer YOUR_WORKFLOW_LOG_SECRET
Content-Type: application/json

{
  "client_id": "uuid",
  "workflow_name": "Book Appointment",
  "workflow_type": "booking",
  "workflow_url": "https://stottiefingaz.app.n8n.cloud/workflow/mzpH8ceGar3qjnuN",
  "n8n_workflow_id": "mzpH8ceGar3qjnuN",
  "status": "success",
  "booking_created": true,
  "sms_sent": true,
  "email_sent": true
}
```

## Usage (ElevenLabs only)

- Minutes are **never** seeded or manually editable. `usage_logs.elevenlabs_synced_at` is set only after a successful API sync.
- Sync runs automatically when you open **Admin → Usage** or a **client detail** page (if `ELEVENLABS_API_KEY` is set).
- Each client needs `elevenlabs_agent_id` on **Integrations**. Usage is summed for the **current calendar month** via `GET /v1/convai/conversations` with date filters.
- Run migration `20260523120000_usage_elevenlabs_only.sql` to clear old demo seed minutes and add `elevenlabs_synced_at`.

## Seed client

**RingsAway Demo / Internal Test Client** — Restaurant demo, Receptionist + Insight, €249/mo, 500 minutes. Usage starts at 0 until ElevenLabs sync.

**Platform logins (OAuth, not stored as passwords):**

| Platform | Login | URL |
|----------|-------|-----|
| ElevenLabs | christopher.hunt86@gmail.com (Google OAuth) | https://elevenlabs.io/app/sign-in |
| n8n Cloud | christopher.hunt86@gmail.com (Google OAuth) | https://stottiefingaz.app.n8n.cloud/signin |
| Google Calendar | christopher.hunt86@gmail.com (Google OAuth) | https://calendar.google.com |

Recorded under the demo client **Credentials** tab. API automation uses env keys, not OAuth sessions.
