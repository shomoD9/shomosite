/*
This file renders the right-gutter rail used for margin notes. Prose renditions
can hydrate authored preview fragments into the rail, while product, skill,
About, and Design pages retain reserved whitespace so the reading shell stays
structurally consistent.
It talks to the current page slug and to the client-side margin-note script that
hydrates the rail from staged sidenote fragments.
*/

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"
import { concatenateResources } from "../quartz/util/resources"
import { isMarginNotePage, isPrimaryNotePage } from "./siteData"
// @ts-ignore
import script from "./scripts/marginNotes.inline"
import style from "./styles/shomoMarginNotes.scss"

export default (() => {
  const ShomoMarginNotes: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    if (!isPrimaryNotePage(fileData)) {
      return null
    }

    const mode = isMarginNotePage(fileData) ? "active" : "reserved"

    return (
      <aside class="shomo-margin-notes" data-margin-notes={mode}>
        <div class="shomo-margin-notes__canvas"></div>
      </aside>
    )
  }

  ShomoMarginNotes.css = concatenateResources(style)
  ShomoMarginNotes.afterDOMLoaded = script
  return ShomoMarginNotes
}) satisfies QuartzComponentConstructor
