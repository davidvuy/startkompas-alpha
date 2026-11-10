// Does check-markdown.mjs catch the defects that render wrongly?
//
// This check exists because the same bug happened twice: a blank line left in
// the middle of a maintenance table, which splits it in two so the rows below
// the gap lose their header. The claim stays in the file; the reader sees
// something else. One was caught by eye in netherlands.md, the other by the
// probe that became this check, in eu-ai-act.md.

import {test} from 'node:test';
import assert from 'node:assert/strict';

import {runCheck, withTree} from './helpers.mjs';

function run(markdown) {
  return withTree({'references/doc.md': markdown}, (root) =>
    runCheck('check-markdown.mjs', root),
  );
}

function expectPass(markdown) {
  const result = run(markdown);
  assert.equal(result.code, 0, `expected a pass, got:\n${result.output}`);
  return result;
}

function expectFail(markdown, needle) {
  const result = run(markdown);
  assert.notEqual(result.code, 0, `expected a failure, got a pass:\n${result.output}`);
  assert.match(result.output, needle);
  return result;
}

const GOOD_TABLE = ['| A | B |', '| --- | --- |', '| 1 | 2 |', '| 3 | 4 |'].join('\n');

test('a well-formed table passes and is counted', () => {
  const result = expectPass(`# Doc\n\n${GOOD_TABLE}\n`);
  assert.match(result.output, /1 table\(s\), 4 row\(s\) checked/);
});

test('a blank line in the middle of a table fails, and says what it does', () => {
  // The actual bug, twice over.
  const result = expectFail(
    `# Doc\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n| 3 | 4 |\n`,
    /table row with no header and separator above it/,
  );
  assert.match(result.output, /splits it in two/);
  assert.match(result.output, /doc\.md:7/, 'the message must point at the orphaned row');
});

test('a ragged row fails and names the header it disagrees with', () => {
  const result = expectFail(
    `# Doc\n\n| A | B |\n| --- | --- |\n| 1 | 2 | 3 |\n`,
    /row has 3 cells, the header at line 3 has 2/,
  );
  assert.match(result.output, /dropped when rendered/);
});

test('a row with too few cells fails too', () => {
  expectFail(`# Doc\n\n| A | B | C |\n| --- | --- | --- |\n| 1 | 2 |\n`, /row has 2 cells/);
});

test('a separator with no header above it fails', () => {
  expectFail(`# Doc\n\nText.\n\n| --- | --- |\n| 1 | 2 |\n`, /separator with no header row above it/);
});

test('alignment markers in the separator are accepted', () => {
  // `| :-- | :-: | --: |` is valid markdown and must not read as a data row.
  expectPass('# Doc\n\n| A | B | C |\n| :-- | :-: | --: |\n| 1 | 2 | 3 |\n');
});

test('two tables separated by prose both pass', () => {
  const result = expectPass(`# Doc\n\n${GOOD_TABLE}\n\nSome prose.\n\n${GOOD_TABLE}\n`);
  assert.match(result.output, /2 table\(s\)/);
});

test('a table immediately after a heading passes', () => {
  expectPass(`# Doc\n\n## Section\n\n${GOOD_TABLE}\n`);
});

test('a table at the very end of a file passes', () => {
  // No trailing newline: an off-by-one in the lookahead would fire here.
  expectPass(`# Doc\n\n${GOOD_TABLE}`);
});

test('an escaped pipe inside a cell is content, not a cell boundary', () => {
  // The packs use `\|` when quoting a regular expression or an alternative in
  // a citation. Counting it as a boundary reported a correct table as ragged,
  // which is the failure mode that gets a check switched off.
  expectPass('# Doc\n\n| Pattern | Means |\n| --- | --- |\n| `a\\|b` | a or b |\n');
});

test('two escaped pipes in one row still count as one cell', () => {
  expectPass('# Doc\n\n| Pattern | Means |\n| --- | --- |\n| `a\\|b\\|c` | any |\n');
});

test('an unescaped extra pipe is still caught', () => {
  // The fix must not have made the check blind: this is a genuinely ragged row.
  expectFail('# Doc\n\n| A | B |\n| --- | --- |\n| 1 | 2 | 3 |\n', /row has 3 cells/);
});

// --- Code fences -------------------------------------------------------------

test('a table inside a code fence is not inspected', () => {
  // Documentation showing a broken table on purpose must not fail the build.
  expectPass('# Doc\n\n```\n| A | B |\n\n| 1 |\n```\n\nFine.\n');
});

test('a tilde fence is honoured as well as a backtick fence', () => {
  expectPass('# Doc\n\n~~~\n| A |\n\n| B | C |\n~~~\n');
});

test('an unclosed code fence fails', () => {
  // Everything after it renders as code, which silently hides the rest of the
  // document — including, in a pack, its maintenance table.
  expectFail('# Doc\n\n```\nnot closed\n', /unclosed code fence/);
});

// --- Headings ----------------------------------------------------------------

test('a duplicate heading at the same level fails and names both lines', () => {
  // Anchors are how the packs' README and the maintenance tables cross-link;
  // two headings with the same text means one is unreachable.
  const result = expectFail(
    '# Doc\n\n## Sources\n\nText.\n\n## Sources\n\nMore.\n',
    /duplicate heading "Sources"/,
  );
  assert.match(result.output, /also at line 3/);
  assert.match(result.output, /anchor link can only reach one of them/);
});

test('the same text at different heading levels is allowed', () => {
  // `## Open` and `### Open` produce different anchors in practice, and the
  // packs legitimately nest a subsection under a section of similar name.
  expectPass('# Doc\n\n## Open\n\n### Open\n\nText.\n');
});

test('a section that opens directly on a subsection is not a stray heading', () => {
  // Its subsections ARE its content. The first version of the empty-heading
  // rule rejected this, which would have been a style opinion rather than a
  // defect — and the test above is what caught it.
  expectPass('# Doc\n\n## Section\n\n### First part\n\nText.\n\n### Second part\n\nMore.\n');
});

test('a stray subsection followed by a shallower heading fails', () => {
  // `## Section` is fine here — its content is the subsection. `### Stray` is
  // the defect: the next heading is shallower, so nothing is under it.
  const result = expectFail(
    '# Doc\n\n## Section\n\n### Stray\n\n## Next\n\nText.\n',
    /heading "Stray" has no content/,
  );
  assert.ok(
    !/heading "Section" has no content/.test(result.output),
    'the parent section has content and must not be flagged',
  );
});

test('headings are compared case-insensitively', () => {
  // "## Sources" and "## sources" generate the same anchor.
  expectFail('# Doc\n\n## Sources\n\n## sources\n', /duplicate heading/);
});

test('duplicate headings in different files are fine', () => {
  // Every pack has "## 6. Data protection"; anchors are per document.
  const result = withTree(
    {
      'references/a.md': '# A\n\n## Data protection\n',
      'references/b.md': '# B\n\n## Data protection\n',
    },
    (root) => runCheck('check-markdown.mjs', root),
  );
  assert.equal(result.code, 0, result.output);
});

test('a heading inside a code fence is not counted', () => {
  expectPass('# Doc\n\n## Real\n\n```\n## Real\n```\n');
});

test('a heading with no content before the next heading fails', () => {
  // How two duplicate headings got into docs/local-ui.md: the heading was
  // inserted one section too early and the real one kept, leaving an empty
  // stray that rendered as a bare line.
  const result = expectFail(
    '# Doc\n\n## Stray\n\n## Real\n\nContent.\n',
    /heading "Stray" has no content/,
  );
  assert.match(result.output, /stray left by an edit/);
});

test('a heading followed by content passes, whatever the next heading is', () => {
  expectPass('# Doc\n\n## First\n\nSomething.\n\n## Second\n\nMore.\n');
});

test('a heading followed only by a table still counts as having content', () => {
  // Most pack sections open directly on a table.
  expectPass('# Doc\n\n## Section\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n## Next\n\nText.\n');
});

test('the last heading in a file needs no content after it', () => {
  // A closing section heading with its body, then end of file. Looking ahead
  // past the end must not be treated as "the next heading".
  expectPass('# Doc\n\n## Section\n\nBody.\n');
});

test('every file is checked, not just the first', () => {
  const result = withTree(
    {
      'references/a.md': '# A\n\nFine.\n',
      'references/b.md': '# B\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n| 3 | 4 |\n',
    },
    (root) => runCheck('check-markdown.mjs', root),
  );
  assert.notEqual(result.code, 0);
  assert.match(result.output, /b\.md:7/);
});
