"use client";

/**
 * components/BookingModal.tsx
 * ─────────────────────────────────────────────────────────────
 * 3-step booking modal:
 *   Step 1 — Select services (multi-select)
 *   Step 2 — Pick date & time (custom calendar)
 *   Step 3 — Personal details + confirm
 *
 * Uses framer-motion AnimatePresence for fluid step transitions
 * and a glassmorphism container on a blurred dark backdrop.
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

// ── Types ────────────────────────────────────────────────────
export interface BookingService {
  label: string;
  price: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  salonName: string;
  services: BookingService[];
}

// ── Locale strings ────────────────────────────────────────────
const WEEK_SK = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];
const WEEK_EN = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const MONTHS_SK = [
  "Január","Február","Marec","Apríl","Máj","Jún",
  "Júl","August","September","Október","November","December",
];
const MONTHS_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const TIME_SLOTS = [
  "09:00","10:00","11:00","12:00","13:00",
  "14:00","15:00","16:00","17:00","18:00",
];

// ── Framer variants ───────────────────────────────────────────
const stepVariants = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0 }),
};

const stepTransition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };

// ── Component ─────────────────────────────────────────────────
export default function BookingModal({ isOpen, onClose, salonName, services }: Props) {
  const { t, locale } = useTranslation();

  // Step state
  const [step, setStep]         = useState(1);
  const [direction, setDirection] = useState(1);

  // Selections
  const [selected, setSelected]     = useState<number[]>([]);
  const [selDate, setSelDate]       = useState<Date | null>(null);
  const [selTime, setSelTime]       = useState<string | null>(null);
  const [calDate, setCalDate]       = useState(() => new Date());
  const [form, setForm]             = useState({ name: "", phone: "", email: "" });
  const [submitted, setSubmitted]   = useState(false);

  // ── Keyboard + scroll lock ────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset state after close animation
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep(1); setDirection(1);
        setSelected([]); setSelDate(null); setSelTime(null);
        setForm({ name: "", phone: "", email: "" });
        setSubmitted(false);
        setCalDate(new Date());
      }, 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ── Calendar helpers ──────────────────────────────────────
  const today = new Date(); today.setHours(0,0,0,0);
  const year  = calDate.getFullYear();
  const month = calDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = (() => {
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1; // make Monday = 0
  })();

  const weekDays   = locale === "sk" ? WEEK_SK : WEEK_EN;
  const monthNames = locale === "sk" ? MONTHS_SK : MONTHS_EN;

  // ── Derived ───────────────────────────────────────────────
  const total      = selected.reduce((s, i) => s + services[i].price, 0);
  const canStep1   = selected.length > 0;
  const canStep2   = !!selDate && !!selTime;
  const canStep3   = form.name.trim() && form.phone.trim() && form.email.trim();

  const stepLabels = locale === "sk"
    ? ["Vyberte služby", "Dátum & čas", "Osobné údaje"]
    : ["Select Services", "Date & Time", "Your Details"];

  // ── Actions ───────────────────────────────────────────────
  const goNext = useCallback(() => { setDirection(1);  setStep(s => s + 1); }, []);
  const goBack = useCallback(() => { setDirection(-1); setStep(s => s - 1); }, []);

  const toggleService = (i: number) =>
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const handleSubmit = () => setSubmitted(true);

  // ── Render ────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="bm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/*
           * bm-positioner: fixed full-screen flex container.
           * Centering lives here via flexbox — framer-motion
           * only animates opacity/scale so it never clobbers
           * the positioning transform.
           */}
          <div className="bm-positioner">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={locale === "sk" ? "Rezervácia" : "Booking"}
            className="bm-modal"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ── Header ── */}
            <div className="bm-header">
              <div>
                <p className="bm-eyebrow">{salonName}</p>
                <h2 className="bm-title">
                  {submitted
                    ? (locale === "sk" ? "Rezervácia odoslaná" : "Booking Sent")
                    : stepLabels[step - 1]}
                </h2>
              </div>
              <button className="bm-close" onClick={onClose} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* ── Step progress bar ── */}
            {!submitted && (
              <div className="bm-progress" aria-hidden="true">
                {[1,2,3].map(s => (
                  <div key={s} className={`bm-bar ${step >= s ? "bm-bar--active" : ""}`} />
                ))}
              </div>
            )}

            {/* ── Body ── */}
            <div className="bm-body">
              <AnimatePresence mode="wait" custom={direction}>

                {/* SUCCESS */}
                {submitted && (
                  <motion.div key="success" className="bm-success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}>
                    <div className="bm-success-ring">✓</div>
                    <p className="bm-success-msg">
                      {locale === "sk"
                        ? `Ďakujeme, ${form.name}! Ozveme sa vám na číslo ${form.phone}.`
                        : `Thank you, ${form.name}! We'll reach you at ${form.phone}.`}
                    </p>
                    <div className="bm-tags">
                      {selected.map(i => <span key={i} className="bm-tag">{services[i].label}</span>)}
                      <span className="bm-tag">
                        {selDate?.toLocaleDateString(locale === "sk" ? "sk-SK" : "en-GB")} · {selTime}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* STEP 1 — Services */}
                {!submitted && step === 1 && (
                  <motion.div key="s1" custom={direction}
                    variants={stepVariants} initial="enter" animate="center" exit="exit"
                    transition={stepTransition} className="bm-step">
                    <div className="bm-svc-list">
                      {services.map((svc, i) => {
                        const on = selected.includes(i);
                        return (
                          <button key={i}
                            className={`bm-svc ${on ? "bm-svc--on" : ""}`}
                            onClick={() => toggleService(i)}>
                            <span className="bm-svc-name">{svc.label}</span>
                            <span className="bm-svc-price">{svc.price}{t.currency}</span>
                            <span className="bm-svc-tick">{on ? "✓" : ""}</span>
                          </button>
                        );
                      })}
                    </div>
                    <AnimatePresence>
                      {selected.length > 0 && (
                        <motion.div className="bm-total"
                          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}>
                          {selected.length} {locale === "sk" ? "služby" : "services"} · {total}{t.currency}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* STEP 2 — Calendar & Time */}
                {!submitted && step === 2 && (
                  <motion.div key="s2" custom={direction}
                    variants={stepVariants} initial="enter" animate="center" exit="exit"
                    transition={stepTransition} className="bm-step">

                    {/* Calendar */}
                    <div className="bm-cal">
                      <div className="bm-cal-nav">
                        <button className="bm-cal-arrow"
                          onClick={() => setCalDate(new Date(year, month - 1, 1))}
                          aria-label="Previous month">‹</button>
                        <span className="bm-cal-month">
                          {monthNames[month]} {year}
                        </span>
                        <button className="bm-cal-arrow"
                          onClick={() => setCalDate(new Date(year, month + 1, 1))}
                          aria-label="Next month">›</button>
                      </div>

                      <div className="bm-cal-grid">
                        {weekDays.map(d => (
                          <div key={d} className="bm-cal-wd">{d}</div>
                        ))}
                        {Array.from({ length: firstDay }).map((_, i) => (
                          <div key={`e${i}`} />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const day  = i + 1;
                          const date = new Date(year, month, day);
                          const past = date < today;
                          const sel  = selDate?.toDateString() === date.toDateString();
                          const tod  = date.toDateString() === today.toDateString();
                          return (
                            <button key={day} disabled={past}
                              className={`bm-cal-day
                                ${past ? "bm-cal-day--past" : ""}
                                ${sel  ? "bm-cal-day--sel"  : ""}
                                ${tod  ? "bm-cal-day--tod"  : ""}
                              `}
                              onClick={() => { setSelDate(date); setSelTime(null); }}>
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time slots */}
                    <AnimatePresence>
                      {selDate && (
                        <motion.div className="bm-times"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}>
                          <p className="bm-times-label">
                            {locale === "sk" ? "Vyberte čas" : "Select time"}
                          </p>
                          <div className="bm-time-grid">
                            {TIME_SLOTS.map(slot => (
                              <button key={slot}
                                className={`bm-slot ${selTime === slot ? "bm-slot--sel" : ""}`}
                                onClick={() => setSelTime(slot)}>
                                {slot}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* STEP 3 — Personal details */}
                {!submitted && step === 3 && (
                  <motion.div key="s3" custom={direction}
                    variants={stepVariants} initial="enter" animate="center" exit="exit"
                    transition={stepTransition} className="bm-step">

                    {/* Recap */}
                    <div className="bm-recap">
                      <div className="bm-tags" style={{ marginBottom: "0.5rem" }}>
                        {selected.map(i => (
                          <span key={i} className="bm-tag">{services[i].label}</span>
                        ))}
                      </div>
                      <p className="bm-recap-dt">
                        {selDate?.toLocaleDateString(locale === "sk" ? "sk-SK" : "en-GB", {
                          weekday: "long", day: "numeric", month: "long",
                        })} · {selTime}
                      </p>
                    </div>

                    {/* Form */}
                    <div className="bm-form">
                      {[
                        { key: "name",  label: t.booking_name,  ph: t.booking_placeholder_name,  type: "text",  ac: "name" },
                        { key: "phone", label: t.booking_phone, ph: t.booking_placeholder_phone, type: "tel",   ac: "tel"  },
                        { key: "email", label: "Email",          ph: "jana@example.com",           type: "email", ac: "email"},
                      ].map(({ key, label, ph, type, ac }) => (
                        <div key={key} className="bm-fg">
                          <label className="bm-label" htmlFor={`bm-${key}`}>{label}</label>
                          <input id={`bm-${key}`} type={type} autoComplete={ac}
                            className="bm-input" placeholder={ph}
                            value={(form as any)[key]}
                            onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer nav ── */}
            {!submitted && (
              <div className="bm-footer">
                {step > 1
                  ? <button className="bm-btn-back" onClick={goBack}>
                      {locale === "sk" ? "Späť" : "Back"}
                    </button>
                  : <div />
                }
                {step < 3
                  ? <button className="bm-btn-next"
                      disabled={step === 1 ? !canStep1 : !canStep2}
                      onClick={goNext}>
                      {locale === "sk" ? "Pokračovať" : "Continue"}
                    </button>
                  : <button className="bm-btn-next"
                      disabled={!canStep3}
                      onClick={handleSubmit}>
                      {t.booking_submit}
                    </button>
                }
              </div>
            )}

            <style>{STYLES}</style>
          </motion.div>
          </div>{/* end bm-positioner */}
        </>
      )}
    </AnimatePresence>
  );
}

// ── Styles ────────────────────────────────────────────────────
const STYLES = `
  .bm-backdrop {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.78);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }

  /* Centering wrapper — flexbox does the centering so framer-motion
     never needs to use transforms for positioning */
  .bm-positioner {
    position: fixed; inset: 0; z-index: 201;
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
    pointer-events: none; /* clicks pass through to backdrop */
  }

  .bm-modal {
    pointer-events: auto; /* re-enable clicks on the modal itself */
    width: min(560px, 100%);
    /* Use a fixed height with internal scroll so the footer is
       always visible regardless of screen size */
    height: min(720px, calc(100svh - 2rem));
    background: rgba(16,16,16,0.97);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(201,169,110,0.22);
    box-shadow: 0 32px 80px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.03);
    display: flex; flex-direction: column; overflow: hidden;
  }

  .bm-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 1.625rem 1.75rem 0.875rem;
    border-bottom: 1px solid rgba(255,255,255,0.055);
    flex-shrink: 0;
  }

  .bm-eyebrow {
    font-family: var(--font-sans);
    font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 0.3rem;
  }

  .bm-title {
    font-family: var(--font-serif);
    font-size: 1.3125rem; font-weight: 400;
    color: var(--text-primary);
  }

  .bm-close {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); padding: 4px; margin-top: 2px;
    transition: color 0.2s; flex-shrink: 0;
  }
  .bm-close:hover { color: var(--text-primary); }

  .bm-progress {
    display: flex; gap: 5px;
    padding: 0.875rem 1.75rem;
    flex-shrink: 0;
  }

  .bm-bar {
    flex: 1; height: 2px;
    background: rgba(255,255,255,0.08);
    transition: background 0.4s ease;
  }
  .bm-bar--active { background: var(--gold); }

  .bm-body {
    flex: 1; overflow-y: auto;
    padding: 1.125rem 1.75rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(201,169,110,0.3) transparent;
  }

  .bm-step { width: 100%; }

  /* ── Services ── */
  .bm-svc-list { display: flex; flex-direction: column; gap: 5px; }

  .bm-svc {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.8rem 1rem; text-align: left;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer; transition: all 0.18s ease;
  }
  .bm-svc:hover { border-color: rgba(201,169,110,0.35); }
  .bm-svc--on {
    border-color: var(--gold);
    background: rgba(201,169,110,0.08);
  }
  .bm-svc-name {
    flex: 1; font-family: var(--font-serif);
    font-size: 0.9375rem; color: var(--text-primary);
  }
  .bm-svc-price {
    font-family: var(--font-sans); font-size: 0.8125rem;
    color: var(--gold);
  }
  .bm-svc-tick { width: 14px; font-size: 0.7rem; color: var(--gold); text-align: center; }

  .bm-total {
    margin-top: 0.875rem; padding: 0.625rem 1rem;
    border-left: 2px solid var(--gold);
    background: rgba(201,169,110,0.07);
    font-family: var(--font-sans); font-size: 0.8125rem;
    color: var(--gold); letter-spacing: 0.04em;
  }

  /* ── Calendar ── */
  .bm-cal { margin-bottom: 1.125rem; }

  .bm-cal-nav {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.875rem;
  }

  .bm-cal-arrow {
    background: none; border: 1px solid rgba(255,255,255,0.1);
    color: var(--text-secondary); width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1.125rem; transition: all 0.18s;
  }
  .bm-cal-arrow:hover { border-color: var(--gold); color: var(--gold); }

  .bm-cal-month {
    font-family: var(--font-serif); font-size: 0.9375rem;
    color: var(--text-primary); letter-spacing: 0.04em;
  }

  .bm-cal-grid {
    display: grid; grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .bm-cal-wd {
    font-family: var(--font-sans); font-size: 0.5625rem;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-muted); text-align: center; padding: 0.25rem 0;
  }

  .bm-cal-day {
    aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
    font-family: var(--font-sans); font-size: 0.8125rem;
    color: var(--text-secondary);
    background: none; border: 1px solid transparent;
    cursor: pointer; transition: all 0.15s;
  }
  .bm-cal-day:hover:not(:disabled) {
    border-color: rgba(201,169,110,0.4); color: var(--text-primary);
  }
  .bm-cal-day--past { opacity: 0.3; cursor: not-allowed; }
  .bm-cal-day--tod  { color: var(--gold); }
  .bm-cal-day--sel  {
    background: var(--gold) !important;
    border-color: var(--gold) !important;
    color: #0a0a0a !important;
  }

  /* ── Time slots ── */
  .bm-times { overflow: hidden; }
  .bm-times-label {
    font-family: var(--font-sans); font-size: 0.625rem;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--text-muted); margin: 0.875rem 0 0.5rem;
  }
  .bm-time-grid {
    display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px;
  }
  .bm-slot {
    padding: 0.5rem 0.25rem; text-align: center;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    font-family: var(--font-sans); font-size: 0.8125rem;
    color: var(--text-secondary); cursor: pointer; transition: all 0.15s;
  }
  .bm-slot:hover { border-color: rgba(201,169,110,0.4); color: var(--text-primary); }
  .bm-slot--sel { background: var(--gold); border-color: var(--gold); color: #0a0a0a; }

  /* ── Recap ── */
  .bm-recap {
    padding: 0.875rem 1rem; margin-bottom: 1.125rem;
    background: rgba(255,255,255,0.025);
    border-left: 2px solid var(--gold);
  }
  .bm-tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .bm-tag {
    font-family: var(--font-sans); font-size: 0.625rem;
    letter-spacing: 0.08em; padding: 3px 8px;
    background: rgba(201,169,110,0.1);
    border: 1px solid rgba(201,169,110,0.28);
    color: var(--gold);
  }
  .bm-recap-dt {
    font-family: var(--font-sans); font-size: 0.8125rem;
    color: var(--text-secondary); text-transform: capitalize;
    margin-top: 0.375rem;
  }

  /* ── Form ── */
  .bm-form { display: flex; flex-direction: column; gap: 0.8rem; }
  .bm-fg   { display: flex; flex-direction: column; gap: 0.3rem; }
  .bm-label {
    font-family: var(--font-sans); font-size: 0.5875rem;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--text-muted);
  }
  .bm-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: var(--text-primary); font-family: var(--font-sans);
    font-size: 0.9375rem; padding: 0.7rem 0.9rem;
    outline: none; transition: border-color 0.2s; width: 100%;
  }
  .bm-input::placeholder { color: var(--text-muted); font-size: 0.875rem; }
  .bm-input:focus { border-color: var(--gold); }

  /* ── Success ── */
  .bm-success {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; padding: 1.5rem 0; gap: 1rem;
  }
  .bm-success-ring {
    width: 52px; height: 52px; border-radius: 50%;
    border: 1px solid var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.25rem; color: var(--gold);
  }
  .bm-success-msg {
    font-family: var(--font-serif); font-size: 1rem;
    color: var(--text-secondary); font-style: italic;
    max-width: 340px; line-height: 1.65;
  }

  /* ── Footer ── */
  .bm-footer {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.9rem 1.75rem 1.375rem;
    border-top: 1px solid rgba(255,255,255,0.055);
    flex-shrink: 0;
  }
  .bm-btn-back {
    background: none; border: none; cursor: pointer;
    font-family: var(--font-sans); font-size: 0.625rem;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--text-muted); padding: 0.5rem 0;
    transition: color 0.2s;
  }
  .bm-btn-back:hover { color: var(--text-primary); }

  .bm-btn-next {
    padding: 0.7rem 1.875rem;
    background: var(--gold); border: 1px solid var(--gold);
    color: #0a0a0a; font-family: var(--font-sans);
    font-size: 0.625rem; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    cursor: pointer; transition: all 0.22s;
  }
  .bm-btn-next:hover:not(:disabled) { background: transparent; color: var(--gold); }
  .bm-btn-next:disabled { opacity: 0.32; cursor: not-allowed; }
`;
