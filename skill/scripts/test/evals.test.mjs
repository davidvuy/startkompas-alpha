// Do the eval case file and the scoring sheet still agree?
//
// Nothing enforced this, and the suite has already grown once — from 18 cases
// to 22. A case added to cases.md and not to results.md is a case that will
// never be scored, and the gap is invisible: both files look complete on their
// own. A case removed from cases.md but left in results.md is a row that can
// never be filled.
//
// These are consistency checks over the project's own documents, which is
// exactly what check-facts does for the packs.

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';

import {skillRoot} from '../lib/paths.mjs';

const evalsDir = join(skillRoot, 'evals');
const cases = readFileSync(join(evalsDir, 'cases.md'), 'utf8');
const results = readFileSync(join(evalsDir, 'results.md'), 'utf8');

/** Case headings, in file order: `## C7 — …`. */
const defined = [...cases.matchAll(/^##\s+(C(\d+))\b/gm)].map((match) => ({
  id: match[1],
  number: Number(match[2]),
}));

test('cases.md defines cases in a form the tooling can find', () => {
  // If this fails, every other test in this file is vacuous, so it is asserted
  // first rather than assumed.
  assert.ok(defined.length >= 20, `only ${defined.length} case headings found`);
});

test('case numbers run from 1 with no gaps and no duplicates', () => {
  // A gap means a case was deleted and its id reused, or never written; either
  // way "C13" in a report no longer identifies anything reliably.
  const numbers = defined.map((entry) => entry.number);
  assert.deepEqual(
    numbers,
    Array.from({length: numbers.length}, (_, i) => i + 1),
    'case numbers should be 1..n in order',
  );
});

test('every case is listed in results.md', () => {
  for (const {id} of defined) {
    assert.match(
      results,
      new RegExp(`\\b${id}\\b`),
      `${id} is defined in cases.md but never appears in results.md, so it cannot be scored`,
    );
  }
});

test('results.md mentions no case that cases.md does not define', () => {
  const known = new Set(defined.map((entry) => entry.id));
  const mentioned = new Set([...results.matchAll(/\bC(\d+)\b/g)].map((match) => `C${match[1]}`));
  for (const id of mentioned) {
    assert.ok(known.has(id), `results.md scores ${id}, which cases.md no longer defines`);
  }
});

test('every case states both what must and must not happen', () => {
  // The "must not" half is where the real failures live — a skill hijacking a
  // trivial request, or inventing a price. A case with only a "must" passes
  // too easily.
  const sections = cases.split(/^##\s+C\d+\b/gm).slice(1);
  assert.equal(sections.length, defined.length);

  for (const [index, body] of sections.entries()) {
    const id = defined[index].id;
    assert.match(body, /- Must:/, `${id} has no "Must:" line`);
    assert.match(body, /Must not:/, `${id} has no "Must not:" line`);
  }
});

test('every case carries a prompt a scorer can paste', () => {
  const sections = cases.split(/^##\s+C\d+\b/gm).slice(1);
  for (const [index, body] of sections.entries()) {
    assert.match(body, /\*\*Prompt:\*\*/, `${defined[index].id} has no prompt`);
  }
});

test('the harm cases named in the pass bar are defined', () => {
  // results.md sets the bar as "every harm case passes". If one of those ids
  // stopped existing, the bar would silently weaken.
  const bar = /harm case/i.exec(results);
  assert.ok(bar, 'results.md no longer states a pass bar mentioning harm cases');

  const known = new Set(defined.map((entry) => entry.id));
  // The bar lists them inline, e.g. "(C3, C10, C12, C20)".
  const listed = [...results.matchAll(/\bC(\d+)\b/g)].map((match) => `C${match[1]}`);
  assert.ok(listed.length > 0);
  for (const id of new Set(listed)) assert.ok(known.has(id));
});

test('no case is scored on a host yet, and results.md still says so', () => {
  // This is the project's largest known gap. If this test ever fails because
  // real scores were recorded, that is good news — delete the test and say so
  // in the changelog rather than leaving a false claim in place.
  assert.match(
    results,
    /not been scored|no behavioural|0 scored|unscored/i,
    'results.md should state plainly that no host run has been scored',
  );
});
