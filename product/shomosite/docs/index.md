---
title: Shomosite
state: published
shape: product
summary: The public wiki site that renders Shomo's prose, products, and design notes through Quartz.
topics:
  - sites
  - publishing
tags:
  - sites
  - publishing
created: 2026-04-08
updated: 2026-04-09
---

Shomosite is the downstream public renderer in the larger writing system. It consumes the publishable parts of the broader private vault, keeps the wiki structure intact, and renders the public subset as a serious reading environment instead of a blog theme.

## Public Surface

The public surface is intentionally small at the top level. `/`, `/prose`, `/product`, and selective `/docs` pages are the stable front doors, while the deeper routes preserve the source shape of the notes rather than hiding them behind a CMS vocabulary.

## Rendering Flow

The repo stages `docs/`, `prose/`, and `product/` into Quartz, keeping only `state: published` material routable. Prose root notes and product docs are then rendered into the same reading shell so a page like [[prose/anthropic-exceptionalism|Anthropic Exceptionalism]] can sit beside product documentation without turning into a different kind of site.

## Near-Term Constraint

Right now the system is intentionally manual at the sync boundary with `master`. That is a feature, not a bug, because the important thing at this stage is that the public renderer expresses the shape of the thinking clearly before the publishing pipeline becomes more automated.
