# Roadmap

_Long-term items and features to be built down the line. Not a working to-do list — immediate tasks live in per-session implementation plans._

- (empty)

---

## 2026-04-19 - GPT-5 - Codex App

#work_context — Reviewed Shomosite's deployment shape for launch planning. The site is a static Quartz build: `npm run build` stages `.quartz-content` from `docs/`, `prose/`, and `product/`, then emits `public/`; `scripts/sync-master-subtrees.sh` remains the manual bridge from the private `master` repo into public `prose/` and `product/`.

#work_context — On `codex/rebrand-rethink`, removed reader-facing dates and reading-time estimates from the Quartz page shell, footer, local homepage/folder indexes, reusable list blocks, and Open Graph image template while preserving date metadata for sorting and feeds.

#work_context — On `codex/rebrand-rethink`, removed the site-wide Quartz footer from the shared layout so no page renders the Created with Quartz / About / Design / GitHub strip.

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
