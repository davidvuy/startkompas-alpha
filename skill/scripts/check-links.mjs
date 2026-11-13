#!/usr/bin/env node
// A dead official URL in a jurisdiction pack is a silent correctness failure:
// the claim stays, its evidence does not.
//
//   node scripts/check-links.mjs            human report
//   node scripts/check-links.mjs --json     machine output
//
// Fails ONLY on a URL that is genuinely gone (404/410) or a host that does not
// resolve. A 403, a redirect or a timeout is reported as a warning, because
// official portals do all three routinely — Légifrance 403s every bot.
//
// The two parts worth testing live in lib/: which URLs get probed at all
// (citations.mjs) and what each response means (probe.mjs). This file is the
// CLI that joins them.

import {readFileSync} from 'node:fs';

import {skillRoot} from './lib/paths.mjs';
import {listFiles, relativePosix} from './lib/files.mjs';
import {createReport} from './lib/report.mjs';
import {mapPool} from './lib/pool.mjs';
import {harvestCitations} from './lib/citations.mjs';
import {probeUrl, STATE_ORDER} from './lib/probe.mjs';
import {statedStatuteVersions, currentVersion} from './lib/statutes.mjs';

// One worker per URL would hammer a handful of government hosts; serial would
// take a minute. Eight hosts at a time, and never two requests to the same
// host at once.
//
// The per-host bound is not politeness for its own sake. Measured on the real
// citation set on 2026-11-12, with eight unbounded workers over URLs sorted by
// URL: `gesetze-im-internet.de` holds 23 of the 114 and answered five of them
// with ECONNRESET, so two consecutive runs disagreed about which sources were
// reachable — the report stated as fact something that changed per run. With
// one request per host the same set came back identical twice, and the cost is
// about two seconds, all of it one Justel URL whose six siblings now queue
// behind it. See scripts/README.md, "What makes check-links slow".
const CONCURRENCY = 8;
const PER_HOST = 1;

/** Group by host, so the bound above applies per government portal. */
const hostOf = (url) => {
  try {
    return new URL(url).host;
  } catch {
    // harvestCitations only yields http(s) URLs, but a malformed one must not
    // take the whole run down: give it a lane of its own.
    return url;
  }
};

const asJson = process.argv.includes('--json');

const documents = listFiles(skillRoot, {ext: '.md'}).map((file) => ({
  label: relativePosix(skillRoot, file),
  text: readFileSync(file, 'utf8'),
}));

const citations = harvestCitations(documents);

const urls = [...citations.keys()].sort();
const results = await mapPool(
  urls,
  CONCURRENCY,
  async (url) => ({url, ...(await probeUrl(url))}),
  {keyOf: hostOf, keyLimit: PER_HOST},
);

results.sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state] || a.url.localeCompare(b.url));

const dead = results.filter((result) => result.state === 'dead');
const okCount = results.filter((result) => result.state === 'ok').length;

// --- Are the dated statute readings still the versions in force? ------------
//
// Cheap, because the portal answers it with a redirect: the undated
// /BWBR<id> points at the version in force today. Probed with the same pool
// and the same per-host bound, so this adds one request per statute to one
// host already in the queue.

const stated = statedStatuteVersions(documents);
const statutes = [...stated.statutes.values()].sort((a, b) => a.base.localeCompare(b.base));
const versionProbes = await mapPool(
  statutes,
  CONCURRENCY,
  async (statute) => ({statute, current: currentVersion(statute.id, await probeUrl(statute.base))}),
  {keyOf: (statute) => hostOf(statute.base), keyLimit: PER_HOST},
);

/** One entry per cited version that is not the version in force. */
const stale = [];
/** Statutes whose current version the portal did not disclose. */
const undisclosed = [];

for (const {statute, current} of versionProbes) {
  if (!current) {
    undisclosed.push(statute);
    continue;
  }
  for (const [cited, documents] of statute.versions) {
    if (cited !== current) stale.push({statute, cited, current, documents});
  }
}
stale.sort((a, b) => a.statute.base.localeCompare(b.statute.base) || a.cited.localeCompare(b.cited));

if (asJson) {
  console.log(
    JSON.stringify(
      {
        checked: results.length,
        dead: dead.length,
        results,
        statutes: {
          checked: statutes.length,
          stale: stale.map(({statute, cited, current, documents}) => ({
            statute: statute.id,
            cited,
            current,
            documents,
          })),
          undisclosed: undisclosed.map((statute) => statute.id),
          unversioned: stated.unversioned,
        },
      },
      null,
      2,
    ),
  );
  if (dead.length) process.exitCode = 1;
} else {
  const report = createReport({
    ok: `${results.length} cited URL(s) checked, ${okCount} live, none gone; ${statutes.length} statute reading(s) still the version in force.`,
  });
  report.note(`${results.length} URL(s): ${okCount} ok, ${dead.length} dead`);
  report.note(
    `${statutes.length} versioned statute(s) on wetten.overheid.nl: ${stale.length} not the version in force, ${undisclosed.length} undisclosed, ${stated.unversioned.length} citation(s) state no version`,
  );

  for (const result of results) {
    if (result.state === 'ok') continue;
    const detail = [
      `${result.state} ${result.status ?? result.error ?? ''}`.trim(),
      result.location ? `-> ${result.location}` : null,
      `cited in ${citations.get(result.url).join(', ')}`,
    ]
      .filter(Boolean)
      .join('  ');

    if (result.state === 'dead') report.fail(result.url, detail);
    else report.warn(result.url, detail);
  }

  // Warned, never failed. A pack may cite a historical version on purpose,
  // next to a `Withdrawn` row, and an amendment may not touch the articles
  // that were read. What the maintainer needs is the pair of dates and the
  // file to reread — not a red build they have to override.
  for (const {statute, cited, current, documents} of stale) {
    report.warn(
      statute.id,
      `cited as ${cited}, in force is ${current} — reread the articles quoted in ${documents.join(', ')}`,
    );
  }
  for (const statute of undisclosed) {
    report.warn(
      statute.id,
      `the portal did not disclose a current version for ${statute.base}, so the cited date(s) ${[...statute.versions.keys()].join(', ')} could not be compared`,
    );
  }

  report.finish();
}
