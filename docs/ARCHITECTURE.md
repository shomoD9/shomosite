# Shomodip.com Architecture

Shomodip.com is a static archive for writing, products, skills, and product documentation. Quartz remains the rendering engine, while the public information architecture is independent of the old Master-vault workflow.

## Public Routes

```text
/                                  Editorial homepage
/prose/                            Topic-led writing archive
/prose/all/                        Complete chronological writing archive
/prose/topics/<topic>/             One primary-topic archive
/prose/<slug>/                     One prose rendition
/product/                          Combined products and skills catalog
/product/<slug>/                   Product or skill overview
/product/<slug>/docs/<path>/       Nested documentation
/about/                            Concise orientation
/design/                           Living design document
/attachments/<filename>            Unlisted direct-link evidence
```

There is no public `/docs/` section. Internal project documentation remains under `docs/` in the repository and is excluded from the generated content tree.

## Source Layout

```text
docs/index.md                       Homepage source
docs/about.md                       Root About page source
docs/DESIGN.md                      Root Design page and living design document
prose/index.md                      Prose landing source
prose/all.md                        All Writing source
prose/topics/*.md                   Primary-topic archive sources
prose/<slug>/<slug>.md              Prose source
prose/<slug>/notes/*.md             Optional preview-only fragments
prose/<slug>/assets/*               Prose assets
product/index.md                    Product catalog source
product/<slug>/docs/index.md        Product or skill overview source
product/<slug>/docs/**/*            Nested documentation sources
product/<slug>/assets/*             Product assets
attachments/*                       Unlisted direct-link files
```

## Content Preparation

`scripts/prepare-content.mjs` clears `.quartz-content` and stages only the public route tree.

- `docs/index.md` becomes `.quartz-content/index.md`.
- `docs/about.md` and `docs/DESIGN.md` become `/about/` and `/design/`.
- Prose browse sources become their corresponding folder indexes.
- `prose/<slug>/<slug>.md` becomes `/prose/<slug>/`.
- Product overview files become `/product/<slug>/`.
- Supporting product docs retain `/product/<slug>/docs/...`.
- Prose-local notes become hidden preview fragments.
- Attachments are copied unchanged and remain absent from indexes.

The previous Master-vault synchronization script has been removed. Content enters the repository directly.

## Metadata Contracts

### Prose

```yaml
title: Required
summary: Required
state: published
primaryTopic: ai-intelligence
tags: []
sourceName: Original publication
sourceUrl: https://example.com/article
published: 2026-06-01
added: 2026-06-07
designFamily: editorial-essay
related: []
```

Allowed primary topics are `ai-intelligence`, `knowledge-systems`, `product-design`, `psychology-productivity`, and `philosophy-culture`.

### Products And Skills

```yaml
title: Required
summary: Required
state: published
itemType: product
status: active
related: []
```

Allowed `itemType` values are `product` and `skill`.

Allowed `status` values are `active`, `in-development`, `experiment`, and `archived`.

## Shared Behavior

- `ShomoTopNav` exposes Prose, Product, About, Design, search, and the site-name home link.
- `ShomoFolderContent` renders topic archives, All Writing, and the filterable Product catalog.
- `ShomoPageMeta` exposes source, topic, design-family, type, and status metadata.
- `ShomoRelatedItems` renders manual relationships.
- Quartz Backlinks renders automatic inbound relationships.
- `ShomoProductDocs` renders the nested documentation tree on product and skill overviews.
- Quartz popovers retain scrollable, draggable, pinnable internal previews.

## Verification

```bash
npm test
npm run check
npm run build
```

After building, verify that `/docs/` and removed corpus routes are absent, root About and Design routes exist, and all files under `/attachments/` still resolve.
