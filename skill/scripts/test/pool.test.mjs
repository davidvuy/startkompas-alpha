// Unit tests for lib/pool.mjs — bounded-concurrency mapping.
//
// One of these tests asserts a COST rather than a behaviour. check-links.mjs
// used to slice its URLs into fixed batches, so one government portal sitting
// on a 15-second timeout idled five workers that had nothing to do. The run
// went from about 5.0 s to 1.8 s when that became a shared queue, and the
// "keeps workers busy" test is what stops it going back.

import {test} from 'node:test';
import assert from 'node:assert/strict';

import {mapPool} from '../lib/pool.mjs';

test('mapPool preserves input order regardless of completion order', async () => {
  // Deliberately inverted delays: later items finish first.
  const items = [40, 30, 20, 10, 0];
  const results = await mapPool(items, 3, async (ms) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
    return ms;
  });
  assert.deepEqual(results, items);
});

test('mapPool never exceeds the concurrency limit', async () => {
  let inFlight = 0;
  let peak = 0;
  await mapPool(Array.from({length: 40}, (_, i) => i), 5, async () => {
    inFlight += 1;
    peak = Math.max(peak, inFlight);
    await new Promise((resolve) => setTimeout(resolve, 1));
    inFlight -= 1;
  });
  assert.ok(peak <= 5, `peak concurrency was ${peak}, limit was 5`);
  assert.ok(peak > 1, 'nothing ran concurrently; the pool is not pooling');
});

test('mapPool keeps workers busy instead of waiting for a batch', async () => {
  // The regression this function exists for. One slow item among many fast
  // ones: with fixed batches the whole batch waits for it, so the total is
  // roughly slow + the rest. With a queue, the fast items flow past it.
  const SLOW = 150;
  const items = Array.from({length: 12}, (_, i) => (i === 0 ? SLOW : 5));
  const started = Date.now();
  await mapPool(items, 4, async (ms) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
  const elapsed = Date.now() - started;
  // Three workers chew through eleven 5 ms items while one sits on the slow
  // one, so the total should be dominated by SLOW alone, not by SLOW plus a
  // batch's worth of waiting.
  assert.ok(elapsed < SLOW * 2, `took ${elapsed} ms; expected under ${SLOW * 2} ms`);
});

test('mapPool handles an empty input and a limit larger than the input', async () => {
  assert.deepEqual(await mapPool([], 4, async () => 1), []);
  assert.deepEqual(await mapPool([1, 2], 99, async (n) => n * 2), [2, 4]);
});

test('mapPool treats a nonsense limit as one worker rather than stalling', async () => {
  // A zero or negative width would create no workers and hang forever, which
  // in a check would look like a network problem.
  assert.deepEqual(await mapPool([1, 2, 3], 0, async (n) => n), [1, 2, 3]);
  assert.deepEqual(await mapPool([1, 2, 3], -5, async (n) => n), [1, 2, 3]);
});

test('mapPool propagates a worker rejection', async () => {
  await assert.rejects(
    () => mapPool([1, 2, 3], 2, async (n) => {
      if (n === 2) throw new Error('boom');
      return n;
    }),
    /boom/,
  );
});
