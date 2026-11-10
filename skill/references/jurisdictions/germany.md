# Germany — jurisdiction pack

Scope: a solo founder established in Germany, selling a digital service to German business customers, no employees, small bounded pilot.

Out of scope and requiring separate research: consumer (B2C) sales, employees or subcontractors, regulated professions and the `Handwerksordnung` trades, cross-border supply, physical goods, payment or financial services, health data.

**This pack is preparation, not advice.** Consequential steps need a German `Steuerberater` — tax advice is a regulated activity in Germany and this pack is not it.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[not researched]** means no source was consulted — the topic is open.

---

## 1. Registration and formalities

**[not researched]** for Germany.

Establish before proposing any administrative action: the founder's legal form; whether the activity is a `Gewerbe` or a `freier Beruf`, because the registration route differs; whether they have registered with the tax office and hold a `Steuernummer`; whether they hold a VAT identification number; and whether the activity falls under the `Handwerksordnung` with its own entry requirements.

Likely responsible bodies to check directly: the local `Gewerbeamt` for a `Gewerbeanmeldung`, the `Finanzamt` for tax registration, the `IHK` or `HWK` for chamber membership, and `ELSTER` for the tax questionnaire. **Do not state the steps, fees or deadlines from this pack** — none were verified.

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

**[not researched]** for Germany.

Use the universal topics in [../pilot-conditions.md](../pilot-conditions.md) §3 to prepare a discussion sheet. Do not state German contract-law positions from this pack, and do not carry across the Belgian black-and-grey-list structure.

Likely place to start: the `AGB` (general terms) control provisions in the BGB, widely described as strict even between businesses. That description is a prompt to research, **not** a finding. Confirm with a German lawyer.

---

## 5. Ownership and permitted use

**[not researched]** for Germany.

Use [../pilot-conditions.md](../pilot-conditions.md) §4 for the inventory discipline, which is jurisdiction-neutral. German rules on authorship and on rights in commissioned or employee-created software are **not** carried over from any other pack — German copyright law treats authorship distinctively, which is a reason to research rather than a conclusion. The Belgian rules in [belgium.md](belgium.md) §5 must not be reused here.

---

## 6. Data protection — roles, suppliers and security

The GDPR applies directly. Germany additionally has the `BDSG` and **separate supervisory authorities per federal state**, so the competent authority depends on where the founder is established. Both the BDSG and the relevant state authority's guidance are **[not researched]**.

- Roles: [EDPB — data controller or data processor](https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en) · *EU regulator guidance* · **[checked 2026-11-10]**
- Security: [EDPB — secure personal data](https://www.edpb.europa.eu/sme/be-compliant/secure-personal-data_en) · *EU regulator guidance* · **[checked 2026-11-10]**

The controller/processor test, the required processor-contract terms, the written sub-processor authorization rule and the processor's continuing liability are recorded in full in [belgium.md](belgium.md) §6 — EU-level content that applies identically here, as does the security guidance and the caution that its two numeric figures are general SME guidance rather than legal requirements.

EU AI Act applicability is not covered.

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
| Agreements / AGB control | — | Not researched |
| Ownership of commissioned software | — | Not researched |
| BDSG and state supervisory guidance | — | Not researched |
| EDPB roles and security guidance | 2026-11-10 | EU regulator guidance read |

Next full recheck due: **2027-05-10**. Earlier before 2026-12-31, when the BMF non-objection period ends, and before 2027-01-01 when the first issuing phase begins.

No independent German legal, tax or security reviewer has reviewed this pack.
