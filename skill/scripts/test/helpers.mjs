// Building blocks for the check tests.
//
// The tests here are almost all NEGATIVE: they build a skill tree with one
// deliberate defect and assert that the real check fails, and names it. CI
// already proves the checks pass on a correct tree — what it cannot prove is
// that they would notice a broken one. A check that silently passes everything
// is worse than no check, because it is trusted.
//
// So each test answers one question: if this specific thing were wrong,
// would we hear about it?

import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const scriptsDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Write a throwaway skill tree and return its path.
 *
 * `files` maps a POSIX-ish relative path to its contents; parent directories
 * are created as needed. The caller is responsible for removing the tree, which
 * `withTree` does automatically.
 *
 * @param {Record<string, string>} files
 * @returns {string} absolute path to the tree root
 */
export function makeTree(files) {
  const root = mkdtempSync(join(tmpdir(), 'startkompas-check-'));
  for (const [relativePath, contents] of Object.entries(files)) {
    const full = join(root, ...relativePath.split('/'));
    mkdirSync(dirname(full), {recursive: true});
    writeFileSync(full, contents);
  }
  return root;
}

/**
 * Run `body` against a fresh fixture tree, removing it afterwards even if the
 * assertion throws — otherwise one failing test leaves litter in the temp
 * directory for every later run.
 *
 * @template T
 * @param {Record<string, string>} files
 * @param {(root: string) => T} body
 * @returns {T}
 */
export function withTree(files, body) {
  const root = makeTree(files);
  try {
    return body(root);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
}

/**
 * Run one check script against a tree, as a child process so that the script's
 * own `process.exitCode` is observable.
 *
 * @param {string} script e.g. 'check-skill.mjs'
 * @param {string} root the tree to inspect
 * @param {{args?: string[], env?: Record<string, string>}} [options]
 * @returns {{code: number, stdout: string, stderr: string, output: string}}
 */
export function runCheck(script, root, {args = [], env = {}} = {}) {
  const run = spawnSync(process.execPath, [join(scriptsDir, script), ...args], {
    env: {...process.env, STARTKOMPAS_SKILL_ROOT: root, ...env},
    encoding: 'utf8',
    shell: false,
    windowsHide: true,
  });

  const stdout = run.stdout ?? '';
  const stderr = run.stderr ?? '';
  return {
    // A spawn failure or a signal is not a pass. Surface it as a distinct code
    // rather than letting `status === null` read as 0 somewhere downstream.
    code: run.error || run.signal ? -1 : (run.status ?? -1),
    stdout,
    stderr,
    output: stdout + stderr,
  };
}

// --- Minimal valid pieces, so each test varies exactly one thing -------------
// Every fixture starts from something that passes, then breaks one rule. If a
// fixture started from something already broken, a test could pass for the
// wrong reason.

/**
 * Frontmatter + body that satisfies check-skill's section 1.
 * Not exported: tests reach it through `baseTree()`, so there is one place a
 * fixture's starting point is defined.
 */
const VALID_SKILL_MD = `---
name: startkompas-test
description: A fixture skill used by the check tests. Use it when exercising the checks themselves, because it carries enough description text to satisfy the minimum routing length that the real check enforces.
---

# Fixture

See [method.md](references/method.md).
`;

/** A reference with no links of its own. */
export const VALID_REFERENCE = `# Method

Nothing here links anywhere.
`;

/**
 * The marker legend every pack must carry, word for word.
 *
 * check-skill requires it to be identical across packs, so the fixtures need
 * one canonical copy for the same reason the packs do.
 */
export const VALID_CONVENTION =
  'Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.';

/**
 * A national pack that satisfies the six-section template, the check-date rule
 * and the freshness parser.
 *
 * @param {{name?: string, recheck?: string, notResearched?: number}} [options]
 */
export function validPack({name = 'Testland', recheck = '2099-01-01', notResearched = 0} = {}) {
  const bodyMarkers = Array.from(
    {length: notResearched},
    (_, i) => `\n- Open topic ${i + 1} is **[not researched]**.\n`,
  ).join('');

  const tableRows = Array.from(
    {length: notResearched},
    (_, i) => `| Open topic ${i + 1} | — | Not researched |\n`,
  ).join('');

  return `# ${name}

Not advice. Verify before relying on it.

${VALID_CONVENTION}

## 1. Registration and formalities

Something. · **[checked 2026-11-10]**

## 2. VAT — the fixture scheme

Something. · **[checked 2026-11-10]**

## 3. B2B e-invoicing — not in force

Something. · **[checked 2026-11-10]**

## 4. Agreements and unfair terms

Something. · **[checked 2026-11-10]**

## 5. Ownership and permitted use

Something. · **[checked 2026-11-10]**

## 6. Data protection

Something. · **[checked 2026-11-10]**
${bodyMarkers}
## Pack maintenance

| Claim | Check date | Status |
| --- | --- | --- |
| Everything above | 2026-11-10 | Fixture |
${tableRows}
Next full recheck due: **${recheck}**.

No independent reviewer has reviewed this pack.
`;
}

/**
 * The smallest tree that passes check-skill, as a base for negative fixtures.
 * Spread it and override one entry.
 */
export function baseTree(extra = {}) {
  return {
    'SKILL.md': VALID_SKILL_MD,
    'references/method.md': VALID_REFERENCE,
    ...extra,
  };
}
