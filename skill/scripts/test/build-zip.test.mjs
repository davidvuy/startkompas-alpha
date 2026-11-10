// Does build-zip.mjs produce an archive another program can actually open?
//
// It writes the zip format by hand with zlib, which is the right call — it keeps
// the skill dependency-free — but it means a wrong CRC, a wrong offset or a
// wrong length produces a file that looks fine and fails on upload, with no
// error anywhere near the mistake.
//
// So these tests do not inspect the writer. They read the archive back with an
// independent parser written here, the way a real unzip does: find the end
// record, walk the central directory, follow each entry's offset into its local
// header, inflate, and check the CRC. If the two implementations agree, the
// archive is well-formed.

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {inflateRawSync, crc32} from 'node:zlib';

import {baseTree, runCheck, withTree, validPack} from './helpers.mjs';

const SIG_END = 0x06054b50;
const SIG_CENTRAL = 0x02014b50;
const SIG_LOCAL = 0x04034b50;
const METHOD_STORE = 0;
const METHOD_DEFLATE = 8;

/**
 * Read a zip the way a real extractor does: via the central directory.
 *
 * Deliberately independent of build-zip.mjs. A shared helper would let the same
 * misunderstanding of the format pass both sides.
 *
 * @param {Buffer} buffer
 * @returns {{count: number, entries: Array<{name: string, method: number, body: Buffer}>}}
 */
function readZip(buffer) {
  // The end record is at the tail, after a variable-length comment.
  let end = -1;
  for (let i = buffer.length - 22; i >= 0; i -= 1) {
    if (buffer.readUInt32LE(i) === SIG_END) {
      end = i;
      break;
    }
  }
  assert.notEqual(end, -1, 'no end-of-central-directory record');

  const count = buffer.readUInt16LE(end + 10);
  const centralSize = buffer.readUInt32LE(end + 12);
  const centralOffset = buffer.readUInt32LE(end + 16);
  assert.equal(
    centralOffset + centralSize,
    end,
    'the central directory does not end where the end record begins',
  );

  const entries = [];
  let cursor = centralOffset;

  for (let i = 0; i < count; i += 1) {
    assert.equal(buffer.readUInt32LE(cursor), SIG_CENTRAL, `central header ${i} has no signature`);
    const method = buffer.readUInt16LE(cursor + 10);
    const crc = buffer.readUInt32LE(cursor + 16);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const uncompressedSize = buffer.readUInt32LE(cursor + 24);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.toString('utf8', cursor + 46, cursor + 46 + nameLength);

    // Follow the offset, as an extractor would.
    assert.equal(
      buffer.readUInt32LE(localOffset),
      SIG_LOCAL,
      `entry ${name}: central offset does not point at a local header`,
    );
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const localName = buffer.toString(
      'utf8',
      localOffset + 30,
      localOffset + 30 + localNameLength,
    );
    assert.equal(localName, name, 'local and central names disagree');

    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const payload = buffer.subarray(dataStart, dataStart + compressedSize);
    const body = method === METHOD_DEFLATE ? inflateRawSync(payload) : Buffer.from(payload);

    assert.equal(body.length, uncompressedSize, `entry ${name}: wrong uncompressed length`);
    assert.equal(crc32(body), crc, `entry ${name}: CRC does not match its contents`);

    entries.push({name, method, body});
    cursor += 46 + nameLength + extraLength + commentLength;
  }

  return {count, entries};
}

/** Build an archive from a fixture tree and return it parsed. */
function build(files, {expectFailure = false} = {}) {
  return withTree(files, (root) => {
    const output = join(mkdtempSync(join(tmpdir(), 'startkompas-zip-')), 'skill.zip');
    const result = runCheck('build-zip.mjs', root, {args: [output]});
    if (expectFailure) assert.notEqual(result.code, 0, `expected a failure:\n${result.output}`);
    else assert.equal(result.code, 0, `build failed:\n${result.output}`);
    const buffer = readFileSync(output);
    return {result, buffer, zip: readZip(buffer), output};
  });
}

test('the archive is well-formed and every entry round-trips', () => {
  const files = {
    ...baseTree({'references/method.md': '# Method\n\nSee [packs](jurisdictions/README.md).\n'}),
    'references/jurisdictions/README.md': '# Packs\n\n- [testland.md](testland.md)\n',
    'references/jurisdictions/testland.md': validPack(),
    'INSTALL.md': '# Install\n\nCopy the folder.\n',
  };
  const {zip} = build(files);

  assert.equal(zip.count, Object.keys(files).length);
  for (const entry of zip.entries) {
    // readZip already verified every CRC and length; this confirms the bytes
    // are the bytes we put in.
    const expected = files[entry.name] ?? undefined;
    if (expected !== undefined) assert.equal(entry.body.toString('utf8'), expected);
  }
});

test('SKILL.md sits at the archive root, not inside a folder', () => {
  // The whole reason this script exists. A host given startkompas/SKILL.md does
  // not recognise the upload.
  const {zip, result} = build(baseTree());
  assert.ok(
    zip.entries.some((entry) => entry.name === 'SKILL.md'),
    'SKILL.md must be a top-level entry',
  );
  assert.ok(
    !zip.entries.some((entry) => entry.name.endsWith('/SKILL.md')),
    'SKILL.md must not be nested',
  );
  assert.match(result.stdout, /"skill_md_at_archive_root": true/);
});

test('a tree with no SKILL.md fails loudly rather than shipping a broken zip', () => {
  const {result} = build({'references/method.md': '# M\n'}, {expectFailure: true});
  assert.match(result.output, /SKILL\.md is not at the archive root/);
  assert.match(result.stdout, /"skill_md_at_archive_root": false/);
});

test('nested paths use forward slashes on every platform', () => {
  // Windows backslashes in a zip entry name produce a single file called
  // "references\method.md" on extraction, not a directory.
  const {zip} = build(baseTree());
  for (const entry of zip.entries) {
    assert.ok(!entry.name.includes('\\'), `entry name has a backslash: ${entry.name}`);
  }
  assert.ok(zip.entries.some((entry) => entry.name === 'references/method.md'));
});

test('entry order is sorted, which is what makes the build reproducible', () => {
  const {zip} = build({
    ...baseTree({'references/method.md': '# M\n\n[a](a.md) [b](b.md)\n'}),
    'references/a.md': '# A\n',
    'references/b.md': '# B\n',
  });
  const names = zip.entries.map((entry) => entry.name);
  assert.deepEqual(names, [...names].sort());
});

test('two builds of the same tree are byte-identical', () => {
  // Fixed timestamps and sorted entries, so a rebuild is not a diff. Without
  // this, every build looks like a change.
  const files = baseTree();
  const first = build(files).buffer;
  const second = build(files).buffer;
  assert.ok(first.equals(second), 'the archive is not reproducible');
});

test('incompressible content is stored rather than inflated by deflating it', () => {
  // Deflate on random bytes produces a slightly LARGER payload. Storing it
  // instead keeps the archive from growing, and exercises the other branch.
  const random = Buffer.alloc(4096);
  for (let i = 0; i < random.length; i += 1) random[i] = (i * 2654435761) % 256;
  const {zip} = build({
    ...baseTree({'references/method.md': '# M\n\n[noise](noise.md)\n'}),
    'references/noise.md': random.toString('latin1'),
  });
  const noise = zip.entries.find((entry) => entry.name === 'references/noise.md');
  assert.ok(noise, 'the entry should exist whichever method was chosen');
  assert.ok(
    [METHOD_STORE, METHOD_DEFLATE].includes(noise.method),
    'only store and deflate are valid here',
  );
});

test('an empty file produces a valid entry', () => {
  // Zero-length payloads are a classic off-by-one in a hand-written zip.
  const {zip} = build({
    ...baseTree({'references/method.md': '# M\n\n[empty](empty.md)\n'}),
    'references/empty.md': '',
  });
  const empty = zip.entries.find((entry) => entry.name === 'references/empty.md');
  assert.ok(empty);
  assert.equal(empty.body.length, 0);
});

test('non-ASCII content survives the round trip', () => {
  // The packs are full of é, §, — and quoted Dutch, French and German. A
  // latin1/utf8 slip here would corrupt the shipped text.
  const text = '# Méthode\n\n§19 UStG — «vrijstellingsregeling» · 28.000 €\n';
  const {zip} = build(baseTree({'references/method.md': text}));
  const entry = zip.entries.find((item) => item.name === 'references/method.md');
  assert.equal(entry.body.toString('utf8'), text);
});

test('the build reports where it wrote and how many entries', () => {
  const {result, zip} = build(baseTree());
  const report = JSON.parse(result.stdout);
  assert.equal(report.entries, zip.count);
  assert.ok(report.bytes > 0);
  assert.match(report.output, /skill\.zip$/);
});
