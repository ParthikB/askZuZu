# askZuZu

A kid-friendly Q&A app for children aged 6–15. ZuZu is a friendly robot who gives age-appropriate answers to curious questions, powered by Claude.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Anthropic API key

```bash
cp .env.local.example .env.local
```

Open `.env.local` and replace `your_api_key_here` with your key from [console.anthropic.com](https://console.anthropic.com).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Push this repo to GitHub (`.env.local` is git-ignored — your key is safe).
2. Import the project in [vercel.com](https://vercel.com).
3. Add `ANTHROPIC_API_KEY` as an environment variable in the Vercel dashboard.
4. Deploy.

---

## How it works

| Layer | File | What it does |
|-------|------|-------------|
| Screen 1 | `components/AgePicker.tsx` | Rotary dial to pick age 6–15 |
| Screen 2 | `components/AskScreen.tsx` | Question input + ZuZu answer |
| Character | `components/ZuZu.tsx` | Inline SVG robot with 4 expression states |
| API route | `app/api/ask/route.ts` | Rate-limit → Layer 1 check → Claude API |
| Safety L1 | `lib/safety-keywords.ts` | Pre-API keyword blocklist |
| Safety L2 | `lib/system-prompt.ts` | System prompt with age-tiered instructions and redirect rules |

The API key **never reaches the browser** — all Anthropic calls happen inside the `/api/ask` route.

---

## Safety architecture

- **Layer 1 (pre-API):** Questions are checked against a keyword list (`lib/safety-keywords.ts`) before any API call is made. Matches return a soft redirect immediately.
- **Layer 2 (system prompt):** Claude is instructed to redirect sensitive topics to a trusted adult, calibrate vocabulary to the child's age, and avoid scary or graphic content.
- **Rate limiting:** 10 requests per IP per minute (in-memory, suitable for alpha / single-instance deploy).
