/*
 * This file ingests and normalizes Substack RSS items into the site's essay model.
 * It is separate from routes so remote parsing, sanitization, and slugging can be tested in isolation.
 * The essays route and homepage call this adapter through src/lib/content/index.ts.
 */

import sanitizeHtml from "sanitize-html";

import { asArray, parseXml } from "@/lib/content/rss";
import { getSiteConfig } from "@/lib/site-config";
import type { EssayEntry } from "@/types/content";

type SubstackFeed = {
  rss?: {
    channel?: {
      item?: SubstackItem | SubstackItem[];
    };
  };
};

type SubstackItem = {
  guid?: string;
  title?: string;
  link?: string;
  pubDate?: string;
  category?: string | string[];
  description?: string;
  "content:encoded"?: string;
};

function toPlainText(input: string): string {
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function toSlug(url: string, fallbackId: string): string {
  try {
    const parsed = new URL(url);
    const segment = parsed.pathname.split("/").filter(Boolean).pop();
    return segment || fallbackId;
  } catch {
    return fallbackId;
  }
}

function normalizeSummary(description?: string, html?: string): string {
  const raw = description ? toPlainText(description) : html ? toPlainText(html) : "";
  if (!raw) {
    return "No summary provided.";
  }

  // We keep summaries concise because cards should orient quickly and defer depth to detail pages.
  return raw.length > 190 ? `${raw.slice(0, 187)}...` : raw;
}

function toIsoOrEpoch(input?: string): string {
  if (!input) {
    return new Date(0).toISOString();
  }

  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString();
}

export function parseSubstackFeed(xml: string): EssayEntry[] {
  const payload = parseXml<SubstackFeed>(xml);
  const items = asArray(payload.rss?.channel?.item);

  return items
    .map((item, index) => {
      const canonicalUrl = item.link || "";
      const id = item.guid || canonicalUrl || `substack-${index}`;
      const html = item["content:encoded"]?.trim() || undefined;

      // Feed HTML can include scripts/iframes, so we sanitize to safe editorial markup before render.
      const sanitizedHtml = html
        ? sanitizeHtml(html, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "figure", "figcaption"]),
            allowedAttributes: {
              ...sanitizeHtml.defaults.allowedAttributes,
              img: ["src", "alt"],
              a: ["href", "name", "target", "rel"]
            }
          })
        : undefined;

      const summary = normalizeSummary(item.description, sanitizedHtml);
      // Feeds sometimes emit malformed dates, so we normalize bad values to a stable epoch fallback.
      const publishedAt = toIsoOrEpoch(item.pubDate);

      return {
        id,
        source: "substack",
        slug: toSlug(canonicalUrl, `essay-${index}`),
        title: item.title || "Untitled Essay",
        summary,
        excerpt: summary,
        html: sanitizedHtml,
        publishedAt,
        url: canonicalUrl,
        canonicalUrl,
        tags: asArray(item.category).map((tag) => String(tag))
      } satisfies EssayEntry;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function fetchSubstackEssays(): Promise<EssayEntry[]> {
  const { substackFeedUrl, substackUrl } = getSiteConfig();

  const response = await fetch(substackFeedUrl, {
    headers: {
      Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8"
    },
    next: {
      revalidate: 86400,
      tags: ["substack-feed"]
    }
  });

  if (!response.ok) {
    throw new Error(`Substack feed request failed with status ${response.status}`);
  }

  const xml = await response.text();
  const essays = parseSubstackFeed(xml);

  // If parsing produced no usable entries, we still expose a clear error instead of silent emptiness.
  if (!essays.length) {
    throw new Error("Substack feed returned no items");
  }

  // We keep canonical URLs inside Substack domain whenever feed links are missing or malformed.
  return essays.map((essay) => ({
    ...essay,
    url: essay.url || substackUrl,
    canonicalUrl: essay.canonicalUrl || substackUrl
  }));
}
