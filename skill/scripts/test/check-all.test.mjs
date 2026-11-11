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
