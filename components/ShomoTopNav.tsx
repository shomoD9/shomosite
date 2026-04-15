/*
This file renders the site-wide top navigation for Shomosite. It exists
separately because the Gwern-oriented refresh replaces Quartz's default sidebar
chrome with a single horizontal header that owns section navigation and reading
utilities together. It talks to Quartz's current page slug so it can mark the
active section, and it embeds the existing search and dark-mode components so
those behaviors stay Quartz-native rather than being rebuilt.
*/

import * as QuartzComponent from "../quartz/components"
import { QuartzComponent as QuartzComponentType, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"
import { FullSlug } from "../quartz/util/path"
import { concatenateResources } from "../quartz/util/resources"
import { pathToRoot, resolveRelative } from "../quartz/util/path"
import style from "./styles/shomoTopNav.scss"

type NavLink = {
  label: string
  target: "index" | "prose/index" | "product/index" | "docs/index" | "docs/design"
}

const Search = QuartzComponent.Search({ enablePreview: true })
const Darkmode = QuartzComponent.Darkmode()

const navLinks: NavLink[] = [
  { label: "Site", target: "index" },
  { label: "Prose", target: "prose/index" },
  { label: "Product", target: "product/index" },
  { label: "Docs", target: "docs/index" },
  { label: "Design", target: "docs/design" },
]

function matchesTarget(currentSlug: string, target: NavLink["target"]) {
  if (target === "index") {
    return currentSlug === "index"
  }

  if (target.endsWith("/index")) {
    const prefix = target.replace(/\/index$/, "/")
    return currentSlug === target || currentSlug.startsWith(prefix)
  }

  return currentSlug === target
}

export default (() => {
  const ShomoTopNav: QuartzComponentType = (props: QuartzComponentProps) => {
    const currentSlug = (props.fileData.slug ?? "index") as FullSlug
    const homeHref = pathToRoot(currentSlug)

    return (
      <nav class="shomo-top-nav" aria-label="Primary">
        <a class="shomo-top-nav__brand" href={homeHref}>Shomosite</a>
        <div class="shomo-top-nav__links">
          {navLinks.map((link) => {
            const isActive = matchesTarget(currentSlug, link.target)
            return (
              <a
                href={resolveRelative(currentSlug, link.target as FullSlug)}
                class={isActive ? "shomo-top-nav__link is-active" : "shomo-top-nav__link"}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </a>
            )
          })}
        </div>
        <div class="shomo-top-nav__utilities">
          <Search {...props} />
          <Darkmode {...props} />
        </div>
      </nav>
    )
  }

  ShomoTopNav.css = concatenateResources(style, Search.css, Darkmode.css)
  ShomoTopNav.beforeDOMLoaded = concatenateResources(Search.beforeDOMLoaded, Darkmode.beforeDOMLoaded)
  ShomoTopNav.afterDOMLoaded = concatenateResources(Search.afterDOMLoaded, Darkmode.afterDOMLoaded)

  return ShomoTopNav
}) satisfies QuartzComponentConstructor
