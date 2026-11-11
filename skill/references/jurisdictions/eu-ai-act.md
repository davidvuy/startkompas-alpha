# EU — AI Act

**This is a shared layer, not a country.** Regulation (EU) 2024/1689 applies across the Union, so it holds identically in the Belgium, Netherlands, Germany and France packs. National market-surveillance authorities differ; the obligations do not.

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

**But two uses within this skill's own territory sit higher.** Screening candidates is named as high risk, and credit scoring likewise. A founder whose pilot *is* a hiring or lending tool is not in the bottom tier, and that changes everything — treat it as outside this pack and route it to a specialist.

### Do not quote a count of the prohibitions

Art. 5(1) first subparagraph now runs **(a), (b), (ba), (bb), (c), (d), (e), (f), (g), (h)** — ten lettered points, where the 2024 text had eight. Summary pages carry counts that were right when written, so give a founder the article and not a number.

**Two of the ten are new and are not yet in application.** Art. 5(1)(ba) and (bb), added by the Omnibus, apply only from **2026-12-02** under art. 113(3)(a):

- **(ba)** placing on the market, putting into service or using an AI system that generates or manipulates realistic images, video, audio or similar material of an identifiable person's intimate parts, or of an identifiable person engaged in sexually explicit activities, **without that person's freely-given, specific, informed, unambiguous and explicit consent** for that generation or manipulation.
- **(bb)** the same for material or a performance within the meaning of art. 2(c) and (e) of Directive 2011/93/EU, except where a `without right` defence applies under national law.

**Art. 5(1a) is the part a founder shipping a generative feature needs**, because it decides when *supplying* such a system is itself prohibited. Placing on the market or putting into service is prohibited only where (i) that generation or manipulation **is the intended purpose** of the system, or (ii) the system's design, training, architecture, capabilities or user-facing functionality make it a **reasonably foreseeable and reproducible outcome, without requiring significant technical modification**, and the system lacks reasonable and adequate technical safety measures. Art. 5(1b) adds that manipulation which does not increase the exposure of depicted intimate parts or alter the nature of depicted sexually explicit activity is not manipulation for (ba).

So a founder adding image or voice generation to a product has a concrete, datable question to answer before 2026-12-02: whether their safety measures are adequate, in a regime where art. 5 carries the **highest** penalty tier — see §5.

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

**Open:** what the art. 16 provider obligations actually require is **[not researched]** — deliberately, because a founder reaching that point needs a specialist, not a pack entry.

## 3. What actually binds a deployer outside high risk

Two things, and only two: article 4 and parts of article 50. Both are in force.

### Article 4 — AI literacy, and it does bind a solo founder

Source: art. 4 of the consolidated text, **as replaced by Regulation (EU) 2026/1744** · *primary legislation* · **[checked 2026-11-11]**

> *"Providers and deployers of AI systems shall take measures to support the development of AI literacy of their staff and other persons dealing with the operation and use of AI systems on their behalf, taking into account their technical knowledge, experience, education and training and the context the AI systems are to be used in, and considering the persons or groups of persons on whom the AI systems are to be used. This obligation does not require providers or deployers to guarantee any specific level of AI literacy of any individual."* — art. 4(1)

It binds **deployers**, not just providers. Art. 4 is in Chapter I, so it applies from **2025-02-02** under art. 113(3)(a).

The last sentence is the whole of the proportionality, and it is in the statute rather than in anyone's reading of it: **no specific level for any individual is required**. The 2024 wording is gone — see §0.

**Two paragraphs the 2024 text did not have, and the first is directly useful.** Art. 4(2) obliges the Commission and the Member States to support providers and deployers, **in particular SMEs**, in meeting art. 4(1) — and obliges the Commission to **publish practical examples of how to comply** on the single information platform referred to in art. 62(3)(b). So there is an official answer to "what does this actually mean for me", and it is a better starting point than a vendor's compliance package. Art. 4(3): the Board shall adopt recommendations, taking account of European competence frameworks, including common objectives.

**Honest reading for a one-person business:** the obligation is real but proportionate and not prescriptive. "Staff and other persons dealing with the operation" is, for a solo founder, essentially themselves and anyone they bring in. There is no form to file and no certificate to obtain. Do not inflate it into a compliance project, and do not dismiss it as inapplicable — it is the one AI Act duty that reaches an ordinary small deployer.

**On whether it carries a fine, be precise.** Art. 4 is **not** among the provisions enumerated in art. 99(4), the 3% tier — that list names arts. 16, 22, 23, 24, 25(2) and (4), 26, the notified-body articles and art. 50. But art. 99(1) requires Member States to lay down penalties *"applicable to any infringement of this Regulation by operators"*, so "no fine attaches to art. 4" is not a safe statement either. What can be said: an art. 4 breach is not in the enumerated tier, and the national regime decides the rest. The national regimes are **[not researched]** — see §6.

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

## 4. Dates

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

**The AI literacy item is the one that actually reaches a small deployer.** It has been in force since 2025-02-02 — over a year and a half at this check date — and art. 4 is in §3.

## 5. Penalties

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

## 6. What this layer does not cover

- The **art. 16 provider obligations** for a high-risk system, and what becoming a provider costs. This is the heaviest open question here.
- Whether a founder's **marketing content** can amount to text `published to inform the public on matters of public interest` under art. 50(4). The limb reads as aimed at publishing, not business documents, but the boundary is **[not researched]**.
- **National market-surveillance authorities and the national penalty regimes** made under art. 99(1): **[not researched]**. The Union ceilings are in §5; what any Member State imposes is not.
- Art. 6 itself — the high-risk classification rules, including the art. 6(1a), (1b) and (1c) paragraphs added in 2026: **[not researched]**.
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
| Art. 99(1) as amended: national rules, and Member States must weigh SME economic viability | 2026-11-11 | Primary — consolidated article read |
| No further AI Act duties on a minimal-risk deployer | 2026-11-11 | Unconfirmed — art. 26 is limited to high-risk deployers by its own terms and Chapter III Sections 1–3 are deferred, but this is an argument from absence; the whole Regulation was not read |
| Marketing content as public-interest text under art. 50(4) | — | Open — not yet researched |
| The art. 16 provider obligations for a high-risk system | — | Open — deliberately; a founder who reaches that point needs a specialist, not a pack entry |
| National authorities and the national penalty regimes under art. 99(1) | — | Open — not yet researched |
| Art. 6 high-risk classification, incl. the 2026 paragraphs 1a, 1b and 1c | — | Open — not yet researched |
| Art. 4a, added in 2026: special-category processing for bias detection | — | Open — read in passing, not worked through |

Next full recheck due: **2027-05-10**. Earlier before **2026-12-02**, when the two new art. 5 prohibitions begin to apply, and before 2027-12-02, when high-risk obligations reach Annex III systems. Also on any further amending regulation — the Omnibus shows the Act is being amended, so check EUR-Lex for a newer consolidated date before trusting this file.

No independent reviewer has reviewed this layer, and no part of it is a determination that any system is or is not in scope.
