"use client";

/**
 * lib/i18n.tsx
 * ─────────────────────────────────────────────────────────────
 * Lightweight i18n context for SK (default) / EN toggle.
 * No external library required — just a typed dictionary +
 * React context so any component can call `useTranslation()`.
 * ─────────────────────────────────────────────────────────────
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// ── Supported locales ────────────────────────────────────────
export type Locale = "sk" | "en";

// ── Translation dictionary type ──────────────────────────────
interface Translations {
  // Nav
  nav_services:  string;
  nav_gallery:   string;
  nav_booking:   string;
  nav_contact:   string;

  // Hero
  hero_subtitle: string;
  hero_cta:      string;

  // Services section
  services_title:    string;
  services_subtitle: string;

  // Service items
  svc_manicure:         string;
  svc_manicure_gel:     string;
  svc_pedicure:         string;
  svc_pedicure_spa:     string;
  svc_nail_design:      string;
  svc_nail_extension:   string;
  svc_eyebrows:         string;
  svc_lashes:           string;
  svc_facial:           string;

  // Instagram section
  ig_title:    string;
  ig_subtitle: string;
  ig_cta:      string;

  // Booking section
  booking_title:       string;
  booking_subtitle:    string;
  booking_name:        string;
  booking_phone:       string;
  booking_service:     string;
  booking_date:        string;
  booking_message:     string;
  booking_submit:      string;
  booking_placeholder_name:    string;
  booking_placeholder_phone:   string;
  booking_placeholder_service: string;
  booking_placeholder_message: string;

  // Contact section
  contact_title:        string;
  contact_address:      string;
  contact_phone:        string;
  contact_email:        string;
  contact_hours:        string;
  contact_today:        string;
  contact_closed:       string;
  contact_day_mon:      string;
  contact_day_tue:      string;
  contact_day_wed:      string;
  contact_day_thu:      string;
  contact_day_fri:      string;
  contact_day_sat:      string;
  contact_day_sun:      string;

  // Footer
  footer_rights:  string;
  footer_powered: string;

  // Misc
  currency: string;
}

// ── Dictionaries ─────────────────────────────────────────────
const dict: Record<Locale, Translations> = {
  sk: {
    nav_services:  "Služby",
    nav_gallery:   "Galéria",
    nav_booking:   "Rezervácia",
    nav_contact:   "Kontakt",

    hero_subtitle: "Luxusná starostlivosť o nechty & krásu",
    hero_cta:      "Rezervovať termín",

    services_title:    "Naše Služby",
    services_subtitle: "Každý detail, dokonalý",

    svc_manicure:       "Manikúra",
    svc_manicure_gel:   "Gélová manikúra",
    svc_pedicure:       "Pedikúra",
    svc_pedicure_spa:   "SPA pedikúra",
    svc_nail_design:    "Nail art & dizajn",
    svc_nail_extension: "Predlžovanie nechtov",
    svc_eyebrows:       "Úprava obočia",
    svc_lashes:         "Mihalnice",
    svc_facial:         "Ošetrenie pleti",

    ig_title:    "Naša Práca",
    ig_subtitle: "Sledujte nás na Instagrame",
    ig_cta:      "Sledovať na Instagrame",

    booking_title:       "Rezervujte si termín",
    booking_subtitle:    "Vyplňte formulár a ozveme sa vám do 24 hodín",
    booking_name:        "Meno a priezvisko",
    booking_phone:       "Telefónne číslo",
    booking_service:     "Vybrať službu",
    booking_date:        "Preferovaný dátum",
    booking_message:     "Správa (nepovinné)",
    booking_submit:      "Odoslať rezerváciu",
    booking_placeholder_name:    "Jana Nováková",
    booking_placeholder_phone:   "+421 9XX XXX XXX",
    booking_placeholder_service: "— Vyberte službu —",
    booking_placeholder_message: "Akékoľvek špeciálne požiadavky...",

    contact_title:        "Kontakt",
    contact_address:      "Adresa",
    contact_phone:        "Telefón",
    contact_email:        "E-mail",
    contact_hours:        "Otváracie hodiny",
    contact_today:        "Dnes",
    contact_closed:       "Zatvorené",
    contact_day_mon:      "Pondelok",
    contact_day_tue:      "Utorok",
    contact_day_wed:      "Streda",
    contact_day_thu:      "Štvrtok",
    contact_day_fri:      "Piatok",
    contact_day_sat:      "Sobota",
    contact_day_sun:      "Nedeľa",

    footer_rights:  "Všetky práva vyhradené",
    footer_powered: "Powered by Dunajmedia",

    currency: "€",
  },

  en: {
    nav_services:  "Services",
    nav_gallery:   "Gallery",
    nav_booking:   "Booking",
    nav_contact:   "Contact",

    hero_subtitle: "Luxury nail & beauty care",
    hero_cta:      "Book an Appointment",

    services_title:    "Our Services",
    services_subtitle: "Every detail, perfected",

    svc_manicure:       "Manicure",
    svc_manicure_gel:   "Gel Manicure",
    svc_pedicure:       "Pedicure",
    svc_pedicure_spa:   "SPA Pedicure",
    svc_nail_design:    "Nail Art & Design",
    svc_nail_extension: "Nail Extensions",
    svc_eyebrows:       "Eyebrow Styling",
    svc_lashes:         "Lash Extensions",
    svc_facial:         "Facial Treatment",

    ig_title:    "Our Work",
    ig_subtitle: "Follow us on Instagram",
    ig_cta:      "Follow on Instagram",

    booking_title:       "Book Your Appointment",
    booking_subtitle:    "Fill in the form and we will get back to you within 24 hours",
    booking_name:        "Full Name",
    booking_phone:       "Phone Number",
    booking_service:     "Select Service",
    booking_date:        "Preferred Date",
    booking_message:     "Message (optional)",
    booking_submit:      "Send Booking Request",
    booking_placeholder_name:    "Jane Smith",
    booking_placeholder_phone:   "+421 9XX XXX XXX",
    booking_placeholder_service: "— Choose a service —",
    booking_placeholder_message: "Any special requests...",

    contact_title:        "Contact",
    contact_address:      "Address",
    contact_phone:        "Phone",
    contact_email:        "E-mail",
    contact_hours:        "Opening Hours",
    contact_today:        "Today",
    contact_closed:       "Closed",
    contact_day_mon:      "Monday",
    contact_day_tue:      "Tuesday",
    contact_day_wed:      "Wednesday",
    contact_day_thu:      "Thursday",
    contact_day_fri:      "Friday",
    contact_day_sat:      "Saturday",
    contact_day_sun:      "Sunday",

    footer_rights:  "All rights reserved",
    footer_powered: "Powered by Dunajmedia",

    currency: "€",
  },
};

// ── Context ───────────────────────────────────────────────────
interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────
export function I18nProvider({
  children,
  defaultLocale = "sk",
}: {
  children: ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const toggle = useCallback(
    () => setLocaleState((prev) => (prev === "sk" ? "en" : "sk")),
    []
  );

  return (
    <I18nContext.Provider
      value={{ locale, t: dict[locale], setLocale, toggle }}
    >
      {children}
    </I18nContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────
export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation must be used inside <I18nProvider>");
  }
  return ctx;
}

// ── Server-side helper (for RSC) ──────────────────────────────
/**
 * Returns translations for a given locale without React context.
 * Useful in Server Components (page.tsx) that can't use hooks.
 */
export function getTranslations(locale: Locale = "sk"): Translations {
  return dict[locale];
}
