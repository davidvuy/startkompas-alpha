# EU — GDPR layer

**This is a shared layer, not a country.** The GDPR applies directly in every EU member state, so the rules below hold identically in the Belgium, Netherlands, Germany and France packs. Each national pack carries only what is *national*: which supervisory authority is competent, and what that authority publishes.

Read this together with the relevant national pack. Neither replaces the other.

**This layer is preparation, not advice.** It records what EU regulator guidance states, with dates. Consequential data-protection questions need a qualified reviewer and the founder's own national supervisory authority.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

---

## 1. Controller or processor

Source: [EDPB — data controller or data processor](https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en) · *EU regulator guidance* · **[checked 2026-11-10]**

The test is decision-making authority:

> *"A data controller determines the purposes and means of processing personal data."*
> *"A processor acts under the instructions of the controller only, by processing personal data on behalf of the controller."*

Whoever decides the **why** and the **how** is the controller; whoever merely executes is the processor. **Roles follow the actual purposes and instructions** — never a product name, a contract title or what a vendor calls itself.

For a solo founder this is rarely obvious. Running a pilot on your own idea, with your own purposes, makes you a controller for that data. Processing a client's customer list strictly on their instructions makes you a processor for it. Both can be true at once for different data in the same engagement — resolve it per flow, not per relationship.

## 2. What a processor contract must cover

A controller–processor contract must require the processor to:

- process only on the controller's instructions
- keep authorized personnel under confidentiality
- ensure the security of processing
- obtain **written authorization before engaging a sub-processor**
- assist with data subject rights requests
- support breach notification and impact assessments
- delete or return the data at the end of the engagement
- provide documentation demonstrating compliance
- permit audits and inspections

Sub-processors need written authorization, and the processor must bind each one to protection **equivalent to the main contract**. **The processor remains liable to the controller for its sub-processors' breaches** — directly relevant to any founder who builds on, or resells, another provider.

An unsigned template is not a contract. A customer's approval is not a lawful basis and not an adequate safeguard.

## 3. Register of processing activities

The `verwerkingsregister` / `registre des traitements` / `Verzeichnis von Verarbeitungstätigkeiten`.

**Article 30(1)** requires a controller to record: its own identity and contact details, the purposes of processing, the categories of data subjects and of personal data, the categories of recipients, third-country transfers and their safeguards, the envisaged erasure periods, and a general description of the security measures.

### The under-250 exemption, and why it probably does not help you

Article 30(5) exempts *"an enterprise or an organisation employing fewer than 250 persons"* — **unless** any one of four conditions applies:

1. the processing is likely to result in a risk to the rights and freedoms of data subjects
2. **the processing is not occasional**
3. it involves special categories of data (art. 9(1))
4. it involves personal data on criminal convictions and offences (art. 10)

Source: [Article 30 GDPR](https://gdpr-info.eu/art-30-gdpr/) · *verbatim reproduction on a secondary host; the authoritative text is Regulation (EU) 2016/679 on EUR-Lex* · **[checked 2026-11-10]**

**A solo founder is under 250 persons and still almost certainly needs a register.** Condition 2 is the one that bites: keeping a customer list, running a pilot, invoicing people — that is regular, ongoing processing, not occasional. The exemption is written for the organisation that processes personal data once in a while, not for one whose ordinary business involves it.

So: do not tell a founder the exemption covers them because they are small. Walk the four conditions. If any applies, the register is required. If none applies, say which reading got you there, because it is the unusual answer.

A maintained register is also what makes a breach assessment possible at speed: without it you cannot say quickly which categories of data and which people a breach touched — which matters against the 72-hour clock below. · *national authority guidance, consistent* · **[checked 2026-11-10]**

**What a missing register costs.** The Belgian authority states that absence of a register, or poorly discharging the obligation, can be fined up to €10,000,000 or, for a business, 2% of total worldwide annual turnover in the preceding financial year, whichever is higher. That is the art. 83(4) tier, not a Belgian specialty. · *national authority guidance* · **[checked 2026-11-10]**

## 4. Data breach notification — 72 hours

A controller must report a qualifying personal data breach to its supervisory authority **within 72 hours of becoming aware of it**.

A **processor** must warn its controller **without undue delay** — in practice immediately, with further detail following in stages as it is established. The processor does not notify the authority; the controller does. · *national authority guidance, consistent* · **[checked 2026-11-10]**

Decide, before a pilot starts, who would notify whom and from which address. A 72-hour clock is not the moment to discover that the answer is unclear.

## 5. Security — proportionate, not a checklist

Source: [EDPB — secure personal data](https://www.edpb.europa.eu/sme/be-compliant/secure-personal-data_en) · *EU regulator guidance* · **[checked 2026-11-10]**

The principle: *"appropriate technical and organisational measures to ensure a level of security of personal data appropriate to the risk"*, adapted to the state of the art, the processing context and the risk to individuals. **Proportionality is the rule.** There is no fixed list that makes you compliant.

Measures the page names — organisational: awareness sessions, documented operating procedures, a binding internal data protection policy, information classification, confidentiality agreements with staff. Technical: automatic session lockout, maintained firewall and antivirus, automatic security updates, backed-up storage, limits on removable media, premises access control, unique user identifiers with no shared accounts, role-based access profiles, pseudonymization, anonymization, encryption, and hash functions for integrity.

**It does give two numeric figures: a minimum password length of 8 characters with upper case and special characters, and authorization reviews every six months.**

Treat both as that page's general SME guidance — **not** a legal requirement, and not current best practice on passwords, where length-first policies and breached-password screening have displaced short-but-complex rules. Do not present either number as an obligation, and do not reproduce the 8-character figure as a recommendation.

## 6. Does a solo founder need a DPO, or a DPIA?

Usually no, on both counts — but check the conditions rather than assuming, and say which one you checked.

### Data protection officer — article 37(1)

A DPO is required only where one of three things is true. Source: [Article 37 GDPR](https://gdpr-info.eu/art-37-gdpr/) · *verbatim reproduction on a secondary host* · **[checked 2026-11-10]**

1. the processing is by a **public authority or body**, other than courts acting judicially
2. the **core activities** require **regular and systematic monitoring of data subjects on a large scale**
3. the **core activities** consist of **large-scale** processing of special categories (art. 9) or criminal-offence data (art. 10)

A one-person B2B service pilot normally meets none of them. Note the two qualifiers doing the work: **core activities** and **large scale**. Processing a customer list is neither, even though it is regular.

### Impact assessment — article 35

Required where processing is *"likely to result in a high risk to the rights and freedoms of natural persons"*, assessed **before** the processing starts. Art. 35(3) names three cases that always require one. Source: [Article 35 GDPR](https://gdpr-info.eu/art-35-gdpr/) · *verbatim reproduction on a secondary host* · **[checked 2026-11-10]**

1. systematic evaluation of personal aspects by automated processing, **including profiling**, producing legal or similarly significant effects
2. **large-scale** processing of special category or criminal-offence data
3. **systematic monitoring of a publicly accessible area** on a large scale

**Where this can bite a founder.** The general rule in 35(1) mentions processing *using new technologies*. A founder putting real customer data through an AI tool for the first time is doing exactly that, and if the output materially affects those people, case 1 comes into view. So do not answer "no DPIA needed" from the fact that the founder is small — answer it from the three cases plus the general rule, and if real personal data is heading into an AI tool, flag the assessment as a question rather than settling it.

## 7. Which lawful basis — article 6(1)

Every processing operation needs one of six bases, and **the founder has to be able to name which**. Source: [Article 6 GDPR](https://gdpr-info.eu/art-6-gdpr/) · *verbatim reproduction on a secondary host* · **[checked 2026-11-10]**

| | Basis | Covers |
| --- | --- | --- |
| (a) | **Consent** | The data subject consented, for one or more specific purposes |
| (b) | **Contract** | Necessary to perform a contract with the data subject, or for pre-contractual steps at their request |
| (c) | **Legal obligation** | Necessary to comply with a legal obligation on the controller |
| (d) | **Vital interests** | Necessary to protect someone's vital interests |
| (e) | **Public task** | Necessary for a task in the public interest or official authority |
| (f) | **Legitimate interests** | The controller's or a third party's legitimate interests, unless overridden by the data subject's rights — with special weight for children |

**For the pilots this skill supports, (b) and (f) carry almost everything.** Delivering an agreed service to a business customer's named contact is (b). A founder's own outreach or record-keeping is usually argued under (f), which requires actually weighing the interests rather than asserting them.

Two habits to avoid. **Do not reach for consent by default** — it has to be freely given, specific and withdrawable, and for a service a customer asked for, (b) is both simpler and more robust. And **do not leave the basis unstated**: the register in §3 asks for purposes, and a purpose without a basis is an unfinished record.

**Open:** the balancing test for (f), and whether a given outreach activity survives it, is **[not researched]** and is a judgment, not a lookup.

## 8. Sending data outside the EEA

Directly relevant: most AI tools a founder uses are operated from outside the EEA, and putting personal data into one is a transfer.

Source: [Article 44 GDPR](https://gdpr-info.eu/art-44-gdpr/) · *verbatim reproduction on a secondary host* · **[checked 2026-11-10]**

Article 44 sets the general principle: a transfer to a third country or international organisation *"shall take place only if"* the conditions in Chapter V are met. There are three routes:

| Route | Article |
| --- | --- |
| An **adequacy decision** for the destination country | art. 45 |
| **Appropriate safeguards**, including standard contractual clauses | art. 46 |
| **Derogations** for specific situations | art. 49 |

**For a founder this is a question about their provider, not about themselves.** A reputable provider will state which route it relies on — an adequacy decision, or SCCs in its data processing terms. The founder's job is to **read that and record it**, not to construct the safeguard. The pack's §2 processor-contract list is where it belongs.

**Open:** which countries currently hold an adequacy decision, and the transfer-impact assessment that case law expects alongside SCCs, are **[not researched]**. Do not tell a founder a specific destination is adequate.

## 9. Answering a data subject request — one month

Source: [Article 12 GDPR](https://gdpr-info.eu/art-12-gdpr/) · *verbatim reproduction on a secondary host* · **[checked 2026-11-10]**

- **One month from receipt** to provide information on the action taken.
- Extendable by **two further months** where necessary given complexity and number of requests — but the controller must tell the person **within the first month**, with reasons.
- If the controller **declines to act**, it must say so without delay and at the latest within one month, give the reasons, and tell the person they may **complain to a supervisory authority and seek a judicial remedy**.
- A request made electronically gets an electronic answer, unless the person asks otherwise.

Note what the extension is not: it is not a quiet grace period. Missing the first month without notifying is a breach of art. 12(3) even if the substantive answer eventually arrives.

## 10. What this layer does not cover

- Which third countries hold an **adequacy decision**, and transfer-impact assessment practice: **[not researched]**.
- The **content** of each data subject right (access, erasure, portability and the rest) as opposed to the deadline for answering: **[not researched]**.
- Sector rules (health, finance, children's data) are outside every pack's scope.
- The national authority's own guidance, which often differs in emphasis and is the better source for a founder in that country — see the national pack.
- The **EU AI Act** is a separate instrument and now has its own layer: [eu-ai-act.md](eu-ai-act.md). Using an AI tool on personal data engages both.

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| Controller/processor test and quoted wording | 2026-11-10 | Authority — EDPB SME guidance read |
| Processor contract duties, sub-processor authorization, processor liability | 2026-11-10 | Authority — EDPB SME guidance read |
| Security principle, named measures, and the two numeric figures | 2026-11-10 | Authority — EDPB SME guidance read |
| Register of processing activities obligation | 2026-11-10 | Authority — national authority guidance, consistent across the national packs |
| 72-hour controller notification; processor warns without undue delay | 2026-11-10 | Authority — national authority guidance, consistent across the national packs |
| DPO conditions, art. 37(1) | 2026-11-10 | Secondary — article text read on gdpr-info.eu, a verbatim reproduction, not EUR-Lex |
| DPIA conditions, art. 35(1) and 35(3) | 2026-11-10 | Secondary — article text read on gdpr-info.eu, a verbatim reproduction, not EUR-Lex |
| Register exemption, art. 30(5), four conditions | 2026-11-10 | Secondary — article text read on gdpr-info.eu, a verbatim reproduction, not EUR-Lex |
| Six lawful bases, art. 6(1) | 2026-11-10 | Secondary — article text read on gdpr-info.eu, a verbatim reproduction, not EUR-Lex |
| Balancing test for legitimate interests, art. 6(1)(f) | — | Open — not yet researched |
| Transfers: art. 44 principle and the three routes (45/46/49) | 2026-11-10 | Secondary — article text read on gdpr-info.eu, a verbatim reproduction, not EUR-Lex |
| Art. 12(3) one month, two-month extension, refusal duties | 2026-11-10 | Secondary — article text read on gdpr-info.eu, a verbatim reproduction, not EUR-Lex |
| Which countries hold adequacy; transfer-impact assessment practice | — | Open — not yet researched |
| The content of each individual data subject right | — | Open — not yet researched |

Next full recheck due: **2027-05-10**. Earlier on any EDPB guidance update or an AI Act milestone affecting small businesses.

No independent data-protection reviewer has reviewed this layer.
