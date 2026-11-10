#!/usr/bin/env node
// Backlog items 63, 64: jurisdiction packs rot silently. This makes it loud.
// Standard library only.
//
//   node scripts/check-freshness.mjs            human report, exits 1 if overdue
//   node scripts/check-freshness.mjs --json     machine output
//   node scripts/check-freshness.mjs --report   never fails, for informational runs

import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {join, dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const STALE_AFTER_DAYS = 183; // ~6 months, per jurisdictions/README.md
const DUE_SOON_DAYS = 30;

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packDir = join(root, 'references', 'jurisdictions');
const args = new Set(process.argv.slice(2));
const today = new Date(new Date().toISOString().slice(0, 10));

const days = (a, b) => Math.round((a - b) / 86400000);

if (!existsSync(packDir)) {
  console.error('No references/jurisdictions directory.');
  process.exitCode = 1;
} else {
  const packs = readdirSync(packDir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort();

  const report = [];

  for (const file of packs) {
    const text = readFileSync(join(packDir, file), 'utf8');

    const dueMatch = /Next full recheck due:\s*\*\*(\d{4}-\d{2}-\d{2})\*\*/.exec(text);
    const checked = [...text.matchAll(/\[checked (\d{4}-\d{2}-\d{2})/g)].map((m) => m[1]).sort();
    const carried = [...text.matchAll(/\[carried (\d{4}-\d{2}-\d{2})/g)].map((m) => m[1]).sort();
    const notResearched = (text.match(/\[not researched\]/g) ?? []).length;

    const entry = {
      pack: file,
      recheck_due: dueMatch?.[1] ?? null,
      newest_checked: checked.at(-1) ?? null,
      oldest_checked: checked[0] ?? null,
      oldest_carried: carried[0] ?? null,
      open_topics: notResearched,
      problems: [],
      warnings: [],
    };

    if (!entry.recheck_due) entry.problems.push('no "Next full recheck due" date');
    else {
      const d = days(new Date(entry.recheck_due), today);
      if (d < 0) entry.problems.push(`recheck overdue by ${-d} days (due ${entry.recheck_due})`);
      else if (d <= DUE_SOON_DAYS) entry.warnings.push(`recheck due in ${d} days`);
    }

    if (!entry.oldest_checked) entry.problems.push('no [checked YYYY-MM-DD] claim at all');
    else {
      const age = days(today, new Date(entry.oldest_checked));
      if (age > STALE_AFTER_DAYS)
        entry.problems.push(
          `oldest verified claim is ${age} days old (${entry.oldest_checked}); limit is ${STALE_AFTER_DAYS}`,
        );
    }

    if (entry.oldest_carried) {
      const age = days(today, new Date(entry.oldest_carried));
      entry.warnings.push(
        `carries unrefetched claims from ${entry.oldest_carried} (${age} days old)`,
      );
    }

    if (entry.open_topics > 0)
      entry.warnings.push(`${entry.open_topics} topic(s) marked [not researched]`);

    report.push(entry);
  }

  const overdue = report.filter((r) => r.problems.length);

  if (args.has('--json')) {
    console.log(JSON.stringify({today: today.toISOString().slice(0, 10), packs: report}, null, 2));
  } else {
    console.log(`Pack freshness as at ${today.toISOString().slice(0, 10)}\n`);
    for (const r of report) {
      const state = r.problems.length ? 'STALE' : r.warnings.length ? 'watch' : 'ok';
      console.log(`${state.padEnd(6)} ${r.pack}`);
      console.log(`       recheck due ${r.recheck_due ?? '—'} · verified ${r.oldest_checked ?? '—'} to ${r.newest_checked ?? '—'}`);
      for (const p of r.problems) console.log(`       ! ${p}`);
      for (const w of r.warnings) console.log(`       - ${w}`);
    }
    const openTotal = report.reduce((n, r) => n + r.open_topics, 0);
    console.log(`\n${report.length} pack(s), ${openTotal} open topic(s), ${overdue.length} stale.`);
  }

  if (overdue.length && !args.has('--report')) process.exitCode = 1;
}
