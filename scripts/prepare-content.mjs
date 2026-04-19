/*
This script stages Shomosite's canonical source notes into the temporary Quartz
content directory. It exists because the repo's real source of truth is split
across `docs/`, `prose/`, and `product/`, while Quartz expects one content root.
It talks to those source trees, rewrites source-shaped prose and product folders
into clean public routes, and emits sidenote preview fragments for prose notes
that should be previewable without becoming standalone public pages.
*/

import path from "node:path"
import { fileURLToPath } from "node:url"
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import matter from "gray-matter"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import { toHtml } from "hast-util-to-html"

const INTERNAL_DOC_FILES = new Set([
  "ARCHITECTURE.md",
  "DEVLOG.md",
  "SYSTEM-DESIGN.md",
  "_J-Agent.md",
  "_J-Shomosite.md",
  "home.md",
])

const INTERNAL_PRODUCT_DOC_SEGMENTS = new Set(["journals", ".obsidian"])

const thisFile = fileURLToPath(import.meta.url)
const thisDir = path.dirname(thisFile)
const repoRoot = path.resolve(thisDir, "..")
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US")
const REACH_REPORT_SECTION_PATTERN = /<section\s+class="vanity-metrics"[\s\S]*?<\/section>/
const REACH_REQUEST_HEADERS = {
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "user-agent": "Mozilla/5.0 (compatible; ShomositeReachBot/1.0; +https://shomodip.com)",
}
const YOUTUBE_ABOUT_URL = "https://www.youtube.com/@armchairdescending/about"
const SUBSTACK_PROFILE_URL = "https://substack.com/@shomodip"
const SUBSTACK_ARCHIVE_URL = "https://armchairdescending.substack.com/api/v1/archive"
const MANUAL_SUBSTACK_VIEW_COUNT = 458
const MANUAL_YOUTUBE_COMMENT_COUNT = 464
const MANUAL_X_FOLLOWER_COUNT = 96

function formatCount(value) {
  return NUMBER_FORMATTER.format(value)
}

function parseNumber(value) {
  const digits = String(value).replace(/[^0-9]/g, "")

  if (!digits) {
    throw new Error(`Could not parse numeric value from "${value}"`)
  }

  return Number.parseInt(digits, 10)
}

async function fetchMetricText(url, accept = REACH_REQUEST_HEADERS.accept, { useDefaultHeaders = false } = {}) {
  const response = await fetch(
    url,
    useDefaultHeaders
      ? undefined
      : {
          headers: {
            ...REACH_REQUEST_HEADERS,
            accept,
          },
        },
  )

  if (!response.ok) {
    throw new Error(`Fetch failed for ${url}: ${response.status}`)
  }

  return response.text()
}

async function fetchMetricJson(url) {
  const text = await fetchMetricText(url, "application/json, text/plain;q=0.9, */*;q=0.8")
  return JSON.parse(text)
}

function createReachMetric(breakdown) {
  const cleaned = breakdown
    .filter((item) => Number.isFinite(item.value))
    .sort((left, right) => right.value - left.value)

  return {
    value: cleaned.reduce((sum, item) => sum + item.value, 0),
    breakdown: cleaned,
  }
}

function formatBreakdown(breakdown) {
  if (!Array.isArray(breakdown) || breakdown.length === 0) {
    return "Not publicly exposed"
  }

  return breakdown.map((item) => `${item.label} ${formatCount(item.value)}`).join(" · ")
}

async function getYouTubeReachSummary() {
  const aboutPage = await fetchMetricText(YOUTUBE_ABOUT_URL)
  const metadataMatch = aboutPage.match(
    /subscriberCountText\":\"([^\"]+)\",\"viewCountText\":\"([^\"]+)\"[\s\S]*?\"channelId\":\"([^\"]+)\"[\s\S]*?\"videoCountText\":\"([^\"]+)\"/,
  )

  if (!metadataMatch) {
    throw new Error("Could not parse the YouTube channel about page")
  }

  const [, subscriberText, viewText, channelId] = metadataMatch
  const feedXml = await fetchMetricText(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)
  const videoIds = [...feedXml.matchAll(/<yt:videoId>([^<]+)<\/yt:videoId>/g)].map((match) => match[1])
  const uniqueVideoIds = [...new Set(videoIds)]
  const likeResults = await Promise.allSettled(
    uniqueVideoIds.map(async (videoId) => {
      const watchPage = await fetchMetricText(`https://www.youtube.com/watch?v=${videoId}`)
      const likeMatch = watchPage.match(/\"likeCount\":\"([0-9,]+)\"/)
      if (!likeMatch) {
        throw new Error(`Could not parse likeCount for ${videoId}`)
      }

      return parseNumber(likeMatch[1])
    }),
  )
  const parsedLikeCounts = likeResults
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value)
  const likes = parsedLikeCounts.length === uniqueVideoIds.length && uniqueVideoIds.length > 0
    ? parsedLikeCounts.reduce((sum, value) => sum + value, 0)
    : null

  return {
    subscribers: parseNumber(subscriberText),
    views: parseNumber(viewText),
    likes,
  }
}

async function getSubstackReachSummary() {
  const profilePage = await fetchMetricText(SUBSTACK_PROFILE_URL)
  const subscriberMatch = profilePage.match(/([0-9,]+) subscribers/)

  if (!subscriberMatch) {
    throw new Error("Could not parse the Substack profile subscriber count")
  }

  const archive = await fetchMetricJson(SUBSTACK_ARCHIVE_URL)

  return {
    subscribers: parseNumber(subscriberMatch[1]),
    likes: archive.reduce((sum, post) => sum + (post.reaction_count ?? 0), 0),
    comments: archive.reduce((sum, post) => sum + (post.comment_count ?? 0), 0),
  }
}


async function buildReachReportSnapshot() {
  const [youtubeResult, substackResult] = await Promise.allSettled([
    getYouTubeReachSummary(),
    getSubstackReachSummary(),
  ])

  const metrics = {}
  const viewsBreakdown = []
  const commentsBreakdown = [{ label: "YouTube comments", value: MANUAL_YOUTUBE_COMMENT_COUNT }]
  const likesBreakdown = []
  const subscribersBreakdown = [{ label: "X followers", value: MANUAL_X_FOLLOWER_COUNT }]

  if (youtubeResult.status === "fulfilled") {
    viewsBreakdown.push({ label: "YouTube", value: youtubeResult.value.views })
    subscribersBreakdown.push({ label: "YouTube", value: youtubeResult.value.subscribers })

    if (youtubeResult.value.likes !== null) {
      likesBreakdown.push({ label: "YouTube likes", value: youtubeResult.value.likes })
    }
  }

  if (substackResult.status === "fulfilled") {
    viewsBreakdown.push({ label: "Substack", value: MANUAL_SUBSTACK_VIEW_COUNT })
    commentsBreakdown.push({
      label: "Substack archive comments",
      value: substackResult.value.comments,
    })
    likesBreakdown.push({ label: "Substack reactions", value: substackResult.value.likes })
    subscribersBreakdown.push({
      label: "Substack profile",
      value: substackResult.value.subscribers,
    })
  }

  if (viewsBreakdown.length > 0) {
    metrics.views = createReachMetric(viewsBreakdown)
  }
  metrics.comments = createReachMetric(commentsBreakdown)

  if (likesBreakdown.length > 0) {
    metrics.likes = createReachMetric(likesBreakdown)
  }

  if (subscribersBreakdown.length > 0) {
    metrics.subscribers = createReachMetric(subscribersBreakdown)
  }


  return {
    generatedAt: new Date().toISOString(),
    metrics,
  }
}

function renderReachReportSection(snapshot) {
  const metricDefinitions = [
    { key: "views", label: "Views" },
    { key: "comments", label: "Comments" },
    { key: "likes", label: "Likes" },
    { key: "subscribers", label: "Subscribers" },
  ]

  const stats = metricDefinitions
    .map(({ key, label }) => {
      const metric = snapshot.metrics[key]
      const value = metric ? formatCount(metric.value) : "—"
      const tooltip = metric ? formatBreakdown(metric.breakdown) : "Not publicly exposed"

      return `    <li class="vanity-metrics__stat" tabindex="0" data-metric="${key}">
      <span class="vanity-metrics__num">${escapeHtml(value)}</span>
      <span class="vanity-metrics__label">${escapeHtml(label)}</span>
      <span class="vanity-metrics__tooltip" role="tooltip">${escapeHtml(tooltip)}</span>
    </li>`
    })
    .join("\n")

  const cornerHint = "From platforms I publish on — not this site."

  return `<section class="vanity-metrics" aria-label="Elsewhere" data-generated-at="${escapeHtml(snapshot.generatedAt)}">
  <span class="vanity-metrics__corner" tabindex="0" aria-describedby="vanity-metrics-elsewhere-hint">Elsewhere<span id="vanity-metrics-elsewhere-hint" class="vanity-metrics__corner-hint" role="tooltip">${escapeHtml(cornerHint)}</span></span>
  <ol class="vanity-metrics__grid">
${stats}
  </ol>
</section>`
}

function toPosix(value) {
  return value.split(path.sep).join("/")
}

function stripMarkdownExtension(relativePath) {
  return relativePath.replace(/\.md$/i, "")
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

async function pathExists(candidate) {
  try {
    await readdir(candidate)
    return true
  } catch {
    return false
  }
}

async function fileExists(candidate) {
  try {
    await readFile(candidate, "utf8")
    return true
  } catch {
    return false
  }
}

async function copyTree(sourceDir, targetDir, shouldInclude = () => true) {
  if (!(await pathExists(sourceDir))) {
    return
  }

  await mkdir(targetDir, { recursive: true })
  const entries = await readdir(sourceDir, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name)
    const relativePath = toPosix(path.relative(sourceDir, sourcePath))
    if (!shouldInclude(relativePath)) {
      continue
    }

    const targetPath = path.join(targetDir, entry.name)

    // Copy directories entry-by-entry so staging remains idempotent even when the target root already exists.
    if (entry.isDirectory()) {
      await copyTree(sourcePath, targetPath, (nestedRelativePath) => {
        const composedPath = nestedRelativePath ? `${relativePath}/${nestedRelativePath}` : relativePath
        return shouldInclude(composedPath)
      })
      continue
    }

    await mkdir(path.dirname(targetPath), { recursive: true })
    await cp(sourcePath, targetPath, { force: true })
  }
}

async function collectRelativeFiles(rootDir) {
  if (!(await pathExists(rootDir))) {
    return []
  }

  const files = []

  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name)
      const relativePath = toPosix(path.relative(rootDir, absolutePath))

      if (entry.isDirectory()) {
        await walk(absolutePath)
        continue
      }

      files.push(relativePath)
    }
  }

  await walk(rootDir)
  return files.sort()
}

function mergeAliases(existingAliases, newAliases) {
  const merged = [...existingAliases, ...newAliases]
    .map((alias) => String(alias).trim())
    .filter((alias) => alias.length > 0)

  return [...new Set(merged)]
}

async function writeMarkdownWithAliases(sourceFile, targetFile, { aliases = [], transformContent } = {}) {
  const raw = await readFile(sourceFile, "utf8")
  const parsed = matter(raw)
  const existingAliases = Array.isArray(parsed.data.aliases) ? parsed.data.aliases : []
  const nextAliases = mergeAliases(existingAliases, aliases)
  const nextContent = transformContent ? await transformContent(parsed.content, parsed.data) : parsed.content
  const nextData = nextAliases.length > 0 ? { ...parsed.data, aliases: nextAliases } : parsed.data

  await mkdir(path.dirname(targetFile), { recursive: true })
  await writeFile(targetFile, matter.stringify(nextContent, nextData))
}

async function renderMarkdownFragment(markdown) {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype)
  const parsed = processor.parse(markdown)
  const hast = await processor.run(parsed)
  return toHtml(hast)
}

function createSidenoteFragment({ title, body }) {
  const renderedTitle = title
    ? `<header class="sidenote-fragment__header"><p class="sidenote-fragment__eyebrow">Note</p><h2>${escapeHtml(title)}</h2></header>`
    : ""

  return `<!doctype html>
<html lang="en">
  <body>
    <article class="popover-hint sidenote-fragment">
      ${renderedTitle}
      ${body}
    </article>
  </body>
</html>`
}

async function buildSidenoteCatalog(notesDir, outputDir) {
  if (!(await pathExists(notesDir))) {
    return new Map()
  }

  const catalog = new Map()
  const noteFiles = (await collectRelativeFiles(notesDir)).filter((relativePath) =>
    relativePath.endsWith(".md"),
  )

  for (const relativePath of noteFiles) {
    const sourceFile = path.join(notesDir, relativePath)
    const raw = await readFile(sourceFile, "utf8")
    const parsed = matter(raw)
    const noteKey = `notes/${stripMarkdownExtension(relativePath)}`
    const fileName = path.posix.basename(relativePath, ".md")
    const title = typeof parsed.data.title === "string" ? parsed.data.title : fileName
    const body = await renderMarkdownFragment(parsed.content)
    // Quartz's asset emitter slugifies `.html` files into extensionless public
    // routes, so sidenote fragments are staged that way from the start. The
    // link hrefs then match both local `public/` output and Cloudflare Pages.
    const fragmentFile = path.join(outputDir, stripMarkdownExtension(relativePath))

    await mkdir(path.dirname(fragmentFile), { recursive: true })
    await writeFile(fragmentFile, createSidenoteFragment({ title, body }))

    catalog.set(noteKey, {
      absolutePath: fragmentFile,
      title,
    })
  }

  return catalog
}

function rewriteSidenoteLinks(content, { catalog, pageTargetFile }) {
  return content.replace(/\[\[notes\/([^|\]]+?)(?:\|([^\]]+))?\]\]/g, (_match, rawPath, rawLabel) => {
    const notePath = String(rawPath).replace(/\.md$/i, "")
    const noteKey = `notes/${notePath}`
    const note = catalog.get(noteKey)
    const label = String(rawLabel ?? note?.title ?? path.posix.basename(notePath))

    // Missing sidenotes should degrade to plain text rather than advertise a dead public target.
    if (!note) {
      return escapeHtml(label)
    }

    const previewPath = toPosix(path.relative(path.dirname(pageTargetFile), note.absolutePath))
    return `<a href="#" class="internal sidenote-ref" data-sidenote="true" data-preview="${escapeHtml(previewPath)}">${escapeHtml(label)}</a>`
  })
}

function shouldPublishFromDocs(relativePath) {
  const fileName = path.posix.basename(relativePath)

  if (relativePath.startsWith(".obsidian/")) {
    return false
  }

  // Operational narration files stay in-repo but never enter the Quartz staging area.
  if (INTERNAL_DOC_FILES.has(fileName)) {
    return false
  }

  // `docs/index.md` becomes the home page instead of a second public copy under `/docs/index`.
  return relativePath !== "index.md"
}

function shouldPublishProductDoc(relativePath) {
  return ![...INTERNAL_PRODUCT_DOC_SEGMENTS].some((segment) => {
    return relativePath === segment || relativePath.startsWith(`${segment}/`)
  })
}

async function removePathWithRetry(targetPath, attempts = 4) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await rm(targetPath, { recursive: true, force: true })
      return
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? error.code : ""
      if (!["ENOTEMPTY", "EBUSY"].includes(String(code)) || attempt === attempts) {
        throw error
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 40))
    }
  }
}

async function clearDirectory(targetDir) {
  await mkdir(targetDir, { recursive: true })
  const entries = await readdir(targetDir, { withFileTypes: true })

  for (const entry of entries) {
    await removePathWithRetry(path.join(targetDir, entry.name))
  }
}

async function mirrorHomePage(
  rootDir,
  outputDir,
  { buildReachReportSnapshot: getReachReportSnapshot = buildReachReportSnapshot } = {},
) {
  const homeSource = path.join(rootDir, "docs", "index.md")
  const raw = await readFile(homeSource, "utf8")
  const parsed = matter(raw)
  const aliases = Array.isArray(parsed.data.aliases)
    ? [...parsed.data.aliases.map((entry) => String(entry))]
    : []

  // The home note remains canonically authored in `docs/index.md`, but Quartz needs a root index file.
  if (!aliases.includes("docs/index")) {
    aliases.push("docs/index")
  }

  const home = parsed.data.home && typeof parsed.data.home === "object" ? parsed.data.home : undefined
  const normalizedHome =
    home && typeof home === "object"
      ? {
          ...home,
          product: Array.isArray(home.product)
            ? home.product.map((entry) => String(entry).replace(/\/index$/, ""))
            : home.product,
        }
      : home
  let nextContent = parsed.content

  if (REACH_REPORT_SECTION_PATTERN.test(nextContent)) {
    const snapshot = await getReachReportSnapshot()
    nextContent = nextContent.replace(REACH_REPORT_SECTION_PATTERN, renderReachReportSection(snapshot))
  }

  const output = matter.stringify(nextContent, {
    ...parsed.data,
    aliases,
    ...(normalizedHome !== undefined ? { home: normalizedHome } : {}),
  })

  await writeFile(path.join(outputDir, "index.md"), output)
}

async function stageProse(rootDir, outputDir) {
  const proseRoot = path.join(rootDir, "prose")
  const outputRoot = path.join(outputDir, "prose")
  const entries = await readdir(proseRoot, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(proseRoot, entry.name)

    if (entry.isFile() && entry.name === "index.md") {
      await writeMarkdownWithAliases(sourcePath, path.join(outputRoot, "index.md"))
      continue
    }

    if (!entry.isDirectory()) {
      continue
    }

    const slug = entry.name
    const rootNote = path.join(sourcePath, `${slug}.md`)
    if (!(await fileExists(rootNote))) {
      continue
    }

    const targetPage = path.join(outputRoot, slug, "index.md")
    const sidenoteCatalog = await buildSidenoteCatalog(
      path.join(sourcePath, "notes"),
      path.join(outputDir, "static", "sidenotes", "prose", slug),
    )

    await writeMarkdownWithAliases(rootNote, targetPage, {
      aliases: [`prose/${slug}/${slug}`],
      transformContent: async (content) =>
        rewriteSidenoteLinks(content, {
          catalog: sidenoteCatalog,
          pageTargetFile: targetPage,
        }),
    })

    // Assets remain adjacent to the essay root so relative links keep working after staging.
    await copyTree(path.join(sourcePath, "assets"), path.join(outputRoot, slug, "assets"))
  }
}

async function stageProduct(rootDir, outputDir) {
  const productRoot = path.join(rootDir, "product")
  const outputRoot = path.join(outputDir, "product")
  const entries = await readdir(productRoot, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(productRoot, entry.name)

    if (entry.isFile() && entry.name === "index.md") {
      await writeMarkdownWithAliases(sourcePath, path.join(outputRoot, "index.md"))
      continue
    }

    if (!entry.isDirectory()) {
      continue
    }

    const slug = entry.name
    const docsRoot = path.join(sourcePath, "docs")
    if (!(await pathExists(docsRoot))) {
      continue
    }

    const files = (await collectRelativeFiles(docsRoot)).filter((relativePath) =>
      shouldPublishProductDoc(relativePath),
    )

    for (const relativePath of files) {
      const sourceFile = path.join(docsRoot, relativePath)
      const targetRelativePath = relativePath === "index.md" ? "index.md" : relativePath
      const targetFile = path.join(outputRoot, slug, targetRelativePath)

      if (relativePath.endsWith(".md")) {
        // The public route hides the internal `/docs` segment, but aliases keep source-shaped links valid.
        await writeMarkdownWithAliases(sourceFile, targetFile, {
          aliases: [`product/${slug}/docs/${stripMarkdownExtension(relativePath)}`],
        })
        continue
      }

      await mkdir(path.dirname(targetFile), { recursive: true })
      await cp(sourceFile, targetFile, { force: true })
    }

    // Sibling product assets are still public and should survive the route flattening.
    await copyTree(path.join(sourcePath, "assets"), path.join(outputRoot, slug, "assets"))
  }
}

export async function prepareContent({
  rootDir = repoRoot,
  outputDir = path.join(repoRoot, ".quartz-content"),
  buildReachReportSnapshot: getReachReportSnapshot = buildReachReportSnapshot,
} = {}) {
  await clearDirectory(outputDir)

  // The docs tree is copied with a tighter gate because it mixes public notes and operational narration.
  await copyTree(path.join(rootDir, "docs"), path.join(outputDir, "docs"), shouldPublishFromDocs)

  // Prose and product are restaged into clean public routes while keeping the source vault structure intact.
  await stageProse(rootDir, outputDir)
  await stageProduct(rootDir, outputDir)
  await mirrorHomePage(rootDir, outputDir, { buildReachReportSnapshot: getReachReportSnapshot })
}

const isDirectRun = path.resolve(process.argv[1] ?? "") === thisFile

if (isDirectRun) {
  prepareContent().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
