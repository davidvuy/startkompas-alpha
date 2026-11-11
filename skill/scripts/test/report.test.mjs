// Unit tests for lib/report.mjs — the one reporting shape every check uses.
//
// Six checks share it, so its contract is theirs: a problem fails the run and
// goes to stderr, a warning never does, notes print before the verdict. CI and
// humans both rely on that split, and it is easy to break by editing one line.

import {test} from 'node:test';
import assert from 'node:assert/strict';

import {createReport} from '../lib/report.mjs';

/** Capture what a report prints, and whether it would fail the run. */
function capture(build) {
  const out = [];
  const err = [];
  const log = console.log;
  const error = console.error;
  const exitCode = process.exitCode;
  console.log = (...args) => out.push(args.join(' '));
  console.error = (...args) => err.push(args.join(' '));
  try {
    const report = createReport({ok: 'all good'});
    const returned = build(report);
    return {out: out.join('\n'), err: err.join('\n'), returned, exitCode: process.exitCode};
  } finally {
    console.log = log;
    console.error = error;
    process.exitCode = exitCode;
  }
}

test('a report with nothing wrong prints OK, returns true and sets no exit code', () => {
  const {out, err, returned, exitCode} = capture((report) => report.finish());
  assert.match(out, /^OK: all good$/m);
  assert.equal(err, '');
  assert.equal(returned, true);
  assert.notEqual(exitCode, 1);
});

test('a problem goes to stderr, returns false and sets exit code 1', () => {
  const {out, err, returned, exitCode} = capture((report) => {
    report.fail('somewhere', 'something is wrong');
    return report.finish();
  });
  assert.match(err, /1 problem\(s\)/);
  assert.match(err, /somewhere: something is wrong/);
  assert.ok(!out.includes('OK:'), 'a failing report must not also claim OK');
  assert.equal(returned, false);
  assert.equal(exitCode, 1);
});

test('a warning never fails the run', () => {
  const {out, returned, exitCode} = capture((report) => {
    report.warn('portal', '403 from a bot block');
    return report.finish();
  });
  assert.match(out, /1 warning\(s\) — reported, not failures/);
  assert.match(out, /portal: 403 from a bot block/);
  assert.equal(returned, true);
  assert.notEqual(exitCode, 1);
});

test('notes print before the verdict', () => {
  const {out} = capture((report) => {
    report.note('counted 7 things');
    return report.finish();
  });
  assert.ok(
    out.indexOf('counted 7 things') < out.indexOf('OK:'),
    'context is useless after the verdict',
  );
});

test('fail with no location omits the separator', () => {
  const {err} = capture((report) => {
    report.fail('', 'bare message');
    return report.finish();
  });
  assert.match(err, /- bare message/);
  assert.ok(!err.includes(': bare message'), 'an empty location should not leave a stray colon');
});

test('problemCount reflects failures only, not warnings', () => {
  capture((report) => {
    report.warn('a', 'w');
    assert.equal(report.problemCount, 0);
    report.fail('b', 'p');
    assert.equal(report.problemCount, 1);
    return report.finish();
  });
});
