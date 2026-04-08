# Architecture

## Opening

Shomosite is now a downstream public wiki rather than a hand-composed application. Its job is not to originate the writing life, but to render the public subset of a larger note system faithfully. That shift matters because the architecture is no longer organized around React routes and custom content objects. It is organized around a simpler promise: keep prose, product notes, and public documentation in source-shaped markdown trees, stage those trees for Quartz, and let Quartz provide the reading system that turns them into a navigable site.

The site borrows its discipline from Gwern more than its literal appearance. The governing idea is that the reading lane should remain clear, navigation should feel native to the notes, and the public site should behave like a real wiki rather than like a portfolio with blog styling draped over it. Search, backlinks, wikilinks, popover previews, breadcrumbs, and reader mode therefore belong to the core architecture rather than to a later enhancement phase. The visual layer is intentionally restrained so that these note-native behaviors remain the dominant experience.

## Source Of Truth

The repository now contains three canonical content trees: `docs/`, `prose/`, and `product/`. These are the places where public-facing material is written and organized. `docs/` holds Shomosite's own native documentation notes. `prose/` holds the essays and working notes that make up the public ideas wiki. `product/` holds product-first project pages and the published documentation that sits beneath each product. This shape mirrors the broader system design: the private `master` repository remains the integrated upstream hub, while Shomosite stays the public renderer.

Those source trees are deliberately kept separate from Quartz's working content directory. Quartz expects a single root of markdown, but this repository needs to preserve the distinction between operational narration and public notes. The script at `scripts/prepare-content.mjs` solves that mismatch. Before every build it creates a staged `.quartz-content/` workspace, copies in `prose/` and `product/`, copies only the public-eligible parts of `docs/`, and mirrors `docs/index.md` into the root `index.md` that Quartz expects for the homepage. In other words, the markdown that Shomo edits stays conceptually honest, while the build gets the single directory structure it needs.

## Public Gate

Publication is explicit. The filter in `filters/PublishedState.ts` only allows notes with `state: published` to survive into the rendered site. This is the central public contract. It keeps the site small, keeps drafts inert, and lets the repository hold internal design documents and journals without treating them as accidental web pages. The staging script reinforces that rule by omitting obviously operational files from `docs/` before Quartz even begins parsing markdown.

There is a second gate for links. Public notes will often refer to ideas that exist in the private vault or in drafts that are not yet meant for the site. Quartz can already detect unresolved wikilinks, but Shomosite needs a stronger semantic rule than a generic broken link. The transformer in `plugins/PlainTextBrokenLinks.ts` therefore rewrites those unresolved wiki targets as plain text spans. The sentence survives, but the site refuses to fake a public destination that does not exist.

## Rendering System

Quartz itself now supplies the main reading engine. The vendored `quartz/` tree provides markdown parsing, Obsidian-flavored wikilinks, backlinks, popover previews, search, folder pages, content indexes, dark mode, and the rest of the note-native infrastructure. The local `quartz.config.ts` file is where Shomosite states how that engine should behave: which font and color system to use, which transformer and filter plugins to enable, and which content rules define publication.

The repository's own custom code lives in a thin layer around Quartz rather than in a bespoke frontend application. `quartz.layout.ts` arranges the public page chrome by keeping the homepage quieter, giving note pages breadcrumbs and metadata, and preserving a browsing sidebar that exposes the underlying tree. `components/ShomoHomePanels.tsx` renders the homepage's two curated columns from frontmatter on `docs/index.md`, because the homepage is editorial rather than automatic. `components/ShomoFolderContent.tsx` replaces Quartz's generic folder listing only where Shomosite needs more semantic structure: `/prose` groups notes by frontmatter topics, `/product` groups by product first and then by product docs, and `/docs` behaves like a small published documentation shelf. `components/siteData.ts` keeps those grouping rules in one place so the listing components do not each invent their own miniature data model.

Stylistically, `quartz/styles/custom.scss` and the component-level styles under `components/styles/` do the last layer of shaping. They quiet the defaults, lean toward a serious print-like reading rhythm, and keep the homepage and folder indexes from collapsing into generic cards. This means the architecture has a clear split: Quartz handles the general problem of wiki rendering, and the local component and style layer handles the specific problem of making that rendering feel like Shomosite.

## Sync And Verification

The bridge from the private `master` repository is manual for now. `scripts/sync-master-subtrees.sh` uses a sparse clone so that only `prose/` and `product/` are fetched into this repository when Shomo wants to refresh public-source candidates from the private vault. That script is intentionally not magical. It keeps direction explicit and lets the public site remain a deliberate downstream workspace rather than a hidden synchronization system.

Verification now happens at the contract layer first and at the build layer second. `tests/site-contracts.test.ts` checks the two rules most likely to rot as the repo evolves: staging the right files into the Quartz content directory and enforcing `state: published` as the publication gate. `npm run check` validates the TypeScript surface of the local Quartz customization layer. `npm run build` then performs the full end-to-end proof by staging the content, invoking Quartz, and emitting the static site into `public/`. The result is a system whose logic is much simpler than the deleted Next.js application, but whose public behavior is closer to the real design target: a faithful, readable, source-shaped public wiki.
