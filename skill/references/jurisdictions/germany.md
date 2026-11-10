# Germany — jurisdiction pack

Scope: a solo founder established in Germany, selling a digital service to German business customers, no employees, small bounded pilot.

Out of scope and requiring separate research: consumer (B2C) sales, employees or subcontractors, regulated professions and the `Handwerksordnung` trades, cross-border supply, physical goods, payment or financial services, health data.

**This pack is preparation, not advice.** Consequential steps need a German `Steuerberater` — tax advice is a regulated activity in Germany and this pack is not it.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[not researched]** means no source was consulted — the topic is open.

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

Recheck triggers: turnover approaching either threshold; the start of a new calendar year; the founding year specifically, where the projection question matters.

---

## 3. B2B e-invoicing — receiving already mandatory, issuing phased to 2028

Sources · **[checked 2026-11-10]**
- [European Commission — eInvoicing in Germany](https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108886/eInvoicing+in+Germany) · *official EU source*
- [IHK Köln summary of the BMF letter on the obligatory e-invoice](https://www.ihk.de/koeln/hauptnavigation/recht-steuern/steuern/bmf-schreiben-zur-e-rechnung-vom-15-10-2025-6774012) · *chamber of commerce summary of official guidance*

| Date | Obligation |
| --- | --- |
| **2025-01-01** | Every business must be **able to receive** EN 16931-compliant structured e-invoices for domestic B2B |
| **2027-01-01** | Businesses with 2026 turnover above **€800,000** must **issue**; paper invoices become prohibited for them |
| **2028-01-01** | The issuing obligation applies to **all** remaining businesses |

**The receiving obligation is in force and it includes Kleinunternehmer.** Every business registered for German VAT, including those exempt under §19 UStG, must be able to receive a structured e-invoice. A founder who cannot accept one is already non-compliant on that point.

**Practical relief worth knowing: an email address is sufficient** to meet the reception requirement, per the EC page. Receiving does not require buying a platform. Do not push a founder toward a paid product to satisfy an obligation an email address already satisfies — and note this is the opposite of the French position, where an accredited platform is mandatory.

Accepted formats: **XRechnung** (the national standard), **ZUGFeRD 2.2.0** (XRechnung profile), and **Peppol BIS Billing 3.0** — all conforming to EN 16931.

Legal basis: the `Wachstumschancengesetz` (Growth Opportunities Act), adopted **2024-03-22**, codified in **§14(2) and §27(38) UStG**.

### Federal Ministry of Finance guidance

The BMF has issued successive letters on the obligatory e-invoice: one in **2024**, one dated **2025-10-15**, and a further one dated **2026-10-15**. What the summaries record:

- **Everything required on an invoice must sit in the structured part.** The mandatory particulars under §14(4) sentence 1 UStG — and §14a in special cases — must be in the structured portion of the e-invoice; supplementary information may be carried in an embedded attachment, but the tax-relevant details about the supply cannot be relegated there.
- **A non-objection period runs to 2026-12-31.** For e-invoices issued up to that date, deviations from the newer letter's additional requirements are not challenged provided the invoice conforms to the earlier 2024 and 2025 letters. That grace ends within weeks of this pack's check date.
- The issuing obligation takes effect for many businesses from **2027-01-01**, consistent with the turnover threshold above.

The BMF letters themselves are PDFs on `bundesfinanzministerium.de` and were **[not researched]** directly — the points above come from a chamber summary and corroborating professional commentary. Read the actual letter before relying on a detail of invoice content.

For a solo founder the practical reading: **receive now, issue from 2028-01-01**, unless 2026 turnover exceeded €800,000 — unlikely within this pack's default scope. Confirm against the founder's own turnover rather than assuming the later phase.

Recheck triggers: 2026 turnover approaching €800,000; **before 2026-12-31**, when the non-objection period ends; before 2027-01-01 and again before 2028-01-01; any further BMF letter.

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

**Open:** what German law supplies *instead* of §69b for commissioned work — the default scope of the client's implied licence — is **[not researched]**. Do not state the extent of a client's permitted use from this pack.

Use [../pilot-conditions.md](../pilot-conditions.md) §4 for the inventory discipline. Never infer ownership or clearance from payment alone, from AI generation, or from a repository's top-level licence.

---

## 6. Data protection

**The GDPR layer is shared — read [eu-gdpr.md](eu-gdpr.md)** for the controller/processor test, the processor-contract duties, the sub-processor rule, the register obligation, the 72-hour breach notification and the security principle.

**German specifics — which authority is competent.** Germany has **no single supervisory authority for business**. There are 17 state authorities plus the federal BfDI, and for a **private company the competent authority is the state (`Land`) authority where the company is established** — not the BfDI. The BfDI oversees federal public bodies and companies providing telecommunications and postal services. · *consistent secondary sources; the BfDI's own list was [not researched]* · **[checked 2026-11-10]**

Practical consequence: a founder cannot be told "contact the German DPA". Establish their `Land` first, then find that authority. A breach notification sent to the wrong authority is not a notification made.

The `BDSG` and the competent state authority's own guidance are **[not researched]**.
---

## Pack maintenance

| Claim | Check date | Status |
| --- | --- | --- |
| §19 UStG thresholds €25,000 / €100,000, both operative | 2026-11-10 | **Primary legislation read and quoted** |
| Gesamtumsatz from vereinnahmten Entgelten; fixed assets excluded | 2026-11-10 | Primary legislation read |
| Net amounts / immediate mid-year exit / no founding-year projection | 2026-11-10 | **Primary source checked and is silent; secondary basis unidentified — do not state as statutory** |
| E-invoice receiving mandatory from 2025-01-01, incl. Kleinunternehmer | 2026-11-10 | Official EU source read |
| Issuing from 2027-01-01 above €800,000; all from 2028-01-01 | 2026-11-10 | Official EU source read |
| Email address sufficient for reception | 2026-11-10 | Official EU source read |
| Formats XRechnung / ZUGFeRD 2.2.0 / Peppol BIS 3.0 | 2026-11-10 | Official EU source read |
| BMF letters 2024, 2025-10-15, 2026-10-15; structured-part rule; non-objection to 2026-12-31 | 2026-11-10 | Chamber summary read; **BMF letters themselves not read** |
| Registration route (Gewerbe vs freier Beruf) | — | Not researched |
| §310(1) BGB: §§308/309 catalogue disapplied in B2B, §307 general test survives | 2026-11-10 | **Primary legislation read and quoted** |
| §69b UrhG: employer for employees/service relationships; silent on commissioned work | 2026-11-10 | **Primary legislation read and quoted** |
| Competent authority is the Land authority, not the BfDI | 2026-11-10 | Consistent secondary; BfDI list not read |
| GDPR layer | 2026-11-10 | Factored into eu-gdpr.md |

Next full recheck due: **2027-05-10**. Earlier before 2026-12-31, when the BMF non-objection period ends, and before 2027-01-01 when the first issuing phase begins.

No independent German legal, tax or security reviewer has reviewed this pack.
