/*
This script stages Shomosite's archive sources into the temporary Quartz content
directory. It maps internal source folders onto the public IA: root editorial
pages, topic and chronology archives, prose renditions, product documentation,
and unlisted direct-link attachments.
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

const INTERNAL_PRODUCT_DOC_SEGMENTS = new Set(["journals", ".obsidian"])
const ROOT_EDITORIAL_PAGES = [
  { sourceName: "about.md", slug: "about" },
  { sourceName: "DESIGN.md", slug: "design" },
]

const thisFile = fileURLToPath(import.meta.url)
const thisDir = path.dirname(thisFile)
const repoRoot = path.resolve(thisDir, "..")

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
    // Quartz's asset emitter slugifies `.html` files into extensionless rendered
    // routes, so sidenote fragments are staged that way from the start. The
    // link hrefs then match both local build output and Cloudflare Pages.
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

    // Missing sidenotes should degrade to plain text rather than advertise a dead target.
    if (!note) {
      return escapeHtml(label)
    }

    const previewPath = toPosix(path.relative(path.dirname(pageTargetFile), note.absolutePath))
    return `<a href="#" class="internal sidenote-ref" data-sidenote="true" data-preview="${escapeHtml(previewPath)}">${escapeHtml(label)}</a>`
  })
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

async function mirrorHomePage(rootDir, outputDir) {
  const homeSource = path.join(rootDir, "docs", "index.md")
  const raw = await readFile(homeSource, "utf8")
  const parsed = matter(raw)

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

  const output = matter.stringify(parsed.content, {
    ...parsed.data,
    ...(normalizedHome !== undefined ? { home: normalizedHome } : {}),
  })

  await writeFile(path.join(outputDir, "index.md"), output)
}

async function stageRootEditorialPages(rootDir, outputDir) {
  for (const page of ROOT_EDITORIAL_PAGES) {
    const sourceFile = path.join(rootDir, "docs", page.sourceName)
    if (!(await fileExists(sourceFile))) {
      continue
    }

    // About and Design are authored beside internal docs but publish at root routes.
    await writeMarkdownWithAliases(sourceFile, path.join(outputDir, page.slug, "index.md"))
  }
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

    if (entry.isFile() && entry.name === "all.md") {
      await writeMarkdownWithAliases(sourcePath, path.join(outputRoot, "all", "index.md"))
      continue
    }

    if (entry.isDirectory() && entry.name === "topics") {
      const topicFiles = (await collectRelativeFiles(sourcePath)).filter((relativePath) =>
        relativePath.endsWith(".md"),
      )
      for (const relativePath of topicFiles) {
        const topicSlug = stripMarkdownExtension(relativePath)
        await writeMarkdownWithAliases(
          path.join(sourcePath, relativePath),
          path.join(outputRoot, "topics", topicSlug, "index.md"),
        )
      }
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
      const targetRelativePath =
        relativePath === "index.md" ? "index.md" : path.join("docs", relativePath)
      const targetFile = path.join(outputRoot, slug, targetRelativePath)

      if (relativePath.endsWith(".md")) {
        // Overview pages sit at the product root; supporting docs retain their public `/docs/` hierarchy.
        await writeMarkdownWithAliases(sourceFile, targetFile)
        continue
      }

      await mkdir(path.dirname(targetFile), { recursive: true })
      await cp(sourceFile, targetFile, { force: true })
    }

    // Sibling product assets are still publishable and should survive the route flattening.
    await copyTree(path.join(sourcePath, "assets"), path.join(outputRoot, slug, "assets"))
  }
}

export async function prepareContent({
  rootDir = repoRoot,
  outputDir = path.join(repoRoot, ".quartz-content"),
} = {}) {
  await clearDirectory(outputDir)

  // Internal documentation stays private; About and Design are staged as root editorial pages.
  await stageRootEditorialPages(rootDir, outputDir)

  // Prose and Product are the two public archive trees.
  await stageProse(rootDir, outputDir)
  await stageProduct(rootDir, outputDir)

  // Resume-linked evidence files keep clean root-level URLs while remaining outside every site index.
  await copyTree(path.join(rootDir, "attachments"), path.join(outputDir, "attachments"))
  await mirrorHomePage(rootDir, outputDir)
}

const isDirectRun = path.resolve(process.argv[1] ?? "") === thisFile

if (isDirectRun) {
  prepareContent().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
