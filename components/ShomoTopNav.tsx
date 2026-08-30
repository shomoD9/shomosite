/*
This file renders the public navigation contract for Shomosite. It owns the
site-name home link, the four primary sections, and Quartz-native search and
theme controls so every archive page exposes the same routes and utilities.
*/

import * as QuartzComponent from "../quartz/components"
import { QuartzComponent as QuartzComponentType, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"
import { FullSlug } from "../quartz/util/path"
import { concatenateResources } from "../quartz/util/resources"
import { pathToRoot, resolveRelative } from "../quartz/util/path"
import style from "./styles/shomoTopNav.scss"

type NavLink = {
  label: string
  target: "prose/index" | "product/index" | "about/index" | "design/index"
}

const Search = QuartzComponent.Search({ enablePreview: true })
const Darkmode = QuartzComponent.Darkmode()

const navLinks: NavLink[] = [
  { label: "Prose", target: "prose/index" },
  { label: "Product", target: "product/index" },
  { label: "About", target: "about/index" },
  { label: "Design", target: "design/index" },
]

function matchesTarget(currentSlug: string, target: NavLink["target"]) {
  if (target.endsWith("/index")) {
    const prefix = target.replace(/\/index$/, "/")
    return currentSlug === target || currentSlug.startsWith(prefix)
  }

  return currentSlug === target
}

export default (() => {
  const ShomoTopNav: QuartzComponentType = (props: QuartzComponentProps) => {
    const currentSlug = (props.fileData.slug ?? "index") as FullSlug

    return (
      <nav class="shomo-top-nav" aria-label="Primary">
        <a class="shomo-top-nav__brand" href={pathToRoot(currentSlug)}>Shomodip De</a>
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
