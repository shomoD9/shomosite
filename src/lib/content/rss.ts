/*
 * This file normalizes XML parsing rules used by both Substack and YouTube adapters.
 * It exists separately because feed parsing is a cross-cutting infrastructure concern, not product logic.
 * Adapter modules import these helpers to turn raw XML strings into predictable objects.
 */

import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseTagValue: true,
  trimValues: true
});

export function parseXml<T>(xml: string): T {
  return parser.parse(xml) as T;
}

export function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}
