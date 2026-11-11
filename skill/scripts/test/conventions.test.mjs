// Conventions that keep the tooling discoverable.
//
// The skill enforces a rule on itself that a reference nothing links to never
// loads. The same failure exists one level up and nothing caught it: a check
// script that check-all.mjs does not list never runs, and a script missing from
// scripts/README.md is one a contributor never finds. Both leave a green build.
//
// These read the scripts as text rather than importing them, because each one
// is a top-level program that does its work on import. The point is to assert
// how the directory hangs together, not to execute it.

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

import {scriptsDir} from '../lib/paths.mjs';

const entries = readdirSync(scriptsDir, {withFileTypes: true});
const scripts = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith('.mjs'))
  .map((entry) => entry.name)
  .sort();

const checkScripts = scripts.filter(
  (name) => name.startsWith('check-') && name !== 'check-all.mjs',
);

const checkAll = readFileSync(join(scriptsDir, 'check-all.mjs'), 'utf8');
const readme = readFileSync(join(scriptsDir, 'README.md'), 'utf8');

test('the directory still looks the way these tests assume', () => {
  assert.ok(scripts.includes('check-all.mjs'), 'no check-all.mjs');
  assert.ok(checkScripts.length >= 4, `only ${checkScripts.length} check scripts found`);
});

test('check-all.mjs runs every check script in the directory', () => {
  // The real risk: someone adds check-whatever.mjs, runs it by hand, and it
  // never runs again because CI only calls check-all.
  for (const name of checkScripts) {
    assert.ok(
      checkAll.includes(`'${name}'`),
      `${name} exists but check-all.mjs does not list it, so CI never runs it`,
    );
  }
});

test('check-all.mjs lists nothing that does not exist', () => {
  for (const [, name] of checkAll.matchAll(/script:\s*'(check-[\w-]+\.mjs)'/g)) {
    assert.ok(scripts.includes(name), `check-all.mjs lists ${name}, which is not in scripts/`);
  }
});

test('every check in check-all.mjs says what it proves', () => {
  // The summary line is what a developer reads when a check fails. An entry
  // with no `proves` makes the output a bare filename.
  const blocks = checkAll.split(/\{\s*$/m).filter((block) => block.includes('script:'));
  assert.ok(blocks.length >= 5);
  for (const block of blocks) {
    const name = /script:\s*'([^']+)'/.exec(block)?.[1];
    assert.ok(/proves:\s*'[^']{10,}'/.test(block), `${name} has no useful "proves" description`);
    assert.ok(/network:\s*(true|false)/.test(block), `${name} does not declare whether it needs the network`);
  }
});

test('every script is listed in scripts/README.md', () => {
  for (const name of scripts) {
    assert.ok(
      readme.includes(name),
      `${name} is not mentioned in scripts/README.md; a contributor will not find it`,
    );
  }
});

test('every lib module is listed in scripts/README.md', () => {
  // The README described "three modules" while there were seven, so four were
  // undocumented and a reader had no way to know what they were for. That is
  // the drift this catches.
  for (const name of readdirSync(join(scriptsDir, 'lib'))) {
    assert.ok(
      readme.includes(name),
      `lib/${name} is not described in scripts/README.md; a reader cannot tell what it is for`,
    );
  }
});

test('scripts/README.md describes no lib module that has been removed', () => {
  const present = new Set(readdirSync(join(scriptsDir, 'lib')));
  for (const [, name] of readme.matchAll(/`([\w-]+\.mjs)`/g)) {
    // Only claims about lib/ — the table in that section names bare filenames.
    if (!/^(paths|files|report|pool|citations|probe|facts)\.mjs$/.test(name)) continue;
    assert.ok(present.has(name), `scripts/README.md describes lib/${name}, which no longer exists`);
  }
});

test('scripts/README.md mentions no script that has been removed', () => {
  for (const [, name] of readme.matchAll(/`(check-[\w-]+\.mjs|build-zip\.mjs)`/g)) {
    assert.ok(scripts.includes(name), `scripts/README.md documents ${name}, which no longer exists`);
  }
});

test('every script is executable as a program and says what it is for', () => {
  for (const name of scripts) {
    const text = readFileSync(join(scriptsDir, name), 'utf8');
    assert.ok(text.startsWith('#!/usr/bin/env node'), `${name} has no shebang`);
    // A header comment is the only documentation a script gets at the point
    // someone opens it.
    const header = text.split('\n').slice(1, 6).join('\n');
    assert.match(header, /^\/\//m, `${name} has no header comment explaining why it exists`);
    assert.ok(
      /^\/\/\s+node scripts\//m.test(text),
      `${name} does not show how to invoke it`,
    );
  }
});

test('a script with numbered sections lists them in its header, and the list matches', () => {
  // A long check is navigable only if its header is a map of it. check-skill.mjs
  // had eight `--- n. ---` banners and a header listing seven, so the one a
  // reader could not find was the one nobody maintained; check-dossier.mjs had
  // five banners and no list at all.
  for (const name of scripts) {
    const text = readFileSync(join(scriptsDir, name), 'utf8');
    const banners = [...text.matchAll(/^\/\/ --- (\d+)\./gm)].map((match) => match[1]);
    if (banners.length === 0) continue;

    const listed = [...text.matchAll(/^\/\/\s+(\d+)\. /gm)].map((match) => match[1]);
    assert.deepEqual(
      listed,
      banners,
      `${name}: the header lists sections [${listed}] but the file has banners [${banners}]`,
    );
  }
});

test('library modules are not executable programs', () => {
  // lib/ is imported, never run. A shebang there suggests otherwise.
  for (const name of readdirSync(join(scriptsDir, 'lib'))) {
    const text = readFileSync(join(scriptsDir, 'lib', name), 'utf8');
    assert.ok(!text.startsWith('#!'), `lib/${name} has a shebang but is a module`);
    assert.match(text, /^\/\//, `lib/${name} has no header comment`);
  }
});

test('no script imports anything outside the standard library', () => {
  // The skill's whole distribution promise is a folder copy with no install
  // step. One stray dependency breaks it, and the failure would surface on
  // someone else's machine rather than here.
  const all = [
    ...scripts.map((name) => [name, join(scriptsDir, name)]),
    ...readdirSync(join(scriptsDir, 'lib')).map((name) => [`lib/${name}`, join(scriptsDir, 'lib', name)]),
    ...readdirSync(join(scriptsDir, 'test')).map((name) => [
      `test/${name}`,
      join(scriptsDir, 'test', name),
    ]),
  ];

  for (const [label, path] of all) {
    const text = readFileSync(path, 'utf8');
    for (const [, specifier] of text.matchAll(/^import\s[^'"]*['"]([^'"]+)['"]/gm)) {
      const local = specifier.startsWith('.') || specifier.startsWith('/');
      assert.ok(
        local || specifier.startsWith('node:'),
        `${label} imports "${specifier}"; the skill must need no dependencies`,
      );
    }
  }
});

test('no check writes to the tree it inspects', () => {
  // Every check is read-only by design — a founder may point one at a real
  // project. A write API appearing in one would be a behaviour change nobody
  // asked for.
  const WRITES = /\b(writeFileSync|appendFileSync|rmSync|unlinkSync|mkdirSync|rename)\b/;
  for (const name of checkScripts) {
    const text = readFileSync(join(scriptsDir, name), 'utf8');
    assert.ok(!WRITES.test(text), `${name} contains a filesystem write; checks must be read-only`);
  }
});
