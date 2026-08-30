/*
This file renders the manually selected relationships declared on prose and
product pages. It complements Quartz backlinks by showing editorially chosen
next readings even when the related page does not link back.
*/

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"
import { resolveRelative } from "../quartz/util/path"
import { concatenateResources } from "../quartz/util/resources"
import { getRelatedEntries, getSummary, getTitle, isArchiveItemPage } from "./siteData"
import style from "./styles/shomoRelatedItems.scss"

export default (() => {
  const ShomoRelatedItems: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    if (!isArchiveItemPage(fileData)) {
      return null
    }

    const related = getRelatedEntries(fileData, allFiles)
    return (
      <section class="shomo-related" aria-labelledby="shomo-related-title">
        <h2 id="shomo-related-title">Related</h2>
        {related.length === 0 ? (
          <p>No related items have been selected yet.</p>
        ) : (
          <ul>
            {related.map((page) => (
              <li>
                <a class="internal" href={resolveRelative(fileData.slug!, page.slug!)}>
                  {getTitle(page)}
                </a>
                {getSummary(page) && <p>{getSummary(page)}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    )
  }

  ShomoRelatedItems.css = concatenateResources(style)
  return ShomoRelatedItems
}) satisfies QuartzComponentConstructor
