# EU — AI Act

**This is a shared layer, not a country.** Regulation (EU) 2024/1689 applies across the Union, so it holds identically in the Belgium, Netherlands, Germany and France packs. The Regulation's own obligations hold identically. **What each member state adds does not** — art. 99(1) leaves the penalties to national law and art. 70 leaves the supervisor to national designation, and §7 shows the three states read so far sitting in three different conditions. So the authority differs, the price of breaching a duty differs, and in one of the three there is no authority designated at all.

**This layer is preparation, not advice.** It records what the articles themselves state, with dates. Whether a specific system or use is in scope is a legal question for a qualified reviewer.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

Read it because **every founder using this skill is using an AI system**, which makes "does this apply to me" a live question rather than a theoretical one.

---

## 0. The Act has been amended, and most summaries of it have not

Source: [Regulation (EU) 2026/1744 of 8 July 2026](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32026R1744) · *primary legislation, as published* · **[checked 2026-11-11]**

Regulation (EU) 2026/1744, the **Digital Omnibus on AI**, amends Regulation (EU) 2024/1689 in 88 places. Its amendments apply from **2026-07-27**. Among them it **replaces article 4**, rewrites **article 113's application dates**, adds **two prohibited practices** to article 5, amends **article 25(2) and (4)**, and adds **article 99(6a)**.

Everything below is read from the **consolidated text**:

Source: [Regulation (EU) 2024/1689, consolidated as at 2026-07-27](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02024R1689-20260727) · *primary legislation as consolidated; the authoritative texts are the OJ versions of 2024/1689 and 2026/1744* · **[checked 2026-11-11]**

**This is the trap to avoid when rechecking this layer.** The 2024 text is still what most per-article reproductions, summaries and training data contain, and on article 4 the difference is substantive: the 2024 wording required measures to *"ensure, to their best extent, a sufficient level of"* AI literacy, and the wording in force requires measures to *"support the development of"* it. Anything citing "to their best extent" is quoting law that was replaced. **Read the consolidated text or the amending regulation, not a reproduction**, and check the reproduction's own date before trusting it.

## 1. The four risk tiers

Source: [European Commission — regulatory framework for AI](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) · *official EU source* · **[checked 2026-11-10]**

| Tier | What it covers |
| --- | --- |
| **Unacceptable risk** | The prohibited practices of art. 5 — set out below |
| **High risk** | Systems affecting safety, health or fundamental rights — the Commission page names employment screening, credit scoring and biometric identification |
| **Transparency risk** | Systems where disclosure is required so people know what they are dealing with |
| **Minimal or no risk** | **The vast majority of current EU AI applications**, with no specific rules |

That last row is the one that matters here. A founder drafting an offer with an assistant, or using one to summarize their own notes, is in the bottom tier on the Commission's own description.

**But two uses within this skill's own territory sit higher.** Screening candidates is named as high risk, and credit scoring likewise. A founder whose pilot *is* a hiring or lending tool is not in the bottom tier, and that changes everything. **§3 below gives the statutory basis** — Annex III names both — and §2 gives the twelve obligations that follow. Read those before concluding anything, and then route the founder to a specialist: the pack can tell them they are in it and roughly what it costs, not how to get out.

### Do not quote a count of the prohibitions

Art. 5(1) first subparagraph now runs **(a), (b), (ba), (bb), (c), (d), (e), (f), (g), (h)** — ten lettered points, where the 2024 text had eight. Summary pages carry counts that were right when written, so give a founder the article and not a number.

**Two of the ten are new and are not yet in application.** Art. 5(1)(ba) and (bb), added by the Omnibus, apply only from **2026-12-02** under art. 113(3)(a):

- **(ba)** placing on the market, putting into service or using an AI system that generates or manipulates realistic images, video, audio or similar material of an identifiable person's intimate parts, or of an identifiable person engaged in sexually explicit activities, **without that person's freely-given, specific, informed, unambiguous and explicit consent** for that generation or manipulation.
- **(bb)** the same for material or a performance within the meaning of art. 2(c) and (e) of Directive 2011/93/EU, except where a `without right` defence applies under national law.

**Art. 5(1a) is the part a founder shipping a generative feature needs**, because it decides when *supplying* such a system is itself prohibited. Placing on the market or putting into service is prohibited only where (i) that generation or manipulation **is the intended purpose** of the system, or (ii) the system's design, training, architecture, capabilities or user-facing functionality make it a **reasonably foreseeable and reproducible outcome, without requiring significant technical modification**, and the system lacks reasonable and adequate technical safety measures. Art. 5(1b) adds that manipulation which does not increase the exposure of depicted intimate parts or alter the nature of depicted sexually explicit activity is not manipulation for (ba).

So a founder adding image or voice generation to a product has a concrete, datable question to answer before 2026-12-02: whether their safety measures are adequate, in a regime where art. 5 carries the **highest** penalty tier — see §6.

## 2. Provider or deployer

Source: art. 3(3) and 3(4) of the consolidated text · *primary legislation* · **[checked 2026-11-11]**

> *"'provider' means a natural or legal person ... that develops an AI system or a general-purpose AI model or that has an AI system or a general-purpose AI model developed and places it on the market or puts the AI system into service under its own name or trademark, whether for payment or free of charge"* — art. 3(3)

> *"'deployer' means a natural or legal person ... using an AI system under its authority except where the AI system is used in the course of a personal non-professional activity"* — art. 3(4)

**A founder using a commercial assistant for their business is a deployer.** The exception in art. 3(4) is for personal non-professional use, so professional use is squarely inside the definition — a founder cannot be outside it by being small.

**And "provider" does not depend on risk tier.** Art. 3(3) catches anyone who *develops* an AI system, or has one developed and places it on the market under their own name. A founder who ships an AI product is a provider of it whatever the tier; what the tier decides is how much that status costs them. Art. 25, next, is about something narrower — becoming the provider of someone **else's** system.

### When a deployer becomes the provider of another's system — article 25

Source: art. 25 of the consolidated text · *primary legislation; paras 2 and 4 as amended in 2026* · **[checked 2026-11-11]**

A distributor, importer, **deployer** or other third party is treated as the provider of a **high-risk** system, and becomes subject to the provider obligations of **art. 16**, in three cases:

1. They **put their name or trademark** on a high-risk system already placed on the market or put into service — *"without prejudice to contractual arrangements stipulating that the obligations are otherwise allocated"*.
2. They make a **substantial modification** to a high-risk system already on the market such that it **remains** high-risk under art. 6.
3. They **modify the intended purpose** of a system, including a general-purpose one, not classified as high-risk, such that it **becomes** high-risk under art. 6.

Art. 25(2): when that happens the initial provider **stops being the provider** of that system, and must cooperate closely — making available technical documentation sufficient to assess compliance with art. 16, informing the new provider of **known limitations and failure modes**, and providing targeted technical access including for testing and validation. That duty **does not apply** where the initial provider clearly specified that its system is not to be changed into a high-risk one.

**The boundary that matters for a founder.** All three triggers require the system to **be or become high-risk**. White-labelling a general assistant for an ordinary, minimal-risk purpose does not engage art. 25 — though under art. 3(3) above it may make the founder a provider in their own right.

White-labelling it for a purpose the Act treats as high-risk does engage art. 25, and §1 names two that sit squarely in this skill's territory: **employment screening and credit scoring**. A founder who wraps a model in their own brand and sells it as a CV-screening tool has, on the face of art. 25(1)(a), become the provider of a high-risk system. That is a different business, not a feature.

Two contract points follow directly from the article, and both are worth raising while an agreement is still being drafted:

- **Trigger 1 can be reallocated by contract**, on the face of art. 25(1)(a). Trigger 2 and trigger 3 carry no such clause.
- **The vendor's terms may already exclude you.** If they clearly specify that the system is not to be modified into a high-risk one, the art. 25(2) cooperation duty falls away — so a founder who modifies it anyway has neither the documentation nor a contractual leg to stand on.

**Art. 25(4), amended in 2026, has an open-source carve-out worth knowing.** A provider of a high-risk system and a third party supplying a model, tools, services, components or processes integrated into it must specify by **written agreement** the information, capabilities and technical access needed for compliance. That duty **does not apply** to third parties making tools, services, processes or components available to the public under a **free and open-source licence**, other than general-purpose AI models. So integrating an OSS component imposes no written-agreement duty on its maintainer — and leaves the integrating provider to meet art. 16 without it.

### What article 16 actually requires of a high-risk provider

Source: [Article 16, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02024R1689-20260727) · *the authoritative text* · **[checked 2026-11-11]**

This layer left art. 16 open on the ground that a founder reaching it needs a specialist. That is still true, and it is **not** a reason to leave them unable to see the size of the step. Twelve obligations, each pointing somewhere else in the Regulation:

| | A provider of a high-risk AI system shall | Where the work is |
| --- | --- | --- |
| (a) | ensure the system complies with the Section 2 requirements | arts. 8 to 15 |
| (b) | put its name, trade name or trade mark and a contact address on the system, its packaging or its documentation | — |
| (c) | **have a quality management system in place** | art. 17 |
| (d) | keep the technical documentation | art. 18 |
| (e) | keep the automatically generated logs, where under its control | art. 19 |
| (f) | **put the system through a conformity assessment before placing it on the market** | art. 43 |
| (g) | draw up an EU declaration of conformity | art. 47 |
| (h) | **affix the CE marking** | art. 48 |
| (i) | register | art. 49(1) |
| (j) | take corrective action and provide information | art. 20 |
| (k) | demonstrate conformity on a national authority's reasoned request | — |
| (l) | meet the accessibility requirements of Directives (EU) 2016/2102 and (EU) 2019/882 | — |

**Points (c), (f) and (h) are the answer to "how bad is it".** A quality management system, a conformity assessment and a CE marking are product-regulation machinery, on the model of a medical device or a machine — not a policy document and a privacy notice. Telling a founder that becoming a high-risk provider is a documentation exercise is the misreading this table exists to prevent.

**Arts. 8 to 15 are now read, in [eu-ai-act-high-risk.md](eu-ai-act-high-risk.md).** At this point the question is still a specialist engagement, and saying so before a founder has built the thing remains the useful service. What the annex adds is **what that engagement will be working on**, so the size of it can be judged — and two provisions written for a small provider specifically: **art. 11 lets an SME file simplified technical documentation on a Commission form that notified bodies must accept**, and **art. 15 names the attack classes** the system has to resist. **Open:** arts. 17, 18 and 43 — quality management, documentation keeping and conformity assessment — are still **[not researched]**.

## 3. Is it high-risk? Article 6, and the 2026 carve-out

Source: [Article 6 and Annex III, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02024R1689-20260727) · *the authoritative text* · **[checked 2026-11-11]**

Everything above turns on whether a system is high-risk, and this layer left art. 6 open until 2026-11-11. There are **two independent routes in**, and the Omnibus amendment rewrote the first one.

### Route one — a safety component of a regulated product, article 6(1)

Both conditions must hold: the system is intended to be used as a **safety component** of a product covered by the Union harmonisation legislation in Annex I, or is itself such a product; **and** that product must undergo a **third-party conformity assessment** under that legislation.

**Three paragraphs added in 2026 narrow this considerably, and they are the most founder-relevant thing in the article.** Art. 6(1a):

> *"AI systems that are solely used for non-safety related aspects of user assistance, performance optimisation, service efficiency, automation or convenience or quality control shall not qualify as safety components."*

`User assistance`, `service efficiency`, `convenience` — that is the description of most software a founder builds. Art. 3(14) defines a `safety component` as one *“which fulfils a safety function for that product or AI system, or the failure or malfunctioning of which endangers the health and safety of persons or property”* — two limbs. **Paragraph 1a cuts into the first limb** by naming uses that cannot count as a safety function, and **paragraph 1b preserves the second** almost word for word. So the carve-out is about what you claim the feature does, not about what happens when it breaks. Two limits on the carve-out: art. 6(1b) puts back anything *"the failure or malfunctioning of which would endanger health and safety"*, and art. 6(1c) says a product that needs third-party assessment **only** for non-health-and-safety reasons — its example is radio spectrum or electromagnetic interference — does not satisfy condition (b) at all.

Anything citing art. 6(1) without these three paragraphs is describing the 2024 text. See §0.

### Route two — Annex III, article 6(2), and the derogation that profiling cancels

Art. 6(2): the systems listed in Annex III are high-risk. Five of its eight areas can plausibly describe something a founder builds, and two of them routinely do:

| Annex III area | What it names, in the parts a founder could build |
| --- | --- |
| 1. Biometrics | remote biometric identification; biometric categorisation by sensitive or protected attributes; **emotion recognition**. Expressly *not* biometric verification whose sole purpose is confirming someone is who they claim to be |
| 3. Education and vocational training | determining access or admission; **evaluating learning outcomes**, including to steer the learning process; assessing the level of education someone will receive; **detecting prohibited behaviour during tests** |
| **4. Employment, workers' management and access to self-employment** | **recruitment or selection — "in particular to place targeted job advertisements, to analyse and filter job applications, and to evaluate candidates"**; and decisions on terms, promotion or termination, task allocation based on behaviour or traits, and **monitoring or evaluating performance and behaviour** |
| **5. Essential private and public services** | **evaluating creditworthiness or establishing a credit score** — "with the exception of AI systems used for the purpose of detecting financial fraud"; risk assessment and pricing for life and health insurance; emergency-call triage |
| 2. Critical infrastructure | safety components in critical digital infrastructure, road traffic, water, gas, heating or electricity |

Areas 6, 7 and 8 — law enforcement, migration and border control, and the administration of justice and democratic processes — are outside anything this skill supports.

**An HR screening tool is the clearest case in the whole Regulation.** Annex III point 4(a) names analysing and filtering job applications and evaluating candidates. [france-data-protection.md](france-data-protection.md) records that the CNIL also puts recruitment by selection algorithm on its mandatory impact-assessment list, and [germany-data-protection.md](germany-data-protection.md) that the German list catches AI evaluating people. **The same product is high-risk under this Regulation and a listed DPIA under two national data-protection lists.** A founder who builds it is not in "use AI carefully" territory; they are in the art. 16 table above.

**Art. 6(3) offers a way out, and it is narrower than it looks.** An Annex III system is not high-risk where it *"does not pose a significant risk of harm to the health, safety or fundamental rights of natural persons, including by not materially influencing the outcome of decision making"* **and** one of four conditions applies: the system performs a **narrow procedural task**; it **improves the result of a previously completed human activity**; it detects decision-making patterns or deviations and is **not meant to replace or influence** the earlier human assessment without proper human review; or it performs a **preparatory task** to a relevant assessment.

Then the sting:

> *"Notwithstanding the first subparagraph, an AI system referred to in Annex III shall always be considered to be high-risk where the AI system performs profiling of natural persons."*

**Profiling cancels the derogation outright.** Whatever the four conditions say, an Annex III system that profiles people is high-risk. And profiling is the thing these products do.

**Using the derogation is not free either.** Art. 6(4): a provider who considers an Annex III system not high-risk *"shall document its assessment before that system is placed on the market or put into service"*, is subject to the **registration obligation in art. 49(2)**, and must hand the documentation to national authorities on request. So the escape route is itself a documented, registered decision — which is the same shape as the impact-assessment decisions in [eu-gdpr-dpo-dpia.md](eu-gdpr-dpo-dpia.md): a reasoned "no" on the record, not silence.

### The art. 6(5) guidelines exist, and they are still a draft

Source: [the Commission's policy page for the guidelines](https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-high-risk-systems) · *the Commission's own page, last updated 2026-10-19* · **[checked 2026-11-13]**

Art. 6(5) required the Commission to publish, by **2026-02-02**, guidelines on the practical implementation of this article *"together with a comprehensive list of practical examples of use cases of AI systems that are high-risk and not high-risk"*. **It has published them as a draft and has not adopted them.**

What the page establishes, and each half matters:

- **They are draft.** *"The Commission has developed draft guidelines making use of the feedback obtained through a public consultation"*, and a further targeted consultation ran **until 2026-07-23**, with feedback *"going to be incorporated in the final version of the guidelines before adoption by the Commission"*. As at the page's own last update, 2026-10-19, adoption had not happened.
- **They are not binding, and they decide enforcement anyway.** *"Though not legally binding, they reflect the Commission's interpretation and will guide enforcement."* That is the sentence to repeat to a founder: a draft guideline is not law and is still the best available prediction of how the Commission will read art. 6.
- **The examples are explicitly not exhaustive.** *"A list of examples strives to cover all areas and use cases, but they are not to be considered as exhaustive and may be updated over time."* So finding your use case absent from the list is not a finding that it is outside Annex III.
- **They live on the [AI Act Single Information Platform](https://ai-act-service-desk.ec.europa.eu/en)**, which also carries Annex I and Annex III in browsable form, alongside an **AI Act Service Desk**. **Point a founder there** — it is the Commission's own self-assessment surface, and it is the one place in this whole file a founder can check their own case without reading a Regulation.

**The same page corroborates the amended art. 113 dates from outside the Regulation, and names which areas.** Rules for systems used in high-risk areas — the page lists *"biometrics, critical infrastructure, education, employment, migration, asylum and border control"* — apply from **2027-12-02**, and for systems integrated into products such as robotics and industrial machinery from **2028-08-02**. Those are the two rows §5 takes from art. 113 as amended, now confirmed by a third official source. The page attributes the timeline to *"the political agreement on the 'AI Omnibus'"*.

**Annex I, the harmonisation legislation behind route one, is still [not researched]** — though the Single Information Platform serves it, so it is now a fetch rather than a search.

### What other guidelines exist, and which a small provider is waiting for

Source: [the AI Office's own overview of the guidelines](https://digital-strategy.ec.europa.eu/en/news/supporting-implementation-ai-act-clear-guidelines) · *the Commission's news page, last updated 2026-07-31* · **[checked 2026-11-13]**

**Published** as at that date: the high-risk classification guidelines above; the **transparency** guidelines for providers and deployers of certain systems; a **template for reporting serious incidents** by providers of high-risk systems; and guidelines on the practical application of the high-risk requirements.

**Still being worked on**, and the list is worth knowing because each gap is a question a founder cannot yet get an official answer to: the practical application of provider and deployer obligations; a **template for the fundamental rights impact assessment**; responsibilities along the **AI value chain**; **substantial modification**; a voluntary template for **post-market monitoring**; the AI Act's interplay with other EU law, including joint Commission–EDPB guidelines on the AI Act and data protection; and — the one that matters most here — **guidelines on the elements of the quality management system which SMEs and SMCs may comply with in a simplified manner**.

**That last item is not the art. 11 documentation form**, which is a different simplification: art. 11 promises SMEs a simplified **Annex IV technical documentation** form, and this is art. 17's **quality management system**. Both are promised, neither is published, and a small provider in an Annex III area is therefore expected to meet arts. 11 and 17 without the simplified instruments the Regulation itself holds out. Say that plainly rather than implying a lighter regime exists.

### Article 4a — special-category data for bias detection is a permission, not a duty

Art. 4a, added in 2026, lets providers of high-risk systems *"exceptionally"* process special categories of personal data to the extent strictly necessary for bias detection and correction under art. 10(2)(f) and (g), subject to six cumulative conditions: no other data including synthetic or anonymised data would do; technical limits on re-use plus state-of-the-art security and pseudonymisation; access strictly controlled and documented; **no transmission to or access by other parties**; deletion once the bias is corrected or the retention period ends, whichever is first; and — the cross-layer point — **the art. 30 GDPR record of processing must state why the special-category processing was strictly necessary and why other data would not have achieved it.** That is a concrete entry for the register described in [eu-gdpr.md](eu-gdpr.md) §3, created by a different instrument.

Art. 4a(2) extends the same permission, on the same conditions, to providers and deployers of **other** AI systems and models and to deployers of high-risk ones, where the processing is strictly necessary against biases likely to affect health and safety, harm fundamental rights or lead to discrimination prohibited by Union law. So an ordinary deployer is inside this article.

And its last sentence is the one to read twice:

> *"This paragraph does not create any obligation to conduct such bias detection and correction."*

A founder should not be told the AI Act requires them to bias-test their tool on special-category data. It permits it, narrowly, if they choose to.

## 4. What actually binds a deployer outside high risk

Two things, and only two: article 4 and parts of article 50. Both are in force.

### Article 4 — AI literacy, and it does bind a solo founder

Source: art. 4 of the consolidated text, **as replaced by Regulation (EU) 2026/1744** · *primary legislation* · **[checked 2026-11-11]**

> *"Providers and deployers of AI systems shall take measures to support the development of AI literacy of their staff and other persons dealing with the operation and use of AI systems on their behalf, taking into account their technical knowledge, experience, education and training and the context the AI systems are to be used in, and considering the persons or groups of persons on whom the AI systems are to be used. This obligation does not require providers or deployers to guarantee any specific level of AI literacy of any individual."* — art. 4(1)

It binds **deployers**, not just providers. Art. 4 is in Chapter I, so it applies from **2025-02-02** under art. 113(3)(a).

The last sentence is the whole of the proportionality, and it is in the statute rather than in anyone's reading of it: **no specific level for any individual is required**. The 2024 wording is gone — see §0.

**Two paragraphs the 2024 text did not have, and the first is directly useful.** Art. 4(2) obliges the Commission and the Member States to support providers and deployers, **in particular SMEs**, in meeting art. 4(1) — and obliges the Commission to **publish practical examples of how to comply** on the single information platform referred to in art. 62(3)(b). So there is an official answer to "what does this actually mean for me", and it is a better starting point than a vendor's compliance package. Art. 4(3): the Board shall adopt recommendations, taking account of European competence frameworks, including common objectives.

**Honest reading for a one-person business:** the obligation is real but proportionate and not prescriptive. "Staff and other persons dealing with the operation" is, for a solo founder, essentially themselves and anyone they bring in. There is no form to file and no certificate to obtain. Do not inflate it into a compliance project, and do not dismiss it as inapplicable — it is the one AI Act duty that reaches an ordinary small deployer.

**On whether it carries a fine, be precise.** Art. 4 is **not** among the provisions enumerated in art. 99(4), the 3% tier — that list names arts. 16, 22, 23, 24, 25(2) and (4), 26, the notified-body articles and art. 50. But art. 99(1) requires Member States to lay down penalties *"applicable to any infringement of this Regulation by operators"*, so "no fine attaches to art. 4" is not a safe statement either. What can be said: an art. 4 breach is not in the enumerated tier, and the national regime decides the rest. The national regimes are read for Germany in §7 and **[not researched]** elsewhere — see §8.

### Article 50 — transparency, in three specific situations

Source: art. 50(3) to (6) of the consolidated text · *primary legislation* · **[checked 2026-11-11]**

Deployer duties, as distinct from the provider duties in the same article:

| Situation | Duty | Exception |
| --- | --- | --- |
| **Emotion recognition** or **biometric categorisation** — art. 50(3) | Inform the natural persons exposed to it of the operation of the system, and process personal data in line with the GDPR | Systems permitted by law to detect, prevent or investigate criminal offences, with safeguards |
| **Deep fakes** — art. 50(4) first subparagraph: image, audio or video content constituting a deep fake | Disclose that the content has been artificially generated or manipulated | Use authorised by law for criminal-law purposes. For an **evidently** artistic, creative, satirical, fictional or analogous work, disclosure is limited to noting that such content exists, in a manner that does not hamper display or enjoyment |
| **AI-generated text published to inform the public on matters of public interest** — art. 50(4) second subparagraph | Disclose that the text has been artificially generated or manipulated | Criminal-law purposes, **or** where the content underwent human review or editorial control **and** a person holds editorial responsibility for the publication |

**Timing and form, art. 50(5):** the information must be given *"in a clear and distinguishable manner at the latest at the time of the first interaction or exposure"* — and it *"shall conform to the applicable accessibility requirements"*. A disclosure nobody can perceive is not a disclosure.

**"Deep fake" is a defined term, and the definition narrows the duty.** Art. 3(60): *"AI-generated or manipulated image, audio or video content that **resembles existing** persons, objects, places, entities or events and would **falsely appear to a person to be authentic or truthful**"*.

Both halves have to hold. So a generated image of a product that does not exist, or an obviously stylised illustration, is not a deep fake on that definition, while a generated photograph of a real product in a real place, or a synthetic voice of a real person, is. Do not tell a founder that every generated asset needs a disclosure, and do not tell them none does — apply the two limbs of art. 3(60) to the asset in front of you.

**What this means for a founder's ordinary work.** Drafting an offer, a pilot brief or a client deliverable with an assistant is **not** "text published to inform the public on matters of public interest" — that limb is aimed at journalism and public-information publishing, not business documents. So the text-disclosure duty generally does not reach a founder's deliverables.

Where it could: **marketing content** that makes public-interest claims is arguable, and the **deep-fake** limb applies to image, audio or video regardless of subject matter, subject to art. 3(60).

The providers' side of art. 50 is also worth knowing, because it explains what the founder's *tools* must do: inform people they are interacting with an AI system unless obvious from context, and mark synthetic output in a machine-readable way. That is the vendor's obligation, not the founder's. Art. 50(7), amended in 2026, has the Commission facilitating codes of practice on detection, marking and labelling, and allows it to adopt an implementing act specifying common rules if a code is inadequate — so the marking obligations a founder's vendor is held to may be specified further.

### And beyond those two?

Art. 26, the deployer obligations, is by its own terms limited to **deployers of high-risk AI systems**, and art. 113(3)(c) defers the whole of Chapter III Sections 1 to 3 to 2027-12-02 or 2028-08-02. On the articles read for this layer, a deployer of a minimal-risk system has no further AI Act obligations beyond arts. 4 and 50. That remains an argument from what is absent, not a provision that says so — the whole Regulation was not read.

**And it is the AI Act only.** Art. 50(6) says expressly that arts. 50(1) to (4) are *"without prejudice to other transparency obligations laid down in Union or national law"*. The GDPR applies in full and independently — see [eu-gdpr.md](eu-gdpr.md). Never read "minimal risk under the AI Act" as "no rules apply".

## 5. Dates

Source: art. 113 of the consolidated text, **as amended by Regulation (EU) 2026/1744** · *primary legislation* · **[checked 2026-11-11]**

| Date | What applies |
| --- | --- |
| 2024-08-01 | Entry into force — the twentieth day after publication |
| **2025-02-02** | Chapters I and II: the definitions, **art. 4 AI literacy**, and the art. 5 prohibitions as they then stood |
| 2025-08-02 | Chapter III Section 4, Chapters V, VII and XII, and art. 78 — except art. 101 |
| **2026-07-27** | The Omnibus amendments, and arts. 102 to 110 under the new art. 113(3)(d) |
| **2026-08-02** | General application |
| **2026-12-02** | Art. 5(1) points **(ba)** and **(bb)** and art. 5(1a) and (1b) — the two new prohibitions |
| 2027-12-02 | Chapter III Sections 1 to 3, except art. 6(5), for systems high-risk under **art. 6(2) and Annex III** |
| 2028-08-02 | The same, for systems high-risk under **art. 6(1) and Annex I** |

**General application arrived on 2026-08-02**, so "the AI Act is coming" is no longer the right framing for anything except the three future rows.

**The nearest date is 2026-12-02**, and it is the only row that can newly prohibit something a founder is already doing. The two high-risk rows were moved out by the Omnibus — 2027-12-02 and 2028-08-02 are the amended dates, and the original art. 113(3)(c) said 2027-08-02 for Annex I, so a summary written before July 2026 has this wrong in both directions.

**The AI literacy item is the one that actually reaches a small deployer.** It has been in force since 2025-02-02 — over a year and a half at this check date — and art. 4 is in §4.

## 6. Penalties

Source: art. 99 of the consolidated text, **paras 1 and 6a as amended in 2026** · *primary legislation* · **[checked 2026-11-11]**

| Infringement | Ceiling |
| --- | --- |
| The **art. 5** prohibitions — art. 99(3) | €35,000,000 or **7%** of total worldwide annual turnover for the preceding financial year, **whichever is higher** |
| The enumerated operator duties — art. 99(4): arts. 16, 22, 23, 24, **25(2) and (4)**, **26**, the notified-body articles, and **art. 50** | €15,000,000 or **3%**, whichever is higher |
| Supplying incorrect, incomplete or misleading information to a notified body or national authority — art. 99(5) | €7,500,000 or **1%**, whichever is higher |

**And then art. 99(6) inverts all three for this skill's entire audience:**

> *"In the case of SMEs, including start-ups, each fine referred to in this Article shall be up to the percentages or amount referred to in paragraphs 3, 4 and 5, whichever thereof is lower."*

For a solo founder the percentage is far below the cash figure, so the operative ceiling is **7%, 3% or 1% of turnover** — not €35m, €15m or €7.5m. Quoting the headline figures to a founder is not just alarming, it is wrong for them. Art. 99(6a) extends the same inversion to small mid-caps for paras 4 and 5.

Art. 99(1), as amended, leaves the rules themselves to national law — which may include warnings and non-monetary measures — and requires Member States to *"take into account the interests of SMEs, including start-ups, and SMCs, and their economic viability when imposing penalties"*. **So the ceilings above are the Union's limits, not a national tariff.**

## 7. National regimes — and they are in three different conditions

Art. 99(1) leaves the rules to national law and art. 70 leaves the supervisor to national designation, so there is a national layer and it does not look the same anywhere. **[eu-ai-act-national.md](eu-ai-act-national.md) holds it**, because reading three regimes into this file would put it over the per-reference budget.

The short version, as at 2026-11-12: **Germany has settled it** — the Bundesnetzagentur by statute since 2026-07-29, plus German offences of its own at up to €50,000, including one for failing to explain a high-risk decision to the person it was about. **The Netherlands has a bill**, consulted from 2026-04-20 to 2026-06-01 and not in force, which would give ten existing authorities a domain each and make the AP the fallback and the supervisor for work-related high-risk systems. **Belgium has designated nobody**, and says so itself: *"De implementatie van het governancekader in België is momenteel lopende"*, on a FOD Economie page updated 2026-09-03, thirteen months after the deadline that page quotes. **France is blocked**, not unexamined.

**None of which suspends anything.** The Regulation binds without a national act, so the absence of a supervisor is not the absence of a duty — it is the absence of someone to ask.

## 8. What this layer does not cover

- **Arts. 17, 18 and 43** — quality management, documentation keeping and conformity assessment. The other articles art. 16 points at, **arts. 8 to 15**, are read in [eu-ai-act-high-risk.md](eu-ai-act-high-risk.md).
- Whether a founder's **marketing content** can amount to text `published to inform the public on matters of public interest` under art. 50(4). The limb reads as aimed at publishing, not business documents, but the boundary is **[not researched]**.
- **National market-surveillance authorities and the national penalty regimes** made under art. 99(1): read for **Germany** in §7, **[not researched]** for Belgium, the Netherlands and France. The Union ceilings are in §6; what any Member State imposes is not.
- The **contents** of the art. 6(5) draft guidelines and their example list: the draft's existence and status are now established (§3), but the examples themselves are **[not researched]**. They are on the Single Information Platform, so this is a fetch away.
- Annex I, the Union harmonisation legislation behind art. 6(1): **[not researched]**.
- Arts. 8 to 15, 17, 18 and 43 — what a high-risk provider's obligations contain: **[not researched]**, deliberately; §2 gives the shape and says why the detail is a specialist engagement.
- The interaction with the GDPR, which is a separate instrument — see [eu-gdpr.md](eu-gdpr.md). Using an AI tool on personal data engages both. Art. 4a, added in 2026, permits processing special categories of personal data for bias detection under strict conditions, and was **[not researched]**.

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| Regulation (EU) 2026/1744 of 2026-07-08 (Digital Omnibus on AI) amends 2024/1689 in 88 places, applying from 2026-07-27 | 2026-11-11 | Primary — the amending regulation and the EUR-Lex amendment list read |
| Four risk tiers; most applications minimal risk | 2026-11-10 | Authority — European Commission page read |
| Employment screening and credit scoring named as high risk | 2026-11-10 | Authority — European Commission page read |
| Art. 5(1) now has ten lettered points, where the 2024 text had eight | 2026-11-11 | Primary — consolidated art. 5(1) read and the points counted |
| Art. 5(1)(ba) and (bb) and art. 5(1a)/(1b): the two new prohibitions, their consent wording and the intended-purpose / reasonably-foreseeable test | 2026-11-11 | Primary — consolidated statute read and quoted |
| **Corrected on 2026-11-11:** this layer said art. 4 requires measures *to their best extent* | 2026-11-11 | Withdrawn — that is the 2024 wording, replaced by Regulation (EU) 2026/1744. The quotation itself was already the current text; the sentence describing it was not |
| Art. 4(1) in force: *support the development of*, and no specific level required of any individual | 2026-11-11 | Primary — consolidated statute read and quoted |
| Art. 4(2): the Commission must publish practical compliance examples on the art. 62(3)(b) platform, and support SMEs in particular; art. 4(3) Board recommendations | 2026-11-11 | Primary — consolidated statute read |
| Art. 4 is not among the art. 99(4) enumerated infringements, but art. 99(1) covers any infringement | 2026-11-11 | Primary — both articles read; the conclusion is stated as a limit, not as "no fine" |
| Art. 3(3) provider and art. 3(4) deployer, incl. the personal-non-professional exception | 2026-11-11 | Primary — definitions read and quoted |
| Provider status does not depend on risk tier; art. 25 is about another party's system | 2026-11-11 | Primary — art. 3(3) and art. 25(1) read together |
| Art. 25: three triggers, all requiring high risk; obligations are those of art. 16 | 2026-11-11 | Primary — consolidated article read and quoted, replacing a per-article reproduction |
| Art. 25(1)(a) is *without prejudice to contractual arrangements*; triggers 2 and 3 are not | 2026-11-11 | Primary — consolidated article read |
| Art. 25(2) as amended: initial provider ceases to be provider, must cooperate, unless it specified no high-risk modification | 2026-11-11 | Primary — consolidated article read |
| Art. 25(4) as amended: written agreement with component suppliers, with a free-and-open-source carve-out other than GPAI models | 2026-11-11 | Primary — consolidated article read |
| Art. 50(3)–(6) deployer transparency: three situations, their exceptions, the first-interaction timing and the accessibility requirement | 2026-11-11 | Primary — consolidated article read and quoted, replacing a per-article reproduction |
| Art. 3(60) `deep fake`: must resemble something existing **and** falsely appear authentic | 2026-11-11 | Primary — definition read and quoted. This narrows what this layer previously called in scope "on its face" |
| Art. 50(7) as amended: codes of practice on marking, with an implementing act if inadequate | 2026-11-11 | Primary — consolidated article read |
| Art. 113 as amended: all eight dates, incl. 2026-12-02 for the new prohibitions and 2026-07-27 for arts. 102–110 | 2026-11-11 | Primary — consolidated article read and quoted against the 2024 original |
| Art. 99(3)/(4)/(5) ceilings, and **art. 99(6)**: for SMEs including start-ups the **lower** of the two applies | 2026-11-11 | Primary — consolidated article read and quoted |
| The national layer: Germany's KI-MIG, the Dutch bill, and Belgium having designated nobody | — | Elsewhere — read on 2026-11-11 and 2026-11-12 and maintained in [eu-ai-act-national.md](eu-ai-act-national.md) |
| Art. 99(1) as amended: national rules, and Member States must weigh SME economic viability | 2026-11-11 | Primary — consolidated article read |
| No further AI Act duties on a minimal-risk deployer | 2026-11-11 | Unconfirmed — art. 26 is limited to high-risk deployers by its own terms and Chapter III Sections 1–3 are deferred, but this is an argument from absence; the whole Regulation was not read |
| Marketing content as public-interest text under art. 50(4) | — | Open — not yet researched |
| Art. 16's twelve obligations, including a quality management system, a conformity assessment and CE marking | 2026-11-11 | Primary — read and tabulated; what each referenced article contains is still open, deliberately |
| Art. 6(1) two cumulative conditions, and the 2026 paragraphs 1a, 1b and 1c | 2026-11-11 | Primary — read and quoted; 1a excludes user assistance, service efficiency and convenience from being safety components |
| Annex III areas 1 to 5, including recruitment and candidate evaluation by name | 2026-11-11 | Primary — read; areas 6 to 8 are outside this skill's scope and were read only far enough to say so |
| Art. 6(3) derogation, its four conditions, and that profiling always cancels it | 2026-11-11 | Primary — read and quoted |
| Art. 6(4): using the derogation requires a documented assessment and art. 49(2) registration | 2026-11-11 | Primary — read |
| Art. 4a: special-category processing for bias detection is a permission with six conditions, and creates no duty to bias-test | 2026-11-11 | Primary — read and quoted, both paragraphs |
| The art. 6(5) guidelines exist as a **draft**, not adopted; consultation closed 2026-07-23; not binding but *"will guide enforcement"*; examples explicitly non-exhaustive | 2026-11-13 | Authority — the Commission's own policy page read, last updated 2026-10-19. **Closed the pack's own first-recheck row.** The eval run's lead that a draft existed is confirmed; its date of 2026-05-19 is **not** — the page gives no publication date |
| The AI Act **Single Information Platform** and **Service Desk** host the guidelines, Annex I and Annex III | 2026-11-13 | Authority — the platform opened and Annex III point 4 read there, matching the EUR-Lex text already recorded above |
| The 2027-12-02 and 2028-08-02 dates, corroborated outside the Regulation, with the areas named | 2026-11-13 | Authority — the same policy page. A third official source agreeing with art. 113 as amended |
| Published guidelines as at 2026-07-31, and the eight sets still being worked on | 2026-11-13 | Authority — the AI Office's own overview read |
| **The art. 17 simplified quality-management-system guidelines for SMEs are not published**, and are a different instrument from the art. 11 documentation form | 2026-11-13 | Authority — named in the overview's "still working on" list. Both simplifications are promised and neither exists |
| The contents of the draft art. 6(5) examples | — | Open — the draft's status is settled, its examples are not read. On the Single Information Platform |
| Arts. 8 to 15: the requirements a high-risk system must satisfy | — | Elsewhere — read on 2026-11-12 and maintained in [eu-ai-act-high-risk.md](eu-ai-act-high-risk.md) |
| Annex I; arts. 17, 18 and 43 | — | Open — not researched |
| National authorities and the national penalty regimes under art. 99(1) | — | Open — not yet researched |
| Art. 4a, added in 2026: special-category processing for bias detection | — | Open — read in passing, not worked through |

Next full recheck due: **2027-05-10**. Earlier before **2026-12-02**, when the two new art. 5 prohibitions begin to apply, and before 2027-12-02, when high-risk obligations reach Annex III systems. Also on any further amending regulation — the Omnibus shows the Act is being amended, so check EUR-Lex for a newer consolidated date before trusting this file.

No independent reviewer has reviewed this layer, and no part of it is a determination that any system is or is not in scope.
