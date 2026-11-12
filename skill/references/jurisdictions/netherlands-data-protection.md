# Netherlands — data protection (annex)

**This is an annex to [netherlands.md](netherlands.md) §6, not a pack of its own.** It exists because the Dutch pack was at 44.1 KB of this skill's 48 KB per-reference budget before the `UAVG` was read at all. The EU rules are in [eu-gdpr.md](eu-gdpr.md) and its annexes; §6 of the pack names the three obligations the AP puts first. Everything else Dutch is here.

**This annex is preparation, not advice.** It records what the Dutch statute and the AP's own publications state, with dates, and keeps the two apart — an article is the rule, the authority's page is the authority's reading of it. Consequential data-protection questions need a qualified reviewer and the AP itself.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

---

## What the UAVG adds, and the three things it does not

Source: [Uitvoeringswet Algemene verordening gegevensbescherming, `BWBR0040940`](https://wetten.overheid.nl/BWBR0040940) · *primary legislation, the version `Geldend van 01-09-2026`* · **[checked 2026-11-11]**

The `UAVG` is a lean implementing act: five chapters, and most of its substance is **exceptions to the prohibitions in arts. 9 and 10 GDPR** rather than duties of its own. For a one-person B2B pilot the three absences matter more than anything present.

| | The Netherlands |
| --- | --- |
| A **national DPO threshold** under art. 37(4) GDPR | **None.** The word `functionaris` appears twice in the whole act, neither time as a duty to designate one. So the art. 37(1) test in [eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md) is the whole answer here — unlike Germany, where §38 BDSG compels one with no employees at all ([germany-data-protection.md](germany-data-protection.md)) |
| Anything about the **register** of processing activities | **Nothing.** Art. 30 GDPR, including its under-250 exemption, applies unmodified |
| A different **fine** ceiling | **None.** Art. 14(3) UAVG: the AP *"kan in geval van overtreding van het bepaalde in artikel 83, vierde, vijfde of zesde lid, van de verordening een bestuurlijke boete opleggen van ten hoogste de in deze leden genoemde bedragen"* — the Regulation's own amounts, and so no Dutch SME reduction either. See [eu-gdpr-fines.md](eu-gdpr-fines.md) |

Four provisions that do add something, in the order a founder is likely to meet them:

- **Art. 40 — automated individual decision-making.** The exception to the art. 22(1) GDPR prohibition is narrow twice over: it covers automated decisions *"anders dan op basis van profilering"* — **other than on the basis of profiling** — and then only where necessary for a legal obligation or a task in the public interest. **For a private business building a profiling-based automated decision, the UAVG opens no door at all.** Art. 40(3) does give private controllers a concrete test for the "appropriate measures" the article requires: they are in any case taken where **the right to human intervention, the right for the person to put their point of view, and the right to contest the decision** are secured. That is three features, not a policy document.
- **Art. 29 — biometric data.** The art. 9(1) prohibition does not apply where processing is *"noodzakelijk is voor authenticatie of omwille van beveiligingsdoeleinden"* — and then only so far as necessary for a **substantial public interest** in lawful access to places, buildings, services, products, information systems or work-process systems. A fingerprint login added for convenience is not obviously inside that, and the AP's own art. 35(4) list puts biometric identification on the mandatory-DPIA list as well.
- **Art. 5 — consent below 16.** Where art. 8 GDPR does not apply and the data subject has not reached **sixteen**, the legal representative's consent is required instead of theirs. Art. 8 GDPR covers information-society services; art. 5 UAVG extends the same age to consent generally.
- **The DPO's secrecy duty.** A `functionaris voor gegevensbescherming` *"is verplicht tot geheimhouding van hetgeen hem op grond van een klacht of een verzoek van betrokkene is bekend geworden, tenzij de betrokkene in bekendmaking toestemt"* — bound to secrecy about what a complaint or a data subject's request tells them, unless that person consents. The parallel German provision is §6(5) BDSG.

The act's own header on 2026-11-11 warned of *"Wijziging(en) zonder datum inwerkingtreding"* — amendments passed with no commencement date yet. What they change is **[not researched]**, and it is the reason to refetch this before relying on it. Arts. 30 to 33's health and criminal-data exceptions, and arts. 41 onwards on limits to data subject rights, are **[not researched]** beyond what is quoted here.

## The AP's art. 35(4) list — 17 types, and the one that is broader than the Regulation

Source: [`Besluit lijst verwerkingen persoonsgegevens waarvoor een gegevensbeschermingseffectbeoordeling (DPIA) verplicht is`, `BWBR0042812`](https://wetten.overheid.nl/BWBR0042812/2019-11-27) · *primary — a published decision of the AP, in force since 2019-11-27 and with no later version* · **[checked 2026-11-11]**

[eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md) establishes that art. 35(4) GDPR obliges every supervisory authority to publish a list of processing requiring an impact assessment. The Dutch one is a formal `Besluit`, made *"gelet op artikel 35, vierde lid, in samenhang bezien met artikel 57, eerste lid, onder k"*, published in Staatscourant 2019 nr. 64418 and still the only version.

**How it is built.** Its preamble sets out the **nine criteria** from the Article 29 Working Party's WP 248 guidelines — evaluation or scoring; automated decision-making with legal or similar effect; systematic monitoring; sensitive or highly personal data; large-scale processing; matching or combining datasets; vulnerable data subjects; innovative use of new technological or organisational solutions; and processing that prevents people exercising a right or using a service — and then **tags every entry with the criteria it invokes**. The consistency mechanism under art. 35(6) was applied, and that is what added biometric data as a category.

The 17 types: heimelijk onderzoek; zwarte lijsten; fraudebestrijding; creditscores; financiële situatie; genetische gegevens; gezondheidsgegevens; samenwerkingsverbanden; cameratoezicht; flexibel cameratoezicht; controle werknemers; locatiegegevens; communicatiegegevens; internet of things; **profilering**; observatie en beïnvloeding van gedrag; biometrische gegevens.

**Almost every entry requires `grootschalig` or `stelselmatige monitoring`, and entry 15 does not.** Entry 15, `Profilering`, reads: *"Systematische en uitgebreide beoordeling van persoonlijke aspecten van natuurlijke personen gebaseerd op geautomatiseerde verwerking (profilering), zoals bijvoorbeeld beoordeling van beroepsprestaties, prestaties van leerlingen, economische situatie, gezondheid, persoonlijke voorkeuren of interesses, betrouwbaarheid of gedrag."*

Compare art. 35(3)(a) GDPR, which requires the same systematic and extensive evaluation **and** that decisions are based on it *"that produce legal effects concerning the natural person or similarly significantly affect"* them. **Entry 15 drops that second limb.** On the face of the Dutch list, an automated assessment of someone's preferences, interests, reliability or behaviour is a mandatory-DPIA case whether or not any decision with legal effect follows — which is the common shape of a lead-scoring or personalisation feature. Do not tell a Dutch founder the GDPR's "decisions with legal effect" qualifier gets them out of it.

Two other entries worth knowing: entry 1 requires a DPIA for an employer's **covert camera surveillance** of staff *"ook in incidentele gevallen"* — even in isolated cases — because of the unequal power relationship; and entry 2, black lists, is tied to art. 33(4)(c) UAVG.

**And what is not on the list: artificial intelligence.** There is no AI entry. The same AI-assisted customer-support pilot that is **on** the German list, as entry 11 of the DSK's list ([germany-data-protection.md](germany-data-protection.md)), is **not** named on the Dutch one. It can still require a DPIA — through criterion 8, innovative use of new technology, through entry 15 if it evaluates people, and through art. 35(1) itself — but in the Netherlands that is an argument to be made, where in Germany it is a list to be read. **This is the clearest example in any of these packs of why a national list is part of the test and not a convenience.**

### What the AP says about using it

Source: [AP — data protection impact assessment (DPIA)](https://www.autoriteitpersoonsgegevens.nl/en/themes/basic-gdpr/gdpr-in-practice/data-protection-impact-assessment-dpia) · *national supervisory authority* · **[checked 2026-11-11]**

- **The list is not exhaustive**, which the `Besluit` itself also says: a processing operation that is not on it may still be high-risk and need an assessment.
- **"Processing operations that take place ad hoc or incidentally are not systematic processing operations."** That is the AP's own test for `stelselmatig`, and it is the sentence that keeps a one-off from counting.
- **Two of the nine criteria is the AP's rule of thumb** for needing a DPIA.
- **Deciding not to do one is itself an accountable decision.** *"Even if you meet none or only one of these criteria, you must be able to substantiate properly why you choose not to carry out a DPIA. This is part of your duty of accountability."* Three sources in these packs now say the same thing in three languages — record the reason.
- **A DPIA is not a lawful basis.** If the processing is on the list you must still check you have one, and without it you may not process *"regardless of the outcomes of any DPIA"*.
- **One divergence to handle carefully.** The AP's page summarises the GDPR's own DPIA cases as **four**, splitting criminal-offence data into a case of its own and stating it **without a large-scale qualifier**. Art. 35(3)(b) GDPR, read in [eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md), has it as one point covering special categories **or** criminal data, *"processing on a large scale"*. The statute is the rule; the AP's reading is broader. Where they differ, say so rather than choosing.

**The AP has a draft art. 35(5) list, and it is written for this skill's reader.** On **2026-06-24** it published *"een lijst … van soorten verwerkingen waarvoor geen `data protection impact assessment` (DPIA) vereist is"* for consultation, saying in its own words that it covers processing *"door onder meer het mkb en zelfstandige ondernemers in Nederland"* and that *"de lijst vermindert zo de regeldruk voor deze bedrijven en ondernemers"*. The consultation closed on **2026-08-10**.

**It is not in force, and the AP sets out exactly what still has to happen:** the responses sharpen the list, the amended list goes to the **EDPB**, the final list is adopted after the EDPB's opinion, and it is then published in the **Staatscourant** and on the AP's site — *"[v]anaf dat moment is de lijst officieel geldig."* So on 2026-11-12 a Dutch founder cannot rely on it, and anyone who tells them a Dutch exemption list exists is describing a draft.

**What is on the draft list is [not researched], and that is a decision rather than an omission.** The consultation PDF stores its objects in object streams with subset fonts; this project's extractor returns garbage for it, and the rule in [sources-and-review.md](../sources-and-review.md) is that a quotation has to be read rather than reconstructed. The status above comes from the AP's own web page, which was read in full.

Source · [`AP vraagt reacties op lijst DPIA-uitzonderingen`](https://www.autoriteitpersoonsgegevens.nl/actueel/ap-vraagt-reacties-op-lijst-dpia-uitzonderingen) · *official authority, published 2026-06-24, page updated 2026-08-11* · **[checked 2026-11-12]**

France has published one, and it is the only art. 35(5) list any of these packs has read — see [france-data-protection.md](france-data-protection.md) for what a list of that kind actually contains.

## The AP's own step plan for a controller

Source: [AP — `Aan de slag! Stappenplan voor de verwerkingsverantwoordelijke`](https://autoriteitpersoonsgegevens.nl/uploads/imported/avg_stappenplan_verwerkingsverantwoordelijke.pdf) · *national authority, PDF extracted and read* · **[checked 2026-11-10]**

The most directly workable thing in either Dutch file: a founder can sit down and go through it. Twelve items in three steps.

**Step 1 — map what you process.** Where in your processes and systems; for what purpose (one file can serve several — a customer list is both contact and marketing); on what **lawful basis** for each purpose, and *if you cannot find one you may not process* — change the process or stop; **how long** you keep it, set in advance; whether anything goes **outside the EU**, checked first; and **who else receives it**, distinguishing processors from other controllers with their own purposes.

**Step 2 — put it in a register**, recording per processing: the purpose, the categories of people, the data, the recipients, the retention period, and the security measures. Keep it current.

**Step 3 — process carefully.** Ten items:

| | |
| --- | --- |
| Data quality | Keep it correct; check periodically |
| Inform people | An easy-to-find privacy statement. For consent, say in advance what the purpose is **and that consent can be withdrawn** |
| Security | Assess the risk your processing creates and match the security to it — **digital and physical**, including door control and locked storage |
| **Breach reporting** | Within 72 hours to the AP, at `datalekken.autoriteitpersoonsgegevens.nl`. Sometimes the people affected must be told too. **Have an action plan so everyone knows what to do** |
| Processor agreements | Check you have one with each processor; if not, conclude one as soon as possible |
| DPO | Only if you observe a large group or process special data of a large group — consistent with the art. 37(1) test in [eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md), and the `UAVG` adds nothing to it |
| **DPIA** | Required before developing a new service or product with personal data where the privacy risk is high. The AP's examples of high risk include **processing with new technologies** |
| Privacy policy | Not always mandatory, but advised: which rules staff follow, who decides on processing, who checks compliance |
| Privacy by design and default | Build in security, **pseudonymise** where you do not need the link to a person, use privacy-protective settings as standard — and **write these requirements into your request for quotation** when buying or commissioning systems |
| Handle data subject requests | Decide who receives, handles and answers them before the first one arrives |
| Train staff | So they can recognise personal data and know the main rules |
| Accountability | Be able to show with evidence how you comply: all processing (the register obligation), DPIA reports, and the rest |

**Two things worth lifting out.** The AP's high-risk examples for a DPIA explicitly include **processing with new technologies** — independent confirmation of the point in [eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md) that a founder routing real customer data through an AI tool is in DPIA territory. And the privacy-by-design item gives a concrete, cheap action most founders skip: **put the requirements in the quotation request**, before the system exists.

## When it goes wrong: the AP's five steps

Source: [AP — `Stappenplan: kom in actie bij een datalek`](https://autoriteitpersoonsgegevens.nl/uploads/imported/stappenplan_actie_datalek.pdf) · *national authority, PDF extracted and read* · **[checked 2026-11-10]**

1. **Get an overview.** Analyse immediately: what happened, how big, and is it leaked, destroyed or altered data? If leaked, find out **who had or may have had access to which personal data** — you need this for every later step.
2. **Limit the damage**, now, if anything can be done at all — its example is wiping a stolen laptop remotely. Estimate the risk at the same time.
3. **Decide whether to notify the AP**, and if so within **72 hours** of discovery. You must, *unless it is unlikely the breach presents a risk* to rights and freedoms. **If you do not yet have the full picture, file a first notification inside 72 hours and a follow-up later** — do not let fact-finding run the clock out.
4. **Decide whether to notify the people affected** — required where there is a **high** risk, and then as soon as possible.
5. **Register it in your `datalekregister`, even when you do not notify the AP.**

Then evaluate, to stop it happening again.

## Know the form's questions before the clock starts

Source: [AP — `Vragenlijst meldformulier datalekken`](https://www.autoriteitpersoonsgegevens.nl/documenten/vragenlijst-meldformulier-datalekken), `versie 1.1, augustus 2022` · *the AP's own list of the online form's questions, published so you can prepare* · **extracted and read [checked 2026-11-10]**. It carries a disclaimer: no rights can be derived from it and the AP may change it, so check the current version.

- **The online form is the only channel.** The AP states it accepts breach notifications **only** through it — not by post, not by email. So a founder with no account and no overview still has to go through the form.
- **What the AP expects you to have ready:** a contact person for its questions; your `FG` contact if you have one; the correspondence recording discovery; your **processing register (art. 30)** and your **breach register (art. 33(5))**; the measures you took to end the breach, the measures to prevent recurrence, and the measures that were *already* in place beforehand; and your DPIA if there is one. Add the investigation report for a hacking or malware incident, the processor agreement if a third party is involved, and the text you sent to data subjects if you had to inform them. **This is the real argument for the register: at 3 a.m. it is the only document that tells you who is affected.**
- **Hacking, malware or phishing: the AP expects an investigation**, and names what it must cover — was there access to the personal data, were they copied, viewed or sent on, and **are there logs that let you rule that out**. A founder with no logging cannot answer the third question, and therefore cannot rule anything out. That is a reason to turn logging on before anything happens, not a reason to guess afterwards.
- **Discovery is not the same as awareness, and the DPO is not a buffer.** The form asks for both dates. Awareness means the point at which **objective factors** made a breach probable. The AP says explicitly that the moment the incident reached the `FG` **cannot** be that point, because the `FG` does not carry the notification duty — and it will not accept that as a justification for a late filing. Filing later than 72 hours after awareness means answering an open question about **why**.
- **Provisional or definitive.** You mark the notification as one or the other. If you are still establishing the nature and scope, mark it provisional and the AP **asks for a follow-up within 4 weeks**; needing longer must be motivated. With no definitive notification you may not have (fully) met art. 33, and the AP may open a further investigation.
- **The breach register's minimum content**, per the same document: the facts — cause, what happened, which personal data — the consequences, and the measures taken to close the leak and prevent recurrence. Recording **why** you did or did not notify is *advised, not required*; do it anyway, because it is the reasoning you will be asked for.
- Two scope notes: the Dutch notification duty sits in **four** statutes — `AVG`, `Tw`, `Wjsg`, `Wpg` — and for an ordinary business it is the AVG. The form also asks whether you have told **other** regulators, so check whether a second duty applies to your sector.

**Open:** the brochure the controller step plan accompanies, the AP's example list of notifiable and non-notifiable breaches, and its ten tips on breach registration are **[not researched]**.

## The rest of the UAVG: health, criminal data, and the restrictions on rights

Source: [Uitvoeringswet AVG, arts. 30 to 43](https://wetten.overheid.nl/BWBR0040940) · *primary legislation, read on the official portal in the version `Geldend van 01-09-2026`* · **[checked 2026-11-12]**

Most of these articles are written for public bodies, schools, health providers and insurers. **Four of them reach a solo founder**, and one of those is a trap.

### Health data about an employee — art. 30, and the secrecy duty in art. 30(4)

Art. 30(1) disapplies the art. 9(1) prohibition for *"bestuursorganen, pensioenfondsen, **werkgevers** of instellingen die te hunnen behoeve werkzaam zijn"* — employers included — but only so far as necessary for **two purposes**: the proper implementation of statutory rules, pension schemes or collective agreements whose entitlements depend on the person's health, and *"de re-integratie of begeleiding van werknemers of uitkeringsgerechtigden in verband met ziekte of arbeidsongeschiktheid"*. Nothing wider. A founder logging *why* someone is ill is outside both.

**Art. 30(4) is the paragraph a one-person company will not expect.** Where any of paragraphs 1 to 3 is used, the data may be processed **only by people under a duty of secrecy** — by office, profession, statutory rule **or contract**. And then:

> Indien de verwerkingsverantwoordelijke persoonlijk gegevens verwerkt en op hem niet reeds uit hoofde van ambt, beroep of wettelijk voorschrift een geheimhoudingsplicht rust, is hij verplicht tot geheimhouding van de gegevens

A founder who is the controller and handles the data personally, and who has no professional secrecy duty of their own, **is placed under one by this article**. That is a statutory obligation attaching to the individual, not a policy they choose to write.

### Criminal-law data — art. 32

Art. 10 GDPR bars processing data on criminal convictions and offences without authority. Art. 32 UAVG supplies the Dutch authority, in **six grounds**, and only two of them are realistic for a pilot: *(a)* the person's **explicit consent** for one or more specified purposes, and *(d)* where processing is **necessary for establishing, exercising or defending a legal claim**. The others are vital interests, data the person has manifestly made public, substantial public interest, and research or statistics under art. 89(1).

**So a founder cannot screen a candidate or a counterparty for convictions on a general "legitimate interest" argument.** Art. 33 adds further grounds, and they are for bodies charged with applying criminal law and comparable public-law arrangements, not for a business.

### The restrictions on data subject rights — art. 41, and the contrast with Germany

Art. 23 GDPR lets a member state restrict arts. 12 to 22 and 34. **Germany and the Netherlands did it by opposite techniques**, and a founder operating in both should know which they are standing in:

| | Germany — §§32 to 35 BDSG | Netherlands — art. 41 UAVG |
| --- | --- | --- |
| Shape | **A carve-out per right.** Separate provisions for art. 13, art. 14, art. 15 and art. 17, each with its own cumulative conditions | **One general power.** The controller *"kan de verplichtingen en rechten, bedoeld in de artikelen 12 tot en met 21 en artikel 34 ... buiten toepassing laten"* |
| Test | Fit the facts into the named limb | *"voor zover zulks noodzakelijk en evenredig is"* to safeguard one of **ten** listed interests |
| Which limbs reach a private controller | Few, and narrow — prejudice to legal claims, backup-only data, a particular manner of storage | at least *(i)* **protecting the data subject or the rights and freedoms of others** and *(j)* **`de inning van civielrechtelijke vorderingen`**, the recovery of civil claims |
| What you must weigh | the statute states the conditions; the weighing is inside them | art. 41(2) gives **eight factors** to take into account, ending with *(h)* **the data subject's right to be told about the restriction, unless that would defeat its purpose** |
| Duty to record | explicit: §32(2), §33(2), §34(2) each require a written reason | **not stated in art. 41** — the accountability principle in art. 5(2) GDPR is what carries it |

**The practical difference is where the argument happens.** In Germany a refusal is right or wrong by the terms of a narrow provision. In the Netherlands it is right or wrong by a proportionality judgment the controller made and must be able to defend. Neither is more permissive in the abstract; the Dutch one simply puts more weight on the quality of the reasoning, and leaves the writing-down to art. 5(2) rather than demanding it.

### Not answering is worse than refusing — art. 35 UAVG

This is the operative one. Where a **non-public** controller decides on a request under arts. 15 to 22, the person can petition the **rechtbank** to order the controller to grant or refuse it. Three details:

- **Six weeks** from receiving the controller's answer, and
- *"Indien de verwerkingsverantwoordelijke niet binnen de in artikel 12, derde lid, van de verordening genoemde termijnen heeft geantwoord, is de indiening van het verzoekschrift niet aan een termijn gebonden"* — **if the controller did not answer within the art. 12(3) period, the petition is subject to no time limit at all**; and
- **no lawyer is required** to file it.

**So silence is the worst available option.** Answering badly starts a six-week clock; answering late or not at all leaves the claim open indefinitely and costs the claimant nothing to bring. A founder who cannot meet art. 12(3) should send the extension that art. 12(3) itself allows rather than let the date pass.

Art. 36 adds that the AP can resolve such a dispute, or a code of conduct's body can, and art. 42 disapplies art. 34 — telling the data subject about a breach — **for financial undertakings under the `Wet op het financieel toezicht`** and nobody else. Art. 43 disapplies most of the Regulation and nearly all of the UAVG for processing **solely for journalistic purposes or for academic, artistic or literary expression**; it is listed here only so that a founder running a blog alongside the business does not read that exemption as covering the business.

## Whether a breach has to be notified — the AP's own test

Source: [`Datalek: wel of niet melden`](https://autoriteitpersoonsgegevens.nl/themas/beveiliging/datalekken/datalek-wel-of-niet-melden) · *official authority, read in full* · **[checked 2026-11-12]**

Art. 33 GDPR sets the 72 hours and the *"unlikely to result in a risk"* threshold — see [eu-gdpr.md](eu-gdpr.md). **What the AP adds is how to decide**, and a founder deciding at speed needs the three parts below rather than the principle.

**Eight factors it names**, as the structure of the assessment: the nature of the breach; the **nature, sensitivity and amount** of the data; how easily people can be identified; the **severity of the consequences**; the characteristics of the **unauthorised recipient**; special characteristics of the person; special characteristics of **your organisation**; and the number of people affected.

**Three categories where it says to assume a high risk outright**: special-category data such as health; criminal-law data; and *"[i]nformatie over persoonlijke aspecten, bedoeld om profielen op te stellen of te gebruiken"* — profiling data, especially on work performance, economic situation, health, preferences or interests, reliability, behaviour and location. It adds credit-card data, **copies of identity documents**, and the **BSN combined with name and address**. And a warning a founder will under-rate: a telephone number and an email address can look harmless and are exactly what a targeted phishing attack needs.

### The encryption exception, and its three conditions

The familiar line is that encrypted data need not be notified. The AP states it with **three cumulative conditions**, and the second and third are the ones that fail in practice:

1. the data are **still completely intact**;
2. you **still have full control** over them — *"u beschikt over een recente back-up"*; and
3. the key used for the encryption or hashing **was not compromised in the breach**, and is not findable by unauthorised people with available technology.

So ransomware that encrypts data you cannot restore fails condition 1 and 2 at once: the point of the exception is that **the people whose data it is are no worse off**, not that something somewhere was encrypted.

### The "reliable recipient", and the trap at the end of it

Sending data to the wrong person is the commonest small-business breach. The AP accepts that a recipient who can **objectively** be established as reliable reduces or removes the severity, and names three categories: a **wrong colleague or department inside your own organisation**; a party you have a **business relationship** with, such as a regular supplier; and a party under a **statutory professional secrecy**, such as a GP.

**Then it closes the obvious workaround.** If an unknown recipient contacts you, returns the data or confirms deletion, **but is not in one of those three categories**, you may not treat them as reliable — *"[u] heeft daarom geen zekerheid over de ontvanger"*. Their good behaviour is not knowledge of them. A founder who emails a client list to a stranger and gets a polite reply has still had a notifiable breach unless something else saves it.

**Two closing rules from the same page.** If the breach need not be notified to the AP, it need **not** be communicated to the people affected either. And where the assessment is genuinely balanced, the AP's advice is to **notify**: *"dan kunt het beste het zekere voor het onzekere nemen"*.

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| The UAVG sets no national DPO threshold, nothing on the register, and no different fine ceiling | 2026-11-11 | Primary — the act read; `functionaris` occurs twice and neither is a duty to designate |
| Art. 14(3) UAVG: the AP may fine up to the art. 83(4)–(6) amounts | 2026-11-11 | Primary — read and quoted |
| Art. 40 UAVG excludes profiling-based automated decisions from its exception, and gives three concrete measures for private controllers | 2026-11-11 | Primary — read and quoted |
| Art. 29 UAVG: biometrics for authentication or security, limited to a substantial public interest in lawful access | 2026-11-11 | Primary — read and quoted |
| Art. 5 UAVG: sixteen, and beyond art. 8 GDPR's information-society services | 2026-11-11 | Primary — read |
| The DPO's secrecy duty about complaints and data subject requests | 2026-11-11 | Primary — read and quoted |
| The act has amendments with no commencement date as at 2026-11-11 | 2026-11-11 | Primary — the act's own header; what they change is open |
| Art. 30(1): the employer limb covers only statutory/pension/collective entitlements and reintegration or support in sickness | 2026-11-12 | Primary — read and quoted |
| **Art. 30(4): a controller handling the data personally is placed under a secrecy duty by the article itself** | 2026-11-12 | Primary — read and quoted |
| Art. 32: six grounds for criminal-law data, of which explicit consent and legal claims are the realistic ones | 2026-11-12 | Primary — read |
| Art. 41(1): one general power to disapply arts. 12 to 21 and 34, on necessity and proportionality, for ten listed interests | 2026-11-12 | Primary — read and quoted |
| Art. 41(2): eight factors to weigh, ending with telling the person about the restriction | 2026-11-12 | Primary — read |
| The Dutch technique differs in shape from the German one | 2026-11-12 | Primary — both read; §§32 to 35 BDSG are in [germany-data-protection.md](germany-data-protection.md). The comparison is this pack's |
| **Art. 35(2): no time limit on the petition if the controller did not answer within art. 12(3)** | 2026-11-12 | Primary — read and quoted |
| Art. 35(4): no lawyer is required to file it | 2026-11-12 | Primary — read |
| Art. 42: art. 34 disapplied for financial undertakings under the Wft; art. 43 for journalistic, academic, artistic and literary purposes | 2026-11-12 | Primary — read |
| Arts. 30a, 30b, 31, 33(1), 34 and 36 to 39 UAVG | — | Open — read only as far as their headings. They address record transfers by care providers, public supervision, criminal-law bodies, administrative-law procedure, representation, suspensive effect and a secrecy duty |
| The Dutch art. 35(4) list is a formal `Besluit`, 17 types, built on the nine WP 248 criteria, in force since 2019-11-27 with no later version | 2026-11-11 | Primary — the `Besluit` read in full on wetten.overheid.nl |
| Entry 15, `Profilering`, omits art. 35(3)(a)'s legal-effects limb | 2026-11-11 | Primary — both texts read; the comparison is of wording |
| Entry 1 requires a DPIA for covert staff cameras even in isolated cases | 2026-11-11 | Primary — read and quoted |
| No AI entry on the Dutch list, where the German list has one | 2026-11-11 | Primary — both lists read in full |
| The AP's test for `stelselmatig`, its two-criteria rule of thumb, and that declining a DPIA must be substantiated | 2026-11-11 | Authority — the AP's own page read and quoted |
| The AP's page states the GDPR's DPIA cases as four, criminal data without a scale qualifier | 2026-11-11 | Authority — read; recorded as a divergence from art. 35(3)(b), not resolved |
| The AP consulted on a **draft** art. 35(5) list on 2026-06-24, aimed at the `mkb` and the self-employed; consultation closed 2026-08-10 | 2026-11-12 | Authority — the AP's own announcement read in full and quoted |
| It becomes valid only after an **EDPB opinion** and publication in the **Staatscourant** | 2026-11-12 | Authority — read and quoted |
| What is on the draft list | — | Open — the consultation PDF uses object streams and subset fonts, and this project does not reconstruct text it cannot read. Blocked by the format, not unexamined |
| AP: register, written processor agreement, 72-hour breach report | 2026-11-10 | Authority — AP pages read |
| AP controller stappenplan: 12 items in 3 steps, breach URL, DPIA high-risk examples | 2026-11-10 | Authority — AP PDF extracted and read |
| AP breach stappenplan: five steps, first notification plus follow-up | 2026-11-10 | Authority — AP PDF extracted and read |
| Online form is the only channel; what the AP expects you to have ready | 2026-11-10 | Authority — AP `Vragenlijst` v1.1 extracted and read |
| Hacking/malware: investigation expected, and logs as the test | 2026-11-10 | Authority — the same AP document |
| Discovery vs awareness; reaching the `FG` is not awareness | 2026-11-10 | Authority — the same AP document; its wording quoted |
| Follow-up notification requested within 4 weeks, longer must be motivated | 2026-11-10 | Authority — the same AP document |
| `Vragenlijst` is `versie 1.1, augustus 2022` and disclaims any rights | 2026-11-10 | Authority — the same AP document; recheck for a newer version |
| Notification duty sits in four statutes (AVG, Tw, Wjsg, Wpg) | 2026-11-10 | Authority — the same AP document; the three other statutes not examined |
| The AP's eight risk factors, and the three data categories it treats as high risk outright | 2026-11-12 | Authority — its current guidance page read in full |
| **The encryption exception has three cumulative conditions**, including a recent backup and an uncompromised key | 2026-11-12 | Authority — read and quoted |
| The "reliable recipient" doctrine, its three categories, and the rule that an unknown recipient's good behaviour does not qualify | 2026-11-12 | Authority — read and quoted |
| No notification to the AP means no communication to the people affected; in doubt, notify | 2026-11-12 | Authority — read |
| The 2019 example-list PDF, the parent brochure and the 10 registration tips | — | Open — the live guidance page was read instead, because it is current and the 2019 list is not. The three documents themselves are still unread |
| Registration, VAT, e-invoicing, agreements and ownership | — | Elsewhere — those are [netherlands.md](netherlands.md)'s sections 1 to 5 |

Next full recheck due: **2027-05-10**. Earlier if the UAVG's pending amendments commence, or if the AP issues a version 2 of its art. 35(4) list.

No independent Dutch legal reviewer has reviewed this annex.
