// lib/statutes.mjs decides which statute readings get compared with the
// version in force, and what the portal's redirect is taken to mean. Both
// halves are string work, so both are tested on strings — the network is not
// involved and must not be.
//
// The risk this guards is asymmetric. A missed citation means a pack can quote
// a rewritten article forever and nothing says so. A *wrongly* attributed
// version is worse: it sends a maintainer to reread a statute that has not
// changed, and the second time that happens they stop believing the check.

import test from 'node:test';
import assert from 'node:assert/strict';

import {statedStatuteVersions, currentVersion} from '../lib/statutes.mjs';

const doc = (text, label = 'pack.md') => [{label, text}];

test('a version stated in the source annotation is attributed to that line only', () => {
  const {statutes, unversioned} = statedStatuteVersions(
    doc(
      '- [arts. 6:233 and 6:235 BW](https://wetten.overheid.nl/BWBR0005289) · ' +
        '*read on the official portal in the version `Geldend van 16-07-2026`*\n',
    ),
  );
  assert.deepEqual(unversioned, []);
  const statute = statutes.get('https://wetten.overheid.nl/BWBR0005289');
  assert.equal(statute.id, 'BWBR0005289');
  assert.deepEqual([...statute.versions], [['2026-07-16', ['pack.md']]]);
});

test('a dated URL carries its own version, and the base URL is what gets probed', () => {
  const {statutes} = statedStatuteVersions(
    doc('Source: [art. 2 Auteurswet](https://wetten.overheid.nl/BWBR0001886/2026-01-01) · *read*\n'),
  );
  // The probe has to go to the UNDATED url: a dated one is already a version
  // and does not redirect, so it can say nothing about what is in force.
  const statute = statutes.get('https://wetten.overheid.nl/BWBR0001886');
  assert.ok(statute, 'the dated citation must be recorded under its undated base URL');
  assert.deepEqual([...statute.versions.keys()], ['2026-01-01']);
});

test('a version stated on a different line is not borrowed', () => {
  // eu-eprivacy.md introduces a reading with "Read in the version `Geldend van
  // 15-08-2026`:" some lines above the citation, and states it again beside
  // the link. Only the second one may count: attributing across lines would
  // guess, and a wrong staleness claim is worse than none.
  const {statutes, unversioned} = statedStatuteVersions(
    doc(
      'Read in the version `Geldend van 15-08-2026`:\n' +
        '\n' +
        'Source · [Telecommunicatiewet](https://wetten.overheid.nl/BWBR0009950) · *read*\n',
    ),
  );
  assert.equal(statutes.size, 0);
  assert.deepEqual(unversioned, [{id: 'BWBR0009950', document: 'pack.md'}]);
});

test('two documents claiming the same version are one entry with both names', () => {
  const line =
    '[UAVG](https://wetten.overheid.nl/BWBR0040940) · *the version `Geldend van 01-09-2026`*\n';
  const {statutes} = statedStatuteVersions([
    {label: 'netherlands.md', text: line},
    {label: 'netherlands-data-protection.md', text: line},
  ]);
  const statute = statutes.get('https://wetten.overheid.nl/BWBR0040940');
  assert.deepEqual(
    [...statute.versions],
    [['2026-09-01', ['netherlands.md', 'netherlands-data-protection.md']]],
  );
});

test('a statute cited at two versions keeps both, because one may be deliberate history', () => {
  const {statutes} = statedStatuteVersions(
    doc(
      '[current](https://wetten.overheid.nl/BWBR0005289) · *`Geldend van 16-07-2026`*\n' +
        '[as it stood](https://wetten.overheid.nl/BWBR0005289/2024-01-01) · *withdrawn claim*\n',
    ),
  );
  const statute = statutes.get('https://wetten.overheid.nl/BWBR0005289');
  assert.deepEqual([...statute.versions.keys()], ['2026-07-16', '2024-01-01']);
});

test('the Dutch day-month order is converted, not copied', () => {
  // `Geldend van 08-10-2026` is 8 October, and the portal's own paths are
  // ISO. Copying the digits across would compare 2026-08-10 with 2026-10-08
  // and report a stale statute on every reading made in the first twelve days
  // of a month.
  const {statutes} = statedStatuteVersions(
    doc('[art. 7:400 BW](https://wetten.overheid.nl/BWBR0005290) · *`Geldend van 08-10-2026`*\n'),
  );
  assert.deepEqual(
    [...statutes.get('https://wetten.overheid.nl/BWBR0005290').versions.keys()],
    ['2026-10-08'],
  );
});

test('non-Dutch citations and bare URLs are left alone', () => {
  const {statutes, unversioned} = statedStatuteVersions(
    doc(
      '[EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679) · *`Geldend van 01-01-2026`*\n' +
        'https://wetten.overheid.nl/BWBR0005289 in prose, not a link\n',
    ),
  );
  assert.equal(statutes.size, 0);
  assert.deepEqual(unversioned, []);
});

test('currentVersion reads the redirect, and refuses anything else', () => {
  assert.equal(
    currentVersion('BWBR0005289', {state: 'redirect', location: '/BWBR0005289/2026-07-16'}),
    '2026-07-16',
  );
  // Not a redirect: the portal answered, but said nothing about versions.
  assert.equal(currentVersion('BWBR0005289', {state: 'ok', status: 200}), null);
  assert.equal(currentVersion('BWBR0005289', {state: 'redirect', location: null}), null);
  // A redirect to somewhere else entirely — a login wall, a consent page, an
  // error path. The portal's answer is about a different document, so it is
  // not evidence about this one.
  assert.equal(
    currentVersion('BWBR0005289', {state: 'redirect', location: '/BWBR0009999/2026-07-16'}),
    null,
  );
  assert.equal(
    currentVersion('BWBR0005289', {state: 'redirect', location: '/error_path/400.html'}),
    null,
  );
  assert.equal(currentVersion('BWBR0005289', undefined), null);
});
