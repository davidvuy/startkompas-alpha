# Jurisdiction packs

A jurisdiction pack is a dated, sourced answer set for one country or region. It exists so that country-specific requirements come from a checked primary source instead of model memory.

## Available packs

| Jurisdiction | File | Last checked | Coverage |
| --- | --- | --- | --- |
| Belgium (federal; Wallonia/Flanders/Brussels noted where they differ) | [belgium.md](belgium.md) | 2026-11-10 | Registration, VAT exemption, B2B e-invoicing, B2B contract terms, software ownership, data protection roles, security expectations |

No other pack exists yet. That is a gap in coverage, **never** a finding that another country has no requirements.

## Using a pack

1. Establish the founder's country and region, the customers' country, and where the service is delivered. These can differ and each can matter.
2. If a pack matches, use it. Respect its `checked` date and its recorded conflicts. If a claim's `recheck_trigger` has occurred, or the check date is older than roughly six months for anything consequential, recheck the primary source before relying on it.
3. Record what you used in the project's `sources` with the pack's URL and its check date — not with today's date, unless you actually refetched the page yourself.

## When no pack matches

Do not generalize from Belgium or from any other pack. Rules that look similar between neighbouring countries routinely differ in threshold, start date and scope. Instead:

1. Work from the universal topic list in [../pilot-conditions.md](../pilot-conditions.md). The **topics** are jurisdiction-neutral; only the answers are local.
2. For each topic the pilot actually depends on, identify the responsible official body for that jurisdiction (tax authority, business register, data-protection authority, economic affairs ministry) and check its own current page. Prefer the official body over an accountancy blog, a vendor page or a news article.
3. Record each claim using the `sources` shape in [../dossier-format.md](../dossier-format.md): URL, source type, what it covers, published/effective dates where stated, your check date, and a recheck trigger.
4. State plainly what you could not verify. An unchecked topic stays unresolved and keeps blocking the condition it blocks.
5. Never produce a number — a threshold, rate, deadline or fee — that you did not read in a source you actually fetched in this session or that is not recorded in a pack. If asked for one you cannot verify, say so and name the body that publishes it.

## Contributing a pack

A pack is only worth having if it is verifiable. Requirements:

- One file per jurisdiction, named for the country in English, lowercase (`netherlands.md`, `germany.md`).
- Every substantive claim carries: the official source URL, the source's own publication or effective date where stated, the date you checked it, and a recheck trigger.
- Record conflicts between sources rather than choosing a winner silently. A preserved conflict is more useful than a confident wrong answer — see the basic-management entry in the Belgium pack for the pattern.
- Mark the boundary of each claim: who it applies to, from when, and what it does not cover.
- Never copy substantial source text. Summarize in original words and link. Where copying is unavoidable, record the licence basis.
- Add the pack to the table above with its check date and coverage.
- A pack is preparation, not qualified advice. Say so in the pack.

## Review cadence

Packs rot. Thresholds move, obligations phase in, portals move URLs. A pack with a stale check date is a liability, because it reads as authoritative.

- Recheck anything with a scheduled change before its next step takes effect.
- Recheck the whole pack at least every six months and update its check date even when nothing changed — "checked and unchanged on <date>" is itself information.
- When a source URL dies, record the dead URL and the date it failed. Do not quietly replace it with a different page and keep the old date.
