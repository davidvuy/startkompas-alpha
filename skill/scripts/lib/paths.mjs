// Every check needs the same handful of directories. Resolved once, from this
// file's own location, so a script works regardless of the caller's cwd.
//
// Layout this assumes:  skill/scripts/lib/paths.mjs  ->  skill/

import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * The skill tree the checks inspect.
 *
 * Normally this is the folder these scripts live in, resolved from this file's
 * own location so a check works from any cwd. `STARTKOMPAS_SKILL_ROOT`
 * overrides it, which is how `scripts/test/` points a real check at a fixture
 * tree containing a deliberate defect. Without that seam, the only tree the
 * checks could ever examine is the correct one — so nothing would prove that a
 * check actually fails when it should.
 *
 * It is a test seam and nothing else: no shipped code path sets it.
 */
export const skillRoot = process.env.STARTKOMPAS_SKILL_ROOT
  ? resolve(process.env.STARTKOMPAS_SKILL_ROOT)
  : defaultRoot;

export const skillFile = join(skillRoot, 'SKILL.md');
export const referencesDir = join(skillRoot, 'references');
export const packsDir = join(referencesDir, 'jurisdictions');
export const examplesDir = join(referencesDir, 'examples');
/**
 * Where the check scripts themselves live — always the real folder, never a
 * fixture. `skillRoot` is the tree under inspection; this is the code doing the
 * inspecting, so an override of one must not move the other.
 */
export const scriptsDir = join(defaultRoot, 'scripts');

/** The pack index, which is not itself a jurisdiction pack. */
export const packIndexFile = join(packsDir, 'README.md');
