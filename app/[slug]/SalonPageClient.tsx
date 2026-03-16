"use client";

/**
 * app/[slug]/SalonPageClient.tsx
 * ─────────────────────────────────────────────────────────────
 * Upgraded luxury salon page:
 *   • Cinematic video hero  (public/hero.mp4, lazy on mobile)
 *   • Multi-step booking modal (BookingModal.tsx)
 *   • Lookbook gallery with lightbox (GallerySection.tsx)
 *   • Scroll-reveal animations on all sections (ScrollReveal.tsx)
 *   • All data dynamic from CSV (name, phone, address, ig_url)
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import dynamic from "next/dynamic";
import { I18nProvider, useTranslation } from "@/lib/i18n";
import type { SalonData } from "@/lib/csvFetcher";
import BookingModal, { type BookingService } from "@/components/BookingModal";
import ScrollReveal from "@/components/ScrollReveal";

const InstagramGrid  = dynamic(() => import("@/components/InstagramGrid"),  { ssr: false });
const GallerySection = dynamic(() => import("@/components/GallerySection"), { ssr: false });

interface Props { salon: SalonData }

// ── Service catalogue ─────────────────────────────────────────
const SERVICE_KEYS = [
  { key: "svc_manicure",       price: 25 },
  { key: "svc_manicure_gel",   price: 40 },
  { key: "svc_pedicure",       price: 35 },
  { key: "svc_pedicure_spa",   price: 55 },
  { key: "svc_nail_design",    price: 15 },
  { key: "svc_nail_extension", price: 65 },
  { key: "svc_eyebrows",       price: 20 },
  { key: "svc_lashes",         price: 50 },
  { key: "svc_facial",         price: 70 },
] as const;

// ── Root wrapper (provides i18n context) ──────────────────────
export default function SalonPageClient({ salon }: Props) {
  return (
    <I18nProvider defaultLocale="sk">
      <SalonInner salon={salon} />
    </I18nProvider>
  );
}

// ── Inner page (consumes i18n context) ────────────────────────
function SalonInner({ salon }: Props) {
  const { t, locale, setLocale } = useTranslation();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal  = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const services: BookingService[] = SERVICE_KEYS.map(s => ({
    label: (t as any)[s.key] as string,
    price: s.price,
  }));

  return (
    <>
      <GlobalStyles />

      <div className="salon-root">

        {/* ══ Navigation ═══════════════════════════════════════ */}
        <header className="salon-nav" role="banner">
          <div className="nav-inner">
            <a href="#" className="nav-brand" aria-label={salon.name}>
              <span className="nav-brand-name">{salon.name}</span>
              <span className="nav-brand-line" aria-hidden="true" />
            </a>

            <nav className="nav-links" aria-label="Main navigation">
              {[
                { label: t.nav_services, href: "#services" },
                { label: t.nav_gallery,  href: "#gallery"  },
                { label: locale === "sk" ? "Galéria" : "Lookbook", href: "#lookbook" },
                { label: t.nav_contact,  href: "#contact"  },
              ].map(({ label, href }) => (
                <a key={href} href={href} className="nav-link">{label}</a>
              ))}
            </nav>

            <div className="nav-actions">
              <button className="nav-book-btn" onClick={openModal}>{t.nav_booking}</button>

              <button
                className="locale-toggle"
                onClick={() => setLocale(locale === "sk" ? "en" : "sk")}
                aria-label="Toggle language"
              >
                <span className={locale === "sk" ? "locale-active" : ""}>SK</span>
                <span className="locale-divider">|</span>
                <span className={locale === "en" ? "locale-active" : ""}>EN</span>
              </button>

              <button
                className="hamburger"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(o => !o)}
              >
                <span className={`ham-bar ${menuOpen ? "ham-open" : ""}`} />
                <span className={`ham-bar ${menuOpen ? "ham-open" : ""}`} />
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav className="mobile-drawer" aria-label="Mobile navigation">
              {[
                { label: t.nav_services, href: "#services" },
                { label: t.nav_gallery,  href: "#gallery"  },
                { label: locale === "sk" ? "Galéria" : "Lookbook", href: "#lookbook" },
                { label: t.nav_contact,  href: "#contact"  },
              ].map(({ label, href }) => (
                <a key={href} href={href} className="mobile-link"
                  onClick={() => setMenuOpen(false)}>{label}</a>
              ))}
              <button className="mobile-book-btn"
                onClick={() => { setMenuOpen(false); openModal(); }}>
                {t.hero_cta}
              </button>
            </nav>
          )}
        </header>

        {/* ══ Hero — Cinematic Video ════════════════════════════ */}
        <section className="hero" id="hero" aria-label="Hero">
          <div className="hero-video-wrap" aria-hidden="true">
            {/* hero.mp4 must be placed in /public/hero.mp4 in your repo.
                A static image fallback is set as the CSS background on
                .hero-video-wrap so the section is never blank. */}
            <video
              className="hero-video"
              src="/hero.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/hero-poster.jpg"
              onError={e => {
                (e.currentTarget as HTMLVideoElement).style.display = "none";
              }}
            />
            <div className="hero-overlay" />
            <div className="hero-grain"   />
          </div>

          <div className="hero-content">
            <p className="hero-eyebrow">— Dunajmedia</p>
            <h1 className="hero-title">{salon.name}</h1>
            <p className="hero-subtitle">{t.hero_subtitle}</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={openModal}>{t.hero_cta}</button>
              <a href={`tel:${salon.phone.replace(/\s/g, "")}`} className="btn-ghost">
                {salon.phone}
              </a>
            </div>
          </div>

          <div className="hero-scroll-line" aria-hidden="true" />
        </section>

        {/* ══ Services ════════════════════════════════════════ */}
        <section className="services-section" id="services" aria-labelledby="services-title">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-eyebrow">Menu</span>
              <h2 className="section-title" id="services-title">{t.services_title}</h2>
              <p className="section-subtitle">{t.services_subtitle}</p>
            </div>
          </ScrollReveal>

          <div className="services-grid">
            {services.map(({ label, price }, i) => (
              <ScrollReveal key={i} delay={i * 0.045}>
                <article className="service-card">
                  <div className="service-num">0{i + 1}</div>
                  <div className="service-body">
                    <h3 className="service-name">{label}</h3>
                    <div className="service-dots" aria-hidden="true" />
                    <span className="service-price">{price}{t.currency}</span>
                  </div>
                  <button
                    className="service-book-btn"
                    onClick={openModal}
                    aria-label={`${locale === "sk" ? "Rezervovať" : "Book"} ${label}`}
                  >
                    {locale === "sk" ? "Rezervovať" : "Book"}
                  </button>
                  <div className="service-hover-line" aria-hidden="true" />
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ══ Lookbook Gallery ════════════════════════════════ */}
        <div id="lookbook">
          <ScrollReveal>
            <GallerySection />
          </ScrollReveal>
        </div>

        {/* ══ Instagram Grid (conditional on ig_url) ══════════ */}
        {salon.ig_url && (
          <ScrollReveal>
            <InstagramGrid ig_url={salon.ig_url} shopName={salon.name} />
          </ScrollReveal>
        )}

        {/* ══ CTA Band ════════════════════════════════════════ */}
        <section className="cta-band" id="contact" aria-label="Book appointment">
          <ScrollReveal>
            <div className="cta-band-inner">
              <div className="cta-band-text">
                <h2 className="cta-band-title">{t.booking_title}</h2>
                <p className="cta-band-sub">{salon.address}</p>
              </div>
              <div className="cta-band-actions">
                <button className="btn-primary" onClick={openModal}>{t.hero_cta}</button>
                <a href={`tel:${salon.phone.replace(/\s/g, "")}`} className="btn-ghost">
                  {salon.phone}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ══ Footer ══════════════════════════════════════════ */}
        <footer className="salon-footer" role="contentinfo">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="footer-name">{salon.name}</span>
              <p className="footer-address">{salon.address}</p>
              <a href={`tel:${salon.phone.replace(/\s/g, "")}`} className="footer-phone">
                {salon.phone}
              </a>
            </div>
            {salon.ig_url && (
              <a href={salon.ig_url} target="_blank" rel="noopener noreferrer"
                className="footer-ig" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            )}
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {salon.name}. {t.footer_rights}.</span>
            <span>{t.footer_powered}</span>
          </div>
        </footer>
      </div>

      {/* ══ Booking Modal ════════════════════════════════════ */}
      <BookingModal
        isOpen={modalOpen}
        onClose={closeModal}
        salonName={salon.name}
        services={services}
      />
    </>
  );
}

// ── Global styles ─────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style global>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

      :root {
        --bg:             #0a0a0a;
        --bg-alt:         #111111;
        --bg-card:        #141414;
        --gold:           #c9a96e;
        --gold-light:     #dfc08a;
        --gold-muted:     rgba(201,169,110,0.15);
        --text-primary:   #f0ede8;
        --text-secondary: #9a9590;
        --text-muted:     #5a5550;
        --border:         rgba(201,169,110,0.18);
        --border-light:   rgba(255,255,255,0.06);
        --font-serif:     'Playfair Display', 'Georgia', serif;
        --font-display:   'Cormorant', 'Georgia', serif;
        --font-sans:      'DM Sans', 'system-ui', sans-serif;
        --radius:         2px;
        --transition:     0.3s cubic-bezier(0.25,0.46,0.45,0.94);
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body {
        background: var(--bg); color: var(--text-primary);
        font-family: var(--font-sans); font-size: 16px; line-height: 1.65;
        -webkit-font-smoothing: antialiased;
      }
      :focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

      /* ── Shared ── */
      .section-header { text-align: center; margin-bottom: 3.5rem; }
      .section-eyebrow {
        display: block; font-family: var(--font-sans); font-size: 0.6875rem;
        font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase;
        color: var(--gold); margin-bottom: 1rem;
      }
      .section-title {
        font-family: var(--font-serif);
        font-size: clamp(2rem, 5vw, 3.25rem); font-weight: 400;
        letter-spacing: -0.01em; line-height: 1.12;
        color: var(--text-primary); margin-bottom: 0.875rem;
      }
      .section-subtitle {
        font-family: var(--font-sans); font-size: 0.9375rem;
        color: var(--text-secondary); font-weight: 300;
      }

      /* ── Buttons ── */
      .btn-primary {
        display: inline-block; padding: 0.875rem 2.25rem;
        background: var(--gold); color: #0a0a0a;
        font-family: var(--font-sans); font-size: 0.75rem; font-weight: 500;
        letter-spacing: 0.14em; text-transform: uppercase;
        text-decoration: none; border: 1px solid var(--gold);
        transition: background var(--transition), color var(--transition), transform 0.2s;
        cursor: pointer;
      }
      .btn-primary:hover { background: transparent; color: var(--gold); transform: translateY(-1px); }

      .btn-ghost {
        display: inline-block; padding: 0.875rem 2.25rem;
        background: transparent; color: var(--text-primary);
        font-family: var(--font-sans); font-size: 0.75rem; font-weight: 400;
        letter-spacing: 0.14em; text-transform: uppercase;
        text-decoration: none; border: 1px solid var(--border-light);
        transition: border-color var(--transition), color var(--transition);
      }
      .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

      /* ══ NAV ════════════════════════════════════════════ */
      .salon-nav {
        position: fixed; top: 0; left: 0; right: 0; z-index: 100;
        background: rgba(10,10,10,0.9);
        backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--border-light);
      }
      .nav-inner {
        max-width: 1200px; margin: 0 auto; padding: 0 2rem;
        height: 72px; display: flex; align-items: center; gap: 2rem;
      }
      .nav-brand { text-decoration: none; flex-shrink: 0; }
      .nav-brand-name {
        display: block; font-family: var(--font-serif); font-size: 1.125rem;
        font-weight: 400; color: var(--text-primary); letter-spacing: 0.04em;
      }
      .nav-brand-line {
        display: block; width: 100%; height: 1px; background: var(--gold);
        margin-top: 3px; transform-origin: left; transition: transform 0.35s ease;
      }
      .nav-brand:hover .nav-brand-line { transform: scaleX(0); }
      .nav-links { display: flex; gap: 2.25rem; margin-left: auto; }
      .nav-link {
        font-family: var(--font-sans); font-size: 0.6875rem; font-weight: 400;
        letter-spacing: 0.16em; text-transform: uppercase;
        color: var(--text-secondary); text-decoration: none;
        transition: color var(--transition); position: relative; padding-bottom: 2px;
      }
      .nav-link::after {
        content: ''; position: absolute; bottom: 0; left: 0; right: 0;
        height: 1px; background: var(--gold);
        transform: scaleX(0); transform-origin: right; transition: transform 0.3s ease;
      }
      .nav-link:hover { color: var(--gold); }
      .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }
      .nav-actions { display: flex; align-items: center; gap: 1.25rem; margin-left: 1.5rem; }
      .nav-book-btn {
        padding: 0.5rem 1.25rem;
        background: var(--gold); border: 1px solid var(--gold); color: #0a0a0a;
        font-family: var(--font-sans); font-size: 0.625rem; font-weight: 500;
        letter-spacing: 0.14em; text-transform: uppercase;
        cursor: pointer; transition: all 0.2s; display: none;
      }
      .nav-book-btn:hover { background: transparent; color: var(--gold); }
      @media (min-width: 900px) { .nav-book-btn { display: block; } }
      .locale-toggle {
        background: none; border: none; cursor: pointer;
        font-family: var(--font-sans); font-size: 0.625rem; font-weight: 500;
        letter-spacing: 0.18em; color: var(--text-muted);
        display: flex; align-items: center; gap: 0.375rem;
      }
      .locale-active { color: var(--gold); }
      .locale-divider { color: var(--text-muted); }
      .hamburger {
        display: none; flex-direction: column; gap: 5px;
        background: none; border: none; cursor: pointer; padding: 4px;
      }
      .ham-bar {
        display: block; width: 22px; height: 1px; background: var(--text-secondary);
        transition: transform 0.3s ease;
      }
      .ham-bar.ham-open:first-child  { transform: translateY(6px) rotate(45deg); }
      .ham-bar.ham-open:last-child   { transform: translateY(-6px) rotate(-45deg); }
      .mobile-drawer {
        display: flex; flex-direction: column;
        background: #0d0d0d; border-top: 1px solid var(--border-light);
        padding: 1.25rem 2rem 1.5rem; gap: 0.25rem;
      }
      .mobile-link {
        font-family: var(--font-sans); font-size: 0.6875rem;
        letter-spacing: 0.16em; text-transform: uppercase;
        color: var(--text-secondary); text-decoration: none;
        padding: 0.75rem 0; border-bottom: 1px solid var(--border-light);
        transition: color var(--transition);
      }
      .mobile-link:last-of-type { border-bottom: none; }
      .mobile-link:hover { color: var(--gold); }
      .mobile-book-btn {
        margin-top: 0.75rem; padding: 0.75rem;
        background: var(--gold); border: none; color: #0a0a0a;
        font-family: var(--font-sans); font-size: 0.625rem; font-weight: 500;
        letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer;
      }
      @media (max-width: 768px) { .nav-links { display: none; } .hamburger { display: flex; } }

      /* ══ HERO VIDEO ══════════════════════════════════════ */
      .hero {
        position: relative; min-height: 100svh;
        display: flex; align-items: center; justify-content: center;
        overflow: hidden; padding-top: 72px;
      }
      .hero-video-wrap {
        position: absolute; inset: 0;
        background: #0a0a0a
          url('https://images.unsplash.com/photo-1604655036151-f0a73e8dde98?w=1600&q=80&auto=format&fit=crop')
          center 30% / cover no-repeat;
      }
      .hero-video {
        position: absolute; inset: 0;
        width: 100%; height: 100%; object-fit: cover; object-position: center;
      }
      .hero-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(165deg,rgba(10,10,10,0.82) 0%,rgba(10,10,10,0.55) 40%,rgba(10,10,10,0.85) 100%);
      }
      .hero-grain {
        position: absolute; inset: 0; opacity: 0.03;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size: 200px;
      }
      .hero-content {
        position: relative; z-index: 2;
        text-align: center; padding: 2rem; max-width: 760px;
        animation: heroReveal 1.2s cubic-bezier(0.22,1,0.36,1) both;
      }
      @keyframes heroReveal {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .hero-eyebrow {
        font-family: var(--font-sans); font-size: 0.6875rem;
        letter-spacing: 0.3em; text-transform: uppercase;
        color: var(--gold); margin-bottom: 1.5rem;
      }
      .hero-title {
        font-family: var(--font-serif);
        font-size: clamp(2.75rem, 8vw, 6rem); font-weight: 400;
        line-height: 1.04; letter-spacing: -0.02em;
        color: var(--text-primary); margin-bottom: 1.25rem;
      }
      .hero-subtitle {
        font-family: var(--font-display); font-size: clamp(1rem, 2.5vw, 1.375rem);
        font-weight: 300; color: var(--text-secondary);
        font-style: italic; letter-spacing: 0.06em; margin-bottom: 2.75rem;
      }
      .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
      .hero-scroll-line {
        position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
        width: 1px; height: 80px;
        background: linear-gradient(to bottom, transparent, var(--gold));
        animation: scrollLine 2s ease 1.5s both;
      }
      @keyframes scrollLine {
        from { opacity: 0; height: 0; }
        to   { opacity: 1; height: 80px; }
      }

      /* ══ SERVICES ════════════════════════════════════════ */
      .services-section {
        padding: 7rem 1.5rem; background: var(--bg);
        max-width: 1000px; margin: 0 auto;
      }
      .services-grid { display: flex; flex-direction: column; }
      .service-card {
        position: relative; display: flex; align-items: center; gap: 1.5rem;
        padding: 1.375rem 0; border-bottom: 1px solid var(--border-light);
        overflow: hidden; transition: padding-left var(--transition);
      }
      .service-card:first-child { border-top: 1px solid var(--border-light); }
      .service-card:hover { padding-left: 0.75rem; }
      .service-hover-line {
        position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
        background: var(--gold); transform: scaleY(0); transform-origin: bottom;
        transition: transform 0.3s ease;
      }
      .service-card:hover .service-hover-line { transform: scaleY(1); }
      .service-num {
        font-family: var(--font-sans); font-size: 0.625rem;
        color: var(--gold); letter-spacing: 0.1em; min-width: 2rem; opacity: 0.7;
      }
      .service-body { flex: 1; display: flex; align-items: baseline; gap: 0.75rem; }
      .service-name {
        font-family: var(--font-serif);
        font-size: clamp(1rem, 2vw, 1.1875rem); font-weight: 400;
        color: var(--text-primary); transition: color var(--transition);
      }
      .service-card:hover .service-name { color: var(--gold-light); }
      .service-dots {
        flex: 1; border-bottom: 1px dotted var(--text-muted);
        margin-bottom: 5px; min-width: 20px;
      }
      .service-price {
        font-family: var(--font-sans); font-size: 0.9375rem;
        font-weight: 300; color: var(--gold); white-space: nowrap; letter-spacing: 0.04em;
      }
      .service-book-btn {
        flex-shrink: 0; padding: 0.375rem 0.875rem;
        background: none; border: 1px solid rgba(201,169,110,0.25);
        font-family: var(--font-sans); font-size: 0.5875rem;
        letter-spacing: 0.14em; text-transform: uppercase;
        color: var(--text-muted); cursor: pointer; transition: all 0.2s;
        opacity: 0;
      }
      .service-card:hover .service-book-btn { opacity: 1; }
      .service-book-btn:hover { border-color: var(--gold); color: var(--gold); }

      /* ══ CTA BAND ════════════════════════════════════════ */
      .cta-band {
        padding: 6rem 1.5rem; background: var(--bg-alt);
        position: relative; overflow: hidden;
      }
      .cta-band::before {
        content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
      }
      .cta-band::after {
        content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent);
      }
      .cta-band-inner {
        max-width: 1000px; margin: 0 auto;
        display: flex; align-items: center; justify-content: space-between;
        gap: 3rem; flex-wrap: wrap;
      }
      .cta-band-title {
        font-family: var(--font-serif);
        font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 400;
        color: var(--text-primary); margin-bottom: 0.5rem;
      }
      .cta-band-sub {
        font-family: var(--font-sans); font-size: 0.875rem; color: var(--text-muted);
      }
      .cta-band-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

      /* ══ FOOTER ══════════════════════════════════════════ */
      .salon-footer {
        background: #060606; padding: 4rem 1.5rem 2rem;
        border-top: 1px solid var(--border-light);
      }
      .footer-inner {
        max-width: 1100px; margin: 0 auto;
        display: flex; justify-content: space-between; align-items: flex-start;
        gap: 2rem; padding-bottom: 3rem; border-bottom: 1px solid var(--border-light);
      }
      .footer-brand { display: flex; flex-direction: column; gap: 0.375rem; }
      .footer-name {
        font-family: var(--font-serif); font-size: 1.375rem;
        font-weight: 400; color: var(--text-primary);
      }
      .footer-address { font-family: var(--font-sans); font-size: 0.8125rem; color: var(--text-muted); }
      .footer-phone {
        font-family: var(--font-sans); font-size: 0.8125rem;
        color: var(--text-muted); text-decoration: none; transition: color var(--transition);
      }
      .footer-phone:hover { color: var(--gold); }
      .footer-ig { color: var(--text-muted); transition: color var(--transition); }
      .footer-ig:hover { color: var(--gold); }
      .footer-bottom {
        max-width: 1100px; margin: 1.5rem auto 0;
        display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
        font-family: var(--font-sans); font-size: 0.6875rem;
        color: var(--text-muted); letter-spacing: 0.06em;
      }

      .salon-root { min-height: 100vh; background: var(--bg); }
    `}</style>
  );
}
