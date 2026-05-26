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
| `ELEVENLABS_API_KEY` | Usage sync on `/admin/usage` |
| `WORKFLOW_LOG_SECRET` | n8n `POST /api/workflow-log` (Bearer token) |
| `STRIPE_SECRET_KEY` | Payments (future) |
| `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` | Twilio (future) |
| `N8N_WEBHOOK_BASE_URL` | n8n integration (optional) |

## n8n workflow logging

```http
POST https://ringsaway.com/api/workflow-log
Authorization: Bearer YOUR_WORKFLOW_LOG_SECRET
Content-Type: application/json

{
  "client_id": "uuid",
  "workflow_name": "Book Appointment",
  "workflow_type": "booking",
  "status": "success",
  "booking_created": true,
  "sms_sent": true,
  "email_sent": true
}
```

## Seed client

**RingsAway Demo / Internal Test Client** — Restaurant demo, Receptionist + Insight, €249/mo, 500 minutes.
