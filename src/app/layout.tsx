import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { Navigation } from "@/components/navigation";
import { SVGNoiseOverlay } from "@/components/texture/noise";
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

const sansFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono"
});

export const metadata: Metadata = buildBaseMetadata();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  const { plausibleDomain } = getSiteConfig();

  return (
    <html lang="en" className={`scroll-smooth ${headingFont.variable} ${sansFont.variable} ${monoFont.variable}`}>
      <body className="min-h-screen bg-void text-light antialiased font-sans flex flex-col items-center overflow-x-hidden selection:bg-accent/30 selection:text-accent">
        <SVGNoiseOverlay />
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
        <Navigation />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
