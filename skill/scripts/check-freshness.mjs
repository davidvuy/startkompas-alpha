#!/usr/bin/env node
// Jurisdiction packs rot silently: thresholds move, obligations phase in,
// portals move URLs. A stale pack is worse than a missing one, because it
// still reads as authoritative. This makes staleness loud.
//
//   node scripts/check-freshness.mjs            exits 1 if any pack is stale
//   node scripts/check-freshness.mjs --json     machine output
//   node scripts/check-freshness.mjs --report   never fails, for informational runs

import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

import {packsDir} from './lib/paths.mjs';
import {createReport} from './lib/report.mjs';

// The limit set by references/jurisdictions/README.md.
const STALE_AFTER_DAYS = 183;
const DUE_SOON_DAYS = 30;

const args = new Set(process.argv.slice(2));
const today = new Date(new Date().toISOString().slice(0, 10));
const daysBetween = (later, earlier) => Math.round((later - earlier) / 86400000);

if (!existsSync(packsDir)) {
  console.error('No references/jurisdictions directory.');
  process.exit(1);
}

const packs = readdirSync(packsDir)
  .filter((file) => file.endsWith('.md') && file !== 'README.md')
  .sort();

/** Pull the dated markers a pack is required to carry. */
function inspect(file) {
  const text = readFileSync(join(packsDir, file), 'utf8');
  const dates = (pattern) => [...text.matchAll(pattern)].map((m) => m[1]).sort();

  const due = /Next full recheck due:\s*\*\*(\d{4}-\d{2}-\d{2})\*\*/.exec(text)?.[1] ?? null;
  const checked = dates(/\[checked (\d{4}-\d{2}-\d{2})/g);
  const carried = dates(/\[carried (\d{4}-\d{2}-\d{2})/g);

  const entry = {
    pack: file,
    recheck_due: due,
    newest_checked: checked.at(-1) ?? null,
    oldest_checked: checked[0] ?? null,
    oldest_carried: carried[0] ?? null,
    open_topics: (text.match(/\[not researched\]/g) ?? []).length,
    problems: [],
    warnings: [],
  };

  if (!due) {
    entry.problems.push('no "Next full recheck due" date');
  } else {
    const remaining = daysBetween(new Date(due), today);
    if (remaining < 0) entry.problems.push(`recheck overdue by ${-remaining} days (due ${due})`);
    else if (remaining <= DUE_SOON_DAYS) entry.warnings.push(`recheck due in ${remaining} days`);
  }

  if (!entry.oldest_checked) {
    entry.problems.push('no [checked YYYY-MM-DD] claim at all');
  } else {
    const age = daysBetween(today, new Date(entry.oldest_checked));
    if (age > STALE_AFTER_DAYS)
      entry.problems.push(
        `oldest verified claim is ${age} days old (${entry.oldest_checked}); limit is ${STALE_AFTER_DAYS}`,
      );
  }

  if (entry.oldest_carried) {
    const age = daysBetween(today, new Date(entry.oldest_carried));
    entry.warnings.push(`carries unrefetched claims from ${entry.oldest_carried} (${age} days old)`);
  }

  if (entry.open_topics > 0)
    entry.warnings.push(`${entry.open_topics} topic(s) marked [not researched]`);

  return entry;
}

const inspected = packs.map(inspect);
const stale = inspected.filter((entry) => entry.problems.length);
const openTotal = inspected.reduce((sum, entry) => sum + entry.open_topics, 0);
const asOf = today.toISOString().slice(0, 10);

if (args.has('--json')) {
  console.log(JSON.stringify({today: asOf, packs: inspected}, null, 2));
  if (stale.length && !args.has('--report')) process.exitCode = 1;
} else {
  console.log(`Pack freshness as at ${asOf}\n`);

  for (const entry of inspected) {
    const state = entry.problems.length ? 'STALE' : entry.warnings.length ? 'watch' : 'ok';
    console.log(`${state.padEnd(6)} ${entry.pack}`);
    console.log(
      `       recheck due ${entry.recheck_due ?? '—'} · verified ${entry.oldest_checked ?? '—'} to ${entry.newest_checked ?? '—'}`,
    );
    for (const problem of entry.problems) console.log(`       ! ${problem}`);
    for (const warning of entry.warnings) console.log(`       - ${warning}`);
  }

  const report = createReport({
    ok: `${inspected.length} pack(s), ${openTotal} open topic(s) named, none stale.`,
  });
  for (const entry of stale)
    for (const problem of entry.problems) report.fail(entry.pack, problem);

  console.log();
  if (args.has('--report')) {
    console.log(`${inspected.length} pack(s), ${openTotal} open topic(s), ${stale.length} stale.`);
  } else {
    report.finish();
  }
}
