#!/usr/bin/env node
// The eval cases encode specific dates and figures from the packs. If a pack is
// edited and one of those facts moves, the case silently starts testing the
// wrong thing. This asserts the string-checkable half, so drift fails loudly.
//
// This checks CONSISTENCY between the packs and the cases. It does NOT check
// that any fact is true in the world — only a recheck against the primary
// source does that. See check-freshness.mjs for staleness.
//
// When this fails, exactly one of two things is true:
//   - the pack improved and the eval case must be rewritten, or
//   - the edit was a mistake.
// Decide which. Do not silence the assertion to make the build green.
//
//   node scripts/check-facts.mjs
//
// The assertions themselves, and the matcher, are in lib/facts.mjs so that both
// can be tested directly. This file is only the CLI around them.

import {readFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';

import {packsDir, skillRoot} from './lib/paths.mjs';
import {createReport} from './lib/report.mjs';
import {evaluate} from './lib/facts.mjs';

const report = createReport({
  ok: 'every fact the eval cases encode is still present and no reversed claim has returned.',
});

const {checked, packs, problems} = evaluate((pack) => {
  // A plain filename is a jurisdiction pack. A name containing a slash is a
  // path from the skill root, so the same table can assert the METHOD
  // references too. Those decide whether a pack is ever opened, and until
  // 2026-11-12 nothing guarded them: a verified layer nothing routes to is
  // worth exactly nothing.
  const path = pack.includes('/') ? join(skillRoot, pack) : join(packsDir, pack);
  return existsSync(path) ? readFileSync(path, 'utf8') : null;
});

for (const {pack, message} of problems) report.fail(pack, message);

report.note(`${checked} fact assertion(s) checked across ${packs.length} file(s)`);

if (!report.finish())
  console.error('\nEither the pack improved and the eval case must be rewritten, or the edit was a mistake.');
