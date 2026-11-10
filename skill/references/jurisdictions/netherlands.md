# Netherlands — jurisdiction pack

Scope: a solo founder established in the Netherlands, selling a digital service to Dutch business customers, no employees, small bounded pilot.

Out of scope and requiring separate research: consumer (B2C) sales, employees or subcontractors, regulated professions, cross-border supply, physical goods, payment or financial services, health data.

**This pack is preparation, not advice.** Consequential steps need a Dutch accountant or the Belastingdienst itself.

Verification convention: **[checked 2026-11-10]** means the source page was fetched and read on that date. **[carried 2026-10-27, not refetched]** means it comes from earlier project research and was not re-read since. **[not researched]** means no source was consulted — the topic is open.

---

## 1. Registration and formalities

Entry point: [KVK — registration](https://www.kvk.nl/en/registration/) · *official chamber of commerce* · **[checked 2026-11-10 — navigation page only]**

The page fetched is a navigation hub. It links to whether registration is required, valid proof of identity, who may register, the fee, and a dedicated `eenmanszaak` (sole proprietorship) route — but it did not itself state the rules. **Do not state Dutch registration requirements from this pack.** Open the specific KVK article or ask KVK directly.

Establish before proposing any administrative action: whether the founder is registered in the Handelsregister and under which activity (SBI) codes; whether they have a VAT identification number; whether they are in the KOR; and their legal form.

Open: the relationship between KVK registration and Belastingdienst VAT identification is **[not researched]** in this pack.

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

**EU-KOR:** since **2025-01-01** an entrepreneur doing business in other EU countries may use the EU-KOR to obtain a VAT exemption for one or more EU countries where they operate. · **[checked 2026-11-10]** — the source did not state a separate threshold for it; treat the EU-KOR threshold as **unknown** and confirm before relying on it.

Open: which invoicing and administration obligations remain while in the KOR is **[not researched]** — the source page did not detail them. Do not assume the KOR removes invoicing duties.

Recheck triggers: turnover approaching €20,000; the start of a new calendar year; any customer in another EU country.

---

## 3. B2B e-invoicing — no domestic mandate yet, one announced for 2030

**There is currently no mandatory domestic B2B e-invoicing obligation in the Netherlands.**

Source: [European Commission — eInvoicing in the Netherlands](https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108895/eInvoicing+in+The+Netherlands) · *official EU source* · **[checked 2026-11-10]** — stating: "There is no business-to-business (B2B) mandate. In the Netherlands eInvoicing is not mandatory for B2B transactions."

**B2G is different.** Suppliers to central government bodies must issue structured e-invoices in accepted formats since **2019-11-01**. A founder whose pilot customer is a central-government body is therefore already in scope. · **[checked 2026-11-10]**

### Announced future obligation

| Date | Obligation |
| --- | --- |
| 2030-07-01 | Mandatory e-invoicing for domestic **and** intra-EU B2B transactions |
| 2031-07-01 | Digital reporting of domestic invoices to the Belastingdienst |

The Netherlands chose a broad ViDA implementation — extending beyond the EU minimum to cover domestic B2B. The announced model is decentralised and Peppol-based, on EN 16931. Businesses in the KOR are reported to be **exempt from the domestic obligation**. The government announced this on **2026-09-11**; draft legislation for consultation was expected in Q4 2026. · *EC page plus secondary commentary* · **[checked 2026-11-10]**

**Open: not yet law.** These dates come from an announcement and a policy report, not from enacted legislation. Confirm against the actual bill before a founder plans around them. Four years out, the dates and the KOR carve-out can both still move.

Formats and networks in Dutch use: Peppol network, Peppol BIS 3.0, SI-UBL 2.0, NLCIUS, and Digipoort as the central-government gateway. · **[checked 2026-11-10]**

Recheck triggers: publication of the draft bill; any central-government or public-sector customer; a customer in another EU country.

---

## 4. Agreements and unfair terms

**[not researched]** for the Netherlands.

Use the universal topics in [../pilot-conditions.md](../pilot-conditions.md) §3 to prepare a discussion sheet. Do not state Dutch contract-law rules from this pack, and do not assume Belgian or German positions transfer.

Likely place to start: Dutch civil law on general terms and conditions (`algemene voorwaarden`) and the relevant provisions of Book 6 of the Burgerlijk Wetboek. Confirm with a Dutch lawyer before relying on any position.

---

## 5. Ownership and permitted use

**[not researched]** for the Netherlands.

Use [../pilot-conditions.md](../pilot-conditions.md) §4 for the inventory discipline, which is jurisdiction-neutral. The *rules* on who owns commissioned software are not — do not carry the Belgian position over.

---

## 6. Data protection — roles, suppliers and security

The GDPR applies directly, so the EU-level guidance used across packs applies here too. The supervisory authority is the **Autoriteit Persoonsgegevens**.

- Roles: [EDPB — data controller or data processor](https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en) · *EU regulator guidance* · **[carried 2026-10-27, not refetched]**
- Security: [EDPB — secure personal data](https://www.edpb.europa.eu/sme/be-compliant/secure-personal-data_en) · *EU regulator guidance* · **[carried 2026-10-27, not refetched]**

Roles follow the actual purposes and instructions, not a product name or a contract title. Measures must be proportionate to the actual risk and context. Map each real data flow before any real personal or confidential data enters an AI or supplier tool, and get actual authority first.

Dutch-specific guidance from the Autoriteit Persoonsgegevens is **[not researched]**. EU AI Act applicability is not covered.

---

## Pack maintenance

| Claim | Check date | Status |
| --- | --- | --- |
| No domestic B2B e-invoicing mandate in force | 2026-11-10 | Official EU source read |
| B2G obligation since 2019-11-01 | 2026-11-10 | Official EU source read |
| Announced 2030/2031 B2B mandate and KOR carve-out | 2026-11-10 | Announcement + policy report; not yet law |
| KOR threshold €20,000 and its effects | 2026-11-10 | Tax authority page read |
| EU-KOR available from 2025-01-01 | 2026-11-10 | Tax authority page read; threshold unknown |
| KVK registration rules | 2026-11-10 | Navigation page only — **not established** |
| Remaining obligations inside the KOR | — | Not researched |
| Agreements / unfair terms | — | Not researched |
| Ownership of commissioned software | — | Not researched |
| EDPB roles and security guidance | 2026-10-27 | Not refetched |

Next full recheck due: **2027-05-10.** Earlier when the Dutch e-invoicing bill is published for consultation.

No independent Dutch legal, tax or security reviewer has reviewed this pack.
