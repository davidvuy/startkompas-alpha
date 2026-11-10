# Jurisdiction packs

A jurisdiction pack is a dated, sourced answer set for one country or region. It exists so that country-specific requirements come from a checked primary source instead of model memory.

## Available packs

| Jurisdiction | File | Last checked | Covered from a read source | Open topics |
| --- | --- | --- | --- | --- |
| Belgium (federal; regional differences noted) | [belgium.md](belgium.md) | 2026-11-10 | Registration formalities, VAT exemption, B2B e-invoicing, unfair-terms structure, software ownership (3 rules), data protection roles and security | Black/grey list contents, Belgian DPA guidance |
| Netherlands | [netherlands.md](netherlands.md) | 2026-11-10 | Registration test and KVK→Belastingdienst link, KOR incl. invoicing duties, EU-KOR, B2B/B2G e-invoicing, data protection | Agreements, ownership, AP guidance, registration fees |
| Germany | [germany.md](germany.md) | 2026-11-10 | VAT §19 (primary law, quoted), B2B e-invoicing, BMF guidance points, data protection | Registration route, agreements/AGB, ownership, BDSG |
| France | [france.md](france.md) | 2026-11-10 | Registration portal, franchise thresholds (both years), e-invoicing, accredited-platform mandate, e-reporting, data protection | Agreements, ownership, CNIL guidance, e-reporting scope for micro |

No other pack exists yet. A missing pack, or a topic marked open inside a pack, is a gap in **coverage** — **never** a finding that no requirement exists.

## Why these cannot be generalized

Four neighbouring EU countries, one question — "must I send structured electronic invoices to my business customers?" — and four different answers as at 2026-11-10:

| | Must receive | Must issue (small founder) | How |
| --- | --- | --- | --- |
| Belgium | since 2026-01-01 | **already, since 2026-01-01** | Peppol network |
| France | since 2026-09-01 | from **2027-09-01** | **accredited platform mandatory**, plus a separate e-reporting obligation |
| Germany | since 2025-01-01 | from **2028-01-01** | **an email address suffices to receive**; BMF grace period ends 2026-12-31 |
| Netherlands | no domestic mandate | announced for **2030-07-01**, not yet law | Peppol recommended, not mandated |

Germany and France are the sharpest contrast: in Germany an email address satisfies the obligation, in France it cannot, because only an accredited platform may transmit. A single "EU answer" gets one of those two wrong by definition.

The small-business VAT exemption behaves differently in all four: Belgium does **not** exempt a founder from *issuing* structured e-invoices; Germany does **not** exempt them from *receiving*; the Netherlands has no mandate at all and its announced one reportedly **does** carve out KOR businesses.

Thresholds diverge just as much:

| | Small-business VAT threshold |
| --- | --- |
| Belgium | €25,000, rising €1,000/year from 2027 to €30,000 in 2031 |
| Netherlands | €20,000 domestic; €100,000 Union-wide for the EU-KOR, with a quarterly report |
| Germany | €25,000 previous year **and** €100,000 current year, both operative |
| France | €37,500 previous year / €41,250 current year for services; €85,000 / €93,500 for sales |

And the invoicing duty attached to the exemption inverts: a Dutch KOR user is **not required to issue an invoice at all**, while a Belgian founder under the exemption **must issue a structured electronic one**. Carrying either answer across a border produces a confidently wrong result.

Any skill that answers these from a single "EU" position is wrong in at least three countries. That is the reason packs exist.

## Using a pack

1. Establish the founder's country and region, the customers' country, and where the service is delivered. These can differ and each can matter.
2. If a pack matches, use it. Respect its `checked` date and its recorded conflicts.

   **Say so when a pack is stale.** If the pack is past its `Next full recheck due` date, or a claim's `recheck_trigger` has occurred, or its check date is older than roughly six months for anything consequential: still give the recorded figure, but tell the founder in the same breath that it is past its recheck date and needs confirming against the primary source before they rely on it. Recheck it yourself if the host can fetch. A stale pack that reads as authoritative is worse than no pack at all — never present its figures unqualified, and never quietly replace them with a figure from memory.
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
