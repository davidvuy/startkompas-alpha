// Does check-links.mjs join its two halves correctly?
//
// The decisions live in lib/citations.mjs (which URLs get probed) and
// lib/probe.mjs (what each response means), and both are tested directly
// against synthetic input. What is left here is the glue: walk the tree,
// probe once per distinct URL, fail only on a dead one, name every document
// that cites it, and emit the same verdict as JSON.
//
// These tests use hostnames under `.invalid`, which RFC 2606 reserves so that
// it can never resolve. That gives a deterministic "dead" result from a real
// run in a few milliseconds, with no network service and no local server —
// which matters, because in some sandboxes a spawned child cannot reach a
// listener in its own parent.

import {test} from 'node:test';
import assert from 'node:assert/strict';

import {runCheck, withTree} from './helpers.mjs';

/** A hostname that cannot resolve, by standards reservation. */
const GONE = 'https://startkompas-test-does-not-exist.invalid/doc';
const ALSO_GONE = 'https://startkompas-test-also-absent.invalid/other';

test('a tree citing nothing passes without probing anything', () => {
  const result = withTree({'references/empty.md': '# Nothing\n\nNo links here.\n'}, (root) =>
    runCheck('check-links.mjs', root),
  );
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /0 cited URL\(s\) checked/);
});

test('an unresolvable host fails the run', () => {
  const result = withTree({'references/sources.md': `# S\n\n[gone](${GONE})\n`}, (root) =>
    runCheck('check-links.mjs', root),
  );
  assert.notEqual(result.code, 0);
  assert.match(result.output, /dead/);
  assert.match(result.output, /1 URL\(s\): 0 ok, 1 dead/);
});

test('the report names every document citing a broken URL', () => {
  // Without this, a dead link in a shared layer sends the maintainer hunting
  // through seven packs for the one that cites it.
  const result = withTree(
    {
      'references/a.md': `# A\n\n[x](${GONE})\n`,
      'references/b.md': `# B\n\n[x](${GONE})\n`,
    },
    (root) => runCheck('check-links.mjs', root),
  );
  assert.notEqual(result.code, 0);
  assert.match(result.output, /references\/a\.md/);
  assert.match(result.output, /references\/b\.md/);
});

test('a URL cited twice is probed once', () => {
  // Two documents, one distinct URL. The count is on the note line, which is
  // printed whether the run passes or fails — the "cited URL(s) checked"
  // phrasing only appears in the success message.
  const result = withTree(
    {
      'references/a.md': `# A\n\n[x](${GONE})\n`,
      'references/b.md': `# B\n\n[x](${GONE})\n`,
    },
    (root) => runCheck('check-links.mjs', root),
  );
  assert.match(result.output, /1 URL\(s\): 0 ok, 1 dead/);
});

test('several dead URLs are all reported, not just the first', () => {
  const result = withTree(
    {'references/sources.md': `# S\n\n[a](${GONE})\n[b](${ALSO_GONE})\n`},
    (root) => runCheck('check-links.mjs', root),
  );
  assert.notEqual(result.code, 0);
  assert.match(result.output, /2 URL\(s\): 0 ok, 2 dead/);
  assert.match(result.output, /does-not-exist/);
  assert.match(result.output, /also-absent/);
});

test('--json emits parseable output and still sets the exit code', () => {
  const result = withTree({'references/sources.md': `# S\n\n[gone](${GONE})\n`}, (root) =>
    runCheck('check-links.mjs', root, {args: ['--json']}),
  );
  assert.notEqual(result.code, 0, 'a dead citation must fail even in JSON mode');

  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.checked, 1);
  assert.equal(parsed.dead, 1);
  assert.equal(parsed.results[0].state, 'dead');
  assert.equal(parsed.results[0].url, GONE);
});

test('a problem goes to stderr and the human report says nothing there on success', () => {
  // CI greps one and humans read the other; the split is easy to break by
  // editing report.mjs.
  const clean = withTree({'references/empty.md': '# Nothing\n'}, (root) =>
    runCheck('check-links.mjs', root),
  );
  assert.equal(clean.stderr.trim(), '');
  assert.match(clean.stdout, /^OK:/m);

  const broken = withTree({'references/s.md': `# S\n\n[x](${GONE})\n`}, (root) =>
    runCheck('check-links.mjs', root),
  );
  assert.match(broken.stderr, /problem\(s\)/);
});

test('only markdown is scanned for citations', () => {
  // A URL in a JSON fixture or a script is not a cited source, and probing it
  // would be a false positive on content that is not making a claim.
  const result = withTree(
    {
      'references/empty.md': '# Nothing\n',
      'references/examples/data.json': `{"url": "${GONE}"}`,
    },
    (root) => runCheck('check-links.mjs', root),
  );
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /0 cited URL\(s\) checked/);
});
