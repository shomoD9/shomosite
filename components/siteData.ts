/*
This file is the small domain library for Shomosite's note listings. It exists
separately because the homepage, prose index, and product index all need the
same vocabulary for resolving summaries, grouping notes, and sorting public
entries. It talks to Quartz's parsed page data but exports site-specific slices
that the presentational components can render without re-deriving the rules.
*/

import { QuartzPluginData } from "../quartz/plugins/vfile"

export type HomeSection = "prose" | "product"

export type TopicGroup = {
  topic: string
  pages: QuartzPluginData[]
}

export type ProductCluster = {
  slug: string
  root: QuartzPluginData
  docs: QuartzPluginData[]
}

export function getSlug(input: QuartzPluginData | string | undefined): string {
  if (!input) {
    return ""
  }

  return typeof input === "string" ? input : (input.slug ?? "")
}

function normalizeSlugCandidate(candidate: string): string {
  return candidate.replace(/^\/+|\/+$/g, "").replace(/\/index$/, "")
}

function isSectionRoot(page: QuartzPluginData, section: "prose" | "product"): boolean {
  const slug = page.slug ?? ""
  const segments = slug.split("/")
  return slug.startsWith(`${section}/`) && slug.endsWith("/index") && segments.length === 3
}

export function isHomePage(input: QuartzPluginData | string | undefined): boolean {
  return getSlug(input) === "index"
}

export function isSectionIndexPage(input: QuartzPluginData | string | undefined): boolean {
  const slug = getSlug(input)
  return slug === "prose/index" || slug === "product/index" || slug === "docs/index"
}

export function isProseNotePage(input: QuartzPluginData | string | undefined): boolean {
  const slug = getSlug(input)
  return slug.startsWith("prose/") && slug !== "prose/index"
}

export function isProductNotePage(input: QuartzPluginData | string | undefined): boolean {
  const slug = getSlug(input)
  return slug.startsWith("product/") && slug !== "product/index"
}

export function isPrimaryNotePage(input: QuartzPluginData | string | undefined): boolean {
  return isProseNotePage(input) || isProductNotePage(input)
}

function getPrimaryDate(page: QuartzPluginData): Date | undefined {
  return page.dates?.published ?? page.dates?.modified ?? page.dates?.created
}

export function sortPages(pages: QuartzPluginData[]): QuartzPluginData[] {
  return [...pages].sort((left, right) => {
    const leftDate = getPrimaryDate(left)?.getTime()
    const rightDate = getPrimaryDate(right)?.getTime()

    // When dates exist, newer notes should rise first because this site is a live knowledge system.
    if (leftDate && rightDate && leftDate !== rightDate) {
      return rightDate - leftDate
    }

    if (leftDate && !rightDate) {
      return -1
    }

    if (!leftDate && rightDate) {
      return 1
    }

    const leftTitle = getTitle(left).toLowerCase()
    const rightTitle = getTitle(right).toLowerCase()
    return leftTitle.localeCompare(rightTitle)
  })
}

export function getTitle(page: QuartzPluginData): string {
  const title = page.frontmatter?.title
  return typeof title === "string" ? title : page.slug ?? "Untitled"
}

export function getSummary(page: QuartzPluginData): string {
  const summary = page.frontmatter?.summary
  if (typeof summary === "string") {
    return summary
  }

  return typeof page.description === "string" ? page.description : ""
}

export function getTopics(page: QuartzPluginData): string[] {
  const topics = page.frontmatter?.topics
  if (Array.isArray(topics)) {
    return topics.map((topic) => String(topic))
  }

  if (typeof topics === "string" && topics.trim().length > 0) {
    return [topics]
  }

  return []
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

  // The homepage is deliberately editorial, so the declared order in frontmatter is preserved.
  return curated
    .map((slug) => {
      const normalized = normalizeSlugCandidate(String(slug))
      return allFiles.find((page) => normalizeSlugCandidate(page.slug ?? "") === normalized)
    })
    .filter((page): page is QuartzPluginData => Boolean(page))
}

export function getProseTopicGroups(allFiles: QuartzPluginData[]): TopicGroup[] {
  const prosePages = allFiles.filter((page) => isSectionRoot(page, "prose"))

  const groups = new Map<string, QuartzPluginData[]>()
  for (const page of prosePages) {
    const topics = getTopics(page)
    for (const topic of topics) {
      const current = groups.get(topic) ?? []
      current.push(page)
      groups.set(topic, current)
    }
  }

  return [...groups.entries()]
    .map(([topic, pages]) => ({
      topic,
      pages: sortPages(pages),
    }))
    .sort((left, right) => left.topic.localeCompare(right.topic))
}

export function getProductClusters(allFiles: QuartzPluginData[]): ProductCluster[] {
  const productRoots = allFiles.filter((page) => isSectionRoot(page, "product"))

  return sortPages(productRoots).map((root) => {
    const folder = root.slug!.replace(/\/index$/, "")
    const docs = sortPages(
      allFiles.filter((page) => {
        return page.slug?.startsWith(`${folder}/`) && page.slug !== root.slug
      }),
    )

    return {
      slug: folder,
      root,
      docs,
    }
  })
}

export function getDocsPages(allFiles: QuartzPluginData[]): QuartzPluginData[] {
  return sortPages(
    allFiles.filter((page) => {
      return page.slug?.startsWith("docs/") && page.slug !== "docs/index"
    }),
  )
}
