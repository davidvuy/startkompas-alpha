# Jurisdiction packs

A jurisdiction pack is a dated, sourced answer set for one country or region. It exists so that country-specific requirements come from a checked primary source instead of model memory.

## Available packs

| Jurisdiction | File | Last checked | Covered from a read source | Open topics |
| --- | --- | --- | --- | --- |
| **EU — GDPR layer** (shared, not a country) | [eu-gdpr.md](eu-gdpr.md) | 2026-11-10 | Controller/processor test, processor-contract duties, sub-processor rule, **register duty with the four-condition art. 30(5) exemption**, 72-hour breach notification, security principle, **DPO and DPIA conditions**, **the six lawful bases** | Legitimate-interests balancing, transfers outside the EEA, data subject rights deadlines |
| **EU — small-enterprise VAT scheme** (shared, not a country) | [eu-vat-sme.md](eu-vat-sme.md) | 2026-11-10 | Directive (EU) 2020/285: the €85,000 ceiling and €100,000 Union cap, **prior notification and the `EX` number**, **the quarterly return**, both turnover definitions, **immediate cessation on a mid-year breach** | Exempt supplies in the turnover calculation; per-state implementation |
| **EU — AI Act** (shared, not a country) | [eu-ai-act.md](eu-ai-act.md) | 2026-11-10 | Four risk tiers, provider versus deployer, **what actually binds a small deployer** (art. 4 AI literacy and art. 50 transparency, both quoted), the phased dates — general applicability arrived 2026-08-02 | When a founder becomes a provider; whether marketing counts as public-interest text |
| Belgium (federal; regional differences noted) | [belgium.md](belgium.md) | 2026-11-10 | Registration formalities with the three-way competence conflict, VAT exemption with its enacting law, B2B e-invoicing, unfair-terms structure, software ownership (3 rules), GBA's named SME material | Black/grey list contents; the GBA publications' contents; Belgian national GDPR provisions |
| Netherlands | [netherlands.md](netherlands.md) | 2026-11-10 | Registration test, KVK→Belastingdienst link and the **€85.15 fee**, KOR incl. invoicing duties, EU-KOR, B2B/B2G e-invoicing, **art. 6:233 and 6:235 quoted**, **art. 7 Auteurswet**, AP's three duties | Identification documents and timeframe; client's permitted use and art. 8 Auteurswet; the Contourenbrief; AP stappenplan |
| Germany | [germany.md](germany.md) | 2026-11-10 | **§18 EStG and the Gewerbe/freier Beruf route**, VAT §19 quoted, B2B e-invoicing with BMF points, **§310(1) BGB plus the BGH Indizwirkung**, **§69b UrhG**, which Land authority is competent | `ingenieurähnlich` (open by nature); municipal Gewerbeanmeldung detail; trade-custom rebuttal; commissioned-work licence; BDSG |
| France | [france.md](france.md) | 2026-11-10 | **Guichet unique with the filing window, documents and zero cost**, franchise thresholds (both years), e-invoicing, accredited-platform mandate, e-reporting, **L442-1 I and art. 1171 as two routes**, **L113-9 CPI**, CNIL's SME offering | e-reporting scope for micro; L442-1/1171 interaction; client's permitted use and moral rights; CNIL's individual guides; the official start guide |

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

None of those is "the EU threshold". [eu-vat-sme.md](eu-vat-sme.md) records why: Directive (EU) 2020/285 art. 284(1) sets a **ceiling** of €85,000 on what a member state may choose, so France's sales figure sits exactly at the ceiling while the Netherlands chose a quarter of it. A founder asking for "the EU figure" is asking a question with no answer.

**One trap worth naming.** Germany's €100,000 is a **domestic, current-year** figure under §19 UStG. The directive's €100,000 is a **Union-wide, prior-year** cap for the cross-border exemption. Same number, unrelated rules — and a plausible place to be confidently wrong.

And the invoicing duty attached to the exemption inverts: a Dutch KOR user is **not required to issue an invoice at all**, while a Belgian founder under the exemption **must issue a structured electronic one**. Carrying either answer across a border produces a confidently wrong result.

Any skill that answers these from a single "EU" position is wrong in at least three countries. That is the reason packs exist.

### Four mechanisms for one idea — unfair terms between businesses

Every one of the four controls unreasonable standard terms between businesses. No two do it the same way, and the **remedy** differs, which is what actually matters to a founder deciding whether a clause is worth fighting.

| | Mechanism | Remedy |
| --- | --- | --- |
| Belgium | General norm **plus** a statutory black list (irrebuttable) and grey list (rebuttable), art. VI.91/3–91/5 WER | The term is unfair |
| Germany | The §§308/309 catalogue is **disapplied** in B2B by §310(1) BGB, but the general §307 test survives | The term is ineffective |
| Netherlands | Open test in art. 6:233 BW; the black and grey lists are **consumer-only**, but `reflexwerking` can import them for a small party. Art. 6:235 **excludes large parties** from the protection entirely | The term is voidable |
| France | **Two routes.** Art. L442-1 I C.com catches imposing — or **attempting** to impose — a `déséquilibre significatif`. Art. 1171 C.civ catches a **non-negotiable** clause in an adhesion contract, excluding the principal object and price adequacy | L442-1: **damages**. Art. 1171: the clause is **deemed unwritten** |

Two traps for anyone reasoning across borders:

- **"B2B means the lists don't apply" is the German answer, and only the German one.** In Belgium the lists apply between businesses by design.
- **Dutch protection depends on the founder's own size.** Under 50 employees and not publishing accounts, a founder is protected by 6:233 and may draw on the consumer lists. Past that, art. 6:235 removes the protection — the same clause, the same counterparty, a different outcome.

### Where the four actually converge — software ownership

Not everything diverges, and it is worth recording when it does not. All four give **employee-created** software to the employer by default, all four let a contract say otherwise, and **none of them transfers anything for commissioned work.**

| | Employee-created software | Mechanism | Commissioned work |
| --- | --- | --- | --- |
| Belgium | employer gets the economic rights | official guidance, `behoudens andersluidende overeenkomst` | only **usage rights** pass; transfer of ownership must be **explicit and in writing** |
| Netherlands | employer is **deemed the maker** | art. 7 Auteurswet, `fictief makerschap` | `overeenkomst van opdracht` does not qualify |
| Germany | employer alone exercises **all** economic rights | §69b UrhG, employment and service relationships | statute is **silent** — covers neither |
| France | rights **devolved** to the employer, incl. the documentation | art. L113-9 CPI | speaks only of `employés` |

The Dutch construction is the outlier in *mechanism*: the employer becomes the author, not merely the rights holder, so moral rights sit differently there.

**The consequence is the same in all four, and it matters for every founder using this skill.** A solo founder is a contractor, not their client's employee — so by default **they keep the rights** in what they build, and a client who wants them needs an express transfer. The mirror image also holds: a founder who *paid a freelancer* does not own the result merely by having paid.

This convergence is itself a verified finding, not an assumption. Each pack cites its own primary source; none borrows another's.

**What the client *does* get is a separate question, and all four now have an answer — but not to the same depth.** Three rest on primary legislation read per article; Belgium's rests on official guidance only, which the table says. Each reaches "write it down" by a different route, and the differences are drafting instructions, not trivia.

| | Rule on an unwritten or vague grant | Primary source |
| --- | --- | --- |
| Germany | **Purpose**. Where the types of use are not named, the scope is whatever the **shared contract purpose** implies | §31(5) UrhG |
| Netherlands | **Form, then narrow construction**. A transfer needs writing **and a deed** (`akte`, art. 3:95 BW); an exclusive licence needs writing; a non-exclusive licence needs no form. What is granted by the maker covers **only** what is expressly stated or **necessarily** follows from the agreement's nature and purport — and that protection is disapplied for an art. 7 or art. 8 maker, so it follows the human creator | art. 2(3) and 2(5) Auteurswet |
| France | **Itemisation, plus a floor that cannot be removed**. Each right transferred needs a **distinct mention**, and the domain of exploitation must be bounded as to **extent, destination, place and duration**. Separately, the lawful user keeps a statutory floor — use for its purpose, a backup copy, study and testing, interoperability decompilation — and stipulations against the last three are **void** | art. L131-3 and L122-6-1 CPI |
| Belgium | **Usage rights, and nothing more.** Official guidance states rights are *"niet automatisch overgedragen"* for commissioned software: by default only **usage rights** pass and the author keeps ownership, and a transfer of the economic rights must be **explicit and in writing**. What that default use *covers* is **[not researched]**, and no primary statute has been read for it | official guidance, not legislation |

Three things worth lifting out:

- **France is the only one of the three with a mandatory floor.** Elsewhere the question is what the contract implies; in France part of the answer is fixed whatever the contract says. A clause removing a client's backup copy or interoperability right is void, not merely unusual.
- **The Netherlands is the only one with a form requirement for ownership.** No deed, no transfer — so a Dutch founder cannot lose the copyright by invoice and a Dutch client cannot gain it by payment.
- **Germany and the Netherlands both read silence against the grantee; France reads it against the drafting.** Same practical instruction, three different failure modes.

The instruction that follows is the same in all four regardless: **name the types of use in writing.** Silence favours neither side; it just moves the decision to a court.

### Same deadline, different machinery — notifying a data breach

Art. 33 GDPR gives every member state the same 72 hours. **How you actually file inside those 72 hours is national, undocumented in the Regulation, and different enough to cost a founder the deadline.** Two authorities have been read at this level of detail:

| | How it is filed | What follows the first filing |
| --- | --- | --- |
| Belgium | **Two linked parts** on the GBA portal. Part 2 needs a business account, FAS authentication and the MijneGov role `GBA_Documentum_Vertegenwoordiger`. Part 1 can be filed with **no account**, using the KBO number | **21 calendar days** for part 2, reminders at 14 and 7 days. Cancellable until part 2 is filed, never after. Part 1 alone does **not** discharge the duty |
| Netherlands | **One online form, and only that form** — the AP accepts no notification by post or email. No account or role is needed | Mark it **provisional or definitive**. If provisional, the AP asks for a follow-up **within 4 weeks**; longer must be motivated. With no definitive notification you may not have met art. 33 |

Germany and France were **[not researched]** at this level — do not assume either resembles the two above.

What transfers from these two to any jurisdiction:

- **The deadline is not the only clock.** Both authorities expect a *completion* step weeks after the first filing, and in both it is the completion, not the first filing, that discharges art. 33. A founder who files inside 72 hours and stops is not finished.
- **Set the access up before you need it.** The Belgian route is the clearest case — the GBA itself warns the 72 hours can be lost to an unassigned role — but the general rule is to find out now what account, role or form your authority requires, and give more than one person the keys.
- **The register is the breach document.** Both authorities assume you can say *who is affected* on day one. Nothing else you have will tell you.

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

## The pack template

Two kinds of file live here, distinguished by name:

- **`eu-*.md` — a shared legal layer.** A rule that is identical across member states, stated once instead of four times. These have their own shape.
- **anything else — a national pack.** These must follow the six-section template below, so a reader finds the same topic in the same place in every country.

`scripts/check-skill.mjs` enforces the national template. If you reorder or rename a section, the build fails and names the section.

```
# <Country> — jurisdiction pack

Scope: ...                       who this pack is for
Out of scope: ...                what needs separate research
**This pack is preparation, not advice.**
Verification convention: ...     what [checked] and [not researched] mean

## 1. Registration and formalities
## 2. VAT — <the national scheme's own name>
## 3. B2B e-invoicing — <its current status>
## 4. Agreements and unfair terms
## 5. Ownership and permitted use
## 6. Data protection             national authority; link the shared EU layers

## Pack maintenance
| Claim | Check date | Status |   one row per substantive claim
Next full recheck due: **YYYY-MM-DD**.
<a line stating no independent reviewer has reviewed this pack>
```

Sections 2 and 3 take the local name and status after the dash. Sections 1, 4, 5 and 6 are fixed. Within a section, use the structure the existing packs use: a source line with its type and check date, then a table where there are distinct cases, then the practical consequence for a founder, then what remains open.

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
