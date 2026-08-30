/*
This file defines Shomosite's public information-architecture vocabulary. It is
shared by the homepage, archive indexes, page metadata, related-item lists, and
product documentation trees so every public surface classifies and orders
content the same way.
*/

import { QuartzPluginData } from "../quartz/plugins/vfile"

export type HomeSection = "prose" | "product"

export type ProseTopic = {
  slug: string
  label: string
  description: string
}

export type ProductCluster = {
  slug: string
  root: QuartzPluginData
  docs: QuartzPluginData[]
}

export const PROSE_TOPICS: ProseTopic[] = [
  {
    slug: "ai-intelligence",
    label: "AI & Intelligence",
    description: "Artificial intelligence, explanation, cognition, and the tools that extend thought.",
  },
  {
    slug: "knowledge-systems",
    label: "Knowledge & Systems",
    description: "Knowledge management, ontologies, context, research systems, and durable information.",
  },
  {
    slug: "product-design",
    label: "Product & Design",
    description: "Products, interfaces, design decisions, and the systems used to build them.",
  },
  {
    slug: "psychology-productivity",
    label: "Psychology & Productivity",
    description: "Attention, behavior, personal systems, motivation, and practical agency.",
  },
  {
    slug: "philosophy-culture",
    label: "Philosophy & Culture",
    description: "Worldviews, culture, criticism, meaning, and the ideas that shape human life.",
  },
]

const ROOT_NOTE_SLUGS = new Set(["about/index", "design/index"])
const PROSE_BROWSE_SLUGS = new Set(["prose/index", "prose/all/index"])

export function getSlug(input: QuartzPluginData | string | undefined): string {
  if (!input) {
    return ""
  }

  return typeof input === "string" ? input : (input.slug ?? "")
}

export function normalizeSlugCandidate(candidate: string): string {
  return candidate.replace(/^\/+|\/+$/g, "").replace(/\/index$/, "")
}

export function isHomePage(input: QuartzPluginData | string | undefined): boolean {
  return getSlug(input) === "index"
}

export function isProseBrowsePage(input: QuartzPluginData | string | undefined): boolean {
  const slug = getSlug(input)
  return PROSE_BROWSE_SLUGS.has(slug) || /^prose\/topics\/[^/]+\/index$/.test(slug)
}

export function isSectionIndexPage(input: QuartzPluginData | string | undefined): boolean {
  const slug = getSlug(input)
  return isProseBrowsePage(slug) || slug === "product/index"
}

export function isProseArticlePage(input: QuartzPluginData | string | undefined): boolean {
  const slug = getSlug(input)
  return /^prose\/[^/]+\/index$/.test(slug) && !isProseBrowsePage(slug)
}

export function isProductRootPage(input: QuartzPluginData | string | undefined): boolean {
  return /^product\/[^/]+\/index$/.test(getSlug(input))
}

export function isProductNotePage(input: QuartzPluginData | string | undefined): boolean {
  const slug = getSlug(input)
  return slug.startsWith("product/") && slug !== "product/index"
}

export function isRootNotePage(input: QuartzPluginData | string | undefined): boolean {
  return ROOT_NOTE_SLUGS.has(getSlug(input))
}

export function isMarginNotePage(input: QuartzPluginData | string | undefined): boolean {
  return isProseArticlePage(input)
}

export function isPrimaryNotePage(input: QuartzPluginData | string | undefined): boolean {
  return isProseArticlePage(input) || isProductNotePage(input) || isRootNotePage(input)
}

export function isArchiveItemPage(input: QuartzPluginData | string | undefined): boolean {
  return isProseArticlePage(input) || isProductNotePage(input)
}

function getFrontmatterString(page: QuartzPluginData, field: string): string {
  const value = page.frontmatter?.[field]
  return typeof value === "string" ? value : ""
}

function getPrimaryDate(page: QuartzPluginData): Date | undefined {
  return page.dates?.published ?? page.dates?.modified ?? page.dates?.created
}

function getAddedDate(page: QuartzPluginData): Date | undefined {
  const added = getFrontmatterString(page, "added")
  if (added) {
    const date = new Date(added)
    if (!Number.isNaN(date.getTime())) {
      return date
    }
  }

  return page.dates?.modified ?? page.dates?.created
}

function sortByDate(
  pages: QuartzPluginData[],
  dateForPage: (page: QuartzPluginData) => Date | undefined,
): QuartzPluginData[] {
  return [...pages].sort((left, right) => {
    const leftDate = dateForPage(left)?.getTime()
    const rightDate = dateForPage(right)?.getTime()

    if (leftDate && rightDate && leftDate !== rightDate) {
      return rightDate - leftDate
    }

    if (leftDate && !rightDate) {
      return -1
    }

    if (!leftDate && rightDate) {
      return 1
    }

    return getTitle(left).localeCompare(getTitle(right))
  })
}

export function sortPages(pages: QuartzPluginData[]): QuartzPluginData[] {
  return sortByDate(pages, getPrimaryDate)
}

export function sortRecentAdditions(pages: QuartzPluginData[]): QuartzPluginData[] {
  return sortByDate(pages, getAddedDate)
}

export function getTitle(page: QuartzPluginData): string {
  return getFrontmatterString(page, "title") || page.slug || "Untitled"
}

export function getSummary(page: QuartzPluginData): string {
  return getFrontmatterString(page, "summary") || (typeof page.description === "string" ? page.description : "")
}

export function getPrimaryTopic(page: QuartzPluginData): string {
  return getFrontmatterString(page, "primaryTopic")
}

export function getTopic(topicSlug: string): ProseTopic | undefined {
  return PROSE_TOPICS.find((topic) => topic.slug === topicSlug)
}

export function getItemType(page: QuartzPluginData): string {
  return getFrontmatterString(page, "itemType")
}

export function getItemStatus(page: QuartzPluginData): string {
  return getFrontmatterString(page, "status")
}

export function formatMetadataLabel(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ")
}

export function getProsePages(allFiles: QuartzPluginData[]): QuartzPluginData[] {
  return sortPages(allFiles.filter((page) => isProseArticlePage(page)))
}

export function getProsePagesForTopic(
  allFiles: QuartzPluginData[],
  topicSlug: string,
): QuartzPluginData[] {
  return getProsePages(allFiles).filter((page) => getPrimaryTopic(page) === topicSlug)
}

export function getProductClusters(allFiles: QuartzPluginData[]): ProductCluster[] {
  const roots = sortPages(allFiles.filter((page) => isProductRootPage(page)))

  return roots.map((root) => {
    const folder = root.slug!.replace(/\/index$/, "")
    const docs = sortPages(
      allFiles.filter((page) => page.slug?.startsWith(`${folder}/docs/`)),
    )

    return { slug: folder, root, docs }
  })
}

export function resolveHomeEntries(
  fileData: QuartzPluginData,
  allFiles: QuartzPluginData[],
  section: HomeSection,
): QuartzPluginData[] {
  const home = fileData.frontmatter?.home
  const curated =
    home && typeof home === "object" ? (home as Record<HomeSection, unknown>)[section] : undefined
  if (!Array.isArray(curated)) {
    return []
  }

  // Declared homepage order remains editorial rather than date-driven.
  return curated
    .map((slug) => {
      const normalized = normalizeSlugCandidate(String(slug))
      return allFiles.find((page) => normalizeSlugCandidate(page.slug ?? "") === normalized)
    })
    .filter((page): page is QuartzPluginData => Boolean(page))
}

export function getRecentArchiveEntries(allFiles: QuartzPluginData[], limit = 6): QuartzPluginData[] {
  const archiveEntries = allFiles.filter(
    (page) => isProseArticlePage(page) || isProductRootPage(page),
  )
  return sortRecentAdditions(archiveEntries).slice(0, limit)
}

export function getRelatedEntries(
  fileData: QuartzPluginData,
  allFiles: QuartzPluginData[],
): QuartzPluginData[] {
  const related = fileData.frontmatter?.related
  if (!Array.isArray(related)) {
    return []
  }

  return related
    .map((slug) => {
      const normalized = normalizeSlugCandidate(String(slug))
      return allFiles.find((page) => normalizeSlugCandidate(page.slug ?? "") === normalized)
    })
    .filter((page): page is QuartzPluginData => Boolean(page))
}
