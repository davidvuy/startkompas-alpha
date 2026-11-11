#!/usr/bin/env node
// Verifies the skill is structurally sound, self-contained and host-neutral.
//
//   node scripts/check-skill.mjs
//
// Checks, in order. Each has a matching `--- n. ---` banner below.
//   1. SKILL.md frontmatter is valid and the description can route on it
//   2. every relative link resolves
//   3. every reference is reachable from SKILL.md
//   4. no runtime coupling has been reintroduced
//   5. SKILL.md and references name no specific AI host
//   6. jurisdiction packs stay discoverable, dated and on-template
//   7. no reference links outside the model-facing set
//   8. every size budget is met and no binaries ship
//   9. every text file uses LF, so a tool cannot turn an edit into a whole-file diff

import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';

import {skillRoot, skillFile, referencesDir, packsDir, packIndexFile} from './lib/paths.mjs';
import {listFiles, relativePosix, totalBytes, kb, overBudget} from './lib/files.mjs';
import {createReport} from './lib/report.mjs';

// Five size budgets, each measuring a different cost. What each one is for,
// why these numbers, and when they were last raised: scripts/README.md, "The
// five size budgets". Change a number there and here together.
const ALWAYS_BUDGET_KB = 10; // SKILL.md alone — paid on every turn, used or not
const REFERENCE_BUDGET_KB = 48; // largest single reference — what one turn opens
const MODEL_BUDGET_KB = 320; // SKILL.md + references/ — a distribution bound
const FOLDER_BUDGET_KB = 512; // the folder as installed, tests excluded
const TEST_BUDGET_KB = 192; // scripts/test/ — deliberate bulk, charged apart

// A skill is text. Section 8 rejects these outright; section 9 skips them,
// because "line endings" means nothing in a font or a video.
const BINARY = /\.(mp4|png|jpg|jpeg|ttf|otf|woff2?|zip|pdf)$/i;

// Frontmatter limits. A description shorter than MIN cannot carry both the
// skill's scope and when to use it, which is what a host routes on.
const MIN_DESCRIPTION = 80;
const MAX_DESCRIPTION = 1024;
const MAX_NAME = 64;

const report = createReport({ok: 'skill is self-contained, host-neutral and runtime-free.'});
const files = listFiles(skillRoot);
const rel = (file) => relativePosix(skillRoot, file);
const markdown = files.filter((file) => file.endsWith('.md'));

// The nine sections below look at the same files. Reading each one once keeps the
// check honest as well as quick: two sections reading a file separately can
// disagree about its contents if it changes mid-run, and the pack loop used to
// read every pack twice.
const contents = new Map();
function read(file) {
  if (!contents.has(file)) contents.set(file, readFileSync(file, 'utf8'));
  return contents.get(file);
}

// Link extraction is run three times per file — once for dead links, once for
// the reachability walk, once for the closure check — so memoise the result
// rather than re-scanning the text.
const linkTargets = new Map();

// --- 1. SKILL.md frontmatter -------------------------------------------------

if (!existsSync(skillFile)) {
  report.fail('SKILL.md', 'missing; a skill must have SKILL.md at its root');
} else {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(read(skillFile));

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
  if (!linkTargets.has(file)) {
    linkTargets.set(
      file,
      [...read(file).matchAll(/\]\(([^)\s#]+)(?:#[^)]*)?\)/g)]
        .map(([, target]) => target)
        .filter((target) => !/^(https?:|mailto:)/.test(target)),
    );
  }
  return linkTargets.get(file);
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
//
// `skillFile` is included only when it exists. Section 1 already reports a
// missing SKILL.md, and the run must survive to print that: reading it blindly
// here threw ENOENT and killed the process, so the one thing a contributor
// needed to be told was replaced by a stack trace.
const presentSkillFile = existsSync(skillFile) ? [skillFile] : [];
const modelFacing = [
  ...presentSkillFile,
  ...markdown.filter((file) => rel(file).startsWith('references/')),
];

for (const file of modelFacing) {
  const text = read(file);
  for (const [pattern, why] of RUNTIME_SMELLS) {
    const hit = pattern.exec(text);
    if (hit) report.fail(rel(file), `${why} -> "${hit[0]}"`);
  }
}

// --- 5. Host neutrality ------------------------------------------------------
// INSTALL.md and evals/ may name hosts; what the model reads may not.

const HOSTS = ['Codex', 'Claude', 'ChatGPT', 'Copilot', 'Gemini'];

for (const file of modelFacing) {
  const text = read(file);
  for (const host of HOSTS) {
    if (new RegExp(`\\b${host}\\b`).test(text))
      report.fail(rel(file), `names the host "${host}"; SKILL.md and references must stay host-neutral`);
  }
}

// --- 6. Jurisdiction packs stay discoverable, dated and on-template ----------
// Naming convention, three kinds of file:
//
//   eu-*.md          a shared legal layer; it has its own shape.
//   <country>.md     a national pack. It must follow the six-section template
//                    so a reader finds the same topic in the same place in
//                    every country.
//   <country>-*.md   an annex to that national pack, for one topic that
//                    outgrew the per-reference budget. It is exempt from the
//                    template — it covers one section, not six — but it must
//                    be linked from its own pack, or a reader working through
//                    the pack would never reach it.
//
// The parent is found by filename, not by a manifest: germany-e-invoicing.md
// is an annex because germany.md exists beside it. Nothing to keep in sync.

// Hosts that serve the authoritative text of a rule, so a source on one of
// them may be called primary. This is deliberately a short allowlist rather
// than a test for ".gov"-ness: bundesfinanzministerium.de is as official as a
// host gets, and a BMF letter still is not the statute.
//
// Adding a country means adding its legislation portal here, which is the
// right amount of friction — it makes a contributor state that the host
// carries the rule itself, rather than inferring it from the domain.
const AUTHORITATIVE_TEXT_HOSTS = [
  /(^|\.)eur-lex\.europa\.eu$/, // EU legislation as published
  /(^|\.)legifrance\.gouv\.fr$/, // French codes and case law
  /(^|\.)wetten\.overheid\.nl$/, // Dutch consolidated legislation
  /(^|\.)gesetze-im-internet\.de$/, // German federal law
  /(^|\.)ejustice\.just\.fgov\.be$/, // Belgian Staatsblad and codes
  /(^|\.)dekamer\.be$/, // Belgian bills as tabled
];

const NATIONAL_TEMPLATE = [
  /^## 1\. Registration and formalities$/m,
  /^## 2\. VAT — .+$/m,
  /^## 3\. B2B e-invoicing — .+$/m,
  /^## 4\. Agreements and unfair terms$/m,
  /^## 5\. Ownership and permitted use$/m,
  /^## 6\. Data protection$/m,
];

if (existsSync(packsDir)) {
  const index = existsSync(packIndexFile) ? read(packIndexFile) : '';
  if (!index) report.fail(relativePosix(skillRoot, packIndexFile), 'missing pack index');

  const packs = readdirSync(packsDir)
    .filter((file) => file.endsWith('.md') && file !== 'README.md')
    .sort();

  const shared = packs.filter((pack) => pack.startsWith('eu-'));
  const stems = new Set(packs.map((pack) => pack.replace(/\.md$/, '')));

  // `germany-e-invoicing.md` is an annex to `germany.md`; `eu-vat-sme.md` is
  // already a shared layer, so the hyphen in its name never reaches here.
  const parentOf = (pack) => {
    const stem = pack.replace(/\.md$/, '');
    const cut = stem.indexOf('-');
    const parent = cut < 0 ? null : stem.slice(0, cut);
    return parent && stems.has(parent) ? `${parent}.md` : null;
  };

  const annexes = packs.filter((pack) => !shared.includes(pack) && parentOf(pack));
  const national = packs.filter((pack) => !shared.includes(pack) && !annexes.includes(pack));

  // The first pack's convention line becomes the one every other must match.
  const conventions = new Map();

  for (const pack of packs) {
    const where = `references/jurisdictions/${pack}`;
    if (!index.includes(`(${pack})`))
      report.fail(where, 'not linked from the pack index; it would be unfindable');

    const text = read(join(packsDir, pack));
    if (!/##\s*Pack maintenance/i.test(text))
      report.fail(where, 'no "Pack maintenance" section with per-claim check dates');
    if (!/\[checked \d{4}-\d{2}-\d{2}/.test(text))
      report.fail(where, 'no [checked YYYY-MM-DD] marker on any claim');
    if (!/Next full recheck due/i.test(text))
      report.fail(where, 'no recheck due date; packs rot silently without one');
    if (!/not advice/i.test(text))
      report.fail(where, 'no "not advice" line; every pack must disclaim it');

    // The marker vocabulary has to mean the same thing in every pack. It had
    // drifted into three wordings, one of which said "the source page" — wrong
    // now that many sources are PDFs — and none of which defined [carried],
    // although check-freshness reports it. A reader opening one pack must not
    // get a different definition from a reader opening another.
    const convention = /^Verification convention:.*$/m.exec(text)?.[0];
    if (!convention) {
      report.fail(where, 'no "Verification convention:" line defining the markers');
    } else if (conventions.size && !conventions.has(convention)) {
      report.fail(
        where,
        `its "Verification convention:" line differs from ${conventions.values().next().value.pack}; the markers must be defined identically in every pack`,
      );
    } else if (!conventions.size) {
      conventions.set(convention, {pack});
    }

    // The legend defines exactly three markers, so exactly three forms may
    // appear. Two packs had grown a fourth by putting prose inside the
    // brackets — `[checked 2026-11-10 — primary source silent, secondary basis
    // unidentified]` and `[checked 2026-11-10, needs primary confirmation]`.
    //
    // Both read fine and both are a problem: the marker is the one thing in a
    // pack that is parsed rather than read, and check-freshness pulls dates out
    // of it. A marker carrying commentary is a marker whose shape nobody is
    // holding to the legend, and the next variant may not parse at all. The
    // commentary belongs in the `· *source type* ·` note beside it.
    for (const marker of text.match(/\[(?:checked|carried)[^\]]*\]/g) ?? []) {
      const conforms =
        /^\[checked \d{4}-\d{2}-\d{2}\]$/.test(marker) ||
        /^\[carried \d{4}-\d{2}-\d{2}, not refetched\]$/.test(marker) ||
        /^\[checked YYYY-MM-DD\]$/.test(marker) || // the legend defining itself
        /^\[carried YYYY-MM-DD, not refetched\]$/.test(marker);

      if (!conforms)
        report.fail(
          where,
          `marker "${marker}" is not one of the three the legend defines; put the explanation in the source-type note instead of inside the brackets`,
        );
    }

    // "Primary" must mean authoritative, not official. See the pack index,
    // "Primary means authoritative, not official": a statute, a directive, a
    // judgment or a bill is primary; a tax authority's website, a ministry's
    // circular and a government FAQ are that body's own guidance, one step
    // from the law. Three packs had it wrong — a Belgian e-invoicing FAQ and
    // three Belastingdienst pages were labelled "primary official", which
    // reads as though the statute had been read when it had not.
    //
    // Only the inline `· *type* ·` note is examined, and only when it sits on
    // a line carrying a link, because that is where the host can be judged.
    for (const line of text.split('\n')) {
      if (line.startsWith('|')) continue; // the maintenance table has its own vocabulary
      const label = /·\s*\*([^*]*primary[^*]*)\*/i.exec(line)?.[1];
      if (!label) continue;

      for (const url of [...line.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1])) {
        const host = URL.canParse(url) ? new URL(url).hostname : null;
        if (host && !AUTHORITATIVE_TEXT_HOSTS.some((pattern) => pattern.test(host)))
          report.fail(
            where,
            `calls ${host} "${label}", but that host is not known to serve authoritative text. Either use the issuing body's own word for it, or add the host to AUTHORITATIVE_TEXT_HOSTS and say why it serves the rule itself`,
          );
      }
    }
  }

  // An annex is only reachable through its pack, so the pack has to link it.
  // Being in the index is not enough: a reader who opened germany.md to answer
  // an e-invoicing question would otherwise never learn the detail exists.
  for (const pack of annexes) {
    const parent = parentOf(pack);
    if (!read(join(packsDir, parent)).includes(`(${pack})`))
      report.fail(
        `references/jurisdictions/${pack}`,
        `an annex to ${parent}, but ${parent} does not link it; a reader working through the pack would never reach it`,
      );
  }

  // The template applies to national packs only; shared layers and annexes
  // have their own shape.
  for (const pack of national) {
    const text = read(join(packsDir, pack));
    for (const [index_, heading] of NATIONAL_TEMPLATE.entries()) {
      if (!heading.test(text))
        report.fail(
          `references/jurisdictions/${pack}`,
          `section ${index_ + 1} missing or off-template; expected ${heading}. See the template in the pack index.`,
        );
    }
  }

  if (packs.length === 0) report.note('no jurisdiction packs');
  else
    report.note(
      `${national.length} national pack(s) on template, ${shared.length} shared layer(s), ${annexes.length} annex(es)`,
    );
}

// --- 7. The model-facing set is closed ---------------------------------------
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
const modelFiles = [...presentSkillFile, ...referenceFiles];
const alwaysBytes = totalBytes(presentSkillFile);
const modelBytes = totalBytes(modelFiles);

// Test code is charged separately: it is deliberate bulk, so letting it draw on
// the same budget as the packs would mean a new fixture could block a new pack.
const testFiles = files.filter((f) => rel(f).startsWith('scripts/test/'));
const installedFiles = files.filter((f) => !rel(f).startsWith('scripts/test/'));
const testBytes = totalBytes(testFiles);
const folderBytes = totalBytes(installedFiles);

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
  `folder without tests: ${installedFiles.length} files, ${kb(folderBytes)} KB of ${FOLDER_BUDGET_KB} KB`,
);
report.note(
  `test suite: ${testFiles.length} files, ${kb(testBytes)} KB of ${TEST_BUDGET_KB} KB`,
);

if (alwaysBytes > ALWAYS_BUDGET_KB * 1024)
  report.fail(
    'SKILL.md',
    `${overBudget(alwaysBytes, ALWAYS_BUDGET_KB, 'always-loaded')}; this file is paid for on every turn, so move detail into a reference`,
  );

if (largest && largest.bytes > REFERENCE_BUDGET_KB * 1024)
  report.fail(
    rel(largest.file),
    `${overBudget(largest.bytes, REFERENCE_BUDGET_KB, 'per-reference')}; split it rather than raising the budget, because one file is what a single turn pays for`,
  );

if (modelBytes > MODEL_BUDGET_KB * 1024)
  report.fail(
    'SKILL.md + references/',
    `${overBudget(modelBytes, MODEL_BUDGET_KB, 'model-facing')}; trim it or raise the budget on purpose`,
  );

if (folderBytes > FOLDER_BUDGET_KB * 1024)
  report.fail(
    '.',
    `folder is ${overBudget(folderBytes, FOLDER_BUDGET_KB, 'installed-folder')}; something bulky got in`,
  );

if (testBytes > TEST_BUDGET_KB * 1024)
  report.fail(
    'scripts/test/',
    `${overBudget(testBytes, TEST_BUDGET_KB, 'test-suite')}; a fixture has probably grown instead of a test being added`,
  );

for (const file of files.filter((file) => BINARY.test(file)))
  report.fail(rel(file), 'binary asset does not belong in a skill');

// --- 9. Every text file uses LF ----------------------------------------------
// The skill is developed on Windows and on Linux, and CI runs both. A tool that
// rewrites a file with the platform's own line endings turns a three-line edit
// into a whole-file diff: the change becomes unreviewable, and the next genuine
// edit to that file collides with it. It is invisible in a terminal, which is
// why it needs a check rather than attention.
//
// This happened: a one-line substitution run through a Python helper converted
// check-freshness.mjs to CRLF, and `git diff --stat` reported 449 changed lines
// where 103 were real. Nothing in the project would have objected.
//
// LF, not CRLF, because every other file here already uses it and git is
// configured to leave line endings alone.
//
// Binaries are skipped: section 8 already rejects them, and reading one as text
// would report line endings in bytes that are not lines.
for (const file of files.filter((file) => !BINARY.test(file))) {
  const text = read(file);
  const crlf = (text.match(/\r\n/g) ?? []).length;
  if (!crlf) continue;

  const lf = (text.match(/(?<!\r)\n/g) ?? []).length;
  report.fail(
    rel(file),
    lf
      ? `mixes line endings: ${crlf} CRLF and ${lf} LF. Normalise the whole file to LF`
      : `uses CRLF line endings on all ${crlf} lines; every other file here uses LF, so this makes the next diff unreadable`,
  );
}

report.finish();
