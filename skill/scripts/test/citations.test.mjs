// Unit tests for lib/citations.mjs — which URLs get probed at all.
//
// A URL this fails to see is a claim whose evidence is never checked, and a URL
// it sees that is not really a citation is a false positive on the real content
// — which is how a link checker gets switched off. Both directions are tested.

import {test} from 'node:test';
import assert from 'node:assert/strict';

import {harvestCitations} from '../lib/citations.mjs';

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
