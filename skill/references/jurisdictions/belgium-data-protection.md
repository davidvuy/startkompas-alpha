# Belgium — data protection (annex)

**This is an annex to [belgium.md](belgium.md) §6, not a pack of its own.** It exists because the Belgian pack went over this skill's 48 KB per-reference budget on 2026-11-11, which is the only reason any of these annexes exists. The EU rules are in [eu-gdpr.md](eu-gdpr.md) and its annexes; §6 of the pack names the authority. Everything else Belgian is here, and the four national packs now have the same shape.

**This annex is preparation, not advice.** It records what the Belgian statute and the GBA's own publications state, with dates, and keeps the two apart. The criminal-law reading in particular is for a Belgian lawyer: this annex records what art. 222 says, not how a court would apply it.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

---

Source: [GBA — register van de verwerkingsactiviteiten](https://www.gegevensbeschermingsautoriteit.be/professioneel/avg/register-van-verwerkingsactiviteiten/wie-moet-het-register-van-de-verwerkingsactiviteiten-bijhouden) · *national supervisory authority* · **[checked 2026-11-10]**

The GBA states that **both controllers and processors** must keep a register under art. 30.1, and that this applies **even to organisations not established in the EEA** where the GDPR reaches them. The under-250 exemption and the four conditions that cancel it are in [eu-gdpr.md](eu-gdpr.md) §3 — walk those rather than assuming a small founder is exempt.

## Its SME publications — and a warning about one of them

All four were extracted and read on **2026-11-10**. They are not one body of work, and the dates and authorship matter more than the titles:

| Publication | Date | Who wrote it |
| --- | --- | --- |
| [`Wegwijs in de AVG voor KMO's`](https://www.gegevensbeschermingsautoriteit.be/publications/wegwijs-in-de-avg-voor-kmo-s.pdf) | **January 2018** | **The CBPL**, the GBA's predecessor — see below |
| [`13-stappenplan`](https://www.gegevensbeschermingsautoriteit.be/publications/13-stappenplan.pdf) | **versie 2.0, January 2018** | The same CBPL-era material, printed by the Kamer van volksvertegenwoordigers, and it still refers the reader to *"de website van de Privacycommissie"* |
| [`FAQ-brochure voor KMO's`](https://www.gegevensbeschermingsautoriteit.be/publications/faq-brochure-voor-kmo-s.pdf) | **26 July 2020** | **Els Kindt and Pauline Hellemans, CiTiP KU Leuven** — project BOOST, EU grant 874505, hosted by the GBA |
| [`Als KMO omgaan met rechten van betrokkenen`](https://www.gegevensbeschermingsautoriteit.be/publications/boost-een-beknopte-handleiding-voor-kmo-s.pdf) | 2020, same project | The same BOOST authors |

**Read the authorship line before you cite one of these as "the GBA's position."** The two 2020 BOOST brochures are an academic deliverable of an EU co-funded project, published on the GBA's site. They are better than the 2018 pair — post-application, and they cite case law such as *Fashion ID* on embedded social plug-ins — but they are a KU Leuven text, not supervisory doctrine. The FAQ says so itself: it is *"een aanvulling op"* the 2018 `Wegwijs`, it does not treat the GDPR in full, and it covers only five chosen topics — controller/processor, transparency, DPIA, the register, and the DPO.

One thing the BOOST FAQ settles that the pack had left open: the Belgian act supplementing the GDPR is the **`wet van 30 juli 2018`** (`Gegevensbeschermingswet 2018`). It was read on 2026-11-11 — see below.

**The main SME guide predates the GDPR taking effect.** Extracted and read on 2026-11-10: it carries *"januari 2018"* on its own front matter, opens with *"Op 25 mei 2018 treedt de Algemene Verordening Gegevensbescherming (AVG) in werking"* in the **future tense**, and explains that the GBA *"zal"* replace the CBPL from that date. It is therefore **pre-application guidance, now over eight years old**, and it reflects no supervisory practice, no decisions and no case law since.

So: a founder may still find it a readable introduction, but **do not treat it as current**, and do not cite a figure or procedure from it without checking against something newer. The Dutch [AP step plan](netherlands.md) §6 is far more current. The French [CNIL](france.md) §6 has the most small-business material of the four packs — but its main PME guide carries **April 2018** and has exactly the same problem, so the pattern here is not a Belgian failing.

Two points from it that remain sound and are not GDPR restatement:

- **The GDPR's impact depends on an SME's actual processing activities, not on SME status as such** — consistent with the four-condition register test in [eu-gdpr.md](eu-gdpr.md) §3.
- A data subject may **complain to the GBA and go to the ordinary court at the same time**; nothing excludes doing both. So a sanction risk and a damages claim are not alternatives.

## Notifying a breach: set the account up before you need it

Breach notification goes to the GBA on the 72-hour clock in [eu-gdpr.md](eu-gdpr.md) §4. How you actually file it is the GBA's own current document — and the only one of these publications that is genuinely current.

Source: [`Handleiding melden van een gegevensinbreuk`](https://www.gegevensbeschermingsautoriteit.be/publications/handleiding-melden-van-een-gegevensinbreuk.pdf) · *the GBA's own procedural manual, **versie 2.0 of 2026-02-02*** (versie 1.0 was 2025-06-10) · **extracted and read [checked 2026-11-10]**

- **A notification is two linked parts, and part 1 alone does not discharge the duty.** The manual is explicit: *"Om aan uw meldingsplicht te voldoen dient u ook deel 2 van het formulier in te vullen."*
- **Part 2 needs a business account on the GBA portal** (`ondernemingsaccount`). For a controller in the Belgian `Kruispuntbank voor Ondernemingen`, logging in means authenticating through the **Federal Authentication Service (FAS)**, and only a person holding the MijneGov role **`GBA_Documentum_Vertegenwoordiger`** for that controller can get in.
- **The GBA names the trap itself.** It writes that the art. 33 72-hour deadline *"kan in het gedrang komen"* if that role has not been assigned when the breach is discovered, or if the one authorised person is away. **So assign the role now, to more than one person, while nothing is wrong.** This is the cheapest item in this pack and the one a founder will otherwise meet at 3 a.m.
- **The escape hatch, and its limit.** Precisely because of that, part 1 can be filed with **no account**: *Indienen als onderneming* → *Gegevensinbreuk (Deel 1)* → enter the KBO number and the sum check. It is only open to controllers with a KBO registration, and *not* to public bodies sharing a KBO number with others, because the GBA then has no safe way to attach part 1 to an account afterwards. Part 2 still requires the account; the filing is linked to it once you log in and appears under *Mijn taken*.
- **You get 21 calendar days from filing part 1 to file part 2**, with reminder mails at 14 and 7 days remaining. Within those 21 days the notification can still be cancelled; after part 2 is filed it cannot.
- **A saved draft hardens into the final answer.** If you use the interim save (`tijdelijke bewaaropdracht`) and then change nothing, *"zullen de waardes die u hebt ingevuld in deze bewaaropdracht op dag 21 als definitief worden beschouwd."* A placeholder left in a draft therefore becomes the filed statement.
- **Expect no feedback.** Handling is in principle purely internal and you are not informed of it; if the GBA has questions it contacts you through the business account, with an email notification to the contact person and a stated reply deadline.

## The `wet van 30 juli 2018`, read — and most of it is not about you

Source: [`Wet van 30 juli 2018 betreffende de bescherming van natuurlijke personen met betrekking tot de verwerking van persoonsgegevens`, numac `2018040581`](https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=nl&la=N&cn=2018073046&table_name=wet) · *primary legislation, the Justel consolidation `tekstbijwerking tot 02-04-2026`* · **[checked 2026-11-11]**

The pack identified this act on 2026-11-10 from the GBA's own FAQ and recorded that it had not been read. It has now been read, and the first useful fact is structural: **the act is in six titles and only the first applies to an ordinary business.**

| Title | Who it governs |
| --- | --- |
| **Titel 1** | processing under the GDPR generally. Art. 6: *"Onverminderd bijzondere bepalingen, geeft deze titel uitvoering aan de Verordening"* |
| Titel 2 | the competent authorities for preventing, investigating and prosecuting criminal offences |
| Titel 3 | the intelligence and security services |
| Titels 4 and 5 | the supervisory authority's organisation, remedies and representation |
| **Titel 6** | **sanctions**, and it reaches Titel 1 |

That matters for reading other people's citations of this act. Its articles 58 and 59 are a data protection impact assessment and a prior-consultation duty — **but they sit in Titel 2**, so they bind police and judicial authorities, not a founder. A business's impact assessment duty is art. 35 GDPR plus the GBA's own list below, and nothing in this act.

What Titel 1 adds for a private controller is thin: principles of processing (arts. 7 to 10/2), limits on data subject rights (arts. 11 to 17), certification-body accreditation (art. 18) and the journalistic and artistic exemption (art. 24). Two absences and one presence are worth stating:

- **No national DPO threshold.** Titel 1 has no provision on designating a `functionaris voor gegevensbescherming` at all — the act's DPO articles, 63 to 65, are in Titel 2. So art. 37(1) GDPR is the whole test in Belgium, as it is in the Netherlands, and unlike Germany where §38 BDSG compels one with no employees at all. Three member states, three answers, under the same art. 37(4) permission.
- **Nothing on the register of processing activities.** Art. 30 GDPR applies unmodified.
- **Art. 7 sets the age of consent at 13.** For a direct offer of information-society services to a child, processing is lawful *"indien de toestemming verleend wordt door kinderen van 13 jaar of ouder"*, and below 13 the legal representative consents. Art. 8 GDPR allows member states to set this anywhere from 13 to 16: **Belgium took the floor, the Netherlands took the ceiling** and extended it beyond information-society services. Do not carry one across the border.

The GBA's own FAQ, which is where the pack first met this act, does not mention the sanctions title at all — and that is the half a founder would most want to know.

## Belgium also makes it a crime, and processing without a lawful basis is the one with no excuse

**Art. 84 GDPR obliges every member state to lay down "other penalties"** beyond the art. 83 administrative fines, *"in particular for infringements which are not subject to administrative fines pursuant to Article 83"*. [eu-gdpr-fines.md](eu-gdpr-fines.md) covers the fines. Belgium is the pack's worked example of the other half, and it is criminal.

**Art. 222** punishes *"de verwerkingsverantwoordelijke of de verwerker, zijn aangestelde of gemachtigde"* under Titels 1 and 2 — so a private controller or processor — with a `straf van niveau 1`, with the fine capped, in derogation from arts. 36 and 38 of the Penal Code, at **€120,000**. Fourteen numbered cases. Four of them can reach an ordinary business, and **they do not carry the same mental element**:

| | Art. 222 | Mental element in the text |
| --- | --- | --- |
| 1° | personal data are processed **without a lawful basis** under art. 6 GDPR, *"inbegrepen de voorwaarden voor de toestemming en verdere verwerking"* | **none stated** |
| 2° | processing in breach of art. 5 GDPR's principles | *"met ernstige nalatigheid of kwaadwillig"* — serious negligence or malice |
| 3° | processing objected to under art. 21(1) is continued *"zonder dwingende wettige redenen"* | none stated |
| 4° | a transfer to a third country breaches arts. 44 to 49 GDPR | *"met ernstige nalatigheid of kwaadwillig"* |

**Point 1° is the one to take seriously.** The two points that need serious negligence or malice are the ones a founder would get wrong by accident; the one with no mental element stated is **not being able to name a lawful basis** — which is exactly what [eu-gdpr.md](eu-gdpr.md) §7 says a founder must be able to do. In Belgium that is not only an administrative exposure. Do not present this as settled criminal-law analysis — whether a general requirement of intent is read in is a question for a Belgian lawyer — but do not tell a Belgian founder the basis question is paperwork either.

**Art. 225 adds a penalty that is not money.** On conviction under art. 222 or 223 the court may order, under art. 58 of the Penal Code, that the judgment be published in whole or in extract **in one or more newspapers at the convicted person's expense**. For a founder whose business is their name, that is the operative sanction.

**And these articles were rewritten ten weeks ago.** Every penalty in Titel 6 carries the amendment note `<W 2026-03-30/01, art. 194 to 198, 009; Inwerkingtreding: 01-09-2026>`: a law of **2026-03-30**, in force **2026-09-01**, which restated the old prison-and-fine formulations into the new Penal Code's `straf van niveau 1` while keeping each money ceiling by express derogation — €120,000 under art. 222, €240,000 under art. 223, €160,000 under art. 227 and €80,000 under arts. 224 and 226. Any secondary source written before September 2026 states these penalties in the old form. The content of that amending law beyond these five articles is **[not researched]**.

## The GBA's art. 35(4) list — eight entries, and the one with no scale qualifier

Source: [GBA, `Beslissing van het Algemeen secretariaat nr. 01/2019 van 16 januari 2019`](https://www.gegevensbeschermingsautoriteit.be/publications/beslissing-nr.-01-2019-van-16-januari-2019.pdf) · *the supervisory authority's own decision, in force since 2019-04-01* · **[checked 2026-11-11]**

[eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md) establishes that art. 35(4) GDPR obliges every supervisory authority to publish a list of processing requiring an impact assessment. Belgium's was adopted by the `Algemeen secretariaat` under art. 20, §1, 2° of the `wet van 3 december 2017`, after EDPB Opinion 2/2018 of 2018-09-25 required changes to the draft, and it is an annex to `Aanbeveling 01/2018`, replacing the draft list attached to it.

**Eight entries, against seventeen in Germany and seventeen in the Netherlands.** They are:

| | A data protection impact assessment is required when |
| --- | --- |
| 1 | biometric data are used to uniquely identify people **in a public space, or in private spaces accessible to the public** |
| **2** | **personal data are collected from third parties and then taken into account in the decision to refuse or terminate a particular service contract with a natural person** |
| 3 | health data are collected automatically by an active implantable medical device |
| 4 | data are collected from third parties **on a large scale** to analyse or predict the economic situation, health, personal preferences or interests, reliability or behaviour, location or movements of natural persons |
| 5 | art. 9 special categories, or data of a highly personal nature, are **systematically** exchanged between several controllers |
| 6 | **large-scale** processing of data generated by internet-connected sensor devices, used to analyse or predict the same characteristics as entry 4 |
| 7 | **large-scale and/or systematic** processing of telephony, internet or other communication data, metadata or location data, *"wanneer de verwerking niet strikt noodzakelijk is voor een door de betrokkene gevraagde dienst"* |
| 8 | **large-scale** processing in which behaviour is systematically observed, collected, recorded or influenced by automated means, **advertising purposes included** — behaviour meaning *"kijk-, luister-, surf-, klik-, fysiek-, of aankoopgedrag"* |

**Entry 2 is the one that catches a small B2B business, and it has no scale qualifier at all.** Buying or receiving data about a prospect from a third party and using it to decide whether to take them on, or to end an existing contract, is a mandatory impact assessment in Belgium however few people it concerns. A credit check before onboarding is the obvious case. Nothing in the German or Dutch list is framed that way.

Entry 7's carve-out is worth noting from the other side: communication or location data processed because the data subject **asked** for the service is outside it, which is what keeps ordinary service delivery off the list.

**There is no AI entry**, as in the Netherlands and unlike Germany. Paragraph 9 of the decision says plainly that a processing type's absence from the list *"niet uitsluit dat een GEB dient te worden uitgevoerd"* — arts. 35(1) and 35(3) still govern.

**Belgium is the only one of the three that promises to revisit its list.** Paragraph 10 records that the lists are evolutive and cites art. 10 of the GBA's internal rules: *"Zesmaandelijks wordt de lijst desgevallend geactualiseerd, o.m. in functie van de evolutie van nieuwe technologieën"* — reviewed six-monthly, in particular against the evolution of new technologies. Whether any review since 2019 has in fact changed it is **[not researched]**; the 2019 decision is the version published, and a newer one would be the thing to look for first.

**Open:** the BOOST brochures' substantive answers were not transcribed into this pack — read them at the source. Whether a specific breach is notifiable remains a judgment for the founder with advice, not something this pack decides.

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| GBA: register duty for controllers and processors | 2026-11-10 | Authority — GBA page read |
| `Wegwijs` and `13-stappenplan` are both **January 2018, CBPL-era** | 2026-11-10 | Authority — both extracted and read; dates and imprint quoted, and both are CBPL-era |
| The two BOOST brochures are **KU Leuven, July 2020**, not GBA doctrine | 2026-11-10 | Secondary — both extracted and read; KU Leuven, not GBA doctrine. Authorship and self-description quoted |
| Breach filing: two parts, business account, FAS, `GBA_Documentum_Vertegenwoordiger` | 2026-11-10 | Authority — GBA manual versie 2.0 of 2026-02-02, extracted and read |
| Breach filing: 21 calendar days for part 2, reminders at 14 and 7 days | 2026-11-10 | Authority — the same manual; the most current GBA source in this pack |
| Belgian supplementing act is the `wet van 30 juli 2018`, numac 2018040581 | 2026-11-11 | Primary — the Justel consolidation read, `tekstbijwerking tot 02-04-2026` |
| Titel 1 applies generally; arts. 58 and 59 are in Titel 2 and bind authorities, not businesses | 2026-11-11 | Primary — the act's own structure and art. 6 read |
| No national DPO threshold and nothing on the register in Titel 1 | 2026-11-11 | Primary — the DPO articles 63 to 65 are in Titel 2 |
| Art. 7: the age of consent is 13, where the Netherlands sets 16 | 2026-11-11 | Primary — read and quoted; both national texts read |
| Art. 222: a criminal fine up to €120,000, and point 1° on the lawful basis states no mental element where 2° and 4° require serious negligence or malice | 2026-11-11 | Primary — read and tabulated; the criminal-law reading itself is for a Belgian lawyer |
| Art. 225: the court may order the judgment published in newspapers at the convict's expense | 2026-11-11 | Primary — read |
| Titel 6 was restated into the new Penal Code's levels by the law of 2026-03-30, in force 2026-09-01, keeping each money ceiling by derogation | 2026-11-11 | Primary — the amendment notes on arts. 222 to 227 read |
| The content of the law of 2026-03-30 beyond those five articles | — | Open — not researched |
| The GBA art. 35(4) list: eight entries, in force 2019-04-01, annexed to Aanbeveling 01/2018 after EDPB Opinion 2/2018 | 2026-11-11 | Authority — the decision read in full |
| Entry 2 has no scale qualifier: third-party data used to refuse or end a service contract | 2026-11-11 | Authority — read and quoted |
| No AI entry, and absence from the list does not exclude a DPIA | 2026-11-11 | Authority — paragraph 9 of the decision |
| The list is reviewed six-monthly under art. 10 of the GBA's internal rules | 2026-11-11 | Authority — paragraph 10, quoted |
| Whether any six-monthly review has changed the 2019 list | — | Open — not researched; the 2019 decision is the published version |
| Substantive answers in the two BOOST brochures | — | Open — provenance established, contents left at the source |
| Registration, VAT, e-invoicing, agreements and software ownership | — | Elsewhere — those are [belgium.md](belgium.md)'s sections 1 to 5 |

Next full recheck due: **2027-05-10**. Earlier if the GBA's six-monthly review changes its art. 35(4) list, or if the law of 2026-03-30 is followed by another amendment to Titel 6 of the `wet van 30 juli 2018`.

No independent Belgian legal reviewer has reviewed this annex.
