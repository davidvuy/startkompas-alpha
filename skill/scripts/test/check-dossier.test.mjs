// Does check-dossier.mjs actually notice a broken dossier?
//
// This check is the executable form of the change-propagation rules that
// references/dossier-format.md states in prose. Two properties matter most and
// cannot be read off the source: that the walk terminates, and that a cycle is
// caught. Both get a fixture built to violate them.

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {join} from 'node:path';

import {runCheck, withTree} from './helpers.mjs';
import {examplesDir} from '../lib/paths.mjs';

/** A dossier that satisfies every rule, as the base for each mutation. */
function validDossier(overrides = {}) {
  return {
    format: 'startkompas-dossier/1',
    revision: 3,
    project_id: 'fixture-project',
    active_task_id: 't1',
    sources: [{id: 's1', title: 'A read source'}],
    facts: [{id: 'f1', assertion: 'reported', source_ids: ['s1']}],
    assumptions: [{id: 'a1', assertion: 'unknown', source_ids: []}],
    decisions: [{id: 'd1', basis_ids: ['f1'], supersedes: null}],
    tasks: [
      {id: 't1', progress: 'open', substantiation: 'unreviewed', evidence_ids: [], depends_on: []},
    ],
    artifacts: [{id: 'r1', basis_ids: ['d1'], supersedes: null}],
    links: [{dependent_id: 'd1', prerequisite_id: 'a1', reason: 'the decision rests on it'}],
    events: [{id: 'e1', subject_ids: ['t1']}],
    ...overrides,
  };
}

function run(dossier) {
  const body = typeof dossier === 'string' ? dossier : JSON.stringify(dossier, null, 2);
  return withTree({'project.json': body}, (root) =>
    runCheck('check-dossier.mjs', root, {args: [join(root, 'project.json')]}),
  );
}

function expectPass(dossier) {
  const result = run(dossier);
  assert.equal(result.code, 0, `expected a pass, got:\n${result.output}`);
  return result;
}

function expectFail(dossier, needle) {
  const result = run(dossier);
  assert.notEqual(result.code, 0, `expected a failure, got a pass:\n${result.output}`);
  assert.match(result.output, needle);
  return result;
}

test('the shipped worked example passes', () => {
  // The example is documentation; if it drifts out of integrity the format's
  // only concrete illustration becomes wrong.
  const result = runCheck('check-dossier.mjs', examplesDir, {
    args: [join(examplesDir, 'worked-project.json')],
  });
  assert.equal(result.code, 0, result.output);
});

test('the fixture dossier passes, so every failure below is its defect', () => {
  expectPass(validDossier());
});

// --- Shape -------------------------------------------------------------------

test('a missing file exits non-zero with the path', () => {
  const result = withTree({'nothing.txt': ''}, (root) =>
    runCheck('check-dossier.mjs', root, {args: [join(root, 'absent.json')]}),
  );
  assert.notEqual(result.code, 0);
  assert.match(result.output, /No such file/);
});

test('invalid JSON is reported as invalid JSON, not as a crash', () => {
  const result = run('{"format": "startkompas-dossier/1",,}');
  assert.notEqual(result.code, 0);
  assert.match(result.output, /Not valid JSON/);
});

test('the wrong format version fails', () => {
  expectFail(validDossier({format: 'startkompas-dossier/2'}), /expected "startkompas-dossier\/1"/);
});

test('a non-positive revision fails', () => {
  expectFail(validDossier({revision: 0}), /revision.*positive integer/);
});

test('a missing project_id fails', () => {
  expectFail(validDossier({project_id: ''}), /project_id: missing/);
});

test('a collection that is not an array fails and stops before the later checks', () => {
  // The later sections index into these collections, so the check must bail.
  // If it did not, the real output would be a TypeError instead of this.
  const result = expectFail(validDossier({facts: {}}), /facts: must be an array/);
  assert.ok(
    !/does not terminate|dependency cycle/.test(result.output),
    'the propagation section should not have run',
  );
});

// --- Referential integrity ---------------------------------------------------

test('a duplicate id fails and names both collections', () => {
  expectFail(
    validDossier({sources: [{id: 's1'}], facts: [{id: 's1', assertion: 'reported', source_ids: []}]}),
    /duplicate id s1 \(also in sources\)/,
  );
});

test('an entry with no id fails', () => {
  expectFail(validDossier({sources: [{title: 'nameless'}]}), /entry without an id/);
});

test('a reference to an unknown id fails and names the key', () => {
  expectFail(
    validDossier({facts: [{id: 'f1', assertion: 'reported', source_ids: ['s-nope']}]}),
    /source_ids points at unknown id s-nope/,
  );
});

test('an active_task_id that is not a task fails', () => {
  expectFail(validDossier({active_task_id: 'f1'}), /active_task_id: f1 is not a task/);
});

test('a link to an unknown id fails', () => {
  expectFail(
    validDossier({links: [{dependent_id: 'd1', prerequisite_id: 'ghost', reason: 'x'}]}),
    /prerequisite_id points at unknown id ghost/,
  );
});

test('a link from a record to itself fails', () => {
  expectFail(
    validDossier({links: [{dependent_id: 'd1', prerequisite_id: 'd1', reason: 'x'}]}),
    /cannot be its own prerequisite/,
  );
});

test('a link with no reason fails', () => {
  // The reason is what makes the graph auditable later; a blank one is worse
  // than no link because it looks deliberate.
  expectFail(
    validDossier({links: [{dependent_id: 'd1', prerequisite_id: 'a1', reason: '   '}]}),
    /every declared link needs a reason/,
  );
});

// --- Vocabularies and the format's own rules ---------------------------------

test('a fact with an assertion outside the vocabulary fails', () => {
  expectFail(
    validDossier({facts: [{id: 'f1', assertion: 'probably', source_ids: ['s1']}]}),
    /assertion "probably" not in reported\/observed\/inferred/,
  );
});

test('an assumption asserted as anything but unknown fails', () => {
  expectFail(
    validDossier({assumptions: [{id: 'a1', assertion: 'reported', source_ids: []}]}),
    /assertion "reported" not in unknown/,
  );
});

test('an assumption carrying sources fails, because that makes it a fact', () => {
  expectFail(
    validDossier({assumptions: [{id: 'a1', assertion: 'unknown', source_ids: ['s1']}]}),
    /it is a fact rather than an assumption/,
  );
});

test('an unknown task progress fails', () => {
  expectFail(
    validDossier({
      tasks: [{id: 't1', progress: 'nearly', substantiation: 'unreviewed', evidence_ids: [], depends_on: []}],
    }),
    /unknown progress "nearly"/,
  );
});

test('a task done and reviewed with no evidence fails', () => {
  // dossier-format.md's rule that finished work is not approved evidence.
  expectFail(
    validDossier({
      tasks: [{id: 't1', progress: 'done', substantiation: 'reviewed', evidence_ids: [], depends_on: []}],
    }),
    /marked done and reviewed with no evidence_ids/,
  );
});

test('a task done and reviewed with evidence passes', () => {
  expectPass(
    validDossier({
      tasks: [{id: 't1', progress: 'done', substantiation: 'reviewed', evidence_ids: ['f1'], depends_on: []}],
    }),
  );
});

// --- The propagation walk ----------------------------------------------------

test('a two-record cycle is caught', () => {
  // The property the prose cannot establish: with A depending on B and B on A,
  // "revise only the dependents" has no answer.
  expectFail(
    validDossier({
      links: [
        {dependent_id: 'd1', prerequisite_id: 'r1', reason: 'forward'},
        {dependent_id: 'r1', prerequisite_id: 'd1', reason: 'back'},
      ],
    }),
    /dependency cycle: transitively its own dependent/,
  );
});

test('a longer cycle through a third record is caught too', () => {
  // A direct A<->B cycle is the easy case. Three hops is where a naive
  // implementation stops noticing.
  expectFail(
    validDossier({
      links: [
        {dependent_id: 'd1', prerequisite_id: 'a1', reason: 'one'},
        {dependent_id: 'r1', prerequisite_id: 'd1', reason: 'two'},
        {dependent_id: 'a1', prerequisite_id: 'r1', reason: 'three'},
      ],
    }),
    /dependency cycle/,
  );
});

test('a deep acyclic chain passes and the walk terminates', () => {
  const sources = Array.from({length: 50}, (_, i) => ({id: `s${i}`, title: `source ${i}`}));
  const links = Array.from({length: 49}, (_, i) => ({
    dependent_id: `s${i + 1}`,
    prerequisite_id: `s${i}`,
    reason: 'chained',
  }));
  expectPass(
    validDossier({
      sources,
      facts: [{id: 'f1', assertion: 'reported', source_ids: ['s0']}],
      links,
    }),
  );
});

test('the report states the impact of each assumption', () => {
  // The check is also the only thing that shows what a revision would touch,
  // so that output is part of its contract.
  const result = expectPass(validDossier());
  assert.match(result.output, /Change impact per assumption/);
  assert.match(result.output, /a1 -> d1|1\s+a1/);
});
