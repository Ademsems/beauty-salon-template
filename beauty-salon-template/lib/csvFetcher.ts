/**
 * lib/csvFetcher.ts
 * ─────────────────────────────────────────────────────────────
 * Fetches and parses a Google Sheets CSV export for Dunajmedia
 * multi-tenant salon sites.
 *
 * Expected CSV columns (case-insensitive, order-independent):
 *   slug | name | phone | address | ig_url
 * ─────────────────────────────────────────────────────────────
 */

export interface SalonData {
  slug: string;
  name: string;
  phone: string;
  address: string;
  ig_url: string;
}

// ── Default fallbacks ────────────────────────────────────────
const FALLBACK_PHONE   = "+421 952 049 119";
const FALLBACK_ADDRESS = "Slovakia, Bratislava";

/**
 * Full fallback salon used when:
 *   • SALON_CSV_URL is not set
 *   • The CSV fetch fails (network error, bad URL, etc.)
 *   • The slug is not found in the sheet
 *
 * This means the template always renders something beautiful
 * even before a real CSV is wired up.
 */
export const FALLBACK_SALON: SalonData = {
  slug:    "demo",
  name:    "Lumière Beauty",
  phone:   FALLBACK_PHONE,
  address: FALLBACK_ADDRESS,
  ig_url:  "https://instagram.com/lumiere.beauty",
};

// ── Tiny CSV parser (no external dependency) ─────────────────
function parseCSV(raw: string): Record<string, string>[] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]).map((h) => h.toLowerCase().trim());

  return lines.slice(1).map((line) => {
    const values = splitCSVLine(line);
    return headers.reduce<Record<string, string>>((acc, key, i) => {
      acc[key] = (values[i] ?? "").trim();
      return acc;
    }, {});
  });
}

/** Handles quoted fields that may contain commas */
function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      // Escaped double-quote inside quoted field
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  result.push(current);
  return result;
}

// ── Main fetch function ───────────────────────────────────────

/**
 * Fetches all salons from the Google Sheets CSV URL.
 * Uses `cache: 'no-store'` so edits in the sheet reflect immediately.
 * Returns an empty array (never throws) if the URL is missing or the
 * request fails — callers decide how to handle the empty result.
 */
export async function fetchAllSalons(csvUrl: string): Promise<SalonData[]> {
  if (!csvUrl) return [];

  try {
    const res = await fetch(csvUrl, { cache: "no-store" });

    if (!res.ok) {
      console.warn(`[csvFetcher] CSV fetch returned ${res.status} ${res.statusText}`);
      return [];
    }

    const raw = await res.text();
    const rows = parseCSV(raw);

    return rows
      .filter((row) => row["slug"])
      .map((row) => ({
        slug:    row["slug"]    ?? "",
        name:    row["name"]    ?? "Beauty Salon",
        phone:   row["phone"]   || FALLBACK_PHONE,
        address: row["address"] || FALLBACK_ADDRESS,
        ig_url:  row["ig_url"]  ?? "",
      }));
  } catch (err) {
    console.warn("[csvFetcher] Failed to fetch or parse CSV:", err);
    return [];
  }
}

/**
 * Fetches a single salon by its slug.
 * Falls back to FALLBACK_SALON if:
 *   • SALON_CSV_URL is not set
 *   • The CSV fetch fails
 *   • The slug has no matching row in the sheet
 *
 * The page therefore always renders — never a blank screen or crash.
 */
export async function fetchSalonBySlug(
  csvUrl: string,
  slug: string
): Promise<SalonData> {
  const salons = await fetchAllSalons(csvUrl);
  return (
    salons.find((s) => s.slug === slug) ?? {
      ...FALLBACK_SALON,
      slug, // preserve the requested slug so the URL stays consistent
    }
  );
}
