"use client";

/**
 * app/[slug]/SalonPageClient.tsx
 * ─────────────────────────────────────────────────────────────
 * Full luxury salon UI rendered client-side so i18n, animations,
 * and the booking form can be interactive.
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useRef, FormEvent } from "react";
import dynamic from "next/dynamic";
import { I18nProvider, useTranslation, Locale } from "@/lib/i18n";
import type { SalonData } from "@/lib/csvFetcher";

// Lazy-load the Instagram grid (only rendered when ig_url exists)
const InstagramGrid = dynamic(() => import("@/components/InstagramGrid"), {
  ssr: false,
});

interface Props {
  salon: SalonData;
}

// ── Service catalogue with prices ────────────────────────────
const SERVICES = [
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

// ── Wrapper (provides i18n context) ──────────────────────────
export default function SalonPageClient({ salon }: Props) {
  return (
    <I18nProvider defaultLocale="sk">
      <SalonInner salon={salon} />
    </I18nProvider>
  );
}

// ── Inner page (consumes i18n context) ───────────────────────
function SalonInner({ salon }: Props) {
  const { t, locale, setLocale } = useTranslation();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleBooking(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Connect to a form handler (e.g. Resend, Formspree, or a Supabase edge function)
    setSubmitted(true);
    formRef.current?.reset();
  }

  const serviceOptions = SERVICES.map((s) => ({
    label: (t as any)[s.key] as string,
    price: s.price,
  }));

  return (
    <>
      {/* ══ Global styles ════════════════════════════════════ */}
      <GlobalStyles shopName={salon.name} />

      <div className="salon-root">
        {/* ══ Navigation ═══════════════════════════════════════ */}
        <header className="salon-nav" role="banner">
          <div className="nav-inner">
            {/* Logo / Brand */}
            <a href="#" className="nav-brand" aria-label={salon.name}>
              <span className="nav-brand-name">{salon.name}</span>
              <span className="nav-brand-line" aria-hidden="true" />
            </a>

            {/* Desktop links */}
            <nav className="nav-links" aria-label="Main navigation">
              {[
                { label: t.nav_services, href: "#services" },
                { label: t.nav_gallery,  href: "#gallery"  },
                { label: t.nav_booking,  href: "#booking"  },
                { label: t.nav_contact,  href: "#contact"  },
              ].map(({ label, href }) => (
                <a key={href} href={href} className="nav-link">
                  {label}
                </a>
              ))}
            </nav>

            {/* Right: locale toggle + hamburger */}
            <div className="nav-actions">
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
                onClick={() => setMenuOpen((o) => !o)}
              >
                <span className={`ham-bar ${menuOpen ? "ham-open" : ""}`} />
                <span className={`ham-bar ${menuOpen ? "ham-open" : ""}`} />
              </button>
            </div>
          </div>

          {/* Mobile drawer */}
          {menuOpen && (
            <nav className="mobile-drawer" aria-label="Mobile navigation">
              {[
                { label: t.nav_services, href: "#services" },
                { label: t.nav_gallery,  href: "#gallery"  },
                { label: t.nav_booking,  href: "#booking"  },
                { label: t.nav_contact,  href: "#contact"  },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
            </nav>
          )}
        </header>

        {/* ══ Hero ═════════════════════════════════════════════ */}
        <section className="hero" id="hero" aria-label="Hero">
          {/* Background layers */}
          <div className="hero-bg" aria-hidden="true">
            <div className="hero-overlay" />
            <div className="hero-grain" />
          </div>

          <div className="hero-content">
            <p className="hero-eyebrow" aria-hidden="true">— Dunajmedia</p>
            <h1 className="hero-title">{salon.name}</h1>
            <p className="hero-subtitle">{t.hero_subtitle}</p>

            <div className="hero-actions">
              <a href="#booking" className="btn-primary">
                {t.hero_cta}
              </a>
              <a href={`tel:${salon.phone.replace(/\s/g, "")}`} className="btn-ghost">
                {salon.phone}
              </a>
            </div>
          </div>

          {/* Decorative gold line */}
          <div className="hero-scroll-line" aria-hidden="true" />
        </section>

        {/* ══ Services ════════════════════════════════════════ */}
        <section className="services-section" id="services" aria-labelledby="services-title">
          <div className="section-header">
            <span className="section-eyebrow">Menu</span>
            <h2 className="section-title" id="services-title">{t.services_title}</h2>
            <p className="section-subtitle">{t.services_subtitle}</p>
          </div>

          <div className="services-grid">
            {serviceOptions.map(({ label, price }, i) => (
              <article
                key={i}
                className="service-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="service-num">0{i + 1}</div>
                <div className="service-body">
                  <h3 className="service-name">{label}</h3>
                  <div className="service-dots" aria-hidden="true" />
                  <span className="service-price">
                    {price}{t.currency}
                  </span>
                </div>
                <div className="service-hover-line" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        {/* ══ Instagram Grid (conditional) ════════════════════ */}
        {salon.ig_url && (
          <InstagramGrid ig_url={salon.ig_url} shopName={salon.name} />
        )}

        {/* ══ Booking Form ════════════════════════════════════ */}
        <section className="booking-section" id="booking" aria-labelledby="booking-title">
          <div className="booking-wrapper">
            <div className="booking-left">
              <span className="section-eyebrow">Online</span>
              <h2 className="section-title" id="booking-title">{t.booking_title}</h2>
              <p className="section-subtitle">{t.booking_subtitle}</p>

              <address className="booking-contact">
                <a href={`tel:${salon.phone.replace(/\s/g, "")}`} className="contact-link">
                  <PhoneIcon />
                  {salon.phone}
                </a>
                <span className="contact-link">
                  <PinIcon />
                  {salon.address}
                </span>
              </address>
            </div>

            <div className="booking-right">
              {submitted ? (
                <div className="booking-success" role="status">
                  <CheckIcon />
                  <p>
                    {locale === "sk"
                      ? "Ďakujeme! Ozveme sa vám čoskoro."
                      : "Thank you! We will contact you soon."}
                  </p>
                </div>
              ) : (
                <form
                  ref={formRef}
                  className="booking-form"
                  onSubmit={handleBooking}
                  noValidate
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="bf-name">
                        {t.booking_name}
                      </label>
                      <input
                        id="bf-name"
                        name="name"
                        type="text"
                        required
                        className="form-input"
                        placeholder={t.booking_placeholder_name}
                        autoComplete="name"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="bf-phone">
                        {t.booking_phone}
                      </label>
                      <input
                        id="bf-phone"
                        name="phone"
                        type="tel"
                        required
                        className="form-input"
                        placeholder={t.booking_placeholder_phone}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="bf-service">
                        {t.booking_service}
                      </label>
                      <select
                        id="bf-service"
                        name="service"
                        required
                        className="form-input form-select"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {t.booking_placeholder_service}
                        </option>
                        {serviceOptions.map(({ label, price }) => (
                          <option key={label} value={label}>
                            {label} — {price}{t.currency}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="bf-date">
                        {t.booking_date}
                      </label>
                      <input
                        id="bf-date"
                        name="date"
                        type="date"
                        required
                        className="form-input"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="bf-message">
                      {t.booking_message}
                    </label>
                    <textarea
                      id="bf-message"
                      name="message"
                      className="form-input form-textarea"
                      placeholder={t.booking_placeholder_message}
                      rows={3}
                    />
                  </div>

                  <button type="submit" className="btn-primary btn-full">
                    {t.booking_submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ══ Footer ══════════════════════════════════════════ */}
        <footer className="salon-footer" id="contact" role="contentinfo">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="footer-name">{salon.name}</span>
              <p className="footer-address">{salon.address}</p>
              <a
                href={`tel:${salon.phone.replace(/\s/g, "")}`}
                className="footer-phone"
              >
                {salon.phone}
              </a>
            </div>

            {salon.ig_url && (
              <a
                href={salon.ig_url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-ig"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
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
    </>
  );
}

// ── Global styles injected once ───────────────────────────────
function GlobalStyles({ shopName }: { shopName: string }) {
  return (
    <style global>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

      /* ── Design tokens ────────────────────────────────────── */
      :root {
        --bg:          #0a0a0a;
        --bg-alt:      #111111;
        --bg-card:     #141414;
        --gold:        #c9a96e;
        --gold-light:  #dfc08a;
        --gold-muted:  rgba(201,169,110,0.15);
        --text-primary:   #f0ede8;
        --text-secondary: #9a9590;
        --text-muted:     #5a5550;
        --border:      rgba(201,169,110,0.18);
        --border-light:rgba(255,255,255,0.06);
        --font-serif:  'Playfair Display', 'Georgia', serif;
        --font-display:'Cormorant', 'Georgia', serif;
        --font-sans:   'DM Sans', 'system-ui', sans-serif;
        --radius:      2px;
        --transition:  0.3s cubic-bezier(0.25,0.46,0.45,0.94);
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      html { scroll-behavior: smooth; }

      body {
        background: var(--bg);
        color: var(--text-primary);
        font-family: var(--font-sans);
        font-size: 16px;
        line-height: 1.65;
        -webkit-font-smoothing: antialiased;
      }

      /* ── Shared section patterns ────────────────────────── */
      .section-header {
        text-align: center;
        margin-bottom: 3.5rem;
      }

      .section-eyebrow {
        display: block;
        font-family: var(--font-sans);
        font-size: 0.6875rem;
        font-weight: 500;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 1rem;
      }

      .section-title {
        font-family: var(--font-serif);
        font-size: clamp(2rem, 5vw, 3.25rem);
        font-weight: 400;
        letter-spacing: -0.01em;
        line-height: 1.12;
        color: var(--text-primary);
        margin-bottom: 0.875rem;
      }

      .section-subtitle {
        font-family: var(--font-sans);
        font-size: 0.9375rem;
        color: var(--text-secondary);
        font-weight: 300;
      }

      /* ── Buttons ─────────────────────────────────────────── */
      .btn-primary {
        display: inline-block;
        padding: 0.875rem 2.25rem;
        background: var(--gold);
        color: #0a0a0a;
        font-family: var(--font-sans);
        font-size: 0.75rem;
        font-weight: 500;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        text-decoration: none;
        border: 1px solid var(--gold);
        transition: background var(--transition), color var(--transition), transform 0.2s ease;
        cursor: pointer;
      }

      .btn-primary:hover {
        background: transparent;
        color: var(--gold);
        transform: translateY(-1px);
      }

      .btn-ghost {
        display: inline-block;
        padding: 0.875rem 2.25rem;
        background: transparent;
        color: var(--text-primary);
        font-family: var(--font-sans);
        font-size: 0.75rem;
        font-weight: 400;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        text-decoration: none;
        border: 1px solid var(--border-light);
        transition: border-color var(--transition), color var(--transition);
      }

      .btn-ghost:hover {
        border-color: var(--gold);
        color: var(--gold);
      }

      .btn-full { width: 100%; text-align: center; }

      /* ══ NAVIGATION ══════════════════════════════════════════ */
      .salon-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        background: rgba(10,10,10,0.92);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border-light);
      }

      .nav-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        height: 72px;
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      .nav-brand {
        text-decoration: none;
        flex-shrink: 0;
      }

      .nav-brand-name {
        display: block;
        font-family: var(--font-serif);
        font-size: 1.125rem;
        font-weight: 400;
        color: var(--text-primary);
        letter-spacing: 0.04em;
      }

      .nav-brand-line {
        display: block;
        width: 100%;
        height: 1px;
        background: var(--gold);
        margin-top: 3px;
        transform-origin: left;
        transition: transform 0.35s ease;
      }

      .nav-brand:hover .nav-brand-line { transform: scaleX(0); }

      .nav-links {
        display: flex;
        gap: 2.25rem;
        margin-left: auto;
      }

      .nav-link {
        font-family: var(--font-sans);
        font-size: 0.6875rem;
        font-weight: 400;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--text-secondary);
        text-decoration: none;
        transition: color var(--transition);
        position: relative;
        padding-bottom: 2px;
      }

      .nav-link::after {
        content: '';
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 1px;
        background: var(--gold);
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s ease;
      }

      .nav-link:hover { color: var(--gold); }
      .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        margin-left: 2rem;
      }

      .locale-toggle {
        background: none;
        border: none;
        cursor: pointer;
        font-family: var(--font-sans);
        font-size: 0.625rem;
        font-weight: 500;
        letter-spacing: 0.18em;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }

      .locale-active { color: var(--gold); }
      .locale-divider { color: var(--text-muted); }

      .hamburger {
        display: none;
        flex-direction: column;
        gap: 5px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
      }

      .ham-bar {
        display: block;
        width: 22px;
        height: 1px;
        background: var(--text-secondary);
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      .ham-bar.ham-open:first-child { transform: translateY(6px) rotate(45deg); }
      .ham-bar.ham-open:last-child  { transform: translateY(-6px) rotate(-45deg); }

      .mobile-drawer {
        display: flex;
        flex-direction: column;
        background: #0d0d0d;
        border-top: 1px solid var(--border-light);
        padding: 1.25rem 2rem 1.5rem;
        gap: 0.25rem;
      }

      .mobile-link {
        font-family: var(--font-sans);
        font-size: 0.6875rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--text-secondary);
        text-decoration: none;
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--border-light);
        transition: color var(--transition);
      }

      .mobile-link:last-child { border-bottom: none; }
      .mobile-link:hover { color: var(--gold); }

      @media (max-width: 768px) {
        .nav-links { display: none; }
        .hamburger { display: flex; }
      }

      /* ══ HERO ════════════════════════════════════════════════ */
      .hero {
        position: relative;
        min-height: 100svh;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding-top: 72px;
      }

      .hero-bg {
        position: absolute;
        inset: 0;
        background-image: url('https://images.unsplash.com/photo-1604655036151-f0a73e8dde98?w=1600&q=85&auto=format&fit=crop');
        background-size: cover;
        background-position: center 30%;
      }

      .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          165deg,
          rgba(10,10,10,0.85) 0%,
          rgba(10,10,10,0.6) 40%,
          rgba(10,10,10,0.88) 100%
        );
      }

      .hero-grain {
        position: absolute;
        inset: 0;
        opacity: 0.035;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size: 200px;
      }

      .hero-content {
        position: relative;
        z-index: 2;
        text-align: center;
        padding: 2rem;
        max-width: 760px;
        animation: heroReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @keyframes heroReveal {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .hero-eyebrow {
        font-family: var(--font-sans);
        font-size: 0.6875rem;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 1.5rem;
        animation-delay: 0.1s;
      }

      .hero-title {
        font-family: var(--font-serif);
        font-size: clamp(2.75rem, 8vw, 6rem);
        font-weight: 400;
        line-height: 1.04;
        letter-spacing: -0.02em;
        color: var(--text-primary);
        margin-bottom: 1.25rem;
      }

      .hero-subtitle {
        font-family: var(--font-display);
        font-size: clamp(1rem, 2.5vw, 1.375rem);
        font-weight: 300;
        color: var(--text-secondary);
        font-style: italic;
        letter-spacing: 0.06em;
        margin-bottom: 2.75rem;
      }

      .hero-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .hero-scroll-line {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 1px;
        height: 80px;
        background: linear-gradient(to bottom, transparent, var(--gold));
        animation: scrollLine 2s ease 1.5s both;
      }

      @keyframes scrollLine {
        from { opacity: 0; height: 0; }
        to   { opacity: 1; height: 80px; }
      }

      /* ══ SERVICES ════════════════════════════════════════════ */
      .services-section {
        padding: 7rem 1.5rem;
        background: var(--bg);
        max-width: 1000px;
        margin: 0 auto;
      }

      .services-grid {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .service-card {
        position: relative;
        display: flex;
        align-items: baseline;
        gap: 1.5rem;
        padding: 1.375rem 0;
        border-bottom: 1px solid var(--border-light);
        overflow: hidden;
        opacity: 0;
        animation: cardReveal 0.5s ease forwards;
        transition: padding-left var(--transition);
      }

      @keyframes cardReveal {
        from { opacity: 0; transform: translateX(-8px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      .service-card:first-child { border-top: 1px solid var(--border-light); }

      .service-card:hover { padding-left: 0.75rem; }

      .service-hover-line {
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 2px;
        background: var(--gold);
        transform: scaleY(0);
        transform-origin: bottom;
        transition: transform 0.3s ease;
      }

      .service-card:hover .service-hover-line { transform: scaleY(1); }

      .service-num {
        font-family: var(--font-sans);
        font-size: 0.625rem;
        color: var(--gold);
        letter-spacing: 0.1em;
        min-width: 2rem;
        opacity: 0.7;
      }

      .service-body {
        flex: 1;
        display: flex;
        align-items: baseline;
        gap: 0.75rem;
      }

      .service-name {
        font-family: var(--font-serif);
        font-size: clamp(1rem, 2vw, 1.1875rem);
        font-weight: 400;
        color: var(--text-primary);
        transition: color var(--transition);
      }

      .service-card:hover .service-name { color: var(--gold-light); }

      .service-dots {
        flex: 1;
        border-bottom: 1px dotted var(--text-muted);
        margin-bottom: 5px;
        min-width: 20px;
      }

      .service-price {
        font-family: var(--font-sans);
        font-size: 0.9375rem;
        font-weight: 300;
        color: var(--gold);
        white-space: nowrap;
        letter-spacing: 0.04em;
      }

      /* ══ BOOKING ═════════════════════════════════════════════ */
      .booking-section {
        padding: 7rem 1.5rem;
        background: var(--bg-alt);
        position: relative;
        overflow: hidden;
      }

      .booking-section::before {
        content: '';
        position: absolute;
        top: -1px; left: 0; right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
      }

      .booking-wrapper {
        max-width: 1100px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1.4fr;
        gap: 5rem;
        align-items: start;
      }

      @media (max-width: 768px) {
        .booking-wrapper {
          grid-template-columns: 1fr;
          gap: 3rem;
        }
      }

      .booking-left .section-header { text-align: left; margin-bottom: 2rem; }

      .booking-contact {
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
        font-style: normal;
        margin-top: 2rem;
      }

      .contact-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-family: var(--font-sans);
        font-size: 0.875rem;
        color: var(--text-secondary);
        text-decoration: none;
        transition: color var(--transition);
      }

      .contact-link:hover { color: var(--gold); }

      .contact-link svg { color: var(--gold); flex-shrink: 0; }

      /* Form styles */
      .booking-form {
        display: flex;
        flex-direction: column;
        gap: 1.125rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.125rem;
      }

      @media (max-width: 480px) {
        .form-row { grid-template-columns: 1fr; }
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }

      .form-label {
        font-family: var(--font-sans);
        font-size: 0.6875rem;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--text-muted);
      }

      .form-input {
        background: var(--bg-card);
        border: 1px solid var(--border-light);
        color: var(--text-primary);
        font-family: var(--font-sans);
        font-size: 0.9375rem;
        padding: 0.75rem 1rem;
        outline: none;
        transition: border-color var(--transition);
        border-radius: var(--radius);
        appearance: none;
        width: 100%;
      }

      .form-input::placeholder { color: var(--text-muted); font-size: 0.875rem; }
      .form-input:focus { border-color: var(--gold); }
      .form-input option { background: var(--bg-card); }

      .form-select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a96e' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        padding-right: 2.5rem;
        cursor: pointer;
      }

      .form-textarea { resize: vertical; min-height: 90px; }

      .booking-success {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.25rem;
        padding: 4rem 2rem;
        text-align: center;
        border: 1px solid var(--border);
        color: var(--gold);
        font-family: var(--font-serif);
        font-size: 1.25rem;
        font-style: italic;
      }

      .booking-success svg { color: var(--gold); }

      /* ══ FOOTER ══════════════════════════════════════════════ */
      .salon-footer {
        background: #060606;
        padding: 4rem 1.5rem 2rem;
        border-top: 1px solid var(--border-light);
      }

      .footer-inner {
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
        padding-bottom: 3rem;
        border-bottom: 1px solid var(--border-light);
      }

      .footer-brand { display: flex; flex-direction: column; gap: 0.375rem; }

      .footer-name {
        font-family: var(--font-serif);
        font-size: 1.375rem;
        font-weight: 400;
        color: var(--text-primary);
      }

      .footer-address, .footer-phone {
        font-family: var(--font-sans);
        font-size: 0.8125rem;
        color: var(--text-muted);
        text-decoration: none;
      }

      .footer-phone:hover { color: var(--gold); }

      .footer-ig {
        color: var(--text-muted);
        transition: color var(--transition);
      }

      .footer-ig:hover { color: var(--gold); }

      .footer-bottom {
        max-width: 1100px;
        margin: 1.5rem auto 0;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
        font-family: var(--font-sans);
        font-size: 0.6875rem;
        color: var(--text-muted);
        letter-spacing: 0.06em;
      }

      /* ══ Salon root ══════════════════════════════════════════ */
      .salon-root {
        min-height: 100vh;
        background: var(--bg);
      }
    `}</style>
  );
}

// ── Icon components ───────────────────────────────────────────
function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.42 2 2 0 0 1 3.57 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.09 6.09l1.13-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
