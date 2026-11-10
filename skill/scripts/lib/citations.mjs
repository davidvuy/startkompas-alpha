// Finding the cited URLs in the packs.
//
// Pulled out of check-links.mjs because this is the part that decides what gets
// probed at all, and a URL it fails to see is a claim whose evidence is never
// checked. That is worth testing directly, without the network.

/** Trailing sentence punctuation that is not part of the URL. */
const TRAILING = /[.,;]+$/;

/**
 * Collect every URL cited in a markdown link, with the documents citing it.
 *
 * Only markdown link targets — `[text](https://…)` — are harvested. A bare URL
 * in prose is deliberately ignored: the packs cite sources as links, and
 * matching loose text would pick up examples and placeholders such as
 * `https://…` and report them as dead.
 *
 * @param {Array<{label: string, text: string}>} documents
 * @returns {Map<string, string[]>} url -> labels of the documents citing it,
 *   in first-seen order, with duplicate labels collapsed
 */
export function harvestCitations(documents) {
  const citations = new Map();

  for (const {label, text} of documents) {
    for (const [, raw] of text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
      const url = raw.replace(TRAILING, '');
      if (!citations.has(url)) citations.set(url, []);
      const citing = citations.get(url);
      // One document citing the same URL twice is one citation, not two.
      if (!citing.includes(label)) citing.push(label);
    }
  }

  return citations;
}
