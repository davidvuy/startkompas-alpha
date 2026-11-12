# EU — GDPR: data protection officer and impact assessment

**This is an annex to [eu-gdpr.md](eu-gdpr.md) §6, not a layer of its own.** It exists because the GDPR layer went over this skill's 48 KB per-reference budget on 2026-11-11, and this was the part of it a founder reads once rather than on every pilot. Articles 37 and 35 in full: when each is required, the qualifier in each condition that a summary drops, the two places national law takes over, and what an assessment has to contain.

**This is preparation, not advice.** It records what the Regulation's own articles state, with dates. Consequential data-protection questions need a qualified reviewer and the founder's own national supervisory authority.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

All of it is read from the consolidated text `02016R0679 — EN — 04.05.2016 — 000.002`; see [eu-gdpr.md](eu-gdpr.md) §0 for why that version and not the act as published.

---

## Data protection officer — article 37(1)

Source: [Article 37 GDPR, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02016R0679-20160504) · *the authoritative text* · **[checked 2026-11-11]**

Art. 37(1) binds *"the controller and the processor"* alike to designate a DPO *"in any case where"* one of three things is true:

1. the processing is by a **public authority or body**, except for courts acting in their judicial capacity
2. the **core activities of the controller or the processor** consist of processing which, by its nature, scope and/or purposes, requires **regular and systematic monitoring of data subjects on a large scale**
3. the **core activities** consist of **large-scale** processing of special categories (art. 9) **or** criminal-offence data (art. 10) — the limb the corrigendum in [eu-gdpr.md](eu-gdpr.md) §0 rewrote

A one-person B2B service pilot normally meets none of them. Note the two qualifiers doing the work: **core activities** and **large scale**. Processing a customer list is neither, even though it is regular.

Where a DPO is designated, art. 37(5) to (7) add that they must be chosen for expert knowledge of data protection law, may be a staff member or a contractor, and that their contact details must be **published and communicated to the supervisory authority**. So an appointment is a visible act, not an internal note.

## A DPO can also be required by national law — article 37(4)

Art. 37(1) is not the whole answer, and the GDPR layer gave the impression it was until 2026-11-11. Art. 37(4):

> *"In cases other than those referred to in paragraph 1, the controller or processor … may or, **where required by Union or Member State law shall**, designate a data protection officer."*

**A member state may require a DPO where the GDPR does not.** Germany is the worked example, and it is worse than a headcount: §38(1) BDSG adds a 20-person threshold in its first sentence and then, in its second, four triggers that apply **regardless of how many people are involved** — including any processing that needs a DPIA, and market or opinion research. So a one-person German business can owe a DPO from its first client. Read [germany-data-protection.md](germany-data-protection.md), which quotes both sentences. **The Netherlands and Belgium are the counter-examples**: neither the `UAVG` nor the `wet van 30 juli 2018` sets a threshold for the private sector, so in both art. 37(1) is the whole test — see [netherlands-data-protection.md](netherlands-data-protection.md) and [belgium.md](belgium.md) §6. Three member states, three answers, under one permission, which is why this question goes to the national pack and not to this one. France is **[not researched]** — not for want of looking: `Loi n° 78-17` sits behind a bot-protection challenge, which [france-data-protection.md](france-data-protection.md) records.

So the answer to "do I need a DPO" is art. 37(1) **and then** the national pack. Answering it from the GDPR layer alone is answering half of it.

## Impact assessment — article 35

Source: [Article 35 GDPR, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02016R0679-20160504) · *the authoritative text* · **[checked 2026-11-11]**

Required where a type of processing, *"in particular using new technologies"*, is *"likely to result in a high risk to the rights and freedoms of natural persons"*, assessed by the controller *"prior to the processing"*. One assessment may cover a set of similar operations presenting similar risks.

Art. 35(3) says an assessment *"shall in particular be required"* in three cases:

1. a **systematic and extensive** evaluation of personal aspects based on automated processing, **including profiling**, on which decisions are based that produce legal effects or similarly significantly affect the person
2. **large-scale** processing of special category or criminal-offence data
3. **systematic monitoring of a publicly accessible area** on a large scale

Case 1 carries `and extensive`, which the GDPR layer dropped until 2026-11-11. It is doing the same work as `core activities` and `large scale` do for the DPO test: a one-off automated decision about one applicant is systematic, and is not extensive.

**Where this can bite a founder.** The general rule in 35(1) mentions processing *using new technologies*. A founder putting real customer data through an AI tool for the first time is doing exactly that, and if the output materially affects those people, case 1 comes into view. So do not answer "no DPIA needed" from the fact that the founder is small — answer it from the three cases plus the general rule, and if real personal data is heading into an AI tool, flag the assessment as a question rather than settling it.

## Your own authority publishes a list, and it is part of the test — article 35(4) and (5)

The three cases are not the whole answer either:

- **Art. 35(4):** each supervisory authority *"shall establish and make public a list of the kind of processing operations which are subject to the requirement"*. Not optional, and not advisory — it is the authority's own enumeration of what triggers 35(1) in its country.
- **Art. 35(5):** the authority *"may also"* publish a list of operations for which **no** assessment is required. That one is permissive, and of the four jurisdictions these packs cover **only France has used it** — see [france-data-protection.md](france-data-protection.md).

Which means a complete DPIA answer is: the general rule, the three cases in 35(3), **and the founder's own authority's art. 35(4) list**.

**Two of these lists are read, and they do not agree.** Entry 11 of the joint German list covers AI used to steer interaction with data subjects or to evaluate them, with AI-based customer support as its named field of use — so in Germany an AI support pilot is a listed case, not an arguable one. The Dutch `Besluit` has **no AI entry at all**, and its profiling entry instead drops art. 35(3)(a)'s legal-effects limb, which makes it broader than the Regulation in a different direction. See [germany-data-protection.md](germany-data-protection.md) and [netherlands-data-protection.md](netherlands-data-protection.md).

Belgium's list is read too and has **eight** entries against seventeen each in Germany and the Netherlands, with no AI entry and one — third-party data used to refuse or end a service contract — that carries **no scale qualifier at all**. See [belgium.md](belgium.md) §6, and the three-way comparison in [README.md](README.md).

France's is read too, and France is the **only one of the four with an art. 35(5) list in force** — the Netherlands consulted on a draft on 2026-06-24, which is not valid until the EDPB has given an opinion and it is published in the Staatscourant, and [netherlands-data-protection.md](netherlands-data-protection.md) records where that stands. France remains the only one to have published the art. 35(5) list — the one that says when an assessment is **not** required, including human-resources administration under 250 persons so long as no profiling is involved. See [france-data-protection.md](france-data-protection.md).

So the same pilot can be a listed assessment in one member state and an argument in the next, and only one of the four tells a founder where the duty stops. The four-way comparison is in [README.md](README.md). Never tell a founder no assessment is needed without saying which national list was checked.

## What an assessment must contain — article 35(7)

If one is required, art. 35(7) says it *"shall contain at least"* four things, which is worth knowing because it is far short of what a consultancy will quote for:

1. a systematic description of the processing and its purposes, including where applicable the legitimate interest pursued
2. an assessment of the **necessity and proportionality** of the processing against those purposes
3. an assessment of the risks to data subjects' rights and freedoms
4. the measures envisaged to address the risks, including safeguards, security measures and mechanisms to demonstrate compliance

Art. 35(9) adds that the controller *"shall, where appropriate, seek the views of data subjects or their representatives"*, and art. 35(11) that the assessment is reviewed when the risk changes. A DPIA is a document that gets revisited, not a one-off filing — and like the register in [eu-gdpr.md](eu-gdpr.md) §3, it is not filed anywhere.

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| DPO conditions, art. 37(1), with "controller and the processor" and the corrected limb 3 | 2026-11-11 | Primary — article text read on EUR-Lex, replacing a secondary reproduction |
| Art. 37(4): Member State law may require a DPO where art. 37(1) does not | 2026-11-11 | Primary — read and quoted |
| Art. 37(5)–(7): qualification, staff or contract, contact details published | 2026-11-11 | Primary — read |
| The German national DPO duty under §38 BDSG, including the triggers with no headcount | — | Elsewhere — read on 2026-11-11 and maintained in [germany-data-protection.md](germany-data-protection.md) |
| Whether France requires a DPO where art. 37(1) does not | — | Open — `Loi n° 78-17` could not be read; Légifrance served a bot-protection challenge on 2026-11-11, see [france-data-protection.md](france-data-protection.md) |
| **Corrected on 2026-11-11:** art. 35(3) case 1 was given without `and extensive` | 2026-11-11 | Withdrawn — the statute requires a *systematic and extensive* evaluation; the missing word widened the case |
| DPIA conditions, art. 35(1) and 35(3) | 2026-11-11 | Primary — article text read on EUR-Lex, replacing a secondary reproduction |
| Art. 35(4) authorities must publish a list of operations requiring a DPIA; 35(5) may publish the converse | 2026-11-11 | Primary — read |
| Contents of the national art. 35(4) lists | — | Elsewhere — all four are read in their own packs and all four differ; maintained there. France's art. 35(5) list is read too, and the Dutch **draft** one is recorded in [netherlands-data-protection.md](netherlands-data-protection.md) |
| Art. 35(7) four minimum contents; 35(9) views of data subjects; 35(11) review | 2026-11-11 | Primary — read |
| Controller and processor roles, registers, breach notification, security, lawful basis, transfers and data subject requests | — | Elsewhere — everything else about the GDPR is in [eu-gdpr.md](eu-gdpr.md) |

Next full recheck due: **2027-05-10**. Earlier if an amending act appears in the consolidated text's header, which [eu-gdpr.md](eu-gdpr.md) §0 records as absent on 2026-11-11.

No independent data-protection reviewer has reviewed this annex.
