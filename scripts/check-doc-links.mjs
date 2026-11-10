#!/usr/bin/env node
// The repository's markdown cross-links heavily: the README points into skill/,
// CONTRIBUTING points into docs/ and skill/, docs/README.md indexes 53 files,
// and the skill's own docs point back out. Nothing checked any of it.
//
//   node scripts/check-doc-links.mjs
//
// Validates every RELATIVE markdown link in the repository, outside
// node_modules and .git, including the #anchor half: a link to a heading that
// has been renamed lands silently at the top of the document, which is the one
// kind of broken link a reader does not notice. External URLs are the skill's
// own skill/scripts/check-links.mjs — this one is purely about local paths, so
// it needs no network and is safe to run anywhere.
//
// Standard library only.

import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

// Normally the repository this script lives in. `STARTKOMPAS_REPO_ROOT`
// overrides it so check-doc-links.test.mjs can point it at a fixture tree with
// a deliberately broken link — otherwise the only tree it could ever examine is
// the correct one, and nothing would show that it fails when it should.
// It is a test seam: no shipped code path sets it.
const repoRoot = process.env.STARTKOMPAS_REPO_ROOT
  ? resolve(process.env.STARTKOMPAS_REPO_ROOT)
  : resolve(dirname(fileURLToPath(import.meta.url)), '..');

const SKIP_DIRS = new Set(['node_modules', '.git']);

function markdownFiles(dir) {
  const found = [];
  for (const entry of readdirSync(dir).sort()) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...markdownFiles(full));
    else if (entry.endsWith('.md')) found.push(full);
  }
  return found;
}

const toPosix = (path) => path.split(sep).join('/');

/**
 * GitHub's heading slug: lowercase, drop punctuation, each space becomes a
 * hyphen.
 *
 * "Each", not "each run". GitHub replaces spaces one for one, so the em dash in
 * `## 2. VAT — the national scheme` is removed and the two spaces around it
 * leave `2-vat--the-national-scheme` with a double hyphen. Collapsing runs
 * produced a single hyphen and would have rejected a correct link to every
 * pack heading of that shape — a false positive on the real content, which is
 * how a checker gets switched off.
 */
const slug = (heading) =>
  heading
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\- ]/g, '')
    .trim()
    .replace(/\s/g, '-');

/**
 * Every anchor a markdown file offers: one per heading, plus any explicit
 * `<a id="...">` target. The packs and the backlog both use explicit ids for
 * stable links to numbered items.
 */
function anchorsOf(file) {
  const text = readFileSync(file, 'utf8');
  const found = new Set();
  let inFence = false;

  for (const line of text.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const heading = /^#{1,6}\s+(.*\S)\s*$/.exec(line);
    if (!heading) continue;

    const base = slug(heading[1]);
    found.add(base);
    // GitHub disambiguates repeated headings as name-1, name-2, …
    for (let i = 1; i <= 3; i += 1) found.add(`${base}-${i}`);
  }

  for (const [, id] of text.matchAll(/<a\s+(?:id|name)="([^"]+)"/g)) found.add(id.toLowerCase());
  return found;
}

const anchorCache = new Map();
function anchors(file) {
  if (!anchorCache.has(file)) anchorCache.set(file, anchorsOf(file));
  return anchorCache.get(file);
}

const problems = [];
const files = markdownFiles(repoRoot);
let linkCount = 0;
let anchorCount = 0;

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const from = toPosix(relative(repoRoot, file));

  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    // External links are the skill's own check-links.mjs.
    if (/^(https?:|mailto:)/.test(target)) continue;

    const [path, fragment] = target.split('#');

    // A pure in-page anchor still has to point at something in this file.
    if (!path) {
      if (!fragment) continue;
      anchorCount++;
      if (!anchors(file).has(fragment.toLowerCase()))
        problems.push(`${from} -> ${target} (no such heading or id in this file)`);
      continue;
    }

    linkCount++;
    const resolved = resolve(dirname(file), path);

    if (!existsSync(resolved)) {
      problems.push(`${from} -> ${target}`);
      continue;
    }
    // A link to a directory only works if it resolves to a README.
    if (statSync(resolved).isDirectory() && !existsSync(join(resolved, 'README.md'))) {
      problems.push(`${from} -> ${target} (directory with no README.md)`);
      continue;
    }

    // The file is there; a fragment has to be there too, or the link lands at
    // the top of the document and quietly loses the reader's place. This is how
    // a renamed heading breaks a cross-reference with nothing to show for it.
    if (fragment && resolved.endsWith('.md')) {
      anchorCount++;
      if (!anchors(resolved).has(fragment.toLowerCase()))
        problems.push(`${from} -> ${target} (file exists, but it has no such heading or id)`);
    }
  }
}

console.log(
  `${files.length} markdown file(s), ${linkCount} relative link(s) and ${anchorCount} anchor(s) checked.`,
);

if (problems.length === 0) {
  console.log('\nOK: every relative markdown link in the repository resolves.');
} else {
  console.error(`\n${problems.length} dead link(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exitCode = 1;
}
