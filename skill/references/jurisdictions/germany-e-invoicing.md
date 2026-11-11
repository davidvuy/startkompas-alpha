# Germany — B2B e-invoicing in detail

Annex to [germany.md](germany.md) §3. That section states the obligation, the dates and the answer a founder needs; this file holds the sources behind it — §27(38) UStG, the three BMF letters, and the two UStDV provisions they rely on.

**Read §3 of the pack first.** Nothing here changes the dates there. What it adds is the text they come from, the carve-outs the summary cannot carry, and the `Randnummern` to cite.

This file exists because [germany.md](germany.md) outgrew the 48 KB per-reference budget that `scripts/check-skill.mjs` enforces, and e-invoicing was both the largest topic in it and the most self-contained. A reader asking about `AGB` should not pay for the BMF letters in the same turn.

**This annex is preparation, not advice.** Consequential steps need a German `Steuerberater` — tax advice is a regulated activity in Germany and this annex is not it.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

---

## §27(38) UStG — the transition as the statute actually writes it

Source: [§27 UStG, official consolidated law text](https://www.gesetze-im-internet.de/ustg_1980/__27.html) · *primary legislation* · **[checked 2026-11-11]**

The three BMF letters below explain this one paragraph. Read in the statute, it derogates from §14(1) and (2) in exactly three numbered cases:

| | Window | For a turnover executed | What is still allowed | Turnover limit |
| --- | --- | --- | --- | --- |
| **No. 1** | to **2026-12-31** | after 2024-12-31, before 2027-01-01 | Paper, **or** — with the recipient's consent — an electronic format that does not meet §14(1) sentence 6 | none |
| **No. 2** | to **2027-12-31** | after 2026-12-31, before 2028-01-01 | Paper, **or** — with consent — a non-conforming electronic format | `Gesamtumsatz` (§19(2)) of the **issuing** business in the **preceding** calendar year **not more than €800,000** |
| **No. 3** | to **2027-12-31** | after 2026-12-31, before 2028-01-01 | **EDI** under art. 2 of Commission Recommendation 94/820/EC, with consent | **none** |

Three things this table makes visible that the letters alone do not:

- **Every case is about issuing or transmitting.** §27(38) derogates from §14(1) and (2) and nowhere from the reception duty. That is the statutory ground under Rn. 62 of the 2024 letter, below: there is no transitional rule for **receiving**, because the statute grants none.
- **The €800,000 limit sits in no. 2 only.** No. 3 has no turnover condition, so in 2027 a business above €800,000 may **not** send paper but **may** still invoice by EDI if the recipient agrees. The letters state both reliefs without putting them side by side, and they are not symmetric.
- **Each case carries two dates**, one for when the turnover was executed and one for when the invoice may still be transmitted — and they do not overlap between the cases. A paper invoice **sent** in January 2027 for a December 2026 supply is past no. 1's transmission date, while no. 2 covers only turnovers executed after 2026-12-31. Whether anything closes that gap is **[not researched]**: Rn. 63 of the 2024 letter is phrased around the date the turnover was executed, so the BMF may read it more generously than the statute's wording does. Do not reassure a founder about a late paper invoice on the strength of this pack.

§27(38) closes with *"Die Absätze 15 und 18 bleiben unberührt"* — §27(15) and (18) are unaffected and were **[not researched]**.

## The three BMF letters — how to read them

All three were extracted and read in full on **2026-11-10**. They **amend**, not replace: each restates specific `Randnummern` of the previous letter, so all three are live and a citation belongs to an Rn., not to "the BMF".

**The three subsections below run newest first, deliberately.** The most recent letter carries the requirements in force, so a founder's answer is most likely there; read downwards for the history that produced it. The amend-not-replace structure is why the older letters still matter at all — the transitional rules a founder needs are only in the 2024 one.

| Date | Citation | Where in this pack | What it is mainly for |
| --- | --- | --- | --- |
| 15 October 2026 | GZ III C 5 - S 7287, from the letter | next, immediately below | Additional requirements, and the non-objection window that closes 2026-12-31 |
| 15 October 2025 | BStBl I S. 1806 (secondary); GZ III C 2 - S 7287-a/00019/007/243 from the letter | second | The Kleinunternehmer carve-out, the error taxonomy, retention |
| 15 October 2024 | **BStBl I S. 1320** — confirmed in the 2025 letter's own text | third | Rn. 62–65, where the transitional rules live |

## The 2026 letter — the additional requirements, and a window closing

Source: [BMF letter of 15 October 2026](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/Umsatzsteuer-Anwendungserlass/2026-10-15-obligatorische-elektronische-rechnung.pdf?__blob=publicationFile&v=2), *"Einführung der obligatorischen elektronischen Rechnung bei Umsätzen zwischen inländischen Unternehmern ab dem 1. Januar 2025 — Ergänzende Regelungen"*, GZ III C 5 - S 7287 · *administrative guidance, first-hand: the letter itself, PDF extracted and read* · **[checked 2026-11-10]**

**The non-objection period, in the letter's own terms.** An e-invoice issued **up to 31 December 2026** that conforms to the 2024 and 2025 letters but not to the *additional* requirements of the 2026 letter will not be objected to — *"auch für den Vorsteuerabzug"*, **including for input VAT deduction**.

That last clause is the practically important one: in that window a non-conforming invoice does not cost the **recipient** their deduction. And the window closes within weeks of this pack's check date.

**What must sit in the structured part.** The structured part must carry enough to serve the invoice's control function. Specifically, **`Leistungsart`, `Leistungsumfang`, `Leistungsgehalt`** and where relevant **`Leistungsort`** must appear there clearly enough to permit an abstract determination of the remaining tax bases — distinguishing a supply of goods from a service, establishing the place of supply, checking the applied rate — plus, in principle, entitlement to input VAT deduction.

**What may go in an embedded attachment**, and this is the line a service founder cares about: details **not required for the control function** may be sent in an embedded annex rather than the structured part. The letter's own example is *"Aufschlüsselung von Stundennachweisen"* — **a breakdown of time records**. So an hourly-billing founder does not need every logged hour in the structured data, provided the service type, scope and content are there.

Two further allowances a founder may meet:

- **Construction services:** where the `Leistungsverzeichnis` cannot be carried in the core data model, it is currently not objected to if the structured part lists only the individual trades with their sums, with a **human-readable embedded annex** giving the detail and a clear reference to it from the structured part.
- **Gross-price EN 16931 invoices** issued up to **31 December 2027**: the structured part may carry only the totals per tax rate and exemption, the rate and the tax amount, with the itemised description in a referenced human-readable annex.
- **Partial payments** under §14(5) UStG: deduct already-received amounts in the structured part as a sum in field **BT-113 (`Paid amount`)**, with the required detail in free-text field **BT-22 (`Invoice note`)**. The alternative unstructured-annex route from Rn. 48 of the 2024 letter may be used **until 2030-06-30**.

**Corrections must also be e-invoices.** Where an e-invoice obligation exists, a correction under §31(5) UStDV has to be issued as an e-invoice too, using the correction invoice type — though the letter notes the type is not yet technically settled.

## The 2025 letter — read, and it changes the answer for a Kleinunternehmer

Source: [BMF letter of 15 October 2025](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/Umsatzsteuer-Anwendungserlass/2025-10-15-einfuehrung-obligatorische-e-rechnung.pdf?__blob=publicationFile&v=5), GZ III C 2 - S 7287-a/00019/007/243, 33 pages · *administrative guidance, first-hand: the letter itself, PDF extracted and read* · **[checked 2026-11-10]**

**It amends the 2024 letter rather than replacing it** — it restates specific `Randnummern` of the 2024 letter with the changes in bold. So both remain live, and a citation to one of them is a citation to a specific Rn., not to "the BMF's position" generally.

**A Kleinunternehmer never has to issue an e-invoice.** Rn. 22, on §33 sentence 4, §34(1) sentence 2 and §34a sentence 4 UStDV: invoices whose **total does not exceed €250**, **invoices from Kleinunternehmer**, and passenger transport tickets may **always** (`immer`) be issued and transmitted as a `sonstige Rechnung`, by way of exception to §14(2) sentence 2 no. 1 UStG.

This is the most consequential line in these three letters for anyone this skill is likely to advise, and it cuts against the simple reading of the phase-in table in [germany.md](germany.md) §3:

- A founder under §19 UStG (see [germany.md](germany.md) §2) is **outside the issuing obligation entirely** — not deferred to 2028, outside it.
- The **receiving** obligation still applies in full. The two are separate duties, and only one of them has an exemption here.
- Any founder, exempt or not, may issue on paper for an invoice **at or under €250** — but see the carve-out in §33 UStDV immediately below, which the letter's summary of Rn. 22 does not mention.
- But an electronic invoice in a **non-e-invoice format** needs the **recipient's consent** (§14(1) sentence 5 UStG), while a proper e-invoice never does. So the safe default when in doubt is still to send a compliant e-invoice. What counts as consent is set out under Rn. 63 below.

### The €250 relief has a carve-out the letter does not state — §33 UStDV

Source: [§33 UStDV, official consolidated regulation text](https://www.gesetze-im-internet.de/ustdv_1980/__33.html) · *primary legislation* · **[checked 2026-11-11]**

§33 sentence 1 is the `Kleinbetragsrechnung`: an invoice whose **total** does not exceed €250 needs only the supplier's name and address, the date, the quantity and type supplied, and the `Entgelt` with the tax in one sum plus the rate — or a note that an exemption applies. Sentence 4 then lets such an invoice *"immer als sonstige Rechnung"* be transmitted, which is the relief the BMF restates.

**But sentence 3 removes sentences 1 and 2 entirely for invoices over supplies within the meaning of §3c, §6a and §13b UStG** — distance sales, intra-Community supplies of goods, and supplies where the **recipient** owes the tax under the reverse charge. An invoice for one of those is not *"eine Rechnung nach Satz 1"*, so sentence 4's relief does not reach it either. **At €40 as much as at €240.**

So "under €250 you can always send paper" is true for an ordinary domestic supply and false for a reverse-charge one. A founder whose pilot involves §13b should not be given the €250 shortcut. A **Kleinunternehmer** is unaffected either way: §34a has its own always-permitted route and no such carve-out, and §34a sentence 2 leaves §§33 and 34 standing alongside it.

**Who you are billing does not get you out of it.** Rn. 17: where the obligation does apply, it applies even when the **recipient** is a Kleinunternehmer, a farmer under §24, or makes only exempt turnovers — its example is someone letting a flat. It also covers `Gutschriften` (§14(2) sentence 5), reverse-charge supplies under §13b where both parties are domestic, §24 flat-rate agriculture, §25 travel services and §25a margin scheme, and applies where only **part** of what is billed falls under the duty.

**Three kinds of error, with three different consequences.** Rn. 6a, 6b and 35a draw a distinction worth keeping straight, because only one of them has VAT effect:

| | What it is | Consequence |
| --- | --- | --- |
| **Format error** | The file does not meet the permitted syntax, or a hybrid invoice does not permit correct and complete extraction. **Any** kind of format error counts | It is **not an e-invoice at all** — it becomes a `sonstige Rechnung` in another electronic format, so the obligation is not met |
| **Business-rule error** | The file breaks the format's business rules — an empty mandatory field such as `BT-10 Buyer reference`, or a tax amount that does not match the stated rate. Typically shows as a `critical Error` in validation | Depends on what it touches: where it is also a breach of the mandatory particulars of §14(4) or §14a UStG it is a content error; **otherwise it is `umsatzsteuerlich unbeachtlich`** — irrelevant for VAT. A missing `BT-10` is the letter's own example of an irrelevant one |
| **Content error** | A mandatory particular of §14(4) / §14a UStG is wrong or missing | A `nicht ordnungsmäßige Rechnung`. **And it can exist while validation passes clean** — the letter's example is a wrong tax rate |

**What follows for a founder, from Rn. 35a directly:**

- **Validate, and keep the report.** A trader observing the care of a prudent merchant **may rely** on the technical result of a suitable validation application as to format and business rules, and the letter suggests keeping the **validation report** as evidence. That is a cheap, concrete habit with a named basis.
- **Validation does not discharge your own check.** It supports, and does not replace, the recipient's duty to check the invoice for completeness and correctness. A clean validation and a wrong tax rate can coexist.

**Retention, from Rn. 60.** §14b(1) UStG: keep a copy of **every** incoming and outgoing invoice for **eight years**, with authenticity of origin, integrity of content and legibility preserved (§14(3) UStG). For an e-invoice, **at least the structured part** must be kept so that it is unaltered in its original form. Relief worth knowing: **for VAT purposes, storing and archiving e-invoices outside a GoBD-compliant system is not by itself a breach** of §14b(1) or of the integrity requirement. Retention for non-VAT purposes is governed by the GoBD letter of 2019-11-28, last amended 2025-07-14 — **[not researched]**.

**When a correction is needed at all.** Rn. 51a: a reduction of the taxable amount under §17 UStG does **not** require an invoice correction — its examples are discounts for early payment, allowances after a complaint that do not change what was supplied, and a supply being undone. Rn. 51b: a change in the **scope or content** of the service is not a mere change of taxable amount and does require a correction, at least of the service description; by prior agreement it may be done as a `Gutschrift` from the recipient, which must then refer specifically and unambiguously to the original invoice (§31(5) UStDV).

**And the outer edge of the transition is 2027-12-31, not 2026-12-31.** The letter's `Anwendungsregelung` applies its principles to all turnovers executed after **2024-12-31**, *"wobei die Übergangsregelungen bis zum 31. Dezember 2027 zu beachten sind"*, referring to Rn. 62 to 65 of the 2024 letter. The 2026-12-31 date above is the **non-objection period** for the 2026 letter's additional requirements — a different thing. Rn. 62 to 65 of the 2024 letter are set out in the next section, from the letter itself.

## The 2024 letter — where the transitional rules actually live

Source: [BMF letter of 15 October 2024](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/Umsatzsteuer-Anwendungserlass/2024-10-15-obligatorische-elektronische-rechnung.pdf?__blob=publicationFile&v=4), BStBl I S. 1320 · *administrative guidance, first-hand: the letter itself, PDF extracted and read* · **[checked 2026-11-10]**. The PDF is not at the path the filename pattern suggests; it is linked from the HTML landing page of the same name.

Rn. 62 to 65 are the transitional rules the later letters keep pointing at. In the letter's own terms:

- **Rn. 62 — there is no transition for receiving.** §27(38) UStG grants transitional rules only for **issuing**. *"Hinsichtlich des Empfangs einer E-Rechnung gilt keine Übergangsregelung"* — it must be ensured by the recipient from **2025-01-01**. This is the one date with no way around it, and §27(38) itself bears the letter out: all three of its cases derogate from issuing and transmitting, none from reception.
- **Rn. 63 — to the end of 2026, paper is always allowed.** For a turnover executed by then, an invoice may be issued as a `sonstige Rechnung`, and *"die Ausstellung und Übermittlung einer Papierrechnung ist bis dahin umsatzsteuerlich immer zulässig."* For another **electronic** format, the recipient's consent needs no particular form — mere `Einvernehmen` on the format suffices, and it can come from a **framework agreement, including the AGB**, or be given by conduct.
- **Rn. 64 — the €800,000 test, stated precisely.** If the **issuing** business's `Gesamtumsatz` within the meaning of §19 UStG in the **previous** calendar year was **not more than €800,000**, it may still issue a `sonstige Rechnung` for a turnover executed after 2026-12-31, **until the end of 2027**. Which turnover counts: for a VAT group, the **whole** `Organkreis`; for a `Gutschrift`, the **issuer of the Gutschrift**; where a third party not involved in the supply issues the invoice, the **principal's** turnover.
- **Rn. 65 — EDI survives to the end of 2027, for everyone.** Subject to the recipient's consent, invoicing by EDI under art. 2 of Commission Recommendation 94/820/EC remains possible for a turnover executed by then, where the invoice does not already meet §14(1) sentence 6 no. 1 or 2 UStG. Formats that do meet those requirements may be used after that deadline too. Note what Rn. 64 and Rn. 65 do **not** share: §27(38) no. 3 attaches **no turnover condition** to the EDI route, so the €800,000 test in Rn. 64 governs paper and other electronic formats only.
- **Rn. 67–68** apply the letter to all turnovers executed after 2024-12-31, and repeal the BMF letter of 2012-07-02, BStBl I S. 726, with effect from the end of 2024.

So the phase-in table in [germany.md](germany.md) §3 is **confirmed twice over** — from the administrative guidance here and from §27(38) UStG above — and the €800,000 threshold is keyed to `Gesamtumsatz` within the meaning of §19(2) in the **preceding** calendar year. For an invoice in 2027, that is 2026.

---

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| BMF letters 2024 (BStBl I 1320), 2025-10-15 (BStBl I 1806), 2026-10-15 (GZ III C 5 - S 7287) | 2026-11-10 | Authority — BMF letter of 2026-10-15 extracted and read |
| Non-objection to 2026-12-31 incl. input VAT deduction | 2026-11-10 | Authority — BMF letter read |
| Structured-part content rule; time records may go in an embedded annex | 2026-11-10 | Authority — BMF letter read |
| Construction, gross-price and partial-payment allowances; corrections as e-invoices | 2026-11-10 | Authority — BMF letter read |
| 2025 letter amends, not replaces, the 2024 letter; GZ III C 2 - S 7287-a/00019/007/243 | 2026-11-10 | Authority — BMF letter of 2025-10-15 extracted and read, 33 pages |
| 2024 letter's citation is **BStBl I S. 1320** | 2026-11-10 | Authority — confirmed in the 2025 letter's own text, a cross-reference inside the source |
| Rn. 22: ≤€250 invoices, **Kleinunternehmer invoices** and transport tickets may always be `sonstige Rechnung` | 2026-11-11 | Primary — the three UStDV provisions the letter names (§33 s. 4, §34(1) s. 2, §34a s. 4) were read; all three carry the `immer` wording |
| §33 UStDV sentence 3: the €250 relief does **not** apply to §3c, §6a or §13b supplies, so sentence 4 does not reach them either | 2026-11-11 | Primary — regulation read. The pack previously stated the €250 paper relief without this carve-out |
| Consent for a non-e-invoice electronic format: no form required, may be implied | 2026-11-10 | Authority — 2025 letter read, on §14(1) s. 5 UStG |
| Rn. 17: duty applies though the recipient is a Kleinunternehmer or wholly exempt; Gutschrift, §13b, §24, §25, §25a | 2026-11-10 | Authority — 2025 letter read |
| Rn. 6a/6b/35a: format vs business-rule vs content error, and their differing VAT effect | 2026-11-10 | Authority — 2025 letter read |
| May rely on a validation application; keep the validation report; it does not replace your own check | 2026-11-10 | Authority — 2025 letter read, Rn. 35a |
| Rn. 60: §14b(1) **eight-year** retention; structured part unaltered; non-GoBD storage not per se a breach | 2026-11-10 | Authority — 2025 letter read |
| Rn. 51a/51b: no correction for a mere §17 change; correction needed for a change of scope | 2026-11-10 | Authority — 2025 letter read |
| Transitional rules run to **2027-12-31**, distinct from the 2026-12-31 non-objection period | 2026-11-10 | Authority — the 2025 letter's Anwendungsregelung read |
| Rn. 62: **no** transitional rule for receiving; §27(38) covers issuing only | 2026-11-10 | Authority — 2024 letter extracted and read; wording quoted |
| Rn. 63: paper always permissible to end-2026; consent needs no form, AGB or conduct suffices | 2026-11-10 | Authority — 2024 letter read |
| Rn. 64: €800,000 is `Gesamtumsatz` per §19 in the **preceding** year; Organkreis / Gutschrift / third-party rules | 2026-11-10 | Authority — 2024 letter read; the phase-in table is now confirmed from the letter itself |
| Rn. 65: EDI under Recommendation 94/820/EC permitted to end-2027 with consent | 2026-11-10 | Authority — 2024 letter read |
| Rn. 68: BMF letter of 2012-07-02 (BStBl I S. 726) repealed from end-2024 | 2026-11-10 | Authority — 2024 letter read |
| §27(38) UStG: three derogation cases, all for issuing/transmitting; the €800,000 limit in no. 2 only; **no turnover limit on the EDI route** in no. 3 | 2026-11-11 | Primary — statute read and the three cases tabulated. It bears out Rn. 62 and sharpens Rn. 64/65 |
| Whether anything covers a paper invoice **transmitted** after 2026-12-31 for a 2026 turnover | — | Open — no. 1's transmission date has passed and no. 2's turnover window has not opened; the BMF may read Rn. 63 more generously |
| §27(15) and (18) UStG, left unaffected by §27(38) | — | Open — named by the statute, their text not read |
| GoBD letter of 2019-11-28 as amended 2025-07-14 (non-VAT retention) | — | Open — not yet researched |
| The phase-in dates, the reception duty, the accepted formats and the email-address relief | — | Elsewhere — stated and maintained in germany.md §3 |

Next full recheck due: **2027-05-10**. Earlier before 2026-12-31, when the BMF non-objection period ends, and before 2027-01-01 when the first issuing phase begins. Also before 2027-12-31, when the transitional rules of the 2024 letter run out.

No independent German legal, tax or security reviewer has reviewed this annex.
