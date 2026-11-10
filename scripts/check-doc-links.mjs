#!/usr/bin/env node
// The repository's markdown cross-links heavily: the README points into skill/,
// CONTRIBUTING points into docs/ and skill/, docs/README.md indexes 53 files,
// and the skill's own docs point back out. Nothing checked any of it.
//
//   node scripts/check-doc-links.mjs
//
// Validates every RELATIVE markdown link in the repository, outside
// node_modules and .git. External URLs are the skill's own
// skill/scripts/check-links.mjs — this one is purely about local paths, so it
// needs no network and is safe to run anywhere.
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
const problems = [];
const files = markdownFiles(repoRoot);
let linkCount = 0;

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const from = toPosix(relative(repoRoot, file));

  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    // External links and pure in-page anchors are not this check's business.
    if (/^(https?:|mailto:|#)/.test(target)) continue;

    const [path] = target.split('#');
    if (!path) continue;

    linkCount++;
    const resolved = resolve(dirname(file), path);

    if (!existsSync(resolved)) {
      problems.push(`${from} -> ${target}`);
      continue;
    }
    // A link to a directory only works if it resolves to a README.
    if (statSync(resolved).isDirectory() && !existsSync(join(resolved, 'README.md')))
      problems.push(`${from} -> ${target} (directory with no README.md)`);
  }
}

console.log(`${files.length} markdown file(s), ${linkCount} relative link(s) checked.`);

if (problems.length === 0) {
  console.log('\nOK: every relative markdown link in the repository resolves.');
} else {
  console.error(`\n${problems.length} dead link(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exitCode = 1;
}
