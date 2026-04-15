/*
This file turns unresolved or private wikilinks into readable plain text. It
exists separately because Shomosite's public rule is semantic rather than purely
technical: if a public note points toward something private, the prose should
still read cleanly instead of advertising a broken destination. It talks to the
Obsidian-flavored markdown output and rewrites Quartz's broken-link placeholders
before pages are rendered.
*/

import { Root } from "hast"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../quartz/plugins/types"

export const PlainTextBrokenLinks: QuartzTransformerPlugin = () => ({
  name: "PlainTextBrokenLinks",
  htmlPlugins() {
    return [
      () => {
        return (tree: Root) => {
          visit(tree, "element", (node, index, parent) => {
            if (!parent || index === undefined || node.tagName !== "a") {
              return
            }

            const classes = (node.properties?.className ?? []) as string[]
            const href = node.properties?.href

            // Quartz marks unresolved wikilinks as `.broken` anchors without an href.
            if (!classes.includes("broken") || typeof href === "string") {
              return
            }

            // Replacing the anchor with a span keeps the sentence readable without inventing a public route.
            parent.children[index] = {
              type: "element",
              tagName: "span",
              properties: { className: ["plain-link-fallback"] },
              children: node.children,
            }
          })
        }
      },
    ]
  },
})
