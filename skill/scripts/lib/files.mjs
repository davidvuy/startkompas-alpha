// Directory walking and path formatting, in one place. Three scripts had their
// own copy of this before.

import {readdirSync, statSync} from 'node:fs';
import {join, relative, sep} from 'node:path';

/**
 * Every file under `dir`, recursively, in a stable sorted order so output and
 * archives are reproducible.
 *
 * @param {string} dir
 * @param {{ext?: string}} [options] `ext` filters by extension, e.g. '.md'
 * @returns {string[]} absolute paths
 */
export function listFiles(dir, {ext} = {}) {
  const found = [];
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...listFiles(full, {ext}));
    else if (!ext || full.endsWith(ext)) found.push(full);
  }
  return found;
}

/** Forward slashes on every platform — for display, zip entries and comparisons. */
export const toPosix = (path) => path.split(sep).join('/');

/** Path of `file` relative to `root`, always with forward slashes. */
export const relativePosix = (root, file) => toPosix(relative(root, file));

/** Total size in bytes of the given files. */
export const totalBytes = (files) => files.reduce((sum, f) => sum + statSync(f).size, 0);

/** Bytes as KB with one decimal, for reporting. */
export const kb = (bytes) => (bytes / 1024).toFixed(1);
