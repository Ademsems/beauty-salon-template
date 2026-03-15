"use client";

/**
 * components/InstagramGrid.tsx
 * ─────────────────────────────────────────────────────────────
 * Renders a 6-tile Instagram-style grid with a shimmer/reveal
 * animation. Only mounted when `ig_url` is non-empty.
 *
 * Tiles use curated Unsplash photos (nail/beauty keyword) so
 * the placeholder feels realistic.  Swap `PLACEHOLDER_IMAGES`
 * with real API images when an IG Basic Display token is ready.
 * ─────────────────────────────────────────────────────────────
 */

import { useTranslation } from "@/lib/i18n";
import Image from "next/image";
import { useState } from "react";

// ── Placeholder images (Unsplash – nails / beauty) ───────────
const PLACEHOLDER_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    alt: "Luxury nail design",
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    alt: "Gel manicure closeup",
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    alt: "Nail art detail",
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    alt: "French manicure",
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    alt: "Spa pedicure",
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    alt: "Beauty studio",
  },
];

// Each tile gets a unique Unsplash query so they look different
const UNSPLASH_QUERIES = [
  "luxury+nail+design",
  "gel+manicure",
  "nail+art+gold",
  "french+manicure",
  "spa+pedicure",
  "beauty+salon+nails",
];

function getUnsplashUrl(query: string, seed: number) {
  return `https://images.unsplash.com/photo-${1604654894610 + seed * 13}?w=600&q=80&auto=format&fit=crop`;
}

// ── Component ─────────────────────────────────────────────────
interface InstagramGridProps {
  ig_url: string;
  shopName: string;
}

export default function InstagramGrid({ ig_url, shopName }: InstagramGridProps) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<number | null>(null);

  // Conditional render — do not mount if ig_url is blank
  if (!ig_url.trim()) return null;

  return (
    <section
      id="gallery"
      className="instagram-section"
      aria-label="Instagram gallery"
    >
      {/* ── Section header ── */}
      <div className="section-header">
        <span className="section-eyebrow">@{extractHandle(ig_url)}</span>
        <h2 className="section-title">{t.ig_title}</h2>
        <p className="section-subtitle">{t.ig_subtitle}</p>
      </div>

      {/* ── Grid ── */}
      <div className="ig-grid" role="list">
        {Array.from({ length: 6 }).map((_, i) => (
          <a
            key={i}
            href={ig_url}
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
            className={`ig-tile ${hovered === i ? "ig-tile--hovered" : ""}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            aria-label={`${shopName} Instagram photo ${i + 1}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="ig-tile-inner">
              {/* Real image via next/image for perf */}
              <Image
                src={`https://images.unsplash.com/photo-${
                  [
                    "1604654894610",
                    "1604655036151",
                    "1604655036150",
                    "1604655036152",
                    "1517163888",
                    "1519014816548",
                  ][i]
                }?w=600&q=80&auto=format&fit=crop`}
                alt={`${shopName} – Instagram photo ${i + 1}`}
                fill
                className="ig-tile-img"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 300px"
                onError={(e) => {
                  // Graceful fallback on broken image
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />

              {/* Hover overlay */}
              <div className="ig-tile-overlay" aria-hidden="true">
                <svg
                  className="ig-tile-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="ig-cta-wrapper">
        <a
          href={ig_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ig-cta-btn"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="ig-cta-icon"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
          {t.ig_cta}
        </a>
      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        .instagram-section {
          padding: 6rem 1.5rem;
          background: #0d0d0d;
          text-align: center;
        }

        .ig-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          max-width: 900px;
          margin: 3rem auto;
        }

        @media (min-width: 640px) {
          .ig-grid {
            gap: 8px;
          }
        }

        .ig-tile {
          position: relative;
          aspect-ratio: 1 / 1;
          display: block;
          overflow: hidden;
          background: #1a1a1a;
          opacity: 0;
          animation: tileReveal 0.6s ease forwards;
          cursor: pointer;
        }

        @keyframes tileReveal {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }

        .ig-tile-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .ig-tile-img {
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .ig-tile:hover .ig-tile-img {
          transform: scale(1.06);
        }

        .ig-tile-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 10, 10, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .ig-tile:hover .ig-tile-overlay {
          opacity: 1;
        }

        .ig-tile-icon {
          width: 2rem;
          height: 2rem;
          color: #c9a96e;
        }

        .ig-cta-wrapper {
          margin-top: 2.5rem;
        }

        .ig-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.875rem 2rem;
          border: 1px solid #c9a96e;
          color: #c9a96e;
          font-family: var(--font-sans, sans-serif);
          font-size: 0.8125rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.25s ease, color 0.25s ease;
        }

        .ig-cta-btn:hover {
          background: #c9a96e;
          color: #0d0d0d;
        }

        .ig-cta-icon {
          width: 1.125rem;
          height: 1.125rem;
        }
      `}</style>
    </section>
  );
}

// ── Helpers ───────────────────────────────────────────────────
function extractHandle(url: string): string {
  try {
    const path = new URL(url).pathname;
    const parts = path.split("/").filter(Boolean);
    return parts[0] ?? "instagram";
  } catch {
    return url.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, "").split("/")[0] ?? "instagram";
  }
}
