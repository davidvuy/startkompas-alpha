#!/usr/bin/env node
// Structural defects in the markdown itself, which read fine in a diff and
// render wrongly.
//
//   node scripts/check-markdown.mjs
//
// Almost every verified claim in this project lives in a table — run the check
// to see how many. A single blank line inside a table splits
// it into two, so the rows below the gap lose their header and render as a
// stray one-column table — the claim is still in the file, and a reader sees
// something else. That has now happened twice: once in netherlands.md, caught
// by eye while reading, and once in eu-ai-act.md, caught by the probe that
// became this check.
//
// Nothing here is a style opinion. Every rule is a defect that changes what a
// reader sees.

import {readFileSync} from 'node:fs';

import {skillRoot} from './lib/paths.mjs';
import {listFiles, relativePosix} from './lib/files.mjs';
import {createReport} from './lib/report.mjs';

const report = createReport({
  ok: 'tables are well-formed, headings are unique, dividers divide, and every file ends cleanly.',
});

const isRow = (line) => /^\s*\|/.test(line);
/** `| --- | :-: |` — the row that makes the line above it a header. */
const isSeparator = (line) => /^\s*\|[\s:|-]+\|\s*$/.test(line);

/**
 * Cell count, ignoring the leading and trailing pipes.
 *
 * A pipe escaped as `\|` is content, not a cell boundary — the packs use it
 * when quoting a regular expression or a legal citation. Splitting naively
 * counted those as extra cells and reported a correct table as ragged.
 */
const cellCount = (line) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/(?<!\\)\|$/, '')
    .split(/(?<!\\)\|/).length;

let tables = 0;
let rows = 0;

for (const file of listFiles(skillRoot, {ext: '.md'})) {
  const where = relativePosix(skillRoot, file);
  const text = readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);

  // A missing final newline is how a scripted edit announces itself: git shows
  // "\ No newline at end of file", concatenation runs two files together, and
  // POSIX tools treat the last line as incomplete. A batch rewrite of all seven
  // packs stripped it here, and nothing noticed until the bytes were inspected
  // by hand — which is the argument for checking it.
  if (text.length > 0 && !text.endsWith('\n'))
    report.fail(where, 'no newline at end of file');
  else if (/\n{3,}$/.test(text))
    report.fail(where, 'more than one blank line at the end of the file');

  let inTable = false;
  let columns = 0;
  let headerLine = 0;
  let inFence = false;
  const headings = new Map();

  // A file opening with `---` has YAML frontmatter, whose closing fence sits
  // directly under the last key. That is correct and must not be reported.
  let inFrontmatter = lines[0] === '---';

  for (const [index, line] of lines.entries()) {
    const lineNumber = index + 1;

    if (inFrontmatter) {
      if (index > 0 && /^(-{3,}|={3,})\s*$/.test(line)) inFrontmatter = false;
      continue;
    }

    // A fenced block may contain anything, including example tables.
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    // --- A divider that eats the paragraph above it -------------------------
    // `---` directly under a paragraph is a setext heading underline, not a
    // thematic break: the paragraph becomes an <h2>. Seven section dividers in
    // the packs were written that way, so seven closing paragraphs rendered as
    // headings — mostly the "Open:" note that says what the section does not
    // cover, which is exactly the sentence a reader should not see promoted
    // into the table of contents.
    //
    // Invisible in a diff, invisible in a terminal, and one blank line fixes
    // it. Table separators are excluded: a `| --- |` row is matched elsewhere,
    // and a bare `---` under a table row is a malformed table, not this.
    if (/^(-{3,}|={3,})\s*$/.test(line)) {
      const previous = lines[index - 1];
      if (previous !== undefined && previous.trim() !== '' && !isRow(previous))
        report.fail(
          `${where}:${lineNumber}`,
          `"${line.trim()}" directly under text makes the line above it a heading, not a divider; put a blank line between them`,
        );
    }

    // --- Headings: a duplicate breaks every anchor link to it ---------------
    const heading = /^(#{2,6})\s+(.*\S)\s*$/.exec(line);
    if (heading) {
      const key = `${heading[1].length}:${heading[2].toLowerCase()}`;
      if (headings.has(key))
        report.fail(
          `${where}:${lineNumber}`,
          `duplicate heading "${heading[2]}" (also at line ${headings.get(key)}); an anchor link can only reach one of them`,
        );
      else headings.set(key, lineNumber);

      // A heading with nothing under it is almost always a stray left behind by
      // an edit, and it is how two duplicate headings got into docs/local-ui.md:
      // the heading was inserted one section too early and the real one kept.
      //
      // Only when the next heading is at the SAME or a SHALLOWER level. A
      // section that opens directly on a subsection has content — its
      // subsections — and rejecting that would be a style opinion, not a defect.
      const level = heading[1].length;
      const nextContent = lines.slice(index + 1).find((candidate) => candidate.trim() !== '');
      const nextHeading = nextContent && /^(#{1,6})\s/.exec(nextContent);

      if (nextHeading && nextHeading[1].length <= level)
        report.fail(
          `${where}:${lineNumber}`,
          `heading "${heading[2]}" has no content before the next heading of the same or higher level; it is probably a stray left by an edit`,
        );
    }

    if (!isRow(line)) {
      inTable = false;
      continue;
    }

    rows += 1;
    const cells = cellCount(line);

    if (!inTable) {
      if (isSeparator(lines[index + 1] ?? '')) {
        inTable = true;
        tables += 1;
        columns = cells;
        headerLine = lineNumber;
        continue;
      }

      if (isSeparator(line)) {
        report.fail(`${where}:${lineNumber}`, 'table separator with no header row above it');
      } else {
        // The defect this check exists for: usually a blank line has been left
        // in the middle of a table.
        report.fail(
          `${where}:${lineNumber}`,
          'table row with no header and separator above it; a blank line in the middle of a table splits it in two',
        );
      }
      continue;
    }

    if (isSeparator(line)) continue;

    if (cells !== columns)
      report.fail(
        `${where}:${lineNumber}`,
        `row has ${cells} cells, the header at line ${headerLine} has ${columns}; the extra or missing cell is dropped when rendered`,
      );
  }

  if (inFence) report.fail(where, 'unclosed code fence; everything after it renders as code');
}

report.note(`${tables} table(s), ${rows} row(s) checked`);
report.finish();
