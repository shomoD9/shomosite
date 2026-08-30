# Roadmap

_Long-term items and features to be built down the line. Not a working to-do list — immediate tasks live in per-session implementation plans._

- Build the URL-to-HTML ingestion workflow around the new Prose metadata contract.
- Replace the inherited visual aesthetic while preserving the implemented information architecture and preview behavior.

---

## 2026-06-07 - GPT-5 - Codex App

#shomos_preferences — Shomo wants Shomodip.com to be a direct, permanent archive for supplied writing links, products, skills, and documentation. The site no longer depends on the Master Obsidian vault or a Gwern-inspired public structure.

#work_context — Implemented the new public IA: root About and Design pages, topic-led Prose plus All Writing, one filterable Product and Skill catalog, source and lifecycle metadata, manual related items, automatic backlinks, product documentation trees, and an editorial homepage. Removed the old visible corpus and Master sync while preserving direct attachments and hover-preview behavior.

#work_context — Added a root-level direct-link attachment contract for resume evidence, copied three source documents into stable `attachments/` filenames, and updated staging, tests, architecture, and design documentation before deployment.

#hurdles — Cloudflare deployment requires interactive OAuth approval because no API token is available in this checkout. Wrangler opened its consent page, then timed out before approval; the verified build remains ready for deployment.

#work_context — Diagnosed `DNS_PROBE_FINISHED_NXDOMAIN`: Cloudflare nameservers are authoritative for `shomodip.com`, but the zone has no apex address or Worker route. Added explicit Worker custom-domain routes for `shomodip.com` and `www.shomodip.com`.

#work_context — Deployed Shomosite through Wrangler after user-approved Cloudflare OAuth. Cloudflare created working apex and `www` DNS records; verified the homepage and all three direct-link attachments return HTTP 200 with the expected content types.

## 2026-04-28 - GPT-5 - Codex App

#shomos_preferences — Shomo wants the About page to avoid uncanny site-language and the adjective `linked`; avoid cliches such as digital garden, personal knowledge base, builder in public, AI-native, creator, and thought leader.

#work_context — Rewrote `docs/about.md` as `About This Site`, added four about-page sidenote fragments, generalized selected docs prose notes so About and Design share the prose shell and hidden sidenote staging, and updated architecture/test coverage.

## 2026-04-27 - GPT-5 - Codex App

#shomos_preferences — Shomo does not want the word normally used for outward-facing publication status to appear in reader-facing docs; it feels uncanny and like internal plumbing leaking into prose. Use human terms such as site, published, reader-facing, rendered, selected, or on the page depending on the sentence.

#work_context — On `main`, removed that word from authored docs/prose/product notes, renamed `product/shomosite/docs/public-system.md` to `product/shomosite/docs/site-renderer.md`, cleaned matching visible component copy and local narration comments, regenerated `.quartz-content`/`public`, and verified with `npm test`, `npm run check`, `npm run build`, plus a source/output search.

#work_context — Reviewed Shomosite's design system from `docs/design.md`, `docs/ARCHITECTURE.md`, `quartz.config.ts`, `quartz.layout.ts`, and the custom `components/` styles to explain the current Gwern-inspired editorial hypertext principles without changing site behavior.

#work_context — Expanded `docs/design.md` from a stub into a Gwern-style design and architecture explanation covering Shomosite's principles, source-to-render pipeline, Quartz layer, semantic zoom features, implementation contracts, and deferred design tensions; updated `docs/ARCHITECTURE.md` to point to it.

#work_context — Promoted `docs/design.md` into the prose-style reading shell by treating `docs/design` as a primary note page, staging `docs/design/notes/` as hidden sidenote fragments, moving existing explanatory paragraphs into those notes without rewriting them, and updating the architecture/test contracts.

#work_context — Styled article-opening `[!abstract]` callouts as unlabeled monochrome lede notes in `quartz/styles/custom.scss`, so Obsidian-native summary callouts do not render as blue alert boxes on Shomosite.

#work_context — Rewrote `docs/ARCHITECTURE.md` as a practical architecture reference with an ASCII Shomosite system map, source/staging/rendering layers, page-type ownership, common change points, and verification commands.

## 2026-04-19 - GPT-5 - Codex App

#hurdles — Live Cloudflare Pages sidenotes failed because the staged prose links pointed at `.html` fragment paths, while Quartz's asset emitter publishes static HTML fragments as extensionless routes. Adjusted sidenote staging and the contract test so preview links use the final extensionless asset path.

## 2026-04-18 - claude-sonnet-4-6 - shomosite

#work_context — On `codex/rebrand-rethink`, added a Vanity Metrics dashboard to the homepage between P3 and P4. Raw HTML block in `.quartz-content/index.md` holds a `<section class="vanity-metrics">` with four `<li>` stats (Views 128,430 / Comments 2,184 / Likes 18,942 / Subscribers 4,327 — all dummy). New files: `components/scripts/vanityMetrics.inline.ts` (IntersectionObserver count-up, 1100ms easeOutCubic, respects prefers-reduced-motion), `components/ShomoVanityMetricsScript.tsx` (null-rendering Quartz component that attaches the script). Styles added to `quartz/styles/custom.scss` (hairline border rectangle, all-small-caps corner label notched into border, 4-across grid collapsing to 2×2 at 640px, hover tooltip for per-platform breakdown). Component mounted in `quartz.layout.ts` under homepage `ConditionalRender`.

#shomos_preferences — Shomo wants the Vanity Metrics section to match the site's editorial aesthetic (hairline borders, serif numerals, all-small-caps labels, no fills or shadows) and sit at the 42rem hero-copy reading measure, not the wider panel frame.

## 2026-04-18 - GPT-5 - Codex App

#shomos_preferences — Shomo wants the homepage's first two sentences in small caps rather than the whole first rendered line or only the first sentence.

#work_context — On `codex/rebrand-rethink`, wrapped the first two homepage sentences in `docs/index.md` with `home-opening-smallcaps`, kept the scoped small-caps rule in `quartz/styles/custom.scss`, and updated the architecture note to describe the two-sentence frontispiece treatment.

## 2026-04-17 - GPT-5 - Codex App

#shomos_preferences — Shomo does not want the homepage self-description sentence set in small caps; the front-door introduction should read as ordinary mixed-case prose, with small caps reserved for structural labels and essay-opening gestures.

#work_context — On `codex/rebrand-rethink`, removed the homepage-only `p:first-of-type::first-line` small-caps treatment from `quartz/styles/custom.scss` and updated the architecture note so the homepage typography contract is explicit.

## 2026-04-17 - claude 4.7 opus (max) - shomosite

#shomos_preferences — In the landing page's two-column index, Shomo wants directional symmetry: if `PRODUCT` heading is right-aligned, its entry titles/summaries/dates and ordinal rail should align right as well, not just the section label.

#work_context — Adjusted `components/styles/shomoHomePanels.scss` so `.home-panel:nth-child(2)` mirrors the entire block: moved list-item padding rail from left to right, moved roman numeral pseudo-element to `right: 0`, and set `.home-panel-entry` to `text-align: right`. Rebuilt successfully (`npm run build`).

## 2026-04-16 - claude 4.7 opus (max) - shomosite

#shomos_preferences — Shomo wants the site to read as quietly dreamy / enlightenment-romanticism coded. Light mode = iron-gall ink on laid paper (slightly deeper, a hair cooler running-prose color plus a sub-pixel text-shadow bleed). Dark mode = moonlit vellum (same-luminance but cool-neutral prose color, whisper of silver halo). Popover window gets a pressed-plate 2px frame with a hair-thin inner engraving rule; dark mode adds a cool moonlight halo to the outer shadow. Rule of thumb going forward: dream effects must be invisible at reading distance and only surface when the eye rests on them. No font changes, no spacing changes — mood carried by color shifts and shadow/border work under ~0.3 opacity.

#shomos_preferences — Landing page aesthetic direction: IA (hero bio + two curated columns) is fixed and correct; fix comes from typographic rhythm, not new content or new components. Guiding moves: (1) hero and panels share one editorial frame rather than being mismatched widths; (2) numbered entries render as lowercase roman numerals in a hanging margin rail, not wiki Arabic numerals in the text flow; (3) a centered asterism (⁂) breaking a short hairline rule punctuates the hero→panels transition in place of a yawning margin; (4) first hero paragraph gets a small-caps first line (no drop cap) as a frontispiece gesture that ties the landing to prose-page openings. Entry titles outweigh body only slightly (1.16 rem, 600), dates sit underneath as small-caps sans in the tertiary color.

#work_context — Branch `codex/rebrand-rethink`. Landing page pass touched `quartz/styles/custom.scss` (added `--shomo-home-frame: 64rem`; widened `--shomo-home-copy` to `62rem`; retargeted index article + page-footer onto the home frame; bumped hero font-size clamp to 1.12–1.28 rem; tightened paragraph margins to 0.7 rem and line-height to 1.78; added `body[data-slug="index"] ... p:first-of-type::first-line` small-caps rule) and `components/styles/shomoHomePanels.scss` (full rewrite: position:relative + `::before` asterism glyph + `::after` hairline rule; panels clamp to `--shomo-home-frame`; h2 bumped + 1.5 px rule; `ol` counter-reset driving a `::before` with `counter(..., lower-roman)` in a 1.8 rem right-aligned rail; h3 to 1.16 rem; removed 26 rem summary cap; date restyled to 0.68 rem small-caps sans in tertiary; mobile tightens gap + shrinks asterism). No markup changes to `ShomoHomePanels.tsx`; no content changes to `index.md`. `npm run build` green, both themes verified in Playwright.
