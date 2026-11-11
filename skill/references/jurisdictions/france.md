# France — jurisdiction pack

Scope: a solo founder established in France, selling a digital service to French business customers, no employees, small bounded pilot.

Out of scope and requiring separate research: consumer (B2C) sales, employees or subcontractors, regulated professions, cross-border supply, physical goods, payment or financial services, health data.

**This pack is preparation, not advice.** Consequential steps need a French `expert-comptable` or the tax administration itself.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

Note for maintainers: **Légifrance returns 403 to automated link checks** while serving the pages normally to a reader. `scripts/check-links.mjs` therefore reports every Légifrance citation in this pack as `blocked`, not `dead` — run the check to see how many. Each was read in a browser on the date its marker gives. Do not "fix" those URLs, and do not treat `blocked` as a reason to drop one.

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

Source: [service-public.gouv.fr — franchise en base de TVA](https://entreprendre.service-public.gouv.fr/vosdroits/F21746) · *official government information service, `Vérifié le 01 janvier 2026`* · **[checked 2026-11-11]**. Everything in this section comes from that page unless another source is named.

The page's own names for the two figures are worth keeping, because they are what an `expert-comptable` will say: the **`seuil`** is the previous calendar year (N-1) and the **`seuil majoré`** is the current year (N).

| Activity, in the page's own categories | `seuil` (N-1) | `seuil majoré` (N) |
| --- | --- | --- |
| `Activité de prestation de services` | **€37,500** | **€41,250** |
| `Activité libérale` (except `avocat`) | **€37,500** | **€41,250** |
| `Activité commerciale et d'hébergement` | **€85,000** | **€93,500** |

The page states for 2026: *"les seuils de franchise en base de TVA française applicables restent **inchangés**"*.

A digital B2B service normally falls under `prestations de services`, so **€37,500 / €41,250** is the relevant pair for this pack's default founder.

The page carries further pairs for `avocats` (€50,000 / €55,000 regulated, €35,000 / €38,500 otherwise) and for authors and performers (€50,000 / €55,000 for works and rights, €35,000 / €38,500 for other author activities). Those are outside this pack's scope and are named only so a founder in one of them is not given the services figure by mistake.

**Mandatory invoice mention.** Every invoice or statement issued under the franchise must carry:

> `TVA non applicable - article 293 B du CGI`

The page gives the obligation as *"doit figurer sur chaque facture ou note d'honoraires"* and cites **art. 293 E CGI** as its legal basis — note that 293 B is what the sentence *says*, while 293 E is what *requires* it. On the consequence it is specific: *"l'entreprise s'expose à un redressement fiscal pour non-respect du formalisme administratif en cas de contrôle fiscal"*. This is concrete and checkable — verify the founder's invoice template actually contains it.

Effect: no VAT charged, and no input VAT recovered.

### Crossing a threshold — France answers what Germany's statute does not

This is the one place the four packs diverge sharply, and the French answer is the clearest of them.

| What is exceeded | When the franchise stops |
| --- | --- |
| the **`seuil`** (N-1 turnover above €37,500 / €85,000) | VAT applies *"dès le 1er janvier de l'année suivante"* — from 1 January of the following year |
| the **`seuil majoré`** (N turnover above €41,250 / €93,500) | the franchise *"cesse de s'appliquer dès le 1er jour du dépassement"* — from the **first day of the overrun itself** |
| **€100,000 of EU turnover**, for an EU-established business | ends *"dès le 1er jour de dépassement"* |

Two things a founder must not miss. First, the majoré rule bites **immediately**, not at the end of the month: the page says so expressly, *"et non plus au premier jour du mois du dépassement"*, which means it used to be the month and a founder working from older advice will get it wrong. From that day, operations are taxable and invoices must show the VAT.

Second, the two rules do different things — the `seuil` gives you the rest of the year, the `seuil majoré` gives you nothing. Compare the German pack, where §19 UStG was read directly and is **silent** on mid-year consequences, and [eu-vat-sme.md](eu-vat-sme.md), where the directive answers this only for the cross-border exemption. France states it on the face of the official page.

**Mixed activities are not answered here.** Where a founder both sells and provides services, this pack previously stated that total turnover must stay under the sales threshold **and** the services part under the services threshold, with a breach of either ending the regime. The official page does **not** say that: it gives the thresholds per category, advises keeping accounts that show the categories separately — *"Il est important de tenir une comptabilité laissant apparaître les différentes catégories de recettes"* — and states a non-interference rule only for `avocats` and authors, which does not transfer. **[not researched]** for a sales-plus-services business; send it to an `expert-comptable` rather than restating the old rule.

### Resolved history — the €25,000 thresholds that did not happen

Both attempts failed. Preserved because founders and advisers still cite them.

**The 2025 single threshold.** The `loi de finances` for 2025 (article 32) introduced a **single €25,000 threshold** for all activities, and it never took effect.

What the official page actually says, and all it says: *"La proposition issue de la loi de finances pour 2025 visant à instaurer un seuil unique de franchise en base de TVA de 25 000 € a été **abandonnée**."* · **[checked 2026-11-11]**

That is enough for a founder, and it is where the verified trail stops. This pack previously added that the measure was **suspended on 2025-02-28** and then **repealed by loi n° 2025-1044 of 2025-11-03**, *"visant à garantir un cadre fiscal stable pour les micro-entrepreneurs et les petites entreprises"*. Refetching the official page on 2026-11-11 confirmed the abandonment and **not** the law number, the date, or the suspension — the page mentions none of them, and the secondary source those details came from was never recorded here. Légifrance, which would settle it, returns 403 to this project's link checker.

**So treat the law number as unconfirmed.** Do not cite `loi n° 2025-1044` to a founder as the instrument. Say the single €25,000 threshold was abandoned and the earlier thresholds stand, which is what the official page supports.

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

Source: [impots.gouv.fr — `fiche 7`, transmission des données de transaction](https://www.impots.gouv.fr/sites/default/files/media/1_metier/2_professionnel/EV/2_gestion/290_facturation_electronique/fiche-7_tpe_transmission-des-donnees-de-transaction.pdf) · *official tax administration, updated October 2026, text extracted and read* · **[checked 2026-11-10]**

**The reform has three pillars, not two.** E-invoicing covers transactions with VAT-taxable suppliers and clients **established in France**. It is completed by two further strands: **`e-reporting de transactions`** and **`e-reporting de paiement`** — transaction data and payment data.

**Who is in scope for transaction e-reporting?** Yes, if either or both of:

1. **B2C** — sales or services to natural or legal persons **not subject to VAT** (the fiche names individuals and non-profit associations), **in France as well as abroad**.
2. **International B2B** — purchases or sales of goods or services with VAT-taxable suppliers or clients established **inside or outside the EU** — **except imports of goods**, which already go to Customs.

So the dividing line is not "domestic versus foreign". It is: **e-invoicing for French VAT-taxable counterparties, e-reporting for everyone else**, whether they are a French consumer or a German business.

**When: from 2027-09-01** — and the **frequency depends on the founder's VAT regime** (`franchise en base`, or `régime réel normal` monthly or quarterly). There is no single cadence; establish the regime before stating one.

**What data — far less than a founder might fear:**

| Situation | What is sent |
| --- | --- |
| Sales to non-taxable persons | **Daily turnover**, split by VAT rate where needed. Globalised per day, **not transaction by transaction**, and **no personal data at all** |
| International B2B | Part of the invoice data — the same fields as the e-invoice, **except the SIREN number** |

**How:** through an accredited platform, either entered directly or sent as a file from a compatible solution such as invoicing or point-of-sale software. The official, regularly updated [list of accredited platforms](https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees) is on `impots.gouv.fr`.

So a French founder has **two** obligations landing on 2027-09-01, and together they cover all of their turnover. Do not treat "I can send an e-invoice" as the whole obligation.

**Open:** the **payment-data** strand (`e-reporting de paiement`) — who it binds, when and what it requires — is **[not researched]**. It is named in the official fiche as a separate pillar.

### Sanctions, and the start-up tolerance

Source: [impots.gouv.fr — `guide pratique de démarrage au 1er septembre 2026`](https://www.impots.gouv.fr/sites/default/files/media/1_metier/2_professionnel/EV/2_gestion/290_facturation_electronique/guide_pratique_facturation_electronique.pdf) · *official tax administration, PDF extracted and read* · **[checked 2026-11-10]**

**The legal bases, as the guide cites them:**

| Failure | Regime |
| --- | --- |
| Not issuing electronically | A fine **per invoice**, within the limits of **CGI art. 1737** |
| Not transmitting data under arts. 290 and 290 A | **CGI art. 1788 D** |
| Not using an accredited platform for **reception** | A `mise en demeure` first, with **three months to comply** before any fine applies. References: CGI art. 1737 IV bis; art. 289 bis |

That three-month formal-notice step for reception is worth knowing: the reception obligation does not produce an immediate fine.

**And the tolerance that matters most to a founder.** The guide states that during the start-up phase there will be **no sanctions against businesses that are having difficulty implementing the reform but are engaged in a serious compliance trajectory** — *"engagées dans une trajectoire sérieuse de mise en conformité"*. The administration will distinguish those from `inertie`, `évitement` or a durable refusal to enter the scheme.

So the honest advice is not "you will be fined on 1 September". It is: **be demonstrably on a trajectory.** Being late while working on it is treated differently from ignoring it — and the distinction turns on evidence, which is exactly what this skill's records are for.

**On the €500 / €15,000 figure** recorded earlier from secondary commentary: the official guide points to CGI art. 1788 D for the e-reporting regime rather than stating those amounts. Treat the figures as **not primary-confirmed** and cite the article instead.

### You may start early, on purpose

The guide confirms that a business whose issuing obligation only begins **2027-09-01 may voluntarily adopt e-invoicing before then** — to test its tools, train, and phase in exchanges with clients gradually.

For a founder running a pilot that is a real option rather than a technicality: the deadline is a ceiling, not a start date, and going early converts a hard cutover into a controlled one.

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

### What the client gets: France answers it twice

France does not have a single purpose rule like Germany's §31(5) UrhG. It has a **ceiling on what a transfer can quietly sweep up**, and a **floor the contract cannot take away**. Both matter, and they pull in opposite directions.

**The ceiling — art. L131-3 CPI**, *primary legislation read and quoted, in force since 1992-07-03* · **[checked 2026-11-10]** · [LEGIARTI000006278958](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278958)

> *"La transmission des droits de l'auteur est subordonnée à la condition que chacun des droits cédés fasse l'objet d'une mention distincte dans l'acte de cession et que le domaine d'exploitation des droits cédés soit délimité quant à son étendue et à sa destination, quant au lieu et quant à la durée."*

Two requirements, and the second has **four dimensions**:

| | Requirement |
| --- | --- |
| Each right | must carry a **distinct mention** in the deed of assignment — a blanket "all rights" clause does not satisfy this |
| The domain of exploitation | must be delimited as to **extent**, **destination**, **place** and **duration** |

This is stricter and more specific than either the German or the Dutch rule: Germany reads an unnamed use against the contract's purpose, the Netherlands reads a grant narrowly, and France requires the grant to have been **itemised and bounded in the first place**. For a founder drafting either side of a software contract, those four words are the checklist.

**The floor — art. L122-6-1 CPI**, *primary legislation read, version in force 2021-11-26* · **[checked 2026-11-10]** · [LEGIARTI000044365559](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044365559)

For software specifically, the person entitled to use it may do the following **without the author's authorisation**:

| | What | Can the contract remove it? |
| --- | --- | --- |
| I | Acts under L122-6 1° and 2° that are **necessary to use the software in accordance with its purpose**, *"y compris pour corriger des erreurs"* | Partly — the author **may contractually reserve** error correction and set conditions for it |
| II | A **backup copy** where necessary to preserve use of the software | **No** |
| III | **Observe, study or test** the software's operation or security to determine the underlying ideas and principles, while performing operations they are entitled to perform | **No** |
| IV | **Reproduce or translate the code** where indispensable to obtain interoperability information for independently created software, under conditions | **No** |

Art. L122-6-1 VIII makes that explicit: *stipulations contrary to II, III and IV are **void***. And the same paragraph sets the outer limit the other way — none of this may harm the normal exploitation of the software or unjustifiably prejudice the author's legitimate interests.

**What to tell a founder, in one line each:**

- **Selling software or a licence:** itemise each right and bound it four ways, or L131-3 puts the scope in question. A clause saying "all rights, worldwide, forever" is not an itemisation.
- **Buying or commissioning software:** you get the use-it-for-its-purpose floor plus a backup copy, study rights and interoperability decompilation, whatever the contract says. You do **not** get ownership, resale or sublicensing from that floor — see L113-9 above.
- **The one term worth negotiating explicitly:** error correction. It is the only item in that list the author can reserve, and a client locked out of fixing bugs in software they depend on has a commercial problem the statute will not solve for them.

**Still open:** how the courts apply the L131-3 delimitation to software contracts in practice, and the consequence of a defective delimitation — nullity of the clause, of the contract, or a narrow reading. **[not researched]**.

Use [../pilot-conditions.md](../pilot-conditions.md) §4 for the inventory discipline. Never infer ownership or clearance from payment alone, from AI generation, or from a repository's top-level licence.

---

## 6. Data protection

**The GDPR layer is shared — read [eu-gdpr.md](eu-gdpr.md)** for the controller/processor test, the processor-contract duties, the sub-processor rule, the register obligation, the 72-hour breach notification and the security principle.

**French specifics.** The supervisory authority is the **CNIL**, which publishes the most extensive small-business material of the four packs — including **four fact sheets on generative AI**, the only AI-specific national guidance any pack has found, a practical SME **FAQ**, and online services for **notifying a breach**. · [cnil.fr — TPE/PME](https://www.cnil.fr/fr/thematiques/tpe-pme) · *official authority* · **[checked 2026-11-10]**

### Its two SME documents — read, and dated

| Document | Date it carries | What it says about itself |
| --- | --- | --- |
| [`Respecter la vie privée, par où commencer ? La check-list pour les TPE/PME`](https://www.cnil.fr/sites/cnil/files/atoms/files/check-list_rgpd_pour_les_tpe-pme.pdf) | undated | *"remplir cette check-list ne garantit pas une conformité au RGPD"* |
| [`Guide pratique de sensibilisation au RGPD pour les petites et moyennes entreprises`](https://www.cnil.fr/sites/cnil/files/atoms/files/bpi-cnil-rgpd_guide-tpe-pme.pdf), CNIL with Bpifrance | **April 2018** | `Document non contractuel`, and written before 2018-05-25 — it describes the GDPR entering application in the **future tense** |

Both **extracted and read on 2026-11-10**. Like the Belgian SME guide ([belgium.md](belgium.md) §6), the French one is **pre-application awareness material, not a compliance standard**. Use it for the shape of the work; check any figure in it against something current before relying on it.

What they say that still holds:

- **The four actions**, offered as the whole entry point and as work that *"doivent perdurer dans le temps"*: build the register (`recensez vos fichiers`), cut the data down (`faites le tri`), honour information and rights (`respectez les droits des personnes`), secure what remains (`sécurisez vos données`).
- **What goes on each register sheet** — one per activity, not one per company: the purpose, the data categories, who has access, and the retention period, split into *how long the data is operationally useful* and *how long it is kept in archive*. The register sits with the head of the company. **Purely occasional processing need not be listed** — its example is a file built for a one-off shop opening.
- **The work scales with the data, not the company.** The guide states the criterion is the volume or sensitivity of the data processed, **not the size or headcount** of the business. The Belgian authority reaches the same conclusion from the other direction — see [belgium.md](belgium.md) §6.
- **A DPO is mandatory only for large-scale processing presenting particular risks**; in the other cases the CNIL *recommends* rather than requires one, notably where the activity forces a `PIA`.
- **Inactivity retention.** Its figure for customer and prospect data is **3 years from the end of the commercial relationship**, after which the record goes; data held under a separate legal duty (accounting, litigation) moves to a **distinct archive base** rather than staying in the live one. Carried from an April 2018 document — the CNIL's current `référentiels` are **[not researched]**.
- **Prospecting by electronic means** requires consent, and you must keep the **proof** of it.
- **Cookies and trackers:** information suffices for a strictly functional tracker (its example: a shopping basket), **consent** is required for an advertising one, and third-party features embedded in your pages — analytics, social buttons, embedded video — need the visitor's consent. The CNIL's cookie doctrine has moved since April 2018; the current guidelines are **[not researched]**, so treat this as the shape of the rule and not its present detail.
- For security it defers to the **ANSSI/CPME** `12 règles essentielles pour sécuriser vos équipements numériques` and to its own `guide sécurité des données personnelles`. Neither was read here.

Point a French founder at the CNIL's **current** pages, and at its register template, rather than at these two PDFs or at a paraphrase of them.

---

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| Franchise thresholds: `seuil` and `seuil majoré`, all five activity categories | 2026-11-11 | Authority — the official page refetched and its own category names and figures quoted; `Vérifié le 01 janvier 2026` |
| Mandatory mention `TVA non applicable - article 293 B du CGI`, required by art. 293 E CGI, and the `redressement fiscal` on omission | 2026-11-11 | Authority — official page read and quoted, including the 293 B / 293 E distinction |
| **Corrected on 2026-11-11:** this pack stated a mixed-activity rule (both thresholds, breach of either ends the regime) | 2026-11-11 | Withdrawn — the official page does not state it. It gives thresholds per category and a non-interference rule only for `avocats` and authors, which does not transfer. The secondary source was never recorded |
| The single €25,000 threshold was **abandoned** | 2026-11-11 | Authority — the official page says `abandonnée`, quoted |
| That it was suspended on 2025-02-28 and repealed by loi n° 2025-1044 of 2025-11-03 | 2026-11-11 | Unconfirmed — the official page mentions no law number, date or suspension, and the secondary source was never recorded. Légifrance returns 403 here. **Do not cite the law number** |
| PLF 2026 €25,000 for travaux immobiliers **rejected, not adopted** | 2026-11-10 | Secondary — consistent across sources; resolves an earlier open question |
| Receiving mandatory from 2026-09-01 | 2026-11-10 | Authority — official EU source read |
| Issuing: GE/ETI 2026-09-01, PME/TPE/micro 2027-09-01 | 2026-11-10 | Authority — official EU source read |
| Accredited platform mandatory; only a PDP provides full functions; 3-year accreditation | 2026-11-10 | Authority — impots.gouv.fr page read |
| E-reporting exists as a separate obligation; from 2026-09-01 for GE/ETI | 2026-11-10 | Authority — impots.gouv.fr page read |
| Crossing the `seuil`: VAT from 1 January of the following year | 2026-11-11 | Authority — official page read and quoted |
| Crossing the `seuil majoré`: franchise ends on the first day of the overrun, expressly no longer the first day of the month | 2026-11-11 | Authority — official page read and quoted. Answers for France what §19 UStG is silent on for Germany |
| Crossing €100,000 of EU turnover ends the franchise from the first day of the overrun | 2026-11-11 | Authority — official page read; the directive side is in eu-vat-sme.md |
| What the mixed-activity rule actually is | — | Open — the official page does not address a sales-plus-services business |
| E-reporting date and scope for micro/indépendants | — | Open — not yet researched |
| Formats UBL 2.1 / CII / Factur-X | 2026-11-10 | Authority — official EU source read |
| Official start guide for 2026-09-01 | 2026-11-10 | Authority — official PDF extracted and read |
| Accredited-platform list (official, regularly updated) | 2026-11-10 | Authority — the URL was recorded from the official fiche; the list itself not read |
| economie.gouv.fr reform page | 2026-11-10 | Unconfirmed — the fetch failed with HTTP 403, so the page was not read |
| Guichet unique mandatory since 2023-01-01; filing window, documents, free for micro, RDDCE receipt | 2026-11-10 | Authority — official page read |
| L442-1 I C.com: déséquilibre significatif triggers civil liability and damages | 2026-11-10 | Primary — Legifrance article read and quoted |
| Art. 1171 C.civ: non-negotiable clause deemed unwritten; object and price excluded | 2026-11-10 | Primary — Legifrance article read |
| Interaction: art. 1171 applies only outside L442-1's scope | 2026-11-10 | Primary — Cass. com. 26-01-2022, 20-16.782, the judgment itself read |
| How that 2022 holding has been applied since; the exact edge of L442-1 I 2° | — | Open — not yet researched |
| L113-9 CPI: devolved to employer for employees and public agents, incl. documentation; contract may displace | 2026-11-10 | Primary — Legifrance article read and quoted |
| L121-7 CPI: software moral rights narrowed — no veto on modification, no repentance or withdrawal | 2026-11-10 | Primary — Legifrance article read |
| L131-3: distinct mention per right; domain bounded as to extent, destination, place, duration | 2026-11-10 | Primary — Legifrance article read and quoted |
| L122-6-1: use for its purpose incl. error correction, backup copy, study, interoperability | 2026-11-10 | Primary — Legifrance article read |
| L122-6-1 VIII: stipulations against II, III and IV are **void**; error correction **may** be reserved | 2026-11-10 | Primary — Legifrance article read |
| How courts apply the L131-3 delimitation to software, and the sanction for a defective one | — | Open — not yet researched |
| CNIL small-business offering incl. registre des traitements and AI fact sheets | 2026-11-10 | Authority — CNIL landing page read |
| TPE-PME check-list: four actions, register sheet contents, security hygiene | 2026-11-10 | Authority — official PDF extracted and read |
| CNIL/Bpifrance PME guide is dated **April 2018** and marked `non contractuel` | 2026-11-10 | Authority — extracted and read; colophon quoted, and it is dated April 2018 |
| Occasional processing need not be registered; register sits with the company head | 2026-11-10 | Authority — extracted and read, from the April 2018 guide |
| 3-year inactivity retention for customer and prospect data | 2026-11-10 | Authority — read in the April 2018 guide, whose figure may since have moved; the current référentiels not read |
| CNIL cookie doctrine as it stands now | — | Open — only the April 2018 statement was read |
| CNIL `guide sécurité des données personnelles`; ANSSI/CPME 12 règles | — | Open — not yet researched |
| GDPR layer | — | Elsewhere — maintained in eu-gdpr.md |

Next full recheck due: **2027-05-10**. Earlier before 2027-09-01, when the issuing obligation reaches small businesses.

No independent French legal, tax or security reviewer has reviewed this pack.
