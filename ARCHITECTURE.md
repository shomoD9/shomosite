# Architecture

## Opening

This project is a personal publishing studio designed as a cinematic interface rather than a conventional content website. Its purpose is to stage essays, films, books, and software as one continuous argument: the dream-oriented scale of a romantic worldview fused with the procedural discipline of a builder mindset. The site is intentionally sparse in layout density so each module can breathe, while depth, light, and motion carry emotional tone in the background.

The system solves a coherence problem. The author publishes to multiple external ecosystems, especially Substack and YouTube, but still needs one canonical home where these outputs feel structurally related. This repository provides that home by mirroring external streams for freshness, preserving canonical outbound links for ownership, and maintaining slower-moving book and tool artifacts in local MDX. The result is a front-end instrument that can remain editorially stable while external platforms change.

Technically, the project uses Next.js App Router with TypeScript and Tailwind. Routes compose data and metadata, content adapters handle ingestion and resilience, and client components own animation and interaction choreography. The architecture is organized so front-end experimentation can advance aggressively without entangling feed parsing and without collapsing accessibility safeguards.

## Ontology

The foundational entity is `BaseEntry` in `src/types/content.ts`, which defines a publishable thing that can be titled, summarized, dated, tagged, and linked. Everything else in the system is a specialization of this base vocabulary.

An essay is modeled as `EssayEntry`, sourced from Substack feed data and enriched with a local slug plus canonical attribution URL. Essays can include full sanitized HTML for detail pages or summary-level data when feeds are truncated. List surfaces intentionally render Substack-native previews so the source platform’s presentation remains visible instead of being approximated by custom cards.

A video is modeled as `VideoEntry`, sourced from YouTube feed metadata with canonical watch URLs and optional thumbnails. Video entities are framed on-site as editorial signal, but playback authority remains external.

A book is modeled as `BookEntry`, sourced from local MDX and treated as slower, authored context with stable long-form body content. A tool is modeled as `ToolEntry`, also sourced from MDX, but oriented toward practical software proof with platform and lifecycle metadata. Feed-backed loaders return through `FeedResult<T>`, which makes live, cache, and empty states explicit so routes can degrade gracefully rather than fail silently.

## Geography

At the repository root, runtime and documentation scaffolding live side by side. `package.json` and `package-lock.json` define dependencies and scripts, while `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `.eslintrc.cjs`, `vitest.config.ts`, `vitest.setup.ts`, and `playwright.config.ts` define build, lint, and test behavior. `ARCHITECTURE.md` is the living narrative map of the system and `DEVLOG.md` is the chronological operational ledger. `brand.md` provides the design physics that guide front-end decisions.

Local authored content resides in `content/books/` and `content/tools/`, where MDX files define frontmatter metadata and long-form body content for detail routes. These files feed into content adapters rather than route-level parsing.

The route surface lives under `src/app/`. `src/app/layout.tsx` composes the global shell: static backdrop layers, animated atmosphere/noise texture overlays, optional analytics script injection, persistent navigation, and footer. `src/app/globals.css` defines the design tokens and structural visual primitives, including the layered background field, navigation state classes, Substack shell styling, legacy utility aliases, and reduced-motion fallbacks. `src/app/page.tsx` composes the homepage hero plus medium sections. Archive and detail routes are split across `src/app/essays`, `src/app/videos`, `src/app/books`, and `src/app/tools`, with crawler-facing endpoints in `src/app/sitemap.ts` and `src/app/robots.ts`.

Reusable interface modules live in `src/components/`. `src/components/navigation.tsx` owns route links, scroll-reactive shell transitions, and the superposed-cross mark in the brand lockup. `src/components/hero/hero-section.tsx` contains the primary opening choreography, including scroll-scrub depth and damped pointer kinematics. `src/components/content/essay-index.tsx`, `film-index.tsx`, and `software-index.tsx` shape each homepage medium with distinct interaction rhythms. `src/components/content/substack-embed-grid.tsx` provides the shared Substack preview renderer used on both home and essays archive routes. `src/components/texture/atmosphere.tsx` and `src/components/texture/noise.tsx` provide continuous ambient depth and film-grain texture at the app shell level.

System behavior and ingestion logic live in `src/lib/`. `src/lib/site-config.ts` centralizes environment-driven links and endpoints. `src/lib/content/substack.ts`, `youtube.ts`, `mdx.ts`, `rss.ts`, and `cache-store.ts` handle feed and file ingestion with resilience semantics, while `src/lib/content/index.ts` exposes stable route-facing loader contracts. SEO helpers remain in `src/lib/seo/metadata.ts` and `src/lib/seo/json-ld.ts`. Shared contracts are defined in `src/types/content.ts`, and test suites remain distributed across `tests/unit`, `tests/integration`, and `tests/e2e`.

## Flow

A primary user flow begins on `/`. `src/app/page.tsx` requests essay, video, and tool data concurrently. Feed-backed streams move through `src/lib/content/index.ts`, which delegates to source adapters and wraps calls with cache fallback behavior. The route then renders the hero and medium sections. The hero orchestrates entrance and depth timelines through GSAP. The essay section sends typed entries into `SubstackEmbedGrid`, which emits Substack-compatible markup and loads `https://substackapi.com/embeds.js` so previews resolve to canonical source cards. The film section maps the video stream onto a pinned horizontal timeline, while the builders section uses concise stagger reveal animations for tool rows.

A second flow starts on `/essays`. The route calls `getEssayFeed()`, receiving normalized Substack entries and feed status. If data is live or cached, previews render through the same Substack embed component used on the homepage, preserving consistency. If status is empty, the route shows explicit fallback messaging and a direct canonical outbound path.

A detail flow begins when users open `/essays/[slug]`, `/books/[slug]`, or `/tools/[slug]`. These routes resolve slugs against typed entries, emit route metadata and JSON-LD where appropriate, and render rich body content through shared presentation components. For essays, canonical attribution to Substack remains explicit. For books and tools, local MDX remains the canonical authored source.

Crawler flow is generated from `src/app/sitemap.ts` and `src/app/robots.ts`, which use the same route and content contracts as user-facing pages. This keeps discoverability aligned with runtime truth.

## Philosophy

The design philosophy treats space as status. Large negative space is not empty decoration but a structural commitment to calm, aristocratic pacing. Layouts avoid crowded boxes and rely on proportion, depth, and typographic contrast to guide attention.

The second principle is layered depth over flat ornament. The app shell combines static gradient fields, slow atmospheric drift, and low-opacity turbulence grain so the interface feels like a physical environment rather than a flat UI skin. Motion is applied with intent: scroll-scrubbed sequences where narrative requires continuity, damped pointer interpolation where tactile response adds value, and short weighted reveals where readability must remain dominant.

The third principle is canonical honesty. Essays use Substack’s own preview renderer, which keeps the mirror relationship explicit and prevents visual drift from the source platform. The system still adds framing and rhythm around those embeds, but does not re-skin the underlying source identity.

Finally, the codebase treats narration as part of architecture. File-level headers, intent comments at logical transitions, this architecture document, and the continuously updated devlog are all considered implementation work rather than optional documentation. The system is meant to remain legible to a reader who thinks in structures and prose as much as one who thinks in syntax.
