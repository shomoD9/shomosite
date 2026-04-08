/*
This script stages Shomosite's canonical source notes into the temporary Quartz
content directory. It exists because the repo's real source of truth is split
across `docs/`, `prose/`, and `product/`, while Quartz expects one content root.
It talks to those source trees, filters out operational docs that should never
be published, and writes the mirrored homepage file that Quartz needs at the root.
*/

import path from "node:path"
import { fileURLToPath } from "node:url"
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import matter from "gray-matter"

const INTERNAL_DOC_FILES = new Set([
  "ARCHITECTURE.md",
  "DEVLOG.md",
  "SYSTEM-DESIGN.md",
  "_J-Agent.md",
  "_J-Shomosite.md",
  "home.md",
])

const thisFile = fileURLToPath(import.meta.url)
const thisDir = path.dirname(thisFile)
const repoRoot = path.resolve(thisDir, "..")

async function copyTree(sourceDir, targetDir, shouldInclude = () => true) {
  await cp(sourceDir, targetDir, {
    recursive: true,
    force: true,
    filter: (sourcePath) => {
      const relativePath = path.relative(sourceDir, sourcePath).split(path.sep).join("/")

      // The root directory must always exist so the children can be evaluated individually.
      if (relativePath === "") {
        return true
      }

      return shouldInclude(relativePath)
    },
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

async function mirrorHomePage(rootDir, outputDir) {
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

  const output = matter.stringify(parsed.content, {
    ...parsed.data,
    aliases,
  })

  await writeFile(path.join(outputDir, "index.md"), output)
}

export async function prepareContent({
  rootDir = repoRoot,
  outputDir = path.join(repoRoot, ".quartz-content"),
} = {}) {
  await rm(outputDir, { recursive: true, force: true })
  await mkdir(outputDir, { recursive: true })

  // The docs tree is copied with a tighter gate because it mixes public notes and operational narration.
  await copyTree(path.join(rootDir, "docs"), path.join(outputDir, "docs"), shouldPublishFromDocs)

  // Prose and product are already source-shaped public-candidate trees, so they can move over intact.
  await copyTree(path.join(rootDir, "prose"), path.join(outputDir, "prose"))
  await copyTree(path.join(rootDir, "product"), path.join(outputDir, "product"))
  await mirrorHomePage(rootDir, outputDir)
}

const isDirectRun = path.resolve(process.argv[1] ?? "") === thisFile

if (isDirectRun) {
  prepareContent().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
