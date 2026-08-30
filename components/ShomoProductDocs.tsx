/*
This file renders the documentation tree on each product or skill overview. It
uses the public `/product/<slug>/docs/...` hierarchy so the landing page always
shows the documentation that belongs to that catalog entry.
*/

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"
import { resolveRelative } from "../quartz/util/path"
import { concatenateResources } from "../quartz/util/resources"
import { getProductClusters, getSummary, getTitle, isProductRootPage } from "./siteData"
import style from "./styles/shomoProductDocs.scss"

export default (() => {
  const ShomoProductDocs: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    if (!isProductRootPage(fileData)) {
      return null
    }

    const cluster = getProductClusters(allFiles).find((entry) => entry.root.slug === fileData.slug)
    if (!cluster || cluster.docs.length === 0) {
      return null
    }

    return (
      <section class="shomo-product-docs" aria-labelledby="shomo-product-docs-title">
        <h2 id="shomo-product-docs-title">Documentation</h2>
        <ul>
          {cluster.docs.map((page) => (
            <li>
              <a class="internal" href={resolveRelative(fileData.slug!, page.slug!)}>
                {getTitle(page)}
              </a>
              {getSummary(page) && <p>{getSummary(page)}</p>}
            </li>
          ))}
        </ul>
      </section>
    )
  }

  ShomoProductDocs.css = concatenateResources(style)
  return ShomoProductDocs
}) satisfies QuartzComponentConstructor
