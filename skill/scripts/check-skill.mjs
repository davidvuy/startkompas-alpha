#!/usr/bin/env node
// Verifies the skill is structurally sound, self-contained and host-neutral.
//
//   node scripts/check-skill.mjs
//
// Checks, in order:
//   1. SKILL.md frontmatter is valid and the description can route on it
//   2. every relative link resolves
//   3. every reference is reachable from SKILL.md
//   4. no runtime coupling has been reintroduced
//   5. SKILL.md and references name no specific AI host
//   6. jurisdiction packs stay discoverable and dated
//   7. the skill stays within its size budget and ships no binaries

import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';

import {skillRoot, skillFile, referencesDir, packsDir, packIndexFile} from './lib/paths.mjs';
import {listFiles, relativePosix, totalBytes, kb} from './lib/files.mjs';
import {createReport} from './lib/report.mjs';

// Four budgets, because they measure four different costs. The order below is
// the order of how much each one actually matters.
//
// ALWAYS_BUDGET_KB — SKILL.md alone. The host loads this on every single turn
// whether the skill is used or not, so a kilobyte here is the most expensive
// kilobyte in the project. This is the budget to defend hardest.
//
// REFERENCE_BUDGET_KB — the largest single file under references/. Progressive
// disclosure means the model opens one pack, not all of them: a founder in
// Berlin never pays for the French pack. So the real per-conversation cost is
// SKILL.md plus the biggest thing it might open, not the sum of everything.
//
// MODEL_BUDGET_KB — SKILL.md plus all of references/. This is a *distribution*
// bound, not a per-turn cost: it caps how much a reader has to trust and a
// maintainer has to recheck. It is the loosest of the three model budgets on
// purpose, because adding the ninth jurisdiction pack should not be blocked by
// the eight that a given conversation will not read.
//
// FOLDER_BUDGET_KB — the whole folder, including scripts/ and evals/ that no
// model ever reads. It exists only to catch accidental bulk.
//
// Measuring only the folder — as this check first did — would have blocked
// adding a jurisdiction pack because the *tooling* had grown. That was a bug.
// Measuring only the aggregate, as it did next, had the same shape of bug one
// level up: it priced every pack into every conversation.
//
// History of these budgets, so a raise is never silent:
//   192 KB  MODEL, initial, set when the model-facing set was 142.7 KB
//   256 KB  MODEL, 2026-11-10, raised at 177.5 KB — closing open topics adds
//           verified content, and 14.5 KB of headroom was about to block that
//           work. Raised on an explicit decision, not to make a red build green.
//   2026-11-10  ALWAYS and REFERENCE added, at SKILL.md 7.5 KB and a largest
//           reference of 36.1 KB (germany.md). They encode what the aggregate
//           could not: that the per-turn cost is bounded by one pack, and that
//           SKILL.md growing is far worse than references/ growing.
// Before raising MODEL again, ask whether the packs should be condensed. Before
// raising ALWAYS, ask what behaviour the extra instruction buys. Verified prose
// earns its space; restated prose does not.
const ALWAYS_BUDGET_KB = 10;
const REFERENCE_BUDGET_KB = 48;
const MODEL_BUDGET_KB = 320;
const FOLDER_BUDGET_KB = 512;

// A description shorter than this cannot carry both scope and "when to use".
const MIN_DESCRIPTION = 80;
const MAX_DESCRIPTION = 1024;
const MAX_NAME = 64;

const report = createReport({ok: 'skill is self-contained, host-neutral and runtime-free.'});
const files = listFiles(skillRoot);
const rel = (file) => relativePosix(skillRoot, file);
const markdown = files.filter((file) => file.endsWith('.md'));

// --- 1. SKILL.md frontmatter -------------------------------------------------

if (!existsSync(skillFile)) {
  report.fail('SKILL.md', 'missing; a skill must have SKILL.md at its root');
} else {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(skillFile, 'utf8'));

  if (!frontmatter) {
    report.fail('SKILL.md', 'no YAML frontmatter delimited by --- at the very start');
  } else {
    const block = frontmatter[1];
    const name = /^name:\s*(.+)$/m.exec(block)?.[1]?.trim();
    // Description runs until the next top-level key or the end of the block.
    const description = /^description:\s*([\s\S]+?)(?=\r?\n[a-z_-]+:|$)/m.exec(block)?.[1]?.trim();

    if (!name) report.fail('SKILL.md', 'frontmatter has no name');
    else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name))
      report.fail('SKILL.md', `name "${name}" must be lowercase letters, digits and single hyphens`);
    else if (name.length > MAX_NAME)
      report.fail('SKILL.md', `name is ${name.length} chars, limit is ${MAX_NAME}`);

    if (!description) {
      report.fail('SKILL.md', 'frontmatter has no description');
    } else {
      if (description.length > MAX_DESCRIPTION)
        report.fail('SKILL.md', `description is ${description.length} chars, limit is ${MAX_DESCRIPTION}`);
      else if (description.length < MIN_DESCRIPTION)
        report.fail('SKILL.md', `description is only ${description.length} chars; too thin to route on`);
      else report.note(`description: ${description.length} chars`);

      if (!/\buse\b/i.test(description))
        report.fail('SKILL.md', 'description does not say when to use the skill');
    }
  }
}

// --- 2. Relative links resolve -----------------------------------------------

/** Link targets in a markdown file that point at local files. */
function localLinkTargets(file) {
  return [...readFileSync(file, 'utf8').matchAll(/\]\(([^)\s#]+)(?:#[^)]*)?\)/g)]
    .map(([, target]) => target)
    .filter((target) => !/^(https?:|mailto:)/.test(target));
}

for (const file of markdown) {
  for (const target of localLinkTargets(file)) {
    if (!existsSync(resolve(dirname(file), target)))
      report.fail(rel(file), `dead relative link -> ${target}`);
  }
}

// --- 3. Every reference is reachable from SKILL.md ---------------------------
// An unreferenced reference never loads, yet still costs budget.

if (existsSync(skillFile)) {
  const reached = new Set([skillFile]);
  const queue = [skillFile];

  while (queue.length) {
    const current = queue.pop();
    for (const target of localLinkTargets(current)) {
      const absolute = resolve(dirname(current), target);
      if (!existsSync(absolute) || reached.has(absolute)) continue;
      reached.add(absolute);
      if (absolute.endsWith('.md')) queue.push(absolute);
    }
  }

  for (const file of files) {
    if (!rel(file).startsWith('references/')) continue;
    if (!reached.has(file))
      report.fail(rel(file), 'not reachable from SKILL.md by any chain of links; it would never load');
  }
}

// --- 4. No runtime coupling reintroduced -------------------------------------

const RUNTIME_SMELLS = [
  [/node\s+src\//, 'command into the removed Node runtime (node src/...)'],
  [/--runtime-root/, 'reference to the removed runtime resolver'],
  [/npm\s+(ci|install)/, 'dependency install step; the skill must need none'],
  [/\bmodules\/[a-z-]+\.md/, 'pointer to the old modules/ directory'],
  [/\(docs\/[a-z-]+\.md\)/, 'link into the old repository docs/ directory'],
  [/\bsrc\/[a-z-]+\.mjs/, 'reference to a runtime source file'],
];

// Scope: the always-loaded SKILL.md plus everything it can pull in.
const modelFacing = [skillFile, ...markdown.filter((file) => rel(file).startsWith('references/'))];

for (const file of modelFacing) {
  const text = readFileSync(file, 'utf8');
  for (const [pattern, why] of RUNTIME_SMELLS) {
    const hit = pattern.exec(text);
    if (hit) report.fail(rel(file), `${why} -> "${hit[0]}"`);
  }
}

// --- 5. Host neutrality ------------------------------------------------------
// INSTALL.md and evals/ may name hosts; what the model reads may not.

const HOSTS = ['Codex', 'Claude', 'ChatGPT', 'Copilot', 'Gemini'];

for (const file of modelFacing) {
  const text = readFileSync(file, 'utf8');
  for (const host of HOSTS) {
    if (new RegExp(`\\b${host}\\b`).test(text))
      report.fail(rel(file), `names the host "${host}"; SKILL.md and references must stay host-neutral`);
  }
}

// --- 6. Jurisdiction packs stay discoverable, dated and on-template ----------
// Naming convention: `eu-*.md` is a shared legal layer, anything else is a
// national pack and must follow the six-section template so a reader can find
// the same topic in the same place in every country.

const NATIONAL_TEMPLATE = [
  /^## 1\. Registration and formalities$/m,
  /^## 2\. VAT — .+$/m,
  /^## 3\. B2B e-invoicing — .+$/m,
  /^## 4\. Agreements and unfair terms$/m,
  /^## 5\. Ownership and permitted use$/m,
  /^## 6\. Data protection$/m,
];

if (existsSync(packsDir)) {
  const index = existsSync(packIndexFile) ? readFileSync(packIndexFile, 'utf8') : '';
  if (!index) report.fail(relativePosix(skillRoot, packIndexFile), 'missing pack index');

  const packs = readdirSync(packsDir)
    .filter((file) => file.endsWith('.md') && file !== 'README.md')
    .sort();

  const shared = packs.filter((pack) => pack.startsWith('eu-'));
  const national = packs.filter((pack) => !pack.startsWith('eu-'));

  for (const pack of packs) {
    const where = `references/jurisdictions/${pack}`;
    if (!index.includes(`(${pack})`))
      report.fail(where, 'not linked from the pack index; it would be unfindable');

    const text = readFileSync(join(packsDir, pack), 'utf8');
    if (!/##\s*Pack maintenance/i.test(text))
      report.fail(where, 'no "Pack maintenance" section with per-claim check dates');
    if (!/\[checked \d{4}-\d{2}-\d{2}/.test(text))
      report.fail(where, 'no [checked YYYY-MM-DD] marker on any claim');
    if (!/Next full recheck due/i.test(text))
      report.fail(where, 'no recheck due date; packs rot silently without one');
    if (!/not advice/i.test(text))
      report.fail(where, 'no "not advice" line; every pack must disclaim it');
  }

  // The template applies to national packs only; shared layers have their own shape.
  for (const pack of national) {
    const text = readFileSync(join(packsDir, pack), 'utf8');
    for (const [index_, heading] of NATIONAL_TEMPLATE.entries()) {
      if (!heading.test(text))
        report.fail(
          `references/jurisdictions/${pack}`,
          `section ${index_ + 1} missing or off-template; expected ${heading}. See the template in the pack index.`,
        );
    }
  }

  if (packs.length === 0) report.note('no jurisdiction packs');
  else report.note(`${national.length} national pack(s) on template, ${shared.length} shared layer(s)`);
}

// --- 7. The model-facing set is closed --------------------------------------
// If a reference linked into scripts/ or evals/, the model could be pointed at
// a file that is not part of what it should be reading.

for (const file of markdown.filter((f) => rel(f).startsWith('references/'))) {
  for (const target of localLinkTargets(file)) {
    const resolved = resolve(dirname(file), target);
    const inside = rel(resolved).startsWith('references/') || resolved === skillFile;
    if (!inside)
      report.fail(
        rel(file),
        `links outside the model-facing set -> ${target}; references may only point at SKILL.md or other references`,
      );
  }
}

// --- 8. Self-containment, size and no binaries -------------------------------

if (!existsSync(referencesDir)) report.fail('references/', 'missing');

const referenceFiles = files.filter((f) => rel(f).startsWith('references/'));
const modelFiles = [skillFile, ...referenceFiles];
const alwaysBytes = totalBytes([skillFile]);
const modelBytes = totalBytes(modelFiles);
const folderBytes = totalBytes(files);

// The per-turn cost is SKILL.md plus whichever single reference gets opened,
// so the largest reference is the one that bounds it.
const largest = referenceFiles
  .map((file) => ({file, bytes: totalBytes([file])}))
  .sort((a, b) => b.bytes - a.bytes)[0];

report.note(`always loaded: SKILL.md, ${kb(alwaysBytes)} KB of ${ALWAYS_BUDGET_KB} KB`);
if (largest)
  report.note(
    `largest reference: ${rel(largest.file)}, ${kb(largest.bytes)} KB of ${REFERENCE_BUDGET_KB} KB`,
  );
report.note(
  `worst-case turn: ${kb(alwaysBytes + (largest?.bytes ?? 0))} KB — SKILL.md plus one reference`,
);
report.note(
  `model-facing total: ${modelFiles.length} files, ${kb(modelBytes)} KB of ${MODEL_BUDGET_KB} KB`,
);
report.note(
  `whole folder: ${files.length} files, ${kb(folderBytes)} KB of ${FOLDER_BUDGET_KB} KB`,
);

if (alwaysBytes > ALWAYS_BUDGET_KB * 1024)
  report.fail(
    'SKILL.md',
    `${kb(alwaysBytes)} KB is over the ${ALWAYS_BUDGET_KB} KB always-loaded budget; this file is paid for on every turn, so move detail into a reference`,
  );

if (largest && largest.bytes > REFERENCE_BUDGET_KB * 1024)
  report.fail(
    rel(largest.file),
    `${kb(largest.bytes)} KB is over the ${REFERENCE_BUDGET_KB} KB per-reference budget; split it rather than raising the budget, because one file is what a single turn pays for`,
  );

if (modelBytes > MODEL_BUDGET_KB * 1024)
  report.fail(
    'SKILL.md + references/',
    `${kb(modelBytes)} KB is over the ${MODEL_BUDGET_KB} KB model budget; trim it or raise the budget on purpose`,
  );

if (folderBytes > FOLDER_BUDGET_KB * 1024)
  report.fail(
    '.',
    `folder is ${kb(folderBytes)} KB, over the ${FOLDER_BUDGET_KB} KB limit; something bulky got in`,
  );

for (const file of files.filter((f) => /\.(mp4|png|jpg|jpeg|ttf|otf|woff2?|zip|pdf)$/i.test(f)))
  report.fail(rel(file), 'binary asset does not belong in a skill');

report.finish();
