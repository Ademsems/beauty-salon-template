"use client";

/**
 * components/GallerySection.tsx
 * ─────────────────────────────────────────────────────────────
 * High-fashion lookbook gallery.
 * • CSS-columns masonry (no external library)
 * • Click any image → full-screen lightbox with prev/next
 * • Framer-motion for lightbox entrance/exit
 * • Keyboard navigation (Escape, ← →)
 * • Replace GALLERY_IMAGES srcs with real studio photos
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";

// ── Gallery image data ────────────────────────────────────────
// Images live in /public/gallery/ in your repo.
// Rename your files to match, or change the src values below.
// span: 2 = tall tile, span: 1 = square tile.
const GALLERY_IMAGES = [
  { src: "/gallery/01.jpg", alt: "Nail design",     span: 2 },
  { src: "/gallery/02.jpg", alt: "Gel manicure",    span: 1 },
  { src: "/gallery/03.jpg", alt: "Beauty salon",    span: 1 },
  { src: "/gallery/04.jpg", alt: "Beauty care",     span: 2 },
  { src: "/gallery/05.jpg", alt: "Nail art",        span: 1 },
  { src: "/gallery/06.jpg", alt: "Nail extensions", span: 1 },
  { src: "/gallery/07.jpg", alt: "Pedicure",        span: 1 },
  { src: "/gallery/08.jpg", alt: "Nail colour",     span: 2 },
  { src: "/gallery/09.jpg", alt: "Luxury nails",    span: 1 },
];

// ── Component ─────────────────────────────────────────────────
export default function GallerySection() {
  const { locale } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isOpen = lightboxIndex !== null;

  const prev = useCallback(() => {
    setLightboxIndex(i => (i === null ? null : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length));
  }, []);

  const next = useCallback(() => {
    setLightboxIndex(i => (i === null ? null : (i + 1) % GALLERY_IMAGES.length));
  }, []);

  const close = useCallback(() => setLightboxIndex(null), []);

  // Keyboard nav
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")      close();
      if (e.key === "ArrowLeft")   prev();
      if (e.key === "ArrowRight")  next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, prev, next, close]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <section className="gallery-section" aria-label="Gallery">
      {/* Header */}
      <div className="section-header">
        <span className="section-eyebrow">
          {locale === "sk" ? "Lookbook" : "Lookbook"}
        </span>
        <h2 className="section-title">
          {locale === "sk" ? "Naša Práca" : "Our Work"}
        </h2>
        <p className="section-subtitle">
          {locale === "sk" ? "Každý detail, dokonalý" : "Every detail, perfected"}
        </p>
      </div>

      {/* Masonry grid */}
      <div className="gallery-masonry" role="list">
        {GALLERY_IMAGES.map((img, i) => (
          <button
            key={i}
            role="listitem"
            className={`gallery-item gallery-item--span${img.span}`}
            onClick={() => setLightboxIndex(i)}
            aria-label={`Open ${img.alt} in full screen`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="gallery-item-inner">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="gallery-img"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 360px"
                loading="lazy"
              />
              <div className="gallery-overlay" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7"/>
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {isOpen && lightboxIndex !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
              aria-hidden="true"
            />

            {/* Image container */}
            <motion.div
              className="lb-container"
              role="dialog"
              aria-modal="true"
              aria-label={GALLERY_IMAGES[lightboxIndex].alt}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  className="lb-img-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <Image
                    src={GALLERY_IMAGES[lightboxIndex].src}
                    alt={GALLERY_IMAGES[lightboxIndex].alt}
                    fill
                    className="lb-img"
                    sizes="100vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Counter */}
              <div className="lb-counter" aria-live="polite">
                {lightboxIndex + 1} / {GALLERY_IMAGES.length}
              </div>

              {/* Close */}
              <button className="lb-close" onClick={close} aria-label="Close lightbox">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>

              {/* Prev */}
              <button className="lb-nav lb-nav--prev" onClick={prev} aria-label="Previous image">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>

              {/* Next */}
              <button className="lb-nav lb-nav--next" onClick={next} aria-label="Next image">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Styles */}
      <style>{STYLES}</style>
    </section>
  );
}

const STYLES = `
  /* ── Section ── */
  .gallery-section {
    padding: 6rem 1.5rem;
    background: #0d0d0d;
    position: relative;
  }
  .gallery-section::before {
    content: '';
    position: absolute; top: -1px; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,169,110,0.25), transparent);
  }

  /* ── Masonry ── */
  .gallery-masonry {
    columns: 3;
    column-gap: 8px;
    max-width: 1100px;
    margin: 0 auto;
  }

  @media (max-width: 768px) { .gallery-masonry { columns: 2; } }
  @media (max-width: 480px) { .gallery-masonry { columns: 2; column-gap: 4px; } }

  .gallery-item {
    display: block;
    break-inside: avoid;
    margin-bottom: 8px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background: #1a1a1a;
    border: none; padding: 0;
    opacity: 0;
    animation: galleryReveal 0.55s ease forwards;
  }

  @media (max-width: 480px) { .gallery-item { margin-bottom: 4px; } }

  @keyframes galleryReveal {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Vary heights for masonry feel */
  .gallery-item--span1 .gallery-item-inner { padding-bottom: 100%; }
  .gallery-item--span2 .gallery-item-inner { padding-bottom: 140%; }

  .gallery-item-inner {
    position: relative; width: 100%; overflow: hidden;
  }

  .gallery-img {
    object-fit: cover;
    transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .gallery-item:hover .gallery-img { transform: scale(1.05); }

  .gallery-overlay {
    position: absolute; inset: 0;
    background: rgba(10,10,10,0.45);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s ease;
    color: #c9a96e;
  }

  .gallery-item:hover .gallery-overlay { opacity: 1; }

  /* ── Lightbox ── */
  .lb-backdrop {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.94);
    backdrop-filter: blur(4px);
  }

  .lb-container {
    position: fixed; z-index: 301;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: min(90vw, 900px);
    height: min(85vh, 700px);
  }

  .lb-img-wrap {
    position: absolute; inset: 0;
  }

  .lb-img { object-fit: contain; }

  .lb-counter {
    position: absolute; bottom: -2rem; left: 50%;
    transform: translateX(-50%);
    font-family: var(--font-sans);
    font-size: 0.625rem; letter-spacing: 0.2em;
    color: rgba(255,255,255,0.4);
  }

  .lb-close {
    position: absolute; top: -2.5rem; right: 0;
    background: none; border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.6); width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
  }
  .lb-close:hover { border-color: var(--gold); color: var(--gold); }

  .lb-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(10,10,10,0.6);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.7);
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
  }
  .lb-nav:hover { border-color: var(--gold); color: var(--gold); }
  .lb-nav--prev { left: -3.25rem; }
  .lb-nav--next { right: -3.25rem; }

  @media (max-width: 768px) {
    .lb-nav--prev { left: 0.5rem; }
    .lb-nav--next { right: 0.5rem; }
    .lb-container { width: 95vw; height: 70vh; }
  }
`;
