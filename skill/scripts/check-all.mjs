#!/usr/bin/env node
// Runs every check in one go. This is the command to use; the individual
// scripts exist for when you want one check's detail.
//
//   node scripts/check-all.mjs              all checks
//   node scripts/check-all.mjs --offline    skip the one check that needs the network
//   node scripts/check-all.mjs --quiet      summary only
//
// Exits 1 if any check fails.
//
// The network check runs ALONGSIDE the local ones rather than after them.
// Measured on 2026-11-12: `check-links.mjs` takes about fourteen seconds, of
// which almost all is waiting on government portals, while everything else
// together takes about four. Run in sequence that is eighteen seconds of which
// fourteen is idle CPU. Started first and awaited last, the whole run costs
// what the network check alone costs.
//
// Its output is captured and printed in its declared position, so the report
// reads exactly as it did when the run was serial — which matters, because the
// order is documented: the test suite comes first because a broken checker
// invalidates every result below it.

import {spawn, spawnSync} from 'node:child_process';
import {join} from 'node:path';

import {scriptsDir} from './lib/paths.mjs';

const args = new Set(process.argv.slice(2));
const offline = args.has('--offline');
const quiet = args.has('--quiet');

const CHECKS = [
  {
    // First, because a broken checker invalidates every result below it. These
    // are mostly negative tests: they build a tree with one deliberate defect
    // and assert the check notices. The explicit glob matters — Node's default
    // discovery also loads any file under a `test/` directory, which would pull
    // in test/helpers.mjs as an empty test file.
    script: 'test/*.test.mjs',
    argv: ['--test', join(scriptsDir, 'test', '*.test.mjs')],
    proves: 'the checks themselves still catch what they are supposed to catch',
    network: false,
  },
  {
    script: 'check-skill.mjs',
    proves: 'structure, links, reachability, host neutrality, size budget',
    network: false,
  },
  {
    script: 'check-markdown.mjs',
    proves: 'no table is split or ragged, and no heading is duplicated',
    network: false,
  },
  {
    script: 'check-dossier.mjs',
    proves: 'the documented propagation algorithm terminates and is acyclic',
    network: false,
  },
  {
    script: 'check-facts.mjs',
    proves: 'packs and eval cases still agree',
    network: false,
  },
  {
    script: 'check-freshness.mjs',
    proves: 'no pack is past its recheck date',
    network: false,
  },
  {
    script: 'check-links.mjs',
    proves: 'every cited source URL still resolves',
    network: true,
  },
];

const argvFor = (check) => check.argv ?? [join(scriptsDir, check.script)];

/** Start a check now and resolve when it exits, keeping its output to print later. */
function startDetached(check) {
  const started = Date.now();
  const child = spawn(process.execPath, argvFor(check), {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
    windowsHide: true,
  });
  const chunks = {stdout: [], stderr: []};
  child.stdout.on('data', (chunk) => chunks.stdout.push(chunk));
  child.stderr.on('data', (chunk) => chunks.stderr.push(chunk));
  return new Promise((resolve) => {
    let settled = false;
    const finish = (status, signal, error) => {
      if (settled) return;
      settled = true;
      resolve({
        check,
        ms: Date.now() - started,
        failed: error != null || signal != null || status !== 0,
        stdout: Buffer.concat(chunks.stdout).toString(),
        stderr: Buffer.concat(chunks.stderr).toString(),
      });
    };
    child.on('error', (error) => finish(null, null, error));
    child.on('close', (status, signal) => finish(status, signal, null));
  });
}

// Started before anything else, so its waiting overlaps the local work.
const pending = offline
  ? []
  : CHECKS.filter((check) => check.network).map((check) => ({check, promise: startDetached(check)}));

const results = [];

for (const check of CHECKS) {
  if (check.network) {
    // Already running, or skipped. Either way it is reported after the loop.
    if (offline) results.push({...check, status: 'skipped', ms: null});
    continue;
  }

  if (!quiet) console.log(`\n=== ${check.script} — ${check.proves} ===`);

  const started = Date.now();
  const run = spawnSync(process.execPath, argvFor(check), {
    stdio: quiet ? 'pipe' : 'inherit',
    shell: false,
    windowsHide: true,
  });
  const ms = Date.now() - started;

  // A signal or spawn error is a failure, not a pass with no exit code.
  const failed = run.error != null || run.signal != null || run.status !== 0;
  results.push({...check, status: failed ? 'FAILED' : 'passed', ms});

  if (quiet && failed) {
    process.stdout.write(run.stdout?.toString() ?? '');
    process.stderr.write(run.stderr?.toString() ?? '');
  }
}

for (const {check, promise} of pending) {
  const outcome = await promise;
  if (!quiet) {
    console.log(`\n=== ${check.script} — ${check.proves} ===`);
    process.stdout.write(outcome.stdout);
    process.stderr.write(outcome.stderr);
  } else if (outcome.failed) {
    process.stdout.write(outcome.stdout);
    process.stderr.write(outcome.stderr);
  }
  results.push({...check, status: outcome.failed ? 'FAILED' : 'passed', ms: outcome.ms});
}

// Report in declared order, not in the order the results arrived. With the
// network check declared last the two coincide today, but a second one
// declared in the middle must still appear in the middle.
const declaredAt = new Map(CHECKS.map((check, index) => [check.script, index]));
results.sort((a, b) => declaredAt.get(a.script) - declaredAt.get(b.script));

const failures = results.filter((result) => result.status === 'FAILED');

// The duration goes AFTER the script name, so the status stays adjacent to
// what it is the status of. A test asserts that adjacency, and it is right to:
// `skipped  check-links.mjs` is the line a reader scans for before publishing,
// and a column wedged into the middle of it is a worse report, not a better.
console.log('\n--- summary ---');
for (const result of results)
  console.log(
    `  ${result.status.padEnd(8)} ${result.ms == null ? result.script : `${result.script.padEnd(20)} ${String(result.ms).padStart(6)} ms`}`,
  );

if (offline) console.log('\n  --offline: check-links.mjs was skipped; run it before publishing.');

if (failures.length === 0) {
  console.log(`\nOK: ${results.filter((r) => r.status === 'passed').length} check(s) passed.`);
} else {
  console.error(`\n${failures.length} check(s) FAILED: ${failures.map((f) => f.script).join(', ')}`);
  process.exitCode = 1;
}
