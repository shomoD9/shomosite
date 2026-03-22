/*
 * This file establishes the framework-level behavior for the rebuilt site.
 * It stays separate from route code so platform decisions remain easy to find and adjust.
 * Next.js reads this module before compiling the app shell and page routes.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true
};

export default nextConfig;
