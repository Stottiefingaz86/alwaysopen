# Book a demo — Google Calendar & Meet

RingsAway uses **Google Calendar appointment schedules** (Google Workspace). When a visitor books a slot, Google sends calendar invites to both parties and can attach a **Google Meet** link automatically.

## Setup (once)

1. In [Google Calendar](https://calendar.google.com), **Create → Appointment schedule**.
2. Set duration (e.g. 30 minutes), availability, and buffer times.
3. Under **Location / conferencing**, choose **Google Meet** (video call).
4. Save and open the schedule → **Copy booking page link**.
5. Add to `.env.local` and Vercel:

```bash
# Short link (recommended)
NEXT_PUBLIC_BOOKING_URL=https://calendar.app.google/6zubKke4CCRQYKQN8

# Or long form
# NEXT_PUBLIC_BOOKING_URL=https://calendar.google.com/calendar/appointments/AcZssZ...
```

6. Redeploy. **Book a demo** opens this URL in a new tab.

### Wrong link (will not work)

Do **not** use your signed-in calendar view, e.g.:

`https://calendar.google.com/calendar/u/0/r/week/2026/5/27`

That page is only for you when logged in. Visitors need an **appointment schedule** link containing `/calendar/appointments/`.

## Where it appears

- Hero / nav / final CTA secondary button → **Book a demo** → `/book-demo`
- Pricing plan buttons → `/book-demo`
- ElevenLabs agent tools (`schedule_meeting`, etc.) → opens `NEXT_PUBLIC_BOOKING_URL` or `/book-demo`

## Email fallback

If `NEXT_PUBLIC_BOOKING_URL` is not set, **Book a demo** still works via the contact mailto on `/book-demo`.

## Custom API (not included)

A fully custom picker that creates events via the Calendar API would need a Google Cloud project, OAuth or service account, and server routes. Appointment schedules are the recommended approach for Workspace + Meet with minimal maintenance.
