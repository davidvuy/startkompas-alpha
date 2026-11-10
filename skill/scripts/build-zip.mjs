#!/usr/bin/env node
// Builds the upload archive for hosts that take a zip (claude.ai).
// SKILL.md must sit at the ARCHIVE ROOT, not inside a startkompas/ folder.
//
//   node scripts/build-zip.mjs [output.zip]
//
// Default output is ../startkompas-skill.zip — deliberately OUTSIDE the
// repository, because the legacy package verifier walks the real tree and
// refuses any file not listed in installation.json, .gitignore or not.
// Keep build artifacts out of the source tree.
//
// Standard library only: a minimal store-only (uncompressed) zip writer, so
// this needs no dependency and no external zip tool.

import {readFileSync, writeFileSync, readdirSync, statSync} from 'node:fs';
import {join, dirname, resolve, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {deflateRawSync, crc32} from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(process.argv[2] ?? join(root, '..', '..', 'startkompas-skill.zip'));

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(root).map((f) => ({
  name: relative(root, f).split(sep).join('/'), // zip always uses forward slashes
  body: readFileSync(f),
}));

const u16 = (n) => Buffer.from([n & 0xff, (n >> 8) & 0xff]);
const u32 = (n) => Buffer.from([n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]);

// Fixed timestamp so the archive is reproducible: 2026-01-01 00:00 in DOS form.
const DOS_TIME = u16(0);
const DOS_DATE = u16(((2026 - 1980) << 9) | (1 << 5) | 1);

const locals = [];
const central = [];
let offset = 0;

for (const file of files) {
  const name = Buffer.from(file.name, 'utf8');
  const deflated = deflateRawSync(file.body, {level: 9});
  const useDeflate = deflated.length < file.body.length;
  const payload = useDeflate ? deflated : file.body;
  const method = u16(useDeflate ? 8 : 0);
  const crc = u32(crc32(file.body));

  const localHeader = Buffer.concat([
    u32(0x04034b50),
    u16(20), // version needed
    u16(0x0800), // UTF-8 filename flag
    method,
    DOS_TIME,
    DOS_DATE,
    crc,
    u32(payload.length),
    u32(file.body.length),
    u16(name.length),
    u16(0),
  ]);

  locals.push(localHeader, name, payload);

  central.push(
    Buffer.concat([
      u32(0x02014b50),
      u16(20), // version made by
      u16(20), // version needed
      u16(0x0800),
      method,
      DOS_TIME,
      DOS_DATE,
      crc,
      u32(payload.length),
      u32(file.body.length),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      name,
    ]),
  );

  offset += localHeader.length + name.length + payload.length;
}

const centralBuffer = Buffer.concat(central);
const archive = Buffer.concat([
  ...locals,
  centralBuffer,
  Buffer.concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(centralBuffer.length),
    u32(offset),
    u16(0),
  ]),
]);

writeFileSync(out, archive);

const hasRootSkill = files.some((f) => f.name === 'SKILL.md');
console.log(
  JSON.stringify(
    {
      output: out,
      entries: files.length,
      bytes: archive.length,
      skill_md_at_archive_root: hasRootSkill,
      note: 'Upload this file where the host asks for a skill zip. Built outside the repository on purpose.',
    },
    null,
    2,
  ),
);

if (!hasRootSkill) {
  console.error('SKILL.md is not at the archive root; the host will not recognise this.');
  process.exitCode = 1;
}
