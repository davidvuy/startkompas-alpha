# EU — AI Act, what a high-risk system must satisfy (annex)

**This is an annex to [eu-ai-act.md](eu-ai-act.md) §2, not a pack of its own.** The layer lists art. 16's twelve provider obligations and says the articles behind them were the heaviest open question in it. These are those articles — **arts. 8 to 15**, the requirements themselves — read from the text consolidated at **2026-07-27**.

**Read this only after §3 of the layer says the system is high-risk.** Nothing here applies to a minimal-risk pilot, and reading it first will make an ordinary product look impossible.

**What it is for.** A founder who turns out to be a **provider** of a high-risk system needs specialist help; the layer says so and this annex does not change that. What it adds is **what the help will be working on**, so the founder can judge the size of the thing before committing — and so they can recognise the two provisions below that were written for them specifically.

**This annex is preparation, not advice.** It records what the articles themselves state, with dates. Whether a particular system meets any of them is an engineering and legal judgment, and a provider of a high-risk system needs a qualified reviewer for it.

**Two things here are easy to miss and matter most to a small provider:**

- **Art. 11 lets an SME file simplified technical documentation**, on a Commission form that notified bodies must accept. That is a concession aimed at start-ups, added by the 2026 amendments.
- **Art. 15 names the attack classes** a high-risk system must be resilient to — data poisoning, model poisoning, adversarial examples, confidentiality attacks, model flaws. A security review that does not mention them is not addressing this article.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

Source for every article below: [Regulation (EU) 2024/1689, consolidated at 2026-07-27](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02024R1689-20260727) · *primary legislation, each article read in full on EUR-Lex* · **[checked 2026-11-12]**

---

## The eight articles, and what each actually demands

| Article | What it requires | The part a founder will not expect |
| --- | --- | --- |
| **8** Compliance | Meet this Section's requirements, judged against the **intended purpose** and *"the generally acknowledged state of the art"* | The art. 9 risk management system is **taken into account when judging compliance with the others** — it is the spine, not one item among eight |
| **9** Risk management | A system *"established, implemented, documented and maintained"*, as **a continuous iterative process planned and run throughout the entire lifecycle**, with regular systematic review and updating | It covers **reasonably foreseeable misuse**, not only intended use — and only risks that can be *"reasonably mitigated or eliminated"* by design or by technical information |
| **10** Data and data governance | Training, validation and testing sets must meet eight named governance practices and be relevant, sufficiently representative and *"to the best extent possible, free of errors and complete"* | Since the 2026 amendments, a system that **does not train a model** has paras 2 to 4 applied **only to its testing data sets** |
| **11** Technical documentation | Drawn up **before** the system is placed on the market, kept up to date, containing at minimum **Annex IV** | **SMEs including start-ups may give Annex IV in simplified form**, on a Commission form, and *"[n]otified bodies shall accept the form"* |
| **12** Record-keeping | The system must **technically allow automatic logging of events over its lifetime** | The logs must support three specific things, one of which is detecting a **substantial modification** — so the logging design depends on knowing what would count as one |
| **13** Transparency to deployers | Operation transparent enough that a deployer can interpret the output, plus **instructions for use** with at least six classes of content | The instructions must state **computational and hardware resources, expected lifetime, and maintenance including software updates** — product-management facts, not legal boilerplate |
| **14** Human oversight | Designed so natural persons can effectively oversee it in use, through measures **built in by the provider** or specified for the deployer, or both | The overseer must be able to **decide not to use it, override or reverse the output**, and **stop the system** — and must be kept aware of **automation bias** |
| **15** Accuracy, robustness, cybersecurity | An appropriate level of each, performing consistently across the lifecycle | **Accuracy levels and metrics are declared in the instructions for use** — a number you publish, not one you keep |

## Article 9 in more detail, because it governs the others

The four steps in art. 9(2) are: **identify and analyse** the known and reasonably foreseeable risks to health, safety or fundamental rights in intended use; **estimate and evaluate** the risks in intended use **and under reasonably foreseeable misuse**; **evaluate other risks** from the post-market monitoring data under art. 72; and **adopt appropriate and targeted measures** for the risks identified.

**There is an order to the measures, and it is not a menu.** Art. 9(5) requires, in sequence: elimination or reduction *"in as far as technically feasible through adequate design and development"*; then, where appropriate, mitigation and control for what cannot be eliminated; then the information required by art. 13 and, where appropriate, **training for deployers**. Documentation is the last resort, not the first.

**The standard is acceptable residual risk** — per hazard and overall. And in choosing measures, the provider must give due consideration to *"the technical knowledge, experience, education, the training to be expected by the deployer, and the presumable context in which the system is intended to be used."* A tool for untrained users carries more of the burden in its design.

**Testing is specified, not implied.** Art. 9(6) to (8): test to identify the most appropriate measures; testing may include real-world testing under art. 60; and testing happens at any time during development and **in any event before the system is placed on the market or put into service**, *"against prior defined metrics and probabilistic thresholds that are appropriate to the intended purpose"*. Metrics defined **in advance** — which is a documentation discipline as much as an engineering one.

**And one group is named.** Art. 9(9): providers must consider whether the system is likely to have an adverse impact on **persons under the age of 18** and, as appropriate, other vulnerable groups.

## Article 10, and the bias work it actually asks for

The eight governance practices in art. 10(2) run from design choices and the **origin of the data** — including, for personal data, *"the original purpose of the data collection"* — through annotation, labelling, cleaning, updating, enrichment and aggregation, the assumptions made, and an assessment of availability, quantity and suitability. Then two that do the work:

- **(f)** examination for **possible biases** likely to affect health and safety, harm fundamental rights or lead to discrimination prohibited under Union law, *"especially where data outputs influence inputs for future operations"*; and
- **(g)** appropriate measures to **detect, prevent and mitigate** the biases found under (f).

Art. 10(3) adds the quality standard, and art. 10(4) requires the sets to reflect the **geographical, contextual, behavioural or functional setting** the system is meant for. A CV screening tool trained on one country's labour market and sold into another is squarely in that sentence.

**Art. 4a(1) is cited alongside** these paragraphs — the layer's §3 covers it: processing special-category data for bias detection is a **permission, not a duty**.

## Article 13, and why its list is a product document

The instructions for use must contain at least: the provider's identity and contact details; the system's characteristics, capabilities and **limitations**, including its intended purpose, the **level of accuracy with its metrics**, robustness and cybersecurity it was tested against, and any known circumstance that may affect them; known or foreseeable circumstances that may create risks in intended use or reasonably foreseeable misuse; where applicable the technical means to **explain its output**; where appropriate its performance **on specific persons or groups**; specifications for input data; pre-determined changes to the system agreed at conformity assessment; the **human oversight measures** under art. 14; the computational and hardware resources, expected lifetime and maintenance; and how deployers can collect, store and interpret the **logs** under art. 12.

**Read that list as a specification for a document you will have to write anyway**, and most of it is knowledge the team already has and has never written down.

## Articles 14 and 15, where the design decisions live

**Art. 14** requires the oversight to be *"commensurate with the risks, level of autonomy and context of use"*, delivered by measures built into the system, measures for the deployer to implement, or both. The person overseeing must be enabled — *"as appropriate and proportionate"* — to understand the system's capacities and limits and monitor it for anomalies; to **stay aware of automation bias**, *"in particular for high-risk AI systems used to provide information or recommendations for decisions to be taken by natural persons"*, which is exactly what a screening or scoring tool is; to interpret the output correctly; **to decide not to use it, or to disregard, override or reverse its output**; and to intervene or **stop it** *"through a 'stop' button or a similar procedure that allows the system to come to a halt in a safe state."*

**Art. 14(5)** adds a rule for **Annex III point 1(a)** — remote biometric identification: no action or decision may be taken on an identification *"unless that identification has been separately verified and confirmed by at least two natural persons with the necessary competence, training and authority"*, except where Union or national law considers that disproportionate for law enforcement, migration, border control or asylum.

**Art. 15** names three things a founder's security work must cover beyond ordinary practice:

- **Feedback loops.** A system that *"continue[s] to learn after being placed on the market"* must be built to eliminate or reduce *"the risk of possibly biased outputs influencing input for future operations"*, with mitigation where such loops exist.
- **Redundancy.** Robustness *"may be achieved through technical redundancy solutions, which may include backup or fail-safe plans."*
- **The named attack classes.** Resilience against unauthorised third parties altering use, outputs or performance, with technical solutions addressing, where appropriate, **data poisoning** of the training set, **model poisoning** of pre-trained components, **adversarial examples or model evasion**, **confidentiality attacks** and **model flaws**.

---

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| Art. 8: compliance judged against intended purpose and the state of the art, with art. 9 taken into account | 2026-11-12 | Primary — read |
| Art. 9(2): four steps, covering reasonably foreseeable misuse and post-market data | 2026-11-12 | Primary — read |
| Art. 9(5): measures in order — design, then mitigation, then information and deployer training; acceptable residual risk | 2026-11-12 | Primary — read and quoted |
| Art. 9(6) to (8): testing before placing on the market, against **prior defined** metrics and probabilistic thresholds | 2026-11-12 | Primary — read and quoted |
| Art. 9(9): adverse impact on persons **under 18** and other vulnerable groups must be considered | 2026-11-12 | Primary — read |
| Art. 10(2): eight governance practices, including bias examination (f) and mitigation (g) | 2026-11-12 | Primary — read and quoted |
| Art. 10(3) and (4): representative, as far as possible error-free, and matched to the setting of use | 2026-11-12 | Primary — read and quoted |
| **Art. 10(6), added in 2026: a system that trains no model has paras 2 to 4 applied only to its testing data sets** | 2026-11-12 | Primary — read in the consolidated text, marked ▼M1 |
| Art. 11: documentation before placing on the market, Annex IV as the minimum | 2026-11-12 | Primary — read |
| **Art. 11, added in 2026: SMEs including start-ups may use a simplified Commission form, which notified bodies must accept** | 2026-11-12 | Primary — read and quoted, marked ▼M1. Whether the Commission has published the form is **[not researched]** |
| Art. 12: automatic logging over the lifetime, supporting art. 79(1) risk, substantial modification, art. 72 and art. 26(5) | 2026-11-12 | Primary — read |
| Art. 13(3): the twelve classes of content the instructions for use must carry | 2026-11-12 | Primary — read; the count is of the article's own lettered and numbered points |
| Art. 14(4): understand, stay aware of **automation bias**, interpret, override, and stop in a safe state | 2026-11-12 | Primary — read and quoted |
| Art. 14(5): two-person verification for Annex III point 1(a), with a law-enforcement exception | 2026-11-12 | Primary — read |
| Art. 15(3): accuracy levels and metrics **declared in the instructions for use** | 2026-11-12 | Primary — read |
| Art. 15(4): feedback loops in systems that keep learning; redundancy, backup or fail-safe | 2026-11-12 | Primary — read and quoted |
| **Art. 15(5): data poisoning, model poisoning, adversarial examples or model evasion, confidentiality attacks, model flaws** | 2026-11-12 | Primary — read and quoted; the statute names them |
| Whether the Commission's simplified technical documentation form exists yet | — | Open — art. 11 requires it. **Not in the AI Office's own list of published guidelines** as at 2026-07-31, which lists eight sets still being worked on and names the art. 17 simplified **quality management system** for SMEs among them — a different instrument. So neither simplification the Regulation holds out to an SME exists, and the eval run's lead is corroborated as far as an absence can be. See [eu-ai-act.md](eu-ai-act.md) §3 |
| Annex IV's own contents, and Annex I | — | Open — not researched. Annex IV is the minimum content art. 11 points at, so this annex names it without reproducing it |
| Arts. 17, 18 and 43 — quality management, documentation keeping, conformity assessment | — | Open — named in art. 16's list in [eu-ai-act.md](eu-ai-act.md) §2 and not yet read |
| The risk tiers, art. 6, the dates, penalties and the national layer | — | Elsewhere — maintained in [eu-ai-act.md](eu-ai-act.md) and [eu-ai-act-national.md](eu-ai-act-national.md) |

Next full recheck due: **2027-05-12**. Earlier on any further amending regulation, or when the Commission publishes the simplified documentation form.

No independent legal reviewer has reviewed this annex.
