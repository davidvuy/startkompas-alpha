// Does check-skill.mjs actually notice a broken skill?
//
// One test per rule it enforces. Each builds a tree that is correct except for
// the thing being tested, asserts a non-zero exit, and asserts the message
// names the problem — because an exit code alone does not tell a contributor
// what to fix.

import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {test} from 'node:test';
import assert from 'node:assert/strict';

import {baseTree, runCheck, scriptsDir, withTree, VALID_REFERENCE, VALID_CONVENTION, validAnnex, validPack} from './helpers.mjs';

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

// --- Annexes — a pack's own overflow file ------------------------------------
// `<country>-<topic>.md` beside `<country>.md` is an annex: exempt from the
// template, because it covers one section rather than six, but reachable only
// through its pack, so the pack must link it.

/** A pack plus an annex to it, both indexed, with `patch` applied to the pack. */
function annexTree(patch = (pack) => pack) {
  return {
    ...baseTree({
      'references/method.md': '# Method\n\nSee [packs](jurisdictions/README.md).\n',
    }),
    'references/jurisdictions/README.md':
      '# Packs\n\n- [testland.md](testland.md)\n- [testland-topic.md](testland-topic.md)\n',
    'references/jurisdictions/testland.md': patch(
      validPack().replace(
        '## 3. B2B e-invoicing — not in force',
        '## 3. B2B e-invoicing — not in force\n\nDetail in [testland-topic.md](testland-topic.md).',
      ),
    ),
    'references/jurisdictions/testland-topic.md': validAnnex(),
  };
}

test('an annex is not held to the national template', () => {
  expectPass(annexTree());
});

test('an annex its pack does not link fails, and names the pack', () => {
  // Being in the index is not enough. A reader who opened testland.md to
  // answer a question in section 3 would never learn the detail exists.
  const result = expectFail(
    annexTree((pack) => pack.replace('\n\nDetail in [testland-topic.md](testland-topic.md).', '')),
    /does not link it/,
  );
  assert.match(result.output, /testland\.md/);
});

test('an annex still has to carry the common pack rules', () => {
  const tree = annexTree();
  tree['references/jurisdictions/testland-topic.md'] = validAnnex().replace(
    'Next full recheck due',
    'Maybe recheck sometime',
  );
  expectFail(tree, /no recheck due date/);
});

test('a hyphenated name with no pack beside it is a national pack, not an annex', () => {
  // The parent is found by filename and nothing else, so the rule has to say
  // what happens when the prefix matches no pack: `a-land.md` stands alone and
  // the six sections still apply to it.
  const tree = {
    ...baseTree({
      'references/method.md': '# Method\n\nSee [packs](jurisdictions/README.md).\n',
    }),
    'references/jurisdictions/README.md': '# Packs\n\n- [a-land.md](a-land.md)\n',
    'references/jurisdictions/a-land.md': validAnnex(),
  };
  expectFail(tree, /section 1 missing or off-template/);
});

/** A shared `eu-` layer plus an annex to it, both indexed. */
function sharedAnnexTree({linked = true} = {}) {
  const layer = validAnnex({name: 'EU — testland layer'});
  return {
    ...baseTree({
      'references/method.md': '# Method\n\nSee [packs](jurisdictions/README.md).\n',
    }),
    'references/jurisdictions/README.md':
      '# Packs\n\n- [eu-testland.md](eu-testland.md)\n- [eu-testland-topic.md](eu-testland-topic.md)\n',
    'references/jurisdictions/eu-testland.md': linked
      ? layer.replace(
          '## The one topic this annex covers',
          '## The one topic this annex covers\n\nDetail in [eu-testland-topic.md](eu-testland-topic.md).',
        )
      : layer,
    'references/jurisdictions/eu-testland-topic.md': validAnnex({name: 'EU — testland topic'}),
  };
}

test('a shared layer may have an annex, and the layer must still link it', () => {
  // The regression: classifying by the `eu-` prefix first made
  // `eu-gdpr-fines.md` a shared layer, which skipped the only rule that keeps
  // an annex reachable. Finding the parent also has to look past the hyphen
  // inside `eu-gdpr`, or it resolves to an `eu.md` that does not exist.
  expectPass(sharedAnnexTree());
  const result = expectFail(sharedAnnexTree({linked: false}), /does not link it/);
  assert.match(result.output, /eu-testland\.md/);
});

// --- Cross-references by section number --------------------------------------
// `[other.md](other.md) §4` keeps resolving as a link after §4 becomes §5, so
// nothing breaks visibly and the reader is sent to the wrong section.

/** Two packs, one pointing into the other at `section`. */
function crossRefTree(section) {
  return {
    ...baseTree({
      'references/method.md': '# Method\n\nSee [packs](jurisdictions/README.md).\n',
    }),
    'references/jurisdictions/README.md':
      '# Packs\n\n- [testland.md](testland.md)\n- [otherland.md](otherland.md)\n',
    'references/jurisdictions/testland.md': validPack().replace(
      '## 3. B2B e-invoicing — not in force',
      `## 3. B2B e-invoicing — not in force\n\nSee [otherland.md](otherland.md) §${section}.`,
    ),
    'references/jurisdictions/otherland.md': validPack(),
  };
}

test('a section reference into another pack must name a section that exists', () => {
  expectPass(crossRefTree(2));
  const result = expectFail(crossRefTree(9), /has no "## 9\." heading/);
  assert.match(result.output, /renumbered/);
});

test('a statute reference is not mistaken for a section reference', () => {
  // "§19(6) UStG" and "§§8–9 GewStG" appear all over the packs with no link in
  // front of them, and a range is not a single section. Neither may fire.
  const tree = crossRefTree(1);
  tree['references/jurisdictions/testland.md'] = validPack().replace(
    '## 3. B2B e-invoicing — not in force',
    '## 3. B2B e-invoicing — not in force\n\nUnder §19(6) UStG and §§8–9 GewStG, see [otherland.md](otherland.md) §§1–2.',
  );
  expectPass(tree);
});

test('a hyphen inside a layer name does not make it an annex', () => {
  // `eu-vat-sme.md` has no `eu-vat.md` and no `eu.md` beside it, so the search
  // for a parent must come up empty and leave it a shared layer — which is
  // exempt from the six-section template.
  expectPass({
    ...baseTree({
      'references/method.md': '# Method\n\nSee [packs](jurisdictions/README.md).\n',
    }),
    'references/jurisdictions/README.md': '# Packs\n\n- [eu-two-words.md](eu-two-words.md)\n',
    'references/jurisdictions/eu-two-words.md': validAnnex({name: 'EU — two words'}),
  });
});

/** A pack with `line` inserted just under one of its section headings. */
function packWithLine(heading, line) {
  return packTree(validPack().replace(`${heading}\n`, `${heading}\n\n${line}\n`));
}

test('a marker carrying commentary inside the brackets fails', () => {
  // Two packs had grown a fourth marker form by putting prose inside the
  // brackets. The marker is the one thing in a pack that is parsed rather than
  // read — check-freshness pulls dates out of it — so a marker nobody holds to
  // the legend is a marker whose next variant may not parse at all.
  const result = expectFail(
    packWithLine(
      '## 1. Registration and formalities',
      'Something. · **[checked 2026-11-10, needs primary confirmation]**',
    ),
    /is not one of the three the legend defines/,
  );
  assert.match(result.output, /source-type note/, 'the message must say where the prose belongs');
});

test('an em-dashed aside inside a marker fails too', () => {
  expectFail(
    packWithLine(
      '## 1. Registration and formalities',
      'Something. · **[checked 2026-11-10 — primary source silent]**',
    ),
    /is not one of the three the legend defines/,
  );
});

test('all three defined marker forms pass, including the legend defining them', () => {
  // The legend itself contains [checked YYYY-MM-DD] and [carried YYYY-MM-DD,
  // not refetched] in order to define them, so the literal placeholder form
  // has to be accepted or every pack fails on its own legend.
  expectPass(
    packWithLine(
      '## 1. Registration and formalities',
      'Something. · **[carried 2026-05-01, not refetched]** and **[not researched]** elsewhere.',
    ),
  );
});

test('a malformed date inside an otherwise correct marker fails', () => {
  // `[checked 2026-11]` would slip past check-freshness, whose pattern needs a
  // full date to match at all — so the marker would simply not be counted.
  expectFail(
    packWithLine('## 1. Registration and formalities', 'Something. · **[checked 2026-11]**'),
    /is not one of the three the legend defines/,
  );
});

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

test('bulk in scripts/ fails the support budget, not the model-facing one', () => {
  // The folder total used to have a budget of its own, and a pack growing
  // tripped it with the message "something bulky got in" — which points a
  // maintainer at the wrong half. The two halves are now charged separately
  // and the total is derived, so each failure names the half that caused it.
  const result = withTree(
    {...baseTree(), 'scripts/vendor.mjs': 'x'.repeat(200 * 1024)},
    (root) => runCheck('check-skill.mjs', root),
  );
  assert.match(result.output, /over the 192 KB support budget/);
  assert.match(result.output, /scripts\/ \+ docs\//);
  // And it must not be reported as a model-facing problem, because the model
  // never reads it: the folder line carries the sum of the two budgets.
  assert.doesNotMatch(result.output, /model-facing budget/);

  // The folder figure must be exactly the parts added up. Asserted as
  // arithmetic rather than as a number, because the first version of this test
  // hard-coded 576 and broke the next time the model-facing budget moved —
  // which is the opposite of what a derived budget is for. It then caught the
  // assertion table being split out, which is the same check working.
  const budgetOf = (label) =>
    Number(new RegExp(`${label}: .* of (\\d+) KB`).exec(result.output)?.[1]);
  assert.equal(
    budgetOf('folder without tests'),
    budgetOf('model-facing total') + budgetOf('support files') + budgetOf('assertion table'),
  );
});

test('the assertion table is charged apart from the tooling that reads it', () => {
  // facts.mjs grows by one entry per verified claim. Charging it to the
  // support budget would let a newly verified fact compete with the scripts,
  // which is the mistake the test budget already exists to prevent.
  const result = withTree(
    {...baseTree(), 'scripts/lib/facts.mjs': 'x'.repeat(80 * 1024)},
    (root) => runCheck('check-skill.mjs', root),
  );
  assert.match(result.output, /over the 64 KB assertion-table budget/);
  assert.match(result.output, /re-derive this from the claim count/);
  // And it must not be counted twice: the support line excludes it.
  assert.match(result.output, /support files: 0 files, 0\.0 KB/);
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

test('the README documents the budget numbers the check enforces', () => {
  // `check-skill.mjs` says "Change a number there and here together", and until
  // 2026-11-12 that sentence was the only thing guarding it. The raise to
  // 640 KB landed while scripts/README.md still derived the installed-folder
  // total from 512, so the document explaining the budgets stated arithmetic
  // the code no longer did. An instruction nobody can run is not a guard.
  //
  // This reads the two files as text on purpose. The constants are not exported
  // — importing the check would run it — and the thing under test is whether
  // the prose and the code agree, which only their text can answer.
  const source = readFileSync(join(scriptsDir, 'check-skill.mjs'), 'utf8');
  const readme = readFileSync(join(scriptsDir, 'README.md'), 'utf8');

  const constant = (name) => {
    const found = source.match(new RegExp(`^const ${name} = ([0-9]+);`, 'm'));
    assert.ok(found, `${name} is no longer a plain numeric constant, so this test cannot read it`);
    return Number(found[1]);
  };

  const model = constant('MODEL_BUDGET_KB');
  const support = constant('SUPPORT_BUDGET_KB');
  const assertions = constant('ASSERTIONS_BUDGET_KB');
  const derivation = `**derived** as ${model} + ${support} + ${assertions} = ${model + support + assertions} KB`;
  assert.ok(
    readme.includes(derivation),
    `scripts/README.md derives the folder budget from stale numbers. It should contain:\n  ${derivation}`,
  );

  // Weaker, and deliberately so: a raise that never reached the document at
  // all is caught even where the number appears in no arithmetic.
  for (const name of [
    'ALWAYS_BUDGET_KB',
    'REFERENCE_BUDGET_KB',
    'MODEL_BUDGET_KB',
    'SUPPORT_BUDGET_KB',
    'TEST_BUDGET_KB',
    'ASSERTIONS_BUDGET_KB',
  ]) {
    const value = constant(name);
    assert.match(
      readme,
      new RegExp(`(^|[^0-9.])${value} KB`),
      `scripts/README.md never mentions ${value} KB, the current ${name} — document the raise`,
    );
  }
});
