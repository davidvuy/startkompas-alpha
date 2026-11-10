#!/usr/bin/env node
// Runs every check in one go. This is the command to use; the individual
// scripts exist for when you want one check's detail.
//
//   node scripts/check-all.mjs              all checks
//   node scripts/check-all.mjs --offline    skip the one check that needs the network
//   node scripts/check-all.mjs --quiet      summary only
//
// Exits 1 if any check fails.

import {spawnSync} from 'node:child_process';
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

const results = [];

for (const check of CHECKS) {
  if (offline && check.network) {
    results.push({...check, status: 'skipped'});
    continue;
  }

  if (!quiet) console.log(`\n=== ${check.script} — ${check.proves} ===`);

  const run = spawnSync(process.execPath, check.argv ?? [join(scriptsDir, check.script)], {
    stdio: quiet ? 'pipe' : 'inherit',
    shell: false,
    windowsHide: true,
  });

  // A signal or spawn error is a failure, not a pass with no exit code.
  const failed = run.error != null || run.signal != null || run.status !== 0;
  results.push({...check, status: failed ? 'FAILED' : 'passed'});

  if (quiet && failed) {
    process.stdout.write(run.stdout?.toString() ?? '');
    process.stderr.write(run.stderr?.toString() ?? '');
  }
}

const failures = results.filter((result) => result.status === 'FAILED');

console.log('\n--- summary ---');
for (const result of results) console.log(`  ${result.status.padEnd(8)} ${result.script}`);

if (offline) console.log('\n  --offline: check-links.mjs was skipped; run it before publishing.');

if (failures.length === 0) {
  console.log(`\nOK: ${results.filter((r) => r.status === 'passed').length} check(s) passed.`);
} else {
  console.error(`\n${failures.length} check(s) FAILED: ${failures.map((f) => f.script).join(', ')}`);
  process.exitCode = 1;
}
