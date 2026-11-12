# Germany — data protection (annex)

**This is an annex to [germany.md](germany.md) §6, not a pack of its own.** It exists because the German pack went over this skill's 48 KB per-reference budget on 2026-11-11. The EU rules are in [eu-gdpr.md](eu-gdpr.md) and its own annexes; §6 of the pack gives the one answer a founder needs first, which is that the competent authority is the one for their `Land`. Everything else German is here.

**This annex is preparation, not advice.** It records what the German statute and the competent authorities' own publications state, with dates, and keeps the two apart. Consequential data-protection questions need a qualified reviewer and the founder's own `Land` authority.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

---

## Which authority is competent, in the statute — §40 BDSG

**The answer in [germany.md](germany.md) §6 rests on a statute, not only on the BfDI directory it cites.** §40(1) BDSG: *"Die nach Landesrecht zuständigen Behörden überwachen im Anwendungsbereich der Verordnung (EU) 2016/679 bei den nichtöffentlichen Stellen die Anwendung der Vorschriften über den Datenschutz"* — the authorities competent **under the law of each Land** supervise the private sector. · Source: [§40 BDSG, official consolidated law text](https://www.gesetze-im-internet.de/bdsg_2018/__40.html) · *primary legislation* · **[checked 2026-11-11]**

And §40(2) answers the case the directory does not: where a controller or processor has **several domestic establishments**, art. 4(16) GDPR — the main-establishment test — applies by analogy to decide which Land authority is competent, and where authorities disagree they decide jointly under §18(2) BDSG. So two offices do not mean two supervisors.

**The count, resolved.** The BfDI directory lists **one entry per Land, so 16**. Totals of 17 or 18 circulate because **Bavaria** splits supervision: the `Bayerisches Landesamt für Datenschutzaufsicht` (BayLDA) supervises the private sector while the `Bayerischer Landesbeauftragte für den Datenschutz` supervises public bodies. The BayLDA states its own scope as *"den nicht-öffentlichen Bereich in Bayern, das heißt in den privaten Wirtschaftsunternehmen, bei den freiberuflich Tätigen, in Vereinen und Verbänden sowie im Internet"* — note that `freiberuflich Tätige` are expressly inside it, so a founder on the `freier Beruf` route of [germany.md](germany.md) §1 is supervised by the private-sector authority like anyone else. Bavaria names four further competences outside the BayLDA's remit: religious communities, public broadcasting, private broadcasting and the press. · Source: [BayLDA — Aufgaben und Zuständigkeiten](https://www.lda.bayern.de/de/aufgaben.html) · *the competent Land authority's own page* · **[checked 2026-11-11]**

Whether any Land other than Bavaria splits it the same way is **[not researched]**, so still do not quote a total. The number does not matter to a founder; the right `Land` does.

## A DPO can be compulsory with no employees at all — §38 BDSG

Source: [§38 BDSG, official consolidated law text](https://www.gesetze-im-internet.de/bdsg_2018/__38.html) · *primary legislation* · **[checked 2026-11-11]**

[eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md) explains that art. 37(4) GDPR lets a member state require a DPO where the Regulation does not. Germany is that member state, and §38(1) has **two sentences that work completely differently**.

**Sentence 1 — the headcount everyone quotes.** Supplementing art. 37(1)(b) and (c), a controller or processor must designate a DPO *"soweit sie in der Regel mindestens 20 Personen ständig mit der automatisierten Verarbeitung personenbezogener Daten beschäftigen"* — as a rule at least **20 persons permanently occupied** with automated processing of personal data. Note `Personen`, not employees, and `ständig`, not full-time. A solo founder is nowhere near it.

**Sentence 2 — and this one has no headcount at all.** *"unabhängig von der Anzahl der mit der Verarbeitung beschäftigten Personen"* — **regardless of the number of persons involved** — a DPO must be designated where the controller or processor:

| | Trigger in §38(1) sentence 2 | What it means for a one-person business |
| --- | --- | --- |
| 1 | carries out processing **subject to a DPIA under art. 35** | the DPIA question in [eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md) decides a second obligation as well — and see the German art. 35(4) list below |
| 2 | processes personal data `geschäftsmäßig` for the purpose of **transmission** | passing personal data on as part of the business model, rather than incidentally |
| 3 | the same, for **anonymised transmission** | anonymising on the way out does not take you out of it |
| 4 | the same, for **market or opinion research** | a one-person market-research service owes a DPO in Germany from its first client |

**So "a solo founder does not need a DPO" is wrong in Germany for a whole class of businesses**, and two of those four triggers — market research, and processing that needs a DPIA — are services a founder might plausibly offer or a tool they might plausibly use. Walk sentence 2 before answering, and do not answer from the 20-person figure alone.

## Appointing an employee as the DPO is hard to undo — §38(2) with §6(4) BDSG

§38(2) imports three provisions written for public bodies into the private sector: §6(4), §6(5) sentence 2 and §6(6) — and **§6(4) only where the designation is compulsory**.

Source: [§6 BDSG, official consolidated law text](https://www.gesetze-im-internet.de/bdsg_2018/__6.html) · *primary legislation* · **[checked 2026-11-11]**

§6(4) is the one with teeth. Where a DPO must be appointed:

- removal from the role is permitted only on the standard of §626 BGB — termination for cause
- *"Die Kündigung des Arbeitsverhältnisses ist unzulässig"* — **dismissal of the employment relationship is impermissible**, unless there are facts justifying termination for cause without notice
- and that protection runs for **one year after** the person stops being the DPO

So appointing a member of staff as a compulsory DPO gives them near-untouchable dismissal protection for the role plus a year. Art. 37(6) GDPR allows the DPO to act *"on the basis of a service contract"* instead, and for a business of this size an external appointment is the obvious way to avoid that consequence. §6(5) sentence 2 and §6(6) add that the DPO owes confidentiality about who consulted them, and inherits any professional right to refuse testimony that the business has, with their files protected from seizure.

Do not present this as employment-law advice. Present it as a reason to decide **who** the DPO is before deciding **that** there is one.

## Germany criminalises it too, but on a much higher threshold than Belgium

Source: [§42 BDSG, official consolidated law text](https://www.gesetze-im-internet.de/bdsg_2018/__42.html) · *primary legislation* · **[checked 2026-11-11]**

Art. 84 GDPR obliges every member state to lay down penalties beyond the art. 83 fines, and [eu-gdpr-fines.md](eu-gdpr-fines.md) uses Belgium as its worked example. Germany has one as well, and the two are shaped very differently:

| | Germany, §42 BDSG | Belgium, art. 222 of the `wet van 30 juli 2018` |
| --- | --- | --- |
| The offence a business could commit | §42(1): knowingly transmitting or otherwise making accessible **non-publicly-available personal data of a large number of persons**, without entitlement, **acting commercially**. §42(2): processing such data without entitlement, or obtaining it by false statements, **for consideration or intending to enrich or to harm** | processing **without a lawful basis** under art. 6 GDPR, with **no mental element stated** in that point |
| Penalty | **up to three years' imprisonment** or a fine under §42(1); up to two years or a fine under §42(2) | a fine of up to **€120,000**, and the court may order the judgment published |
| Who can set it going | **only on application** (§42(3)) by the data subject, the controller, the Federal Commissioner or the supervisory authority | the ordinary route for a criminal offence |

**So the German offence is far harder to commit and far worse to be convicted of.** It needs scale plus a commercial purpose, or a profit or harm motive; an ordinary founder who simply cannot name a lawful basis is nowhere near it. The Belgian provision reaches that founder on its face. Neither of those is a reason to relax in the other country — it is a reason not to carry either answer across the border.

**And §42(4) answers a question a founder will ask before notifying a breach.** A notification under art. 33 or a communication to data subjects under art. 34(1) *"darf in einem Strafverfahren gegen den Meldepflichtigen ... nur mit Zustimmung des Meldepflichtigen ... verwendet werden"* — it may be used in criminal proceedings **against the person who made it** only with their consent. So the 72-hour notification in [eu-gdpr.md](eu-gdpr.md) §4 cannot be turned into the evidence for a §42 prosecution of the notifier. Read that beside art. 83(2)(h) in [eu-gdpr-fines.md](eu-gdpr-fines.md), under which notifying is an express mitigating factor: in Germany the law protects the notification from both directions. Whether any equivalent exists in the other three is **[not researched]**.

## The German art. 35(4) DPIA list puts AI customer interaction on it

Source: [DSK — `Liste von Verarbeitungsvorgängen nach Art. 35 Abs. 4 DS-GVO für den nicht-öffentlichen Bereich`, Version 1.1 of 2018-10-17](https://www.datenschutzkonferenz-online.de/media/ah/20181017_ah_DSK_DSFA_Muss-Liste_Version_1.1_Deutsch.pdf) · *the joint publication of all German supervisory authorities, titled as the art. 35(4) list* · **[checked 2026-11-11]**

Art. 35(4) GDPR obliges every supervisory authority to publish a list of processing that requires an impact assessment. Germany's is a **joint** list of the federal and Land authorities, 17 numbered entries, still at version 1.1 as listed on the DSK's own index on 2026-11-11. Each entry gives a description, typical fields of use and examples.

**Entry 11 is the one this skill's users will meet:** *"Einsatz von künstlicher Intelligenz zur Verarbeitung personenbezogener Daten zur Steuerung der Interaktion mit den Betroffenen oder zur Bewertung persönlicher Aspekte der betroffenen Person"* — using AI on personal data to **steer the interaction** with the people concerned, or to **evaluate personal aspects** of them. Its typical field is given as `Kundensupport mittels künstlicher Intelligenz`, and one of its examples is a company deploying a system that converses with customers and processes their personal data through AI in order to advise them.

That is a pilot a founder might build. In Germany it is not an arguable DPIA case — it is **on the mandatory list**, which by §38(1) sentence 2 above also makes a DPO compulsory for it. Entry 14, comprehensive profiles of movement and purchasing behaviour, and entry 5, merging personal data from several sources at scale, are the next two a small B2B product could run into.

The list closes with the reminder that the general art. 35(1) rule applies to *every* form of processing, in particular using new technologies, so the 17 entries are a floor and not a ceiling. The other entries, and the nine WP 248 criteria the list builds on, are **[not researched]** here.

## The competent authority's own guidance for a one-person business

Source: [BayLDA — `Datenschutz-Checkliste für Soloselbstständige und Kleinstunternehmen aus dem Handel`, Version 0.9, `Stand: 13.05.2025`](https://www.lda.bayern.de/media/checkliste/baylda_checkliste_handel_solo.pdf) · *the competent Land authority's own guidance* · **[checked 2026-11-11]**

The document itself names `www.lda.bayern.de/checkliste_handel` as the place to find the current version; that shortlink redirected to the authority's home page on 2026-11-11, so the URL above is the file actually read. The BayLDA, with the IHK Bayern, publishes a 13-page `Praxis-Check` that states *"die Erwartungen des BayLDA an die Datenschutz-Compliance für Soloselbstständige und Kleinstunternehmen"*. It is the closest thing in any of these packs to a supervisory authority telling a one-person business what is enough.

**Read the scope line before using it.** It assumes retail (`Handel`), **at most nine employees**, an own website, B2B and partly B2C, mainly standard IT and cloud services, and expressly **no high-risk processing** — its own example of what it excludes is *"kein KI-Startup, das datengetriebenes Profiling betreibt"*. It is version **0.9** and calls itself *"bewusst als anpassungsfähiger Stand"*. So it is not authority for a service business, and it is not authority for anything the exclusions name. What transfers is the shape of the answer, not the answer.

Five things in it that are useful anyway:

- **Two obligations may be handled reactively.** For this profile the checklist says the handling of data subject rights (item 10) and of breach notification (item 11) *"kann reaktiv ausgestaltet werden"* — you may wait until a request or an incident actually arrives rather than defining processes up front. A supervisory authority saying so is worth more than a template nobody will use. What it still asks for: that you know the rights exist, that contact details are published, and that you know where the breach form is — `www.lda.bayern.de/datenpanne`.
- **The DPO answer is a recorded decision, not an omission.** Item 5 concludes `Bestellpflicht Datenschutzbeauftragter: Nein` for this profile, citing art. 37 GDPR and §38 BDSG — and prints a `Ja. Begründung:` line beside it. The authority expects the reasoning kept, which is what §6 of [eu-gdpr.md](eu-gdpr.md) asks for too.
- **A processor contract with the hoster, the mail provider and the cloud office suite, each time.** Items 6 to 8 treat these as three separate `Verträge zur Auftragsverarbeitung`, usually on the provider's own template; the BayLDA publishes a [`Formulierungshilfe`](https://www.lda.bayern.de/media/muster/formulierungshilfe_av.pdf) to check one against. **[not researched]**: the contents of that template.
- **Transfers to the US are checked per provider, not per country.** Item 8 relies on the EU–US Data Protection Framework, with the stated condition that *the specific provider appears on the DPF list of the US Department of Commerce* — and its footnote adds that where it does not, the transfer needs other guarantees such as the Commission's standard contractual clauses. See [eu-gdpr.md](eu-gdpr.md) §8, where the adequacy question is otherwise open.
- **An AI tool needs a processor contract and a settings check.** Item 15 assumes AI used to draft text, and asks for a `Vertrag zur Auftragsverarbeitung` with the provider — noting in a footnote that this usually means the **paid** tier, since the free one is a consumer product — and then for a check *"dass die eigenen Eingabe- und Ausgabedaten vom KI-Anbieter nicht für eigene Zwecke wie die Produktverbesserung verwendet werden"*, which some services only switch off through a configuration toggle rather than the contract.

**And one thing it says that the AI Act layer should be read against.** Item 15's footnote states that the GDPR imposes no duty to disclose to data subjects that text or images were AI-generated, and that it was *"momentan unklar"* whether art. 50 of the AI Act applies where a human posts AI-generated content — adding that the authority competent for the AI Act in Germany *"zum Zeitpunkt der Veröffentlichung"* was not yet settled. That is a Land supervisory authority recording, in May 2025, that Germany had not designated its AI Act authority. **It has since: the `KI-MIG` of 2026-07-22, in force 2026-07-29, makes the Bundesnetzagentur the competent market surveillance authority — see [eu-ai-act.md](eu-ai-act.md) §7.** So the checklist is right about its own date and out of date on this point, which is the ordinary condition of a version 0.9 document and a reason to check its page before quoting it. Read it with [eu-ai-act.md](eu-ai-act.md) §4, which narrows art. 50 from the Regulation's own definitions, and treat the German enforcement question as open rather than answered.

The remaining `BDSG` provisions — employee data in §26, special categories in §22, and the restrictions on data subject rights in §§32 to 37 — are **[not researched]**.

## Employee data, and the applicant who counts as an employee — §26 BDSG

Source: [§26 BDSG](https://www.gesetze-im-internet.de/bdsg_2018/__26.html) · *primary legislation, read in full on the federal justice ministry's portal* · **[checked 2026-11-12]**

**The paragraph a founder hiring their first person needs is §26(1) sentence 1.** Employee personal data may be processed for employment purposes where that is **necessary** — for *"die Entscheidung über die Begründung eines Beschäftigungsverhältnisses"*, the decision whether to enter into the relationship at all, and after it exists for performing or ending it, or for the rights and duties of employee representation arising from a law or a collective agreement.

**And §26(8) is the sentence that makes this reach a pilot.** It lists seven categories of `Beschäftigte` — employees including agency workers, trainees, rehabilitation participants, sheltered-workshop workers, certain volunteers, **economically dependent persons treated as employee-like including homeworkers**, and federal officials, judges and soldiers. Then:

> Bewerberinnen und Bewerber für ein Beschäftigungsverhältnis sowie Personen, deren Beschäftigungsverhältnis beendet ist, gelten als Beschäftigte.

**Applicants for a position, and people whose employment has ended, count as employees.** So a founder who collects a single CV is processing `Beschäftigtendaten` under §26 — before anyone is hired, and after anyone leaves. Read that beside **[eu-ai-act-national.md](eu-ai-act-national.md)** and [eu-ai-act.md](eu-ai-act.md) §3: a tool that screens those CVs is high-risk under Annex III point 4(a), and the data it reads are employee data under German law from the moment the application arrives.

**Two more paragraphs that change what a founder may do:**

| Provision | What it does |
| --- | --- |
| **§26(1) sentence 2** | To **detect a criminal offence** by an employee, processing is allowed only where **documented** factual indications ground the suspicion, the processing is necessary to detect it, and the employee's legitimate interest in exclusion does not outweigh — *"insbesondere Art und Ausmaß im Hinblick auf den Anlass nicht unverhältnismäßig sind"*. Three cumulative conditions and a documentation duty before you look |
| **§26(2)** | Consent in employment: freedom to consent is judged against *"die im Beschäftigungsverhältnis bestehende Abhängigkeit"* and the circumstances. It **can** be free where the employee gains a legal or economic advantage or the interests are aligned. **Consent must be in writing or electronic form** unless special circumstances make another form appropriate, and the employer must explain the purpose and the art. 7(3) withdrawal right **in `Textform`** |
| **§26(3)** | Special categories for employment purposes, where necessary to exercise rights or meet duties under labour, social security and social protection law, and no reason to think the data subject's interest overrides. Consent must **expressly refer to those data**, and §22(2)'s safeguards apply |
| **§26(7)** | Paragraphs 1 to 6 apply **even where the data are not and will not be stored in a filing system**. That is wider than art. 2(1) GDPR, which reaches non-automated processing only in a filing system |

**Open:** whether §26(1) satisfies the conditions **art. 88(2) GDPR** sets for a national employment rule. The question is not idle: §26(4) is the only paragraph that mentions art. 88(2) expressly, and it addresses it to the parties negotiating a **collective agreement** rather than to §26(1) itself. Whether that matters is **[not researched]** and is a question for a German lawyer.

## The safeguards §22(2) BDSG actually names

Source: [§22 BDSG](https://www.gesetze-im-internet.de/bdsg_2018/__22.html) · *primary legislation, read in full* · **[checked 2026-11-12]**

§22(1) permits special-category processing in cases a solo founder will rarely be in — social security, health care, substantial public interest, and public-body limbs. **§22(2) is the useful half**, because §26(3) and §10 `HinSchG` both borrow it: where you do rely on §22(1), you must put *"angemessene und spezifische Maßnahmen"* in place, and the statute names ten, weighed against the state of the art, the cost of implementation and the risk:

technical and organisational measures to ensure the processing complies; measures that make it possible to **check afterwards whether and by whom data were entered, altered or removed**; awareness-raising among those involved; **naming a data protection officer**; restricting access inside the controller and at processors; pseudonymisation; encryption; ensuring confidentiality, integrity, availability and resilience including rapid restoration after an incident; a **procedure for regularly reviewing and evaluating the effectiveness** of the measures; and specific procedural rules for onward transmission or further purposes.

**That list is worth more than its own section suggests.** It is the closest thing in German law to an itemised answer to "what counts as appropriate", and a founder writing their first security note can use it as the agenda — note that it puts **appointing a DPO** in the same list as encryption, which is a measure rather than a threshold, and is a different route to a DPO from the §38 duty above.

## What Germany takes away from the data subject rights — §§32 to 35 BDSG

Sources
- [§32](https://www.gesetze-im-internet.de/bdsg_2018/__32.html), [§33](https://www.gesetze-im-internet.de/bdsg_2018/__33.html), [§34](https://www.gesetze-im-internet.de/bdsg_2018/__34.html) and [§35 BDSG](https://www.gesetze-im-internet.de/bdsg_2018/__35.html) · *primary legislation, read in full* · **[checked 2026-11-12]**

These are restrictions under art. 23 GDPR, and most of their limbs are for public bodies. **What reaches a `nichtöffentliche Stelle` — a private founder — is narrow and worth knowing exactly**, because the rest is noise a reader will otherwise wade through:

| Right | What a private controller gets |
| --- | --- |
| **Art. 13(3)** — informing about further processing | **§32(1) Nr. 1**: not required where the further processing concerns **analogue stored** data, the controller addresses the person directly through it, the new purpose is compatible, **the communication is not digital**, and the person's interest in being informed is slight in the circumstances. **§32(1) Nr. 4**: not required where informing would prejudice asserting, exercising or defending legal claims and the controller's interest in silence prevails |
| **Art. 14** — data not obtained from the person | **§33(1) Nr. 2(a)**: not required where informing would prejudice **civil** claims, or where the processing involves data from civil contracts and serves to **prevent damage through criminal offences** — unless the person's legitimate interest in being informed prevails |
| In both cases | **§32(2) and §33(2)**: if you omit it, take appropriate measures including **publishing the art. 13 or 14 information** in clear plain language, and **record in writing why you omitted it**. For §32(1) Nr. 4 and 5 that does not apply. **§32(3)**: where the obstacle was temporary, inform within a reasonable period and **at the latest within two weeks** of it falling away |
| **Art. 15** — access | **§34(1) Nr. 2**: no right where the data are stored **only** because a statutory or by-law retention rule forbids deletion, **or** serve **exclusively** backup or data-protection-control purposes — **and** access would need disproportionate effort **and** processing for other purposes is excluded by technical and organisational measures. Three conditions, all of them |
| Refusing access | **§34(2)**: the reasons must be **documented**, and the refusal **reasoned to the person** unless that would defeat its purpose. Data held to answer the request may be used only for that and for data-protection control |
| **Art. 17** — erasure | **§35(1)**: where erasure in **non-automated** processing is impossible or disproportionately costly *"wegen der besonderen Art der Speicherung"* and the person's interest in erasure is slight, there is **no right and no duty** — and **restriction under art. 18 takes its place**. It does **not** apply where the data were processed unlawfully |
| Erasure, again | **§35(3)**: the same applies where **`satzungsgemäße oder vertragliche Aufbewahrungsfristen`** stand in the way — so a **contractual** retention period can displace the erasure right |

**Three things to take from that table.**

**The backup carve-out is real but triple-locked.** "It is only in the backup" is not an answer to a German access request on its own; it is an answer only together with disproportionate effort and a technical bar on using the data for anything else. A founder whose backups are a folder they could grep has the effort limb against them.

**§35(3) is the one that changes a founder's drafting.** A retention period written into the founder's own contract is not merely a reason to keep data; in Germany it can defeat an erasure request, with restriction substituted. That is a reason to set retention periods deliberately and in writing — and a reason not to copy a long one in from a template, because it cuts both ways: it is also the period you must then be able to justify.

**The documentation duty survives every exemption.** §32(2), §33(2) and §34(2) each require the controller to **write down why**. Using one of these restrictions without a record is using it badly, and the record is the only thing that makes the refusal defensible later.

**§36 and §37 were not read**, deliberately: §36 restricts the art. 21 objection for **public bodies**, and §37 concerns automated individual decisions in **insurance** contracts. Neither reaches a solo B2B founder. They are named here so that "§§32 to 37" is not left looking unexamined.

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| §40(1) BDSG: the Land authorities supervise the private sector | 2026-11-11 | Primary — read and quoted; it is the statutory basis for what the BfDI directory says |
| §40(2) BDSG: art. 4(16) GDPR decides between several domestic establishments | 2026-11-11 | Primary — read |
| §40(3)–(7) BDSG: the authority may refer serious cases to the `Gewerbeaufsicht`, enter business premises, and demand a DPO be replaced | 2026-11-11 | Primary — read, not restated here beyond the referral; the powers themselves are an authority-conduct question, not a founder task |
| Bavaria splits private-sector and public-sector supervision, which is where totals of 17 or 18 come from | 2026-11-11 | Authority — the BayLDA's own scope page read and quoted |
| `freiberuflich Tätige` are inside the private-sector authority's remit | 2026-11-11 | Authority — the same page, quoted |
| Whether any Land other than Bavaria splits it | — | Open — not researched; the BfDI directory lists one entry per Land and does not say |
| §38(1) sentence 1 BDSG: at least 20 persons permanently occupied with automated processing | 2026-11-11 | Primary — read and quoted |
| §38(1) sentence 2 BDSG: four triggers that apply regardless of headcount | 2026-11-11 | Primary — read and quoted; this is the half a summary of the 20-person rule leaves out |
| §38(2) with §6(4) BDSG: dismissal protection for a compulsory DPO, plus one year | 2026-11-11 | Primary — both read and quoted |
| §6(5) sentence 2 and §6(6) BDSG: confidentiality, inherited testimonial privilege, seizure protection | 2026-11-11 | Primary — read |
| The DSK list is titled as the art. 35(4) list for the non-public sector, version 1.1, 17 entries | 2026-11-11 | Authority — the list and the DSK index page both read; version 1.1 is still the only one listed |
| Entry 11 covers AI used to steer interaction with, or evaluate, data subjects, with `Kundensupport mittels künstlicher Intelligenz` as its typical field | 2026-11-11 | Authority — the entry read and quoted in German |
| The other 16 entries, and the nine WP 248 criteria the list builds on | — | Open — only entries 5, 11 and 14 were read |
| The BayLDA `Praxis-Check` is version 0.9, `Stand: 13.05.2025`, scoped to retail with at most nine employees and no high-risk processing | 2026-11-11 | Authority — the PDF read in full, including the scope and the self-description as a provisional draft |
| Items 10 and 11: data subject rights and breach notification may be handled reactively for that profile | 2026-11-11 | Authority — read and quoted |
| Items 6 to 8: a separate processor contract for hoster, mail and cloud office; item 8's per-provider DPF condition | 2026-11-11 | Authority — read |
| The contents of the BayLDA's `Formulierungshilfe` for a processor contract | — | Open — the template was linked but not read |
| Item 15: a processor contract for an AI tool, usually the paid tier, plus a check that inputs and outputs are not reused for product improvement | 2026-11-11 | Authority — read and quoted |
| Item 15 footnote: no GDPR duty to disclose AI-generated content, art. 50 AI Act unclear for human-posted output, and Germany had not settled its AI Act authority as at 2025-05-13 | 2026-11-11 | Authority — read; it is that authority's reading of another instrument, so treat the AI Act question as open |
| §42 BDSG: criminal liability needs scale plus a commercial purpose, or a profit or harm motive, and is prosecuted only on application | 2026-11-11 | Primary — read and tabulated against the Belgian provision |
| §42(4): an art. 33 or art. 34 notification may be used against its maker in criminal proceedings only with consent | 2026-11-11 | Primary — read and quoted |
| Whether Belgium, the Netherlands or France has an equivalent use immunity | — | Open — not researched |
| §26(1) sentence 1: employee data for the decision to enter, perform or end the relationship | 2026-11-12 | Primary — read and quoted |
| **§26(8): applicants and former employees count as `Beschäftigte`** | 2026-11-12 | Primary — read and quoted. This is what brings a single CV inside §26 |
| §26(1) sentence 2: three cumulative conditions and a documentation duty before processing to detect an employee's offence | 2026-11-12 | Primary — read |
| §26(2): dependency is weighed, consent in writing or electronic form, purpose and withdrawal right in `Textform` | 2026-11-12 | Primary — read and quoted |
| §26(7): paragraphs 1 to 6 apply even outside a filing system, which is wider than art. 2(1) GDPR | 2026-11-12 | Primary — read; the comparison with art. 2(1) is this pack's |
| Whether §26(1) satisfies art. 88(2) GDPR | — | Open — §26(4) is the only paragraph citing art. 88(2), and it addresses collective agreements. Not researched; a question for a German lawyer |
| §22(2): ten named appropriate and specific measures, including appointing a DPO | 2026-11-12 | Primary — read and listed |
| §32(1) Nr. 1 and Nr. 4, §32(2) publication and written record, §32(3) two-week limit | 2026-11-12 | Primary — read |
| §33(1) Nr. 2(a): the private-sector limb, civil claims and preventing damage through offences | 2026-11-12 | Primary — read |
| §34(1) Nr. 2: no access right for retention-locked or backup-only data, on three cumulative conditions | 2026-11-12 | Primary — read |
| §34(2): refusal must be documented and reasoned to the person | 2026-11-12 | Primary — read |
| §35(1): restriction replaces erasure for non-automated data stored in a particular way, unless processed unlawfully | 2026-11-12 | Primary — read and quoted |
| **§35(3): a contractual retention period can displace the erasure right** | 2026-11-12 | Primary — read |
| §36 and §37 BDSG | — | Elsewhere — read as out of scope rather than unexamined: §36 restricts the art. 21 objection for public bodies and §37 concerns automated decisions in insurance |
| Which authority is competent, as a founder needs to be told it | — | Elsewhere — stated in [germany.md](germany.md) §6, which this annex expands |

Next full recheck due: **2027-05-10**. Earlier if the DSK publishes a version 1.2 of the art. 35(4) list, if the BayLDA moves its checklist past version 0.9, or if Germany designates its AI Act supervisory authority.

No independent data-protection reviewer has reviewed this annex.
