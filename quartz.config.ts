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
          light: "#f9f7f3",
          lightgray: "#d8d2c6",
          gray: "#888078",
          darkgray: "#352e27",
          dark: "#1a1612",
          secondary: "#4a4238",
          tertiary: "#6e6458",
          highlight: "rgba(120, 107, 91, 0.10)",
          textHighlight: "#ede1be8c",
        },
        darkMode: {
          light: "#161310",
          lightgray: "#2e2822",
          gray: "#7a7268",
          darkgray: "#e0d8cc",
          dark: "#f3efe5",
          secondary: "#c8bfb0",
          tertiary: "#dcc9a8",
          highlight: "rgba(225, 200, 165, 0.10)",
          textHighlight: "#8d78403f",
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
