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

// The Status vocabulary, defined in references/jurisdictions/README.md under
// "The Status column is a fixed vocabulary". Every maintenance row's Status
// cell starts with one of these, optionally followed by " — " and prose.
//
// Before this was a fixed list, the column was free text: 180 rows carried
// about 90 distinct phrasings for the same handful of states, and this file
// matched one of them literally — so half the open rows were invisible to it.
// Changing the list here without changing the README leaves the two out of
// step; the README is the explanation, this is the enforcement.
const STATUS_LABELS = [
  'Primary',
  'Authority',
  'Secondary',
  'Unconfirmed',
  'Withdrawn',
  'Open',
  'Elsewhere',
];

/**
 * The `[date, status]` pair of every row in a pack's maintenance table.
 *
 * Returns null when the pack has no such table at all, which is a separate
 * failure from having one whose rows are malformed.
 *
 * @param {string} text
 * @returns {Array<{date: string, status: string}> | null}
 */
function maintenanceRows(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => /^## Pack maintenance/.test(line));
  if (start < 0) return null;

  const rows = [];
  for (const line of lines.slice(start)) {
    if (!line.startsWith('|')) continue;
    // Unescaped pipes only, the same rule check-markdown.mjs applies, so a
    // cell containing `\|` is not mistaken for a column boundary.
    const cells = line.split(/(?<!\\)\|/).slice(1, -1).map((cell) => cell.trim());
    if (cells.length !== 3) continue;
    if (cells[2] === 'Status' || /^-+$/.test(cells[2])) continue;
    rows.push({date: cells[1], status: cells[2]});
  }
  return rows;
}

/** The vocabulary label a Status cell opens with, or null if it opens with none. */
function labelOf(status) {
  return STATUS_LABELS.find((label) => status === label || status.startsWith(`${label} —`)) ?? null;
}

const args = new Set(process.argv.slice(2));
const today = new Date(new Date().toISOString().slice(0, 10));
const daysBetween = (later, earlier) => Math.round((later - earlier) / 86400000);

/**
 * Parse `YYYY-MM-DD`, returning null for a date that cannot exist.
 *
 * The markers are matched with `\d{4}-\d{2}-\d{2}`, which happily accepts
 * 2027-13-45. `new Date` makes that an Invalid Date, every comparison against
 * NaN is false, and the pack then reports as perfectly fresh for ever — a typo
 * in the one field that exists to make staleness loud would have silenced it.
 * The round-trip is what rejects 2027-02-30 as well as 2027-13-45.
 *
 * @param {string} text
 * @returns {Date | null}
 */
function parseIsoDate(text) {
  const date = new Date(`${text}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10) === text ? date : null;
}

if (!existsSync(packsDir)) {
  console.error('No references/jurisdictions directory.');
  process.exit(1);
}

const packs = readdirSync(packsDir)
  .filter((file) => file.endsWith('.md') && file !== 'README.md')
  .sort();

/** Pull the dated markers a pack is required to carry. */
function inspect(file) {
  const raw = readFileSync(join(packsDir, file), 'utf8');

  // The "Verification convention:" line DEFINES the markers, so it mentions
  // every one of them. Counting it as an instance inflated each pack's open
  // topics by one — the totals reported in commits and in the backlog were all
  // one per pack too high — and worse, it meant a pack that closed its last
  // open topic would fail the drift check: one marker in the body, no row in
  // the table. The legend has to be excluded before anything is counted.
  const text = raw
    .split(/\r?\n/)
    .filter((line) => !/^Verification convention:/.test(line))
    .join('\n');

  const dates = (pattern) => [...text.matchAll(pattern)].map((m) => m[1]).sort();

  const due = /Next full recheck due:\s*\*\*(\d{4}-\d{2}-\d{2})\*\*/.exec(text)?.[1] ?? null;
  const checked = dates(/\[checked (\d{4}-\d{2}-\d{2})/g);
  const carried = dates(/\[carried (\d{4}-\d{2}-\d{2})/g);

  // The body marks gaps inline; the maintenance table lists them as rows. They
  // drift — a topic gets researched, the prose is updated, the row is not. The
  // two counts are not 1:1 (one sentence can cover several rows, and a pack may
  // list a row for a question that is open by nature and carries no marker), so
  // a mismatch is reported rather than failed. Zero on one side and not the
  // other is unambiguous drift, and that does fail.
  const bodyMarkers = (text.match(/\[not researched\]/g) ?? []).length;
  const rows = maintenanceRows(text);
  const tableRows = (rows ?? []).filter((row) => labelOf(row.status) === 'Open').length;

  const entry = {
    pack: file,
    recheck_due: due,
    newest_checked: checked.at(-1) ?? null,
    oldest_checked: checked[0] ?? null,
    oldest_carried: carried[0] ?? null,
    open_topics: bodyMarkers,
    open_rows: tableRows,
    status_labels: {},
    problems: [],
    warnings: [],
  };

  // The vocabulary. An unrecognised label is a hard failure: the column exists
  // to be scanned and counted, and one row written in prose silently drops out
  // of every count taken from it — including the open-topic drift check below.
  if (rows === null) {
    entry.problems.push('no "## Pack maintenance" table');
  } else if (rows.length === 0) {
    entry.problems.push('the "## Pack maintenance" table has no rows');
  } else {
    for (const row of rows) {
      const label = labelOf(row.status);
      if (!label) {
        entry.problems.push(
          `status "${row.status}" does not start with one of ${STATUS_LABELS.join('/')} — see references/jurisdictions/README.md`,
        );
        continue;
      }
      entry.status_labels[label] = (entry.status_labels[label] ?? 0) + 1;

      // Two labels record no check in this pack and so carry no date: Open,
      // where the pack has no answer, and Elsewhere, where the answer and its
      // date live in the shared layer named in the detail. Every other label
      // asserts that something was read, which happened on a day.
      //
      // A dated Open row is usually one that has since been researched and
      // should now be Primary, Authority, Secondary or Unconfirmed. An
      // undated Unconfirmed row is the opposite mistake: it hides that a
      // source really was checked and really did fail to support the claim.
      const dateless = label === 'Open' || label === 'Elsewhere';
      if (dateless && row.date !== '—')
        entry.problems.push(`${label} row carries check date ${row.date}; ${label} rows take —`);
      if (!dateless && row.date === '—')
        entry.problems.push(`${label} row has no check date, which only Open and Elsewhere take`);
    }
  }

  if (bodyMarkers > 0 && tableRows === 0)
    entry.problems.push(
      `${bodyMarkers} [not researched] marker(s) in the body but no Open row in the maintenance table — the table is stale`,
    );
  if (tableRows > 0 && bodyMarkers === 0)
    entry.problems.push(
      `${tableRows} Open row(s) in the maintenance table but no [not researched] marker in the body — the table claims gaps the prose has closed`,
    );

  // Every date is validated before it is compared. An impossible one is
  // reported as impossible rather than silently making the pack look fresh.
  for (const marker of [...checked, ...carried]) {
    if (!parseIsoDate(marker))
      entry.problems.push(`"${marker}" is not a real date; check the marker that carries it`);
  }

  const dueDate = due ? parseIsoDate(due) : null;

  if (!due) {
    entry.problems.push('no "Next full recheck due" date');
  } else if (!dueDate) {
    entry.problems.push(`recheck due date "${due}" is not a real date`);
  } else {
    const remaining = daysBetween(dueDate, today);
    if (remaining < 0) entry.problems.push(`recheck overdue by ${-remaining} days (due ${due})`);
    else if (remaining <= DUE_SOON_DAYS) entry.warnings.push(`recheck due in ${remaining} days`);
  }

  const oldestChecked = entry.oldest_checked ? parseIsoDate(entry.oldest_checked) : null;

  if (!entry.oldest_checked) {
    entry.problems.push('no [checked YYYY-MM-DD] claim at all');
  } else if (oldestChecked) {
    const age = daysBetween(today, oldestChecked);
    if (age > STALE_AFTER_DAYS)
      entry.problems.push(
        `oldest verified claim is ${age} days old (${entry.oldest_checked}); limit is ${STALE_AFTER_DAYS}`,
      );
  }

  const oldestCarried = entry.oldest_carried ? parseIsoDate(entry.oldest_carried) : null;

  if (oldestCarried) {
    const age = daysBetween(today, oldestCarried);
    entry.warnings.push(`carries unrefetched claims from ${entry.oldest_carried} (${age} days old)`);
  }

  if (entry.open_topics > 0)
    entry.warnings.push(
      `${entry.open_topics} topic(s) marked [not researched] in the body, ${entry.open_rows} Open row(s) in the table`,
    );

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
