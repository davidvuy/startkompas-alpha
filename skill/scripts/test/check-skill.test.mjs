// Does check-skill.mjs actually notice a broken skill?
//
// One test per rule it enforces. Each builds a tree that is correct except for
// the thing being tested, asserts a non-zero exit, and asserts the message
// names the problem — because an exit code alone does not tell a contributor
// what to fix.

import {test} from 'node:test';
import assert from 'node:assert/strict';

import {baseTree, runCheck, withTree, VALID_REFERENCE, VALID_CONVENTION, validPack} from './helpers.mjs';

/** A tree that passes, so a negative result can only come from the defect. */
function expectPass(files) {
  return withTree(files, (root) => {
    const result = runCheck('check-skill.mjs', root);
    assert.equal(result.code, 0, `expected a pass, got:\n${result.output}`);
    return result;
  });
}

/** Assert the check fails and that its output mentions `needle`. */
function expectFail(files, needle) {
  return withTree(files, (root) => {
    const result = runCheck('check-skill.mjs', root);
    assert.notEqual(result.code, 0, `expected a failure, got a pass:\n${result.output}`);
    assert.match(result.output, needle);
    return result;
  });
}

test('the baseline fixture passes, so every failure below is caused by its defect', () => {
  expectPass(baseTree());
});

// --- Frontmatter — check-skill.mjs section 1 ---------------------------------

test('missing SKILL.md fails', () => {
  expectFail({'references/method.md': VALID_REFERENCE}, /SKILL\.md.*missing/);
});

test('SKILL.md without frontmatter fails', () => {
  expectFail({...baseTree(), 'SKILL.md': '# No frontmatter\n\nBody.\n'}, /no YAML frontmatter/);
});

test('frontmatter without a name fails', () => {
  expectFail(
    {...baseTree(), 'SKILL.md': '---\ndescription: ' + 'x'.repeat(100) + ' use\n---\n\nBody.\n'},
    /frontmatter has no name/,
  );
});

test('a name that is not kebab-case fails', () => {
  expectFail(
    {
      ...baseTree(),
      'SKILL.md': `---\nname: Not_Kebab\ndescription: ${'x'.repeat(100)} use it\n---\n\nBody.\n`,
    },
    /must be lowercase letters, digits and single hyphens/,
  );
});

test('a name over the length limit fails', () => {
  expectFail(
    {
      ...baseTree(),
      'SKILL.md': `---\nname: ${'a'.repeat(65)}\ndescription: ${'x'.repeat(100)} use it\n---\n\nBody.\n`,
    },
    /name is 65 chars/,
  );
});

test('frontmatter without a description fails', () => {
  expectFail({...baseTree(), 'SKILL.md': '---\nname: ok-name\n---\n\nBody.\n'}, /no description/);
});

test('a description too thin to route on fails', () => {
  expectFail(
    {...baseTree(), 'SKILL.md': '---\nname: ok-name\ndescription: Use it.\n---\n\nBody.\n'},
    /too thin to route on/,
  );
});

test('a description that never says when to use the skill fails', () => {
  // Long enough to clear the minimum, but with no "use" anywhere: a description
  // that describes without routing is the most common real mistake.
  const description = 'This skill concerns founder documentation and jurisdiction research. '.repeat(2);
  expectFail(
    {...baseTree(), 'SKILL.md': `---\nname: ok-name\ndescription: ${description}\n---\n\nBody.\n`},
    /does not say when to use/,
  );
});

// --- Links and reachability — sections 2, 3 and 7 ----------------------------

test('a dead relative link fails', () => {
  expectFail(
    {...baseTree(), 'references/method.md': '# Method\n\nSee [gone](missing.md).\n'},
    /dead relative link -> missing\.md/,
  );
});

test('a reference unreachable from SKILL.md fails', () => {
  // It exists and is valid; nothing links to it, so it would never load while
  // still costing budget.
  expectFail(
    {...baseTree(), 'references/orphan.md': VALID_REFERENCE},
    /orphan\.md.*not reachable from SKILL\.md/,
  );
});

test('a reference reached only via another reference passes', () => {
  // Reachability is transitive; a chain is legitimate progressive disclosure.
  expectPass({
    ...baseTree({'references/method.md': '# Method\n\nSee [deeper](deeper.md).\n'}),
    'references/deeper.md': VALID_REFERENCE,
  });
});

test('a reference linking outside the model-facing set fails', () => {
  expectFail(
    {
      ...baseTree({'references/method.md': '# Method\n\nSee [cases](../evals/cases.md).\n'}),
      'evals/cases.md': '# Cases\n',
    },
    /links outside the model-facing set/,
  );
});

// --- Runtime coupling and host neutrality — sections 4 and 5 -----------------

test('a dependency install step in a reference fails', () => {
  expectFail(
    {...baseTree(), 'references/method.md': '# Method\n\nFirst run `npm ci`.\n'},
    /dependency install step/,
  );
});

test('a pointer into the removed runtime fails', () => {
  expectFail(
    {...baseTree(), 'references/method.md': '# Method\n\nRun `node src/start.mjs`.\n'},
    /removed Node runtime/,
  );
});

test('naming a host in a reference fails', () => {
  expectFail(
    {...baseTree(), 'references/method.md': '# Method\n\nIn Claude, open the file.\n'},
    /names the host "Claude"/,
  );
});

test('naming a host in SKILL.md fails too', () => {
  expectFail(
    {
      ...baseTree(),
      'SKILL.md': baseTree()['SKILL.md'].replace('# Fixture', '# Fixture\n\nWorks in Codex.'),
    },
    /names the host "Codex"/,
  );
});

// --- Jurisdiction packs — section 6 ------------------------------------------

/** A tree with one national pack, correctly indexed. */
function packTree(packBody, {index = '[testland.md](testland.md)'} = {}) {
  return {
    ...baseTree({
      'references/method.md': '# Method\n\nSee [packs](jurisdictions/README.md).\n',
    }),
    'references/jurisdictions/README.md': `# Packs\n\n- ${index}\n`,
    'references/jurisdictions/testland.md': packBody,
  };
}

test('a well-formed national pack passes', () => {
  expectPass(packTree(validPack()));
});

test('a pack missing from the index fails', () => {
  expectFail(packTree(validPack(), {index: 'nothing linked'}), /not linked from the pack index/);
});

test('a pack with no maintenance section fails', () => {
  expectFail(
    packTree(validPack().replace('## Pack maintenance', '## Something else')),
    /no "Pack maintenance" section/,
  );
});

test('a pack with no checked marker fails', () => {
  expectFail(
    packTree(validPack().replaceAll(/\[checked \d{4}-\d{2}-\d{2}\]/g, '[verified]')),
    /no \[checked YYYY-MM-DD\] marker/,
  );
});

test('a pack with no recheck date fails', () => {
  expectFail(
    packTree(validPack().replace('Next full recheck due', 'Maybe recheck sometime')),
    /no recheck due date/,
  );
});

test('a pack with no verification convention line fails', () => {
  expectFail(
    packTree(validPack().replace(/^Verification convention:.*$/m, 'Trust me.')),
    /no "Verification convention:" line/,
  );
});

test('two packs defining the markers differently fails', () => {
  // The vocabulary had drifted into three wordings, one saying "the source
  // page" — wrong now that many sources are PDFs. A reader opening one pack
  // must not get a different definition from a reader opening another.
  const tree = packTree(validPack({name: 'Aland'}), {
    index: '[a-land.md](a-land.md) [b-land.md](b-land.md)',
  });
  delete tree['references/jurisdictions/testland.md'];
  tree['references/jurisdictions/a-land.md'] = validPack({name: 'Aland'});
  tree['references/jurisdictions/b-land.md'] = validPack({name: 'Bland'}).replace(
    /^Verification convention:.*$/m,
    'Verification convention: something else entirely about the markers.',
  );

  const result = expectFail(tree, /must be defined identically in every pack/);
  assert.match(result.output, /b-land\.md/);
});

test('packs defining the markers identically pass', () => {
  const tree = packTree(validPack({name: 'Aland'}), {
    index: '[a-land.md](a-land.md) [b-land.md](b-land.md)',
  });
  delete tree['references/jurisdictions/testland.md'];
  tree['references/jurisdictions/a-land.md'] = validPack({name: 'Aland'});
  tree['references/jurisdictions/b-land.md'] = validPack({name: 'Bland'});
  expectPass(tree);
});

test('a pack with no "not advice" disclaimer fails', () => {
  expectFail(
    packTree(validPack().replace('Not advice. Verify before relying on it.', 'Trust this.')),
    /no "not advice" line/,
  );
});

test('a national pack missing a template section fails, and says which', () => {
  const result = expectFail(
    packTree(validPack().replace('## 4. Agreements and unfair terms', '## 4. Contracts')),
    /section 4 missing or off-template/,
  );
  // The message has to be actionable: it must point at the template.
  assert.match(result.output, /template in the pack index/);
});

test('a shared eu-* layer is not held to the national template', () => {
  // The naming convention is the whole mechanism, so it needs a test: an
  // eu-prefixed file skips the six sections but still needs the common rules.
  expectPass({
    ...baseTree({
      'references/method.md': '# Method\n\nSee [packs](jurisdictions/README.md).\n',
    }),
    'references/jurisdictions/README.md': '# Packs\n\n- [eu-fixture.md](eu-fixture.md)\n',
    'references/jurisdictions/eu-fixture.md': [
      '# Shared layer',
      '',
      'Not advice.',
      '',
      VALID_CONVENTION,
      '',
      'A claim. · **[checked 2026-11-10]**',
      '',
      '## Pack maintenance',
      '',
      'Next full recheck due: **2099-01-01**.',
      '',
    ].join('\n'),
  });
});

/** A pack with `line` inserted just under one of its section headings. */
function packWithLine(heading, line) {
  return packTree(validPack().replace(`${heading}\n`, `${heading}\n\n${line}\n`));
}

test('calling a non-authoritative host "primary legislation" fails and names the host', () => {
  // "Primary" must mean authoritative, not official. A Belgian e-invoicing FAQ
  // and three Belastingdienst pages were labelled "primary official", which
  // reads as though the statute had been read when it had not.
  const result = expectFail(
    packWithLine(
      '## 2. VAT — the fixture scheme',
      'Source: [KOR](https://www.belastingdienst.nl/kor) · *primary official* · **[checked 2026-11-10]**',
    ),
    /www\.belastingdienst\.nl/,
  );
  assert.match(result.output, /not known to serve authoritative text/);
  assert.match(result.output, /AUTHORITATIVE_TEXT_HOSTS/, 'the message must say how to allow a host');
});

test('an authoritative host may be called primary', () => {
  expectPass(
    packWithLine(
      '## 5. Ownership and permitted use',
      'Source: [art. 7 Aw](https://wetten.overheid.nl/BWBR0001886) · *primary legislation* · **[checked 2026-11-10]**',
    ),
  );
});

test('a Primary row in the maintenance table does not trip the host rule', () => {
  // The table has its own vocabulary and names no host, so judging it by the
  // same rule would fail every pack over a row that is correct.
  expectPass(packTree(validPack().replace('| Authority — fixture |', '| Primary — statute read |')));
});

test('the word primary with no link on the line is left alone', () => {
  // Without a URL there is no host to judge, and prose about primary sources
  // is not a citation.
  expectPass(
    packWithLine(
      '## 4. Agreements and unfair terms',
      'Source: the statute itself · *primary legislation, read on paper* · **[checked 2026-11-10]**',
    ),
  );
});

// --- Budgets and bulk — section 8 --------------------------------------------

test('SKILL.md over the always-loaded budget fails and says to move detail out', () => {
  const padding = '\nFiller line that exists only to inflate the file past 10 KB.';
  const result = expectFail(
    {...baseTree(), 'SKILL.md': baseTree()['SKILL.md'] + padding.repeat(250)},
    /over the 10 KB always-loaded budget/,
  );
  assert.match(result.output, /by \d+ bytes/, 'the message must quantify the overage');
});

test('a one-byte overage reports as one byte, not as exactly the budget', () => {
  // Because kb() rounds, this message used to read "10.0 KB is over the 10 KB
  // budget", which looks like the check contradicting itself.
  const base = baseTree();
  const padded = base['SKILL.md'] + 'x'.repeat(10 * 1024 + 1 - base['SKILL.md'].length);
  const result = expectFail({...base, 'SKILL.md': padded}, /by 1 byte/);
  assert.match(result.output, /10\.0 KB, over the 10 KB always-loaded budget by 1 byte/);
});

test('a single reference over the per-reference budget fails and says to split it', () => {
  const padding = '\nFiller line that exists only to inflate this reference past 48 KB.';
  const result = expectFail(
    {...baseTree(), 'references/method.md': VALID_REFERENCE + padding.repeat(800)},
    /over the 48 KB per-reference budget/,
  );
  assert.match(result.output, /split it rather than raising the budget/);
});

test('many small references do not trip the per-reference budget', () => {
  // The point of the per-reference budget: breadth is cheap because only one
  // reference loads per turn. If this ever fails, the budget has gone back to
  // penalising the number of packs.
  const files = baseTree({
    'references/method.md':
      '# Method\n\n' +
      Array.from({length: 40}, (_, i) => `See [p${i}](p${i}.md).`).join('\n') +
      '\n',
  });
  for (let i = 0; i < 40; i += 1) files[`references/p${i}.md`] = VALID_REFERENCE;
  expectPass(files);
});

test('test code is charged to its own budget, not the folder budget', () => {
  // The regression this split exists for: a fixture and a jurisdiction pack
  // used to draw on the same 512 KB, so a new test could block a new pack.
  const bulk = 'x'.repeat(200 * 1024);
  const result = withTree(
    {...baseTree(), 'scripts/test/huge.test.mjs': bulk},
    (root) => runCheck('check-skill.mjs', root),
  );
  assert.match(result.output, /test suite: 1 files/);
  assert.match(result.output, /over the 192 KB test-suite budget/);
  // The installed-folder figure must not include it.
  assert.match(result.output, /folder without tests: 2 files/);
});

test('a binary asset in the tree fails', () => {
  expectFail({...baseTree(), 'assets/logo.png': 'not really a png'}, /binary asset does not belong/);
});

// --- Line endings — section 9 ------------------------------------------------

test('a file converted to CRLF fails and says to normalise it', () => {
  // The defect this section exists for. A tool rewrote check-freshness.mjs with
  // the platform's line endings, and `git diff --stat` then reported 449
  // changed lines where 103 were real — an unreviewable diff, invisible in a
  // terminal, that nothing in the project objected to.
  const base = baseTree();
  const result = expectFail(
    {...base, 'references/method.md': base['references/method.md'].replaceAll('\n', '\r\n')},
    /uses CRLF line endings/,
  );
  assert.match(result.output, /references\/method\.md/, 'the message must name the file');
  assert.match(result.output, /every other file here uses LF/);
});

test('a file with only some CRLF lines is reported as mixed, with both counts', () => {
  // The harder case to spot by eye, and the one a half-applied edit produces.
  // Both counts go in the message because "mixed" alone does not say which way
  // to normalise.
  const base = baseTree();
  const result = expectFail(
    {...base, 'references/method.md': base['references/method.md'].replace('# Method', '# Method\r')},
    /mixes line endings/,
  );
  assert.match(result.output, /1 CRLF and \d+ LF/);
});

test('CRLF bytes inside a binary are not reported as a line-ending problem', () => {
  // A binary already fails section 8. Reading it as text and complaining about
  // its line endings too would add a second, misleading message about bytes
  // that are not lines at all.
  const result = expectFail(
    {...baseTree(), 'assets/icon.ttf': 'not really a font\r\nbut it has CRLF bytes\r\n'},
    /binary asset does not belong in a skill/,
  );
  assert.doesNotMatch(result.output, /line endings/);
});

// --- Reporting contract — cross-cutting, via lib/report.mjs ------------------

test('problems go to stderr and the happy path says nothing to stderr', () => {
  // CI and humans both rely on this split; it is easy to break by editing
  // report.mjs and never noticing.
  withTree(baseTree(), (root) => {
    const pass = runCheck('check-skill.mjs', root);
    assert.equal(pass.stderr.trim(), '');
    assert.match(pass.stdout, /^OK:/m);
  });

  withTree({...baseTree(), 'references/orphan.md': VALID_REFERENCE}, (root) => {
    const fail = runCheck('check-skill.mjs', root);
    assert.match(fail.stderr, /problem\(s\)/);
  });
});

test('several defects are all reported, not just the first', () => {
  // A check that stops at the first problem makes a contributor iterate once
  // per mistake. The report collects.
  const result = expectFail(
    {
      ...baseTree(),
      'references/method.md': '# Method\n\nSee [gone](missing.md). Run `npm ci` in Claude.\n',
    },
    /dead relative link/,
  );
  assert.match(result.output, /dependency install step/);
  assert.match(result.output, /names the host "Claude"/);
  assert.match(result.output, /3 problem\(s\)/);
});
