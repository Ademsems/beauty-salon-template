# Dunajmedia — Luxury Beauty & Nail Salon Template

A multi-tenant Next.js 14 template where **one Vercel deployment serves every salon** via a single Google Sheets CSV.

---

## File Structure

```
dunajmedia-salon/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Minimal CSS reset
│   └── [slug]/
│       ├── page.tsx            # Server Component — data fetch + metadata
│       ├── SalonPageClient.tsx # Client Component — full luxury UI
│       └── not-found.tsx       # 404 for unknown slugs
├── components/
│   └── InstagramGrid.tsx       # Conditional IG feed grid
├── lib/
│   ├── csvFetcher.ts           # CSV parser + salon fetcher
│   └── i18n.tsx                # SK/EN translation context + hook
├── .env.example                # Environment variable template
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install next react react-dom
npm install -D typescript @types/react @types/node tailwindcss postcss autoprefixer

# 2. Copy environment template
cp .env.example .env.local

# 3. Edit .env.local — paste your Google Sheets CSV URL
SALON_CSV_URL=https://docs.google.com/spreadsheets/d/YOUR_ID/export?format=csv&gid=0

# 4. Run dev server
npm run dev
# → Visit http://localhost:3000/your-salon-slug
```

---

## Google Sheets Setup

### 1 — Sheet columns (order-independent, case-insensitive)

| Column   | Required | Notes                                |
|----------|----------|--------------------------------------|
| `slug`   | ✅       | URL path: `your-domain.com/slug`     |
| `name`   | ✅       | Display name of the salon            |
| `phone`  | optional | Fallback: `+421 952 049 119`         |
| `address`| optional | Fallback: `Slovakia, Bratislava`     |
| `ig_url` | optional | Full Instagram URL. Empty = no grid  |

### 2 — Publish as CSV

1. Open the sheet → **File → Share → Publish to web**
2. Select the correct sheet tab
3. Change format to **Comma-separated values (.csv)**
4. Click **Publish** and copy the URL
5. Paste it as `SALON_CSV_URL` in your `.env.local` / Vercel settings

---

## i18n Usage

Any Client Component can access translations:

```tsx
import { useTranslation } from "@/lib/i18n";

export function MyComponent() {
  const { t, locale, toggle } = useTranslation();
  return <h1>{t.services_title}</h1>;
}
```

To add a new key, add it to the `Translations` interface **and** both dictionaries in `lib/i18n.tsx`.

---

## Adding a New Salon

Just add a new row in the Google Sheet with a unique `slug`. No code changes, no redeploy needed — the page is fetched live with `cache: 'no-store'`.

---

## Vercel Deployment

```bash
# Link project
vercel link

# Set environment variables
vercel env add SALON_CSV_URL
vercel env add NEXT_PUBLIC_BASE_URL

# Deploy
vercel --prod
```

---

## Design System

| Token         | Value         | Usage                     |
|---------------|---------------|---------------------------|
| `--bg`        | `#0a0a0a`     | Page background           |
| `--gold`      | `#c9a96e`     | Accent / CTAs             |
| `--font-serif`| Playfair Display | Headings               |
| `--font-display`| Cormorant   | Hero subtitle (italic)    |
| `--font-sans` | DM Sans       | Body / UI                 |

---

## Connecting a Real Instagram Feed

Replace the Unsplash placeholders in `InstagramGrid.tsx` with real IG media:

1. Obtain an [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api) token per shop.
2. Store the token in the CSV (add a `ig_token` column) or in an environment variable.
3. Call `https://graph.instagram.com/me/media?fields=id,media_url,permalink&access_token=TOKEN` and map the response into the grid.

---

*Built with ❤️ by Dunajmedia*
