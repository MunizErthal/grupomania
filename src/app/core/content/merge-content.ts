import { SiteContent } from './content.model';

type Plain = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Plain =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Deep-merges saved content over the defaults so a document saved by an older
 * version of the site still renders when new fields are added later.
 * Arrays are taken from the saved side as a whole (the owner edits lists).
 */
export function mergeContent(defaults: SiteContent, saved: Partial<SiteContent> | null): SiteContent {
  if (!saved) return structuredClone(defaults);
  return mergeValue(defaults, saved) as SiteContent;
}

function mergeValue(base: unknown, override: unknown): unknown {
  if (override === undefined || override === null) return structuredClone(base);
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Plain = {};
    for (const key of new Set([...Object.keys(base), ...Object.keys(override)])) {
      out[key] = mergeValue(base[key], override[key]);
    }
    return out;
  }
  return structuredClone(override);
}
