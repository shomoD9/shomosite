# Architecture

## Opening

This project is a personal website built as a literary creator hub. Its purpose is not just to present profile information, but to act as a canonical home where several forms of work can be understood as one coherent body: essays, video commentary, books, and software tools. Instead of forcing visitors to jump across disconnected platforms, the site offers a stable center that mirrors key material, links to canonical publishing sources when appropriate, and preserves a consistent editorial voice across mediums.

The system is designed around two simultaneous commitments. The first is editorial clarity: each medium has its own dedicated space and browsing rhythm. The second is structural continuity: all of those spaces share one design language, one content ontology, and one navigation frame, so the site reads like a single argument rather than a pile of unrelated projects. The homepage embodies this by opening with a "Who Am I?" thesis and then showing the latest movement across mediums.

At a technical level, the site uses Next.js App Router with TypeScript and Tailwind CSS. External feeds are ingested with resilient fallback behavior, local long-lived content is maintained in MDX files, and metadata concerns such as SEO, robots, sitemap, and analytics are handled as first-class architectural components rather than afterthoughts. The current visual language is intentionally matte and literary, blending dark-academia warmth with bhadralok restraint through low-luminance paper tones, subdued brass accents, and text-forward composition.

## Ontology

The most fundamental entity in the system is an entry, represented by `BaseEntry` in `src/types/content.ts`. An entry is anything publishable that can appear in a card, be dated, be linked, and be tagged. On top of this base, the system defines specialized entities that express medium-specific behavior.

An essay is modeled as `EssayEntry`. It comes from Substack, carries a local slug for on-site routing, includes a canonical URL for attribution, and may contain either full sanitized HTML or only an excerpt when the feed is truncated. This dual representation allows the site to preserve continuity even when upstream data is partial.

A video is modeled as `VideoEntry`. It comes from YouTube feed data and emphasizes outbound watch behavior. A video carries a platform identity (`videoId`), optional thumbnail metadata, and a canonical external URL where playback happens.

A book is modeled as `BookEntry`. It is authored locally in MDX, which means editorial context is controlled inside this repository. A book includes author metadata, lifecycle status, and primary or secondary outbound links.

A tool is modeled as `ToolEntry`. It is also locally curated in MDX and represents software work with platform and lifecycle context, plus explicit links to repository, live app, and optionally Chrome Web Store listing.

The system also defines `FeedResult<T>`, which gives each feed-backed medium a status of live, cache, or empty. This is the contract that lets route rendering remain graceful when external services fail.

## Geography

The project root contains the runtime and tooling envelope. `package.json` defines Next.js, Tailwind, feed parsing, markdown processing, and test dependencies, while `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `.eslintrc.cjs`, `vitest.config.ts`, `vitest.setup.ts`, and `playwright.config.ts` define compile, styling, linting, unit/integration testing, and end-to-end testing behavior. `.env.example` documents deployment-time configuration and `next-env.d.ts` provides framework type plumbing.

The application itself lives under `src/`. The `src/app/` directory is the route surface. `src/app/layout.tsx` establishes global fonts, analytics injection, and shared chrome using `src/components/site-header.tsx` and `src/components/site-footer.tsx`. `src/app/page.tsx` is the manifesto-driven homepage that composes cross-medium recency via `src/components/manifesto-hero.tsx` and `src/components/latest-media.tsx`. The medium indexes are `src/app/essays/page.tsx`, `src/app/videos/page.tsx`, `src/app/books/page.tsx`, and `src/app/tools/page.tsx`. Detail pages live in `src/app/essays/[slug]/page.tsx`, `src/app/books/[slug]/page.tsx`, and `src/app/tools/[slug]/page.tsx`. Platform metadata endpoints are in `src/app/robots.ts` and `src/app/sitemap.ts`, and fallback UX is in `src/app/not-found.tsx`. Shared global visual language is defined in `src/app/globals.css`.

Reusable interface modules live in `src/components/`. `src/components/content-card.tsx` is the common card primitive for entries, `src/components/rich-text.tsx` is the controlled HTML renderer for sanitized rich content, and the other components shape global navigation and homepage narrative blocks.

The data and behavior core lives in `src/lib/`. `src/lib/site-config.ts` centralizes environment-driven configuration, including canonical Substack and YouTube feed endpoints plus identity links such as LinkedIn. `src/lib/links.ts` creates prefilled contact links, and `src/lib/date.ts` handles display and ordering date logic. The `src/lib/content/` subdirectory is the content ingestion and normalization engine: `src/lib/content/rss.ts` handles XML parsing primitives, `src/lib/content/substack.ts` maps Substack feed items, `src/lib/content/youtube.ts` maps YouTube feed entries, `src/lib/content/cache-store.ts` provides last-successful fallback semantics, `src/lib/content/mdx.ts` loads books and tools from local MDX files, `src/lib/content/aggregate.ts` composes cross-medium recency for the homepage, and `src/lib/content/index.ts` exposes stable loader contracts for routes. SEO-specific helpers live in `src/lib/seo/metadata.ts` and `src/lib/seo/json-ld.ts`.

The core type vocabulary is in `src/types/content.ts`. Local curated content lives in `content/books/` and `content/tools/`, where each `.mdx` file is both metadata and narrative body content for a detail page. Test coverage is organized by intent in `tests/unit/`, `tests/integration/`, and `tests/e2e/`.

## Flow

A primary flow begins when a visitor lands on `/`. The request enters `src/app/page.tsx`, which concurrently loads essay feed data, video feed data, and local tools. Essay and video loaders pass through `src/lib/content/index.ts`, which routes external calls to adapters and wraps them in `withLastSuccessfulCache` from `src/lib/content/cache-store.ts`. The page then merges streams through `buildLatestAcrossMedia` in `src/lib/content/aggregate.ts`, renders the "Who Am I?" hero statement, and presents a recency-sorted cross-medium strip. If an external feed fails, the same route still renders because feed loaders return a status-aware result instead of throwing uncaught errors.

Another core flow begins on `/essays`. `src/app/essays/page.tsx` requests `getEssayFeed()`. The Substack adapter in `src/lib/content/substack.ts` fetches RSS XML, parses it via `src/lib/content/rss.ts`, sanitizes HTML, normalizes summaries, and emits typed `EssayEntry` values. The route then renders cards linked to `/essays/[slug]`. When a visitor opens one of those pages, `src/app/essays/[slug]/page.tsx` resolves the slug from typed entries, emits article metadata and JSON-LD from `src/lib/seo/json-ld.ts`, and chooses between full rendered HTML and excerpt fallback depending on what the feed provided.

A local-content flow powers books and tools. On `/books` or `/tools`, route files call loaders in `src/lib/content/mdx.ts`, which read MDX files from `content/books/` and `content/tools/`, strip narrative header comments, parse frontmatter, compile markdown body to HTML, and return sorted typed entries. Detail routes use slugs from those entries for static path generation and render long-form body content through `src/components/rich-text.tsx`.

Search and crawler flow is handled by `src/app/sitemap.ts` and `src/app/robots.ts`. These routes collect static paths and dynamic content slugs into crawlable inventory, ensuring discovery remains aligned with the same data contracts used by human-facing pages.

## Philosophy

The architecture intentionally separates medium-specific ingestion from route rendering. Feed parsing, sanitization, and fallback behavior live in adapters and content helpers, while routes focus on composition and narrative presentation. This keeps failure handling and data normalization testable and prevents page files from turning into parsing scripts.

The system accepts that not all sources are equally reliable. External feeds can fail or return partial entries, so the design favors graceful degradation over strict fragility. That is why `FeedResult` carries state and why canonical outbound links remain explicit. The website stays trustworthy by being transparent about where data comes from and what is mirrored.

Another deliberate choice is local MDX ownership for books and tools. These mediums represent longer-lived editorial context and should remain easy to curate without dependency on third-party API shape changes. External automation is used where freshness matters most, while local files are used where authorial control matters most.

Finally, the codebase is narrated on purpose. File-level headers and intent-focused inline comments are treated as part of the architecture, not decoration. The goal is to keep the project understandable to someone who thinks in systems and prose, so structural meaning remains available even when implementation details evolve.

The design system now treats atmosphere as architecture rather than decoration. Color tokens, card surfaces, and typographic contrast are coordinated to make intellectual ambition legible at first glance, while still preserving readability and navigational clarity on both mobile and desktop layouts. The visual journey is intentionally inward: darker edges, restrained highlights, and chapter-like section containers are used to create a rabbit-hole sensation without sacrificing legibility.
