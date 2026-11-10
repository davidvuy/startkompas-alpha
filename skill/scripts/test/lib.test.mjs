// Unit tests for the shared helpers.
//
// These are small functions, which is exactly why they are worth pinning: six
// checks depend on them, so a subtle change here is a subtle change everywhere
// at once, with no single check obviously broken.

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {join} from 'node:path';

import {listFiles, toPosix, relativePosix, totalBytes, kb} from '../lib/files.mjs';
import {createReport} from '../lib/report.mjs';
import {mapPool} from '../lib/pool.mjs';
import {harvestCitations} from '../lib/citations.mjs';
import {makeTree, withTree} from './helpers.mjs';

// --- files.mjs ---------------------------------------------------------------

test('listFiles walks recursively and returns a stable sorted order', () => {
  withTree(
    {
      'b.md': 'b',
      'a.md': 'a',
      'nested/deep/z.md': 'z',
      'nested/c.md': 'c',
    },
    (root) => {
      const found = listFiles(root).map((file) => relativePosix(root, file));
      // Order must be deterministic, because zip entries and reports depend on
      // it. Directory entries sort among files at each level.
      assert.deepEqual(found, ['a.md', 'b.md', 'nested/c.md', 'nested/deep/z.md']);
    },
  );
});

test('listFiles is stable across repeated calls', () => {
  withTree({'a.md': 'a', 'n/b.md': 'b', 'n/c.md': 'c'}, (root) => {
    assert.deepEqual(listFiles(root), listFiles(root));
  });
});

test('listFiles filters by extension and still recurses', () => {
  withTree({'a.md': 'a', 'b.txt': 'b', 'n/c.md': 'c', 'n/d.json': 'd'}, (root) => {
    const found = listFiles(root, {ext: '.md'}).map((file) => relativePosix(root, file));
    assert.deepEqual(found, ['a.md', 'n/c.md']);
  });
});

test('listFiles returns nothing for an empty directory rather than throwing', () => {
  const root = makeTree({'placeholder/keep.md': 'x'});
  assert.deepEqual(listFiles(join(root, 'placeholder'), {ext: '.json'}), []);
});

test('toPosix leaves an already-posix path alone', () => {
  assert.equal(toPosix('a/b/c.md'), 'a/b/c.md');
});

test('relativePosix produces forward slashes on any platform', () => {
  withTree({'n/d/e.md': 'x'}, (root) => {
    const [file] = listFiles(root);
    const relative = relativePosix(root, file);
    assert.equal(relative, 'n/d/e.md');
    assert.ok(!relative.includes('\\'), 'a Windows separator would break comparisons');
  });
});

test('totalBytes sums the given files and is zero for none', () => {
  withTree({'a.md': 'xxxxx', 'b.md': 'yyy'}, (root) => {
    assert.equal(totalBytes([]), 0);
    assert.equal(totalBytes(listFiles(root)), 8);
  });
});

test('kb formats to one decimal', () => {
  assert.equal(kb(0), '0.0');
  assert.equal(kb(1024), '1.0');
  assert.equal(kb(1536), '1.5');
  // Rounding, not truncation: a file 1 byte over a budget must not display as
  // exactly the budget.
  assert.equal(kb(1024 * 10 + 1), '10.0');
});

// --- report.mjs --------------------------------------------------------------

/** Capture what a report prints, and whether it would fail the run. */
function capture(build) {
  const out = [];
  const err = [];
  const log = console.log;
  const error = console.error;
  const exitCode = process.exitCode;
  console.log = (...args) => out.push(args.join(' '));
  console.error = (...args) => err.push(args.join(' '));
  try {
    const report = createReport({ok: 'all good'});
    const returned = build(report);
    return {out: out.join('\n'), err: err.join('\n'), returned, exitCode: process.exitCode};
  } finally {
    console.log = log;
    console.error = error;
    process.exitCode = exitCode;
  }
}

test('a report with nothing wrong prints OK, returns true and sets no exit code', () => {
  const {out, err, returned, exitCode} = capture((report) => report.finish());
  assert.match(out, /^OK: all good$/m);
  assert.equal(err, '');
  assert.equal(returned, true);
  assert.notEqual(exitCode, 1);
});

test('a problem goes to stderr, returns false and sets exit code 1', () => {
  const {out, err, returned, exitCode} = capture((report) => {
    report.fail('somewhere', 'something is wrong');
    return report.finish();
  });
  assert.match(err, /1 problem\(s\)/);
  assert.match(err, /somewhere: something is wrong/);
  assert.ok(!out.includes('OK:'), 'a failing report must not also claim OK');
  assert.equal(returned, false);
  assert.equal(exitCode, 1);
});

test('a warning never fails the run', () => {
  const {out, returned, exitCode} = capture((report) => {
    report.warn('portal', '403 from a bot block');
    return report.finish();
  });
  assert.match(out, /1 warning\(s\) — reported, not failures/);
  assert.match(out, /portal: 403 from a bot block/);
  assert.equal(returned, true);
  assert.notEqual(exitCode, 1);
});

test('notes print before the verdict', () => {
  const {out} = capture((report) => {
    report.note('counted 7 things');
    return report.finish();
  });
  assert.ok(
    out.indexOf('counted 7 things') < out.indexOf('OK:'),
    'context is useless after the verdict',
  );
});

test('fail with no location omits the separator', () => {
  const {err} = capture((report) => {
    report.fail('', 'bare message');
    return report.finish();
  });
  assert.match(err, /- bare message/);
  assert.ok(!err.includes(': bare message'), 'an empty location should not leave a stray colon');
});

test('problemCount reflects failures only, not warnings', () => {
  capture((report) => {
    report.warn('a', 'w');
    assert.equal(report.problemCount, 0);
    report.fail('b', 'p');
    assert.equal(report.problemCount, 1);
    return report.finish();
  });
});

// --- pool.mjs ----------------------------------------------------------------

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

// --- citations.mjs -----------------------------------------------------------

test('harvestCitations finds markdown link targets and records who cites them', () => {
  const found = harvestCitations([
    {label: 'a.md', text: 'See [one](https://example.com/one) and [two](http://example.com/two).'},
    {label: 'b.md', text: 'Also [one again](https://example.com/one).'},
  ]);
  assert.deepEqual([...found.keys()].sort(), [
    'http://example.com/two',
    'https://example.com/one',
  ]);
  assert.deepEqual(found.get('https://example.com/one'), ['a.md', 'b.md']);
});

test('harvestCitations collapses a document citing the same URL twice', () => {
  const found = harvestCitations([
    {label: 'a.md', text: '[x](https://example.com/x) and again [x](https://example.com/x)'},
  ]);
  assert.deepEqual(found.get('https://example.com/x'), ['a.md']);
});

test('harvestCitations strips trailing sentence punctuation', () => {
  const found = harvestCitations([
    {label: 'a.md', text: '[source](https://example.com/page.html.)'},
  ]);
  assert.ok(found.has('https://example.com/page.html'));
});

test('harvestCitations ignores bare URLs and placeholders in prose', () => {
  // Matching loose text would report `https://…` and every illustrative URL as
  // a dead link, which is how a link checker gets switched off.
  const found = harvestCitations([
    {label: 'a.md', text: 'Visit https://example.com/bare or https://… for details.'},
  ]);
  assert.equal(found.size, 0);
});

test('harvestCitations ignores relative and mailto links', () => {
  const found = harvestCitations([
    {label: 'a.md', text: '[rel](other.md) [mail](mailto:a@b.c) [ok](https://example.com)'},
  ]);
  assert.deepEqual([...found.keys()], ['https://example.com']);
});

test('harvestCitations keeps query strings and fragments intact', () => {
  const url = 'https://example.com/doc.pdf?__blob=publicationFile&v=4';
  const found = harvestCitations([{label: 'a.md', text: `[pdf](${url})`}]);
  assert.ok(found.has(url), 'a truncated query string would probe the wrong document');
});
