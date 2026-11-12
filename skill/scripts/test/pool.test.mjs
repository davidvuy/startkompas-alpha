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

// --- The per-key bound -------------------------------------------------------
//
// Added 2026-11-12. The global width alone let eight requests land on one
// government host at once, and five of that host's 23 cited URLs answered
// ECONNRESET under that load — so two consecutive check-links runs disagreed
// about which sources were reachable. These tests pin the bound that fixed it.

test('mapPool never runs two items with the same key at once', async () => {
  const active = new Map();
  let worstPerKey = 0;
  const items = ['a1', 'b1', 'a2', 'a3', 'b2', 'c1', 'a4'];
  await mapPool(
    items,
    8,
    async (item) => {
      const key = item[0];
      active.set(key, (active.get(key) ?? 0) + 1);
      worstPerKey = Math.max(worstPerKey, active.get(key));
      await new Promise((resolve) => setTimeout(resolve, 5));
      active.set(key, active.get(key) - 1);
      return item;
    },
    {keyOf: (item) => item[0]},
  );
  assert.equal(worstPerKey, 1, 'two items sharing a key must never be in flight together');
});

test('mapPool still bounds total concurrency when keys are used', async () => {
  let inFlight = 0;
  let worst = 0;
  const items = Array.from({length: 24}, (_value, index) => `host${index % 12}/${index}`);
  await mapPool(
    items,
    3,
    async (item) => {
      inFlight += 1;
      worst = Math.max(worst, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 2));
      inFlight -= 1;
      return item;
    },
    {keyOf: (item) => item.split('/')[0]},
  );
  assert.ok(worst <= 3, `global width must still hold, saw ${worst}`);
});

test('mapPool keeps results in input order across keys', async () => {
  // The report is sorted afterwards, but a result landing in the wrong slot
  // would attribute one URL's verdict to another. Slow the first key down so
  // completion order cannot match input order.
  const items = ['a1', 'b1', 'a2', 'b2', 'a3'];
  const results = await mapPool(
    items,
    4,
    async (item) => {
      await new Promise((resolve) => setTimeout(resolve, item[0] === 'a' ? 12 : 1));
      return item.toUpperCase();
    },
    {keyOf: (item) => item[0]},
  );
  assert.deepEqual(results, ['A1', 'B1', 'A2', 'B2', 'A3']);
});

test('items sharing a key start in input order', async () => {
  // A host's URLs are probed in the order the pack cites them, which keeps a
  // failure report reproducible.
  const started = [];
  await mapPool(
    ['a1', 'a2', 'a3'],
    8,
    async (item) => {
      started.push(item);
      await new Promise((resolve) => setTimeout(resolve, 1));
      return item;
    },
    {keyOf: () => 'same'},
  );
  assert.deepEqual(started, ['a1', 'a2', 'a3']);
});

test('keyLimit above one allows that many per key and no more', async () => {
  const active = new Map();
  let worstPerKey = 0;
  await mapPool(
    Array.from({length: 10}, (_value, index) => `a${index}`),
    8,
    async (item) => {
      active.set('a', (active.get('a') ?? 0) + 1);
      worstPerKey = Math.max(worstPerKey, active.get('a'));
      await new Promise((resolve) => setTimeout(resolve, 3));
      active.set('a', active.get('a') - 1);
      return item;
    },
    {keyOf: () => 'a', keyLimit: 2},
  );
  assert.equal(worstPerKey, 2);
});

test('without keyOf the pool behaves exactly as it did before', async () => {
  // keyLimit defaults to 1, and must not accidentally serialise a caller that
  // never asked for keys — which would turn check-links back into a serial run.
  let inFlight = 0;
  let worst = 0;
  await mapPool(Array.from({length: 12}, (_value, index) => index), 4, async (item) => {
    inFlight += 1;
    worst = Math.max(worst, inFlight);
    await new Promise((resolve) => setTimeout(resolve, 3));
    inFlight -= 1;
    return item;
  });
  assert.equal(worst, 4, 'an unkeyed pool must still use its full width');
});

test('one slow key does not idle the other workers', async () => {
  // The cost this bound must not reintroduce: a host sitting on a long request
  // while other hosts wait. Serial would be ~60 ms; the slow key alone is 40.
  const started = Date.now();
  const items = ['slow1', 'a1', 'b1', 'c1', 'd1', 'e1', 'f1'];
  await mapPool(
    items,
    4,
    async (item) => {
      await new Promise((resolve) => setTimeout(resolve, item.startsWith('slow') ? 40 : 4));
      return item;
    },
    {keyOf: (item) => item.replace(/\d+$/, '')},
  );
  const elapsed = Date.now() - started;
  assert.ok(elapsed < 60, `expected the slow key to overlap the rest, took ${elapsed} ms`);
});
