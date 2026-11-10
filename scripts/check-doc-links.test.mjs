// Does check-doc-links.mjs actually notice a dead cross-link?
//
// This script exists because a throwaway shell one-liner once reported a dozen
// dead links in this repository that were all false positives from its own
// broken path handling. A link checker that cries wolf is worse than none, and
// one that stays silent is worse still — so both directions are tested here.
//
// Negative fixtures, like the skill's own check tests: a tree that is correct
// except for one thing.

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const script = resolve(dirname(fileURLToPath(import.meta.url)), 'check-doc-links.mjs');

/** Run the checker over a throwaway tree. */
function check(files) {
  const root = mkdtempSync(join(tmpdir(), 'doc-links-'));
  try {
    for (const [relativePath, contents] of Object.entries(files)) {
      const full = join(root, ...relativePath.split('/'));
      mkdirSync(dirname(full), {recursive: true});
      writeFileSync(full, contents);
    }
    const run = spawnSync(process.execPath, [script], {
      env: {...process.env, STARTKOMPAS_REPO_ROOT: root},
      encoding: 'utf8',
      shell: false,
      windowsHide: true,
    });
    return {
      code: run.error || run.signal ? -1 : (run.status ?? -1),
      output: (run.stdout ?? '') + (run.stderr ?? ''),
      stdout: run.stdout ?? '',
    };
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
}

function expectPass(files) {
  const result = check(files);
  assert.equal(result.code, 0, `expected a pass, got:\n${result.output}`);
  return result;
}

function expectFail(files, needle) {
  const result = check(files);
  assert.notEqual(result.code, 0, `expected a failure, got a pass:\n${result.output}`);
  assert.match(result.output, needle);
  return result;
}

test('a tree whose links all resolve passes', () => {
  const result = expectPass({
    'README.md': 'See [contributing](CONTRIBUTING.md) and [a doc](docs/one.md).',
    'CONTRIBUTING.md': 'Back to [the readme](README.md).',
    'docs/one.md': 'Up to [the readme](../README.md).',
  });
  assert.match(result.stdout, /3 markdown file\(s\), 4 relative link\(s\) and 0 anchor\(s\) checked/);
});

test('a dead link fails and names both ends', () => {
  const result = expectFail({'README.md': 'See [gone](docs/missing.md).'}, /dead link/);
  assert.match(result.output, /README\.md -> docs\/missing\.md/);
});

test('every dead link is listed, not just the first', () => {
  const result = expectFail(
    {'README.md': '[a](one.md) [b](two.md) [c](three.md)'},
    /3 dead link\(s\)/,
  );
  for (const target of ['one.md', 'two.md', 'three.md']) {
    assert.match(result.output, new RegExp(target.replace('.', '\\.')));
  }
});

// --- What is deliberately not this check's business --------------------------

test('external URLs are ignored', () => {
  // The skill's check-links.mjs probes those, over the network. Doing it here
  // too would make a local check fail when a government portal is down.
  const result = expectPass({
    'README.md': 'See [ext](https://example.com/x) and [plain](http://example.com).',
  });
  assert.match(result.stdout, /0 relative link\(s\) and 0 anchor\(s\) checked/);
});

test('mailto links are ignored', () => {
  expectPass({'README.md': 'Mail [us](mailto:someone@example.com).'});
});

test('a pure in-page anchor that resolves passes', () => {
  expectPass({'README.md': '# Title\n\nJump to [section](#title).'});
});

// --- Anchors -----------------------------------------------------------------
// A link to a renamed heading lands silently at the top of the document, which
// is the one kind of broken link a reader does not notice.

test('a pure in-page anchor pointing at no heading fails', () => {
  const result = expectFail(
    {'README.md': '# Title\n\nJump to [gone](#no-such-section).'},
    /no such heading or id in this file/,
  );
  assert.match(result.output, /#no-such-section/);
});

test('a cross-file anchor that resolves passes', () => {
  expectPass({
    'README.md': 'See [the template](docs/guide.md#the-pack-template).',
    'docs/guide.md': '# Guide\n\n## The pack template\n\nText.\n',
  });
});

test('a cross-file anchor pointing at no heading fails, and says the file was found', () => {
  // The distinction matters: a missing file and a missing heading need
  // different fixes.
  const result = expectFail(
    {
      'README.md': 'See [renamed](docs/guide.md#old-name).',
      'docs/guide.md': '# Guide\n\n## New name\n\nText.\n',
    },
    /file exists, but it has no such heading or id/,
  );
  assert.match(result.output, /docs\/guide\.md#old-name/);
});

test('heading slugs drop punctuation and lowercase the rest, as GitHub does', () => {
  expectPass({
    'README.md': [
      '[a](g.md#2-vat--the-national-scheme)',
      '[b](g.md#what-the-client-actually-gets--315-urhg)',
      '[c](g.md#ownership-and-permitted-use)',
    ].join('\n'),
    'g.md': [
      '# G',
      '',
      '## 2. VAT — the national scheme',
      'x',
      '',
      '## What the client actually gets — §31(5) UrhG',
      'x',
      '',
      '## Ownership and permitted use',
      'x',
    ].join('\n'),
  });
});

test('an explicit <a id> target counts as an anchor', () => {
  // The backlog uses these for stable links to numbered items, which survive
  // the item's wording changing.
  expectPass({
    'README.md': 'See [item 11](BACKLOG.md#11).',
    'BACKLOG.md': '# Backlog\n\n<a id="11"></a>**11.** Decide the runtime.\n',
  });
});

test('a heading inside a code fence does not provide an anchor', () => {
  expectFail(
    {
      'README.md': 'See [fake](g.md#not-real).',
      'g.md': '# G\n\n```\n## Not real\n```\n',
    },
    /no such heading or id/,
  );
});

test('a repeated heading provides the numbered anchors GitHub generates', () => {
  // Two headings with the same text become `name` and `name-1`.
  expectPass({
    'README.md': '[first](g.md#notes) and [second](g.md#notes-1)',
    'g.md': '# G\n\n## Notes\n\nOne.\n\n## Notes\n\nTwo.\n',
  });
});

test('an anchor on a non-markdown file is not checked', () => {
  // A fragment on a LICENSE or a .json means nothing; asserting it would be a
  // false positive.
  expectPass({'README.md': 'See [licence](LICENSE#section).', LICENSE: 'MIT'});
});

// --- Anchors, directories and other near-misses ------------------------------

test('a link with an anchor is resolved on the file part only', () => {
  // `docs/one.md#heading` must check docs/one.md, not a file literally named
  // "one.md#heading". Getting this wrong is what made the old one-liner
  // report false positives.
  expectPass({
    'README.md': 'See [part](docs/one.md#a-heading).',
    'docs/one.md': '# A heading\n',
  });
});

test('an anchor on a file that does not exist still fails', () => {
  expectFail({'README.md': 'See [part](docs/absent.md#a-heading).'}, /docs\/absent\.md#a-heading/);
});

test('a link to a directory passes when it has a README', () => {
  // This is how the repository links to docs/ and skill/.
  expectPass({
    'README.md': 'See [the docs](docs).',
    'docs/README.md': '# Docs\n',
  });
});

test('a link to a directory without a README fails, and says why', () => {
  const result = expectFail({'README.md': 'See [assets](assets).', 'assets/logo.txt': 'x'}, /assets/);
  assert.match(result.output, /directory with no README\.md/);
});

test('node_modules and .git are not walked', () => {
  // Walking node_modules would take minutes and report thousands of links in
  // other people's packages.
  const result = expectPass({
    'README.md': 'Nothing here.',
    'node_modules/pkg/README.md': 'See [broken](does-not-exist.md).',
    '.git/notes.md': 'See [also broken](nope.md).',
  });
  assert.match(result.stdout, /1 markdown file\(s\)/);
});

test('non-markdown files are not scanned', () => {
  expectPass({
    'README.md': 'Fine.',
    'notes.txt': 'See [broken](nope.md).',
    'code.mjs': '// [broken](nope.md)',
  });
});

test('a link target that is an existing non-markdown file passes', () => {
  // Links to a LICENSE, a .json or an image are legitimate.
  expectPass({
    'README.md': 'See [the licence](LICENSE) and [the schema](schema.json).',
    LICENSE: 'MIT',
    'schema.json': '{}',
  });
});

test('nested directories are walked', () => {
  expectFail({'a/b/c/deep.md': 'See [gone](../../missing.md).'}, /a\/b\/c\/deep\.md/);
});

test('an empty repository passes rather than erroring', () => {
  const result = expectPass({'placeholder.txt': 'x'});
  assert.match(result.stdout, /0 markdown file\(s\), 0 relative link\(s\)/);
});
