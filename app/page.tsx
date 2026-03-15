/**
 * app/page.tsx
 * ─────────────────────────────────────────────────────────────
 * Root route redirect.
 * Visiting the bare domain (e.g. dunajmedia.vercel.app) sends
 * the visitor to /demo which renders the full fallback template.
 *
 * Once you have real salons in your CSV, change "demo" below to
 * whichever slug you want as the default landing experience —
 * or replace this whole file with a proper agency landing page.
 * ─────────────────────────────────────────────────────────────
 */

import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/demo");
}
