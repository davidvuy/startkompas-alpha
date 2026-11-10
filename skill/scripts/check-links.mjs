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

import {readFileSync} from 'node:fs';

import {skillRoot} from './lib/paths.mjs';
import {listFiles, relativePosix} from './lib/files.mjs';
import {createReport} from './lib/report.mjs';

const TIMEOUT_MS = 15000;
const CONCURRENCY = 6;

const asJson = process.argv.includes('--json');

// url -> files that cite it
const citations = new Map();
for (const file of listFiles(skillRoot, {ext: '.md'})) {
  const text = readFileSync(file, 'utf8');
  for (const [, url] of text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
    const clean = url.replace(/[.,;]$/, '');
    if (!citations.has(clean)) citations.set(clean, []);
    citations.get(clean).push(relativePosix(skillRoot, file));
  }
}

/** One HTTP attempt with a hard timeout. Redirects are not followed. */
async function attempt(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method,
      redirect: 'manual',
      signal: controller.signal,
      headers: {'user-agent': 'startkompas-link-check'},
    });
  } finally {
    clearTimeout(timer);
  }
}

async function probe(url) {
  try {
    let response = await attempt(url, 'HEAD');
    // Some official portals reject HEAD outright; retry those with GET.
    if (response.status === 405 || response.status === 501) response = await attempt(url, 'GET');

    const {status} = response;
    if (status >= 200 && status < 300) return {state: 'ok', status};
    if (status >= 300 && status < 400)
      return {state: 'redirect', status, location: response.headers.get('location')};
    if (status === 404 || status === 410) return {state: 'dead', status};
    if (status === 401 || status === 403 || status === 429) return {state: 'blocked', status};
    return {state: 'other', status};
  } catch (error) {
    const cause = String(error?.cause ?? error);
    const unresolvable = /ENOTFOUND|EAI_AGAIN|ERR_NAME/.test(cause);
    return {
      state: unresolvable ? 'dead' : 'unreachable',
      error: String(error?.cause?.code ?? error.name),
    };
  }
}

const urls = [...citations.keys()].sort();
const results = [];
for (let i = 0; i < urls.length; i += CONCURRENCY) {
  const batch = urls.slice(i, i + CONCURRENCY);
  results.push(...(await Promise.all(batch.map((url) => probe(url).then((r) => ({url, ...r}))))));
}

const STATE_ORDER = {dead: 0, unreachable: 1, blocked: 2, redirect: 3, other: 4, ok: 5};
results.sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state] || a.url.localeCompare(b.url));

const dead = results.filter((r) => r.state === 'dead');
const okCount = results.filter((r) => r.state === 'ok').length;

if (asJson) {
  console.log(JSON.stringify({checked: results.length, dead: dead.length, results}, null, 2));
  if (dead.length) process.exitCode = 1;
} else {
  const report = createReport({ok: `${results.length} cited URL(s) checked, ${okCount} live, none gone.`});
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
