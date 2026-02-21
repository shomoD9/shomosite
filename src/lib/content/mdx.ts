/*
 * This file loads local MDX content for books and tools and converts it to renderable HTML.
 * It is isolated so editorial parsing remains independent from route composition and feed adapters.
 * The books/tools routes call these functions to obtain strongly typed entries with rich body content.
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import type { BookEntry, ToolEntry } from "@/types/content";

const rootDir = process.cwd();
const booksDir = path.join(rootDir, "content", "books");
const toolsDir = path.join(rootDir, "content", "tools");

function stripNarrativeHeader(source: string): string {
  // MDX files begin with a prose comment header per project rules, so we strip it before frontmatter parsing.
  return source.replace(/^\s*\{\/\*[\s\S]*?\*\/\}\s*/, "");
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}

function toDateOrEpoch(input: string | undefined): string {
  if (!input) {
    return new Date(0).toISOString();
  }

  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString();
}

export async function getBooks(): Promise<BookEntry[]> {
  const filenames = (await readdir(booksDir)).filter((name) => name.endsWith(".mdx"));

  const books = await Promise.all(
    filenames.map(async (filename) => {
      const filepath = path.join(booksDir, filename);
      const raw = await readFile(filepath, "utf-8");
      const normalized = stripNarrativeHeader(raw);
      const { data, content } = matter(normalized);
      const bodyHtml = await markdownToHtml(content);

      return {
        id: String(data.id || filename.replace(/\.mdx$/, "")),
        source: "local",
        slug: String(data.slug || filename.replace(/\.mdx$/, "")),
        title: String(data.title || "Untitled Book"),
        summary: String(data.summary || "No summary provided."),
        publishedAt: toDateOrEpoch(typeof data.publishedAt === "string" ? data.publishedAt : undefined),
        url: String(data.url || "#"),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : ["book"],
        author: String(data.author || "Unknown author"),
        cover: typeof data.cover === "string" ? data.cover : undefined,
        status:
          data.status === "in-progress" || data.status === "published"
            ? data.status
            : "published",
        links: {
          primary: String(data.primaryLink || data.url || "#"),
          secondary: typeof data.secondaryLink === "string" ? data.secondaryLink : undefined
        },
        bodyHtml
      } satisfies BookEntry;
    })
  );

  return books.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getTools(): Promise<ToolEntry[]> {
  const filenames = (await readdir(toolsDir)).filter((name) => name.endsWith(".mdx"));

  const tools = await Promise.all(
    filenames.map(async (filename) => {
      const filepath = path.join(toolsDir, filename);
      const raw = await readFile(filepath, "utf-8");
      const normalized = stripNarrativeHeader(raw);
      const { data, content } = matter(normalized);
      const bodyHtml = await markdownToHtml(content);

      return {
        id: String(data.id || filename.replace(/\.mdx$/, "")),
        source: "local",
        slug: String(data.slug || filename.replace(/\.mdx$/, "")),
        title: String(data.title || "Untitled Tool"),
        summary: String(data.summary || "No summary provided."),
        publishedAt: toDateOrEpoch(typeof data.publishedAt === "string" ? data.publishedAt : undefined),
        url: String(data.liveUrl || data.repoUrl || "#"),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : ["tool"],
        platform:
          data.platform === "web" ||
          data.platform === "chrome" ||
          data.platform === "desktop" ||
          data.platform === "mixed"
            ? data.platform
            : "web",
        status:
          data.status === "active" || data.status === "archived" || data.status === "experimental"
            ? data.status
            : "active",
        repoUrl: String(data.repoUrl || "#"),
        liveUrl: typeof data.liveUrl === "string" ? data.liveUrl : undefined,
        chromeStoreUrl:
          typeof data.chromeStoreUrl === "string" ? data.chromeStoreUrl : undefined,
        bodyHtml
      } satisfies ToolEntry;
    })
  );

  return tools.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
