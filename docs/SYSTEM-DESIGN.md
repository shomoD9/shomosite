<!--
This file is the cross-repository design document for the whole Shomovault and
Shomosite system. It exists because the architecture now spans the private
master vault, multiple local product repos, and the downstream public site, and
those relationships are too important to leave scattered across journals or
project-specific briefs. It talks to the root architecture here, to the product
docs mirrors under `product/`, and to the future Shomosite repo copy that is
intended to become the long-term source of truth for this same document.
-->

# System Design

## Purpose

This system exists to preserve one writing habit across everything: ideas should begin life as wiki pages, not as one-off publication artifacts. Prose should be written as a wiki of ideas, life should be recorded as a wiki biography, and products should be documented as wikis inside their own codebases. The architecture is shaped around that continuity rather than around one specific website framework.

The second purpose is operational. Shomo wants the ease of writing in an iCloud-synced Obsidian vault on laptop and phone, while still having version control, explicit publication gates, and a public website that behaves like a real wiki instead of like a second hand-maintained copy. The system therefore needs one place where the content is integrated, one place where codebases keep their own docs, and one place where the public site is built.

The third purpose is parity. The site should not become a magical rendering layer that invents its own information architecture after the fact. The place where prose and product docs are integrated should be navigable as a wiki in Obsidian, and the site should consume that integrated structure rather than reinterpret it into something unrelated.

## Repositories And Roles

`master` is the private integrated hub. It is the Obsidian vault, the place where prose lives directly, the place where shomopedia stays private, and the place where product docs are mirrored in from their source codebases. It is also the place where prose-to-product links can be authored once and checked locally. Because it contains fiction, private life notes, mirrored journals, and product documentation that may not all be public, its GitHub repo must stay private.

Each product repo under `/Users/shomo/development/...` remains a normal codebase. Its source code stays there. Its own docs wiki also stays there. The important point is that only the `docs/` subtree is mirrored into `master`. That keeps the vault writable without giving it authority over source code outside documentation.

`shomosite` is the downstream delivery workspace. It consumes public material (as in, published marked-for-public pages and their linked assets) from the `master` repo only, builds the public site, and also acts as the local parity vault that should feel closest to the final website.

The same design document should be maintained across workspaces, but the long-term intended source of truth for that document is the `shomosite` repo. The copy in `master` exists so the integrated vault can still explain the whole system locally.

## Vault Shape

The active first-level domains in `master` are `prose/`, `product/`, `shomopedia/`, and `fiction/`.

`prose/` is the outward ideas wiki. Essays remain long-lived folder-backed pages with a canonical note, human journal, agent journal, `notes/`, and `assets/`. Prose uses `draft -> staging -> qa -> published -> attic`.

`fiction/` is its own top-level domain. Fiction remains in the vault and in the private Git repo, but it is outside the Shomosite ingestion graph for now.

`shomopedia/` is the private life wiki and still contains the daily-note stream. It is not part of the public site architecture, and it can cite `prose/` without allowing the public prose system to depend on it in return.

`product/` is now the integrated product docs hub. Each product lives at `product/<slug>/docs/`. The canonical product page is `docs/<slug>.md`. Human and agent journals live under `docs/journals/`. This location matters because the whole docs tree is what gets copied between `master` and the source product repo.

## Product Docs Mirror

The product mirror is explicit and directional. There is no magical live sync and there are no nested Git repos inside `master`.

An import copies one product repo's `docs/` folder into `master/product/<slug>/docs/`. An export copies `master/product/<slug>/docs/` back into that product repo. Those two actions are separate on purpose. They make direction a deliberate choice instead of a hidden side effect.

In practice, `master` is treated as the final integrated truth once a product's docs have been imported there. That is why the export step exists and why it is explicit. It lets Shomo refine docs in the integrated vault and then push those documentation changes back into the source codebase without giving the vault any authority over non-docs code.

That also means a practical rule follows immediately: once a product has been normalized inside `master`, export it back into the source product repo before running another import from that repo. Otherwise the next import will correctly preview the vault-only canonical page and journals as removals, because the source repo still does not contain them yet.

The registry at `product/_system/docs-sync-registry.json` records which products participate in this sync model, where their local clones live, what their repo URLs are, and where the canonical doc and human journal live inside the mirrored tree.

Human product journals drive the daily dashboard inside `master`. Agent journals are mirrored too because the whole docs tree is mirrored, but they stay operationally hidden from ordinary dashboard use.

## Publication Flow

Shomosite pulls only from the private `master` GitHub repo on `main`.

Public prose is selected from `master/prose/` by frontmatter state. Only `state: published` enters the public build.

Public product material is selected from `master/product/<slug>/docs/` by the same principle. Only `state: published` documents should become part of the public site. Journals and private product docs stay out of the public build even though they remain inside the integrated vault.

Because prose and product docs are already integrated inside `master`, prose-to-product links are authored there once. Shomosite does not need a second crosslink-construction layer. Its job is to materialize public subsets, preserve the existing wiki organization, and render them faithfully.

## Shomosite Direction

Shomosite should be Quartz-first. The reason is not aesthetic fashion. It is that Quartz already understands the note-native behaviors that matter here: Obsidian-flavored markdown, wikilinks, backlinks, hover previews, and search.

Shomosite is also meant to be openable as an Obsidian vault for parity checking. That means its mounted content should stay source-shaped. Prose should look like prose as it exists in `master`. Product docs should look like product docs as they exist in `master/product/<slug>/docs/`. The site may resolve public routes and public-only visibility, but it should not editorially restructure the wiki trees after pulling them in from the `master` github.

The top-level public site stays intentionally small: `/`, `/prose`, and `/product`. Additional pages such as `About` and `Design` can exist as markdown-owned documentation inside Shomosite, but they should not bloat the first public route surface unless explicitly promoted.

## Current Scope And Deferred Work

This design intentionally does not implement everything at once.

Implemented now:
- the integrated `master` hub model
- the product docs registry
- explicit import/export scripts for product docs
- `fiction/` as a top-level domain
- the collapse of the old top-level vault `shomosite/` workspace into the integrated product docs side

Deferred for later:
- a fully aligned `docs/` tree inside the external `shomosite` repo
- the actual Quartz implementation in that repo
- automated public-content pull scripts owned by that repo
- any richer publication fan-out beyond the site itself

The system should stay honest about that sequence. The architecture is being established now so the later Shomosite build can land on stable content contracts instead of inventing them mid-flight.
