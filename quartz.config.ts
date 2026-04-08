/*
This file is the site-level contract between Shomosite's source notes and Quartz's
build pipeline. It exists separately because publication rules, typography, and
content parsing shape the whole public site and need one place where those
decisions remain legible. It talks to the local custom filter and transformer
plugins, to the generated `.quartz-content` workspace prepared before each build,
and to `quartz.layout.ts`, which decides how the parsed notes are rendered.
*/

import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import ShomoFolderContent from "./components/ShomoFolderContent"
import { PublishedState } from "./filters/PublishedState"
import { PlainTextBrokenLinks } from "./plugins/PlainTextBrokenLinks"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Shomosite",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    // The deploy hostname is intentionally configurable, but local builds still need a concrete default.
    baseUrl: process.env.QUARTZ_BASE_URL ?? "localhost:8080",
    ignorePatterns: [".obsidian", ".DS_Store"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Libre Baskerville",
        body: "Source Serif 4",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#fffdfa",
          lightgray: "#ebe5da",
          gray: "#a59a8c",
          darkgray: "#5e5448",
          dark: "#201b15",
          secondary: "#34516e",
          tertiary: "#86684c",
          highlight: "rgba(134, 104, 76, 0.12)",
          textHighlight: "#f7e7a187",
        },
        darkMode: {
          light: "#14110f",
          lightgray: "#2c2723",
          gray: "#70665d",
          darkgray: "#d7d0c5",
          dark: "#f7f3eb",
          secondary: "#9bb9d2",
          tertiary: "#c49b73",
          highlight: "rgba(155, 185, 210, 0.15)",
          textHighlight: "#8a6f0e66",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      // Public prose should stay readable when it points toward private or still-unpublished notes.
      Plugin.ObsidianFlavoredMarkdown({
        enableInHtmlEmbed: false,
        disableBrokenWikilinks: true,
      }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      PlainTextBrokenLinks(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [PublishedState()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage({
        // The section landing pages need custom grouping rather than Quartz's default one-list output.
        pageBody: ShomoFolderContent(),
      }),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
