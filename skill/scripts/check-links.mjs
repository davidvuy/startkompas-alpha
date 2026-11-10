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

// One worker per URL would hammer a handful of government hosts; serial would
// take a minute. Eight keeps the run under a couple of seconds.
const CONCURRENCY = 8;

const asJson = process.argv.includes('--json');

const citations = harvestCitations(
  listFiles(skillRoot, {ext: '.md'}).map((file) => ({
    label: relativePosix(skillRoot, file),
    text: readFileSync(file, 'utf8'),
  })),
);

const urls = [...citations.keys()].sort();
const results = await mapPool(urls, CONCURRENCY, async (url) => ({
  url,
  ...(await probeUrl(url)),
}));

results.sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state] || a.url.localeCompare(b.url));

const dead = results.filter((result) => result.state === 'dead');
const okCount = results.filter((result) => result.state === 'ok').length;

if (asJson) {
  console.log(JSON.stringify({checked: results.length, dead: dead.length, results}, null, 2));
  if (dead.length) process.exitCode = 1;
} else {
  const report = createReport({
    ok: `${results.length} cited URL(s) checked, ${okCount} live, none gone.`,
  });
  report.note(`${results.length} URL(s): ${okCount} ok, ${dead.length} dead`);

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

  report.finish();
}
