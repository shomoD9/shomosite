/*
This file renders the right-gutter rail used for prose margin notes. It exists
separately because the right gutter is no longer a generic sidebar slot: on
prose notes it becomes a live margin-note surface, while on product notes it
remains reserved whitespace so the reading shell stays structurally consistent.
It talks to the current page slug and to the client-side margin-note script that
hydrates the rail from staged sidenote fragments.
*/

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"
import { concatenateResources } from "../quartz/util/resources"
import { isPrimaryNotePage, isProseNotePage } from "./siteData"
// @ts-ignore
import script from "./scripts/marginNotes.inline"
import style from "./styles/shomoMarginNotes.scss"

export default (() => {
  const ShomoMarginNotes: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    if (!isPrimaryNotePage(fileData)) {
      return null
    }

    const mode = isProseNotePage(fileData) ? "prose" : "reserved"

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
