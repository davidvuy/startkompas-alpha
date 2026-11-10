// Every check needs the same handful of directories. Resolved once, from this
// file's own location, so a script works regardless of the caller's cwd.
//
// Layout this assumes:  skill/scripts/lib/paths.mjs  ->  skill/

import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const skillFile = join(skillRoot, 'SKILL.md');
export const referencesDir = join(skillRoot, 'references');
export const packsDir = join(referencesDir, 'jurisdictions');
export const examplesDir = join(referencesDir, 'examples');
export const evalsDir = join(skillRoot, 'evals');
export const scriptsDir = join(skillRoot, 'scripts');

/** The pack index, which is not itself a jurisdiction pack. */
export const packIndexFile = join(packsDir, 'README.md');
