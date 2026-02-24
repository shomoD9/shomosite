import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, EB_Garamond, IBM_Plex_Mono } from "next/font/google";

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

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono"
});

export const metadata: Metadata = buildBaseMetadata();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  const { plausibleDomain } = getSiteConfig();

  return (
    <html lang="en" className={`scroll-smooth ${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="min-h-screen bg-paper text-ink antialiased">
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
