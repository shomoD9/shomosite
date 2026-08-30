/*
This test file protects Shomosite's public information-architecture contracts.
It verifies route staging, unlisted attachments, the explicit publication gate,
and the classification helpers used by archive and catalog components.
*/

import assert from "node:assert/strict"
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
// @ts-ignore The prep script is plain ESM and is exercised directly in the contract tests.
import { prepareContent } from "../scripts/prepare-content.mjs"
import { PublishedState } from "../filters/PublishedState"
import {
  getProductClusters,
  getProsePages,
  getProsePagesForTopic,
  getRelatedEntries,
  isProseArticlePage,
  isProseBrowsePage,
} from "../components/siteData"

test("prepareContent stages the public IA and keeps internal docs private", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "shomosite-contracts-"))
  const outputDir = path.join(rootDir, ".quartz-content")

  try {
    await mkdir(path.join(rootDir, "docs"), { recursive: true })
    await mkdir(path.join(rootDir, "prose", "topics"), { recursive: true })
    await mkdir(path.join(rootDir, "prose", "example", "assets"), { recursive: true })
    await mkdir(path.join(rootDir, "prose", "example", "notes"), { recursive: true })
    await mkdir(path.join(rootDir, "product", "alpha", "docs", "guides"), { recursive: true })
    await mkdir(path.join(rootDir, "product", "alpha", "docs", "journals"), { recursive: true })
    await mkdir(path.join(rootDir, "product", "alpha", "assets"), { recursive: true })
    await mkdir(path.join(rootDir, "attachments"), { recursive: true })

    await writeFile(
      path.join(rootDir, "docs", "index.md"),
      `---
title: Home
state: published
---

Opening paragraph.`,
    )
    await writeFile(
      path.join(rootDir, "docs", "about.md"),
      `---
title: About
state: published
---

About page.`,
    )
    await writeFile(
      path.join(rootDir, "docs", "DESIGN.md"),
      `---
title: Design
state: published
---

Design page.`,
    )
    await writeFile(path.join(rootDir, "docs", "ARCHITECTURE.md"), "internal")
    await writeFile(
      path.join(rootDir, "prose", "index.md"),
      `---
title: Prose
state: published
---

Topic archive.`,
    )
    await writeFile(
      path.join(rootDir, "prose", "all.md"),
      `---
title: All Writing
state: published
---

Chronological archive.`,
    )
    await writeFile(
      path.join(rootDir, "prose", "topics", "knowledge-systems.md"),
      `---
title: Knowledge & Systems
state: published
topicSlug: knowledge-systems
---

Topic page.`,
    )
    await writeFile(
      path.join(rootDir, "prose", "example", "example.md"),
      `---
title: Example
state: published
primaryTopic: knowledge-systems
sourceName: Example Source
sourceUrl: https://example.com/article
published: 2026-05-01
added: 2026-06-07
designFamily: editorial-essay
related: []
---

Example prose with [[notes/gloss|a sidenote]].`,
    )
    await writeFile(path.join(rootDir, "prose", "example", "assets", "diagram.svg"), "<svg></svg>")
    await writeFile(
      path.join(rootDir, "prose", "example", "notes", "gloss.md"),
      `---
title: Gloss
---

This note should render only inside a preview.`,
    )
    await writeFile(
      path.join(rootDir, "product", "index.md"),
      `---
title: Product
state: published
---

Catalog.`,
    )
    await writeFile(
      path.join(rootDir, "product", "alpha", "docs", "index.md"),
      `---
title: Alpha
state: published
itemType: skill
status: active
related: []
---

Alpha overview.`,
    )
    await writeFile(
      path.join(rootDir, "product", "alpha", "docs", "guides", "start.md"),
      `---
title: Start
state: published
---

Alpha guide.`,
    )
    await writeFile(path.join(rootDir, "product", "alpha", "docs", "journals", "daily.md"), "private")
    await writeFile(path.join(rootDir, "product", "alpha", "assets", "logo.svg"), "<svg></svg>")
    await writeFile(path.join(rootDir, "attachments", "evidence.pdf"), "attachment")

    await prepareContent({ rootDir, outputDir })

    assert.match(await readFile(path.join(outputDir, "index.md"), "utf8"), /Opening paragraph\./)
    assert.match(await readFile(path.join(outputDir, "about", "index.md"), "utf8"), /About page\./)
    assert.match(await readFile(path.join(outputDir, "design", "index.md"), "utf8"), /Design page\./)
    assert.match(await readFile(path.join(outputDir, "prose", "all", "index.md"), "utf8"), /Chronological archive\./)
    assert.match(
      await readFile(path.join(outputDir, "prose", "topics", "knowledge-systems", "index.md"), "utf8"),
      /Topic page\./,
    )

    const prose = await readFile(path.join(outputDir, "prose", "example", "index.md"), "utf8")
    assert.match(prose, /class="internal sidenote-ref"/)
    assert.match(prose, /static\/sidenotes\/prose\/example\/gloss/)
    assert.match(
      await readFile(path.join(outputDir, "static", "sidenotes", "prose", "example", "gloss"), "utf8"),
      /This note should render only inside a preview\./,
    )

    assert.match(
      await readFile(path.join(outputDir, "product", "alpha", "index.md"), "utf8"),
      /Alpha overview\./,
    )
    assert.match(
      await readFile(path.join(outputDir, "product", "alpha", "docs", "guides", "start.md"), "utf8"),
      /Alpha guide\./,
    )

    await access(path.join(outputDir, "prose", "example", "assets", "diagram.svg"))
    await access(path.join(outputDir, "product", "alpha", "assets", "logo.svg"))
    await access(path.join(outputDir, "attachments", "evidence.pdf"))

    await assert.rejects(access(path.join(outputDir, "docs")))
    await assert.rejects(access(path.join(outputDir, "prose", "example", "notes", "gloss.md")))
    await assert.rejects(access(path.join(outputDir, "product", "alpha", "docs", "journals", "daily.md")))
  } finally {
    await rm(rootDir, { recursive: true, force: true })
  }
})

test("siteData separates prose browse pages, prose items, and product documentation", () => {
  const prose = {
    slug: "prose/example/index",
    frontmatter: { title: "Example", primaryTopic: "knowledge-systems", related: ["product/alpha"] },
  } as never
  const topic = {
    slug: "prose/topics/knowledge-systems/index",
    frontmatter: { title: "Knowledge & Systems" },
  } as never
  const product = {
    slug: "product/alpha/index",
    frontmatter: { title: "Alpha", itemType: "skill", status: "active" },
  } as never
  const productDoc = {
    slug: "product/alpha/docs/start",
    frontmatter: { title: "Start" },
  } as never
  const allFiles = [prose, topic, product, productDoc]

  assert.equal(isProseArticlePage(prose), true)
  assert.equal(isProseBrowsePage(topic), true)
  assert.deepEqual(getProsePages(allFiles).map((page) => page.slug), ["prose/example/index"])
  assert.deepEqual(
    getProsePagesForTopic(allFiles, "knowledge-systems").map((page) => page.slug),
    ["prose/example/index"],
  )
  assert.deepEqual(getProductClusters(allFiles)[0].docs.map((page) => page.slug), [
    "product/alpha/docs/start",
  ])
  assert.deepEqual(getRelatedEntries(prose, allFiles).map((page) => page.slug), ["product/alpha/index"])
})

test("PublishedState only exposes notes with explicit state: published", () => {
  const filter = PublishedState()
  const published = filter.shouldPublish({} as never, [
    {} as never,
    { data: { frontmatter: { state: "published" } } } as never,
  ])
  const draft = filter.shouldPublish({} as never, [
    {} as never,
    { data: { frontmatter: { state: "draft" } } } as never,
  ])
  const missing = filter.shouldPublish({} as never, [{} as never, { data: {} } as never])

  assert.equal(published, true)
  assert.equal(draft, false)
  assert.equal(missing, false)
})
