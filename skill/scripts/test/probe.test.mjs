// Where is the line between a dead citation and an awkward one?
//
// Every rule here was put in because a real official portal behaves that way.
// `fetch` is injected, so these tests make no network request and do not depend
// on any host staying up — a link checker whose own tests are flaky gets
// switched off, which is the failure mode this check exists to avoid.

import {test} from 'node:test';
import assert from 'node:assert/strict';

import {classifyStatus, probeUrl, STATE_ORDER, DEFAULT_TIMEOUT_MS} from '../lib/probe.mjs';

/** A fetch that answers with a fixed status, recording how it was called. */
function stubStatus(status, {location = null, headOnly = null} = {}) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({url, method: options.method});
    const answer = headOnly && options.method === 'HEAD' ? headOnly : status;
    return {
      status: answer,
      headers: {get: (name) => (name.toLowerCase() === 'location' ? location : null)},
    };
  };
  return {fetchImpl, calls};
}

// --- The status table --------------------------------------------------------

test('2xx is live', () => {
  for (const status of [200, 201, 204, 299]) assert.equal(classifyStatus(status), 'ok');
});

test('3xx is a redirect, not a failure', () => {
  // A moved source is worth updating the citation for; the evidence still
  // exists.
  for (const status of [301, 302, 303, 307, 308]) {
    assert.equal(classifyStatus(status), 'redirect');
  }
});

test('only 404 and 410 count as dead', () => {
  assert.equal(classifyStatus(404), 'dead');
  assert.equal(classifyStatus(410), 'dead');
  // Everything else in 4xx/5xx says something about the request or the server,
  // not about whether the document exists.
  for (const status of [400, 402, 405, 418, 451, 500, 502, 503]) {
    assert.notEqual(classifyStatus(status), 'dead');
  }
});

test('bot blocks and rate limits are blocked, not dead', () => {
  // This is the Légifrance case, and the single most important line in the
  // table: if a 403 failed the build, the check could not cite primary French
  // legislation at all.
  for (const status of [401, 403, 429]) assert.equal(classifyStatus(status), 'blocked');
});

test('anything unrecognised is reported rather than passed', () => {
  for (const status of [418, 500, 503]) assert.equal(classifyStatus(status), 'other');
});

test('report order puts the actionable states first', () => {
  const states = Object.entries(STATE_ORDER)
    .sort((a, b) => a[1] - b[1])
    .map(([state]) => state);
  assert.deepEqual(states, ['dead', 'unreachable', 'blocked', 'redirect', 'other', 'ok']);
  assert.ok(STATE_ORDER.dead < STATE_ORDER.ok, 'a human skimming must see dead links first');
});

// --- Probing behaviour -------------------------------------------------------

test('a probe uses HEAD, to avoid downloading multi-megabyte PDFs', () => {
  // Several cited sources are PDFs of several megabytes; a GET-first checker
  // would download all of them on every run.
  const {fetchImpl, calls} = stubStatus(200);
  return probeUrl('https://example.test/doc.pdf', {fetchImpl}).then((result) => {
    assert.equal(result.state, 'ok');
    assert.deepEqual(calls.map((call) => call.method), ['HEAD']);
  });
});

test('a server that refuses HEAD is retried with GET', async () => {
  for (const refusal of [405, 501]) {
    const {fetchImpl, calls} = stubStatus(200, {headOnly: refusal});
    const result = await probeUrl('https://example.test/page', {fetchImpl});
    assert.equal(result.state, 'ok', `HEAD ${refusal} should be retried`);
    assert.deepEqual(calls.map((call) => call.method), ['HEAD', 'GET']);
  }
});

test('a 405 that persists on GET is not reported as dead', async () => {
  const {fetchImpl} = stubStatus(405);
  const result = await probeUrl('https://example.test/page', {fetchImpl});
  assert.equal(result.state, 'other');
  assert.equal(result.status, 405);
});

test('a redirect carries its destination so the citation can be fixed', async () => {
  const {fetchImpl} = stubStatus(301, {location: 'https://example.test/new'});
  const result = await probeUrl('https://example.test/old', {fetchImpl});
  assert.equal(result.state, 'redirect');
  assert.equal(result.location, 'https://example.test/new');
});

test('a redirect with no Location header does not throw', async () => {
  const {fetchImpl} = stubStatus(302);
  const result = await probeUrl('https://example.test/old', {fetchImpl});
  assert.equal(result.state, 'redirect');
  assert.equal(result.location, null);
});

test('redirects are not followed', async () => {
  // Following them would hide the move and silently validate a different page.
  const {fetchImpl, calls} = stubStatus(301, {location: 'https://example.test/new'});
  await probeUrl('https://example.test/old', {fetchImpl});
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://example.test/old');
});

// --- Network failures --------------------------------------------------------

/** A fetch that rejects with an error carrying `code`. */
function stubError(code, name = 'TypeError') {
  return async () => {
    const error = new Error('fetch failed');
    error.name = name;
    error.cause = Object.assign(new Error(code), {code});
    throw error;
  };
}

test('a hostname that does not resolve is dead', async () => {
  // The host is gone, so the citation is gone.
  for (const code of ['ENOTFOUND', 'EAI_AGAIN']) {
    const result = await probeUrl('https://gone.test/x', {fetchImpl: stubError(code)});
    assert.equal(result.state, 'dead', `${code} should read as dead`);
    assert.equal(result.error, code);
  }
});

test('a connection reset or refusal is unreachable, not dead', async () => {
  // The host exists and is unhappy. Failing the build on this would make the
  // check hostage to every transient outage.
  for (const code of ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'CERT_HAS_EXPIRED']) {
    const result = await probeUrl('https://flaky.test/x', {fetchImpl: stubError(code)});
    assert.equal(result.state, 'unreachable', `${code} should read as unreachable`);
  }
});

test('an abort is unreachable and names itself', async () => {
  const fetchImpl = async (_url, options) =>
    new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => {
        const error = new Error('aborted');
        error.name = 'AbortError';
        reject(error);
      });
    });
  const result = await probeUrl('https://slow.test/x', {fetchImpl, timeoutMs: 10});
  assert.equal(result.state, 'unreachable');
  assert.equal(result.error, 'AbortError');
});

test('the timeout is enforced and does not outlive the request', async () => {
  // A leaked timer keeps the process alive after the check has finished, which
  // shows up as a hanging CI job rather than an error.
  const started = Date.now();
  const fetchImpl = async (_url, options) =>
    new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new Error('aborted')));
    });
  await probeUrl('https://slow.test/x', {fetchImpl, timeoutMs: 20});
  assert.ok(Date.now() - started < 1000, 'the probe should give up at its timeout');
});

test('a probe sends a user agent identifying the checker', async () => {
  // Several portals block requests with no user agent outright, which would
  // turn every source into a 403.
  let seen;
  const fetchImpl = async (_url, options) => {
    seen = options.headers;
    return {status: 200, headers: {get: () => null}};
  };
  await probeUrl('https://example.test/x', {fetchImpl});
  assert.match(seen['user-agent'], /startkompas/);
});

test('a response with no usable status is never classified as live', () => {
  // The same shape of bug as an invalid date in check-freshness: a comparison
  // against NaN or undefined is false, and the safe-looking branch is "ok".
  // Here the fall-through is 'other', which warns — so a broken response is
  // reported rather than silently counted as a working source.
  for (const status of [undefined, null, Number.NaN, 0, -1]) {
    assert.notEqual(classifyStatus(status), 'ok', `status ${String(status)} must not read as live`);
  }
});

test('the default timeout is long enough for a slow government portal', () => {
  // Stated as a decision rather than a magic number: official PDF endpoints are
  // routinely several seconds.
  assert.ok(DEFAULT_TIMEOUT_MS >= 10000, 'too short, and real sources start failing');
  assert.ok(DEFAULT_TIMEOUT_MS <= 30000, 'too long, and one dead host stalls the run');
});
