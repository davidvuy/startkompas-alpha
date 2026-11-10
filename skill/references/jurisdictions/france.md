# France — jurisdiction pack

Scope: a solo founder established in France, selling a digital service to French business customers, no employees, small bounded pilot.

Out of scope and requiring separate research: consumer (B2C) sales, employees or subcontractors, regulated professions, cross-border supply, physical goods, payment or financial services, health data.

**This pack is preparation, not advice.** Consequential steps need a French `expert-comptable` or the tax administration itself.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[not researched]** means no source was consulted — the topic is open.

---

## 1. Registration and formalities

All business creation, modification, document filing and cessation declarations go through the **single mandatory portal**:

[formalites.entreprises.gouv.fr — guichet unique](https://formalites.entreprises.gouv.fr/) · *official portal, operated by INPI* · **[checked 2026-11-10]**

The portal describes itself as *"Le guichet unique pour les déclarations de création, de modification, de dépôt de document et de cessation d'entreprise"*. Informational content is open; submitting a declaration requires an INPI account.

Establish before proposing any administrative action: the founder's legal form (`micro-entreprise`, `entreprise individuelle`, `société`); their SIREN/SIRET; their APE activity code; their VAT position; and whether the activity is regulated.

Open: the specific documents, fees and timelines for each form are **[not researched]**.

---

## 2. VAT — franchise en base de TVA

The test uses **two** thresholds per activity: the previous calendar year and the current calendar year. It is not a "base plus tolerance" — both figures are operative, as in the German two-threshold test.

| Activity | Previous calendar year | Current calendar year |
| --- | --- | --- |
| `Prestations de services` and `activités libérales` (excluding on-site consumption and accommodation) | **€37,500** | **€41,250** |
| `Ventes`, on-site consumption and `hébergement` | **€85,000** | **€93,500** |

Sources · **[checked 2026-11-10]**
- [service-public.gouv.fr — franchise en base de TVA](https://entreprendre.service-public.gouv.fr/vosdroits/F21746) · *official government information service*, page's own update date **2026-01-01**
- Threshold structure corroborated by professional commentary reporting the restoring law's own wording · *secondary*

A digital B2B service normally falls under `prestations de services`, so **€37,500 / €41,250** is the relevant pair for this pack's default founder.

**Mandatory invoice mention.** Every invoice or statement issued under the franchise must carry:

> `TVA non applicable - article 293 B du CGI`

Omitting it exposes the business to penalties on audit. This is concrete and checkable — verify the founder's invoice template actually contains it. · **[checked 2026-11-10]**

**Mixed activities:** where a founder both sells and provides services, total turnover must stay under the sales threshold **and** the services part under the services threshold. Breaching either takes the whole activity out of the regime. · *secondary* · **[checked 2026-11-10]**

Effect: no VAT charged, and no input VAT recovered.

### Resolved history — the €25,000 thresholds that did not happen

Both attempts failed. Preserved because founders and advisers still cite them.

**The 2025 single threshold.** The `loi de finances` for 2025 (article 32) introduced a **single €25,000 threshold** for all activities. It was **suspended on 2025-02-28**, then **repealed by loi n° 2025-1044 of 2025-11-03**, *"visant à garantir un cadre fiscal stable pour les micro-entrepreneurs et les petites entreprises"*, which abrogated article 32 and restored the earlier thresholds listed above. · *secondary, consistent across sources; corroborated by the official page* · **[checked 2026-11-10]**

**The PLF 2026 construction carve-out — rejected.** Article 25 of the `projet de loi de finances` for 2026 proposed €37,500 generally with **€25,000 for `prestations de services de travaux immobiliers`** (building works). **Deputies rejected it in November 2025 and it was not adopted.** No change to the thresholds was carried in the final law. · *secondary, consistent* · **[checked 2026-11-10]**

**So for 2026 the thresholds above are unchanged, and no €25,000 figure applies to anyone.** If a founder or their accountant cites €25,000, it is one of these two dead reforms.

Recheck triggers: turnover approaching either figure; the start of a new calendar year; the next `loi de finances`.

---

## 3. B2B e-invoicing — receiving in force, issuing for small businesses from 2027-09-01

Sources · **[checked 2026-11-10]**
- [European Commission — eInvoicing in France](https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108885/eInvoicing+in+France) · *official EU source*
- [impots.gouv.fr — facturation électronique et plateformes agréées](https://www.impots.gouv.fr/facturation-electronique-et-plateformes-agreees) · *official tax administration*

| Date | Obligation |
| --- | --- |
| **2026-09-01** | **All** businesses must be able to **receive** e-invoices |
| **2026-09-01** | `Grandes entreprises` and `ETI` must **issue**, and their **e-reporting** obligation starts |
| **2027-09-01** | `PME`, `TPE`, `micro-entreprises` and `indépendants` must **issue** |

**Both September 2026 obligations are already in force** — roughly two months before this pack's check date. A French solo founder must already be able to receive a structured e-invoice today, and has until **2027-09-01** to be able to issue one. That is under a year away: it belongs on a pilot timeline now, not later.

### An accredited platform is mandatory

In **October 2024** France abandoned building a public invoicing portal for company-to-company invoicing. Businesses must use an **accredited platform** — a `Plateforme de Dématérialisation Partenaire` / `plateforme agréée` — of which the EC page reports nearly 100, or a compatible solution connected to one. The public portal is retained only for data-concentrator and central-directory services.

The tax administration is explicit that **only** an accredited platform may provide the full set of required functions: issuing and transmitting e-invoices to clients, receiving them, extracting the data the administration needs, and building and transmitting the periodic e-reporting. Accreditation runs for a renewable three-year period.

**This is a real difference from Belgium and Germany.** An email address does not satisfy the French obligation — some tooling choice is genuinely unavoidable. Establish the requirement and the founder's own spending authority before recommending any platform, and never present one as endorsed.

### E-reporting is a second, separate obligation

Alongside e-invoicing, businesses must transmit **transaction data** and, in certain cases, **payment data** to the administration through an accredited platform (`e-reporting` / `transmission des données de transaction`). From 2026-09-01 this applies to large and mid-sized companies on the schedule above.

Do not treat "I can send an e-invoice" as the whole obligation. Open: **the exact date and scope of e-reporting for a `micro-entreprise` or `indépendant` is [not researched]** — confirm it rather than assuming it mirrors the 2027-09-01 issuing date.

Formats in French use: **UBL 2.1**, **UN/CEFACT CII**, and **Factur-X** (the Franco-German hybrid). `Chorus Pro` remains the B2G system.

**B2C is not in scope** — the EC page states there are no current B2C e-invoicing mandates.

The administration publishes a `guide pratique de démarrage au 1er septembre 2026`; it was **[not researched]** here and is the right next source for a founder actually onboarding.

Note: `economie.gouv.fr`'s page on the reform returned HTTP 403 on 2026-11-10 and was not read; `impots.gouv.fr/facturation-electronique` redirects to an unrelated local-authorities site. Use the accredited-platforms page linked above instead.

Recheck triggers: before 2027-09-01; any change in the founder's size category; publication of updated administration guidance.

---

## 4. Agreements and unfair terms

**[not researched]** for France.

Use the universal topics in [../pilot-conditions.md](../pilot-conditions.md) §3 to prepare a discussion sheet. Do not state French contract-law positions from this pack, and do not carry the Belgian black-and-grey-list structure across — whether French law has an equivalent for business counterparties is the open question.

Likely place to start: the `Code de commerce` provisions on `déséquilibre significatif` in commercial relations, and the `Code civil` rules on `conditions générales`. A research prompt, **not** a finding. Confirm with a French lawyer.

---

## 5. Ownership and permitted use

**[not researched]** for France.

Use [../pilot-conditions.md](../pilot-conditions.md) §4 for the inventory discipline, which is jurisdiction-neutral. French `droit d'auteur` on software — in particular the treatment of software created by an employee, which France handles distinctively — is **not** carried over from any other pack. The Belgian rules are recorded in detail in [belgium.md](belgium.md) §5 and must not be reused here.

---

## 6. Data protection — roles, suppliers and security

The GDPR applies directly. The supervisory authority is the **CNIL**, which publishes extensive SME guidance of its own — **[not researched]** here, and the better source for a French founder.

- Roles: [EDPB — data controller or data processor](https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en) · *EU regulator guidance* · **[checked 2026-11-10]**
- Security: [EDPB — secure personal data](https://www.edpb.europa.eu/sme/be-compliant/secure-personal-data_en) · *EU regulator guidance* · **[checked 2026-11-10]**

The controller/processor test, the required processor-contract terms, the written sub-processor authorization rule and the processor's continuing liability are recorded in full in [belgium.md](belgium.md) §6 — EU-level content that applies identically here, as does the security guidance and the caution that its two numeric figures are general SME guidance rather than legal requirements.

EU AI Act applicability is not covered.

---

## Pack maintenance

| Claim | Check date | Status |
| --- | --- | --- |
| Franchise thresholds, both years, both activity groups | 2026-11-10 | Official page read (updated 2026-01-01) + secondary on structure |
| Mandatory mention `TVA non applicable - article 293 B du CGI` | 2026-11-10 | Official page read |
| Mixed-activity rule | 2026-11-10 | Secondary only |
| 2025 single €25,000 threshold repealed by loi n° 2025-1044 of 2025-11-03 | 2026-11-10 | Secondary, consistent; law number not read in the Journal Officiel |
| PLF 2026 €25,000 for travaux immobiliers **rejected, not adopted** | 2026-11-10 | **Resolved** — secondary, consistent |
| Receiving mandatory from 2026-09-01 | 2026-11-10 | Official EU source read |
| Issuing: GE/ETI 2026-09-01, PME/TPE/micro 2027-09-01 | 2026-11-10 | Official EU source read |
| Accredited platform mandatory; only a PDP provides full functions; 3-year accreditation | 2026-11-10 | Tax administration page read |
| E-reporting exists as a separate obligation; from 2026-09-01 for GE/ETI | 2026-11-10 | Tax administration page read |
| E-reporting date and scope for micro/indépendants | — | **Not researched** |
| Formats UBL 2.1 / CII / Factur-X | 2026-11-10 | Official EU source read |
| Official start guide for 2026-09-01 | — | Not researched |
| economie.gouv.fr reform page | 2026-11-10 | **Fetch failed, HTTP 403 — not read** |
| Registration documents, fees, timelines | — | Not researched |
| Agreements / unfair terms | — | Not researched |
| Ownership of software | — | Not researched |
| CNIL guidance | — | Not researched |
| EDPB roles and security guidance | 2026-11-10 | EU regulator guidance read |

Next full recheck due: **2027-05-10**. Earlier before 2027-09-01, when the issuing obligation reaches small businesses.

No independent French legal, tax or security reviewer has reviewed this pack.
