#!/usr/bin/env node
// Verifies that the skill is self-contained and host-neutral.
// Standard library only: the skill itself needs no runtime.

import {readFileSync, existsSync, readdirSync, statSync} from 'node:fs';
import {join, dirname, resolve, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const notes = [];

const fail = (file, message) => problems.push(`${file}: ${message}`);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(root);
const markdown = files.filter((f) => f.endsWith('.md'));
const rel = (f) => relative(root, f).split(sep).join('/');

// --- 1. SKILL.md frontmatter -------------------------------------------------

const skillPath = join(root, 'SKILL.md');
if (!existsSync(skillPath)) {
  fail('SKILL.md', 'missing; a skill must have SKILL.md at its root');
} else {
  const text = readFileSync(skillPath, 'utf8');
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) {
    fail('SKILL.md', 'no YAML frontmatter delimited by --- at the very start');
  } else {
    const block = match[1];
    const name = /^name:\s*(.+)$/m.exec(block)?.[1]?.trim();
    const description = /^description:\s*([\s\S]+?)(?=\r?\n[a-z_-]+:|$)/m
      .exec(block)?.[1]
      ?.trim();

    if (!name) fail('SKILL.md', 'frontmatter has no name');
    else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name))
      fail('SKILL.md', `name "${name}" must be lowercase letters, digits and single hyphens`);
    else if (name.length > 64) fail('SKILL.md', `name is ${name.length} chars, limit is 64`);

    if (!description) fail('SKILL.md', 'frontmatter has no description');
    else {
      if (description.length > 1024)
        fail('SKILL.md', `description is ${description.length} chars, limit is 1024`);
      if (description.length < 80)
        fail('SKILL.md', `description is only ${description.length} chars; too thin to route on`);
      else notes.push(`description: ${description.length} chars`);
      if (!/\buse\b/i.test(description))
        fail('SKILL.md', 'description does not say when to use the skill');
    }
  }
}

// --- 2. Relative links resolve ----------------------------------------------

for (const file of markdown) {
  const text = readFileSync(file, 'utf8');
  for (const [, target] of text.matchAll(/\]\(([^)\s#]+)(?:#[^)]*)?\)/g)) {
    if (/^(https?:|mailto:)/.test(target)) continue;
    const resolved = resolve(dirname(file), target);
    if (!existsSync(resolved)) fail(rel(file), `dead relative link -> ${target}`);
  }
}

// --- 3. No runtime dependency re-introduced ---------------------------------

const forbidden = [
  [/node\s+src\//, 'command into the removed Node runtime (node src/...)'],
  [/--runtime-root/, 'reference to the removed runtime resolver'],
  [/npm\s+(ci|install)/, 'dependency install step; the skill must need none'],
  [/\bmodules\/[a-z-]+\.md/, 'pointer to the old modules/ directory'],
  [/\(docs\/[a-z-]+\.md\)/, 'link into the old repository docs/ directory'],
  [/\bsrc\/[a-z-]+\.mjs/, 'reference to a runtime source file'],
];

const scoped = [skillPath, ...markdown.filter((f) => rel(f).startsWith('references/'))];
for (const file of scoped) {
  const text = readFileSync(file, 'utf8');
  for (const [pattern, why] of forbidden) {
    const hit = pattern.exec(text);
    if (hit) fail(rel(file), `${why} -> "${hit[0]}"`);
  }
}

// --- 4. Host neutrality ------------------------------------------------------

for (const file of scoped) {
  const text = readFileSync(file, 'utf8');
  for (const host of ['Codex', 'Claude', 'ChatGPT', 'Copilot', 'Gemini']) {
    if (new RegExp(`\\b${host}\\b`).test(text))
      fail(rel(file), `names the host "${host}"; SKILL.md and references must stay host-neutral`);
  }
}

// --- 5. Jurisdiction packs stay discoverable and dated ----------------------

const packDir = join(root, 'references', 'jurisdictions');
if (existsSync(packDir)) {
  const index = join(packDir, 'README.md');
  const indexText = existsSync(index) ? readFileSync(index, 'utf8') : '';
  if (!indexText) fail('references/jurisdictions/README.md', 'missing pack index');

  const packs = readdirSync(packDir).filter((f) => f.endsWith('.md') && f !== 'README.md');
  if (packs.length === 0) notes.push('no jurisdiction packs');
  for (const pack of packs) {
    if (!indexText.includes(`(${pack})`))
      fail(`references/jurisdictions/${pack}`, 'not linked from the pack index; it would be unfindable');

    const text = readFileSync(join(packDir, pack), 'utf8');
    if (!/##\s*Pack maintenance/i.test(text))
      fail(`references/jurisdictions/${pack}`, 'no "Pack maintenance" section with per-claim check dates');
    if (!/\[checked \d{4}-\d{2}-\d{2}\]/.test(text))
      fail(`references/jurisdictions/${pack}`, 'no [checked YYYY-MM-DD] marker on any claim');
    if (!/Next full recheck due/i.test(text))
      fail(`references/jurisdictions/${pack}`, 'no recheck due date; packs rot silently without one');
  }
  if (packs.length) notes.push(`${packs.length} jurisdiction pack(s): ${packs.join(', ')}`);
}

// --- 6. Self-containment and size -------------------------------------------

if (!existsSync(join(root, 'references'))) fail('references/', 'missing');

const bytes = files.reduce((sum, f) => sum + statSync(f).size, 0);
notes.push(`${files.length} files, ${(bytes / 1024).toFixed(1)} KB total`);
if (bytes > 512 * 1024)
  fail('.', `skill is ${(bytes / 1024).toFixed(0)} KB; keep it lean enough to read`);

const binary = files.filter((f) => /\.(mp4|png|jpg|jpeg|ttf|otf|woff2?|zip|pdf)$/i.test(f));
for (const f of binary) fail(rel(f), 'binary asset does not belong in a skill');

// --- report -----------------------------------------------------------------

for (const note of notes) console.log(`  ${note}`);
if (problems.length === 0) {
  console.log('\nOK: skill is self-contained, host-neutral and runtime-free.');
} else {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exitCode = 1;
}
