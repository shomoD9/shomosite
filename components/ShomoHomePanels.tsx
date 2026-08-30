/*
This file renders the homepage's editorial archive summary. It combines
manually selected Prose and Product entries, automatically ordered recent
additions, and direct paths into the site's four primary sections.
*/

import { Date, getDate } from "../quartz/components/Date"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"
import { concatenateResources } from "../quartz/util/resources"
import { FullSlug, resolveRelative } from "../quartz/util/path"
import style from "./styles/shomoHomePanels.scss"
import { getRecentArchiveEntries, getSummary, getTitle, resolveHomeEntries } from "./siteData"

function HomeEntry({
  page,
  fileData,
  cfg,
}: {
  page: QuartzComponentProps["allFiles"][number]
  fileData: QuartzComponentProps["fileData"]
  cfg: QuartzComponentProps["cfg"]
}) {
  return (
    <article class="home-panel-entry">
      <h3>
        <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
          {getTitle(page)}
        </a>
      </h3>
      {getSummary(page) && <p>{getSummary(page)}</p>}
      {page.dates && (
        <p class="home-panel-date">
          <Date date={getDate(cfg, page)!} locale={cfg.locale} />
        </p>
      )}
    </article>
  )
}

function HomeColumn({
  title,
  items,
  emptyMessage,
  fileData,
  cfg,
}: {
  title: string
  items: QuartzComponentProps["allFiles"]
  emptyMessage: string
  fileData: QuartzComponentProps["fileData"]
  cfg: QuartzComponentProps["cfg"]
}) {
  return (
    <section class="home-panel">
      <h2>{title}</h2>
      {items.length === 0 ? (
        <p class="home-panel-empty">{emptyMessage}</p>
      ) : (
        <ol>
          {items.map((page) => (
            <li><HomeEntry page={page} fileData={fileData} cfg={cfg} /></li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default (() => {
  const HomePanels: QuartzComponent = ({ fileData, allFiles, cfg }) => {
    if (fileData.slug !== "index") {
      return null
    }

    const prose = resolveHomeEntries(fileData, allFiles, "prose")
    const product = resolveHomeEntries(fileData, allFiles, "product")
    const recent = getRecentArchiveEntries(allFiles)

    return (
      <div class="home-panels">
        <nav class="home-paths" aria-label="Explore Shomodip.com">
          {[
            ["Prose", "Topic-led archive of writing", "prose/index"],
            ["Product", "Products, skills, and documentation", "product/index"],
            ["About", "Shomodip and the archive", "about/index"],
            ["Design", "Design families and reading conventions", "design/index"],
          ].map(([title, summary, slug]) => (
            <a class="internal" href={resolveRelative(fileData.slug!, slug as FullSlug)}>
              <strong>{title}</strong>
              <span>{summary}</span>
            </a>
          ))}
        </nav>
        <div class="home-featured">
          <HomeColumn
            title="Selected Prose"
            items={prose}
            emptyMessage="Selected writing will appear as the new archive grows."
            fileData={fileData}
            cfg={cfg}
          />
          <HomeColumn
            title="Selected Product"
            items={product}
            emptyMessage="Selected products and skills will appear here."
            fileData={fileData}
            cfg={cfg}
          />
        </div>
        <HomeColumn
          title="Recent Additions"
          items={recent}
          emptyMessage="The archive is starting fresh. New writing, products, and skills will appear here."
          fileData={fileData}
          cfg={cfg}
        />
      </div>
    )
  }

  HomePanels.css = concatenateResources(style)
  return HomePanels
}) satisfies QuartzComponentConstructor
