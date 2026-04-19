/*
This component exists solely to attach the vanity-metrics count-up script to the
homepage. It renders nothing visible; its only job is to carry the
afterDOMLoaded script so the Quartz bundler includes it on pages where this
component is mounted.
*/

import { QuartzComponent, QuartzComponentConstructor } from "../quartz/components/types"
// @ts-ignore
import script from "./scripts/vanityMetrics.inline"

export default (() => {
  const ShomoVanityMetricsScript: QuartzComponent = () => null
  ShomoVanityMetricsScript.afterDOMLoaded = script
  return ShomoVanityMetricsScript
}) satisfies QuartzComponentConstructor
