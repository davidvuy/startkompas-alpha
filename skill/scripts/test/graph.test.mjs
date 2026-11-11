// Unit tests for lib/graph.mjs — the two walks over a dossier's links.
//
// These were inline in check-dossier.mjs, where the only way to exercise a
// cycle was to build a whole valid dossier around it: eight collections and a
// dozen fields of unrelated fixture per case. So the interesting shapes — a
// diamond, disconnected components, a cycle buried behind a long acyclic chain
// — went untested, because each cost twenty lines to set up.
//
// Here a graph is one line, so they are all covered.

import {test} from 'node:test';
import assert from 'node:assert/strict';

import {adjacencyOf, findCycle, reachableFrom} from '../lib/graph.mjs';

/** `graph('a->b', 'b->c')` — an adjacency map, readably. */
function graph(...edges) {
  return adjacencyOf(
    edges.map((edge) => {
      const [from, to] = edge.split('->');
      return {from, to};
    }),
  );
}

/** Every node named by any edge, which is what findCycle needs. */
function nodesOf(adjacency) {
  const nodes = new Set(adjacency.keys());
  for (const targets of adjacency.values()) for (const target of targets) nodes.add(target);
  return nodes;
}

const cycleIn = (...edges) => {
  const adjacency = graph(...edges);
  return findCycle(adjacency, nodesOf(adjacency));
};

// --- adjacencyOf -------------------------------------------------------------

test('adjacencyOf groups edges by their source', () => {
  const adjacency = graph('a->b', 'a->c', 'b->c');
  assert.deepEqual(adjacency.get('a'), ['b', 'c']);
  assert.deepEqual(adjacency.get('b'), ['c']);
  assert.equal(adjacency.get('c'), undefined, 'a node with no outgoing edges has no entry');
});

test('adjacencyOf keeps a repeated edge, rather than silently collapsing it', () => {
  // Two links declaring the same dependency is a dossier problem the caller
  // may want to see; this module should not hide it.
  assert.deepEqual(graph('a->b', 'a->b').get('a'), ['b', 'b']);
});

test('adjacencyOf of nothing is an empty map', () => {
  assert.equal(adjacencyOf([]).size, 0);
});

// --- reachableFrom -----------------------------------------------------------

test('reachableFrom follows a chain transitively', () => {
  const reached = reachableFrom(graph('a->b', 'b->c', 'c->d'), 'a');
  assert.deepEqual([...reached].sort(), ['b', 'c', 'd']);
});

test('reachableFrom excludes the start node unless a path returns to it', () => {
  // The dossier reading: "what would a revision of this mark for review?" —
  // which is its dependents, not itself.
  assert.ok(!reachableFrom(graph('a->b', 'b->c'), 'a').has('a'));
  assert.ok(reachableFrom(graph('a->b', 'b->a'), 'a').has('a'), 'a cycle does reach back');
});

test('reachableFrom reaches both arms of a diamond, and the join once', () => {
  const reached = reachableFrom(graph('a->b', 'a->c', 'b->d', 'c->d'), 'a');
  assert.deepEqual([...reached].sort(), ['b', 'c', 'd']);
});

test('reachableFrom terminates on a cycle', () => {
  // Structural, not bounded by a counter: a node is pushed only on entering
  // the reached set. If that ever changes, this test hangs rather than fails,
  // which is itself the signal.
  const reached = reachableFrom(graph('a->b', 'b->c', 'c->a'), 'a');
  assert.deepEqual([...reached].sort(), ['a', 'b', 'c']);
});

test('reachableFrom from an unknown node is empty', () => {
  assert.equal(reachableFrom(graph('a->b'), 'nope').size, 0);
});

test('reachableFrom ignores an edge to a node that does not exist', () => {
  // check-dossier reports the dangling reference separately; this walk must
  // not crash on it, or that report is replaced by a stack trace.
  const reached = reachableFrom(graph('a->ghost'), 'a');
  assert.deepEqual([...reached], ['ghost']);
});

// --- findCycle ---------------------------------------------------------------

test('an acyclic graph has no cycle', () => {
  assert.deepEqual(cycleIn('a->b', 'b->c', 'a->c'), []);
});

test('a two-node cycle is found and reported as a closed path', () => {
  const cycle = cycleIn('a->b', 'b->a');
  assert.equal(cycle[0], cycle.at(-1), 'the path should close on the node it entered');
  assert.deepEqual([...new Set(cycle)].sort(), ['a', 'b']);
});

test('a three-node cycle is found', () => {
  const cycle = cycleIn('a->b', 'b->c', 'c->a');
  assert.deepEqual([...new Set(cycle)].sort(), ['a', 'b', 'c']);
});

test('a self-loop is a cycle', () => {
  assert.deepEqual(cycleIn('a->a'), ['a', 'a']);
});

test('a cycle is found even when it is not reachable from the first node', () => {
  // Disconnected components. A search that started once and stopped would miss
  // this entirely, and the graph would report as acyclic.
  const cycle = cycleIn('a->b', 'x->y', 'y->x');
  assert.deepEqual([...new Set(cycle)].sort(), ['x', 'y']);
});

test('a cycle behind a long acyclic chain is still found', () => {
  const chain = Array.from({length: 40}, (_, i) => `n${i}->n${i + 1}`);
  const cycle = cycleIn(...chain, 'n40->n20');
  assert.ok(cycle.length > 0, 'expected the back-edge to be caught');
  assert.equal(cycle[0], cycle.at(-1));
});

test('the reported path contains only nodes that are actually on the cycle', () => {
  // The tail-slicing is easy to get wrong: a cycle reported with the acyclic
  // approach to it included would send a reader to the wrong records.
  const cycle = cycleIn('start->a', 'a->b', 'b->c', 'c->a');
  assert.ok(!cycle.includes('start'), `"start" is upstream of the cycle, not on it: ${cycle}`);
  assert.deepEqual([...new Set(cycle)].sort(), ['a', 'b', 'c']);
});

test('a diamond is not mistaken for a cycle', () => {
  // Two paths to the same node means a node is visited twice, which a
  // visited-set-only implementation reports as a loop. The three-colour
  // marking is what distinguishes "seen before" from "on the current path".
  assert.deepEqual(cycleIn('a->b', 'a->c', 'b->d', 'c->d'), []);
});

test('a node with no edges is not a cycle', () => {
  assert.deepEqual(findCycle(new Map(), ['lonely']), []);
});

test('an empty graph has no cycle', () => {
  assert.deepEqual(findCycle(new Map(), []), []);
});

test('an edge to a node outside the node list is skipped, not followed', () => {
  // Same dangling-reference case as above: reported elsewhere, must not throw.
  assert.deepEqual(findCycle(graph('a->ghost'), ['a']), []);
});

test('a long chain does not overflow the stack', () => {
  // The reason this is iterative. A chain of dependents is the normal shape of
  // a dossier, and a recursive search would blow up on exactly that input.
  const chain = Array.from({length: 50_000}, (_, i) => `n${i}->n${i + 1}`);
  const adjacency = graph(...chain);
  assert.deepEqual(findCycle(adjacency, nodesOf(adjacency)), []);
});

test('finding a cycle in a large graph stays linear', () => {
  // The regression guard. The old implementation walked from every node, so
  // this shape took time proportional to the square of the node count.
  const chain = Array.from({length: 40_000}, (_, i) => `n${i}->n${i + 1}`);
  const adjacency = graph(...chain);
  const nodes = nodesOf(adjacency);

  const started = Date.now();
  assert.deepEqual(findCycle(adjacency, nodes), []);
  const elapsed = Date.now() - started;
  assert.ok(elapsed < 2000, `took ${elapsed} ms; expected well under 2000`);
});
