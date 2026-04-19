# Roadmap

_Long-term items and features to be built down the line. Not a working to-do list — immediate tasks live in per-session implementation plans._

- (empty)

---

## 2026-04-19 - GPT-5 - Codex App
### GPT-5.4 (xhigh) - Warp

#shomos_preferences — In the footer, Shomo wants the top line in each column to read clearly as a label, not as tiny whisper text; “slightly bigger and better spaced” means more breathing room and a more legible editorial hierarchy, not a louder footer.

#work_context — On `codex/rebrand-rethink`, tuned `components/styles/shomoFooter.scss` again after the first footer pass: increased the column-internal gap, enlarged the top eyebrow labels with a fluid clamp, slightly raised the nav/email sizes, and opened the inline link spacing so the footer reads less cramped. Rebuilt successfully with `npm run build`.

#work_context — Restored the homepage Reach Report count-up as a client-side animation over the build-time snapshot values by reintroducing a homepage-only script/component pair. The numbers now start at zero and ease up to the staged totals on load or refresh without reintroducing runtime metric fetching.

#shomos_preferences — Shomo wants the site footer to feel deliberately composed rather than like a leftover Quartz strip: the social cluster should anchor to the page’s right edge with real gutter padding, and the footer’s spacing, sizing, and typography should read as polished editorial chrome rather than generic utility text.

#work_context — On `codex/rebrand-rethink`, reworked the custom footer so prose/product pages no longer trap it inside the centered note grid. `quartz/styles/custom.scss` now gives those page shells outer spacer tracks and lets `grid-footer` span the full page width, while `components/styles/shomoFooter.scss` now uses a three-zone layout (`1fr / auto / 1fr`) with calmer uppercase colophon text, tighter hierarchy, increased top/bottom breathing room, and a cleaner mobile stack.

#hurdles — The footer was not merely “misaligned” inside its own component. The real constraint was the prose/product page grid: `justify-content: center` plus capped explicit track widths meant the entire footer row was narrower than the page. Solved by widening the grid definition itself before tuning the footer internals. Build passed and the rendered footer was visually checked in Playwright against a prose page.

#work_context — Updated the build-time Reach Report definitions per Shomo’s chosen presentation rules: comments now include a manual YouTube total of 464 alongside Substack archive comments, subscribers now include 96 X followers, the hover breakdowns were rewritten to match, and the note line beneath the box was removed entirely.

#work_context — Switched the homepage Reach Report away from a runtime Cloudflare fetch and into the staging pipeline: `scripts/prepare-content.mjs` now calculates a build-time public snapshot and writes the resolved totals, tooltips, and note directly into the staged homepage so the numbers render locally and on deploy without waiting on `/api/reach-report`.

#hurdles — The earlier `Comments` headline was easy to misread as a full YouTube+Substack aggregate. Kept the four-slot design but made the generated note explicit that the current public comments total is Substack-archive-only because YouTube does not expose a reliable channel-wide public comment count.

#work_context — On `codex/rebrand-rethink`, replaced the homepage’s dummy Vanity Metrics block with a live `/api/reach-report` Cloudflare Pages Function plus client-side hydration: headline totals now aggregate public YouTube + Substack counts, while source-native X followers and Reddit karma are called out separately instead of being mislabeled as subscribers/likes.

#hurdles — Public social surfaces expose uneven data. X only yielded follower/post counters from its full default HTML response, not the lighter header-forced variant; Reddit karma also needed HTML-aware parsing because the numbers sit inside `<span>` markup. LessWrong was left out rather than guessed because only the site root, not a profile URL, was available.

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
