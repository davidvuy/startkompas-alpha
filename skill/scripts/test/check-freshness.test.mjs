// Does check-freshness.mjs actually notice a rotting pack?
//
// This check is the one that decides whether the packs can be trusted, and it
// is date-dependent, so every fixture here computes its dates relative to today
// rather than hardcoding them. A test that hardcodes 2026 starts failing in
// 2027 for no reason, and a check whose tests have been switched off is a check
// nobody is maintaining.

import {test} from 'node:test';
import assert from 'node:assert/strict';

import {runCheck, withTree, validPack} from './helpers.mjs';

const DAY = 86400000;

/** An ISO date `days` from today; negative is in the past. */
function isoDaysFromNow(days) {
  return new Date(Date.now() + days * DAY).toISOString().slice(0, 10);
}

/** Wrap a pack body in the directory layout the check expects. */
function packTree(packs) {
  const files = {'references/jurisdictions/README.md': '# Packs\n'};
  for (const [name, body] of Object.entries(packs)) {
    files[`references/jurisdictions/${name}`] = body;
  }
  return files;
}

function run(packs, args = []) {
  return withTree(packTree(packs), (root) => runCheck('check-freshness.mjs', root, {args}));
}

function expectPass(packs, args = []) {
  const result = run(packs, args);
  assert.equal(result.code, 0, `expected a pass, got:\n${result.output}`);
  return result;
}

function expectFail(packs, needle, args = []) {
  const result = run(packs, args);
  assert.notEqual(result.code, 0, `expected a failure, got a pass:\n${result.output}`);
  assert.match(result.output, needle);
  return result;
}

test('a fresh pack passes', () => {
  const result = expectPass({'testland.md': validPack({recheck: isoDaysFromNow(200)})});
  assert.match(result.output, /none stale/);
});

test('an overdue recheck fails and says by how many days', () => {
  expectFail(
    {'testland.md': validPack({recheck: isoDaysFromNow(-5)})},
    /recheck overdue by 5 days/,
  );
});

test('a recheck due soon warns but does not fail', () => {
  const result = expectPass({'testland.md': validPack({recheck: isoDaysFromNow(10)})});
  assert.match(result.output, /recheck due in 10 days/);
});

test('no recheck date fails', () => {
  expectFail(
    {'testland.md': validPack().replace(/Next full recheck due:.*/, 'Recheck whenever.')},
    /no "Next full recheck due" date/,
  );
});

test('a recheck date with the period inside the bold is not silently accepted', () => {
  // Regression: all four real packs once carried `**2027-05-10.**`, which the
  // parser does not match. The right behaviour is to fail loudly rather than
  // treat the pack as undated, and that is what caught it.
  expectFail(
    {
      'testland.md': validPack().replace(
        /Next full recheck due:.*/,
        'Next full recheck due: **2099-01-01.**',
      ),
    },
    /no "Next full recheck due" date/,
  );
});

test('an impossible recheck date fails instead of making the pack look fresh', () => {
  // The bug this guards: the marker regex accepts 2027-13-45, `new Date` makes
  // that an Invalid Date, and every comparison against NaN is false — so the
  // pack reported as perfectly fresh for ever. A typo in the one field that
  // exists to make staleness loud had been silencing it.
  for (const due of ['2027-13-45', '0000-00-00', '2027-02-30', '2026-11-31']) {
    expectFail(
      {'testland.md': validPack({recheck: due})},
      new RegExp(`recheck due date "${due}" is not a real date`),
    );
  }
});

test('an impossible checked date fails too', () => {
  // Same hazard on the other marker: a NaN age is never greater than the
  // staleness limit.
  expectFail(
    {
      'testland.md': validPack({recheck: isoDaysFromNow(200)}).replaceAll(
        '[checked 2026-11-10]',
        '[checked 2026-02-31]',
      ),
    },
    /"2026-02-31" is not a real date/,
  );
});

test('a leap day is accepted in a leap year and rejected otherwise', () => {
  // The round-trip check has to be exact, not approximate: 2028 is a leap year
  // and 2027 is not.
  expectPass({'testland.md': validPack({recheck: '2028-02-29'})});
  expectFail({'testland.md': validPack({recheck: '2027-02-29'})}, /not a real date/);
});

test('no checked marker at all fails', () => {
  expectFail(
    {'testland.md': validPack().replaceAll(/\[checked \d{4}-\d{2}-\d{2}\]/g, '[verified]')},
    /no \[checked YYYY-MM-DD\] claim at all/,
  );
});

test('a claim older than the staleness limit fails and gives its age', () => {
  const old = isoDaysFromNow(-200);
  expectFail(
    {
      'testland.md': validPack({recheck: isoDaysFromNow(200)}).replace(
        '**[checked 2026-11-10]**',
        `**[checked ${old}]**`,
      ),
    },
    /oldest verified claim is 200 days old/,
  );
});

test('a claim just inside the staleness limit passes', () => {
  // The boundary matters: an off-by-one here either nags constantly or never
  // fires. 183 days is the documented limit.
  expectPass({
    'testland.md': validPack({recheck: isoDaysFromNow(200)}).replace(
      '**[checked 2026-11-10]**',
      `**[checked ${isoDaysFromNow(-180)}]**`,
    ),
  });
});

test('a carried claim warns but does not fail', () => {
  const result = expectPass({
    'testland.md': validPack({recheck: isoDaysFromNow(200)}).replace(
      '## 2. VAT — the fixture scheme\n\nSomething.',
      `## 2. VAT — the fixture scheme\n\nSomething. · **[carried ${isoDaysFromNow(-30)}, not refetched]**`,
    ),
  });
  assert.match(result.output, /carries unrefetched claims/);
});

// --- Drift between the prose and the maintenance table -----------------------

test('open topics in the body with no table rows fails as table drift', () => {
  const pack = validPack({recheck: isoDaysFromNow(200), notResearched: 2}).replace(
    /\| Open topic \d+ \| — \| Not researched \|\n/g,
    '',
  );
  expectFail({'testland.md': pack}, /no "Not researched" row in the maintenance table/);
});

test('table rows with no body markers fails as the opposite drift', () => {
  const pack = validPack({recheck: isoDaysFromNow(200), notResearched: 2}).replace(
    /\n- Open topic \d+ is \*\*\[not researched\]\*\*\.\n/g,
    '',
  );
  expectFail({'testland.md': pack}, /claims gaps the prose has closed/);
});

test('open topics on both sides pass and are counted as a warning', () => {
  const result = expectPass({
    'testland.md': validPack({recheck: isoDaysFromNow(200), notResearched: 3}),
  });
  assert.match(result.output, /3 topic\(s\) marked \[not researched\] in the body, 3 row\(s\)/);
  assert.match(result.output, /3 open topic\(s\) named/);
});

// --- Flags and discovery -----------------------------------------------------

test('--report never fails, even on a stale pack', () => {
  const result = expectPass({'testland.md': validPack({recheck: isoDaysFromNow(-5)})}, [
    '--report',
  ]);
  assert.match(result.output, /1 stale/);
});

test('--json emits parseable JSON carrying the dates it parsed', () => {
  const result = expectFail(
    {'testland.md': validPack({recheck: isoDaysFromNow(-5)})},
    /recheck_due/,
    ['--json'],
  );
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.packs.length, 1);
  assert.equal(parsed.packs[0].pack, 'testland.md');
  assert.equal(parsed.packs[0].recheck_due, isoDaysFromNow(-5));
  assert.equal(parsed.packs[0].newest_checked, '2026-11-10');
});

test('--json with --report reports the problem but exits 0', () => {
  const result = expectPass({'testland.md': validPack({recheck: isoDaysFromNow(-5)})}, [
    '--json',
    '--report',
  ]);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.packs[0].problems.length, 1);
});

test('README.md in the packs directory is not treated as a pack', () => {
  // The index has no check dates and no template; counting it as a pack would
  // make the check fail permanently on a correct tree.
  const result = expectPass({'testland.md': validPack({recheck: isoDaysFromNow(200)})});
  assert.match(result.output, /1 pack\(s\)/);
});

test('a missing packs directory exits non-zero with a plain message', () => {
  const result = withTree({'SKILL.md': '# No packs here\n'}, (root) =>
    runCheck('check-freshness.mjs', root),
  );
  assert.notEqual(result.code, 0);
  assert.match(result.output, /No references\/jurisdictions directory/);
});

test('every pack is inspected, not just the first', () => {
  const result = expectFail(
    {
      'a-land.md': validPack({name: 'Aland', recheck: isoDaysFromNow(-3)}),
      'b-land.md': validPack({name: 'Bland', recheck: isoDaysFromNow(-9)}),
    },
    /a-land\.md/,
  );
  assert.match(result.output, /b-land\.md/);
  assert.match(result.output, /overdue by 9 days/);
});
