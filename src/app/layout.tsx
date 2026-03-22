/*
 * This file defines the root shell shared by every public route.
 * It is separate because typography, metadata defaults, navigation, and footer behavior belong to the whole site rather than any one page.
 * Next.js loads this layout first, then nests each page route inside it.
 */

import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/site-config";

import "./globals.css";

const displayFont = localFont({
  src: [
    {
      path: "./fonts/Georgia.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/Georgia-Bold.ttf",
      weight: "700",
      style: "normal"
    }
  ],
  variable: "--font-display",
  display: "swap"
});

const monoFont = localFont({
  src: [
    {
      path: "./fonts/SFNSMono.ttf",
      weight: "400",
      style: "normal"
    }
  ],
  variable: "--font-mono",
  display: "swap"
});

const settings = getSiteSettings();

export const metadata: Metadata = {
  metadataBase: new URL(settings.siteUrl),
  title: {
    default: settings.title,
    template: `%s | ${settings.title}`
  },
  description: settings.description
};

export default function RootLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <html className={`${displayFont.variable} ${monoFont.variable}`} lang="en">
      <body className="bg-bone text-ink">
        <SiteHeader settings={settings} />
        {children}
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
