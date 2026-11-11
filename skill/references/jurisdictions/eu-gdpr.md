# EU — GDPR layer

**This is a shared layer, not a country.** The GDPR applies directly in every EU member state, so the rules below hold identically in the Belgium, Netherlands, Germany and France packs. Each national pack carries only what is *national*: which supervisory authority is competent, and what that authority publishes.

Read this together with the relevant national pack. Neither replaces the other.

**This layer is preparation, not advice.** It records what the Regulation's own articles and EU regulator guidance state, with dates, and keeps the two apart — an article is the rule, a regulator's page is that regulator's reading of it. Consequential data-protection questions need a qualified reviewer and the founder's own national supervisory authority.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

---

## 0. Which text this layer reads, and the one word a corrigendum changed

Source: [Regulation (EU) 2016/679 — consolidated text](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02016R0679-20160504) · *the authoritative text* · **[checked 2026-11-11]**

Every article quoted below was read from the consolidated version `02016R0679 — EN — 04.05.2016 — 000.002`. Until 2026-11-11 this layer cited its articles from a third-party reproduction and the maintenance table labelled those rows `Secondary`; they now say `Primary`.

**The GDPR has not been amended.** Its EUR-Lex header lists no amending act — only `►C1 Corrigendum, OJ L 127, 23.5.2018, p. 2`. That is why the consolidation date is still 2016-05-04 ten years on, and why this layer needs no standing amendment warning of the kind [eu-ai-act.md](eu-ai-act.md) opens with.

**The corrigendum did touch one article this layer relies on, and it changed the test.** Eight of the regulation's 99 articles carry a `▼C1` marker: 37, 41, 42, 43, 57, 64, 69 and 70. Exactly one of those is cited here — **article 37(1)(c)**, the third DPO trigger:

| Version read | Article 37(1)(c), core activities consist of large-scale processing of |
| --- | --- |
| as published, `32016R0679` | special categories of data pursuant to Article 9 **and** personal data relating to criminal convictions and offences referred to in Article 10 |
| as corrected, `02016R0679-20160504` | special categories of data pursuant to Article 9 **or** personal data relating to criminal convictions and offences referred to in Article 10 |

`and` required both at once; `or` requires either, so the corrected wording reaches **more** controllers. Both texts were fetched on 2026-11-11 and compared, rather than inferring the change from the marker.

The lesson runs the opposite way to the AI Act's: **an act's own EUR-Lex page can be the stale one.** `32016R0679` is an official EU page serving the Official Journal text, and it still shows `and` — correctly, because that is what the Journal printed. For the GDPR, read the consolidated version.

## 1. Controller or processor

Source: [EDPB — data controller or data processor](https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en) · *EU regulator guidance* · **[checked 2026-11-10]**

The test is decision-making authority:

> *"A data controller determines the purposes and means of processing personal data."*
> *"A processor acts under the instructions of the controller only, by processing personal data on behalf of the controller."*

That is the EDPB's rendering of **article 4(7) and (8)**, which define a controller as the person or body which *"alone or jointly with others, determines the purposes and means of the processing of personal data"* and a processor as one which *"processes personal data on behalf of the controller"*. Note `alone or jointly with others`: two parties deciding a purpose together are **joint** controllers, not one controller and one processor.

Whoever decides the **why** and the **how** is the controller; whoever merely executes is the processor. **Roles follow the actual purposes and instructions** — never a product name, a contract title or what a vendor calls itself.

For a solo founder this is rarely obvious. Running a pilot on your own idea, with your own purposes, makes you a controller for that data. Processing a client's customer list strictly on their instructions makes you a processor for it. Both can be true at once for different data in the same engagement — resolve it per flow, not per relationship.

Two definitions worth having in front of you before deciding anything else. **Article 4(2)** defines `processing` as *"any operation or set of operations which is performed on personal data … whether or not by automated means"*, and names collection, storage, consultation, use, disclosure, erasure and destruction among them — so holding a list and never touching it is processing, and so is a list on paper. **Article 4(1)** defines `personal data` as *any information relating to an identified or identifiable natural person*, directly or indirectly, including by an online identifier — so a B2B customer's named contact, their work email and their IP address are all personal data, and "we only handle business data" is not a conclusion a founder may reach by itself.

### Article 28(10) — deciding a purpose makes a processor a controller

§2's processor duties are not the whole exposure. Art. 28(10):

> *"if a processor infringes this Regulation by determining the purposes and means of processing, the processor shall be considered to be a controller in respect of that processing."*

This is the statutory consequence of the rule in this section. A founder who holds a client's data as a processor and then uses it for a purpose of their own — building a benchmark, training a model, mailing the client's customers — is not merely in breach of the contract. For that processing they **are** the controller, with every controller duty in this layer and the art. 83(5) fine tier rather than the art. 83(4) one. Reusing client data is the single easiest way for a founder to acquire the heavier half of this regulation by accident.

## 2. What a processor contract must cover

Source: [Article 28 GDPR, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02016R0679-20160504) · *the authoritative text* · **[checked 2026-11-11]**

An unsigned template is not a contract. A customer's approval is not a lawful basis and not an adequate safeguard. Art. 28(9) adds the form requirement: the contract *"shall be in writing, including in electronic form"*.

### What the contract must set out — article 28(3), first sentence

Before any of the familiar duties, art. 28(3) requires the contract to **set out** six things. They describe the engagement, and a data processing addendum that stipulates obligations but never says what data is involved does not satisfy this sentence:

1. the subject-matter of the processing
2. its duration
3. the nature and purpose of the processing
4. the type of personal data
5. the categories of data subjects
6. the obligations and rights of the controller

In practice these are the annex of a DPA, not its body. **If a provider's DPA has no such annex and no space to describe the data, the contract is incomplete on its face** — and so is one a founder signs for a client without filling that annex in.

### What the contract must stipulate — article 28(3)(a) to (h)

Eight stipulations, with the statute's own qualifiers, which a summarised list usually drops:

| | The processor | The qualifier that matters |
| --- | --- | --- |
| (a) | processes only on **documented** instructions from the controller, transfers to third countries included | unless Union or Member State law requires otherwise, in which case the processor must tell the controller **before** processing |
| (b) | ensures authorised persons are bound to confidentiality | by commitment or by statutory obligation |
| (c) | takes all measures required by art. 32 | §5 below is that article |
| (d) | respects the sub-processor conditions in paras 2 and 4 | — |
| (e) | assists the controller in answering data subject rights requests | *"taking into account the nature of the processing"* and *"insofar as this is possible"* |
| (f) | assists with compliance with **arts. 32 to 36** | security, both breach notifications, the DPIA and prior consultation — not only breach |
| (g) | **at the choice of the controller**, deletes or returns all the data at the end, and deletes copies | unless law requires storage. The choice is the controller's, not the processor's |
| (h) | makes available all information needed to demonstrate compliance, and allows and contributes to audits | including inspections, by the controller or an auditor it mandates |

### Sub-processors — a general authorisation is allowed, and that is what real DPAs use

Art. 28(2) is more permissive than the usual summary of it:

> *"The processor shall not engage another processor without prior specific or general written authorisation of the controller. In the case of general written authorisation, the processor shall inform the controller of any intended changes concerning the addition or replacement of other processors, thereby giving the controller the opportunity to object to such changes."*

So "written authorisation before each sub-processor" is **not** the only compliant shape. A published sub-processor list plus advance notice of changes plus a right to object — which is what every major cloud DPA offers — is the `general written authorisation` the article expressly provides for. Do not tell a founder their provider's standard terms are non-compliant because the consent is not per sub-processor.

What the founder must then actually do is use the right the authorisation buys: **read the change notices**. A general authorisation with nobody reading the notifications is worse than a specific one.

Art. 28(4) sets what binds the sub-processor and who answers for it: *"the same data protection obligations as set out in the contract"* — the same, not merely equivalent — and *"the initial processor shall remain fully liable to the controller for the performance of that other processor's obligations"*. Directly relevant to any founder who builds on, or resells, another provider: you are liable to the controller for its sub-processors' breaches, whoever actually failed.

### Two duties that run the other way

The article is not only a list of things done *to* a processor.

- **Art. 28(1) binds the controller choosing one.** A controller *"shall use only processors providing sufficient guarantees"* of appropriate technical and organisational measures. A founder picking an AI tool for client data is exercising this duty, and §8 below is where it usually goes wrong.
- **Art. 28(3), second subparagraph, binds the processor to object.** The processor *"shall immediately inform the controller if, in its opinion, an instruction infringes"* the GDPR or other Union or Member State data protection law. Following a client's unlawful instruction quietly is itself a breach of the contract the article requires.

## 3. Register of processing activities

Source: [Article 30 GDPR, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02016R0679-20160504) · *the authoritative text* · **[checked 2026-11-11]**

The `verwerkingsregister` / `registre des traitements` / `Verzeichnis von Verarbeitungstätigkeiten`.

**Article 30(1)** requires a controller to record its own identity and contact details — and those of any joint controller, representative and data protection officer — the purposes of processing, the categories of data subjects and of personal data, the categories of recipients including recipients in third countries, and then three entries the statute makes conditional:

| Item | Condition in the text |
| --- | --- |
| transfers to a third country or international organisation, with the identification of it and, for art. 49(1) second subparagraph transfers, the documentation of suitable safeguards | *"where applicable"* |
| the envisaged time limits for erasure of the different categories of data | *"where possible"* |
| a general description of the technical and organisational security measures referred to in art. 32(1) | *"where possible"* |

Those qualifiers are not an escape. They are why a register may legitimately say *"retention not yet determined"* for a pilot and still be a register — which is a better answer to a founder than a blank field or an invented number.

Art. 30(3): the record *"shall be in writing, including in electronic form"* — a spreadsheet is fine. Art. 30(4): the controller or processor *"shall make the record available to the supervisory authority on request"*. **The register is not filed anywhere.** Nobody receives it, no portal takes it; it has to exist and be producible. A founder who asks where to submit it has the wrong model of the obligation.

### A processor's register is a different and shorter list — article 30(2)

**The duty is not only the controller's.** The Belgian authority states it plainly: *"De verwerkingsverantwoordelijke en de verwerkers moeten een Register van de verwerkingsactiviteiten bijhouden"* — controllers **and** processors, and also where they are not established in the EEA but the GDPR applies to them. Where someone is both, the GBA accepts one register with a section per role. · Source: [GBA — wie moet het register bijhouden](https://www.gegevensbeschermingsautoriteit.be/professioneel/avg/register-van-verwerkingsactiviteiten/wie-moet-het-register-van-de-verwerkingsactiviteiten-bijhouden) · *national supervisory authority* · **[checked 2026-11-11]**

What the statute adds, and what no summary of the duty mentions, is that **art. 30(2) is a shorter list than art. 30(1)**:

| Recorded by a controller, art. 30(1) | Recorded by a processor, art. 30(2) |
| --- | --- |
| own contact details, joint controller, representative, DPO | own contact details, **each controller it acts for**, representatives, DPO |
| the purposes of the processing | — |
| categories of data subjects and of personal data | — |
| categories of recipients | — |
| — | the **categories of processing** carried out for each controller |
| third-country transfers and safeguards | third-country transfers and safeguards |
| envisaged erasure periods | — |
| general description of security measures | general description of security measures |

A processor records four things, not seven, and the purposes are expressly not among them — because they are not the processor's to state. **A founder who is both keeps both lists, and should not fill a controller's seven fields for work done on a client's instructions.** It is the clearest practical reason to settle §1 per flow before writing anything down.

### The under-250 exemption, and why it probably does not help you

Article 30(5) exempts *"an enterprise or an organisation employing fewer than 250 persons"* from **the obligations in paragraphs 1 and 2** — the processor's register included — unless one of the following is true of the processing it carries out:

- it is likely to result in a risk to the rights and freedoms of data subjects
- **the processing is not occasional**
- it includes special categories of data (art. 9(1)) **or** personal data relating to criminal convictions and offences (art. 10)

**Do not quote a count of these.** The statute writes them as one sentence with three limbs, the third of which has two alternatives, so a reproduction that renders it as a list can show three items or four depending on where it breaks. This layer said "four conditions" until 2026-11-11, which was a formatting artefact of the source it was read from rather than anything the regulation states. Walk the facts; never cite the number.

**A solo founder is under 250 persons and still almost certainly needs a register.** The `not occasional` limb is the one that bites: keeping a customer list, running a pilot, invoicing people — that is regular, ongoing processing, not occasional. The exemption is written for the organisation that processes personal data once in a while, not for one whose ordinary business involves it.

So: do not tell a founder the exemption covers them because they are small. Walk the limbs. If any applies, the register is required. If none applies, say which reading got you there, because it is the unusual answer.

The GBA's own page on who must keep a register does not mention the 250 figure at all, so do not expect a national authority to walk a founder through the exemption. Art. 30(5) is where it lives.

A maintained register is also what makes a breach assessment possible at speed, and that link is closer to the text than this layer used to claim — art. 33(3)(a) in §4 requires the notification to describe *the categories and approximate number of data subjects and of personal data records concerned*. Without a register you cannot produce those two numbers against a 72-hour clock.

### What a missing register costs

Art. 83(4) sets fines *"up to 10 000 000 EUR, or in the case of an undertaking, up to 2 % of the total worldwide annual turnover of the preceding financial year, whichever is higher"*, and its point (a) covers *"the obligations of the controller and the processor pursuant to Articles 8, 11, 25 to 39 and 42 and 43"*. **Article 30 sits inside that range**, so the register duty is in the lower of the regulation's two tiers — art. 83(5)'s 20 000 000 EUR or 4% covers the processing principles, the data subject rights and the third-country transfers instead.

Both figures are ceilings for undertakings of any size, and **the GDPR has no reduction for a small one**. Do not present either as what a solo founder would be fined.

**The two tiers, the eleven factors an authority must weigh, and why the AI Act's penalty article points the opposite way for an SME are in [eu-gdpr-fines.md](eu-gdpr-fines.md).**

## 4. Data breach notification — 72 hours

Source: [Article 33 GDPR, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02016R0679-20160504) · *the authoritative text* · **[checked 2026-11-11]**

A controller must notify the supervisory authority competent under art. 55 *"without undue delay and, where feasible, not later than 72 hours after having become aware of it"* (art. 33(1)).

Three things in that paragraph a founder should not miss:

- **Not every breach is notifiable.** The duty falls away where the breach *"is unlikely to result in a risk to the rights and freedoms of natural persons"* — a judgment that has to be made and recorded, not assumed either way.
- **Late is not barred, but it is explained.** *"Where the notification to the supervisory authority is not made within 72 hours, it shall be accompanied by reasons for the delay."* Missing the clock is not the end of the obligation; it adds one.
- **Partial is allowed.** Art. 33(4): where the information cannot all be given at once, it *"may be provided in phases without undue further delay"*. This is what the Dutch and Belgian authorities implement as a first notification plus a follow-up.

A **processor** must notify *"the controller without undue delay after becoming aware of a personal data breach"* (art. 33(2)). The processor does not notify the authority; the controller does. Note the asymmetry: the processor's duty carries **no outer deadline** in the article, only "without undue delay" — so a processor who waits two days has not used up a 72-hour allowance of its own, it has eaten the controller's.

And art. 33(5) requires the controller to document *every* breach — *"the facts relating to the personal data breach, its effects and the remedial action taken"* — including the ones it decided not to notify, in a form that lets the authority verify compliance. The decision not to notify is itself a record you must be able to produce.

Decide, before a pilot starts, who would notify whom and from which address. A 72-hour clock is not the moment to discover that the answer is unclear.

### What counts as a breach — article 4(12)

The clock starts on something wider than a founder expects. A `personal data breach` is:

> *"a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data transmitted, stored or otherwise processed"*

Five outcomes, and only two of them involve anyone else seeing the data. **Accidental loss, accidental destruction and alteration are breaches with no attacker and no disclosure at all** — a deleted database with no backup, ransomware that encrypts the only copy, a lost laptop, a client list emailed to the wrong recipient. A founder who equates "breach" with "we were hacked" will miss the clock on the cases most likely to actually happen to them.

The one limb that does narrow it: there must be a *breach of security*. Lawfully sending data to the wrong legal basis is an infringement, not a breach under this article.

### What the notification must contain — article 33(3)

Four items, which is also the list of what a founder needs to be able to assemble inside the window:

| | Art. 33(3) requires the notification to |
| --- | --- |
| (a) | describe the nature of the breach, including where possible the **categories and approximate number of data subjects** concerned and the **categories and approximate number of personal data records** concerned |
| (b) | give the name and contact details of the DPO **or other contact point** where more information can be obtained |
| (c) | describe the likely consequences of the breach |
| (d) | describe the measures taken or proposed to address it, including where appropriate measures to mitigate its adverse effects |

Point (a) is why §3's register is operational and not paperwork: those are the two figures you cannot reconstruct under pressure. Point (b) answers a question founders ask — **no DPO is needed to notify**, since the article accepts *another contact point*, which for a solo founder is them.

## 5. Security — proportionate, not a checklist

Source: [EDPB — secure personal data](https://www.edpb.europa.eu/sme/be-compliant/secure-personal-data_en) · *EU regulator guidance* · **[checked 2026-11-10]**

The principle as the EDPB states it: *"appropriate technical and organisational measures to ensure a level of security of personal data appropriate to the risk"*, adapted to the state of the art, the processing context and the risk to individuals. **Proportionality is the rule.** There is no fixed list that makes you compliant.

Measures the page names — organisational: awareness sessions, documented operating procedures, a binding internal data protection policy, information classification, confidentiality agreements with staff. Technical: automatic session lockout, maintained firewall and antivirus, automatic security updates, backed-up storage, limits on removable media, premises access control, unique user identifiers with no shared accounts, role-based access profiles, pseudonymization, anonymization, encryption, and hash functions for integrity.

**It does give two numeric figures: a minimum password length of 8 characters with upper case and special characters, and authorization reviews every six months.**

Treat both as that page's general SME guidance — **not** a legal requirement, and not current best practice on passwords, where length-first policies and breached-password screening have displaced short-but-complex rules. Do not present either number as an obligation, and do not reproduce the 8-character figure as a recommendation.

**Two regulators, two numbers, and neither is the rule.** A German Land authority's own 2025 checklist for one-person businesses asks for a minimum of **12** characters — see [germany-data-protection.md](germany-data-protection.md). That is the plainest demonstration of what these figures are: each authority's current expectation, not a requirement anyone can cite. Cite art. 32(1) below for the obligation and the founder's own authority for the number.

### Article 32(1) — where the proportionality comes from, and the four measures it does name

Source: [Article 32 GDPR, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02016R0679-20160504) · *the authoritative text* · **[checked 2026-11-11]**

The statute binds *"the controller and the processor"* alike to measures *"to ensure a level of security appropriate to the risk"*, and it says in its own words what that level is weighed against:

> *"Taking into account the state of the art, the costs of implementation and the nature, scope, context and purposes of processing as well as the risk of varying likelihood and severity for the rights and freedoms of natural persons …"*

**`The costs of implementation` is in the text.** That is the legal basis for a solo founder's security being proportionate to a solo founder's means, and it is a better answer than an assurance that nobody will check. It is a factor, not a defence: cost is weighed against the risk to people, so a cheap measure is not adequate because it was cheap.

But "no fixed list" needs one qualification, because art. 32(1) does name four measures, *"including inter alia as appropriate"*:

| | Art. 32(1) |
| --- | --- |
| (a) | pseudonymisation and encryption of personal data |
| (b) | the ability to ensure ongoing confidentiality, integrity, availability and **resilience** of processing systems and services |
| (c) | the ability to **restore** availability and access to the data in a timely manner after a physical or technical incident |
| (d) | a process for **regularly testing, assessing and evaluating the effectiveness** of the measures |

Point (c) is a tested backup, not a backup. Point (d) is the one a founder has almost certainly not got: not a measure but a recurring review of whether the measures work, which the EDPB's long bullet list buries and which costs nothing but a calendar entry.

Two more paragraphs with practical reach. Art. 32(2) names what the assessment is against — *"accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to"* data — the same five outcomes as the breach definition in §4, which is not a coincidence: security measures are assessed against exactly what art. 33 would make notifiable. And art. 32(4) requires the controller and processor to ensure that **anyone acting under their authority** processes only on instructions — so a founder's first freelancer is inside this article, contract or no contract.

## 6. Does a solo founder need a DPO, or a DPIA?

Usually no, on both counts. But "usually no" is a conclusion about conditions, not about size, so say which condition you checked — and neither question is answered by this layer alone:

| | Required when | And then |
| --- | --- | --- |
| **DPO**, art. 37(1) | the processing is by a public authority, or the **core activities** require **regular and systematic monitoring on a large scale**, or consist of **large-scale** art. 9 or art. 10 data | art. 37(4): **Member State law may require one anyway** |
| **DPIA**, art. 35(1) | the processing, *"in particular using new technologies"*, is *"likely to result in a high risk to the rights and freedoms of natural persons"*; art. 35(3) names three cases that in particular require one | art. 35(4): the founder's own supervisory authority **must publish a list** of the operations that need one |

A one-person B2B service pilot normally meets none of the art. 37(1) triggers, and `core activities` and `large scale` are the qualifiers doing that work. The DPIA answer is the less safe of the two: a founder putting real personal data through an AI tool for the first time is processing *using new technologies*, which is the general rule's own example.

**The conditions, the qualifier in each that a summary drops, the two national hooks and what an assessment must contain are in [eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md).** Do not answer either question from the table above alone: it names the triggers, not the readings they need.

## 7. Which lawful basis — article 6(1)

Source: [Article 6 GDPR, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02016R0679-20160504) · *the authoritative text* · **[checked 2026-11-11]**

Art. 6(1) opens: *"Processing shall be lawful only if and to the extent that at least one of the following applies"*. Read `and to the extent that`: a basis legitimises the processing it actually covers and no more, so one basis does not clear a whole dataset or a whole relationship. **The founder has to be able to name which basis, per purpose.**

| | Basis | The statute's own wording, abbreviated |
| --- | --- | --- |
| (a) | **Consent** | the data subject has given consent for one or more **specific** purposes |
| (b) | **Contract** | necessary for the performance of a contract **to which the data subject is party**, or to take steps at the data subject's request prior to entering one |
| (c) | **Legal obligation** | necessary for compliance with a legal obligation to which the controller is subject |
| (d) | **Vital interests** | necessary to protect the vital interests of the data subject or another natural person |
| (e) | **Public task** | necessary for a task in the public interest or in the exercise of official authority |
| (f) | **Legitimate interests** | necessary for the legitimate interests of the controller or a third party, *"except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject"*, **in particular where the data subject is a child** |

Point (f) does not apply to public authorities performing their tasks (art. 6(1), second subparagraph), and bases (c) and (e) must be laid down in Union or Member State law (art. 6(3)) — neither is usually a founder's question.

Two habits to avoid. **Do not reach for consent by default** — it has to be freely given, specific and withdrawable, and for a service a customer asked for, (b) is both simpler and more robust where it applies. And **do not leave the basis unstated**: the register in §3 asks for purposes, and a purpose without a basis is an unfinished record. In Belgium it is more than untidy — art. 222 of the `wet van 30 juli 2018` makes processing without a lawful basis a criminal offence carrying up to €120,000, which is the sharpest reason in any of these packs to be able to name the basis per purpose. See [belgium.md](belgium.md) §6 and [eu-gdpr-fines.md](eu-gdpr-fines.md).

### (b) does not cover a B2B contact, and that is the trap in a B2B pilot

This layer said *"delivering an agreed service to a business customer's named contact is (b)"* until 2026-11-11. Read against the article, that is wrong in the ordinary B2B case, and it is wrong in the direction that matters.

Art. 6(1)(b) requires a contract *"to which the data subject is party"*. In a B2B pilot the contract is with the **company**. The data subject is the employee whose name, work email and phone number you process. **That person is not a party to your contract**, so (b) does not cover processing their data — their employer's signature is not their consent and not their contract either.

| What you process | Who the data subject is | Basis |
| --- | --- | --- |
| A sole trader client's own details | the client, who signed | **(b)** — they are party to the contract |
| A company client's named contact | an employee, who did not sign | **(f)**, weighed |
| A company client's own customer list, on their instructions | their customers | **their** basis, not yours — you are a processor (§1) |

So for the pilots this skill supports, **(f) carries more than this layer used to say**, and (b) carries the sole-trader case and the pre-contractual steps a prospect themselves asks for. (f) requires actually weighing the interests rather than asserting them — which is why the note below is open, and why "legitimate interests" is not a shortcut around a basis.

**Open:** the balancing test for (f), and whether a given outreach activity survives it, is **[not researched]** and is a judgment, not a lookup.

### Using data you already hold for something new — article 6(4)

The most common founder mistake this layer had nothing to say about: the data is already there, so using it for the next idea feels free. Art. 6(4) says that where processing for **a new purpose** rests neither on the data subject's consent nor on a Union or Member State law, the controller must *"ascertain whether processing for another purpose is compatible with the purpose for which the personal data are initially collected"*, taking into account *inter alia*:

1. any link between the original purposes and the intended new ones
2. the context of collection, **in particular the relationship between data subject and controller**
3. the nature of the data, in particular whether special categories (art. 9) or criminal-offence data (art. 10) are involved
4. the possible consequences of the further processing for the data subjects
5. the existence of appropriate safeguards, *"which may include encryption or pseudonymisation"*

This is the article to reach for when a founder wants to mail pilot participants about a different product, feed a customer list into a model, or turn delivery data into a case study. The test is compatibility with the original purpose, not whether the data is in hand — and the list is factors to weigh, so the output is a recorded judgment, not a yes.

## 8. Sending data outside the EEA

Directly relevant: most AI tools a founder uses are operated from outside the EEA, and putting personal data into one is a transfer.

Source: [Article 44 GDPR, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02016R0679-20160504) · *the authoritative text* · **[checked 2026-11-11]**

Article 44 sets the general principle. Three things in its single paragraph that a short quotation of it loses:

> *"Any transfer of personal data … to a third country or to an international organisation shall take place only if, subject to the other provisions of this Regulation, the conditions laid down in this Chapter are complied with **by the controller and processor**, including for **onward transfers** of personal data from the third country … to another third country … All provisions in this Chapter shall be applied in order to ensure that the level of protection … is not undermined."*

- **The duty is the controller's and the processor's**, so a founder is bound by it in either role.
- **Onward transfers are expressly in scope.** Your provider's own sub-processor in a fourth country is part of the chain you are answerable for — which is the other reason §2's sub-processor change notices matter.
- **The chapter is to be applied so the level of protection is not undermined**, which is the anti-circumvention rule the Court of Justice has built its transfer case law on.

There are three routes a founder will meet:

| Route | Article |
| --- | --- |
| An **adequacy decision** for the destination country | art. 45 |
| **Appropriate safeguards**, including standard contractual clauses | art. 46 |
| **Derogations** for specific situations | art. 49 |

**This is a question about the founder's provider, but it stays the founder's obligation.** Art. 44 binds the controller; a reputable provider will state which route it relies on — an adequacy decision, or SCCs in its data processing terms — and the founder's job is to **read that, record it, and keep it with the art. 30(1) transfer entry**. They do not construct the safeguard; they do answer for having checked one exists. Telling a founder it is "the provider's problem" is the version of this section to avoid.

**One partial answer, and it is per provider rather than per country.** A German Land authority tells a one-person business that transfers to the US may rest on the **EU–US Data Protection Framework** — on the stated condition that the specific provider is listed on the DPF list of the US Department of Commerce, and with the note that where it is not, the transfer needs other guarantees such as the Commission's standard contractual clauses. See [germany-data-protection.md](germany-data-protection.md). So for the US the question is answered about the **provider**, not about the country.

**Open:** the adequacy decisions themselves, which other countries hold one, and the transfer-impact assessment that case law expects alongside SCCs, are **[not researched]**. Do not tell a founder a specific destination is adequate on this layer's authority.

## 9. Answering a data subject request — one month

Source: [Article 12 GDPR, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02016R0679-20160504) · *the authoritative text* · **[checked 2026-11-11]**

- **Without undue delay, and in any event within one month of receipt** (art. 12(3)). The month is an outer limit, not an entitlement to take it.
- Extendable by **two further months** where necessary *"taking into account the complexity and number of the requests"* — but the controller must tell the person **within the first month**, together with the reasons for the delay.
- If the controller **does not take action**, art. 12(4): say so without delay and at the latest within one month, give the reasons, and tell the person they may **lodge a complaint with a supervisory authority and seek a judicial remedy**.
- A request made electronically gets an electronic answer *"where possible"*, unless the person asks otherwise.
- Art. 12(2) adds the posture: the controller *"shall facilitate the exercise of data subject rights"*.

Note what the extension is not: it is not a quiet grace period. Missing the first month without notifying is a breach of art. 12(3) even if the substantive answer eventually arrives.

### Free of charge, and the burden of proof is yours — article 12(5)

Everything under arts. 15 to 22 and art. 34 *"shall be provided free of charge"*. There is one exception, and it is narrow: where requests are *"manifestly unfounded or excessive, in particular because of their repetitive character"*, the controller may either charge a reasonable fee reflecting the administrative cost, or refuse to act.

> *"The controller shall bear the burden of demonstrating the manifestly unfounded or excessive character of the request."*

So the exception is available and the proof is the founder's. A single awkward request is not excessive, and "it would take me a day" is not a ground. Art. 12(6) gives the one routine qualifier in the other direction: where there are **reasonable doubts about the requester's identity**, the controller may ask for additional information to confirm it — which is a step, not a refusal, and does not stop the clock by itself.

## 10. What this layer does not cover

- Which third countries hold an **adequacy decision**, and transfer-impact assessment practice: **[not researched]**.
- The **content** of each data subject right (access, erasure, portability and the rest) as opposed to the deadline for answering: **[not researched]**.
- The **national art. 35(4) DPIA lists**, and national provisions requiring a DPO under art. 37(4): open in [eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md), and both belong in the national packs.
- **Article 83 in full** — the second tier, the eleven factors, the SME comparison with the AI Act — is in [eu-gdpr-fines.md](eu-gdpr-fines.md), and §3 gives only the tier the register sits in.
- Sector rules (health, finance, children's data) are outside every pack's scope.
- The national authority's own guidance, which often differs in emphasis and is the better source for a founder in that country — see the national pack.
- The **EU AI Act** is a separate instrument and now has its own layer: [eu-ai-act.md](eu-ai-act.md). Using an AI tool on personal data engages both.

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| The GDPR has no amending act; one corrigendum, OJ L 127 of 2018-05-23 | 2026-11-11 | Primary — the consolidated text's own header read; eight articles carry a `▼C1` marker |
| Art. 37(1)(c) read `and` as published and reads `or` as corrected | 2026-11-11 | Primary — both `32016R0679` and `02016R0679-20160504` fetched and compared |
| Controller/processor test and quoted wording | 2026-11-10 | Authority — EDPB SME guidance read |
| Art. 4(1), 4(2), 4(7), 4(8) definitions behind that test | 2026-11-11 | Primary — definitions read and quoted |
| Art. 28(10): a processor determining purposes becomes a controller | 2026-11-11 | Primary — quoted |
| Processor contract duties, the sub-processor rule and processor liability | 2026-11-11 | Primary — restated from art. 28 itself on 2026-11-11. The EDPB SME guidance read on 2026-11-10 was the earlier basis; it agreed on every duty except the one withdrawn below |
| **Corrected on 2026-11-11:** sub-processors were said to need written authorization per sub-processor | 2026-11-11 | Withdrawn — art. 28(2) expressly allows a **general** written authorisation with notice of changes and a right to object, which is what cloud DPAs use |
| Art. 28(3) first sentence: six particulars the contract must set out | 2026-11-11 | Primary — read; the layer previously had none of them |
| Art. 28(3)(a)–(h) with the statute's qualifiers; 28(4) "the same obligations" and full liability; 28(9) writing | 2026-11-11 | Primary — read and tabulated |
| Art. 28(1) controller's duty to choose; 28(3) second subparagraph duty to warn | 2026-11-11 | Primary — read and quoted |
| Art. 30(1) register contents, including which three items are conditional | 2026-11-11 | Primary — article text read on EUR-Lex, replacing a secondary reproduction |
| Art. 30(2): a processor's register is four items, not seven | 2026-11-11 | Primary — read and tabulated against 30(1) |
| Art. 30(3) in writing; 30(4) produced to the authority on request, not filed | 2026-11-11 | Primary — read |
| The register duty binds processors as well as controllers, and non-EEA ones | 2026-11-11 | Authority — the GBA's own page read and quoted in Dutch |
| **Corrected on 2026-11-11:** art. 30(5) was described as "four conditions" | 2026-11-11 | Withdrawn — the statute writes three limbs, the third with two alternatives; the count was an artefact of the reproduction's list formatting |
| Art. 30(5) exemption covers paragraphs 1 and 2, so processors' registers too | 2026-11-11 | Primary — read |
| Administrative fines: both art. 83 tiers, the art. 83(2) factors, and the SME comparison with the AI Act | — | Elsewhere — moved to [eu-gdpr-fines.md](eu-gdpr-fines.md) when this layer went over its size budget; maintained there |
| Art. 33(1) 72 hours, the unlikely-to-risk carve-out, reasons for delay | 2026-11-11 | Primary — article text read and quoted |
| Art. 33(2) processor notifies the controller, with no outer deadline | 2026-11-11 | Primary — article text read and quoted |
| Art. 33(4) phased information; art. 33(5) document every breach | 2026-11-11 | Primary — article text read and quoted |
| Art. 4(12): accidental loss, destruction and alteration are breaches with no disclosure | 2026-11-11 | Primary — definition read and quoted |
| Art. 33(3)(a)–(d) notification contents, and that a non-DPO contact point suffices | 2026-11-11 | Primary — read and tabulated |
| Security principle, named measures, and the two numeric figures | 2026-11-10 | Authority — EDPB SME guidance read |
| Art. 32(1): costs of implementation is a statutory factor, and the four named measures | 2026-11-11 | Primary — read and quoted |
| Art. 32(2) the five risk outcomes; 32(4) persons acting under the controller's authority | 2026-11-11 | Primary — read |
| DPO and DPIA: arts. 37 and 35 in full, both national hooks, and the German BDSG threshold | — | Elsewhere — moved to [eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md) when this layer went over its size budget; maintained there |
| Six lawful bases, art. 6(1), and "only if and to the extent that" | 2026-11-11 | Primary — article text read on EUR-Lex, replacing a secondary reproduction |
| **Corrected on 2026-11-11:** basis (b) was said to cover a business customer's named contact | 2026-11-11 | Withdrawn — art. 6(1)(b) requires a contract *to which the data subject is party*; an employee of a corporate client is not, so that processing is an (f) question |
| Art. 6(4) five-factor compatibility test for a new purpose | 2026-11-11 | Primary — read; the layer previously said nothing about purpose change |
| Balancing test for legitimate interests, art. 6(1)(f) | — | Open — not yet researched |
| Transfers: art. 44 principle, onward transfers, controller **and** processor bound, the non-undermining sentence, and the three routes (45/46/49) | 2026-11-11 | Primary — article text read and quoted in full |
| Art. 12(3) one month "without undue delay and in any event", two-month extension, art. 12(4) refusal duties | 2026-11-11 | Primary — article text read on EUR-Lex, replacing a secondary reproduction |
| Art. 12(5) free of charge, the manifestly-unfounded exception, and the controller's burden of proof; 12(6) identity | 2026-11-11 | Primary — read and quoted |
| Which countries hold adequacy; transfer-impact assessment practice | — | Open — not yet researched |
| The content of each individual data subject right | — | Open — not yet researched |

Next full recheck due: **2027-05-10**. Earlier on any EDPB guidance update, an AI Act milestone affecting small businesses, or the appearance of an amending act in the consolidated text's header — §0 records that there is none as at 2026-11-11.

No independent data-protection reviewer has reviewed this layer.
