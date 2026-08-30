---
title: Design
state: published
shape: note
summary: The living design document for Shomodip.com.
---

Shomodip.com is the permanent archive for my writing, products, skills, and product documentation. Its design must make individual pages pleasant to read while keeping the whole body of work easy to browse, search, cite, and connect.

## Information Architecture

The primary navigation contains **Prose**, **Product**, **About**, and **Design**. The site name returns to the homepage, and search is available everywhere.

The homepage is an editorial front door. It introduces the archive, points toward the four primary sections, presents selected Prose and Product work, and shows recent additions.

Prose is organized by five primary topics:

- AI & Intelligence
- Knowledge & Systems
- Product & Design
- Psychology & Productivity
- Philosophy & Culture

Every prose piece has one primary topic and may have additional tags. Readers can also browse every piece in chronological order through **All Writing**.

Product is one combined catalog of products and skills. Catalog entries expose their type and one of four lifecycle states: Active, In Development, Experiment, or Archived. Each entry can have a nested documentation tree.

About provides concise orientation. Design explains this system and the page families used across it.

## Content Contract

When I supply a writing link, it enters the archive by default. Its Shomodip.com page preserves the original source name, source URL, and original publication date.

Each prose page also keeps a summary, permanent slug, site-added date, primary topic, optional tags, design family, manually selected related items, and automatically generated backlinks.

Each product or skill keeps an overview, type, lifecycle status, documentation tree, related Prose, and backlinks.

External publications remain source metadata. They do not become separate navigation sections.

## Design Families

Individual pages may use different visual approaches according to their material. They still share archive metadata, navigation, search, relationships, and responsive behavior.

### Editorial Essay

A reading-first page for long-form arguments and reflective writing.

### Visual Explainer

A page that uses diagrams, figures, comparisons, and structured visual sequences to explain a subject.

### Reference Guide

A compact, navigable page for definitions, frameworks, and material readers may revisit non-linearly.

### Product Documentation

A structured page for product and skill overviews, guides, decisions, and supporting documentation.

There is no fixed rule assigning a design family. The choice follows the piece.

## Shared Reading Behavior

Every page must remain readable on desktop and mobile. Internal links may open scrollable preview windows so a reader can inspect context without abandoning the current page. Preview windows may be pinned, dragged, maximized, restored, and closed.

Search covers Prose, products, skills, and documentation. Manual related items and automatic backlinks connect neighboring work.

Direct-link attachments remain outside navigation and indexes.

## Publishing Model

The repository is the direct source for the archive. Content no longer syncs from the Master Obsidian vault.

The current renderer converts the archive sources into static HTML. The public information architecture does not depend on a particular renderer or HTML-generation workflow, so those implementation choices may change later without changing routes or metadata contracts.

## Current Boundary

This design establishes the information architecture and shared reading capabilities. A future visual redesign may replace the current aesthetic while preserving these routes, content contracts, previews, search, relationships, and attachment URLs.
