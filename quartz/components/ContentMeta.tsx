/*
This file is Quartz's article-metadata component. It exists as a reusable
component because layouts can ask for a compact line of page facts without
knowing where those facts come from. Shomosite keeps the component in place for
Quartz compatibility, but the public reading shell now treats dates and reading
times as source data rather than visible page furniture.
*/

import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Quartz callers may still pass the historical options, so the merge preserves the public API.
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata(_props: QuartzComponentProps) {
    void options

    // The metadata still exists in parsed page data for sorting, feeds, and build output.
    // The reader-facing page, however, should no longer print dates or reading-time estimates.
    return null
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
