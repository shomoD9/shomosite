/*
This file is the publication gate for Shomosite's public build. It exists as a
separate filter because publication state is a cross-cutting rule: every note,
regardless of section, must pass through the same explicit `state: published`
contract before it can become part of the public wiki. It talks only to Quartz's
filter pipeline and reads the frontmatter on each parsed note.
*/

import { QuartzFilterPlugin } from "../quartz/plugins/types"

export const PublishedState: QuartzFilterPlugin = () => ({
  name: "PublishedState",
  shouldPublish(_ctx, [_tree, vfile]) {
    // A note is public only when it opts into the exact state contract described in the system docs.
    const state = vfile.data?.frontmatter?.state
    return typeof state === "string" && state.toLowerCase() === "published"
  },
})
