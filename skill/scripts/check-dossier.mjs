#!/usr/bin/env node
// The change-propagation rules in references/dossier-format.md are an algorithm
// written in prose. This executes them against the worked example, so "the walk
// terminates" is verified rather than assumed, and the example cannot drift out
// of referential integrity unnoticed.
//
//   node scripts/check-dossier.mjs [project.json]
//
// Defaults to the worked example. Point it at a real project.json to check that
// project — it only reads.
//
// Checks, in order. Each has a matching `--- n. ---` banner below.
//   1. the document's shape — format, revision, and the eight collections.
//      A failure here stops the run, because everything after it indexes in
//   2. ids are unique and every reference resolves, including the link graph
//   3. assertion vocabularies, and the rules dossier-format.md states in prose
//   4. the change-propagation walk: one depth-first search for a cycle, which
//      would make "revise only the dependents" ill-defined
//   5. the report — what a revision of each assumption would mark for review

import {readFileSync, existsSync} from 'node:fs';
import {join, resolve} from 'node:path';

import {examplesDir} from './lib/paths.mjs';
import {createReport} from './lib/report.mjs';
import {adjacencyOf, findCycle, reachableFrom} from './lib/graph.mjs';

const EXPECTED_FORMAT = 'startkompas-dossier/1';

const COLLECTIONS = ['sources', 'facts', 'assumptions', 'decisions', 'tasks', 'artifacts', 'links', 'events'];
/** Collections whose entries carry an `id` that others may reference. */
const ID_BEARING = ['sources', 'facts', 'assumptions', 'decisions', 'tasks', 'artifacts', 'events'];

const ASSERTIONS = {facts: ['reported', 'observed', 'inferred'], assumptions: ['unknown']};
const TASK_PROGRESS = ['open', 'in_progress', 'parked', 'done'];
const TASK_SUBSTANTIATION = ['unreviewed', 'reviewed'];

const target = resolve(process.argv[2] ?? join(examplesDir, 'worked-project.json'));

if (!existsSync(target)) {
  console.error(`No such file: ${target}`);
  process.exit(1);
}

let doc;
try {
  doc = JSON.parse(readFileSync(target, 'utf8'));
} catch (error) {
  console.error(`Not valid JSON: ${error.message}`);
  process.exit(1);
}

const report = createReport({
  ok: 'referentially intact, vocabularies valid, propagation walk terminates, no cycles.',
});

// --- 1. Shape ----------------------------------------------------------------
// Bail out early: the later checks assume these collections exist.

if (doc.format !== EXPECTED_FORMAT)
  report.fail('format', `is ${JSON.stringify(doc.format)}; expected "${EXPECTED_FORMAT}"`);
if (!Number.isInteger(doc.revision) || doc.revision < 1)
  report.fail('revision', `must be a positive integer, got ${JSON.stringify(doc.revision)}`);
if (typeof doc.project_id !== 'string' || !doc.project_id) report.fail('project_id', 'missing');

for (const name of COLLECTIONS) {
  if (!Array.isArray(doc[name])) report.fail(name, 'must be an array');
}
if (report.problemCount) {
  report.finish();
  process.exit(1);
}

// --- 2. Ids are unique, and every reference resolves -------------------------

/** id -> the collection it lives in */
const ids = new Map();
for (const collection of ID_BEARING) {
  for (const item of doc[collection]) {
    if (typeof item.id !== 'string' || !item.id) {
      report.fail(collection, 'entry without an id');
      continue;
    }
    if (ids.has(item.id))
      report.fail(collection, `duplicate id ${item.id} (also in ${ids.get(item.id)})`);
    ids.set(item.id, collection);
  }
}

/** Every [key, referencedId] pair for the given keys, flattening arrays. */
function references(item, keys) {
  return keys.flatMap((key) => {
    const value = item[key];
    if (value == null) return [];
    return Array.isArray(value) ? value.map((id) => [key, id]) : [[key, value]];
  });
}

const REFERENCE_KEYS = {
  facts: ['source_ids'],
  assumptions: ['source_ids'],
  decisions: ['basis_ids', 'supersedes'],
  tasks: ['evidence_ids', 'depends_on'],
  artifacts: ['basis_ids', 'supersedes'],
  events: ['subject_ids'],
};

for (const [collection, keys] of Object.entries(REFERENCE_KEYS)) {
  for (const item of doc[collection]) {
    for (const [key, id] of references(item, keys)) {
      if (!ids.has(id)) report.fail(`${collection} ${item.id}`, `${key} points at unknown id ${id}`);
    }
  }
}

if (doc.active_task_id != null && !doc.tasks.some((task) => task.id === doc.active_task_id))
  report.fail('active_task_id', `${doc.active_task_id} is not a task`);

for (const [index, link] of doc.links.entries()) {
  const where = `links[${index}]`;
  for (const key of ['dependent_id', 'prerequisite_id']) {
    if (!ids.has(link[key])) report.fail(where, `${key} points at unknown id ${link[key]}`);
  }
  if (link.dependent_id === link.prerequisite_id)
    report.fail(where, 'a record cannot be its own prerequisite');
  if (typeof link.reason !== 'string' || !link.reason.trim())
    report.fail(where, 'every declared link needs a reason');
}

// --- 3. Assertion vocabularies, and the format's own rules -------------------

for (const [collection, allowed] of Object.entries(ASSERTIONS)) {
  for (const item of doc[collection]) {
    if (!allowed.includes(item.assertion))
      report.fail(
        `${collection} ${item.id}`,
        `assertion ${JSON.stringify(item.assertion)} not in ${allowed.join('/')}`,
      );
  }
}

for (const task of doc.tasks) {
  if (!TASK_PROGRESS.includes(task.progress))
    report.fail(`tasks ${task.id}`, `unknown progress ${JSON.stringify(task.progress)}`);
  if (!TASK_SUBSTANTIATION.includes(task.substantiation))
    report.fail(`tasks ${task.id}`, `unknown substantiation ${JSON.stringify(task.substantiation)}`);
  // dossier-format.md: done work is not approved evidence.
  if (task.progress === 'done' && task.substantiation === 'reviewed' && task.evidence_ids.length === 0)
    report.fail(`tasks ${task.id}`, 'marked done and reviewed with no evidence_ids');
}

for (const assumption of doc.assumptions) {
  if (assumption.source_ids.length > 0)
    report.fail(
      `assumptions ${assumption.id}`,
      'has sources, so it is a fact rather than an assumption',
    );
}

// --- 4. The documented change-propagation walk -------------------------------
// dossier-format.md: "Walk links to find every dependent of the changed
// prerequisite, transitively." Prose does not prove termination; this does.

// prerequisiteId -> ids that declare it as a prerequisite. The graph walks
// themselves are in lib/graph.mjs, where they can be tested on a one-line
// graph instead of a whole valid dossier.
const directDependents = adjacencyOf(
  doc.links.map((link) => ({from: link.prerequisite_id, to: link.dependent_id})),
);

const dependentsReachableFrom = (startId) => reachableFrom(directDependents, startId);

// A cycle would make "revise only the dependents" ill-defined: there is no
// order in which to revise. Naming the path makes it fixable — "transitively
// its own dependent" left the reader to find the loop themselves.
const cycle = findCycle(directDependents, ids.keys());
if (cycle.length)
  report.fail(cycle[0], `dependency cycle: ${cycle.join(' -> ')}`);

// --- 5. Report what the graph actually answers -------------------------------

console.log(`${doc.project_id} revision ${doc.revision}, format ${doc.format}`);
console.log(`${ids.size} records, ${doc.links.length} declared links\n`);

const impact = doc.assumptions
  .map((assumption) => ({
    id: assumption.id,
    dependents: [...dependentsReachableFrom(assumption.id)],
  }))
  .sort((a, b) => b.dependents.length - a.dependents.length);

console.log('Change impact per assumption (what a revision would mark for review):');
for (const {id, dependents} of impact) {
  const tail = dependents.length ? ` -> ${dependents.join(', ')}` : '';
  console.log(`  ${dependents.length}  ${id}${tail}`);
}

const unlinked = [...ids.entries()]
  .filter(([, collection]) => collection === 'artifacts' || collection === 'decisions')
  .filter(([id]) => !doc.links.some((link) => link.dependent_id === id))
  .map(([id]) => id);

if (unlinked.length) {
  console.log('\nArtifacts/decisions with no declared prerequisite:');
  for (const id of unlinked) console.log(`  ${id}`);
  console.log('  (allowed — the graph is explicitly incomplete — but worth a look)');
}

console.log();
report.finish();
