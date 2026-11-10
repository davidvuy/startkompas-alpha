# Netherlands — jurisdiction pack

Scope: a solo founder established in the Netherlands, selling a digital service to Dutch business customers, no employees, small bounded pilot.

Out of scope and requiring separate research: consumer (B2C) sales, employees or subcontractors, regulated professions, cross-border supply beyond the EU-KOR note below, physical goods, payment or financial services, health data.

**This pack is preparation, not advice.** Consequential steps need a Dutch accountant or the Belastingdienst itself.

Verification convention: **[checked YYYY-MM-DD]** means the source page was actually fetched and read on that date. **[not researched]** means no source was consulted — the topic is open.

---

## 1. Registration and formalities

Sources · *official chamber of commerce* · **[checked 2026-11-10]**
- [KVK — Business Register and the Tax Administration](https://www.kvk.nl/en/starting/business-register-and-tax-administration/)
- [KVK — registration](https://www.kvk.nl/en/registration/)

**Who must register.** All entrepreneurs and legal entities must register in the Handelsregister. The statutory test: you have an enterprise if you **independently supply goods or services to others with the intention to make a profit**. A hobby is not an enterprise — earning little or nothing from it means no registration, even if it takes a lot of time.

A founder may register **at most one** `eenmanszaak`, though one sole proprietorship can carry several trade names and activities.

**Relationship to the Belastingdienst — resolved.** For a sole proprietor, KVK **passes the details to the Belastingdienst automatically**. The founder then receives the VAT number (`btw-nummer`) and the VAT identification number (`btw-id`) **by post** from the Belastingdienst. The KVK page gives no timeframe for that; secondary sources cite roughly two weeks or ten working days, which is **not confirmed by the official page** — do not quote a number.

A `bv` or `nv` is different: that registration goes through a civil-law notary rather than automatically, and yields an RSIN.

Establish before proposing any administrative action: whether the founder is registered and under which SBI activity codes; whether they hold a `btw-id`; whether they are in the KOR; and their legal form.

Open: the registration fee, required identification and the processing timeframe are **[not researched]**.

---

## 2. VAT — kleineondernemersregeling (KOR)

Threshold: **€20,000** turnover per calendar year.

Source: [Belastingdienst — kleineondernemersregeling](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/hoe_werkt_de_btw/kleineondernemersregeling/) · *primary official (tax authority)* · **[checked 2026-11-10]**

Eligible: natural persons (sole traders), combinations of natural persons such as partnerships, and legal entities such as foundations, associations and limited companies.

Effect — the Belastingdienst describes the KOR as a VAT exemption:
- no VAT charged to customers
- no VAT return filed
- **no input VAT reclaimed on costs**

That last point is the trade-off. A founder with significant startup purchases may be worse off inside the KOR.

### What still applies inside the KOR — resolved

Source: [Belastingdienst — invoicing when you use the KOR](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/facturen_maken/factuureisen/aangepaste_regels_facturen/u_maakt_gebruik_van_de_kleineondernemersregeling) · *primary official* · **[checked 2026-11-10]**

- **Issuing an invoice is not required**: *"u bent niet verplicht om een factuur uit te reiken"*.
- If you do issue one, you must **state on it that you use the KOR**: *"vermeldt u op de factuur dat u gebruik maakt van de kleineondernemersregeling"*.
- **No VAT on the invoice**: *"U zet geen btw op de factuur"*.

Reported but **not confirmed on a page read here**: a KOR user need not keep a full VAT administration but must retain **purchase invoices**. · *secondary* · **[checked 2026-11-10, needs primary confirmation]**

Note the contrast with Belgium, where a business under the small-business exemption **must** issue structured e-invoices. The Dutch position is the opposite on both counts — no invoicing duty and no e-invoicing mandate. Do not carry either answer across.

### EU-KOR — resolved

Source: [Belastingdienst — kleineondernemersregeling in de EU (EU-KOR)](https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/kleineondernemersregeling-in-de-europese-unie-eu-kor) · *primary official* · **[checked 2026-11-10]**

- **Union turnover threshold: €100,000** — *"uw totale omzet in de EU is niet hoger dan € 100.000 per kalenderjaar"*, counting turnover in all EU countries including the Netherlands.
- The **national threshold of each country also applies** where you use the exemption. Both limits must hold.
- **Establishment requirement:** established in the Netherlands, with the principal place of business here if operating from several EU locations. A business not established in the EU cannot participate.
- **Quarterly reporting:** an `opgaaf kwartaalomzet` to the Dutch tax authority, covering turnover achieved across the whole EU that quarter. This is a real recurring obligation that the domestic KOR does not have — do not present EU-KOR as simply "KOR but abroad".
- Available since **2025-01-01** · *that start date is secondary; the official page read here did not state it* · **[needs primary confirmation]**

Recheck triggers: turnover approaching €20,000 or €100,000; the start of a new calendar year; any customer in another EU country.

---

## 3. B2B e-invoicing — no domestic mandate yet

**There is currently no mandatory domestic B2B e-invoicing obligation in the Netherlands.**

Source: [European Commission — eInvoicing in the Netherlands](https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108895/eInvoicing+in+The+Netherlands) · *official EU source* · **[checked 2026-11-10]** — stating: "There is no business-to-business (B2B) mandate. In the Netherlands eInvoicing is not mandatory for B2B transactions."

**B2G is different.** Suppliers to central government bodies must issue structured e-invoices in accepted formats since **2019-11-01**. A founder whose pilot customer is a central-government body is therefore already in scope. · **[checked 2026-11-10]**

### Announced future obligation, and where the legislation actually stands

| Date | Planned obligation |
| --- | --- |
| 2030-07-01 | Mandatory e-invoicing for domestic **and** intra-EU B2B; reporting of intra-Community acquisitions |
| 2031-07-01 | Digital reporting of domestic invoices to the Belastingdienst |

Legislative state, as reported · *secondary commentary, consistent across sources* · **[checked 2026-11-10]**

- **2026-09-11** — the State Secretary for Finance sent the House of Representatives a `Contourenbrief elektronisch factureren en rapporteren` setting out the cabinet's choices for implementing the EU ViDA directive. The Netherlands chose a **broad** implementation, extending beyond the EU minimum to cover domestic B2B.
- **Q4 2026** — a public internet consultation on draft legislation is expected. That is **now**; check whether it has opened.
- **Before the summer recess 2027** — target for submitting the bill to the House.
- **Before 2028-07-01** — target for parliamentary passage.

**Peppol is recommended, not mandated.** The announced model is decentralised and Peppol-based on EN 16931, but the obligation to use Peppol specifically has not been set. Businesses in the KOR are reported to be **exempt from the domestic obligation**.

**Open: none of this is law.** It is a ministerial letter plus a policy report, with the bill not yet submitted. Confirm against the enacted text before any founder plans around it. Four years out, the dates, the Peppol choice and the KOR carve-out can all still move. The `Contourenbrief` itself was **[not researched]** — only secondary reporting of it.

Formats and networks in Dutch use: Peppol network, Peppol BIS 3.0, SI-UBL 2.0, NLCIUS, and Digipoort as the central-government gateway. · **[checked 2026-11-10]**

Recheck triggers: the Q4 2026 consultation opening; the bill's submission; any central-government or public-sector customer; a customer in another EU country.

---

## 4. Agreements and unfair terms

**[not researched]** for the Netherlands.

Use the universal topics in [../pilot-conditions.md](../pilot-conditions.md) §3 to prepare a discussion sheet. Do not state Dutch contract-law rules from this pack, and do not assume the Belgian position transfers — Belgium has a statutory black and grey list for B2B terms, and whether Dutch law has an equivalent for business counterparties is exactly the open question.

Likely place to start: the general terms and conditions (`algemene voorwaarden`) provisions in Book 6 of the Burgerlijk Wetboek. That is a research prompt, **not** a finding. Confirm with a Dutch lawyer.

---

## 5. Ownership and permitted use

**[not researched]** for the Netherlands.

Use [../pilot-conditions.md](../pilot-conditions.md) §4 for the inventory discipline, which is jurisdiction-neutral. The *rules* on who owns commissioned software are not. The Belgian position is now recorded in detail — author retains ownership of commissioned software, only usage rights pass, transfer must be explicit and in writing — and must **not** be carried over, since Dutch `auteursrecht` may well differ on exactly this point.

---

## 6. Data protection — roles, suppliers and security

The GDPR applies directly, so the EU-level guidance used across packs applies here too. The supervisory authority is the **Autoriteit Persoonsgegevens**, whose own guidance is **[not researched]** and would be the better source for a Dutch founder.

- Roles: [EDPB — data controller or data processor](https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en) · *EU regulator guidance* · **[checked 2026-11-10]**
- Security: [EDPB — secure personal data](https://www.edpb.europa.eu/sme/be-compliant/secure-personal-data_en) · *EU regulator guidance* · **[checked 2026-11-10]**

The controller/processor test, the required processor-contract terms, the written sub-processor authorization rule and the processor's continuing liability for its sub-processors are recorded in full in [belgium.md](belgium.md) §6 — that content is EU-level and applies identically here. The same applies to the security guidance, including the caution that its two numeric figures (8-character passwords, six-monthly authorization reviews) are general SME guidance and not legal requirements.

EU AI Act applicability is not covered.

---

## Pack maintenance

| Claim | Check date | Status |
| --- | --- | --- |
| No domestic B2B e-invoicing mandate in force | 2026-11-10 | Official EU source read |
| B2G obligation since 2019-11-01 | 2026-11-10 | Official EU source read |
| Planned 2030/2031 dates, Peppol recommended not mandated, KOR carve-out | 2026-11-10 | Secondary; ministerial letter not read; **not law** |
| Legislative timeline (consultation Q4 2026, bill 2027, passage 2028) | 2026-11-10 | Secondary, consistent |
| KOR threshold €20,000 and its effects | 2026-11-10 | Tax authority page read |
| KOR invoicing: not required, must state the scheme, no VAT | 2026-11-10 | Tax authority page read, wording quoted |
| KOR: purchase invoices still retained | 2026-11-10 | Secondary; primary confirmation open |
| EU-KOR: €100,000 Union threshold, national thresholds also apply, NL establishment, quarterly report | 2026-11-10 | Tax authority page read |
| EU-KOR start date 2025-01-01 | 2026-11-10 | Secondary; primary confirmation open |
| Registration test, one eenmanszaak, automatic KVK→Belastingdienst transfer, btw-id by post | 2026-11-10 | KVK pages read |
| Registration fee, identification, timeframe | — | Not researched |
| Agreements / unfair terms | — | Not researched |
| Ownership of commissioned software | — | Not researched |
| Autoriteit Persoonsgegevens guidance | — | Not researched |
| EDPB roles and security guidance | 2026-11-10 | EU regulator guidance read |

Next full recheck due: **2027-05-10**. Earlier when the Q4 2026 internet consultation opens.

No independent Dutch legal, tax or security reviewer has reviewed this pack.
