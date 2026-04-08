# Roadmap
- Add an automated but explicit sync/deploy path from the private `master` repository once the manual workflow has settled.
- Expand the homepage and section indices into richer editorial sub-sections as the prose and product corpus grows.
- Refine the long-term visual layer and motifs only after the wiki reading system and public information architecture are stable.
- Lock the eventual production domain, metadata, and social image strategy once the public hostname is decided.

## 2026-04-08 - GPT-5 - Codex App

#shomos_preferences The user wants a Quartz-first rebuild, Gwern-inspired reading principles rather than a visual clone, source-shaped routes, `docs/index.md` as the homepage source, `state: published` as the public gate, and both light and dark mode in v1.

#hurdles Quartz's content globbing respects gitignore, so the generated staging directory could not stay ignored without disappearing from the build; the workaround was to keep `.quartz-content/` unignored and rely on the prep script instead. `npx` also hit a user-level npm cache permission issue, so the repo scripts now invoke the local Quartz CLI directly. Playwright MCP failed on a local `/.playwright-mcp` permission path, so the last verification pass fell back to generated HTML inspection.

#work_context Replaced the deleted Next.js implementation with a Quartz-based site on `codex/rebrand-rethink`, added local staging and manual sync scripts, seeded public `docs/`, `prose/`, and `product/` content, and verified the rebuild with `npm run check`, `npm test`, and `npm run build`.

## 2026-04-05 - Gemini 3.1 Pro (High) - Antigravity

#shomos_preferences The retrofuturism aesthetic shouldn't be devoid of warmth. Maintain a familiar, dreamy, aesthetic vibe while aligning with technical/Enlightenment/Space fundamental ideas. Two modes are desired (light and dark), prioritizing light mode first. Mathematics page and existing generative ink motifs are to be removed entirely.

#work_context Shifted the design plan based on new preferences. Created the `agents.md` and `claude.md` routing files and established this journal. Moving to remove the `mathematics` route and generative ink imports from existing components.
