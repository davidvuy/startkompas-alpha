// Does CI still invoke things that exist?
//
// A workflow that runs a renamed script fails only on push, after the change is
// already shared, and the error arrives as a red build rather than as a dead
// link in a diff. Three scripts were added and two workflows edited in the same
// session that this file was written, which is exactly when that goes wrong.
//
// These are text assertions over the YAML. Parsing it properly would need a
// dependency, and the repository has none outside the frozen runtime — but the
// questions worth asking are answerable without a parser: does this path exist,
// is this npm script defined, is this action pinned, does this job have a
// timeout.

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workflowsDir = join(repoRoot, '.github', 'workflows');

const workflows = readdirSync(workflowsDir)
  .filter((name) => name.endsWith('.yml') || name.endsWith('.yaml'))
  .map((name) => ({name, text: readFileSync(join(workflowsDir, name), 'utf8')}));

const packageJson = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));

test('there are workflows to check', () => {
  assert.ok(workflows.length >= 2, `found ${workflows.length} workflow files`);
});

test('every script a workflow runs with node exists', () => {
  for (const {name, text} of workflows) {
    // `working-directory: skill` changes what a relative path means, so resolve
    // each step against the directory in force at that point in the file.
    let cwd = repoRoot;
    for (const line of text.split(/\r?\n/)) {
      const dir = /^\s*working-directory:\s*(\S+)\s*$/.exec(line);
      if (dir) cwd = join(repoRoot, dir[1]);

      // A job boundary resets it; `jobs:` keys are at two-space indent.
      if (/^ {2}\S+:\s*$/.test(line)) cwd = repoRoot;

      for (const [, script] of line.matchAll(/\bnode\s+((?:src|scripts|examples)\/[\w./-]+)/g)) {
        const resolved = join(cwd, script);
        assert.ok(
          existsSync(resolved),
          `${name} runs "node ${script}" but ${resolved} does not exist`,
        );
      }
    }
  }
});

test('the script-path matcher would notice a renamed script', () => {
  // The test above passes today. This one shows it is capable of failing: the
  // same regex, run over a synthetic step naming a script that is not there.
  const synthetic = '      - run: node scripts/check-renamed-away.mjs\n';
  const found = [...synthetic.matchAll(/\bnode\s+((?:src|scripts|examples)\/[\w./-]+)/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(found, ['scripts/check-renamed-away.mjs']);
  assert.equal(existsSync(join(repoRoot, found[0])), false);
});

test('every npm script a workflow runs is defined in package.json', () => {
  for (const {name, text} of workflows) {
    for (const [, script] of text.matchAll(/\bnpm run (?:--silent )?([\w:-]+)/g)) {
      assert.ok(
        packageJson.scripts?.[script],
        `${name} runs "npm run ${script}" but package.json has no such script`,
      );
    }
    // Bare `npm test` resolves to the "test" script.
    if (/\bnpm test\b/.test(text)) assert.ok(packageJson.scripts?.test, 'no "test" script');
  }
});

test('every third-party action is pinned to a full commit SHA', () => {
  // A moving tag is a supply-chain hole: `@v4` is whatever that tag points at
  // today. Backlog item 67 keeps these pinned; this makes a regression loud.
  for (const {name, text} of workflows) {
    for (const [, action, ref] of text.matchAll(/uses:\s*([\w.-]+\/[\w.-]+)@(\S+)/g)) {
      assert.match(
        ref,
        /^[0-9a-f]{40}$/,
        `${name} uses ${action}@${ref}; pin it to a 40-character commit SHA, not a tag`,
      );
    }
  }
});

/**
 * The job names in a workflow.
 *
 * Only inside the `jobs:` block: two-space keys also appear under `on:` and
 * `concurrency:`, and counting those made the first version of the timeout test
 * report seven jobs in a file that has three.
 */
function jobNames(text) {
  const block = /^jobs:\s*$([\s\S]*)/m.exec(text);
  if (!block) return [];
  return [...block[1].matchAll(/^ {2}([\w-]+):\s*$/gm)].map((match) => match[1]);
}

test('the job parser finds the jobs and nothing else', () => {
  // Asserted directly, because every test below it is vacuous if this is wrong
  // — and the first version of it was.
  const quality = workflows.find((workflow) => workflow.name === 'quality.yml');
  assert.deepEqual(jobNames(quality.text), ['test', 'matrix', 'audit']);
});

test('every job declares a timeout', () => {
  // Without one, a hung step runs for six hours on the default limit.
  for (const {name, text} of workflows) {
    const jobs = jobNames(text);
    const timeouts = [...text.matchAll(/^\s*timeout-minutes:/gm)].length;
    assert.ok(jobs.length > 0, `${name} declares no jobs`);
    assert.equal(
      timeouts,
      jobs.length,
      `${name} has ${jobs.length} job(s) (${jobs.join(', ')}) but ${timeouts} timeout-minutes; every job needs one`,
    );
  }
});

test('every workflow declares its permissions explicitly', () => {
  // The default token is broad. Naming the permissions is how a workflow that
  // only reads is kept to reading.
  for (const {name, text} of workflows) {
    assert.match(text, /^permissions:/m, `${name} does not declare permissions`);
  }
});

test('checkout never persists credentials', () => {
  // Left on, the token stays in .git/config for every later step, including
  // anything a dependency does.
  for (const {name, text} of workflows) {
    const checkouts = [...text.matchAll(/uses:\s*actions\/checkout@\S+([\s\S]{0,200})/g)];
    for (const [, following] of checkouts) {
      assert.match(
        following,
        /persist-credentials:\s*false/,
        `${name} checks out without persist-credentials: false`,
      );
    }
  }
});

test('the skill workflow installs nothing', () => {
  // The skill's whole promise is that it needs no dependencies. An npm ci in
  // its workflow would mean that had quietly stopped being true.
  const skill = workflows.find((workflow) => workflow.name === 'skill.yml');
  assert.ok(skill, 'no skill.yml');
  const steps = skill.text
    .split(/\r?\n/)
    .filter((line) => /^\s*(run|-\s*run):/.test(line) || /^\s+node |^\s+npm /.test(line));
  for (const line of steps) {
    assert.ok(
      !/\bnpm (ci|install)\b/.test(line),
      `skill.yml installs dependencies: ${line.trim()}`,
    );
  }
});

test('the skill checks run on more than one operating system', () => {
  // The checks walk directories and format relative paths, so Windows is where
  // a separator bug appears. Losing that matrix would make the suite
  // single-platform again without anyone noticing.
  const skill = workflows.find((workflow) => workflow.name === 'skill.yml');
  assert.match(skill.text, /windows-latest/, 'skill.yml no longer runs on Windows');
  assert.match(skill.text, /ubuntu-latest/, 'skill.yml no longer runs on Linux');
});

test('a scheduled workflow is not also doing work on every push', () => {
  // The full matrix was deliberately moved off the push path to cut routine
  // cost. A `matrix` job without an event guard would undo that.
  const quality = workflows.find((workflow) => workflow.name === 'quality.yml');
  assert.ok(quality, 'no quality.yml');
  const matrixJob = /^ {2}matrix:\s*$([\s\S]*?)(?=^ {2}\w)/m.exec(quality.text);
  assert.ok(matrixJob, 'quality.yml no longer has a matrix job');
  assert.match(
    matrixJob[1],
    /if:\s*github\.event_name == 'schedule'/,
    'the full matrix should run on the schedule, not on every push',
  );
});

// --- Would CI's first step pass from here? -----------------------------------
//
// Added 2026-11-12, after `Quality / Tests (ubuntu, Node 24)` had been failing
// on every push since 2026-11-11 and mailing the repository owner each time.
// The cause was one line: `installation.json` holds a SHA-256 for every file
// outside `node_modules`, `.git` and `skill/`, and two documentation files had
// been edited without `scripts/refresh-public-manifest.mjs --write` being run.
//
// Nothing local caught it. `npm test` does not look at the manifest and
// `npm run test:scripts` did not either, so the first anyone knew was an email
// about a red build. These two tests move that discovery to before the push.

test('the public package manifest matches the working tree', () => {
  // This is the first step of the Quality workflow, as a test. When it fails,
  // the fix is `node scripts/refresh-public-manifest.mjs --check` to see what
  // moved and `--write` to record it — never editing installation.json by hand.
  const manifest = JSON.parse(readFileSync(join(repoRoot, 'installation.json'), 'utf8'));
  const listed = new Map(manifest.files.map((file) => [file.path, file.sha256]));
  const onDisk = new Set();
  const mismatched = [];
  const unlisted = [];

  const walk = (dir, rel = '') => {
    for (const entry of readdirSync(dir, {withFileTypes: true})) {
      const name = rel ? `${rel}/${entry.name}` : entry.name;
      // The same three exclusions verify-installation.mjs applies. `skill/` is
      // outside this manifest on purpose and has its own checks.
      if (!rel && ['node_modules', '.git', 'skill'].includes(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full, name);
        continue;
      }
      if (name === 'installation.json') continue;
      onDisk.add(name);
      if (!listed.has(name)) {
        unlisted.push(name);
        continue;
      }
      const digest = createHash('sha256').update(readFileSync(full)).digest('hex');
      if (digest !== listed.get(name)) mismatched.push(name);
    }
  };
  walk(repoRoot);

  const missing = [...listed.keys()].filter((path) => !onDisk.has(path));
  assert.deepEqual(
    mismatched,
    [],
    `these files changed without a manifest refresh — run scripts/refresh-public-manifest.mjs --write:\n  ${mismatched.join('\n  ')}`,
  );
  assert.deepEqual(
    unlisted,
    [],
    `these files are not in installation.json — packaging a new file is a reviewed decision, so add the entry deliberately:\n  ${unlisted.join('\n  ')}`,
  );
  assert.deepEqual(missing, [], `these manifest entries no longer exist on disk:\n  ${missing.join('\n  ')}`);
});

test('the eval case count the README states is the count that exists', () => {
  // The sentence that broke the manifest was a count of eval cases, and it had
  // gone stale twice by the time anyone looked. A number in prose that nothing
  // checks is a number that is wrong.
  const readme = readFileSync(join(repoRoot, 'README.md'), 'utf8');
  const stated = readme.match(/cases\.md\) has (\d+) cases/);
  assert.ok(stated, 'README.md no longer states how many eval cases there are');
  const cases = readFileSync(join(repoRoot, 'skill', 'evals', 'cases.md'), 'utf8');
  const actual = (cases.match(/^## C\d+/gm) ?? []).length;
  assert.equal(
    Number(stated[1]),
    actual,
    `README.md says ${stated[1]} eval cases; skill/evals/cases.md has ${actual}`,
  );
});
