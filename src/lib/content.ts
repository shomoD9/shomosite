/*
 * This file loads the site's local MDX-style content files and shapes them into typed data for the routes.
 * It exists separately so filesystem concerns stay at one boundary and page components can stay declarative.
 * Every public route imports these loaders rather than reading files directly.
 */

import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import type {
  CollaboratePage,
  HomePageContent,
  ProofItem,
  TrackPage,
  TrackSlug
} from "@/lib/content-types";
import { renderMarkdown } from "@/lib/markdown";

const CONTENT_ROOT = path.join(process.cwd(), "content");

type ParsedContent<T> = T & {
  bodyHtml: string;
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown): boolean {
  return value === true || value === "true";
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }

  return [];
}

function asTrackArray(value: unknown): TrackSlug[] {
  const tracks = asStringArray(value);

  // We validate track slugs here so malformed frontmatter cannot quietly leak into the UI.
  return tracks.filter((entry): entry is TrackSlug =>
    entry === "prose" || entry === "product" || entry === "productivity"
  );
}

async function readContentFile<T>(segments: string[]): Promise<ParsedContent<T>> {
  const absolutePath = path.join(CONTENT_ROOT, ...segments);
  const raw = await fs.readFile(absolutePath, "utf8");
  // Narrated MDX files may start with a block comment, so we strip that wrapper before parsing frontmatter.
  const normalized = raw.replace(/^\s*\{\/\*[\s\S]*?\*\/\}\s*/, "");
  const parsed = matter(normalized);
  const bodyHtml = parsed.content.trim() ? await renderMarkdown(parsed.content) : "";

  return {
    ...(parsed.data as T),
    bodyHtml
  };
}

export const loadHomePage = cache(async (): Promise<HomePageContent> => {
  const page = await readContentFile<HomePageContent>(["pages", "home.mdx"]);

  return {
    title: asString(page.title),
    summary: asString(page.summary),
    primaryCtaLabel: asString(page.primaryCtaLabel),
    primaryCtaSubject: asString(page.primaryCtaSubject),
    whoHeading: asString(page.whoHeading),
    whatHeading: asString(page.whatHeading),
    proofHeading: asString(page.proofHeading),
    collaborationHeading: asString(page.collaborationHeading),
    bodyHtml: page.bodyHtml
  };
});

export const loadTrackPage = cache(async (slug: TrackSlug): Promise<TrackPage> => {
  const page = await readContentFile<TrackPage>(["pages", `${slug}.mdx`]);

  return {
    slug,
    title: asString(page.title),
    eyebrow: asString(page.eyebrow),
    summary: asString(page.summary),
    servicesHeading: asString(page.servicesHeading),
    audienceHeading: asString(page.audienceHeading),
    proofHeading: asString(page.proofHeading),
    ctaLabel: asString(page.ctaLabel),
    ctaSubject: asString(page.ctaSubject),
    services: asStringArray(page.services),
    audience: asStringArray(page.audience),
    principles: asStringArray(page.principles),
    bodyHtml: page.bodyHtml
  };
});

export const loadCollaboratePage = cache(async (): Promise<CollaboratePage> => {
  const page = await readContentFile<CollaboratePage>(["pages", "collaborate.mdx"]);

  return {
    title: asString(page.title),
    eyebrow: asString(page.eyebrow),
    summary: asString(page.summary),
    ctaLabel: asString(page.ctaLabel),
    ctaSubject: asString(page.ctaSubject),
    supportNote: asString(page.supportNote),
    process: asStringArray(page.process),
    fit: asStringArray(page.fit),
    notFit: asStringArray(page.notFit),
    bodyHtml: page.bodyHtml
  };
});

export const loadProofItems = cache(async (): Promise<ProofItem[]> => {
  const directory = path.join(CONTENT_ROOT, "proof");
  const entries = await fs.readdir(directory);
  const files = entries.filter((entry) => entry.endsWith(".mdx")).sort();

  const items = await Promise.all(
    files.map(async (fileName) => {
      const item = await readContentFile<ProofItem>(["proof", fileName]);

      return {
        id: asString(item.id, fileName.replace(/\.mdx$/, "")),
        title: asString(item.title),
        medium: asString(item.medium) as ProofItem["medium"],
        tracks: asTrackArray(item.tracks),
        url: asString(item.url) || undefined,
        featured: asBoolean(item.featured),
        hidden: asBoolean(item.hidden),
        metric: asString(item.metric) || undefined,
        sourceLabel: asString(item.sourceLabel),
        summary: asString(item.summary),
        publishedAt: asString(item.publishedAt) || undefined
      } satisfies ProofItem;
    })
  );

  // We sort newest proof first when dates exist so public evidence feels current without hand-ordering every file.
  return items.sort((left, right) => {
    const leftTime = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
    const rightTime = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
    return rightTime - leftTime;
  });
});

export function getVisibleProofItems(items: ProofItem[]): ProofItem[] {
  // Hidden entries and proof without live URLs stay in the content model but never reach the public UI.
  return items.filter((item) => !item.hidden && Boolean(item.url));
}

export function getTrackProofItems(items: ProofItem[], slug: TrackSlug): ProofItem[] {
  return getVisibleProofItems(items).filter((item) => item.tracks.includes(slug));
}

export function getFeaturedProofItems(items: ProofItem[]): ProofItem[] {
  return getVisibleProofItems(items).filter((item) => item.featured);
}
