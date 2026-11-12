// Bounded-concurrency mapping, with an optional second bound per key.
//
// check-links.mjs used to slice its URLs into fixed batches and `Promise.all`
// each batch. That is lockstep: every batch waits for its own slowest member,
// so one official portal sitting on a 15-second timeout idles five workers that
// have nothing to do. With a shared queue instead, a worker that finishes picks
// up the next URL immediately, and the only thing a slow request delays is
// itself.
//
// `keyOf` and `keyLimit` add the half that was missing. A shared queue of width
// 8 over URLs sorted by URL will happily put eight requests into one government
// host at once. Measured on 2026-11-12: `gesetze-im-internet.de` holds 23 of
// the 114 cited URLs and answered five of them with ECONNRESET under that load,
// so two consecutive runs disagreed about which sources were reachable. With a
// per-host bound, the global width bounds how much work is in flight and
// `keyLimit` bounds how much of it lands on any one host.
//
// Kept separate from check-links so both bounds can be tested without making
// any network request.

/**
 * Map `items` through `worker`, with at most `limit` in flight at once.
 *
 * Results come back in the order of `items`, not the order they completed, so
 * the caller's reporting stays deterministic.
 *
 * With `keyOf`, at most `keyLimit` items sharing a key are in flight together,
 * and items sharing a key are started in the order they appear in `items`.
 *
 * @template T, R
 * @param {T[]} items
 * @param {number} limit maximum concurrent calls; clamped to at least 1
 * @param {(item: T, index: number) => Promise<R>} worker
 * @param {{keyOf?: (item: T, index: number) => string, keyLimit?: number}} [options]
 * @returns {Promise<R[]>}
 */
export async function mapPool(items, limit, worker, options = {}) {
  const {keyOf, keyLimit = 1} = options;
  const results = new Array(items.length);

  // Without `keyOf` every item is its own lane, which is exactly the shared
  // queue this function has always been. With it, one lane per key.
  /** @type {{indices: number[], next: number}[]} */
  const lanes = [];
  const byKey = new Map();
  for (let index = 0; index < items.length; index += 1) {
    if (!keyOf) {
      lanes.push({indices: [index], next: 0});
      continue;
    }
    const key = keyOf(items[index], index);
    let lane = byKey.get(key);
    if (!lane) {
      lane = {indices: [], next: 0};
      byKey.set(key, lane);
      lanes.push(lane);
    }
    lane.indices.push(index);
  }

  // One slot per unit of permitted concurrency: a lane that may take two
  // workers at once appears twice, and both share the lane's own cursor, so
  // they interleave over its items rather than duplicating them.
  const perLane = Math.max(1, Math.trunc(keyLimit) || 1);
  const slots = [];
  for (const lane of lanes)
    for (let n = 0; n < Math.min(perLane, lane.indices.length); n += 1) slots.push(lane);

  const width = Math.max(1, Math.min(Math.trunc(limit) || 1, slots.length || 1));

  // A single shared cursor over the slots is what keeps this a queue rather
  // than batches: a worker that runs out of work takes the next slot at once.
  let cursor = 0;

  async function drain() {
    while (cursor < slots.length) {
      const lane = slots[cursor];
      cursor += 1;
      while (lane.next < lane.indices.length) {
        const index = lane.indices[lane.next];
        lane.next += 1;
        results[index] = await worker(items[index], index);
      }
    }
  }

  await Promise.all(Array.from({length: width}, drain));
  return results;
}
