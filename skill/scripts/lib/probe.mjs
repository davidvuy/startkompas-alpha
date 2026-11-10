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

/** Hostname lookup failures, as opposed to a host that is up and unhappy. */
const UNRESOLVABLE = /ENOTFOUND|EAI_AGAIN|ERR_NAME/;

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
 * }} [deps]
 * @returns {Promise<{state: string, status?: number, location?: string|null, error?: string}>}
 */
export async function probeUrl(url, deps = {}) {
  const {
    fetchImpl = fetch,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    userAgent = 'startkompas-link-check',
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

  try {
    let response = await attempt('HEAD');
    if (HEAD_REFUSED.has(response.status)) response = await attempt('GET');

    const {status} = response;
    const state = classifyStatus(status);
    if (state === 'redirect')
      return {state, status, location: response.headers?.get?.('location') ?? null};
    return {state, status};
  } catch (error) {
    // A name that does not resolve is a dead citation. Anything else — a reset,
    // a timeout, a TLS complaint — is the network being the network.
    const cause = String(error?.cause ?? error);
    return {
      state: UNRESOLVABLE.test(cause) ? 'dead' : 'unreachable',
      error: String(error?.cause?.code ?? error?.name ?? 'Error'),
    };
  }
}

/** Report order: the things that need action first. */
export const STATE_ORDER = {dead: 0, unreachable: 1, blocked: 2, redirect: 3, other: 4, ok: 5};
