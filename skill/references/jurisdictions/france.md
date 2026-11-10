# France — jurisdiction pack

Scope: a solo founder established in France, selling a digital service to French business customers, no employees, small bounded pilot.

Out of scope and requiring separate research: consumer (B2C) sales, employees or subcontractors, regulated professions, cross-border supply, physical goods, payment or financial services, health data.

**This pack is preparation, not advice.** Consequential steps need a French `expert-comptable` or the tax administration itself.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[not researched]** means no source was consulted — the topic is open.

Note for maintainers: **Légifrance returns 403 to automated link checks** while serving the pages normally to a reader. `scripts/check-links.mjs` therefore reports the two Légifrance citations below as `blocked`, not `dead`. Both articles were read on 2026-11-10. Do not "fix" those URLs.

---

## 1. Registration and formalities

All business creation, modification, document filing and cessation declarations go through the **single mandatory portal**:

[formalites.entreprises.gouv.fr — guichet unique](https://formalites.entreprises.gouv.fr/) · *official portal, operated by INPI* · **[checked 2026-11-10]**

The portal describes itself as *"Le guichet unique pour les déclarations de création, de modification, de dépôt de document et de cessation d'entreprise"*. Informational content is open; submitting a declaration requires an INPI account.

Since **2023-01-01** every creation, modification and cessation formality must go through this portal; there is no paper or alternative route.

### Deadline, documents and cost

Source: [service-public.gouv.fr — micro-entreprise registration formalities](https://entreprendre.service-public.gouv.fr/vosdroits/F36746?lang=en) · *official government information service* · **[checked 2026-11-10]**

**Timing — a real window, in both directions.** File **at the earliest one month before** starting the activity, and **within 15 days after** the start date at the latest. A founder who starts quietly and registers later has a 15-day limit, not an open one.

**Documents:**
- proof of the business address, such as a water, electricity or gas bill
- a copy of the founder's ID and a `déclaration sur l'honneur` of non-conviction
- for a regulated activity, the authorisation, diploma or title permitting it
- a `Cape` contract copy, if there is one
- for married founders, spouse notification certificates
- for a purchase, lease or succession of a business, the deed and publication certificates

**Cost: registration is free** for commercial, craft and liberal activities. Only `agents commerciaux` pay, at €23.21 for the SFCR register.

**What you get.** On filing, a `Récépissé de Dépôt de Dossier de Création d'Entreprise` (RDDCE), valid up to one month, which **already lets you deal with public and private bodies** while registration completes. On completion, a certificate carrying the identification numbers — `Siren` and `APE` code.

Establish before proposing any administrative action: the founder's legal form (`micro-entreprise`, `entreprise individuelle`, `société`); their SIREN/SIRET; their APE activity code; their VAT position; and whether the activity is regulated.

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

**For a micro-entreprise, TPE or PME: e-reporting starts 2027-09-01** — the same date as their issuing obligation. · *consistent secondary commentary; the administration's own `fiche 7` on `impots.gouv.fr` is a PDF and was not parsed* · **[checked 2026-11-10]**

What has to be transmitted is **the transactions that are not domestic B2B** — sales to consumers, exports and international operations. That is the part founders get wrong: e-invoicing covers business customers, e-reporting covers everything else.

Transmission goes through an accredited platform, either by entering the data on the platform or by sending a file.

**Sanction: €500 per missing transmission, capped at €15,000 per calendar year.** · *secondary* · **[checked 2026-11-10, not primary-confirmed]**

So a French founder has **two** deadlines on 2027-09-01, not one, and they cover complementary halves of their turnover. Do not treat "I can send an e-invoice" as the whole obligation.

Formats in French use: **UBL 2.1**, **UN/CEFACT CII**, and **Factur-X** (the Franco-German hybrid). `Chorus Pro` remains the B2G system.

**B2C is not in scope** — the EC page states there are no current B2C e-invoicing mandates.

The administration publishes a `guide pratique de démarrage au 1er septembre 2026`; it was **[not researched]** here and is the right next source for a founder actually onboarding.

Note: `economie.gouv.fr`'s page on the reform returned HTTP 403 on 2026-11-10 and was not read; `impots.gouv.fr/facturation-electronique` redirects to an unrelated local-authorities site. Use the accredited-platforms page linked above instead.

Recheck triggers: before 2027-09-01; any change in the founder's size category; publication of updated administration guidance.

---

## 4. Agreements and unfair terms

France takes a different route from its neighbours: no prohibited-clause list, but a **liability** rule.

Source: [article L442-1 I, Code de commerce](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000054716237) · *primary legislation* · **[checked 2026-11-10]**

- **Who:** any person engaged in production, distribution or services activities.
- **What is prohibited:** submitting, or attempting to submit, the other party to *"obligations créant un déséquilibre significatif dans les droits et obligations des parties"*. The same article also catches tender or competitive-bidding practices whose frequency or method creates such an imbalance.
- **Consequence:** the author **incurs civil liability and must compensate the resulting harm**. It is a damages route, not automatic nullity of the clause.

Note that the prohibition reaches an *attempt* to impose such obligations, and that `soumettre` implies the term was not genuinely negotiable.

### The second route — article 1171 Code civil

Source: [article 1171 Code civil](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032041110/2016-10-01) · *primary legislation* · **[checked 2026-11-10]**

In a `contrat d'adhésion`, any **non-negotiable clause determined in advance by one party** that creates a significant imbalance between the parties' rights and obligations is **`réputée non écrite`** — deemed unwritten.

Two limits are written into it: the assessment applies **neither to the principal object of the contract nor to the adequacy of the price** against the service supplied. So a bad bargain is not an imbalance; a one-sided *clause* is.

In force since **2018-10-01**, as amended by law 2018-287 of 2018-04-20, originally introduced by Ordinance 2016-131 of 2016-02-10.

### The two routes are alternatives, not a choice — resolved

| | Art. L442-1 I C.com | Art. 1171 C.civ |
| --- | --- | --- |
| Catches | imposing, or **attempting** to impose, obligations creating a significant imbalance | a **non-negotiable** clause in a `contrat d'adhésion` creating a significant imbalance |
| Who | any person in production, distribution or services | the parties to an adhesion contract |
| Remedy | **civil liability and damages** | the clause is **deemed unwritten** — the rest of the contract stands |
| Excluded | — | the principal object, and price adequacy |

**They do not apply cumulatively.** Source: [Cour de cassation, com., 26 January 2022, 20-16.782](https://www.legifrance.gouv.fr/juri/id/JURITEXT000045097530) · *published judgment* · **[checked 2026-11-10]**

The Court held that art. 1171 C.civ applies to contracts *"lorsqu'ils ne relèvent pas de l'article L. 442-6, I, 2° du code de commerce"* — **only where they do not fall under the specialized commercial provision** (then L442-6 I 2°, now L442-1 I 2°). The commercial rule is the special one and it **displaces** the civil-code rule within its scope.

**So the earlier framing in this pack was wrong.** This is not a founder choosing their preferred remedy. For an ordinary commercial relationship inside L442-1's scope, the route is **L442-1 and its damages remedy**, and art. 1171 is unavailable.

The judgment also shows how the boundary moves: it **allowed** art. 1171 for financial leasing by credit institutions and financing companies, precisely because their banking operations are excluded from the Code de commerce restrictive-practices provisions. So art. 1171 is the residual rule — it governs what the commercial code does not reach, including between commercial parties.

What to tell a founder: establish first whether the relationship falls within L442-1. If it does, expect damages rather than clause removal — and if a counterparty's standard terms are the problem, that changes what is worth asking for in negotiation.

**Open:** how the 2022 holding has been applied since, and the exact edge of L442-1 I 2°'s scope, are **[not researched]**.

Use [../pilot-conditions.md](../pilot-conditions.md) §3 for the discussion sheet. Never draft a blanket liability waiver, a unilateral acceptance clause, an automatic renewal or an invented service guarantee.
---

## 5. Ownership and permitted use

Source: [article L113-9 Code de la propriété intellectuelle](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039279818) · *primary legislation* · **[checked 2026-11-10]**

> *"Sauf dispositions statutaires ou stipulations contraires, les droits patrimoniaux sur les logiciels et leur documentation créés par un ou plusieurs employés dans l'exercice de leurs fonctions ou d'après les instructions de leur employeur sont dévolus à l'employeur"*

| Situation | Rule |
| --- | --- |
| Software **and its documentation** created by an **employee** in the exercise of their duties, or on the employer's instructions | Economic rights are **devolved to the employer**, who alone may exercise them |
| Agents of the State, public authorities and public administrative bodies | Same rule applies |
| **Commissioned / freelance** work | **Not covered.** L113-9 speaks only of `employés`, so it transfers nothing for a contractor. |
| Contrary agreement | Permitted — the rule opens with *"Sauf dispositions statutaires ou stipulations contraires"*, so a contract can displace it |

Note that L113-9 expressly covers **the documentation** as well as the software, which the German and Dutch provisions do not spell out.

Practical consequence for a solo founder: L113-9 does **not** apply to you, because you are not your client's employee. The default is that **you keep the economic rights** in commissioned software, and a client who wants them needs an express stipulation. A founder who paid a freelancer gains nothing from L113-9 either.

### Moral rights in software are deliberately narrowed

Source: [article L121-7 CPI](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278899) · *primary legislation*, in force since 1994-05-11 · **[checked 2026-11-10]**

Unlike authors of other works, a software author **cannot**, absent more favourable stipulations:

1. **oppose modification** of the software by the right holder under art. L122-6, where the modification does not harm their honour or reputation
2. exercise their **`droit de repentir` or `droit de retrait`** — the right to reconsider or withdraw the work

**What this means for a founder.** French moral rights do not give you a veto after delivery. You cannot later object to a client modifying the software, and you cannot pull it back. If you need control over how the work evolves, it has to be a **contractual** term — the general `droit d'auteur` intuition that an author always retains a say does not hold for software.

Note the opening words, though: *"sauf stipulation contraire plus favorable à l'auteur"*. The narrowing is a default, and a contract **can** restore more to the author. That is a drafting opportunity, not a fixed ceiling.

**Open:** the default scope of a client's permitted use for commissioned software — the French equivalent of Germany's §31(5) purpose rule — is **[not researched]**.

Use [../pilot-conditions.md](../pilot-conditions.md) §4 for the inventory discipline. Never infer ownership or clearance from payment alone, from AI generation, or from a repository's top-level licence.

---

## 6. Data protection

**The GDPR layer is shared — read [eu-gdpr.md](eu-gdpr.md)** for the controller/processor test, the processor-contract duties, the sub-processor rule, the register obligation, the 72-hour breach notification and the security principle.

**French specifics.** The supervisory authority is the **CNIL**, which publishes unusually extensive small-business material — the richest national guidance of the four packs. · [cnil.fr — TPE/PME](https://www.cnil.fr/fr/thematiques/tpe-pme) · *official authority* · **[checked 2026-11-10]**

What it offers a founder:

- **Four main actions** to start and maintain compliance, as its own entry point
- a **GDPR guide for small and medium enterprises**, and a separate **TPE-PME verification checklist**
- explicit emphasis on building a **`registre des traitements`** as the foundational document
- a practical **FAQ** of the questions small businesses actually ask
- **four fact sheets on generative AI** use — the only AI-specific national material any of these packs has found
- online services for **notifying a data breach** and for compliance tooling

Point a French founder at the CNIL's own checklist rather than paraphrasing it. The individual documents were **[not researched]** here; only the landing page was read.
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
| Guichet unique mandatory since 2023-01-01; filing window, documents, free for micro, RDDCE receipt | 2026-11-10 | **Official page read** |
| L442-1 I C.com: déséquilibre significatif triggers civil liability and damages | 2026-11-10 | **Primary legislation read and quoted** |
| Art. 1171 C.civ: non-negotiable clause deemed unwritten; object and price excluded | 2026-11-10 | **Primary legislation read** |
| Interaction: art. 1171 applies only outside L442-1's scope | 2026-11-10 | **Resolved** — Cass. com. 26-01-2022, 20-16.782, judgment read |
| How that 2022 holding has been applied since; the exact edge of L442-1 I 2° | — | Not researched |
| L113-9 CPI: devolved to employer for employees and public agents, incl. documentation; contract may displace | 2026-11-10 | **Primary legislation read and quoted** |
| L121-7 CPI: software moral rights narrowed — no veto on modification, no repentance or withdrawal | 2026-11-10 | **Primary legislation read** |
| Client's permitted use for commissioned software (the French §31(5) equivalent) | — | Not researched |
| CNIL small-business offering incl. registre des traitements and AI fact sheets | 2026-11-10 | Official landing page read |
| The CNIL's individual guides and TPE-PME checklist | — | Not researched |
| GDPR layer | 2026-11-10 | Factored into eu-gdpr.md |

Next full recheck due: **2027-05-10**. Earlier before 2027-09-01, when the issuing obligation reaches small businesses.

No independent French legal, tax or security reviewer has reviewed this pack.
