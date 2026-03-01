import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

import { SVGNoiseOverlay } from "@/components/texture/noise";
import { LenisProvider } from "@/components/cinematic/lenis-provider";
import { PrimitiveNav } from "@/components/cinematic/primitive-nav";
import { buildBaseMetadata } from "@/lib/seo/metadata";
import { getSiteConfig } from "@/lib/site-config";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  display: "swap"
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = buildBaseMetadata();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  const { plausibleDomain } = getSiteConfig();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-sans text-light antialiased">
        <LenisProvider>
          {/* Aesthetic Overlay - 0.03 opacity pure noise */}
          <SVGNoiseOverlay />

          {/* Analytics Configuration */}
          {plausibleDomain ? (
            <Script
              defer
              data-domain={plausibleDomain}
              src="https://plausible.io/js/script.js"
              strategy="afterInteractive"
            />
          ) : null}

          <PrimitiveNav />
          <main className="relative z-10 mx-auto flex w-full flex-col">{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
