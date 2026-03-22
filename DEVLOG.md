# Devlog

## 2026-03-22

14:06:00 IST - Audited the repository root, confirmed the presence of `ARCHITECTURE.md` and `DEVLOG.md`, and inspected git status before performing the branch reset.
14:07:00 IST - Listed every top-level path except `.git`, `ARCHITECTURE.md`, and `DEVLOG.md` to verify the exact deletion scope requested for the clean-slate rebuild.
14:08:00 IST - Removed all code, docs, configs, tests, generated output, content, and assets from the working tree while preserving `.git`, `ARCHITECTURE.md`, and `DEVLOG.md`.
14:09:00 IST - Rewrote `ARCHITECTURE.md` to describe the intentionally empty branch and appended this reset sequence to `DEVLOG.md` so the narrative state matches the filesystem.
14:10:00 IST - Re-entered the blank branch to implement the approved v1 rebuild plan and audited the surviving repository state plus git history for reusable public links and feed sources.
14:12:00 IST - Inspected the previous `site-config`, content entries, feed adapters, and git remote to recover truthful public URLs for Substack, YouTube, LinkedIn, email, and the GitHub repository.
14:14:00 IST - Created the new project directory scaffold and copied local serif and mono font files into `src/app/fonts` to satisfy the self-hosted typography requirement without remote fetches.
14:18:00 IST - Recreated root project infrastructure with `package.json`, TypeScript, Next.js, Tailwind, PostCSS, ESLint, Vitest, Playwright, environment documentation, and git ignore rules.
14:22:00 IST - Built the typed data model and behavior layer in `src/lib`, including shared content interfaces, site settings, mailto helpers, Markdown rendering, narrated content loading, feed parsing, date formatting, class joining, and metadata helpers.
14:29:00 IST - Built the shared UI layer in `src/components`, including the site mark, header, footer, hero, section reveal motion, track rail, rich text renderer, proof lists, archive lists, and the reusable track page template.
14:34:00 IST - Implemented the App Router surface in `src/app` with the root layout, global styling system, homepage, Prose/Product/Productivity/Work/Collaborate routes, icon, robots, and sitemap.
14:36:00 IST - Authored all local MDX content for the homepage, track pages, collaboration page, and curated proof records, including one intentionally hidden proof entry to exercise omission logic.
14:37:00 IST - Added unit, integration, and browser-level navigation tests covering feed parsing, homepage narrative structure, route rendering, hybrid-proof fallback behavior, and public navigation.
14:38:00 IST - Ran `npm install` to restore dependencies and generate the new lockfile for the rebuilt application.
14:40:00 IST - Ran `npm run test`; patched `vitest.config.ts` to exclude Playwright specs from Vitest and inject React during TSX test transforms after the first failure pass.
14:40:00 IST - Patched `vitest.setup.ts` with a `matchMedia` mock after jsdom failed on the reduced-motion check inside `src/components/section-reveal.tsx`.
14:41:00 IST - Patched `src/lib/content.ts` to strip leading MDX narration comments before frontmatter parsing so narrated content files remain valid data sources.
14:41:00 IST - Quoted the colon-bearing summary in `content/proof/linkedin-profile.mdx` after YAML parsing failed during the next test run.
14:41:00 IST - Re-ran `npm run test` and confirmed the unit and integration suites passed.
14:42:00 IST - Ran `npm run build`; patched the type guard in `src/lib/seo.ts` after TypeScript rejected the initial `sameAs` filter narrowing.
14:42:00 IST - Re-ran `npm run build` and confirmed the production build completed successfully.
14:43:00 IST - Ran `npm run lint` and confirmed there were no ESLint warnings or errors.
14:43:00 IST - Ran `npm run test:e2e`; tightened the Playwright navigation selectors and added explicit URL waits after two navigation assertion failures.
14:44:00 IST - Re-ran `npm run test:e2e` and confirmed the browser-level navigation test passed; noted the non-blocking Next.js dev warning about future `allowedDevOrigins` configuration during Playwright execution.
14:44:00 IST - Rewrote `ARCHITECTURE.md` to describe the rebuilt track-led site architecture and appended this full implementation and verification sequence to `DEVLOG.md`.
15:13:07 IST - Reviewed the local `playwright` skill instructions, confirmed `npm` and `npx` are available in the workspace, re-ran `npm run test:e2e`, and confirmed the browser-level navigation test still passes so local browser-run instructions can be given against a current verified state.
15:26:00 IST - Audited the current content documents, shared components, metadata helpers, and test files to locate the sales-forward copy and the places where AI language was leaking outside Productivity.
15:34:00 IST - Rewrote `content/pages/home.mdx`, `content/pages/prose.mdx`, `content/pages/product.mdx`, `content/pages/productivity.mdx`, and `content/pages/collaborate.mdx` to reposition the site as the public documentation of an independent research practice centered on productivity.
15:39:00 IST - Patched shared UI and route code in `src/app/`, `src/components/`, `src/lib/site-config.ts`, and `src/lib/seo.ts` so the hero points to Work, the public nav reads `Working together`, the footer and metadata match the new framing, and visible AI language remains confined to Productivity plus one quiet homepage mention.
15:44:00 IST - Updated the integration and browser tests to assert the new hero CTA, the renamed nav label, the document-first public-work language, and the rule that Prose and Product stay free of visible AI signaling.
15:47:00 IST - Ran `npm run test`, `npm run lint`, and `npm run build`; all passed after the copy repositioning pass.
15:48:00 IST - Ran `npm run test:e2e`; diagnosed a stale-server problem caused by Playwright reusing an older local dev server on port `3000`, which surfaced a dev-overlay runtime error unrelated to the new copy.
15:49:00 IST - Updated `playwright.config.ts` to launch an isolated dev server on port `3100`, re-ran `npm run test:e2e`, and confirmed the browser-level navigation test passed again against a fresh server.
15:49:43 IST - Rewrote `ARCHITECTURE.md` so the narrative map reflects the document-first independent-research framing, the quieter `Working together` surface, and the dedicated Playwright server configuration.

## 2026-03-21

14:34:00 IST - Reviewed the local `skill-installer` instructions and confirmed the workspace already contains `ARCHITECTURE.md` and `DEVLOG.md`.
14:35:00 IST - Installed the curated OpenAI skill `frontend-skill` into `/Users/shomo/.codex/skills/frontend-skill` with the helper installer script.

## 2026-03-01

23:15:14 IST - Audited repository structure and catalogued route/component/content files to understand current frontend composition.
23:15:14 IST - Reviewed home, essays, layout, global styles, navigation, hero, and section components to identify redesign scope.
23:15:14 IST - Reviewed content ingestion contracts and Substack adapter to preserve backend/data behavior while redesigning UI.
23:15:14 IST - Reviewed integration and E2E tests to prepare assertion updates for new front-end structure.
23:15:14 IST - Created `DEVLOG.md` and recorded initial investigation and planning activities.
23:16:00 IST - Rebuilt global shell in `src/app/layout.tsx` with ambient backdrop layers, shared navigation/footer framing, and analytics gate.
23:16:40 IST - Replaced `src/app/globals.css` with a new token system, atmosphere layers, Substack embed styling, reduced-motion handling, and compatibility utilities.
23:17:05 IST - Rewrote `src/components/navigation.tsx` as a scroll-reactive minimal nav with route-aware active links.
23:17:30 IST - Reworked `src/components/site-footer.tsx` for minimal contact framing and streamlined external actions.
23:18:20 IST - Rebuilt `src/components/hero/hero-section.tsx` with staged intro animation, scroll-scrub depth timeline, and damped pointer kinematics.
23:18:55 IST - Added new shared component `src/components/content/substack-embed-grid.tsx` to render official Substack link previews.
23:19:10 IST - Rewrote `src/components/content/essay-index.tsx` to use Substack embed previews and explicit feed-state messaging.
23:19:35 IST - Rebuilt `src/components/content/film-index.tsx` as a pinned horizontal scroll timeline with sparse cinematic cards.
23:19:55 IST - Rebuilt `src/components/content/software-index.tsx` with restrained stagger reveal and simplified tool surfaces.
23:20:05 IST - Updated `src/app/page.tsx` to compose the new section interfaces and pass feed status through.
23:20:20 IST - Reworked `src/app/essays/page.tsx` to render Substack-native embed previews for archive listings.
23:20:35 IST - Updated `tailwind.config.ts` token mappings and font stacks to match the new design language.
23:20:55 IST - Updated integration and E2E tests to assert the redesigned hero copy and Substack-preview structure.
23:21:05 IST - Ran `npm run lint` (pass) and `npm run test` (pass).
23:21:30 IST - Patched animation guards in hero/software components to avoid empty-target GSAP warnings.
23:21:55 IST - Re-ran `npm run test` to confirm warnings cleared and test suite remains green.
23:22:10 IST - Ran `npm run build`; initial failure due network-blocked `next/font/google` fetches.
23:22:35 IST - Removed `next/font/google` dependency from `src/app/layout.tsx` and switched to offline-safe local font stacks.
23:22:45 IST - Added root font variable defaults in `src/app/globals.css` for offline-safe typography.
23:23:05 IST - Re-ran `npm run build` (pass) and `npm run lint` (pass) to verify production stability.
23:23:25 IST - Rewrote `ARCHITECTURE.md` to reflect the new cinematic frontend architecture, component geography, and flow design.
23:23:30 IST - Final review pass on changed files and preparation of delivery summary.
23:23:45 IST - Inspected git status and confirmed modified/new files from redesign pass.
23:23:50 IST - Noted pre-existing untracked file `src/components/texture/atmosphere.tsx` and left it untouched.
23:23:55 IST - Compiled final delivery notes.

## 2026-03-02

00:01:29 IST - Received redesign request focused on new color direction and brand-principled frontend execution.
00:01:29 IST - Audited current git/worktree state and confirmed prior redesign files still present.
00:01:29 IST - Read `brand.md` in full to extract visual physics, typographic tension, and motion constraints.
00:01:29 IST - Reviewed current layout, globals, homepage composition, and section components to plan a second-pass redesign.
00:02:20 IST - Reworked global shell in `src/app/layout.tsx` to mount atmospheric texture layers and remove dependency on remote font fetching.
00:02:55 IST - Rebuilt `src/components/texture/atmosphere.tsx` with brand-aligned drifting radial light fields and reduced-motion safeguards.
00:03:20 IST - Rebuilt `src/components/texture/noise.tsx` with documented film-grain turbulence overlay.
00:04:05 IST - Replaced `src/app/globals.css` with a new aristocratic palette, depth gradients, typographic base, and refined utility aliases.
00:04:20 IST - Updated `tailwind.config.ts` tokens and font stacks to match the new palette and typography direction.
00:04:55 IST - Rebuilt `src/components/navigation.tsx` with superposed-cross symbol motif and refined scrolled-state behavior.
00:06:05 IST - Rebuilt `src/components/hero/hero-section.tsx` to reflect brand physics: vast spacing, layered depth, damped pointer kinematics, and scroll-scrub transitions.
00:06:40 IST - Restyled and tightened `src/components/content/essay-index.tsx` and `src/components/content/substack-embed-grid.tsx` while preserving Substack-native previews.
00:07:05 IST - Rebuilt `src/components/content/film-index.tsx` and `src/components/content/software-index.tsx` with cinematic sequencing and weighted reveals.
00:07:15 IST - Restyled `src/components/site-footer.tsx` and `src/app/essays/page.tsx` for archive consistency with the new design language.
00:07:20 IST - Updated homepage metadata text in `src/app/page.tsx`.
00:07:35 IST - Updated integration and E2E tests to assert new hero/navigation/CTA copy.
00:07:30 IST - Ran `npm run lint` (pass).
00:07:24 IST - Ran `npm run test`; fixed one assertion mismatch in `tests/integration/essays-page.test.tsx`.
00:07:37 IST - Re-ran `npm run test` (pass).
00:07:50 IST - Ran `npm run build` (pass).
00:08:00 IST - Re-ran `npm run lint` (pass).
00:08:20 IST - Rewrote `ARCHITECTURE.md` to reflect the second-pass brand-driven visual system and texture component geography.
