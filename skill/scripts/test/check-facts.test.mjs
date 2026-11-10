// Two different things are tested here.
//
// 1. The assertion TABLES, as data. They go wrong in ways that produce a green
//    build: an entry naming a pack that no longer exists, two entries with the
//    same label so one silently shadows the other in a report, a pattern that
//    is not a regular expression.
// 2. The MATCHER, as a pure function fed synthetic pack text. In particular the
//    forbidden-pattern rule, which has a subtlety that already bit once: a pack
//    may legitimately quote the claim it is withdrawing, and the pattern must
//    not fire on that.

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync} from 'node:fs';

import {REQUIRED, FORBIDDEN, evaluate} from '../lib/facts.mjs';
import {packsDir} from '../lib/paths.mjs';

// --- The tables as data ------------------------------------------------------

test('every assertion is well-formed', () => {
  for (const entry of [...REQUIRED, ...FORBIDDEN]) {
    assert.equal(typeof entry.pack, 'string', `pack missing on ${JSON.stringify(entry)}`);
    assert.match(entry.pack, /\.md$/, `pack should be a filename: ${entry.pack}`);
    assert.ok(entry.label?.length > 3, `label too thin: ${JSON.stringify(entry)}`);
    assert.ok(entry.pattern instanceof RegExp, `pattern is not a RegExp: ${entry.label}`);
  }
  for (const entry of REQUIRED) {
    assert.ok(entry.case?.length > 0, `required entry needs a case id: ${entry.label}`);
  }
});

test('every pack an assertion names actually exists', () => {
  // An assertion against a renamed or deleted pack reports "missing" forever,
  // or — worse, for a forbidden entry — is skipped in silence.
  const present = new Set(readdirSync(packsDir).filter((file) => file.endsWith('.md')));
  for (const entry of [...REQUIRED, ...FORBIDDEN]) {
    assert.ok(present.has(entry.pack), `assertion "${entry.label}" names missing pack ${entry.pack}`);
  }
});

test('no two assertions on the same pack share a label', () => {
  // Labels are how a failure is identified. Duplicates make one of them
  // unfixable, because the report cannot say which fired.
  const seen = new Set();
  for (const entry of [...REQUIRED, ...FORBIDDEN]) {
    const key = `${entry.pack}::${entry.label}`;
    assert.ok(!seen.has(key), `duplicate assertion label: ${key}`);
    seen.add(key);
  }
});

test('no required pattern is trivially satisfiable', () => {
  // An empty or near-empty pattern matches any pack and asserts nothing. This
  // is the failure mode of silencing an assertion to get a green build.
  for (const entry of REQUIRED) {
    assert.ok(
      entry.pattern.source.length >= 3,
      `pattern for "${entry.label}" is too loose to assert anything: ${entry.pattern}`,
    );
    assert.notEqual(entry.pattern.source, '(?:)', `empty pattern for "${entry.label}"`);
  }
});

test('forbidden patterns do not use the global flag', () => {
  // A /g regex carries lastIndex between .test() calls, so the same pattern can
  // match once and then miss. Both tables are reused across packs.
  for (const entry of [...REQUIRED, ...FORBIDDEN]) {
    assert.ok(!entry.pattern.flags.includes('g'), `pattern for "${entry.label}" is global`);
  }
});

// --- The matcher -------------------------------------------------------------

/** A reader that serves one synthetic pack and reports others as absent. */
function serve(contents, pack = 'belgium.md') {
  return (requested) => (requested === pack ? contents : null);
}

test('a required fact that is present produces no problem', () => {
  const {problems, checked} = evaluate(
    serve('The rule is that Peppol applies from 2026-01-01.'),
  );
  // Other packs are absent in this fixture, so only belgium.md assertions can
  // pass; what matters is that a satisfied one contributes nothing.
  assert.ok(checked > 0);
  assert.ok(
    !problems.some((p) => p.message.includes('Peppol named')),
    'a satisfied assertion should not be reported',
  );
});

test('a required fact that is missing names the case and the pattern', () => {
  const {problems} = evaluate(serve('Nothing relevant here.'));
  const peppol = problems.find((p) => p.message.includes('Peppol named'));
  assert.ok(peppol, 'expected the missing fact to be reported');
  assert.equal(peppol.pack, 'belgium.md');
  assert.match(peppol.message, /C4 expects/);
  assert.match(peppol.message, /does not match/);
});

test('a missing pack is reported once per assertion that needs it, not skipped', () => {
  const {problems} = evaluate(() => null);
  assert.ok(problems.length > 0);
  assert.ok(problems.every((p) => p.message.startsWith('missing (needed by')));
});

test('a forbidden pattern present in a pack is reported', () => {
  const {problems} = evaluate(
    serve('The applicant must obtain basic-management knowledge first.'),
  );
  const walloon = problems.find((p) => p.message.includes('Walloon proof'));
  assert.ok(walloon, 'expected the forbidden pattern to fire');
  assert.match(walloon.message, /forbidden pattern/);
});

test('a forbidden pattern absent from a pack is not reported', () => {
  const {problems} = evaluate(serve('No such requirement exists.'));
  assert.ok(!problems.some((p) => p.message.includes('forbidden pattern')));
});

test('a withdrawn claim quoted inside its own correction does not trip the rule', () => {
  // The real case: belgium.md §2 quotes the wording it retracted, so the reader
  // can see what was wrong. The first version of this pattern fired on that
  // correction, which would have forced the pack to delete its own audit trail.
  const correction =
    'An earlier version of this entry stated *"now enacted, not a bill: the law of ' +
    '2026-09-23"*. Reading the primary document showed three errors.';
  const {problems} = evaluate(serve(correction));
  assert.ok(
    !problems.some((p) => p.message.includes('must not read as enacted law')),
    'quoting a retracted claim inside a correction must stay legal',
  );
});

test('the same claim asserted rather than quoted does trip the rule', () => {
  // The other half: the lookbehind must not have made the pattern useless.
  const assertion = 'Legal basis — **now enacted, not a bill**: the law of 2026-09-23.';
  const {problems} = evaluate(serve(assertion));
  assert.ok(
    problems.some((p) => p.message.includes('must not read as enacted law')),
    'an assertive restatement must still be caught',
  );
});

test('each pack is read once however many assertions reference it', () => {
  let reads = 0;
  evaluate((pack) => {
    reads += 1;
    return pack === 'belgium.md' ? 'text' : null;
  });
  // One read per distinct pack named in the tables, not one per assertion.
  const distinct = new Set([...REQUIRED, ...FORBIDDEN].map((e) => e.pack)).size;
  assert.equal(reads, distinct);
});

test('evaluate performs no I/O of its own', () => {
  // It is pure by contract: everything it learns comes through the callback.
  // If that ever stops being true, this test is where it shows up.
  const {checked} = evaluate(() => null);
  assert.equal(checked, 0, 'with every pack absent, nothing can have been checked');
});
