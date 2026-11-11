// Directed-graph walks over a dossier's declared links.
//
// Pulled out of check-dossier.mjs for two reasons. The check was 247 lines with
// 95 of them being graph theory, and the only way to exercise a cycle was to
// build a whole valid dossier around it — so the interesting cases (a diamond,
// disconnected components, a self-loop, a cycle buried behind a long acyclic
// chain) each cost twenty lines of unrelated fixture.
//
// Both functions take an adjacency map and nothing else: no dossier, no file,
// no reporting. That is what lets `graph.test.mjs` state a graph in one line.

/**
 * Every node transitively reachable from `start`, excluding `start` itself
 * unless a path leads back to it.
 *
 * Terminates structurally, whatever the edges look like: a node is pushed only
 * on the transition into `reached`, so each is pushed at most once and the
 * queue drains in at most one step per node. There is no step counter because
 * there is nothing for one to catch.
 *
 * @param {Map<string, string[]>} adjacency node -> nodes it points at
 * @param {string} start
 * @returns {Set<string>}
 */
export function reachableFrom(adjacency, start) {
  const reached = new Set();
  const queue = [start];

  while (queue.length) {
    for (const next of adjacency.get(queue.pop()) ?? []) {
      if (reached.has(next)) continue;
      reached.add(next);
      queue.push(next);
    }
  }

  return reached;
}

// Depth-first search colours. A node ON_PATH is in the stack right now, so
// reaching it again means we have gone round a loop.
const UNSEEN = 0;
const ON_PATH = 1;
const DONE = 2;

/**
 * Find one cycle, if the graph has any, and return the nodes on it in order
 * with the entry node repeated at the end: `['a', 'b', 'a']`.
 *
 * One depth-first search, O(nodes + edges). This replaced a reachability walk
 * from every node asking "is it its own dependent" — correct, but quadratic:
 * 8000 records took 1.4 s and doubling the records quadrupled the time. A
 * dossier is the one artefact in this project that grows without bound over a
 * project's life, and check-dossier.mjs is documented as safe to point at a
 * real one, so the cost had to come down. It is now about 60 ms at that size.
 *
 * Iterative rather than recursive on purpose: a long chain of dependents is the
 * normal shape of a dossier, and recursion would overflow the stack on exactly
 * the input this is meant to handle.
 *
 * @param {Map<string, string[]>} adjacency node -> nodes it points at
 * @param {Iterable<string>} nodes every node, including those with no edges
 * @returns {string[]} the cycle, or an empty array if the graph is acyclic
 */
export function findCycle(adjacency, nodes) {
  const colour = new Map();
  for (const node of nodes) colour.set(node, UNSEEN);

  for (const start of colour.keys()) {
    if (colour.get(start) !== UNSEEN) continue;

    // Each frame keeps its own position in its neighbour list, so the walk
    // resumes where it left off rather than restarting.
    const stack = [{node: start, next: 0}];
    colour.set(start, ON_PATH);

    while (stack.length) {
      const frame = stack.at(-1);
      const neighbours = adjacency.get(frame.node) ?? [];

      if (frame.next >= neighbours.length) {
        colour.set(frame.node, DONE);
        stack.pop();
        continue;
      }

      const next = neighbours[frame.next];
      frame.next += 1;

      // An edge may name a node that does not exist. The caller reports that
      // separately, and this walk must not crash on it — otherwise the one
      // message the reader needed is replaced by a stack trace.
      if (!colour.has(next)) continue;

      if (colour.get(next) === ON_PATH) {
        const path = stack.map((entry) => entry.node);
        return [...path.slice(path.indexOf(next)), next];
      }

      if (colour.get(next) === UNSEEN) {
        colour.set(next, ON_PATH);
        stack.push({node: next, next: 0});
      }
    }
  }

  return [];
}

/**
 * Build an adjacency map from edges.
 *
 * @param {Iterable<{from: string, to: string}>} edges
 * @returns {Map<string, string[]>}
 */
export function adjacencyOf(edges) {
  const adjacency = new Map();
  for (const {from, to} of edges) {
    if (!adjacency.has(from)) adjacency.set(from, []);
    adjacency.get(from).push(to);
  }
  return adjacency;
}
