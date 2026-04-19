/*
This file is the rendering blueprint for Shomosite's public pages. It exists as
its own file because layout decisions are architectural: they decide how search,
navigation, metadata, and reading aids relate across every note. It talks to the
Quartz component library for the shared reading system and to the custom Shomo
homepage component that renders the curated front page index.
*/

import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import ShomoHomePanels from "./components/ShomoHomePanels"
import ShomoMarginNotes from "./components/ShomoMarginNotes"
import ShomoTopNav from "./components/ShomoTopNav"
import ShomoVanityMetricsScript from "./components/ShomoVanityMetricsScript"
import { isHomePage, isPrimaryNotePage } from "./components/siteData"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [ShomoTopNav()],
  afterBody: [
    Component.ConditionalRender({
      component: ShomoHomePanels(),
      condition: (page) => isHomePage(page.fileData),
    }),
    Component.ConditionalRender({
      component: ShomoVanityMetricsScript(),
      condition: (page) => isHomePage(page.fileData),
    }),
    Component.ConditionalRender({
      component: Component.Backlinks(),
      condition: (page) => isPrimaryNotePage(page.fileData),
    }),
  ],
  footer: Component.Spacer(),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => !isHomePage(page.fileData),
    }),
  ],
  left: [
    Component.ConditionalRender({
      component: Component.TableOfContents(),
      condition: (page) => isPrimaryNotePage(page.fileData) && Boolean(page.fileData.toc?.length),
    }),
  ],
  right: [
    Component.ConditionalRender({
      component: ShomoMarginNotes(),
      condition: (page) => isPrimaryNotePage(page.fileData),
    }),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle()],
  left: [],
  right: [],
}
