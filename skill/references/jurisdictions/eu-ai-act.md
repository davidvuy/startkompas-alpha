# EU — AI Act

**This is a shared layer, not a country.** Regulation (EU) 2024/1689 applies across the Union, so it holds identically in the Belgium, Netherlands, Germany and France packs. National market-surveillance authorities differ; the obligations do not.

**This layer is preparation, not advice.** It records what the Commission's framework page and the articles themselves state, with dates. Whether a specific system or use is in scope is a legal question for a qualified reviewer.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[not researched]** means no source was consulted.

Read it because **every founder using this skill is using an AI system**, which makes "does this apply to me" a live question rather than a theoretical one.

---

## 1. The four risk tiers

Source: [European Commission — regulatory framework for AI](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) · *official EU source* · **[checked 2026-11-10]**

| Tier | What it covers |
| --- | --- |
| **Unacceptable risk** | Nine prohibited practices, including harmful manipulation, social scoring and non-consensual intimate imagery |
| **High risk** | Systems affecting safety, health or fundamental rights — the page names employment screening, credit scoring and biometric identification |
| **Transparency risk** | Systems where disclosure is required so people know what they are dealing with |
| **Minimal or no risk** | **The vast majority of current EU AI applications**, with no specific rules |

That last row is the one that matters here. A founder drafting an offer with an assistant, or using one to summarize their own notes, is in the bottom tier on the Commission's own description.

**But two uses within this skill's own territory sit higher.** Screening candidates is named as high risk, and credit scoring likewise. A founder whose pilot *is* a hiring or lending tool is not in the bottom tier, and that changes everything — treat it as outside this pack and route it to a specialist.

## 2. Provider or deployer

The Act distinguishes the party that **develops and places a system on the market** (provider) from the party that **uses it and ensures human oversight** (deployer).

A founder using a commercial assistant is a **deployer**, not a provider.

### When a deployer becomes a provider — article 25

Source: [Article 25, AI Act](https://artificialintelligenceact.eu/article/25/) · *structured per-article reproduction* · **[checked 2026-11-10]**

A distributor, importer or **deployer** is treated as the provider of a **high-risk** system in three cases:

1. They **put their own name or trademark** on a high-risk system already placed on the market or put into service.
2. They make a **substantial modification** after it was placed on the market, such that it affects compliance or changes the intended purpose, and it **remains high-risk** under art. 6.
3. They **modify the intended purpose** of a general-purpose AI system that was not classified as high-risk, in a way that **turns it into** a high-risk system under art. 6.

When that happens, the original provider **stops being the provider**, and must cooperate by supplying technical documentation, disclosing limitations and granting testing access — **unless** it had explicitly specified that the system must not be modified into a high-risk one.

**The boundary that matters for a founder.** All three triggers require the system to **be or become high-risk**. White-labelling a general assistant for an ordinary, minimal-risk business purpose does not make a founder a provider under art. 25.

But white-labelling it for a purpose the Act treats as high-risk does — and §1 names two that sit squarely in this skill's territory: **employment screening and credit scoring**. A founder who wraps a model in their own brand and sells it as a CV-screening tool has, on the face of art. 25, become the **provider** of a high-risk system, with the full provider obligations that follow. That is a different business, not a feature.

Note the escape hatch in the last clause: a provider can contractually specify that its system must not be modified into a high-risk one. Read your vendor's terms — if they say that, the modification is a breach of contract as well as a regulatory step.

**Open:** what the full provider obligations for a high-risk system actually are is **[not researched]** — deliberately, because a founder reaching that point needs a specialist, not a pack entry.

## 3. What actually binds a deployer outside high risk

Two things, and only two: article 4 and parts of article 50. Both are already in force.

### Article 4 — AI literacy, and it does bind a solo founder

Source: [Article 4, AI Act](https://artificialintelligenceact.eu/article/4/) · *structured per-article reproduction; the authoritative text is Regulation (EU) 2024/1689* · **[checked 2026-11-10]**

> *"Providers and deployers of AI systems shall take measures to support the development of AI literacy of their staff and other persons dealing with the operation and use of AI systems on their behalf."*

It binds **deployers**, not just providers, and applies from **2025-02-02**. Measures are to be taken *to their best extent*, taking account of technical knowledge, experience, education, training and the context of use. It does not guarantee any specific level for any individual.

**Honest reading for a one-person business:** the obligation is real but proportionate and not prescriptive. "Staff and other persons dealing with the operation" is, for a solo founder, essentially themselves and anyone they bring in. There is no form to file and no certificate to obtain. Do not inflate it into a compliance project, and do not dismiss it as inapplicable — it is the one AI Act duty that reaches an ordinary small deployer.

### Article 50 — transparency, in three specific situations

Source: [Article 50, AI Act](https://artificialintelligenceact.eu/article/50/) · *same host and caveat* · **[checked 2026-11-10]**

Deployer duties, as distinct from the provider duties in the same article:

| Situation | Duty | Exception |
| --- | --- | --- |
| **Emotion recognition** or **biometric categorisation** | Inform the natural persons exposed to it, and process personal data in line with the GDPR | Lawful use to detect, prevent or investigate criminal offences, with safeguards |
| **Deep fakes** — artificially generated or manipulated image, audio or video | Disclose that the content is artificially generated or manipulated | Lawful criminal-investigation use. For artistic, creative, satirical or fictional work, disclosure is limited to noting that manipulated content exists, without spoiling the work |
| **AI-generated text published to inform the public on matters of public interest** | Disclose that it was artificially generated or manipulated | Lawful criminal use, **or** where the content underwent human review and someone holds editorial responsibility |

Timing: the information must be given *"in a clear and distinguishable manner at the latest at the time of the first interaction or exposure."*

**What this means for a founder's ordinary work.** Drafting an offer, a pilot brief or a client deliverable with an assistant is **not** "text published to inform the public on matters of public interest" — that limb is aimed at journalism and public-information publishing, not business documents. So the text-disclosure duty generally does not reach a founder's deliverables.

Two places it could: **marketing content** that makes public-interest claims is arguable, and the **deep-fake** limb applies to image, audio or video regardless of subject matter — a generated product image or a synthetic voice-over is in scope on its face.

The providers' side of article 50 is also worth knowing, because it explains what the founder's *tools* must do: inform people they are interacting with an AI system unless obvious from context, and mark synthetic output in a machine-readable way. That is the vendor's obligation, not the founder's.

### And beyond those two?

The Act's risk-based approach confines detailed rules to higher-risk systems, so a deployer of a minimal-risk system has no further AI Act obligations beyond articles 4 and 50. **But that is the AI Act only** — the GDPR applies in full and independently, and other Union law is untouched. Never read "minimal risk under the AI Act" as "no rules apply".

## 4. Dates

| Date | What applies |
| --- | --- |
| 2024-08-01 | Entry into force |
| **2025-02-02** | Prohibited practices, **and AI literacy** |
| 2025-08-02 | General-purpose AI governance and obligations |
| **2026-08-02** | General applicability |
| 2027-12-02 | High-risk systems in sensitive areas |
| 2028-08-02 | High-risk systems in regulated products |

Two of these are already behind us at this pack's check date, and **general applicability arrived on 2026-08-02** — so "the AI Act is coming" is no longer the right framing.

**The AI literacy item is the one that actually reaches a small deployer**, since the Commission page lists it from 2025-02-02 alongside the prohibitions rather than among high-risk duties. Article 4 itself is in §3 — it binds deployers, and it has been in force for over a year and a half at this pack's check date.

## 5. What this layer does not cover

- When a founder building on a model **becomes a provider**, and what follows. This is the heaviest open question here.
- Whether a founder's **marketing content** can amount to text `published to inform the public on matters of public interest` under art. 50. The limb reads as aimed at publishing, not business documents, but the boundary is **[not researched]**.
- National market-surveillance authorities and penalties: **[not researched]**.
- The interaction with the GDPR, which is a separate instrument — see [eu-gdpr.md](eu-gdpr.md). Using an AI tool on personal data engages both.

## Pack maintenance

| Claim | Check date | Status |
| --- | --- | --- |
| Four risk tiers; most applications minimal risk | 2026-11-10 | Official EU source read |
| Employment screening and credit scoring named as high risk | 2026-11-10 | Official EU source read |
| Provider versus deployer distinction | 2026-11-10 | Official EU source read |
| Phased application dates | 2026-11-10 | Official EU source read |
| Art. 4 AI literacy: binds deployers, from 2025-02-02 | 2026-11-10 | **Article text read and quoted** |
| Art. 50 deployer transparency: three situations and their exceptions | 2026-11-10 | **Article text read** |
| No further AI Act duties on a minimal-risk deployer | 2026-11-10 | Follows from the risk-based approach; not a provision read |
| Marketing content as public-interest text under art. 50 | — | Not researched |
| Art. 25: three triggers by which a deployer becomes a provider — all require high risk | 2026-11-10 | **Article text read** |
| The full provider obligations for a high-risk system | — | Not researched, deliberately — that founder needs a specialist |
| National authorities and penalties | — | Not researched |

Next full recheck due: **2027-05-10**. Earlier before 2027-12-02, when high-risk obligations reach sensitive areas.

No independent reviewer has reviewed this layer, and no part of it is a determination that any system is or is not in scope.
