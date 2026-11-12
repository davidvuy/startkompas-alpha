// Does check-all.mjs report what actually happened?
//
// It looked thin enough to skip — it only runs the other checks — but it holds
// three things that are wrong in interesting ways if nobody looks:
//
//   - `--quiet` buffers each child's output and must print it anyway when that
//     child fails, or a red CI build says only "FAILED" with no reason.
//   - a child killed by a signal has a null exit status, and `status !== 0` is
//     false for null. Treating that as a pass is the classic version of this
//     bug, so the check tests `run.error || run.signal` as well.
//   - `--offline` must mark the network check skipped rather than passed, and
//     say so, since a run that skipped it is not a run that passed it.
//
// These drive the real entrypoint against the real skill, so they also serve as
// the one end-to-end test in the suite: if any check genuinely breaks, this
// fails too.

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

import {scriptsDir} from '../lib/paths.mjs';

/** Run the entrypoint against the real skill tree. */
function runAll(args = []) {
  const run = spawnSync(process.execPath, [join(scriptsDir, 'check-all.mjs'), ...args], {
    encoding: 'utf8',
    shell: false,
    windowsHide: true,
  });
  return {
    code: run.error || run.signal ? -1 : (run.status ?? -1),
    stdout: run.stdout ?? '',
    stderr: run.stderr ?? '',
    output: (run.stdout ?? '') + (run.stderr ?? ''),
  };
}

const checkScripts = readdirSync(scriptsDir).filter(
  (name) => name.startsWith('check-') && name.endsWith('.mjs') && name !== 'check-all.mjs',
);

test('--offline --quiet passes on the real skill and summarises every check', () => {
  const result = runAll(['--offline', '--quiet']);
  assert.equal(result.code, 0, result.output);

  // Every check appears in the summary, so a reader can see what ran.
  for (const name of checkScripts) {
    assert.ok(result.stdout.includes(name), `${name} is missing from the summary`);
  }
  assert.match(result.stdout, /OK: \d+ check\(s\) passed\./);
});

test('--offline marks the network check skipped, not passed, and says so', () => {
  // A run that skipped the link check is not a run that passed it, and anyone
  // reading the summary before publishing needs to know which they have.
  const result = runAll(['--offline', '--quiet']);
  assert.match(result.stdout, /skipped\s+check-links\.mjs/);
  assert.ok(
    !/passed\s+check-links\.mjs/.test(result.stdout),
    'check-links must not be reported as passed when it was skipped',
  );
  assert.match(result.stdout, /--offline: check-links\.mjs was skipped; run it before publishing/);
});

test('the tests over the checks run first', () => {
  // A broken check invalidates every result after it, so the suite over the
  // checks has to be the first thing in the summary.
  const result = runAll(['--offline', '--quiet']);
  const lines = result.stdout.split(/\r?\n/).filter((line) => /^\s+(passed|skipped|FAILED)/.test(line));
  assert.ok(lines.length > 1, `expected a summary, got:\n${result.stdout}`);
  assert.match(lines[0], /test/, `the test suite should be first, got "${lines[0]}"`);
});

test('without --quiet it prints each check as it runs, with what that check proves', () => {
  // The banner is the only place a reader learns why a check exists while
  // watching it run, so every check that actually runs must have one.
  const result = runAll(['--offline']);
  assert.equal(result.code, 0, result.output);

  for (const name of checkScripts.filter((candidate) => candidate !== 'check-links.mjs')) {
    assert.match(
      result.stdout,
      new RegExp(`=== ${name.replace('.', '\\.')} — .+ ===`),
      `${name} has no banner saying what it proves`,
    );
  }

  // And a skipped check prints no banner, because it did not run.
  assert.ok(
    !result.stdout.includes('=== check-links.mjs'),
    'a skipped check should not announce itself as running',
  );
});

test('a signal is treated as a failure, not as a pass', () => {
  // The subtle one. A child killed by a signal has status null, and
  // `null !== 0` is true but `status !== 0` alone would miss a spawn error
  // where status is also null. The source has to test error and signal too.
  const source = readFileSync(join(scriptsDir, 'check-all.mjs'), 'utf8');
  assert.match(
    source,
    /run\.error != null \|\| run\.signal != null \|\| run\.status !== 0/,
    'the failure test must cover a spawn error and a signal, not just a non-zero status',
  );
});

test('every check it lists declares whether it needs the network', () => {
  // `--offline` decides what to skip from this flag alone, so a check added
  // without it would silently run in offline mode and try to reach the network.
  const source = readFileSync(join(scriptsDir, 'check-all.mjs'), 'utf8');
  const entries = source.split(/\{\s*$/m).filter((block) => block.includes('script:'));
  assert.equal(
    entries.length,
    checkScripts.length + 1,
    'every check script plus the test suite should have an entry',
  );
  for (const entry of entries) {
    assert.match(entry, /network:\s*(true|false)/);
  }
});

test('exactly one check is marked as needing the network', () => {
  // If a second one ever is, --offline silently stops covering it and the
  // Windows CI job starts making network calls.
  const source = readFileSync(join(scriptsDir, 'check-all.mjs'), 'utf8');
  const networked = [...source.matchAll(/network:\s*true/g)];
  assert.equal(networked.length, 1, `${networked.length} checks claim to need the network`);
});

// --- Running the network check alongside the local ones ----------------------
//
// Added 2026-11-12. `check-links.mjs` takes about fourteen seconds of waiting
// and everything else about four, so in sequence the run spent fourteen
// seconds with an idle CPU. Measured over three alternating pairs, starting it
// first and awaiting it last cut the run from 29.7 s to 23.6 s on average, and
// won every pair.
//
// The concurrent path itself needs the network, so it is exercised by the real
// `check-all` run rather than here — the same way check-links is. What these
// tests pin is everything about it that can be checked offline: that the
// report still reads in declared order, and that a skipped check is not given
// a fabricated duration.

test('the summary reports how long each check took', () => {
  // You cannot improve what you do not measure, and the one place a
  // maintainer will look is the summary they already read.
  const result = runAll(['--offline', '--quiet']);
  assert.match(
    result.stdout,
    /passed\s+check-skill\.mjs\s+\d+\s+ms/,
    `expected a duration beside each check, got:\n${result.stdout}`,
  );
});

test('a skipped check is given no duration rather than zero', () => {
  // `0 ms` would read as "it ran and was instant", which is the opposite of
  // what --offline means.
  const result = runAll(['--offline', '--quiet']);
  const line = result.stdout.split(/\r?\n/).find((text) => text.includes('skipped'));
  assert.ok(line, `no skipped line in:\n${result.stdout}`);
  assert.ok(!/\d+\s*ms/.test(line), `a skipped check must carry no duration, got: ${line}`);
});

test('the summary is ordered as the checks are declared, not as they finish', () => {
  // The network check now finishes asynchronously, so the order of the results
  // array is no longer the order of the loop. The report must not reorder:
  // "the tests over the checks run first" is a documented property.
  const result = runAll(['--offline', '--quiet']);
  const source = readFileSync(join(scriptsDir, 'check-all.mjs'), 'utf8');
  const declared = [...source.matchAll(/script: '([^']+)'/g)].map((match) => match[1]);
  const summary = result.stdout.slice(result.stdout.indexOf('--- summary ---'));
  const reported = declared.filter((name) => summary.includes(name));
  assert.deepEqual(reported, declared, 'every declared check should appear in the summary');
  let cursor = -1;
  for (const name of declared) {
    const at = summary.indexOf(name);
    assert.ok(at > cursor, `${name} appears out of declared order in:\n${summary}`);
    cursor = at;
  }
});

test('the network check is started before the local loop, not after it', () => {
  // The whole saving depends on this ordering, and it is the kind of thing a
  // later edit reverts by accident while tidying. Asserted against the source,
  // because the behaviour it guards is invisible offline.
  const source = readFileSync(join(scriptsDir, 'check-all.mjs'), 'utf8');
  const startedAt = source.indexOf('const pending =');
  const loopAt = source.indexOf('for (const check of CHECKS)');
  assert.ok(startedAt > 0, 'expected the network checks to be started into a `pending` list');
  assert.ok(loopAt > 0, 'expected the local loop over CHECKS');
  assert.ok(
    startedAt < loopAt,
    'the network check must be started before the local loop, or nothing overlaps',
  );
});
