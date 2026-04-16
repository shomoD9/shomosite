# Roadmap
- Add an automated but explicit sync/deploy path from the private `master` repository once the manual workflow has settled.
- Expand the homepage and section indices into richer editorial sub-sections as the prose and product corpus grows.
- Refine the long-term visual layer and motifs only after the wiki reading system and public information architecture are stable.
- Lock the eventual production domain, metadata, and social image strategy once the public hostname is decided.

## 2026-04-16 - Opus 4.6 - Warp

### Opus 4.7 (max) - Warp

#work_context Fixed the long-standing desktop margin-note anchoring failure on prose/product note pages. Root cause was inherited from `quartz/styles/base.scss` (`.sidebar { position: sticky; top: 0; height: 100vh }`) applied at desktop widths: the right rail was a sticky viewport-height container, so its absolutely-positioned children tracked the viewport instead of the article regardless of how correctly the script computed each link's document-absolute y. Fix in `quartz/styles/custom.scss`: added a scoped override for `body[data-slug^="prose/"]:not([data-slug="prose/index"]) .sidebar.right` (and the product equivalent) that sets `position: static; top: auto; height: auto; display: block; gap: 0`, letting the canvas grow with the article. Left TOC untouched — its own `position: sticky; top: 1.25rem` inside `.sidebar.left .toc` handles stickiness independently. Also hardened `components/scripts/marginNotes.inline.ts` by re-reading `canvasDocTop` in Phase 3 (after `replaceChildren`) instead of once during Phase 2, so any reflow between measurement and paint is absorbed. Verified live at `http://localhost:8080/prose/margins-are-part-of-the-argument/`: at 1600×1000, link #1 and note #1 share `y=320` at scroll=0 and `y=-265` at scroll=900 (perfect tracking). Per-note `diff = noteY - linkY` stays constant across scroll positions (collision push-down preserved as relative offset). Screenshots confirm correct placement across the essay including the dense Density Test stack. `npm run check` and `npm run build` both clean.

#hurdles The last two models iterated on the script (first-line rect measurement, render-generation guards, `ResizeObserver`, etc.) without diagnosing that the container was the problem. Every improvement to the measurement logic was moot while the canvas sat inside a `position: sticky; height: 100vh` parent. Evidence was only visible by reading `getBoundingClientRect()` during actual scroll in a live browser, not by static inspection of the script or the HTML. Lesson: when an absolute-positioning system fails to follow its document anchor, always verify the offset parent's own positioning first.

#work_context Redesigned margin note cards to behave as comments on annotated text. Renamed eyebrow from "Sidenote" to "Note" in `scripts/prepare-content.mjs` (`createSidenoteFragment`). Added client-side title swap in `components/scripts/marginNotes.inline.ts`: the card now shows the linked text from the article in curly quotes as its title (replacing the note file's own title), with a `truncateForTitle` helper that collapses passages longer than 8 words to "first 3 … last 3". Note file title remains in the static HTML as fallback. Regenerated `.quartz-content` fragments.

#shomos_preferences The user wants margin notes to function as inline comments rather than standalone definitions. The note title should reflect the annotated passage, not the note file name.

#work_context Typography polish pass in `quartz/styles/custom.scss`: switched `article > h2` from `text-transform: uppercase` to `font-variant-caps: small-caps` to match Gwern's section-heading treatment, bumped essay title size from `clamp(2rem…2.5rem)` to `clamp(2.3rem…3rem)` with more vertical breathing room, and strengthened the prose first-line `::first-line` small caps by adding `font-feature-settings: 'smcp'` (Source Serif 4 has native OpenType small caps), increasing size to `1.06em`, weight to `600`, and widening letter-spacing.

### GPT-5 - Codex App

#work_context Implemented the desktop margin-note anchoring contract in `components/scripts/marginNotes.inline.ts`: each note now waits for stable layout, measures the first rendered line of its linked phrase, ignores stale async render passes after navigation or resize, and reflows from an article-only `ResizeObserver` while keeping the existing no-overlap margin policy. The dense `Margins Are Part of the Argument` prose fixture remains published so this behavior has a real regression page.

#work_context Made a tightly scoped prose typography polish pass: compared Gwern's small-caps CSS treatment, then adjusted only Shomosite's prose first-line small caps in `quartz/styles/custom.scss` with a slight size, weight, and tracking calibration. Preserved the stock title/metadata header and did not reintroduce `ShomoArticleHeader`.

#work_context Surgically repaired the local dev startup path without undoing popup loading states or changing the stock Quartz title/metadata header. Restored valid frontmatter boundaries in the Anthropic Exceptionalism essay, removed only the latest 19:xx Playwright YAML verification artifacts, and regenerated `.quartz-content` from source.

#hurdles The previous rollback left generated `.quartz-content` dirty and the essay source malformed, so `npm run dev` failed during content staging before Quartz could serve. The chosen repair was source-level metadata normalization plus generated-state regeneration, not a visual header intervention.

## 2026-04-15 - Opus 4.6 - Cursor

#work_context Fixed nested popup positioning: `chooseAnchoredBox()` now accepts a `parentPopover` parameter and anchors child popups relative to the parent popup's window rect instead of the tiny link rect, so children appear to the side of the parent window (like gwern) rather than on top. Added Wikipedia article-summary popups via the public REST API (`/api/rest_v1/page/summary/{title}`)—`isWikipediaLink()` detects Wikipedia links, `loadWikipediaPreview()` fetches and caches summaries with optional thumbnails, `openPreview()` routes Wikipedia links to the new loader, and `attachPopoverListeners()` now selects Wikipedia links alongside internal links so Wikipedia-to-Wikipedia popups recurse exactly like internal ones. Verified with `tsc --noEmit`, `npm run build`, and no linter errors.

### GPT-5.4 - Cursor

#work_context Added Gwern-style popup loading shells in `popover.inline.ts` and `popover.scss`: `openPreview()` now computes preview identity before fetch, spawns a real shell immediately after the hover delay, reuses in-flight requests via `loadingRequests`, tracks active loading shells via `loadingPopovers`, and hydrates the same DOM node in place when either internal or Wikipedia payloads arrive. Added restrained loading/failure status UI inside `.popover-inner`. Verified with `npm run build`, direct `tsc --noEmit` (`npm run check` script target), and a live browser pass on `localhost:8080` confirming the Wikipedia shell renders before content arrives, hydrates in place, and a child Wikipedia popup still opens while the parent remains visible; local internal previews still resolve through the same shell path but hydrate almost immediately on localhost.

#shomos_preferences When popup behavior is being tuned, the user wants Gwern copied more literally: link-side placement over parent-frame anchoring, gentler hover timing, and explicit dummy links on-page so the recursion can be tested manually.

#hurdles Wikipedia's `page/summary` endpoint returns linkless `extract_html`, which made recursive wiki popups impossible despite the loader working. The workaround was to keep the summary endpoint for title/thumbnail metadata but source the popup body from `page/html/{title}` lead paragraphs, then force imported wiki links to stay absolute instead of being rebased into Quartz-local `/wiki/...` paths.

#work_context Reworked `popover.inline.ts` around Gwern-style hovered-link geometry and slower hover lifecycle: stored cursor spawn points per link, added delayed spawn plus longer fade timing, switched placement back to hovered-link/client-rect anchoring with overlap penalties against the parent frame, synced hover-stack pruning after child spawn, and added a second placement pass after render so windows settle cleanly. Also updated `popover.scss` transition timing and added a dummy Wikipedia test cluster to `prose/anthropic-exceptionalism/anthropic-exceptionalism.md`. Verified with `npm run check`, `npm run build`, a live local browser test of nested wiki popups, and a screenshot showing the child popup offset beside its parent while the parent remains open.

#shomos_preferences When adjusting contrast or palette, the user wants tightly scoped changes that deepen the existing design without shifting unrelated parts of the visual system.

#work_context Fixed the TOC collapse by making `ul.toc-content.collapsed` actually hide in `toc.scss`, hardened `setupToc()` to `continue` instead of aborting on a malformed TOC node, and nudged `lightMode.darkgray` from `#3a322a` to `#352e27` so light-mode body text reads slightly deeper without broader palette changes. Verified with `npm run check`, `npm run build`, and a live browser test on `localhost:8080`.

#work_context Rewrote the popover system to support gwern-style recursive stacking. Replaced the single `hoverPopover` variable with a `hoverStack[]` array so parent popups stay open while children spawn. Added `activeHoverWindow` tracking for stack-aware dismissal—leaving a child only closes that child while the parent remains. Implemented fade-out animation (200ms opacity transition before DOM removal), reversed the title bar chrome to gwern layout (buttons left: close/maximize/pin, title right), and added double-click collapse on the title bar. All in `popover.inline.ts` and `popover.scss`.

#shomos_preferences The user wants the site to visually match gwern.net as closely as possible while keeping a warm (not pure grayscale) palette and the existing Prose/Product site structure. Priorities: typography, TOC, sidenotes, popups. Spaced paragraphs and left-aligned text preferred over gwern's first-line-indent/justified approach.

#work_context Implemented a comprehensive gwern-style visual redesign across seven areas: (1) typography overhaul with oldstyle numerals, scaling line-heights, gwern heading hierarchy (centered small-caps page title, H1 small-caps with solid border, H2 uppercase with dotted border), drop caps and intro small-caps on prose pages, link weight normalization; (2) tightened warm color palette closer to gwern's contrast levels; (3) Wikipedia-style numbered TOC with CSS counters, bordered box, sans-serif font, collapsible toggle; (4) gwern-style sidenotes—italic, 0.85em, reduced opacity with hover restore; (5) popup chrome refined to gwern style—sans-serif muted title bar, softer shadow, thin scrollbar, smaller action buttons; (6) navigation collapsed from two-row masthead to single compact gwern-like bar with dotted-border links, uppercase labels, merged search/darkmode; (7) global polish—border-radius removal, nested blockquote backgrounds, code block sharpening, image outlines, table zebra striping, centered metadata, dark-mode image grayscale. All changes verified with `npm run check`, `npm test`, and `npm run build`.

## 2026-04-09 - GPT-5 - Codex App

#shomos_preferences The user wants materially more negative space on the homepage and section indexes, no divider stack between the homepage opening and the curated columns, no reader-mode/book control in the header, Gwern-like internal preview windows with pin/drag/maximize behavior, and true desktop note pages with a left TOC gutter and right-margin prose sidenotes.

#hurdles Quartz was still treating nested prose and product `index` notes as folder pages, which silently bypassed the note-page layout and stripped out the TOC and margin-note rails; the fix was to patch the content and folder emitters so nested `prose/<slug>/index` and `product/<slug>/index` routes render as real note pages while `/prose` and `/product` remain folder indexes.

#work_context On `codex/rebrand-rethink`, widened and rebalanced the shell, removed reader mode from the header, rebuilt the popover system into a windowed internal-preview model with touch-sheet fallback, promoted prose sidenotes into desktop margin notes, seeded new dummy notes and headings for live TOC/sidenote testing, and re-verified with `npm run check`, `npm test`, and `npm run build`.

#shomos_preferences The user wants the homepage intro and the lower `Prose` and `Product` columns to read as one centered composition rather than two unrelated width systems, wants the top strip lighter and smaller, and is open to selective small caps for structural labels but not for article prose.

#hurdles The desktop note pages were not merely mis-styled; the `.center` wrapper was preventing the header, article body, and post-body region from participating in the intended shell grid, which is why prose and product notes collapsed into a narrow left strip on live pages. An initial attempt to make content staging concurrency-safe by swapping whole output directories solved one race but broke Quartz's file-watcher assumptions, so the final fix kept in-place staging and instead made the prep script clear and repopulate `.quartz-content` more safely.

#work_context Tightened the top masthead into a two-layer shell, unified the homepage and section pages around a shared editorial frame, shifted structural labels to small-caps styling, bounded text popups to fixed reading-window dimensions, repaired the desktop note-page grid, and hardened `scripts/prepare-content.mjs` so `npm run check`, `npm test`, `npm run build`, and `npm run dev` all work again after the layout pass.

## 2026-04-08 - GPT-5 - Codex App

#shomos_preferences The user wants a Quartz-first rebuild, Gwern-inspired reading principles rather than a visual clone, source-shaped routes, `docs/index.md` as the homepage source, `state: published` as the public gate, and both light and dark mode in v1.

#hurdles Quartz's content globbing respects gitignore, so the generated staging directory could not stay ignored without disappearing from the build; the workaround was to keep `.quartz-content/` unignored and rely on the prep script instead. `npx` also hit a user-level npm cache permission issue, so the repo scripts now invoke the local Quartz CLI directly. Playwright MCP failed on a local `/.playwright-mcp` permission path, so the last verification pass fell back to generated HTML inspection.

#work_context Replaced the deleted Next.js implementation with a Quartz-based site on `codex/rebrand-rethink`, added local staging and manual sync scripts, seeded public `docs/`, `prose/`, and `product/` content, and verified the rebuild with `npm run check`, `npm test`, and `npm run build`.

#shomos_preferences The user wants the live shell to move materially closer to Gwern's behavior: a horizontal top navigation, a screen-filling layout that still protects reading width, folder-backed prose roots at `prose/<slug>/<slug>.md`, product roots at `product/<slug>/docs/index.md`, and essay-local `notes/` used as hover/tap sidenote previews instead of public pages.

#hurdles Quartz's layout renderer still emits sidebar wrappers even when conditional rail components resolve to nothing, so the new top-shell layout had to neutralize that dead space at the shell level instead of assuming an empty component array was enough. The stock popover behavior also cleared too aggressively to feel usable, so the preview script was hardened while sidenotes were routed through hidden HTML fragments rather than fake public pages.

#work_context Shifted the public build to the folder-backed prose and product contract, flattened product `/docs` out of public URLs during staging, added a Gwern-oriented top navigation shell and wider responsive layout, seeded one real prose sidenote path, and re-verified the system with `npm run check`, `npm test`, and `npm run build`.

## 2026-04-05 - Gemini 3.1 Pro (High) - Antigravity

#shomos_preferences The retrofuturism aesthetic shouldn't be devoid of warmth. Maintain a familiar, dreamy, aesthetic vibe while aligning with technical/Enlightenment/Space fundamental ideas. Two modes are desired (light and dark), prioritizing light mode first. Mathematics page and existing generative ink motifs are to be removed entirely.

#work_context Shifted the design plan based on new preferences. Created the `agents.md` and `claude.md` routing files and established this journal. Moving to remove the `mathematics` route and generative ink imports from existing components.
#work_context Shifted the public build to the folder-backed prose and product contract, flattened product `/docs` out of public URLs during staging, added a Gwern-oriented top navigation shell and wider responsive layout, seeded one real prose sidenote path, and re-verified the system with `npm run check`, `npm test`, and `npm run build`.

## 2026-04-05 - Gemini 3.1 Pro (High) - Antigravity

#shomos_preferences The retrofuturism aesthetic shouldn't be devoid of warmth. Maintain a familiar, dreamy, aesthetic vibe while aligning with technical/Enlightenment/Space fundamental ideas. Two modes are desired (light and dark), prioritizing light mode first. Mathematics page and existing generative ink motifs are to be removed entirely.

#work_context Shifted the design plan based on new preferences. Created the `agents.md` and `claude.md` routing files and established this journal. Moving to remove the `mathematics` route and generative ink imports from existing components.
