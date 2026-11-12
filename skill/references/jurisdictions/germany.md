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
| `Gewerbesteuer` | **Not subject to it** | Subject, with an allowance of **€24,500** — see §11 GewStG below for who actually gets it |

**Who decides:** the competent `Finanzamt`, on the basis of the activity description in the `Fragebogen zur steuerlichen Erfassung` (filed via `ELSTER`). Its determination is decisive **regardless of how the founder describes themselves or whether they already registered with a Gewerbeamt**. A founder who assumed `Freiberufler` and is reclassified owes trade tax they did not plan for.

### The €24,500 allowance — read in the statute, and it does not reach a GmbH

Source: [§11 GewStG, official consolidated law text](https://www.gesetze-im-internet.de/gewstg/__11.html) · *primary legislation* · **[checked 2026-11-11]**

§11(1) sentence 3 grants the allowance **only to natural persons and partnerships** (`bei natürlichen Personen sowie bei Personengesellschaften`). A `juristische Person` — so a **GmbH or UG** — gets nothing; the €5,000 allowance in no. 2 is for the specific undertakings named in §2(3) and §3 and for public-law legal persons, not for an ordinary company.

Three details the chamber summary did not carry:

- The base is the **`Gewerbeertrag`**, not profit. Trade income is profit as modified by the additions and reductions of §§8–9 GewStG — read below.
- It is **rounded down to a full €100** before the allowance is applied, and the allowance is capped at the rounded figure — so it cannot create a negative base.
- §11(2): the `Steuermesszahl` is **3.5%**, applied to what is left. The municipality's `Hebesatz` then multiplies that, and varies by municipality.

**The practical consequence is about legal form, not about trade tax rates.** A founder who incorporates for liability reasons loses a €24,500 allowance they had as a sole trader. That is a `Steuerberater` conversation before the legal form is chosen, not after.

#### §§8 and 9 — what turns profit into `Gewerbeertrag`, and the €200,000 that keeps a founder out of it

Sources: [§8 GewStG](https://www.gesetze-im-internet.de/gewstg/__8.html) and [§9 GewStG](https://www.gesetze-im-internet.de/gewstg/__9.html) · *primary legislation* · **[checked 2026-11-11]**

**§8 adds back financing costs, and the shape of it matters more than the list.** Under §8 Nr. 1 a quarter of the *sum* of six items is added back to the profit — but only *"soweit die Summe den Betrag von 200 000 Euro übersteigt"*, **to the extent the sum exceeds €200,000.** The six, with the fraction each contributes to that sum:

| | What enters the sum | At |
| --- | --- | --- |
| a | interest on debts, and discounts on selling receivables | **in full** |
| b | annuities and permanent charges | in full |
| c | a silent partner's profit share | in full |
| d | rent, lease and **leasing instalments** for **movable** fixed assets owned by someone else | **one fifth** — and **half of that** for electric vehicles, qualifying plug-in hybrids, and bicycles that are not motor vehicles |
| e | rent and lease for **immovable** fixed assets owned by someone else — office and workshop rent | **one half** |
| f | expenses for the **temporary grant of rights, in particular concessions and licences** | **one quarter** |

Two readings a founder will want. **Office rent is in it**, at half into the sum and then a quarter of the total, so about 12.5% of the rent — above the allowance. And **software and other licence fees are in it** under (f), at a quarter into the sum and then a quarter again, so about 6.25% — which is not obvious from "trade tax is a tax on profit". Point (f) excludes licences that only permit sub-licensing, and expenses that form the base for the `Künstlersozialabgabe` under §25 KSVG.

**The practical answer for a one-person business is still "none of this applies".** Reaching €200,000 of interest, rent and licence fees is a different size of business. But the €200,000 is an allowance on the *sum*, not on each item, so it is the figure to watch if a founder signs a long office lease and a large software contract in the same year — and the pack can now say that from the statute rather than leaving it open.

**§9 reduces, and only one of its heads is likely to reach a founder.** §9 Nr. 1 sentence 1 cuts *"die im Erhebungszeitraum als Betriebsausgabe erfasste Grundsteuer"* for real property in the business assets — the property tax actually booked as an expense. Note the current wording: this is the tax recorded, not a percentage of an assessed value. Its sentence 2 is the extended reduction for businesses that only manage their own property, which is not founder territory. §9 Nr. 5 reduces donations and membership fees to tax-privileged purposes paid out of business funds, and §9 Nr. 3 reduces the part of trade income attributable to a foreign permanent establishment. The remaining heads — Nr. 1a, 2, 2a, 2b, 7 and 8 — concern partnership and corporate shareholdings and are **[not researched]**.

Also establish: the legal form; whether they already hold a `Steuernummer` and a VAT identification number; and whether the activity falls under the `Handwerksordnung`, which carries its own entry requirements and `HWK` membership.

**Open:** the specific documents, fees and processing times for a `Gewerbeanmeldung` vary by municipality and are **[not researched]**.

---

## 2. VAT — Kleinunternehmerregelung (§19 UStG)

Two thresholds apply **together**:

| Condition | Amount |
| --- | --- |
| Total turnover in the **previous** calendar year must not have exceeded | **€25,000** |
| Total turnover in the **current** calendar year must not exceed | **€100,000** |

Source: [§19 UStG, official consolidated law text](https://www.gesetze-im-internet.de/ustg_1980/__19.html) · *primary legislation* · **[checked 2026-11-10]**

§19(1) **sentence 1** states the test:

> *"Ein von einem im Inland oder in den in § 1 Absatz 3 bezeichneten Gebieten ansässigen Unternehmer bewirkter Umsatz im Sinne des § 1 Absatz 1 Nummer 1 ist steuerfrei, wenn der Gesamtumsatz nach Absatz 2 im vorangegangenen Kalenderjahr 25 000 Euro nicht überschritten hat und im laufenden Kalenderjahr 100 000 Euro nicht überschreitet."*

Both conditions must hold. Failing either ends the exemption — a frequent misreading, because the €100,000 figure circulates on its own.

§19(2) defines `Gesamtumsatz` by reference to `vereinnahmten Entgelten` (remuneration actually collected), and subtracts certain exempt turnovers: those exempt under §4 no. 8 letter i, no. 9 letter b and nos. 11 to 29 always, and those under §4 no. 8 letters a to h, no. 9 letter a and no. 10 **where they are `Hilfsumsätze`** — ancillary. Turnover from the sale of fixed assets is excluded (§19(2) sentence 2). The regime applies to entrepreneurs resident in Germany or in the territories designated in §1(3) UStG.

### What §19(1) sentence 2 switches off — the relief the thresholds get the attention for

Sentence 1 is only half of §19(1). Sentence 2 disapplies four sets of provisions where the exemption applies, and this is where most of the practical difference lives:

| Disapplied | What that means for a founder |
| --- | --- |
| **§18(1) to (4) — the declaration duties** | No VAT `Voranmeldungen` and no annual VAT return for the exempt turnovers. This is the administrative relief, and it is in sentence 2, not in the thresholds |
| §4 no. 1 letter b and §6a — the exemption for intra-Community supplies | Not available; the §19 exemption already covers the turnover |
| §9 — the option to waive an exemption | Not available, so the usual opt-to-tax routes are closed |
| §14a(1) s. 3, (3) s. 2, (7) s. 2 — stating VAT identification numbers in an invoice | Those particular VAT-ID duties do not apply. §34a UStDV sets what the invoice must carry instead — see below |

**Two things sentence 2 expressly leaves standing**, and both can surprise someone who has been told they "have no VAT filings": §149(1) sentence 2 of the `Abgabenordnung`, so the Finanzamt can still require a return, and **§18(4a) UStG**, the return duty attached to intra-Community acquisitions and the cases listed there.

Effect of the regime on the money side: **no VAT on invoices, and no input VAT deduction in return.**

### §19(3) — you may decline the exemption, and it locks you in for five years

§19(3) lets an entrepreneur declare to the Finanzamt, **irrevocably**, that they waive the application of §19(1):

- **Deadline:** up to the last day of **February of the second** calendar year following the taxation period. So the choice for 2026 can still be made until 2028-02-29 — unusually late, and worth knowing before anyone rushes it.
- **Effect:** from the beginning of the taxation period it is meant to apply to.
- **It binds for at least five calendar years**, and can then be revoked only with effect from the beginning of a subsequent calendar year.

**This is the consequential one for a founder with real start-up costs.** Declining the exemption buys input VAT deduction on equipment and services, at the price of VAT on every invoice, VAT filings, and a **five-year** commitment. Do not let anyone treat it as a reversible setting. Route the arithmetic to a `Steuerberater`, with the five-year lock stated.

### §19(4) to (6) — the cross-border scheme, and one carve-out

§19(4) applies §19(1) to entrepreneurs established **elsewhere in the EU**, on two cumulative conditions: Union annual turnover determined under art. 288 of Directive 2006/112/EC did not exceed **€100,000** in the previous calendar year and does not exceed it in the current one, **and** the member state of establishment has issued them the **`Kleinunternehmer-Identifikationsnummer`** valid for the German exemption.

This is Germany's enactment of the directive's cross-border SME exemption — read [eu-vat-sme.md](eu-vat-sme.md) for the scheme itself and the `EX` number. §19(5) governs waiving §19(4): the declaration goes to the authority in the **member state of establishment**, and takes effect from the start of the **following calendar quarter**, or, if it arrives in the last month of a quarter, from the start of the **second month** of the following quarter. The same five-year minimum applies.

§19(6): §19(1) does **not** apply to intra-Community supplies of **new vehicles**, and §15(4a) applies accordingly.

### What a Kleinunternehmer's invoice must contain — §34a UStDV

Source: [§34a UStDV, official consolidated regulation text](https://www.gesetze-im-internet.de/ustdv_1980/__34a.html) · *primary legislation* · **[checked 2026-11-11]**

"No VAT on the invoice" is not the same as "a simpler invoice with nothing on it". §34a sentence 1 sets the minimum particulars for an invoice over turnover exempt under §19(1):

1. Full name and address of **both** the supplier **and the recipient**
2. **A tax number**: the `Steuernummer` from the Finanzamt, or the `USt-IdNr.`, or the `Kleinunternehmer-Identifikationsnummer` from the `Bundeszentralamt für Steuern`
3. The date of issue
4. The quantity and customary description of the goods, or the scope and type of the service
5. The `Entgelt` **in one sum**, together with **a reference to the fact that the Kleinunternehmer exemption applies (§19 UStG)**
6. The word **`Gutschrift`** where the recipient or a third party they instructed issues the invoice (§14(2) sentence 5 UStG)

Point 5 is the one founders miss: the invoice has to **say** the exemption applies. A bare invoice with no VAT line and no note does not meet §34a.

**And sentence 4 settles the e-invoicing question from the regulation itself**, not only from the BMF's reading of it: an invoice under §34a sentence 1 *"kann abweichend von § 14 Absatz 2 Satz 2 des Gesetzes **immer** als sonstige Rechnung ... übermittelt werden"*. §§33 and 34 remain unaffected, and §31 applies accordingly.

### What the statute does not say — checked, not assumed

Three claims circulate widely in professional commentary: that the amounts are **net** rather than gross; that exceeding €100,000 **ends the exemption immediately** from the transaction that crosses it rather than at year end; and that the former **pro-rata projection** for a founding year no longer applies.

Read directly on 2026-11-10 and **re-read in full on 2026-11-11, §19 UStG is silent on all three.** All six subsections were read: they state the two thresholds as conditions, say what the exemption switches off, govern the waiver and the cross-border case — and give no net/gross characterization, no mid-year consequence and no founding-year rule.

**The re-read was worth doing even though it changed nothing here**, because it found two things the pack had missed on either side of this gap: sentence 2 of §19(1), above, and the five-year lock in §19(3). A paragraph that is silent on the question you asked is not thereby a paragraph you have read.

So those claims do not rest on §19 itself. They may follow from other provisions, from the transitional rules, or from administrative guidance — but **this pack has not identified their source**, and they must not be presented as statutory. For a founder near a threshold, mid-year behaviour is exactly the consequential question: send it to a `Steuerberater` rather than answering it from here. · *the primary source was read and is silent; the secondary basis is unidentified* · **[checked 2026-11-10]**

**That the statute is silent here is a fact about Germany, not about the question.** France states both mid-year rules on the face of its official page — see [france.md](france.md) §2 — and the directive settles it for the cross-border exemption only, in [eu-vat-sme.md](eu-vat-sme.md). So a founder asking "what happens if I go over in July?" has a published answer in France and none in the German statute. Do not fill the German gap with the French rule.

**One further effect, and it is easy to miss: a Kleinunternehmer is outside the e-invoice *issuing* obligation altogether.** Not deferred — exempt, under §34a sentence 4 UStDV, quoted above. The duty to be *able to receive* one still applies in full. See §3 below; do not answer an e-invoicing question for a German founder before settling their §19 status.

Recheck triggers: turnover approaching either threshold; the start of a new calendar year; the founding year specifically, where the projection question matters.

---

## 3. B2B e-invoicing — receiving already mandatory, issuing phased to 2028

Sources · **[checked 2026-11-10]**
- [European Commission — eInvoicing in Germany](https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108886/eInvoicing+in+Germany) · *official EU source*
- §27(38) UStG and the three BMF letters themselves · *primary legislation and administrative guidance, first-hand* — cited individually in the annex. A chamber-of-commerce summary was used before they were read and has been **dropped**, because every claim it supported is now taken from the letters.

**The detail is in [germany-e-invoicing.md](germany-e-invoicing.md).** This section carries the obligation, the dates and the answer; the annex carries §27(38) UStG, the three BMF letters `Randnummer` by `Randnummer`, and the two UStDV provisions they rely on. Go there before citing anything, and before telling a founder a carve-out does or does not apply to them.

| Date | Obligation |
| --- | --- |
| **2025-01-01** | Every business must be **able to receive** EN 16931-compliant structured e-invoices for domestic B2B |
| **2027-01-01** | Businesses with 2026 turnover above **€800,000** must **issue**; paper invoices become prohibited for them |
| **2028-01-01** | The issuing obligation applies to **all** remaining businesses |

**This table is the phase-in, not the whole answer.** Some invoices and some issuers are carved out of the issuing obligation permanently — including **every Kleinunternehmer** and, with one carve-out of its own, **every invoice at or under €250**. Read *The 2025 letter* in the annex before applying a date from this table.

**The receiving obligation is in force and it includes Kleinunternehmer.** Every business registered for German VAT, including those exempt under §19 UStG, must be able to receive a structured e-invoice. A founder who cannot accept one is already non-compliant on that point.

**Practical relief worth knowing: an email address is sufficient** to meet the reception requirement, per the EC page. Receiving does not require buying a platform. Do not push a founder toward a paid product to satisfy an obligation an email address already satisfies — and note this is the opposite of the French position, where an accredited platform is mandatory.

Accepted formats: **XRechnung** (the national standard), **ZUGFeRD 2.2.0** (XRechnung profile), and **Peppol BIS Billing 3.0** — all conforming to EN 16931.

Legal basis: the `Wachstumschancengesetz` (Growth Opportunities Act), adopted **2024-03-22**, codified in **§14(2) and §27(38) UStG**. The transitional rules all sit in §27(38), tabulated in the annex.

For a solo founder the practical reading, in order:

1. **Be able to receive now.** This applies to everyone, Kleinunternehmer included, and an email address satisfies it. §27(38) grants no transition for reception, so there is nothing to wait for.
2. **Check §19 before anything else.** A Kleinunternehmer is outside the issuing obligation by §34a sentence 4 UStDV and Rn. 22 of the 2025 letter, whatever the phase-in dates say. See §2 above for what their invoice must then contain.
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

#### §69e — the decompilation right is narrow, and it is not a reverse-engineering licence

Source: [§69e UrhG, official consolidated law text](https://www.gesetze-im-internet.de/urhg/__69e.html) · *primary legislation* · **[checked 2026-11-11]**

§69g(2) makes a term contrary to §69e void, so it is worth knowing how little §69e grants. The right exists only where reproducing or translating the code is **indispensable** (`unerläßlich`) to obtain the information needed for the **interoperability of an independently created program**, and all three conditions of §69e(1) hold:

1. The acts are done by the **licensee** or another person entitled to use a copy, or by someone authorised on their behalf.
2. The information needed for interoperability **has not already been made readily available** to those persons — *"noch nicht ohne weiteres zugänglich gemacht"*.
3. The acts are **confined to the parts** of the original program necessary for interoperability.

§69e(2) then restricts what may be done with what is found: not for purposes other than interoperability of the independently created program, not passed to third parties unless necessary for that interoperability, and **not for developing, producing or marketing a program of substantially similar expression** — nor for any other infringing act. §69e(3) adds that §69e(1) and (2) must be read so as not to impair the normal exploitation of the work or unreasonably prejudice the rightholder's legitimate interests.

**So the practical instruction is the opposite of the one founders expect.** §69e does not let a founder take apart a competitor's software to understand it, build on it, or write a replacement. It permits the minimum needed to make their own program talk to it, **after** asking for the interface information and not being given it. Condition 2 makes that request the first step, not an optional courtesy. Anything beyond that is a question for a German lawyer.

Also in §69d, and specific to Germany among these packs: **text and data mining** under §44b is expressly permitted for computer programs, including under §69c no. 2 — relevant to a founder whose product reads other software's output at scale. §69d(6) excludes §60d, so the research-TDM exception does not apply to programs.

Use [../pilot-conditions.md](../pilot-conditions.md) §4 for the inventory discipline. Never infer ownership or clearance from payment alone, from AI generation, or from a repository's top-level licence.

---

## 6. Data protection

**The GDPR layer is shared — read [eu-gdpr.md](eu-gdpr.md)** for the controller/processor test, the processor-contract duties, the sub-processor rule, the register obligation, the 72-hour breach notification and the security principle.

**German specifics start with the authority and do not end there.** Germany has **no single supervisory authority for business** — and beyond that it adds a duty to appoint a data protection officer that the GDPR does not, a binding national list of processing needing an impact assessment, and criminal liability. The authority first, because everything else routes through it:

Source: [BfDI — addresses of the Länder authorities](https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html) · *federal authority's own directory* · **[checked 2026-11-10]**

The BfDI lists an authority for each of the **16 Länder**, and states that *"Neben der Aufsicht über die Landes- und Kommunalbehörden wird auch der nicht-öffentliche Bereich grundsätzlich von den Landesdatenschutzbehörden betreut"* — besides supervising state and municipal bodies, the Länder authorities **also generally supervise the private sector**.

So for a **private company the competent authority is the `Land` authority where it is established**, not the BfDI. The BfDI oversees federal public bodies and companies providing telecommunications and postal services.

Practical consequence: a founder cannot be told "contact the German DPA". Establish their `Land` first, then find that authority. A breach notification sent to the wrong authority is not a notification made.

**The German specifics beyond that are in [germany-data-protection.md](germany-data-protection.md):** §40 BDSG and which Land authority is competent when there are several establishments, **§38 BDSG — under which a DPO is compulsory with no employees at all** — the dismissal protection a compulsory DPO acquires, **§42 BDSG's criminal liability and the use immunity it gives a breach notification**, the German art. 35(4) DPIA list and **the entry on it that covers AI customer interaction**, and the BayLDA's own checklist for a one-person business.

---

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| §19 UStG thresholds €25,000 / €100,000, both operative | 2026-11-10 | Primary — statute read and quoted |
| Gesamtumsatz from vereinnahmten Entgelten; fixed assets excluded; the §4 exclusions and the Hilfsumsatz condition | 2026-11-11 | Primary — §19(2) read and its two sentences separated |
| §19(1) **sentence 2**: §18(1)–(4) declaration duties, §4 no. 1 b / §6a, §9 and three §14a VAT-ID duties disapplied; §149(1) s. 2 AO and §18(4a) UStG expressly unaffected | 2026-11-11 | Primary — statute read. The pack previously quoted sentence 1 and called it `§19(1) in full` |
| §19(3): waiver declarable to end of February of the second following year, irrevocable, **binds five calendar years** | 2026-11-11 | Primary — statute read and the deadline worked through |
| §19(4)–(5): cross-border exemption for EU-established businesses on €100,000 Union turnover plus a Kleinunternehmer-IdNr.; waiver effective from the following quarter | 2026-11-11 | Primary — statute read. The scheme itself is maintained in eu-vat-sme.md |
| §19(6): §19(1) does not apply to intra-Community supplies of new vehicles | 2026-11-11 | Primary — statute read |
| §34a UStDV: a Kleinunternehmer invoice needs both parties' details, a tax number, and **a note that the §19 exemption applies**; sentence 4 always permits a `sonstige Rechnung` | 2026-11-11 | Primary — regulation read and quoted. This confirms from the regulation what §2 and §3 previously took from the BMF's reading |
| Net amounts / immediate mid-year exit / no founding-year projection | 2026-11-11 | Unconfirmed — §19 UStG read 2026-11-10 and **re-read in full 2026-11-11**; silent on all three, and the secondary basis is unidentified. **Do not state these as statutory** |
| E-invoice receiving mandatory from 2025-01-01, incl. Kleinunternehmer | 2026-11-10 | Authority — official EU source read |
| Issuing from 2027-01-01 above €800,000; all from 2028-01-01 | 2026-11-10 | Authority — official EU source read |
| Email address sufficient for reception | 2026-11-10 | Authority — official EU source read |
| Formats XRechnung / ZUGFeRD 2.2.0 / Peppol BIS 3.0 | 2026-11-10 | Authority — official EU source read |
| B2B e-invoicing: §27(38) UStG, the three BMF letters, §33 and §34a UStDV | — | Elsewhere — maintained in germany-e-invoicing.md |
| §18 EStG: freiberufliche categories, Katalogberufe, ähnliche Berufe | 2026-11-10 | Primary — statute read and quoted |
| Registration route, chamber membership, Gewerbesteuer consequences | 2026-11-10 | Authority — chamber guidance read |
| Whether a software developer is `ingenieurähnlich` | — | Open — open by nature; a Steuerberater question, not researchable here |
| §11 GewStG: €24,500 allowance for **natural persons and partnerships only**, capped at the Gewerbeertrag rounded down to €100; `Steuermesszahl` 3.5% | 2026-11-11 | Primary — statute read and quoted. A GmbH or UG gets no allowance, which the chamber summary did not say |
| Municipal Gewerbeanmeldung documents and fees | — | Open — vary by municipality, not yet researched |
| §8 Nr. 1: a quarter of a six-item sum, added back only above €200,000; office rent at one half and licence fees at one quarter into that sum | 2026-11-11 | Primary — statute read and tabulated |
| §8 Nr. 1(d): the movable-asset fraction is halved for electric vehicles, qualifying plug-in hybrids and non-motorised bicycles | 2026-11-11 | Primary — read |
| §9 Nr. 1 sentence 1 reduces the `Grundsteuer` actually booked as an expense, not a percentage of an assessed value | 2026-11-11 | Primary — read and quoted |
| §9 Nr. 5 donations and Nr. 3 foreign permanent establishment | 2026-11-11 | Primary — read, not detailed |
| §9 Nr. 1a, 2, 2a, 2b, 7 and 8 | — | Open — shareholding heads, not researched |
| §310(1) BGB: §§308/309 catalogue disapplied in B2B, §307 general test survives | 2026-11-10 | Primary — statute read and quoted |
| Indizwirkung of §§308/309 under §307 in B2B | 2026-11-10 | Secondary — BGH NJW 2007, 3774 via consistent commentary; the judgment itself not read |
| How far trade custom under §310(1) rebuts that indication | — | Open — not yet researched |
| §69b UrhG: employer for employees/service relationships; silent on commissioned work | 2026-11-10 | Primary — statute read and quoted |
| §69d: use for purpose incl. error correction, Sicherungskopie, study, TDM under §44b | 2026-11-10 | Primary — statute read and quoted |
| §69g(2): terms contrary to §69d(2),(3),(5),(7) or §69e are `nichtig`; §69d(1) is waivable | 2026-11-10 | Primary — statute read and quoted |
| §69e: three cumulative conditions incl. that the information is **not already readily available**; §69e(2) bars use beyond interoperability and any substantially similar program | 2026-11-11 | Primary — statute read and quoted |
| §31(5) UrhG Zweckübertragungsregel: unnamed uses read by contract purpose; simple vs exclusive | 2026-11-10 | Primary — statute read and quoted |
| Competent authority is the Land authority, not the BfDI; 16 entries listed | 2026-11-10 | Authority — the BfDI's own directory read |
| Which Land splits public and private supervision (the 17/18 counts) | — | Open — not yet researched |
| The BDSG, the DSK art. 35(4) list and the competent Land authority's own guidance | — | Elsewhere — researched on 2026-11-11 and maintained in [germany-data-protection.md](germany-data-protection.md) |
| Whether the DSK or a Land authority has published anything on B2B prospecting and legitimate interest | — | Open — not yet researched. The CNIL has, and [france-data-protection.md](france-data-protection.md) carries it; §7 UWG, the German rule on unsolicited advertising, is not read either |
| GDPR layer | — | Elsewhere — maintained in eu-gdpr.md |

Next full recheck due: **2027-05-10**. Earlier before 2026-12-31, when the BMF non-objection period ends, and before 2027-01-01 when the first issuing phase begins. Also before 2027-12-31, when the transitional rules of the 2024 letter run out.

No independent German legal, tax or security reviewer has reviewed this pack.
