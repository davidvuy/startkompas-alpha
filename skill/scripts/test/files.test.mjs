// Unit tests for lib/files.mjs — directory walking, path formatting, sizes.
//
// Small functions, which is exactly why they are worth pinning: four checks
// depend on them, so a subtle change here is a subtle change in all four at
// once, with no single check obviously broken.

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {join} from 'node:path';

import {listFiles, toPosix, relativePosix, totalBytes, kb, overBudget} from '../lib/files.mjs';
import {makeTree, withTree} from './helpers.mjs';

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
  // Rounding, not truncation: a file 1 byte over a budget displays as exactly
  // the budget. That is why overBudget exists — see below.
  assert.equal(kb(1024 * 10 + 1), '10.0');
});

test('overBudget states the excess in bytes, so a one-byte overage is not confusing', () => {
  // The bug this fixes: because kb() rounds, the message read "10.0 KB is over
  // the 10 KB budget", which looks like the check contradicting itself. A
  // contributor's first conclusion was that the check was broken.
  assert.equal(
    overBudget(1024 * 10 + 1, 10, 'always-loaded'),
    '10.0 KB, over the 10 KB always-loaded budget by 1 byte',
  );
});

test('overBudget pluralises and works without a budget name', () => {
  assert.match(overBudget(1024 * 10 + 2, 10), /by 2 bytes$/);
  assert.equal(overBudget(1024 * 11, 10), '11.0 KB, over the 10 KB budget by 1024 bytes');
});
