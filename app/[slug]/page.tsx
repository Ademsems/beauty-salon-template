/**
 * app/[slug]/page.tsx
 * ─────────────────────────────────────────────────────────────
 * Dynamic multi-tenant luxury salon page for Dunajmedia.
 *
 * Fallback behaviour (no CSV needed to see the template):
 *   • No SALON_CSV_URL set      → renders FALLBACK_SALON
 *   • CSV unreachable / error   → renders FALLBACK_SALON
 *   • Slug not found in sheet   → renders FALLBACK_SALON with that slug
 *
 * The page NEVER crashes or shows a blank screen.
 * ─────────────────────────────────────────────────────────────
 */

import { Metadata } from "next";
import { fetchSalonBySlug, fetchAllSalons } from "@/lib/csvFetcher";
import SalonPageClient from "./SalonPageClient";

const CSV_URL = process.env.SALON_CSV_URL ?? "";

// Always serve dynamic slugs at request time — never block them
// even when generateStaticParams returns an empty array (no CSV yet).
export const dynamicParams = true;

interface PageProps {
  params: { slug: string };
}

// ── Static params — pre-render known slugs at build time ──────
export async function generateStaticParams() {
  const salons = await fetchAllSalons(CSV_URL);
  return salons.map((s) => ({ slug: s.slug }));
}

// ── Per-salon SEO metadata ────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const salon = await fetchSalonBySlug(CSV_URL, params.slug);
  return {
    title:       `${salon.name} | Luxury Beauty & Nail Salon`,
    description: `Rezervujte si termín v ${salon.name}. Luxusná starostlivosť o nechty a krásu. ${salon.address}`,
    openGraph: {
      title:       `${salon.name} | Luxury Beauty`,
      description: `Luxusná starostlivosť o nechty a krásu – ${salon.address}`,
      type:        "website",
      locale:      "sk_SK",
    },
  };
}

// ── Page ──────────────────────────────────────────────────────
export default async function SalonPage({ params }: PageProps) {
  // Always resolves — falls back to FALLBACK_SALON when CSV is
  // unavailable so you can see the full template immediately.
  const salon = await fetchSalonBySlug(CSV_URL, params.slug);
  return <SalonPageClient salon={salon} />;
}
