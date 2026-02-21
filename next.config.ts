/*
 * This file is the framework-level boundary where we configure global Next.js behavior.
 * It exists separately from route code so deployment/runtime concerns remain centralized and predictable.
 * Next.js reads this file at build/start time, and the rest of the app depends on the decisions declared here.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true
};

export default nextConfig;
