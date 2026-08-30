/*
This file renders the archive metadata readers need to understand a page. It
turns prose source attribution, primary topics, design families, and product
lifecycle fields into a consistent visible block beneath Quartz's basic date
and reading-time metadata.
*/

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"
import { FullSlug, resolveRelative } from "../quartz/util/path"
import { concatenateResources } from "../quartz/util/resources"
import {
  formatMetadataLabel,
  getItemStatus,
  getItemType,
  getPrimaryTopic,
  getTopic,
  isProductNotePage,
  isProseArticlePage,
} from "./siteData"
import style from "./styles/shomoPageMeta.scss"

function frontmatterString(props: QuartzComponentProps, field: string): string {
  const value = props.fileData.frontmatter?.[field]
  return typeof value === "string" ? value : ""
}

export default (() => {
  const ShomoPageMeta: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData } = props

    if (isProseArticlePage(fileData)) {
      const sourceName = frontmatterString(props, "sourceName")
      const sourceUrl = frontmatterString(props, "sourceUrl")
      const designFamily = frontmatterString(props, "designFamily")
      const published = frontmatterString(props, "published")
      const added = frontmatterString(props, "added")
      const topic = getTopic(getPrimaryTopic(fileData))

      return (
        <dl class="shomo-page-meta" aria-label="Article details">
          {topic && (
            <div>
              <dt>Topic</dt>
              <dd>
                <a
                  class="internal"
                  href={resolveRelative(fileData.slug!, `prose/topics/${topic.slug}/index` as FullSlug)}
                >
                  {topic.label}
                </a>
              </dd>
            </div>
          )}
          {sourceName && (
            <div>
              <dt>Original source</dt>
              <dd>{sourceUrl ? <a href={sourceUrl}>{sourceName}</a> : sourceName}</dd>
            </div>
          )}
          {published && (
            <div>
              <dt>Originally published</dt>
              <dd>{published}</dd>
            </div>
          )}
          {added && (
            <div>
              <dt>Added here</dt>
              <dd>{added}</dd>
            </div>
          )}
          {designFamily && (
            <div>
              <dt>Design family</dt>
              <dd>{formatMetadataLabel(designFamily)}</dd>
            </div>
          )}
        </dl>
      )
    }

    if (isProductNotePage(fileData)) {
      const itemType = getItemType(fileData)
      const status = getItemStatus(fileData)

      if (!itemType && !status) {
        return null
      }

      return (
        <dl class="shomo-page-meta" aria-label="Product details">
          {itemType && (
            <div>
              <dt>Type</dt>
              <dd>{formatMetadataLabel(itemType)}</dd>
            </div>
          )}
          {status && (
            <div>
              <dt>Status</dt>
              <dd>{formatMetadataLabel(status)}</dd>
            </div>
          )}
        </dl>
      )
    }

    return null
  }

  ShomoPageMeta.css = concatenateResources(style)
  return ShomoPageMeta
}) satisfies QuartzComponentConstructor
