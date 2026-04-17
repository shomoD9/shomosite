# Roadmap

_Long-term items and features to be built down the line. Not a working to-do list — immediate tasks live in per-session implementation plans._

- (empty)

---

## 2026-04-17 - claude 4.7 opus (max) - shomosite

#shomos_preferences — In the landing page's two-column index, Shomo wants directional symmetry: if `PRODUCT` heading is right-aligned, its entry titles/summaries/dates and ordinal rail should align right as well, not just the section label.

#work_context — Adjusted `components/styles/shomoHomePanels.scss` so `.home-panel:nth-child(2)` mirrors the entire block: moved list-item padding rail from left to right, moved roman numeral pseudo-element to `right: 0`, and set `.home-panel-entry` to `text-align: right`. Rebuilt successfully (`npm run build`).

## 2026-04-16 - claude 4.7 opus (max) - shomosite

#shomos_preferences — Shomo wants the site to read as quietly dreamy / enlightenment-romanticism coded. Light mode = iron-gall ink on laid paper (slightly deeper, a hair cooler running-prose color plus a sub-pixel text-shadow bleed). Dark mode = moonlit vellum (same-luminance but cool-neutral prose color, whisper of silver halo). Popover window gets a pressed-plate 2px frame with a hair-thin inner engraving rule; dark mode adds a cool moonlight halo to the outer shadow. Rule of thumb going forward: dream effects must be invisible at reading distance and only surface when the eye rests on them. No font changes, no spacing changes — mood carried by color shifts and shadow/border work under ~0.3 opacity.

#shomos_preferences — Landing page aesthetic direction: IA (hero bio + two curated columns) is fixed and correct; fix comes from typographic rhythm, not new content or new components. Guiding moves: (1) hero and panels share one editorial frame rather than being mismatched widths; (2) numbered entries render as lowercase roman numerals in a hanging margin rail, not wiki Arabic numerals in the text flow; (3) a centered asterism (⁂) breaking a short hairline rule punctuates the hero→panels transition in place of a yawning margin; (4) first hero paragraph gets a small-caps first line (no drop cap) as a frontispiece gesture that ties the landing to prose-page openings. Entry titles outweigh body only slightly (1.16 rem, 600), dates sit underneath as small-caps sans in the tertiary color.

#work_context — Branch `codex/rebrand-rethink`. Landing page pass touched `quartz/styles/custom.scss` (added `--shomo-home-frame: 64rem`; widened `--shomo-home-copy` to `62rem`; retargeted index article + page-footer onto the home frame; bumped hero font-size clamp to 1.12–1.28 rem; tightened paragraph margins to 0.7 rem and line-height to 1.78; added `body[data-slug="index"] ... p:first-of-type::first-line` small-caps rule) and `components/styles/shomoHomePanels.scss` (full rewrite: position:relative + `::before` asterism glyph + `::after` hairline rule; panels clamp to `--shomo-home-frame`; h2 bumped + 1.5 px rule; `ol` counter-reset driving a `::before` with `counter(..., lower-roman)` in a 1.8 rem right-aligned rail; h3 to 1.16 rem; removed 26 rem summary cap; date restyled to 0.68 rem small-caps sans in tertiary; mobile tightens gap + shrinks asterism). No markup changes to `ShomoHomePanels.tsx`; no content changes to `index.md`. `npm run build` green, both themes verified in Playwright.
