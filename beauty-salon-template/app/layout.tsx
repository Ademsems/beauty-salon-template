/**
 * app/layout.tsx
 * Root layout — applies to all routes.
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://dunajmedia.sk"
  ),
  title:       "Luxury Beauty & Nail Salon | Dunajmedia",
  description: "Premium nail & beauty salons powered by Dunajmedia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk" suppressHydrationWarning>
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Fonts loaded via SalonPageClient's <GlobalStyles> to avoid blocking */}
      </head>
      <body>{children}</body>
    </html>
  );
}
