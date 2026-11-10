#!/usr/bin/env node
// Builds the upload archive for hosts that take a zip (claude.ai).
// SKILL.md must sit at the ARCHIVE ROOT, not inside a startkompas/ folder.
//
//   node scripts/build-zip.mjs [output.zip]
//
// The default output is ../../startkompas-skill.zip — deliberately OUTSIDE the
// repository, because the legacy package verifier walks the real tree and
// refuses any file not listed in installation.json, .gitignore or not. Build
// artifacts do not belong in a source tree.
//
// Writes a minimal deflate zip with Node's zlib, so this needs no dependency
// and no external zip tool. Output is byte-reproducible: entries are sorted and
// timestamps are fixed.

import {readFileSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {deflateRawSync, crc32} from 'node:zlib';

import {skillRoot} from './lib/paths.mjs';
import {listFiles, relativePosix} from './lib/files.mjs';

const output = resolve(process.argv[2] ?? join(skillRoot, '..', '..', 'startkompas-skill.zip'));

const entries = listFiles(skillRoot).map((file) => ({
  name: relativePosix(skillRoot, file), // zip always uses forward slashes
  body: readFileSync(file),
}));

// --- zip primitives ----------------------------------------------------------

const u16 = (n) => Buffer.from([n & 0xff, (n >> 8) & 0xff]);
const u32 = (n) => Buffer.from([n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]);

// Fixed timestamp (2026-01-01 00:00 in DOS form) so the archive is reproducible.
const DOS_TIME = u16(0);
const DOS_DATE = u16(((2026 - 1980) << 9) | (1 << 5) | 1);

const UTF8_NAME_FLAG = 0x0800;
const METHOD_STORE = 0;
const METHOD_DEFLATE = 8;
const SIG_LOCAL = 0x04034b50;
const SIG_CENTRAL = 0x02014b50;
const SIG_END = 0x06054b50;

const localChunks = [];
const centralChunks = [];
let offset = 0;

for (const entry of entries) {
  const name = Buffer.from(entry.name, 'utf8');
  const deflated = deflateRawSync(entry.body, {level: 9});
  const useDeflate = deflated.length < entry.body.length;
  const payload = useDeflate ? deflated : entry.body;
  const method = u16(useDeflate ? METHOD_DEFLATE : METHOD_STORE);
  const crc = u32(crc32(entry.body));

  const localHeader = Buffer.concat([
    u32(SIG_LOCAL),
    u16(20), // version needed to extract
    u16(UTF8_NAME_FLAG),
    method,
    DOS_TIME,
    DOS_DATE,
    crc,
    u32(payload.length),
    u32(entry.body.length),
    u16(name.length),
    u16(0), // extra field length
  ]);

  localChunks.push(localHeader, name, payload);

  centralChunks.push(
    Buffer.concat([
      u32(SIG_CENTRAL),
      u16(20), // version made by
      u16(20), // version needed to extract
      u16(UTF8_NAME_FLAG),
      method,
      DOS_TIME,
      DOS_DATE,
      crc,
      u32(payload.length),
      u32(entry.body.length),
      u16(name.length),
      u16(0), // extra field length
      u16(0), // file comment length
      u16(0), // disk number start
      u16(0), // internal attributes
      u32(0), // external attributes
      u32(offset),
      name,
    ]),
  );

  offset += localHeader.length + name.length + payload.length;
}

const central = Buffer.concat(centralChunks);
const endRecord = Buffer.concat([
  u32(SIG_END),
  u16(0), // this disk
  u16(0), // disk with central directory
  u16(entries.length),
  u16(entries.length),
  u32(central.length),
  u32(offset),
  u16(0), // comment length
]);

const archive = Buffer.concat([...localChunks, central, endRecord]);
writeFileSync(output, archive);

const skillAtRoot = entries.some((entry) => entry.name === 'SKILL.md');

console.log(
  JSON.stringify(
    {
      output,
      entries: entries.length,
      bytes: archive.length,
      skill_md_at_archive_root: skillAtRoot,
      note: 'Upload this where the host asks for a skill zip. Built outside the repository on purpose.',
    },
    null,
    2,
  ),
);

if (!skillAtRoot) {
  console.error('SKILL.md is not at the archive root; the host will not recognise this.');
  process.exitCode = 1;
}
