"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

// ── Gallery image data ────────────────────────────────────────
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

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <section className="gallery-section" aria-label="Gallery">
      <div className="section-header">
        <span className="section-eyebrow">Lookbook</span>
        <h2 className="section-title">
          {locale === "sk" ? "Naša Práca" : "Our Work"}
        </h2>
        <p className="section-subtitle">
          {locale === "sk" ? "Každý detail, dokonalý" : "Every detail, perfected"}
        </p>
      </div>

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
              {/* FIXED: Swapped Next/Image for standard <img> to work with Masonry columns */}
              <img
                src={img.src}
                alt={img.alt}
                className="gallery-img"
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

      <AnimatePresence>
        {isOpen && lightboxIndex !== null && (
          <>
            <motion.div
              className="lb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              className="lb-container"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="lb-img-wrap">
                {/* FIXED: Standard <img> for lightbox consistency */}
                <img
                  src={GALLERY_IMAGES[lightboxIndex].src}
                  alt={GALLERY_IMAGES[lightboxIndex].alt}
                  className="lb-img"
                />
              </div>

              <div className="lb-counter">
                {lightboxIndex + 1} / {GALLERY_IMAGES.length}
              </div>

              <button className="lb-close" onClick={close}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>

              <button className="lb-nav lb-nav--prev" onClick={prev}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>

              <button className="lb-nav lb-nav--next" onClick={next}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{STYLES}</style>
    </section>
  );
}

const STYLES = `
  .gallery-section { padding: 6rem 1.5rem; background: #0d0d0d; position: relative; }
  .section-header { text-align: center; margin-bottom: 4rem; }
  .section-eyebrow { color: #c9a96e; letter-spacing: 0.3em; text-transform: uppercase; font-size: 0.75rem; }
  .section-title { font-family: serif; font-size: 3rem; color: #fff; margin: 0.5rem 0; }
  .section-subtitle { color: #888; }

  .gallery-masonry {
    columns: 3;
    column-gap: 12px;
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: 768px) { .gallery-masonry { columns: 2; } }

  .gallery-item {
    display: block;
    width: 100%;
    break-inside: avoid;
    margin-bottom: 12px;
    border: none;
    padding: 0;
    background: #1a1a1a;
    overflow: hidden;
    cursor: pointer;
    opacity: 0;
    animation: galleryReveal 0.5s ease forwards;
  }

  @keyframes galleryReveal {
    to { opacity: 1; transform: translateY(0); }
  }

  .gallery-item-inner { position: relative; width: 100%; }

  /* FIXED: Ensure the raw img fills the masonry column width */
  .gallery-img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .gallery-item:hover .gallery-img { transform: scale(1.05); }

  .gallery-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s; color: #c9a96e;
  }
  .gallery-item:hover .gallery-overlay { opacity: 1; }

  .lb-backdrop { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.95); backdrop-filter: blur(8px); }
  .lb-container { position: fixed; inset: 0; z-index: 1001; display: flex; align-items: center; justify-content: center; padding: 40px; pointer-events: none; }
  .lb-img-wrap { pointer-events: auto; max-width: 100%; max-height: 100%; }
  .lb-img { max-width: 90vw; max-height: 80vh; object-fit: contain; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
  
  .lb-nav, .lb-close { pointer-events: auto; position: absolute; background: none; border: 1px solid rgba(255,255,255,0.2); color: #fff; cursor: pointer; transition: 0.3s; }
  .lb-nav:hover, .lb-close:hover { border-color: #c9a96e; color: #c9a96e; }
  
  .lb-close { top: 30px; right: 30px; padding: 10px; }
  .lb-nav { top: 50%; transform: translateY(-50%); padding: 15px; }
  .lb-nav--prev { left: 30px; }
  .lb-nav--next { right: 30px; }
  .lb-counter { position: absolute; bottom: 30px; color: #666; font-size: 0.8rem; }

  @media (max-width: 768px) {
    .lb-nav { display: none; }
  }
`;
