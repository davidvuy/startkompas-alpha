#!/usr/bin/env node
// Backlog items 61, 62: a dead official URL in a jurisdiction pack is a silent
// correctness failure. A 403 is not the same as dead, so it is reported and
// does not fail the run.
// Standard library only (Node's global fetch).
//
//   node scripts/check-links.mjs            human report
//   node scripts/check-links.mjs --json     machine output
//
// Exit 1 only when a URL is genuinely gone (404/410) or the host does not resolve.

import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join, dirname, resolve, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const TIMEOUT_MS = 15000;
const CONCURRENCY = 6;

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const json = process.argv.includes('--json');

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (full.endsWith('.md')) out.push(full);
  }
  return out;
}

// url -> [files that cite it]
const citations = new Map();
for (const file of walk(root)) {
  const text = readFileSync(file, 'utf8');
  for (const [, url] of text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
    const clean = url.replace(/[.,;]$/, '');
    if (!citations.has(clean)) citations.set(clean, []);
    citations.get(clean).push(relative(root, file).split(sep).join('/'));
  }
}

async function probe(url) {
  const attempt = async (method) => {
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
  };

  try {
    let response = await attempt('HEAD');
    // Some official portals reject HEAD outright; retry those with GET.
    if (response.status === 405 || response.status === 501) response = await attempt('GET');

    const {status} = response;
    if (status >= 200 && status < 300) return {state: 'ok', status};
    if (status >= 300 && status < 400)
      return {state: 'redirect', status, location: response.headers.get('location')};
    if (status === 404 || status === 410) return {state: 'dead', status};
    if (status === 401 || status === 403 || status === 429)
      return {state: 'blocked', status}; // reported, not a failure
    return {state: 'other', status};
  } catch (error) {
    const dns = /ENOTFOUND|EAI_AGAIN|ERR_NAME/.test(String(error?.cause ?? error));
    return {state: dns ? 'dead' : 'unreachable', error: String(error?.cause?.code ?? error.name)};
  }
}

const urls = [...citations.keys()].sort();
const results = [];
for (let i = 0; i < urls.length; i += CONCURRENCY) {
  const batch = urls.slice(i, i + CONCURRENCY);
  const settled = await Promise.all(batch.map((u) => probe(u).then((r) => ({url: u, ...r}))));
  results.push(...settled);
}

const dead = results.filter((r) => r.state === 'dead');
const order = {dead: 0, unreachable: 1, blocked: 2, redirect: 3, other: 4, ok: 5};
results.sort((a, b) => order[a.state] - order[b.state] || a.url.localeCompare(b.url));

if (json) {
  console.log(JSON.stringify({checked: results.length, dead: dead.length, results}, null, 2));
} else {
  for (const r of results) {
    if (r.state === 'ok') continue;
    console.log(`${r.state.padEnd(12)} ${r.status ?? r.error ?? ''}  ${r.url}`);
    if (r.location) console.log(`             -> ${r.location}`);
    for (const f of citations.get(r.url)) console.log(`             cited in ${f}`);
  }
  const ok = results.filter((r) => r.state === 'ok').length;
  console.log(`\n${results.length} URL(s): ${ok} ok, ${dead.length} dead.`);
  if (dead.length === 0 && ok < results.length)
    console.log('Non-ok entries above are reported, not failures — 403 and redirects are common on official portals.');
}

if (dead.length) process.exitCode = 1;
