# Germany — jurisdiction pack

Scope: a solo founder established in Germany, selling a digital service to German business customers, no employees, small bounded pilot.

Out of scope and requiring separate research: consumer (B2C) sales, employees or subcontractors, regulated professions and the `Handwerksordnung` trades, cross-border supply, physical goods, payment or financial services, health data.

**This pack is preparation, not advice.** Consequential steps need a German `Steuerberater` — tax advice is a regulated activity in Germany and this pack is not it.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

---

## 1. Registration and formalities

**One question decides the whole route: `Gewerbe` or `freier Beruf`?** It changes which body you register with, whether you join a chamber, and whether you pay trade tax. Establish it before proposing any administrative step.

### The distinction

Source: [§18 EStG, official consolidated law text](https://www.gesetze-im-internet.de/estg/__18.html) · *primary legislation* · **[checked 2026-11-10]**

§18(1) no. 1 covers *"die selbständig ausgeübte wissenschaftliche, künstlerische, schriftstellerische, unterrichtende oder erzieherische Tätigkeit"* — independently exercised scientific, artistic, writing, teaching or educational activity — plus an enumerated list of `Katalogberufe` (doctors, dentists, vets, lawyers, notaries, patent attorneys, **engineers, architects**, accountants, tax advisers, **journalists, translators** and others) **and `ähnliche Berufe`**, similar professions.

Anything self-employed that is not in §18 and not agriculture or forestry is normally a `Gewerbe`.

**For a software founder this is a genuinely open question, not a formality.** `Ingenieur` is a Katalogberuf, so developers often argue `ingenieurähnlich` — but that turns on the specific activity and qualifications, and a "similar profession" must share essentially all the defining features of the listed one. Do not decide it in a chat. Flag it as the question that determines everything below, and route it to a `Steuerberater`.

### What follows from each

Source: [IHK Köln — Gewerbe oder freier Beruf](https://www.ihk.de/koeln/hauptnavigation/gruendung-finanzierung-nachfolge/abgrenzung-freiberufler-vs-gewerbetreibende-5137676) · *chamber of commerce guidance* · **[checked 2026-11-10]**

| | `Freiberufler` | `Gewerbetreibender` |
| --- | --- | --- |
| Register with | **Finanzamt only** — apply for a `Steuernummer` directly | **Gewerbeamt** first, which issues a `Gewerbeschein` and notifies the Finanzamt |
| `Gewerbeanmeldung` | **Not required** | Required |
| Chamber membership | Not subject to IHK membership | Subject to IHK membership |
| `Gewerbesteuer` | **Not subject to it** | Subject, with a standard allowance of **€24,500** of profit per year before it applies |

**Who decides:** the competent `Finanzamt`, on the basis of the activity description in the `Fragebogen zur steuerlichen Erfassung` (filed via `ELSTER`). Its determination is decisive **regardless of how the founder describes themselves or whether they already registered with a Gewerbeamt**. A founder who assumed `Freiberufler` and is reclassified owes trade tax they did not plan for.

Also establish: the legal form; whether they already hold a `Steuernummer` and a VAT identification number; and whether the activity falls under the `Handwerksordnung`, which carries its own entry requirements and `HWK` membership.

**Open:** the specific documents, fees and processing times for a `Gewerbeanmeldung` vary by municipality and are **[not researched]**. The €24,500 allowance is from chamber guidance, not read in §11 GewStG. Do not state either as verified.

---

## 2. VAT — Kleinunternehmerregelung (§19 UStG)

Two thresholds apply **together**:

| Condition | Amount |
| --- | --- |
| Total turnover in the **previous** calendar year must not have exceeded | **€25,000** |
| Total turnover in the **current** calendar year must not exceed | **€100,000** |

Source: [§19 UStG, official consolidated law text](https://www.gesetze-im-internet.de/ustg_1980/__19.html) · *primary legislation* · **[checked 2026-11-10]**

§19(1) in full:

> *"Ein von einem im Inland oder in den in § 1 Absatz 3 bezeichneten Gebieten ansässigen Unternehmer bewirkter Umsatz im Sinne des § 1 Absatz 1 Nummer 1 ist steuerfrei, wenn der Gesamtumsatz nach Absatz 2 im vorangegangenen Kalenderjahr 25 000 Euro nicht überschritten hat und im laufenden Kalenderjahr 100 000 Euro nicht überschreitet."*

Both conditions must hold. Failing either ends the exemption — a frequent misreading, because the €100,000 figure circulates on its own.

§19(2) defines `Gesamtumsatz` by reference to `vereinnahmten Entgelten` (remuneration actually collected). Turnover from the sale of fixed assets is excluded. The regime applies to entrepreneurs resident in Germany or in the territories designated in §1(3) UStG.

### What the statute does not say — checked, not assumed

Three claims circulate widely in professional commentary: that the amounts are **net** rather than gross; that exceeding €100,000 **ends the exemption immediately** from the transaction that crosses it rather than at year end; and that the former **pro-rata projection** for a founding year no longer applies.

Read directly on 2026-11-10, **§19 UStG is silent on all three.** It states the two thresholds as conditions and gives no net/gross characterization, no mid-year consequence and no founding-year rule.

So those claims do not rest on §19 itself. They may follow from other provisions, from the transitional rules, or from administrative guidance — but **this pack has not identified their source**, and they must not be presented as statutory. For a founder near a threshold, mid-year behaviour is exactly the consequential question: send it to a `Steuerberater` rather than answering it from here. · **[checked 2026-11-10 — primary source silent, secondary basis unidentified]**

Effect of the regime: no VAT on invoices, and **no input VAT deduction** in return.

**One further effect, and it is easy to miss: a Kleinunternehmer is outside the e-invoice *issuing* obligation altogether.** Not deferred — exempt, under §34a sentence 4 UStDV as the BMF reads it. The duty to be *able to receive* one still applies in full. See §3 below; do not answer an e-invoicing question for a German founder before settling their §19 status.

Recheck triggers: turnover approaching either threshold; the start of a new calendar year; the founding year specifically, where the projection question matters.

---

## 3. B2B e-invoicing — receiving already mandatory, issuing phased to 2028

Sources · **[checked 2026-11-10]**
- [European Commission — eInvoicing in Germany](https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108886/eInvoicing+in+Germany) · *official EU source*
- The three BMF letters themselves · *administrative guidance, first-hand* — cited individually below. A chamber-of-commerce summary was used before they were read and has been **dropped**, because every claim it supported is now taken from the letters.

| Date | Obligation |
| --- | --- |
| **2025-01-01** | Every business must be **able to receive** EN 16931-compliant structured e-invoices for domestic B2B |
| **2027-01-01** | Businesses with 2026 turnover above **€800,000** must **issue**; paper invoices become prohibited for them |
| **2028-01-01** | The issuing obligation applies to **all** remaining businesses |

**This table is the phase-in, not the whole answer.** Some invoices and some issuers are carved out of the issuing obligation permanently — including **every Kleinunternehmer** and **every invoice at or under €250**. See *The 2025 letter* below before applying a date from this table.

**The receiving obligation is in force and it includes Kleinunternehmer.** Every business registered for German VAT, including those exempt under §19 UStG, must be able to receive a structured e-invoice. A founder who cannot accept one is already non-compliant on that point.

**Practical relief worth knowing: an email address is sufficient** to meet the reception requirement, per the EC page. Receiving does not require buying a platform. Do not push a founder toward a paid product to satisfy an obligation an email address already satisfies — and note this is the opposite of the French position, where an accredited platform is mandatory.

Accepted formats: **XRechnung** (the national standard), **ZUGFeRD 2.2.0** (XRechnung profile), and **Peppol BIS Billing 3.0** — all conforming to EN 16931.

Legal basis: the `Wachstumschancengesetz` (Growth Opportunities Act), adopted **2024-03-22**, codified in **§14(2) and §27(38) UStG**.

### The three BMF letters — how to read them

All three were extracted and read in full on **2026-11-10**. They **amend**, not replace: each restates specific `Randnummern` of the previous letter, so all three are live and a citation belongs to an Rn., not to "the BMF".

**The three subsections below run newest first, deliberately.** The most recent letter carries the requirements in force, so a founder's answer is most likely there; read downwards for the history that produced it. The amend-not-replace structure is why the older letters still matter at all — the transitional rules a founder needs are only in the 2024 one.

| Date | Citation | Where in this pack | What it is mainly for |
| --- | --- | --- | --- |
| 15 October 2026 | GZ III C 5 - S 7287, from the letter | next, immediately below | Additional requirements, and the non-objection window that closes 2026-12-31 |
| 15 October 2025 | BStBl I S. 1806 (secondary); GZ III C 2 - S 7287-a/00019/007/243 from the letter | second | The Kleinunternehmer carve-out, the error taxonomy, retention |
| 15 October 2024 | **BStBl I S. 1320** — confirmed in the 2025 letter's own text | third | Rn. 62–65, where the transitional rules live |

### The 2026 letter — the additional requirements, and a window closing

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

### The 2025 letter — read, and it changes the answer for a Kleinunternehmer

Source: [BMF letter of 15 October 2025](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/Umsatzsteuer-Anwendungserlass/2025-10-15-einfuehrung-obligatorische-e-rechnung.pdf?__blob=publicationFile&v=5), GZ III C 2 - S 7287-a/00019/007/243, 33 pages · *administrative guidance, first-hand: the letter itself, PDF extracted and read* · **[checked 2026-11-10]**

**It amends the 2024 letter rather than replacing it** — it restates specific `Randnummern` of the 2024 letter with the changes in bold. So both remain live, and a citation to one of them is a citation to a specific Rn., not to "the BMF's position" generally.

**A Kleinunternehmer never has to issue an e-invoice.** Rn. 22, on §33 sentence 4, §34(1) sentence 2 and §34a sentence 4 UStDV: invoices whose **total does not exceed €250**, **invoices from Kleinunternehmer**, and passenger transport tickets may **always** (`immer`) be issued and transmitted as a `sonstige Rechnung`, by way of exception to §14(2) sentence 2 no. 1 UStG.

This is the most consequential line in these three letters for anyone this skill is likely to advise, and it cuts against the simple reading of the phase-in table above:

- A founder under §19 UStG (see §2) is **outside the issuing obligation entirely** — not deferred to 2028, outside it.
- The **receiving** obligation still applies in full. The two are separate duties, and only one of them has an exemption here.
- Any founder, exempt or not, may issue on paper for an invoice **at or under €250**.
- But an electronic invoice in a **non-e-invoice format** needs the **recipient's consent** (§14(1) sentence 5 UStG), while a proper e-invoice never does. So the safe default when in doubt is still to send a compliant e-invoice. What counts as consent is set out under Rn. 63 below.

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

**And the outer edge of the transition is 2027-12-31, not 2026-12-31.** The letter's `Anwendungsregelung` applies its principles to all turnovers executed after **2024-12-31**, *"wobei die Übergangsregelungen bis zum 31. Dezember 2027 zu beachten sind"*, referring to Rn. 62 to 65 of the 2024 letter. The 2026-12-31 date above is the **non-objection period** for the 2026 letter's additional requirements — a different thing. Rn. 62 to 65 of the 2024 letter were **[not researched]**: that letter could not be retrieved (see the maintenance table), so the transitional rules are named here but not stated.

### The 2024 letter — where the transitional rules actually live

Source: [BMF letter of 15 October 2024](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/Umsatzsteuer-Anwendungserlass/2024-10-15-obligatorische-elektronische-rechnung.pdf?__blob=publicationFile&v=4), BStBl I S. 1320 · *administrative guidance, first-hand: the letter itself, PDF extracted and read* · **[checked 2026-11-10]**. The PDF is not at the path the filename pattern suggests; it is linked from the HTML landing page of the same name.

Rn. 62 to 65 are the transitional rules the later letters keep pointing at. In the letter's own terms:

- **Rn. 62 — there is no transition for receiving.** §27(38) UStG grants transitional rules only for **issuing**. *"Hinsichtlich des Empfangs einer E-Rechnung gilt keine Übergangsregelung"* — it must be ensured by the recipient from **2025-01-01**. This is the one date with no way around it.
- **Rn. 63 — to the end of 2026, paper is always allowed.** For a turnover executed by then, an invoice may be issued as a `sonstige Rechnung`, and *"die Ausstellung und Übermittlung einer Papierrechnung ist bis dahin umsatzsteuerlich immer zulässig."* For another **electronic** format, the recipient's consent needs no particular form — mere `Einvernehmen` on the format suffices, and it can come from a **framework agreement, including the AGB**, or be given by conduct.
- **Rn. 64 — the €800,000 test, stated precisely.** If the **issuing** business's `Gesamtumsatz` within the meaning of §19 UStG in the **previous** calendar year was **not more than €800,000**, it may still issue a `sonstige Rechnung` for a turnover executed after 2026-12-31, **until the end of 2027**. Which turnover counts: for a VAT group, the **whole** `Organkreis`; for a `Gutschrift`, the **issuer of the Gutschrift**; where a third party not involved in the supply issues the invoice, the **principal's** turnover.
- **Rn. 65 — EDI survives to the end of 2027.** Subject to the recipient's consent, invoicing by EDI under art. 2 of Commission Recommendation 94/820/EC remains possible for a turnover executed by then, where the invoice does not already meet §14(1) sentence 6 no. 1 or 2 UStG. Formats that do meet those requirements may be used after that deadline too.
- **Rn. 67–68** apply the letter to all turnovers executed after 2024-12-31, and repeal the BMF letter of 2012-07-02, BStBl I S. 726, with effect from the end of 2024.

So the phase-in table at the top of this section is **confirmed from the primary guidance**, and the €800,000 threshold is keyed to `Gesamtumsatz` in the **preceding** calendar year — for an invoice in 2027, that is 2026.

For a solo founder the practical reading, in order:

1. **Be able to receive now.** This applies to everyone, Kleinunternehmer included, and an email address satisfies it.
2. **Check §19 before anything else.** A Kleinunternehmer is outside the issuing obligation by Rn. 22, whatever the phase-in dates say.
3. **Otherwise: issue from 2028-01-01**, or from 2027-01-01 if 2026 turnover exceeded €800,000. Confirm against the founder's actual turnover rather than assuming the later phase.
4. **Validate what you send and keep the report.** Then still read the invoice.

Recheck triggers: 2026 turnover approaching €800,000; **before 2026-12-31**, when the non-objection period ends; before 2027-01-01, 2027-12-31 and 2028-01-01; any further BMF letter.

---

## 4. Agreements and unfair terms

**B2B is not unregulated, but the lists are switched off.**

Source: [§310(1) BGB, official consolidated law text](https://www.gesetze-im-internet.de/bgb/__310.html) · *primary legislation* · **[checked 2026-11-10]**

Where standard terms (`AGB`) are used towards an `Unternehmer`, §310(1) disapplies **§305(2) and (3), §308 numbers 1 and 2 to 9, and the whole of §309** — that is, almost all of the specific prohibited-clause catalogue.

**But §307(1) and (2) still apply**: the general test, that a term is ineffective if it unreasonably disadvantages the other party contrary to good faith. §310(1) also requires that *"auf die im Handelsverkehr geltenden Gewohnheiten und Gebräuche ist angemessen Rücksicht zu nehmen"* — appropriate consideration for trade customs and practices.

So a founder cannot conclude "they are a business, anything goes". The catalogue is gone; the standard is not.

### The catalogue comes back in through the general test

**`Indizwirkung` — now verified, and it changes the practical answer.**

The BGH holds that the strict clause prohibitions in §§308 and 309 carry an **indicative effect for invalidity under §307 in business dealings too**. A clause that would be prohibited against a consumer is therefore a **strong indication** that it unreasonably disadvantages a business counterparty as well.

Source: BGH, NJW 2007, 3774 (VIII ZR 141/06) · *consistent professional commentary and chamber guidance; the judgment itself was not read* · **[checked 2026-11-10]**

So the practical position is neither "the lists apply" nor "anything goes":

1. §310(1) disapplies the catalogue **directly**.
2. §307 still applies.
3. The catalogue returns as **evidence** under §307 — not decisive, but a serious starting presumption against the clause.

**For a founder drafting terms, treat §§308/309 as the list of clauses most likely to fail**, even in B2B. A blanket liability waiver is the standard example. The "it's B2B so the lists don't apply" reasoning is half an answer and the dangerous half.

**Open:** the judgment itself was not read, and how far the indication can be rebutted by trade custom under §310(1)'s `Gewohnheiten und Gebräuche` clause is case-specific and **[not researched]**.

Use [../pilot-conditions.md](../pilot-conditions.md) §3 for the discussion sheet. Never draft a blanket liability waiver, a unilateral acceptance clause, an automatic renewal or an invented service guarantee — §307 is exactly where those fail. Leave enforceability to a German lawyer.
---

## 5. Ownership and permitted use

Source: [§69b UrhG, official consolidated law text](https://www.gesetze-im-internet.de/urhg/__69b.html) · *primary legislation* · **[checked 2026-11-10]**

> *"Wird ein Computerprogramm von einem Arbeitnehmer in Wahrnehmung seiner Aufgaben oder nach den Anweisungen seines Arbeitgebers geschaffen, so ist ausschließlich der Arbeitgeber zur Ausübung aller vermögensrechtlichen Befugnisse an dem Computerprogramm berechtigt"* — §69b(1)

| Situation | Rule |
| --- | --- |
| Created by an **employee** in performance of their duties, or on the employer's instructions | The **employer alone** is entitled to exercise **all** economic rights |
| Created in a **service relationship** (`Dienstverhältnis`) | Same, per §69b(2) |
| **Commissioned / freelance** work | **The statute is silent.** §69b covers only employment and service relationships, so it does not transfer anything for a contractor. |

Practical consequence for a solo founder: §69b does **not** apply to you, because you are not your client's employee. The default is therefore that **you keep the economic rights** in commissioned software, and a client who wants them needs an express assignment. Conversely, a founder who *paid a freelancer* does not thereby own the result — §69b gives them nothing.

### What the client actually gets instead — §31(5) UrhG

Source: [§31 UrhG, official consolidated law text](https://www.gesetze-im-internet.de/urhg/__31.html) · *primary legislation* · **[checked 2026-11-10]**

Since §69b does not transfer anything for commissioned work, the client's position rests on the licence actually granted — and German law reads an unspecified grant **narrowly**.

**The `Zweckübertragungsregel` in §31(5):** where the types of use (`Nutzungsarten`) are not specifically named, the scope is determined by *"der von beiden Partnern zugrunde gelegte Vertragszweck"* — the contract purpose **both** parties had in mind. The same test decides whether the right is simple or exclusive, how far it extends, and what restrictions apply.

§31(1)–(3) distinguish the two kinds of grant:

| | What the holder may do |
| --- | --- |
| **Simple** (`einfaches Nutzungsrecht`) | Use the work as permitted, *"ohne dass eine Nutzung durch andere ausgeschlossen ist"* — others may use it too |
| **Exclusive** (`ausschließliches Nutzungsrecht`) | Use it *"unter Ausschluss aller anderen Personen"*, and grant further rights to third parties. The author may reserve specific uses for themselves |

**Practical consequence, and it cuts both ways.** A client who commissioned software for their own internal use does **not** automatically acquire the right to resell it, sublicense it or use it for a different purpose — the grant reaches only as far as the shared contract purpose. Equally, a founder who writes nothing down does not keep everything: whatever the agreed purpose implies has passed.

So the useful instruction is not "you keep your rights" but: **name the types of use in writing**. Silence does not favour either party; it just makes the answer turn on what a court decides the purpose was.

### The floor §31(5) cannot reach — §69d and §69g(2)

Sources: [§69d UrhG](https://www.gesetze-im-internet.de/urhg/__69d.html) and [§69g UrhG](https://www.gesetze-im-internet.de/urhg/__69g.html) · *primary legislation read and quoted* · **[checked 2026-11-10]**

§31(5) decides what the *contract* conveys. Separately, §69d gives whoever is entitled to use a copy a set of acts needing no consent, and **§69g(2) makes a contrary term void**: *"Vertragliche Bestimmungen, die in Widerspruch zu § 69d Absatz 2, 3, 5 oder 7 oder zu § 69e stehen, sind nichtig."*

| | What | Can a contract remove it? |
| --- | --- | --- |
| §69d(1) | Acts under §69c no. 1 and 2 necessary for **use in accordance with the program's purpose, including error correction** | **Yes** — it applies only *"soweit keine besonderen vertraglichen Bestimmungen vorliegen"* |
| §69d(2) | A **Sicherungskopie** by a person entitled to use the program, where needed to secure future use. The statute says directly that it *"darf nicht vertraglich untersagt werden"* | **No** |
| §69d(3) | **Observe, study or test** the program's functioning to determine the underlying ideas and principles, during acts they are entitled to perform | **No** |
| §69e | **Decompilation** for interoperability | **No** |

So the German answer has two layers: a contract-dependent scope under §31(5), sitting on a statutory floor the contract cannot cut into. **Error correction is the one item in that floor a contract can displace** — the same asymmetry Belgium and France have, and the term worth settling on purpose. See the four-way comparison in [README.md](README.md).

Also in §69d, and specific to Germany among these packs: **text and data mining** under §44b is expressly permitted for computer programs, including under §69c no. 2 — relevant to a founder whose product reads other software's output at scale. §69d(6) excludes §60d, so the research-TDM exception does not apply to programs.

Use [../pilot-conditions.md](../pilot-conditions.md) §4 for the inventory discipline. Never infer ownership or clearance from payment alone, from AI generation, or from a repository's top-level licence.

---

## 6. Data protection

**The GDPR layer is shared — read [eu-gdpr.md](eu-gdpr.md)** for the controller/processor test, the processor-contract duties, the sub-processor rule, the register obligation, the 72-hour breach notification and the security principle.

**German specifics — which authority is competent.** Germany has **no single supervisory authority for business**.

Source: [BfDI — addresses of the Länder authorities](https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html) · *federal authority's own directory* · **[checked 2026-11-10]**

The BfDI lists an authority for each of the **16 Länder**, and states that *"Neben der Aufsicht über die Landes- und Kommunalbehörden wird auch der nicht-öffentliche Bereich grundsätzlich von den Landesdatenschutzbehörden betreut"* — besides supervising state and municipal bodies, the Länder authorities **also generally supervise the private sector**.

So for a **private company the competent authority is the `Land` authority where it is established**, not the BfDI. The BfDI oversees federal public bodies and companies providing telecommunications and postal services.

A note on the count, because it varies in secondary sources: the BfDI directory lists **one entry per Land, so 16**. Totals of 17 or 18 circulate because at least one Land splits public-sector and private-sector supervision between separate authorities — **[not researched]** which, so do not quote a total. The number does not matter to a founder; the right `Land` does.

Practical consequence: a founder cannot be told "contact the German DPA". Establish their `Land` first, then find that authority. A breach notification sent to the wrong authority is not a notification made.

The `BDSG` and the competent state authority's own guidance are **[not researched]**.
---

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| §19 UStG thresholds €25,000 / €100,000, both operative | 2026-11-10 | Primary — statute read and quoted |
| Gesamtumsatz from vereinnahmten Entgelten; fixed assets excluded | 2026-11-10 | Primary — statute read |
| Net amounts / immediate mid-year exit / no founding-year projection | 2026-11-10 | Unconfirmed — §19 UStG was read and is silent on all three, and the secondary basis is unidentified. **Do not state these as statutory** |
| E-invoice receiving mandatory from 2025-01-01, incl. Kleinunternehmer | 2026-11-10 | Authority — official EU source read |
| Issuing from 2027-01-01 above €800,000; all from 2028-01-01 | 2026-11-10 | Authority — official EU source read |
| Email address sufficient for reception | 2026-11-10 | Authority — official EU source read |
| Formats XRechnung / ZUGFeRD 2.2.0 / Peppol BIS 3.0 | 2026-11-10 | Authority — official EU source read |
| BMF letters 2024 (BStBl I 1320), 2025-10-15 (BStBl I 1806), 2026-10-15 (GZ III C 5 - S 7287) | 2026-11-10 | Authority — BMF letter of 2026-10-15 extracted and read |
| Non-objection to 2026-12-31 incl. input VAT deduction | 2026-11-10 | Authority — BMF letter read |
| Structured-part content rule; time records may go in an embedded annex | 2026-11-10 | Authority — BMF letter read |
| Construction, gross-price and partial-payment allowances; corrections as e-invoices | 2026-11-10 | Authority — BMF letter read |
| 2025 letter amends, not replaces, the 2024 letter; GZ III C 2 - S 7287-a/00019/007/243 | 2026-11-10 | Authority — BMF letter of 2025-10-15 extracted and read, 33 pages |
| 2024 letter's citation is **BStBl I S. 1320** | 2026-11-10 | Authority — confirmed in the 2025 letter's own text, a cross-reference inside the source |
| Rn. 22: ≤€250 invoices, **Kleinunternehmer invoices** and transport tickets may always be `sonstige Rechnung` | 2026-11-10 | Authority — 2025 letter read; the UStDV provisions it names were not read themselves |
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
| Whether §27(38) UStG itself reads as the letter describes | — | Open — the statute was not read for this section |
| GoBD letter of 2019-11-28 as amended 2025-07-14 (non-VAT retention) | — | Open — not yet researched |
| §18 EStG: freiberufliche categories, Katalogberufe, ähnliche Berufe | 2026-11-10 | Primary — statute read and quoted |
| Registration route, chamber membership, Gewerbesteuer consequences | 2026-11-10 | Authority — chamber guidance read |
| Whether a software developer is `ingenieurähnlich` | — | Open — open by nature; a Steuerberater question, not researchable here |
| Municipal Gewerbeanmeldung documents and fees; the €24,500 allowance in §11 GewStG | — | Open — not yet researched |
| §310(1) BGB: §§308/309 catalogue disapplied in B2B, §307 general test survives | 2026-11-10 | Primary — statute read and quoted |
| Indizwirkung of §§308/309 under §307 in B2B | 2026-11-10 | Secondary — BGH NJW 2007, 3774 via consistent commentary; the judgment itself not read |
| How far trade custom under §310(1) rebuts that indication | — | Open — not yet researched |
| §69b UrhG: employer for employees/service relationships; silent on commissioned work | 2026-11-10 | Primary — statute read and quoted |
| §69d: use for purpose incl. error correction, Sicherungskopie, study, TDM under §44b | 2026-11-10 | Primary — statute read and quoted |
| §69g(2): terms contrary to §69d(2),(3),(5),(7) or §69e are `nichtig`; §69d(1) is waivable | 2026-11-10 | Primary — statute read and quoted |
| §69e itself, the decompilation conditions | — | Open — named by §69g(2), its text not read |
| §31(5) UrhG Zweckübertragungsregel: unnamed uses read by contract purpose; simple vs exclusive | 2026-11-10 | Primary — statute read and quoted |
| Competent authority is the Land authority, not the BfDI; 16 entries listed | 2026-11-10 | Authority — the BfDI's own directory read |
| Which Land splits public and private supervision (the 17/18 counts) | — | Open — not yet researched |
| BDSG, and the competent Land authority's own guidance | — | Open — not yet researched |
| GDPR layer | — | Elsewhere — maintained in eu-gdpr.md |

Next full recheck due: **2027-05-10**. Earlier before 2026-12-31, when the BMF non-objection period ends, and before 2027-01-01 when the first issuing phase begins. Also before 2027-12-31, when the transitional rules of the 2024 letter run out.

No independent German legal, tax or security reviewer has reviewed this pack.
