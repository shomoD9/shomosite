/*
 * This file defines the root document frame shared by every route.
 * It is separated so global metadata, fonts, analytics wiring, and persistent chrome are managed once.
 * All route pages render inside this layout, and it imports global styles plus top/bottom navigation components.
 */

import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, EB_Garamond } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildBaseMetadata } from "@/lib/seo/metadata";
import { getSiteConfig } from "@/lib/site-config";

import "./globals.css";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-heading"
});

const bodyFont = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-body"
});

export const metadata: Metadata = buildBaseMetadata();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  const { plausibleDomain } = getSiteConfig();

  return (
    <html lang="en" className={`scroll-smooth ${headingFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen bg-paper text-ink antialiased">
        {/* Plausible is loaded only when a domain is configured so local development stays noise-free. */}
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl px-6 pb-16 pt-4 md:px-10">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
