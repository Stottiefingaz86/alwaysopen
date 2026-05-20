# AlwaysOpen Landing Page

Premium marketing site for **AlwaysOpen** — a local business growth system combining AI receptionist, booking automation, and review intelligence.

## Stack

- Next.js (App Router)
- Tailwind CSS v4
- Framer Motion
- ElevenLabs Conversational AI — agent **Chris** (`agent_8601ks0784njem2rdqg7yy725gnr`)

## ElevenLabs agent (live demo)

The hero embeds agent **Chris** using the official widget:

- Script: `https://elevenlabs.io/convai-widget/index.js`
- Fallback: `@elevenlabs/convai-widget-embed` (npm)
- Inline mode: `variant="full"` with orb visible immediately

**Agent requirements (ElevenLabs dashboard):**

1. Agent must be **public** with authentication disabled
2. Add your domains to the **Allowlist** (e.g. `http://localhost:3000`, production URL)
3. Widget tab: prefer **Inline** layout to match the site embed

`@elevenlabs/react` is installed if you later want a custom UI via `useConversation` (WebRTC).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project structure

```
src/
  app/              # Layout, page, SEO (sitemap)
  components/
    landing/        # Page sections
    ui/             # Shared UI primitives
  lib/              # Utilities
  types/            # ElevenLabs widget types
```

## Design

Google Business–inspired palette: blue `#4285F4`, green `#34A853`, yellow `#FBBC05`, red `#EA4335`. White backgrounds, rounded cards, soft shadows, Roboto typography.
