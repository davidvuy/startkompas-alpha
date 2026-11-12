# France — data protection (annex)

**This is an annex to [france.md](france.md) §6, not a pack of its own.** It exists because the French pack went over this skill's 48 KB per-reference budget once the CNIL's two impact-assessment lists were read. The EU rules are in [eu-gdpr.md](eu-gdpr.md) and its annexes; §6 of the pack names the authority and what it publishes for a small business. Everything else French is here.

**This annex is preparation, not advice.** It records what the CNIL's own publications state, with dates. The French statutory layer is **not** here, for a reason given at the end that matters more than the gap itself. Consequential data-protection questions need a qualified reviewer and the CNIL.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

---

## France is the only one of these four with an exemption list

[eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md) sets out the two halves of art. 35: paragraph 4 obliges every supervisory authority to publish a list of processing that **requires** an impact assessment, and paragraph 5 *permits* one listing processing that **does not**. Germany, the Netherlands and Belgium have published the mandatory list only. **The CNIL has published both**, so France is where the permissive half of the article can actually be read:

| | Instrument | What it does |
| --- | --- | --- |
| art. 35(4) | `Délibération n° 2018-327` of 2018-10-11 | the processing for which an `AIPD` is **required** |
| art. 35(5) | `Délibération n° 2019-118` of 2019-09-12 | the processing for which one is **not** |

Both are published by the CNIL as standalone lists, and both were read from those files. The `Délibération` texts themselves are on Légifrance, which could not be read — see the last section.

### What requires an assessment — the 2018-327 list

Source: [CNIL — `Liste des types d'opérations de traitement pour lesquelles une analyse d'impact relative à la protection des données est requise`](https://www.cnil.fr/sites/cnil/files/atoms/files/liste-traitements-aipd-requise.pdf) · *the supervisory authority's own list under art. 35(4)* · **[checked 2026-11-11]**

A three-column table: the type of processing, **which of the EDPB's nine criteria it meets**, and worked examples. The criteria column is the useful part, because it shows the authority's reasoning rather than only its conclusion.

**The count is deliberately not quoted here.** Germany's, the Dutch and the Belgian lists number their entries, so counting them is reading them; the CNIL's table does not, and a count of it would be this pack's arithmetic rather than the authority's. The same discipline as art. 30(5) in [eu-gdpr.md](eu-gdpr.md) §3.

Four of its types can reach a one-person business, and none of them needs scale:

| Type of processing | Criteria the CNIL cites | Examples it gives |
| --- | --- | --- |
| Processing that builds **profiles of individuals for human-resources purposes** | evaluation or scoring; vulnerable persons | detecting and managing "high potentials"; **recruitment assisted by a selection algorithm**; proposing personalised training through an algorithm; predicting which employees will leave, from correlations between factors |
| **Profiling that can lead to exclusion from, suspension of, or termination of a contract** | evaluation or scoring; matching or combining datasets | a score for granting credit; behavioural analysis to detect prohibited behaviour on a social network; payment-fraud prevention |
| **Profiling that draws on data from external sources** | evaluation or scoring; matching or combining datasets; innovative use of new technology; collection of sensitive data | data combination by **data brokers**; **personalising online advertising** |
| Processing intended to **monitor employees' activity constantly** | vulnerable persons; systematic monitoring | data-loss-prevention analysis of outgoing email; video surveillance of employees handling money; tachographs in road-transport vehicles |

The others are health data in care settings, genetic data on vulnerable people, health-data warehouses and registries, social and professional whistleblowing systems, biometric recognition including vulnerable people, social-housing applications, social and medico-social support, and large-scale location data.

**Two of those four are products a founder might build, not policies they might adopt.** An algorithm that helps screen applicants, and a model that personalises advertising using bought-in data, are both named. France frames in terms of *profiling* what Belgium frames in terms of *where the data came from* — and the French version catches the founder who builds the profiling even when the data is their own.

### What does not require one — the 2019-118 list, and the three sentences above it

Source: [CNIL — `Liste des types d'opérations de traitement pour lesquelles une analyse d'impact relative à la protection des données n'est pas requise`](https://www.cnil.fr/sites/cnil/files/atoms/files/liste-traitements-aipd-non-requise.pdf) · *the supervisory authority's own list under art. 35(5)* · **[checked 2026-11-11]**

Its preamble is three sentences and they do most of the work:

- being on the list **does not relieve the controller of its other GDPR obligations**
- processing exempted from an assessment **must still be evaluated for GDPR compliance, legally and on security**
- and, following the EDPB's guidelines, **where there is doubt about whether an assessment is needed, the CNIL recommends doing one**

Read the third against the Dutch authority's position in [netherlands-data-protection.md](netherlands-data-protection.md), that declining an assessment must itself be substantiated, and the Bavarian checklist in [germany-data-protection.md](germany-data-protection.md), which prints a `Begründung` line beside its "no". Three authorities, three phrasings, one instruction: **the decision not to assess is a decision, and it needs a reason on the record.**

Two entries on the exemption list reach an ordinary small business:

- **Human-resources processing for staff administration by organisations employing fewer than 250 persons — "with the exception of any recourse to profiling".** The examples are payroll and payslips, training administration, the staff canteen and meal vouchers, expense reimbursement, working-time recording, annual appraisal records, the mandatory registers, and the use of communication tools — email, telephony, videoconferencing, online collaboration tools — **without profiling and without biometrics**. Note the figure: **250 persons again**, the same threshold as art. 30(5)'s register exemption, which [eu-gdpr.md](eu-gdpr.md) §3 explains almost never helps. Here it does help, for this one purpose, as long as no profiling is involved — which is exactly what the required list above catches.
- **Supplier-relationship management.** Administrative operations on contracts, orders, deliveries, invoices, payments and the supplier side of the accounts; drawing payment instruments; financial and turnover statistics per supplier; supplier selections; and keeping documentation on suppliers. So a founder's ordinary vendor administration is named as needing no assessment.

The remaining entries are municipal electoral rolls, works councils, non-profit member and donor management where no sensitive data is involved, individual health professionals, **lawyers in individual practice** — expressly including sensitive data about vulnerable people — commercial-court registrars, notaries, local authorities' school and early-years services, non-biometric access control and working-time recording, and alcohol interlocks in transport.

**A caution about reading French verbatim from these two files.** They were read from the CNIL's own PDFs, whose text layer drops apostrophes and the `œ` ligature, so every phrase above is given in English rather than quoted in French. Where a French formulation matters — and in `à l'exception du recours au profilage` it does — check it against the PDF or the `Délibération` on Légifrance before relying on the wording.

## The CNIL's own material for a small business

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
- **Inactivity retention.** Its figure for customer and prospect data is **3 years from the end of the commercial relationship**, after which the record goes; data held under a separate legal duty (accounting, litigation) moves to a **distinct archive base** rather than staying in the live one. The current `référentiel` confirms both, and **splits the figure in two** — the three years run from the end of the relationship for a client but from collection or the prospect's own last contact for a prospect. The section below gives it as the CNIL now states it; prefer that to this bullet.
- **Prospecting and cookies.** Both bullets this guide carried on these have been **replaced** by the section below, read from the CNIL's current pages on 2026-11-12. The old prospecting sentence was wrong for a B2B pilot, which is the case this skill exists for.
- For security it defers to the **ANSSI/CPME** `12 règles essentielles pour sécuriser vos équipements numériques` and to its own `guide sécurité des données personnelles`. Neither was read here.

Point a French founder at the CNIL's **current** pages, and at its register template, rather than at these two PDFs or at a paraphrase of them.

## Prospecting a French business — the rule this annex had backwards

**Why this section exists at all.** Every pilot this skill supports begins by contacting someone who did not ask to be contacted, so prospecting is not a side topic here: it is the founder's first act. France regulates it in three places at once — the GDPR's legal bases, art. L34-5 of the `Code des postes et des communications électroniques` for electronic messages, and, since **2026-08-11**, art. L223-1 of the `Code de la consommation` for telephone calls.

Until 2026-11-12 this annex carried a single sentence on the subject, taken from the April 2018 SME guide: `Prospecting by electronic means requires consent, and you must keep the proof of it.` **For a B2B pilot that is the wrong answer**, and wrong in the direction that stops a founder working — it forbids the ordinary first email. The CNIL's current position is below.

### Who you are contacting decides the basis

| Recipient | Channel | Basis the CNIL accepts | Required either way |
| --- | --- | --- | --- |
| A **professional at their work address or work number**, where the subject matter relates to their profession | email, SMS/MMS, automated call, telephone | **legitimate interest — no prior consent** | inform them the address or number will be used for prospecting, and give a **simple and free** way to object, at collection and in every message |
| A **consumer** | email, SMS/MMS, automated call | **prior consent**: free, specific, informed, unambiguous, by a dedicated box that is **not pre-ticked** — accepting terms and conditions does not suffice | the same information, and withdrawal at any time |
| A **consumer** | telephone | **prior consent**, since 2026-08-11 — see below | as above |
| Anyone | **postal mail** | **opt-out** | the same information and objection route |
| A **generic company address** — `info@`, `contact@`, `commande@` | any | **outside these rules**: the CNIL states these concern legal persons and are *"ne sont pas soumises aux principes rappelés ci-dessus"* | — |

The CNIL's own illustration of the B2B case is *"un appel présentant les mérites d'un logiciel au directeur informatique d'une entreprise"* — pitching software to a company's IT director. **That is the pilot case, and it needs no consent.** What it needs is the notice and the working opt-out, in every message, which is a product decision a founder can make on day one and cannot retrofit cheaply.

**Three traps worth naming.**

- **The existing-client exception needs an actual sale.** For consumers, prospecting about *similar products or services from the same company* escapes prior consent — but the CNIL has held in a sanction decision that **creating an online account is not enough**: no purchase, no client, no exception.
- **A bought list does not import a basis.** Where the data is *"déjà en possession de la société ou acquises auprès de tiers"*, you must still satisfy yourself the person was informed that their address or number might be used for prospecting, and can object.
- **Honouring an objection is not the same as deleting the row.** The CNIL recommends a `liste repoussoir` — a suppression list — and that the information needed to respect an objection be kept **at least three years**, used for nothing else, so that a later imported prospect list cannot resurrect the contact. Deleting someone on request therefore means deleting them from the prospecting base and keeping the minimum needed to keep them out of it.

Sources
- [`La prospection commerciale par courrier électronique, SMS-MMS et automate d'appel`](https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique-sms-mms-et-automate-dappel) · *official authority, page dated 2026-06-10, both the B to C and B to B tabs read* · **[checked 2026-11-12]**
- [`Questions-réponses sur les référentiels`](https://www.cnil.fr/fr/questions-reponses-sur-les-referentiels-relatifs-la-gestion-des-activites-commerciales-et-des) · *official authority, 2022-01-28, read with every accordion expanded* · **[checked 2026-11-12]**

### Guessing an address from a name is itself processing — the CNIL's position of 2026-10-16

The standard growth tactic is to deduce `prenom.nom@entreprise.fr` from a name and an employer found online. The CNIL published its position on this on **2026-10-16**, and it is recent enough that most secondary advice predates it.

Its starting point: *"Le fait que les données utilisées pour reconstituer ces adresses soient accessibles sur Internet ne dispense pas les organismes de respecter les règles applicables."* Being findable is not permission. The practice **can** rest on legitimate interest, on conditions:

| What the CNIL asks you to weigh | What it says about it |
| --- | --- |
| **The purpose, and how intrusive the step is** | reconstitution is rarely isolated — it is a technical step inside a larger, pre-identified purpose, so it *"peut généralement reposer sur la même base légale que ce traitement"*. B2B prospecting on legitimate interest therefore generally carries the reconstitution too. **Not automatic, not systematic.** |
| **How visible the data was, and how much control the person kept** | the test is whether the person could reasonably expect it. Two cases are called out as failing *a priori*: someone with **no identifiable online presence at all**, and someone who took steps to restrict access — tightened privacy settings, or publishing a contact form instead of an address |
| **The safeguards you put in place** | two are named: keep the reconstituted address **only where a first effective contact is actually made within a reasonable time**; and make any objection exclude the person from all later reconstitution **immediately and without a reason tied to their particular situation** |

That second safeguard is stronger than art. 21 GDPR requires, and it is the one a founder's tooling will not do by default. Where the conditions cannot be met, the CNIL's instruction is to **abstain** unless consent can be obtained.

Source · [`Reconstitution d'adresses électroniques professionnelles : dans quel cadre est-ce autorisé ?`](https://www.cnil.fr/fr/reconstitution-adresses-professionnelles-quel-cadre) · *official authority, 2026-10-16* · **[checked 2026-11-12]**

### Telephone prospecting: the regime changed on 2026-08-11

For **consumers**, France moved from opt-out to **opt-in**. Art. L223-1 `Code de la consommation`, as it stands from the `loi du 30 juin 2025`, is the provision; the CNIL dates the change to **2026-08-11** and says a joint FAQ with the DGCCRF is still to come.

- **Consent**, with the content set by `décret n° 2026-662 du 23 juillet 2026`: the request must state the caller's identity and the nature of the goods or services, the consent is **valid for one year**, it is withdrawable at any time, and the person may ask to see the proof. **The proof must be kept at least three years** from collection, on a durable medium, accessible to the consumer free of charge on request.
- **Calling hours**, where consent exists: Monday to Friday, 10:00–13:00 and 14:00–20:00. Outside those windows, and on Saturdays, Sundays and public holidays, it is prohibited unless the consumer agreed to be called then.
- **Three exceptions** to prior consent, as the CNIL heads them: supply of newspapers, periodicals or magazines (art. L223-5); a call about **an existing contract** and related to its subject — which may include performing it, complementary products or services, and offers improving the service, but **not** offers unconnected to it; and prospecting that is **not commercial**, such as charitable calls, which then runs on legitimate interest with information and an objection route.
- **Sector bans:** telephone prospecting is **wholly prohibited** for energy renovation, for adapting homes to loss of autonomy, and for the `compte personnel de formation`.
- A call answering the consumer's **own explicit request for information** is allowed within **five working days** and limited to the goods or services they asked about.

For **professionals** nothing changed: legitimate interest, information, and a simple free objection — the same test as for email.

Source · [`Prospection commerciale par téléphone (hors automate d'appel)`](https://www.cnil.fr/fr/prospection-commerciale-par-telephone-hors-automate-dappel-quelles-sont-les-regles) · *official authority, page dated 2026-06-10, both tabs read* · **[checked 2026-11-12]**

### How long the list may be kept — the `gestion commerciale` référentiel

The référentiel published on **2022-01-28** replaced `norme simplifiée n° 48`, which lost its legal value when the GDPR came into application. It covers client and prospect files: contract management, loyalty programmes, satisfaction surveys, complaints and after-sales, and prospecting. It **excludes** fraud detection and prevention, processing that can exclude someone from a service, and **profiling built on third-party data or on data collected through cookies and other trackers** — so a founder enriching a prospect list from a data broker is outside it.

| Record | Retention it gives |
| --- | --- |
| **Client** data used for prospecting | the commercial relationship, then **three years** from its end — its own examples of the start of that period: a purchase, a warranty's expiry, the end of a services contract, or the last contact **from the client** |
| **Non-client prospect** data | **three years** from collection or from the last contact **coming from the prospect**. A click on a hyperlink in an email counts; *"la simple ouverture d'un courriel ne devrait pas être considérée comme un contact émanant du prospect"* |
| At the end of those three years | you may contact the person once to ask whether they want to keep receiving solicitations. **Absent an explicit positive answer, delete or archive** |
| An **inactive account** | the référentiel treats **two years** as proportionate before the account is considered inactive and deleted |
| **Contract** data after the contract ends | intermediate archiving for the limitation period, in a **dedicated archive base or a logical separation** inside the active one, after sorting out what is worth archiving |
| The **card security code** | deleted as soon as the payment is complete |
| Information needed to **respect an objection** | at least three years, and usable for nothing else |

**The référentiel is not binding, and this matters for how its rows are labelled.** The CNIL states it plainly: *"Les référentiels ne sont pas contraignants"* — a controller may depart from it, retention periods included, **provided they can justify the choice**, for which they remain responsible. Following it buys legal certainty, not immunity; departing from it is permitted, not free. Its rows below are therefore `Authority`, never `Primary`, and the pack says "the CNIL gives" rather than "the law requires".

It is also *"une aide à la réalisation d'une analyse d'impact"* where one is needed — which ties it to the two French lists at the top of this annex and to [eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md).

Sources
- [`Référentiel relatif aux traitements de données à caractère personnel mis en œuvre à fins de gestion des activités commerciales`](https://www.cnil.fr/sites/cnil/files/atoms/files/referentiel_traitements-donnees-caractere-personnel_gestion-activites-commerciales.pdf) · *official authority, PDF extracted and read; §7 `Durées de conservation` quoted* · **[checked 2026-11-12]**
- [`Gestion commerciale et gestion des impayés : la CNIL publie deux nouveaux référentiels`](https://www.cnil.fr/fr/gestion-commerciale-et-gestion-des-impayes-la-cnil-publie-deux-nouveaux-referentiels) · *official authority, 2022-01-28 — the publication date and the replacement of NS-48* · **[checked 2026-11-12]**

### Cookies: the exemption a founder's own site can usually live inside

The April 2018 shape of the rule — information for a strictly functional tracker, consent for an advertising one — still holds, but the operative question for a one-person pilot is narrower: **can the landing page keep its analytics without a consent banner?** Under art. 82 `loi Informatique et Libertés` it can, if the trackers:

- serve a purpose **strictly limited to measuring the audience** of that site or app — performance, navigation problems, technical or ergonomic optimisation, server sizing, which content is read — **for the publisher's exclusive account**; and
- produce **anonymous statistics only**.

And if they do **not**:

- lead to the data being cross-referenced with other processing, or non-anonymous data being passed to third parties; or
- allow the person's browsing to be followed **across** apps or sites. Any solution using one identifier across several sites to deduplicate or measure unified reach is excluded.

The CNIL adds recommendations rather than conditions: inform users, for instance in the privacy policy; keep the tracker's **lifetime** to something like **thirteen months**, **not automatically extended** on a new visit; keep the information collected for at most **twenty-five months**; and review both periodically.

**Two practical notes it makes itself.** Several market analytics offers fall outside the exemption because the provider reuses the data for its own account — though some can be configured not to. And watch for transfers outside the EU by the provider. A provider may say its tool meets the criteria after using the CNIL's self-assessment tool, but **may not call it "certified" or "validated by the CNIL"**, nor use the CNIL's logo.

Source · [`Cookies : solutions pour les outils de mesure d'audience`](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience) · *official authority, page dated 2025-07-04* · **[checked 2026-11-12]**

## The CNIL's security guide is an agenda, and it is readable in full

Sources
- [`Guide de la sécurité des données personnelles`](https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles) · *official authority, the complete sheet list read in its HTML form* · **[checked 2026-11-12]**
- [`Sécurité : Gérer la sous-traitance`](https://www.cnil.fr/fr/securite-gerer-la-sous-traitance) · *official authority, sheet 14, dated 2024-03-14, read in full* · **[checked 2026-11-12]**

**Twenty-five numbered sheets, each with one job.** In order: piloting security; defining a framework for users; involving and training them; authenticating users; managing authorisations; securing workstations; securing mobile computing; protecting the network; securing servers; securing websites; **framing software development**; protecting premises; securing exchanges with the outside; **managing processors**; maintenance and end of life of hardware and software; logging operations; backups; continuity and recovery; **incidents and breaches**; risk analysis; encryption, hashing and signature; **cloud**; **mobile applications**; **artificial intelligence: design and training**; and **APIs**. A self-assessment, *"Avez-vous pensé à ?"*, closes it.

**The last four are the ones a software founder will reach for**, and they are the newest: cloud, mobile applications, AI design and training, and APIs were added when the guide was reorganised into five parts. Sheet 24's stated purpose is *"[s]e doter des ressources et outils nécessaires pour développer un système d'IA robuste, fiable et performant"* — which sits beside, not inside, the AI Act obligations in [eu-ai-act.md](eu-ai-act.md).

**Each sheet has the same three levels**, and that shape is why the guide works as an agenda rather than a lecture: *les précautions élémentaires*, *ce qu'il ne faut pas faire*, and *pour aller plus loin*.

### Sheet 14, because it is the one a pilot needs first

Every pilot in this skill has suppliers. Art. 28 GDPR says what the contract must contain — see [eu-gdpr.md](eu-gdpr.md) for the six particulars. **The CNIL adds what to do about it**, and the items below are not in art. 28:

- **Before choosing.** Use only processors offering sufficient guarantees in *"connaissances spécialisées, fiabilité et ressources"*, and **ask the provider for its information-security policy and any certifications**.
- **In the contract**, besides the art. 28 content: the split of responsibility for confidentiality; **minimum requirements on user authentication**; **the conditions for returning and destroying the data at the end of the contract**; incident rules that include telling the controller *"dans les plus brefs délais"* on discovering a security flaw or incident; the assistance the processor owes; and a **regular review of the security measures** with the conditions for revising them.
- **A way to check.** Provide means to verify the guarantees — security audits, visits — covering encryption by sensitivity or a procedure ensuring the provider has **no access to data it does not need**, encrypted transmission such as HTTPS or VPN, and network protection, logging, authorisation management and authentication.

**What it says not to do** is short and is exactly what a founder in a hurry does: start the work without a signed art. 28 contract, and take cloud services *"sans garantie quant à la localisation géographique effective des données"* and without checking what a transfer outside the Union requires.

**And three things worth carrying into any jurisdiction.** The **whole sub-processing chain** should be considered, not only the direct processor. A certification is a *first indicator* of reliability and not a conclusion — it names **ISO/IEC 27001** for information security management and **ISO/IEC 27701** for privacy information management. And where the provider holds a certification, **ask for it and check its scope**, because a certificate covering a different service is no comfort at all.

## The French statute could not be read, and that is worth recording

`Loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés`, as rewritten for the GDPR, is France's national data-protection act — the counterpart to the German `BDSG`, the Dutch `UAVG` and the Belgian `wet van 30 juli 2018`, all three of which are read in their own packs. It is **[not researched]**, and so are the criminal provisions in the `Code pénal` that France, like Belgium, maintains under art. 84 GDPR.

The reason is not that nobody looked. On **2026-11-11** every attempt to open `legifrance.gouv.fr` — the act, and the `Délibération` texts behind the two lists above — returned a bot-protection challenge instead of the page. This project does not attempt to get past one. So the French statutory layer stays open until the site serves it, and the open rows below say so rather than implying nobody tried.

**Two consequences worth being explicit about.**

- **Six rows in [france.md](france.md) cite Légifrance and are labelled `Primary`.** They were genuinely read, on 2026-11-10, when the site served pages normally — articles L442-1, 1171 of the Civil Code, L113-9, L121-7, L131-3 and L122-6-1, plus a Cour de cassation judgment. Those rows stand. What has changed is that **the next recheck of them will hit the same wall**, and `check-links.mjs` already reports all seven of those URLs as `blocked 403` warnings rather than as live.
- **The one French source that is reliably readable is the CNIL itself**, which publishes a great deal — the two lists above, the SME material in §6 of the pack, its `référentiels` and its sector guides. For France, that makes the pack's centre of gravity `Authority` rather than `Primary`, and the honest thing is to say so in the rows instead of upgrading them on the strength of a citation nobody could open.

**That is why the section above exists.** The `gestion commerciale` référentiel, the current prospecting pages and the cookie exemption were all read on **2026-11-12** straight from cnil.fr, and they carry the weight the French statutory layer cannot. What remains **[not researched]** is narrower: the CNIL's individual **sector** guides, its `référentiel` on `gestion des impayés` — relevant only once a pilot has unpaid invoices — and its `guide sécurité des données personnelles`.

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| France has both an art. 35(4) and an art. 35(5) list, and is the only one of the four packs with the second | 2026-11-11 | Authority — both CNIL lists read in full; the other three packs' authorities publish the mandatory list only |
| The art. 35(4) list is `Délibération n° 2018-327` of 2018-10-11, tabulated against the EDPB's nine criteria | 2026-11-11 | Authority — the CNIL's published list read; the `Délibération` text on Légifrance could not be opened |
| HR profiling, including recruitment by selection algorithm, requires an assessment | 2026-11-11 | Authority — read, with the CNIL's own examples |
| Profiling that can exclude someone from a contract, and profiling on externally sourced data including ad personalisation, require one | 2026-11-11 | Authority — read, with the CNIL's own examples |
| Constant monitoring of employees requires one | 2026-11-11 | Authority — read |
| The number of entries on the French list is deliberately not stated | 2026-11-11 | Primary — art. 35(4) read; the CNIL's table is unnumbered, so a count would be this pack's and not the authority's |
| The art. 35(5) list is `Délibération n° 2019-118` of 2019-09-12 | 2026-11-11 | Authority — the CNIL's published list read |
| Exemption for HR administration under 250 persons, excluding profiling; and for supplier-relationship management | 2026-11-11 | Authority — read, with the CNIL's own examples |
| Its preamble: other obligations survive, compliance must still be assessed, and in doubt do an assessment | 2026-11-11 | Authority — read and summarised; the French wording not quoted, for the reason given above |
| French phrases from these two PDFs are given in English, because the files' text layer drops apostrophes and `œ` | 2026-11-11 | Primary — established by extracting both files |
| `Loi n° 78-17` and the `Code pénal` provisions under art. 84 GDPR | — | Open — Légifrance served a bot-protection challenge on 2026-11-11 and this project does not attempt to pass one. Not "not looked at": blocked |
| B2B electronic and telephone prospecting may rest on **legitimate interest**, with information and a simple free objection, where the subject relates to the person's profession | 2026-11-12 | Authority — the CNIL's own B to B tabs on both prospecting pages read, with its IT-director example |
| Generic company addresses (`info@`, `contact@`) fall outside these rules as data of legal persons | 2026-11-12 | Authority — read, and quoted |
| A consumer needs prior consent for electronic prospecting; an online account without a purchase does not make them a client | 2026-11-12 | Authority — read; the CNIL attributes the account point to a sanction decision, which was not itself read |
| Telephone prospecting to consumers requires consent from **2026-08-11**: one-year validity, proof kept three years, calling hours, three exceptions, sector bans | 2026-11-12 | Authority — the CNIL page of 2026-06-10 read. `Loi du 30 juin 2025`, art. L223-1 `Code de la consommation` and `décret n° 2026-662` are cited as the CNIL cites them; Légifrance is blocked, so none was read in primary form |
| Reconstituting a professional address can rest on legitimate interest, generally on the same basis as the prospecting it serves, and fails *a priori* for someone with no online presence or who restricted access | 2026-11-12 | Authority — the CNIL's position of 2026-10-16 read in full |
| The CNIL asks that an objection exclude a person from later reconstitution without a reason tied to their situation — more than art. 21 requires | 2026-11-12 | Authority — read; the comparison with art. 21 is this pack's, from [eu-gdpr.md](eu-gdpr.md) |
| The `gestion commerciale` référentiel's retention periods, including that a click counts as contact and opening an email does not | 2026-11-12 | Authority — the référentiel PDF extracted and §7 read |
| The référentiels are **not binding**; departing from them is permitted if justified | 2026-11-12 | Authority — the CNIL states it in both the FAQ and the publication notice, and both were read |
| Audience-measurement trackers are exempt from consent under art. 82 on the conditions listed; the 13- and 25-month figures are recommendations, not conditions | 2026-11-12 | Authority — the CNIL page of 2025-07-04 read; art. 82 `loi 78-17` itself is on blocked Légifrance |
| The old sentence `Prospecting by electronic means requires consent, and you must keep the proof of it` was wrong for B2B and is withdrawn | 2026-11-12 | Withdrawn — carried from the April 2018 guide until 2026-11-12, when the CNIL's current pages were read |
| The security guide's 25 sheets, their three-level shape, and the four newest — cloud, mobile apps, AI, APIs | 2026-11-12 | Authority — the guide's HTML index read in full |
| Sheet 14 on processors: what to ask for before choosing, what the contract adds beyond art. 28, and how to verify it | 2026-11-12 | Authority — the sheet read in full and quoted; it carries its own date of 2024-03-14 |
| Sheet 14's two "do not": starting without a signed art. 28 contract, and cloud without the effective location of the data | 2026-11-12 | Authority — read and quoted |
| The whole sub-processing chain counts; ISO/IEC 27001 and 27701 are a first indicator, not a conclusion | 2026-11-12 | Authority — read |
| The CNIL's sector guides and its `gestion des impayés` référentiel | — | Open — reachable, simply not yet read |

Next full recheck due: **2027-05-10**. Earlier if Légifrance becomes readable again, which would let the French statutory layer be closed, or if the CNIL replaces either list.

No independent French legal reviewer has reviewed this annex.
