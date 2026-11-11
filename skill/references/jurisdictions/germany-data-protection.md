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

**And one thing it says that the AI Act layer should be read against.** Item 15's footnote states that the GDPR imposes no duty to disclose to data subjects that text or images were AI-generated, and that it was *"momentan unklar"* whether art. 50 of the AI Act applies where a human posts AI-generated content — adding that the authority competent for the AI Act in Germany *"zum Zeitpunkt der Veröffentlichung"* was not yet settled. That is a Land supervisory authority recording, in May 2025, that Germany had not designated its AI Act authority. Read it with [eu-ai-act.md](eu-ai-act.md) §3, which narrows art. 50 from the Regulation's own definitions, and treat the German enforcement question as open rather than answered.

The remaining `BDSG` provisions — employee data in §26, special categories in §22, and the restrictions on data subject rights in §§32 to 37 — are **[not researched]**.

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
| §26, §22 and §§32 to 37 BDSG — employee data, special categories, restrictions on data subject rights | — | Open — not researched |
| Which authority is competent, as a founder needs to be told it | — | Elsewhere — stated in [germany.md](germany.md) §6, which this annex expands |

Next full recheck due: **2027-05-10**. Earlier if the DSK publishes a version 1.2 of the art. 35(4) list, if the BayLDA moves its checklist past version 0.9, or if Germany designates its AI Act supervisory authority.

No independent data-protection reviewer has reviewed this annex.
