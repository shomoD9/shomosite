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
// @ts-ignore The prep script is plain ESM and is exercised directly in the contract tests.
import { prepareContent } from "../scripts/prepare-content.mjs"
import { PublishedState } from "../filters/PublishedState"

test("prepareContent mirrors docs/index into the root index and omits internal docs", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "shomosite-contracts-"))
  const outputDir = path.join(rootDir, ".quartz-content")

  try {
    await mkdir(path.join(rootDir, "docs", ".obsidian"), { recursive: true })
    await mkdir(path.join(rootDir, "prose", "example", "assets"), { recursive: true })
    await mkdir(path.join(rootDir, "prose", "example", "notes"), { recursive: true })
    await mkdir(path.join(rootDir, "product", "alpha", "docs", "journals"), { recursive: true })
    await mkdir(path.join(rootDir, "product", "alpha", "assets"), { recursive: true })

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
      path.join(rootDir, "prose", "index.md"),
      `---
title: Prose
state: published
---

Section intro.`,
    )
    await writeFile(
      path.join(rootDir, "prose", "example", "example.md"),
      `---
title: Example
state: published
topics:
  - systems
---

Example prose with [[notes/gloss|a sidenote]].`,
    )
    await writeFile(path.join(rootDir, "prose", "example", "assets", "diagram.svg"), "<svg></svg>")
    await writeFile(
      path.join(rootDir, "prose", "example", "notes", "gloss.md"),
      `---
title: Gloss
---

This is the note that should render inside a preview.`,
    )
    await writeFile(
      path.join(rootDir, "product", "index.md"),
      `---
title: Product
state: published
---

Section intro.`,
    )
    await writeFile(
      path.join(rootDir, "product", "alpha", "docs", "index.md"),
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
    await writeFile(path.join(rootDir, "product", "alpha", "docs", "journals", "daily.md"), "private")
    await writeFile(path.join(rootDir, "product", "alpha", "assets", "logo.svg"), "<svg></svg>")

    await prepareContent({ rootDir, outputDir })

    const home = await readFile(path.join(outputDir, "index.md"), "utf8")
    assert.match(home, /aliases:\s*\n\s*- docs\/index/)
    assert.match(home, /Opening paragraph\./)

    const about = await readFile(path.join(outputDir, "docs", "about.md"), "utf8")
    assert.match(about, /About page\./)

    const prose = await readFile(path.join(outputDir, "prose", "example", "index.md"), "utf8")
    assert.match(prose, /Example prose with/)
    assert.match(prose, /aliases:\s*\n\s*- prose\/example\/example/)
    assert.match(prose, /class="internal sidenote-ref"/)
    assert.match(prose, /static\/sidenotes\/prose\/example\/gloss/)
    assert.doesNotMatch(prose, /static\/sidenotes\/prose\/example\/gloss\.html/)

    const sidenote = await readFile(
      // Sidenote fragments are extensionless because Quartz serves static HTML
      // fragments through slugified asset paths rather than literal `.html` paths.
      path.join(outputDir, "static", "sidenotes", "prose", "example", "gloss"),
      "utf8",
    )
    assert.match(sidenote, /This is the note that should render inside a preview\./)

    const productRoot = await readFile(path.join(outputDir, "product", "alpha", "index.md"), "utf8")
    assert.match(productRoot, /Alpha product\./)
    assert.match(productRoot, /aliases:\s*\n\s*- product\/alpha\/docs\/index/)

    const productDoc = await readFile(path.join(outputDir, "product", "alpha", "system.md"), "utf8")
    assert.match(productDoc, /Alpha system note\./)
    assert.match(productDoc, /aliases:\s*\n\s*- product\/alpha\/docs\/system/)

    await access(path.join(outputDir, "prose", "example", "assets", "diagram.svg"))
    await access(path.join(outputDir, "product", "alpha", "assets", "logo.svg"))

    await assert.rejects(access(path.join(outputDir, "docs", "_J-Agent.md")))
    await assert.rejects(access(path.join(outputDir, "docs", ".obsidian", "workspace.json")))
    await assert.rejects(access(path.join(outputDir, "docs", "index.md")))
    await assert.rejects(access(path.join(outputDir, "prose", "example", "notes", "gloss.md")))
    await assert.rejects(access(path.join(outputDir, "product", "alpha", "journals", "daily.md")))
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
