/*
This test file checks the small contracts that make the rebuild trustworthy. It
exists separately because the most failure-prone part of this architecture is
not rendering markdown in general, but staging the right files and enforcing the
right publication rule before Quartz ever emits HTML. It talks to the content
preparation script and to the publication filter directly.
*/

import assert from "node:assert/strict"
import { access, mkdtemp, readFile, rm, writeFile, mkdir } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { prepareContent } from "../scripts/prepare-content.mjs"
import { PublishedState } from "../filters/PublishedState"

test("prepareContent mirrors docs/index into the root index and omits internal docs", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "shomosite-contracts-"))
  const outputDir = path.join(rootDir, ".quartz-content")

  try {
    await mkdir(path.join(rootDir, "docs", ".obsidian"), { recursive: true })
    await mkdir(path.join(rootDir, "prose"), { recursive: true })
    await mkdir(path.join(rootDir, "product", "alpha", "docs"), { recursive: true })

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
    await writeFile(path.join(rootDir, "docs", "_J-Agent.md"), "private journal")
    await writeFile(path.join(rootDir, "docs", ".obsidian", "workspace.json"), "{}")
    await writeFile(
      path.join(rootDir, "prose", "example.md"),
      `---
title: Example
state: published
topics:
  - systems
---

Example prose.`,
    )
    await writeFile(
      path.join(rootDir, "product", "alpha", "index.md"),
      `---
title: Alpha
state: published
topics:
  - tooling
---

Alpha product.`,
    )
    await writeFile(
      path.join(rootDir, "product", "alpha", "docs", "system.md"),
      `---
title: System
state: published
topics:
  - tooling
---

Alpha system note.`,
    )

    await prepareContent({ rootDir, outputDir })

    const home = await readFile(path.join(outputDir, "index.md"), "utf8")
    assert.match(home, /aliases:\s*\n\s*- docs\/index/)
    assert.match(home, /Opening paragraph\./)

    const about = await readFile(path.join(outputDir, "docs", "about.md"), "utf8")
    assert.match(about, /About page\./)

    const prose = await readFile(path.join(outputDir, "prose", "example.md"), "utf8")
    assert.match(prose, /Example prose\./)

    const productDoc = await readFile(path.join(outputDir, "product", "alpha", "docs", "system.md"), "utf8")
    assert.match(productDoc, /Alpha system note\./)

    await assert.rejects(access(path.join(outputDir, "docs", "_J-Agent.md")))
    await assert.rejects(access(path.join(outputDir, "docs", ".obsidian", "workspace.json")))
    await assert.rejects(access(path.join(outputDir, "docs", "index.md")))
  } finally {
    await rm(rootDir, { recursive: true, force: true })
  }
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
