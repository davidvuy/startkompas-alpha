// Deciding whether a cited source is gone, or merely awkward.
//
// This is the judgement that makes check-links worth running. Fail on too much
// and it becomes noise that someone switches off; fail on too little and a dead
// official source sits in a pack with its claim intact. Official portals 403
// bots, redirect constantly, reject HEAD and time out — none of which means the
// evidence has disappeared.
//
// Separated from check-links.mjs and given an injectable `fetch` so the whole
// table can be tested without a network or a server: a sandbox that blocks a
// child process from reaching a local listener would otherwise make these the
// only untestable rules in the project.

export const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Hostname lookups that are final: the name does not exist. A citation whose
 * host does not resolve has genuinely gone, so this is the one network-level
 * failure that fails the build.
 */
const UNRESOLVABLE = /ENOTFOUND|ERR_NAME/;

/**
 * `EAI_AGAIN` is POSIX for *temporary* failure in name resolution — the
 * resolver saying try again, not the name saying it does not exist. It was read
 * as `dead` until 2026-11-12, which meant one DNS hiccup reported a government
 * source as gone and failed the build. It is retried, and if it persists it is
 * `unreachable` like any other transient fault.
 */
const RESOLVER_BUSY = /EAI_AGAIN/;

/**
 * How many times a TRANSPORT failure is attempted in total. Measured on the
 * real citation set on 2026-11-12: the median probe takes 135 ms, no probe
 * reached the 15 s timeout, and two URLs on one host flipped
 * `unreachable → ok` between two back-to-back passes. So the flakiness is real
 * and a retry is close to free — a connection error returns in milliseconds,
 * not at the timeout.
 *
 * An abort from our own timeout is deliberately NOT retried: it already waited
 * the whole budget, and retrying it would double the worst case.
 */
export const DEFAULT_TRANSPORT_ATTEMPTS = 2;

/**
 * Map an HTTP status onto what it means for a citation.
 *
 * @param {number} status
 * @returns {'ok'|'redirect'|'dead'|'blocked'|'other'}
 */
export function classifyStatus(status) {
  if (status >= 200 && status < 300) return 'ok';
  if (status >= 300 && status < 400) return 'redirect';
  // 404 and 410 are the only statuses that assert the document is not there.
  if (status === 404 || status === 410) return 'dead';
  // Bot blocks and rate limits say nothing about whether the source exists.
  if (status === 401 || status === 403 || status === 429) return 'blocked';
  return 'other';
}

/** Statuses that mean "this server does not do HEAD", not "no such page". */
const HEAD_REFUSED = new Set([405, 501]);

/**
 * Probe one URL.
 *
 * @param {string} url
 * @param {{
 *   fetchImpl?: typeof fetch,
 *   timeoutMs?: number,
 *   userAgent?: string,
 *   transportAttempts?: number,
 * }} [deps]
 * @returns {Promise<{
 *   state: string, status?: number, location?: string|null, error?: string, attempts?: number,
 * }>}
 */
export async function probeUrl(url, deps = {}) {
  const {
    fetchImpl = fetch,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    userAgent = 'startkompas-link-check',
    transportAttempts = DEFAULT_TRANSPORT_ATTEMPTS,
  } = deps;

  /** One attempt with a hard timeout; redirects are reported, not followed. */
  async function attempt(method) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetchImpl(url, {
        method,
        redirect: 'manual',
        signal: controller.signal,
        headers: {'user-agent': userAgent},
      });
    } finally {
      clearTimeout(timer);
    }
  }

  /** Classify one transport failure, and say whether trying again could help. */
  function fromError(error) {
    const cause = String(error?.cause ?? error);
    const code = String(error?.cause?.code ?? error?.name ?? 'Error');
    if (UNRESOLVABLE.test(cause)) return {state: 'dead', error: code, retryable: false};
    // Our own timeout already waited the whole budget. Everything else — a
    // reset, a refusal, a TLS complaint, a busy resolver — is the network
    // being the network, and is worth one more go.
    const isOwnTimeout = code === 'AbortError' || code === 'TimeoutError';
    return {
      state: 'unreachable',
      error: code,
      retryable: !isOwnTimeout || RESOLVER_BUSY.test(cause),
    };
  }

  const total = Math.max(1, Math.trunc(transportAttempts) || 1);
  let last;
  for (let round = 1; round <= total; round += 1) {
    try {
      let response = await attempt('HEAD');
      if (HEAD_REFUSED.has(response.status)) response = await attempt('GET');

      const {status} = response;
      const state = classifyStatus(status);
      const attempts = round > 1 ? {attempts: round} : {};
      if (state === 'redirect')
        return {state, status, location: response.headers?.get?.('location') ?? null, ...attempts};
      return {state, status, ...attempts};
    } catch (error) {
      const {retryable, ...result} = fromError(error);
      last = round > 1 ? {...result, attempts: round} : result;
      if (!retryable) break;
    }
  }
  return last;
}

/** Report order: the things that need action first. */
export const STATE_ORDER = {dead: 0, unreachable: 1, blocked: 2, redirect: 3, other: 4, ok: 5};
