// Bounded-concurrency mapping.
//
// check-links.mjs used to slice its URLs into fixed batches and `Promise.all`
// each batch. That is lockstep: every batch waits for its own slowest member,
// so one official portal sitting on a 15-second timeout idles five workers that
// have nothing to do. With a shared queue instead, a worker that finishes picks
// up the next URL immediately, and the only thing a slow request delays is
// itself.
//
// Kept separate from check-links so the concurrency bound can be tested
// without making any network request.

/**
 * Map `items` through `worker`, with at most `limit` in flight at once.
 *
 * Results come back in the order of `items`, not the order they completed, so
 * the caller's reporting stays deterministic.
 *
 * @template T, R
 * @param {T[]} items
 * @param {number} limit maximum concurrent calls; clamped to at least 1
 * @param {(item: T, index: number) => Promise<R>} worker
 * @returns {Promise<R[]>}
 */
export async function mapPool(items, limit, worker) {
  const results = new Array(items.length);
  const width = Math.max(1, Math.min(Math.trunc(limit) || 1, items.length));

  // A single shared cursor is what makes this a queue rather than batches.
  let cursor = 0;

  async function drain() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(Array.from({length: width}, drain));
  return results;
}
