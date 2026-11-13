// Which statute readings in the packs claim a version, and what version the
// portal says is in force today.
//
// This is the most dangerous kind of staleness in the packs and the only kind
// nothing caught. A dead URL is loud: check-links.mjs fails and the claim's
// evidence is visibly gone. An *amended* statute is silent — the URL still
// resolves, the page still looks official, and the article the pack quoted may
// since have been rewritten. The pack goes on asserting what it read.
//
// `wetten.overheid.nl` makes the comparison free: the undated `/BWBR0005289`
// redirects to `/BWBR0005289/<date>`, the version in force today. So a pack
// that states which version it read can be checked against that date without
// reading anything. A mismatch does not prove the pack wrong — an amendment
// may not touch the articles quoted — so this reports and never fails. It says
// which document to reread, which is the whole job.
//
// Two ways a pack states the version, and both are in use:
//   * a dated URL, `…/BWBR0001886/2026-01-01`;
//   * the portal's own phrase in the source annotation on the same line,
//     *"read on the official portal in the version `Geldend van 16-07-2026`"*.
// Same line, because every one of these citations puts the annotation beside
// its link. Attributing a version from somewhere else in the document would
// guess, and a wrong "this is stale" sends a maintainer to reread a statute
// that has not changed.
//
// Pure on purpose: the parsing is what goes wrong, and it can be tested on a
// string instead of over the network.

/** A citation of a Dutch statute, dated in the URL or not. */
const CITATION = /\]\((https:\/\/wetten\.overheid\.nl\/(BWBR\d+)(?:\/(\d{4}-\d{2}-\d{2}))?)[^)]*\)/g;

/** The portal's own version phrase, as the packs quote it: `Geldend van DD-MM-YYYY`. */
const STATED = /Geldend van (\d{2})-(\d{2})-(\d{4})/;

/** The dated path a `/BWBR…` redirect points at. */
const REDIRECT = /\/(BWBR\d+)\/(\d{4}-\d{2}-\d{2})(?:[?#]|$)/;

/**
 * Collect every Dutch statute citation that states which version it read.
 *
 * A pack may legitimately claim two versions of one statute — one current, one
 * historical beside a `Withdrawn` row — so versions are a map, and each keeps
 * the documents claiming it.
 *
 * @param {Array<{label: string, text: string}>} documents
 * @returns {{
 *   statutes: Map<string, {id: string, base: string, versions: Map<string, string[]>}>,
 *   unversioned: Array<{id: string, document: string}>,
 * }} `statutes` keyed by the undated base URL, which is also the URL to probe
 */
export function statedStatuteVersions(documents) {
  const statutes = new Map();
  const unversioned = [];

  const record = (base, id, version, label) => {
    if (!statutes.has(base)) statutes.set(base, {id, base, versions: new Map()});
    const {versions} = statutes.get(base);
    if (!versions.has(version)) versions.set(version, []);
    const citing = versions.get(version);
    if (!citing.includes(label)) citing.push(label);
  };

  for (const {label, text} of documents) {
    for (const line of text.split('\n')) {
      // One line can carry two citations; each is matched on its own, and the
      // line's stated version applies to a citation whose URL carries none.
      const stated = STATED.exec(line);
      const asIso = stated ? `${stated[3]}-${stated[2]}-${stated[1]}` : null;
      for (const [, url, id, dated] of line.matchAll(CITATION)) {
        const base = dated ? url.slice(0, url.length - '/0000-00-00'.length) : url;
        const version = dated ?? asIso;
        if (version) record(base, id, version, label);
        else unversioned.push({id, document: label});
      }
    }
  }

  return {statutes, unversioned};
}

/**
 * Read the current version date out of a probe result for the undated URL.
 *
 * Returns null when the probe says nothing usable — not a redirect, no
 * `location`, a location for a different statute, or a location without a
 * date. Every one of those means "no comparison available", which is reported
 * as such rather than guessed at.
 *
 * @param {string} id the BWBR identifier expected in the redirect
 * @param {{state?: string, location?: string|null}} probe
 * @returns {string|null} the version in force, as YYYY-MM-DD
 */
export function currentVersion(id, probe) {
  if (probe?.state !== 'redirect') return null;
  const found = REDIRECT.exec(probe.location ?? '');
  if (!found) return null;
  const [, foundId, date] = found;
  return foundId === id ? date : null;
}
