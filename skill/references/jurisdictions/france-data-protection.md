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
- **Inactivity retention.** Its figure for customer and prospect data is **3 years from the end of the commercial relationship**, after which the record goes; data held under a separate legal duty (accounting, litigation) moves to a **distinct archive base** rather than staying in the live one. Carried from an April 2018 document — the CNIL's current `référentiels` are **[not researched]**.
- **Prospecting by electronic means** requires consent, and you must keep the **proof** of it.
- **Cookies and trackers:** information suffices for a strictly functional tracker (its example: a shopping basket), **consent** is required for an advertising one, and third-party features embedded in your pages — analytics, social buttons, embedded video — need the visitor's consent. The CNIL's cookie doctrine has moved since April 2018; the current guidelines are **[not researched]**, so treat this as the shape of the rule and not its present detail.
- For security it defers to the **ANSSI/CPME** `12 règles essentielles pour sécuriser vos équipements numériques` and to its own `guide sécurité des données personnelles`. Neither was read here.

Point a French founder at the CNIL's **current** pages, and at its register template, rather than at these two PDFs or at a paraphrase of them.

## The French statute could not be read, and that is worth recording

`Loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés`, as rewritten for the GDPR, is France's national data-protection act — the counterpart to the German `BDSG`, the Dutch `UAVG` and the Belgian `wet van 30 juli 2018`, all three of which are read in their own packs. It is **[not researched]**, and so are the criminal provisions in the `Code pénal` that France, like Belgium, maintains under art. 84 GDPR.

The reason is not that nobody looked. On **2026-11-11** every attempt to open `legifrance.gouv.fr` — the act, and the `Délibération` texts behind the two lists above — returned a bot-protection challenge instead of the page. This project does not attempt to get past one. So the French statutory layer stays open until the site serves it, and the open rows below say so rather than implying nobody tried.

**Two consequences worth being explicit about.**

- **Six rows in [france.md](france.md) cite Légifrance and are labelled `Primary`.** They were genuinely read, on 2026-11-10, when the site served pages normally — articles L442-1, 1171 of the Civil Code, L113-9, L121-7, L131-3 and L122-6-1, plus a Cour de cassation judgment. Those rows stand. What has changed is that **the next recheck of them will hit the same wall**, and `check-links.mjs` already reports all seven of those URLs as `blocked 403` warnings rather than as live.
- **The one French source that is reliably readable is the CNIL itself**, which publishes a great deal — the two lists above, the SME material in §6 of the pack, its `référentiels` and its sector guides. For France, that makes the pack's centre of gravity `Authority` rather than `Primary`, and the honest thing is to say so in the rows instead of upgrading them on the strength of a citation nobody could open.

The CNIL's `référentiels`, its individual sector guides, and its current cookie and tracker guidelines remain **[not researched]** — they are reachable, so that is ordinary unfinished work rather than a blocked source.

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
| The CNIL's `référentiels`, sector guides, and current cookie and tracker guidelines | — | Open — reachable, simply not yet read |

Next full recheck due: **2027-05-10**. Earlier if Légifrance becomes readable again, which would let the French statutory layer be closed, or if the CNIL replaces either list.

No independent French legal reviewer has reviewed this annex.
