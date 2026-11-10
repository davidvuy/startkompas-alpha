#!/usr/bin/env node
// Backlog item 32: the change-propagation rules in references/dossier-format.md
// are an algorithm written in prose. This executes them against the worked
// example, so "the walk terminates" is verified rather than assumed, and the
// example cannot drift out of referential integrity unnoticed.
//
//   node scripts/check-dossier.mjs [project.json]
//
// Standard library only.

import {readFileSync, existsSync} from 'node:fs';
import {join, dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const target = resolve(
  process.argv[2] ?? join(root, 'references', 'examples', 'worked-project.json'),
);

const problems = [];
const notes = [];
const fail = (m) => problems.push(m);

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

// --- 1. Shape -----------------------------------------------------------------

if (doc.format !== 'startkompas-dossier/1')
  fail(`format is ${JSON.stringify(doc.format)}; expected "startkompas-dossier/1"`);
if (!Number.isInteger(doc.revision) || doc.revision < 1)
  fail(`revision must be a positive integer, got ${JSON.stringify(doc.revision)}`);
if (typeof doc.project_id !== 'string' || !doc.project_id)
  fail('project_id missing');

const collections = [
  'sources',
  'facts',
  'assumptions',
  'decisions',
  'tasks',
  'artifacts',
  'links',
  'events',
];
for (const name of collections) {
  if (!Array.isArray(doc[name])) fail(`${name} must be an array`);
}
if (problems.length) {
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

// --- 2. Ids are unique and references resolve ---------------------------------

const ids = new Map(); // id -> kind
const register = (kind, list) => {
  for (const item of list) {
    if (typeof item.id !== 'string' || !item.id) {
      fail(`${kind} entry without an id`);
      continue;
    }
    if (ids.has(item.id)) fail(`duplicate id ${item.id} (${kind} and ${ids.get(item.id)})`);
    ids.set(item.id, kind);
  }
};
for (const name of ['sources', 'facts', 'assumptions', 'decisions', 'tasks', 'artifacts', 'events'])
  register(name, doc[name]);

const refsOf = (item, keys) =>
  keys.flatMap((k) => {
    const v = item[k];
    if (v == null) return [];
    return Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v]];
  });

const checkRefs = (kind, list, keys) => {
  for (const item of list)
    for (const [key, ref] of refsOf(item, keys))
      if (!ids.has(ref)) fail(`${kind} ${item.id}: ${key} points at unknown id ${ref}`);
};

checkRefs('fact', doc.facts, ['source_ids']);
checkRefs('assumption', doc.assumptions, ['source_ids']);
checkRefs('decision', doc.decisions, ['basis_ids', 'supersedes']);
checkRefs('task', doc.tasks, ['evidence_ids', 'depends_on']);
checkRefs('artifact', doc.artifacts, ['basis_ids', 'supersedes']);
checkRefs('event', doc.events, ['subject_ids']);

if (doc.active_task_id != null && !doc.tasks.some((t) => t.id === doc.active_task_id))
  fail(`active_task_id ${doc.active_task_id} is not a task`);

for (const [i, link] of doc.links.entries()) {
  for (const key of ['dependent_id', 'prerequisite_id']) {
    if (!ids.has(link[key])) fail(`links[${i}]: ${key} points at unknown id ${link[key]}`);
  }
  if (link.dependent_id === link.prerequisite_id)
    fail(`links[${i}]: a record cannot be its own prerequisite`);
  if (typeof link.reason !== 'string' || !link.reason.trim())
    fail(`links[${i}]: every declared link needs a reason`);
}

// --- 3. Assertion vocabularies ------------------------------------------------

const allowed = {
  fact: ['reported', 'observed', 'inferred'],
  assumption: ['unknown'],
};
for (const f of doc.facts)
  if (!allowed.fact.includes(f.assertion))
    fail(`fact ${f.id}: assertion ${JSON.stringify(f.assertion)} not in ${allowed.fact.join('/')}`);
for (const a of doc.assumptions)
  if (!allowed.assumption.includes(a.assertion))
    fail(`assumption ${a.id}: assertion must be "unknown", got ${JSON.stringify(a.assertion)}`);

for (const t of doc.tasks) {
  if (!['open', 'in_progress', 'parked', 'done'].includes(t.progress))
    fail(`task ${t.id}: unknown progress ${JSON.stringify(t.progress)}`);
  if (!['unreviewed', 'reviewed'].includes(t.substantiation))
    fail(`task ${t.id}: unknown substantiation ${JSON.stringify(t.substantiation)}`);
  // The format's own rule: done work is not approved evidence.
  if (t.progress === 'done' && t.substantiation === 'reviewed' && t.evidence_ids.length === 0)
    fail(`task ${t.id}: marked done and reviewed with no evidence_ids`);
}

for (const a of doc.assumptions)
  if (a.source_ids.length > 0)
    fail(`assumption ${a.id}: has sources, so it is a fact rather than an assumption`);

// --- 4. The documented change-propagation walk --------------------------------
// dossier-format.md: "Walk links to find every dependent of the changed
// prerequisite, transitively." Prose does not prove termination; this does.

const dependentsOf = new Map();
for (const link of doc.links) {
  if (!dependentsOf.has(link.prerequisite_id)) dependentsOf.set(link.prerequisite_id, []);
  dependentsOf.get(link.prerequisite_id).push(link.dependent_id);
}

function walk(startId) {
  const seen = new Set();
  const queue = [startId];
  let steps = 0;
  const limit = ids.size * ids.size + 10; // generous bound; a terminating walk never reaches it
  while (queue.length) {
    if (++steps > limit) return {terminated: false, seen};
    const current = queue.pop();
    for (const next of dependentsOf.get(current) ?? []) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return {terminated: true, seen, steps};
}

// A cycle would make "revise only the dependents" ill-defined.
for (const id of ids.keys()) {
  const {terminated, seen} = walk(id);
  if (!terminated) fail(`change-propagation walk from ${id} did not terminate`);
  if (seen.has(id)) fail(`dependency cycle: ${id} is transitively its own dependent`);
}

// Report what the graph actually answers, which is the point of the format.
const assumptionImpact = doc.assumptions
  .map((a) => ({id: a.id, dependents: [...walk(a.id).seen]}))
  .sort((x, y) => y.dependents.length - x.dependents.length);

const unlinked = [...ids.entries()]
  .filter(([, kind]) => kind === 'artifacts' || kind === 'decisions')
  .filter(([id]) => !doc.links.some((l) => l.dependent_id === id))
  .map(([id]) => id);

// --- report -------------------------------------------------------------------

console.log(`${doc.project_id} revision ${doc.revision}, format ${doc.format}`);
console.log(`${ids.size} records, ${doc.links.length} declared links\n`);

console.log('Change impact per assumption (what a revision would mark for review):');
for (const row of assumptionImpact)
  console.log(`  ${row.dependents.length}  ${row.id}${row.dependents.length ? ' -> ' + row.dependents.join(', ') : ''}`);

if (unlinked.length) {
  console.log('\nArtifacts/decisions with no declared prerequisite:');
  for (const id of unlinked) console.log(`  ${id}`);
  console.log('  (allowed - the graph is explicitly incomplete - but worth a look)');
}

for (const n of notes) console.log(`  ${n}`);

if (problems.length === 0) {
  console.log('\nOK: referentially intact, vocabularies valid, propagation walk terminates, no cycles.');
} else {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exitCode = 1;
}
