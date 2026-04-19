/*
This file renders the homepage's two curated columns. It exists separately
because the home page is not just another folder listing: it is an editorial
front door whose prose comes from `docs/index.md` and whose two columns are
manually curated rather than automatically derived. It talks to the homepage
frontmatter, to the parsed site-wide page data, and to Quartz's relative-link
utilities so the generated links stay source-shaped.
*/

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"
import { concatenateResources } from "../quartz/util/resources"
import { resolveRelative } from "../quartz/util/path"
import style from "./styles/shomoHomePanels.scss"
import { getSummary, getTitle, resolveHomeEntries } from "./siteData"

function HomeColumn({
  title,
  items,
  fileData,
}: {
  title: string
  items: QuartzComponentProps["allFiles"]
  fileData: QuartzComponentProps["fileData"]
}) {
  return (
    <section class="home-panel">
      <h2>{title}</h2>
      <ol>
        {items.map((page) => (
          <li>
            <article class="home-panel-entry">
              <h3>
                <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                  {getTitle(page)}
                </a>
              </h3>
              {getSummary(page) && <p>{getSummary(page)}</p>}
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default (() => {
  const HomePanels: QuartzComponent = ({ fileData, allFiles }) => {
    if (fileData.slug !== "index") {
      return null
    }

    // The homepage stays intentionally hand-shaped so the first impression remains authored.
    const prose = resolveHomeEntries(fileData, allFiles, "prose")
    const product = resolveHomeEntries(fileData, allFiles, "product")

    return (
      <div class="home-panels">
        <HomeColumn title="Prose" items={prose} fileData={fileData} />
        <HomeColumn title="Product" items={product} fileData={fileData} />
      </div>
    )
  }

  HomePanels.css = concatenateResources(style)
  return HomePanels
}) satisfies QuartzComponentConstructor
