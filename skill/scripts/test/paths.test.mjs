// Unit tests for lib/paths.mjs — where every check looks.
//
// Thirty-four lines of constants, and two of them are load-bearing in a way
// that is easy to break by tidying:
//
//   - `skillRoot` honours STARTKOMPAS_SKILL_ROOT, which is the seam that lets a
//     real check be pointed at a fixture tree. Without it the only tree the
//     checks could ever examine is the correct one.
//   - `scriptsDir` deliberately does NOT follow that override. It is where the
//     checks live, not what they inspect, so overriding the tree under
//     inspection must not move the code doing the inspecting. Getting this
//     wrong makes check-all.mjs look for its children inside a fixture.
//
// The module reads the environment at import time, so each case imports a fresh
// copy with a cache-busting query rather than trying to re-read it.

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sep} from 'node:path';

/** Import a fresh lib/paths.mjs with `STARTKOMPAS_SKILL_ROOT` set as given. */
let imports = 0;
async function loadPaths(root) {
  const previous = process.env.STARTKOMPAS_SKILL_ROOT;
  if (root === undefined) delete process.env.STARTKOMPAS_SKILL_ROOT;
  else process.env.STARTKOMPAS_SKILL_ROOT = root;

  imports += 1;
  try {
    return await import(`../lib/paths.mjs?case=${imports}`);
  } finally {
    if (previous === undefined) delete process.env.STARTKOMPAS_SKILL_ROOT;
    else process.env.STARTKOMPAS_SKILL_ROOT = previous;
  }
}

test('with no override, the root is the folder these scripts live in', async () => {
  const paths = await loadPaths(undefined);
  assert.match(paths.skillRoot, /skill$/, `unexpected root: ${paths.skillRoot}`);
  assert.equal(paths.skillFile, `${paths.skillRoot}${sep}SKILL.md`);
});

test('every exported directory sits under the root', async () => {
  const paths = await loadPaths(undefined);
  for (const name of ['referencesDir', 'packsDir', 'examplesDir', 'packIndexFile']) {
    assert.ok(
      paths[name].startsWith(paths.skillRoot),
      `${name} (${paths[name]}) is not under skillRoot`,
    );
  }
});

test('the override moves the tree under inspection', async () => {
  const paths = await loadPaths('/tmp/fixture-tree');
  assert.match(paths.skillRoot, /fixture-tree$/);
  assert.match(paths.referencesDir, /fixture-tree/);
  assert.match(paths.packsDir, /fixture-tree/);
});

test('the override does NOT move scriptsDir', async () => {
  // The whole point of the seam: point a check at a fixture, but let it keep
  // finding its own code. If this ever changes, check-all.mjs starts looking
  // for check-skill.mjs inside the fixture and reports nothing at all.
  const overridden = await loadPaths('/tmp/fixture-tree');
  const normal = await loadPaths(undefined);
  assert.equal(overridden.scriptsDir, normal.scriptsDir);
  assert.ok(!overridden.scriptsDir.includes('fixture-tree'));
});

test('a relative override is resolved to an absolute path', async () => {
  // A check spawned with a different cwd must still look in the same place.
  const paths = await loadPaths('some/relative/dir');
  assert.ok(
    paths.skillRoot.includes(`some${sep}relative${sep}dir`),
    `not resolved: ${paths.skillRoot}`,
  );
  assert.notEqual(paths.skillRoot, 'some/relative/dir');
});

test('the pack index is the README inside the packs directory', async () => {
  // Named separately because it is the one file in packsDir that is not a pack,
  // and check-skill.mjs and check-freshness.mjs both have to exclude it.
  const paths = await loadPaths(undefined);
  assert.equal(paths.packIndexFile, `${paths.packsDir}${sep}README.md`);
});
