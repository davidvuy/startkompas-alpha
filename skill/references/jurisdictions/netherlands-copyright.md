# Netherlands — copyright in commissioned work (annex)

**This is an annex to [netherlands.md](netherlands.md) §5, not a pack of its own.** It exists because the Dutch pack went over this skill's 48 KB per-reference budget. §5 of the pack keeps the pair that decides whether the founder owns the work at all — art. 7 `Auteurswet` and art. 7:400 BW, which define each other. **Everything that decides what happens to the work afterwards is here:** who is presumed the maker when a client publishes it, what a client can actually acquire and in what form, and which rights a contract may and may not take away from a program's lawful acquirer.

**This annex is preparation, not advice.** It records what the Dutch statute and the Software Directive state, with dates. The most consequential thing in it is a **silence** in the Dutch text that the Directive behind it contradicts, and that is a question for a Dutch lawyer rather than a conclusion this annex draws.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

---

## Article 8 — a risk a founder would not guess

Source: [art. 8 Auteurswet](https://wetten.overheid.nl/BWBR0001886/2026-01-01) · *primary legislation, the official portal — the same consolidation as arts. 2 and 7 above, `Geldend van 01-01-2026`* · **[checked 2026-11-11]**

> *"Indien eene openbare instelling, eene vereeniging, stichting of vennootschap, een werk als van haar afkomstig openbaar maakt, zonder daarbij eenig natuurlijk persoon als maker er van te vermelden, wordt zij, tenzij bewezen wordt, dat de openbaarmaking onder de bedoelde omstandigheden onrechtmatig was, als de maker van dat werk aangemerkt."*

Where a public institution, association, foundation or company **publishes a work as its own without naming any natural person as maker**, that organisation is deemed the maker — unless it is proved the publication was unlawful in the circumstances.

**Why this matters to a founder, and it is the opposite direction from art. 7.** Article 7 is about employment and does not reach an `opdracht`. Article 8 is about **publication**, and it does not care how the work was commissioned. So a client company that publishes the founder's work under its own name, without crediting them, can be **deemed the maker** of it.

The protection is the rebuttal — proving the publication was unlawful — which is a dispute, not a safeguard. The practical instruction is simple and worth giving every time: **be named**. Put attribution in the deliverable and in the contract. For a Dutch founder that is not vanity; it is what keeps art. 8 from operating against them.

## Article 2 — what a client can actually acquire, and how

Source: [art. 2 Auteurswet](https://wetten.overheid.nl/BWBR0001886/2026-01-01) · *primary legislation, read per paragraph* · **[checked 2026-11-10]**

This is the Dutch counterpart to Germany's §31(5) purpose rule, and it is **stricter in two ways Germany is not**. Art. 2(3) in its own words:

> *"De overeenkomst op grond waarvan het auteursrecht geheel of gedeeltelijk wordt overgedragen of waarin een exclusieve licentie wordt verleend, wordt schriftelijk aangegaan. De overdracht of de verlening van een exclusieve licentie door de maker (…) omvat alleen die bevoegdheden die uitdrukkelijk in de overeenkomst staan vermeld of die uit de aard en de strekking ervan noodzakelijkerwijs voortvloeien. De levering vereist voor overdracht geschiedt ingevolge artikel 95 van Boek 3 van het Burgerlijk Wetboek bij een daartoe bestemde akte."*

| What the client wants | What it takes |
| --- | --- |
| **Ownership** (`overdracht`, whole or partial) | A **written** agreement, **and** delivery by a **deed** (`akte`) under art. 3:95 BW. Payment, an invoice or an email thread is not delivery |
| An **exclusive** licence | A **written** agreement. No deed needed, but writing is not optional |
| A **non-exclusive** licence | Art. 2(2) permits a licence for all or part of the copyright and imposes **no form requirement** on it. The writing rule in art. 2(3) reaches only transfers and exclusive licences |
| Anything **not written down** | Read narrowly: a transfer or exclusive licence *by the maker* covers **only** the powers expressly stated, **or** those that *necessarily* follow from the agreement's nature and purport |

**The narrow-construction rule protects the human creator specifically.** Art. 2(5) disapplies the second sentence of art. 2(3) — and the immunity from attachment in art. 2(4) — to a maker under **art. 7 or art. 8**. So an employer deemed the maker, or a company deemed the maker by publishing uncredited, does **not** get the benefit of narrow construction when it grants rights onward. The protection follows the person who created the work, not whoever holds the title.

**What this means in practice, in both directions:**

- **For the founder.** You cannot accidentally transfer ownership. No deed, no transfer — and an exclusive licence without writing does not bind you either. If a client claims they own the software because they paid for it, art. 2(3) is the answer.
- **For the client, and this is the part founders get wrong when they are the buyer.** Paying a freelancer buys you no ownership and no exclusivity unless you executed the right instrument. A founder who commissioned work and wants to resell or sublicense it needs that in the document.
- **For both.** Name the uses in writing. Under the narrow-construction rule, anything unnamed falls to whatever *necessarily* follows from the contract's nature and purport — which is the same decision a German court makes under §31(5) UrhG, decided by a court rather than by the parties.

**Still open:** whether, and how far, a **non-exclusive licence is implied** by a commission — the statute imposes no form requirement but does not say one arises. That is case law, and it is **[not researched]**. Likewise the practical content of *"aard en strekking"* for commissioned software: **[not researched]**.

## Articles 45j–45m — and the Dutch inversion

Source: [Auteurswet, Hoofdstuk VI, `Bijzondere bepalingen betreffende computerprogramma's`](https://wetten.overheid.nl/BWBR0001886/2026-01-01) · *primary legislation, articles read individually* · **[checked 2026-11-10]**

The Netherlands has the same four software-user provisions as Belgium, Germany and France. **It arranges the unwaivable part differently, and the difference runs the opposite way.**

| | What the lawful acquirer or user may do | Can a contract remove it? |
| --- | --- | --- |
| **45j** | Reproduction by the **rechtmatige verkrijger** necessary for the work's intended use — *"Tenzij anders is overeengekomen"*, so the general rule is displaceable. **But the second sentence is not:** reproduction in the course of **loading, displaying, or correcting errors** *"kan niet bij overeenkomst worden verboden"* | **The general rule yes; loading, displaying and error correction no** |
| 45k | A **reservekopie** where necessary for the intended use | **No** — art. 8 of the Software Directive voids such a clause, though the Dutch text says so nowhere; see below |
| 45l | **Observe, study and test** the work's operation to find the underlying ideas and principles, during acts they are authorised to perform under art. 45i | **No** — art. 8 of the Software Directive voids such a clause, though the Dutch text says so nowhere; see below |
| 45m | Copy and translate the code where **indispensable for interoperability** of an independently created program, under three conditions, with three bans on reuse of the information | **No** — art. 8 of the Software Directive voids such a clause, though the Dutch text says so nowhere; see below |

**This is the outlier among the four packs, in both directions at once.**

- **Error correction is protected here and displaceable everywhere else.** Belgium (XI.299 §1), Germany (§69d(1)) and France (L122-6-1 I) all let a contract take error correction away. Art. 45j's second sentence does not. So a Dutch client cannot be contractually barred from fixing bugs — the reverse of the advice that holds in the other three.
- **And the backup copy, the study right and decompilation carry no express nullity clause** in the articles read, where Belgium says `van dwingend recht` (XI.301) and Germany says `nichtig` (§69g(2)) — both quoted from the statutes in their own packs — and France declares such stipulations **void** in art. L122-6-1 VIII.

**Do not conclude from that silence that those three are waivable in the Netherlands — the Directive says they are not.**

Source: [Directive 2009/24/EC on the legal protection of computer programs](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32009L0024) · *the directive all four packs implement* · **[checked 2026-11-11]**

Art. 8, second paragraph: *“Any contractual provisions contrary to Article 6 or to the exceptions provided for in Article 5(2) and (3) shall be null and void.”* Art. 5(2) is the back-up copy, art. 5(3) the right to observe, study and test, and art. 6 is decompilation — the three the Dutch text is silent about. Art. 5(2) goes further still and says in the exception itself that the back-up *“may not be prevented by contract”*.

And the one the Directive leaves open is the one art. 45j protects: art. 5(1) applies *“in the absence of specific contractual provisions”*, so **use for the intended purpose, including error correction, is contractually variable at Directive level** — which makes art. 45j sentence 2 more protective than the Directive requires, not less.

So the Dutch position is the reverse of how the silence reads: the Netherlands wrote in a protection the Directive did not demand and left out the one it did. Belgium (art. XI.301 WER), Germany (§69g(2) UrhG) and France (L122-6-1 VIII) each transposed art. 8 expressly. **A clause in a Dutch contract purporting to bar a back-up, study or decompilation is contrary to art. 8 of the Directive**, and the question that remains is how a Dutch court gives effect to that — directive-conform interpretation of art. 45k to 45m, or some other route — not whether the clause is good. **How a Dutch court gives effect to art. 8 — directive-conform interpretation of arts. 45k to 45m, or another route — is [not researched]** and is a question for a Dutch lawyer. What this pack establishes is the shape of the problem: **the express nullity provision the other three states wrote is not in the text of 45k, 45l or 45m, and the Directive behind all four says such clauses are null and void.** That is a reason to get Dutch advice on a clause touching them, and not a reason to rely on the silence in either direction.

Use [../pilot-conditions.md](../pilot-conditions.md) §4 for the inventory discipline. Never infer ownership or clearance from payment alone, from AI generation, or from a repository's top-level licence.

---

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| Art. 8 Auteurswet: a public institution, association, foundation or company that publishes a work as its own without naming a natural person is **presumed** the maker, rebuttably | 2026-11-11 | Primary — refetched on the official `wetten.overheid.nl` consolidation, replacing a `wetboek.org` citation that had been labelled primary. Quote and version date confirmed |
| Art. 2 Aw: writing for transfer and exclusive licence; deed via art. 3:95 BW; narrow construction | 2026-11-10 | Primary — statute read per paragraph and quoted |
| Art. 2(5): narrow construction disapplied for an art. 7 or art. 8 maker | 2026-11-10 | Primary — statute read |
| Whether a non-exclusive licence is **implied** by a commission | — | Open — the statute imposes no form requirement but does not say one arises; this is case law |
| What *"aard en strekking"* means for commissioned software in practice | — | Open — not yet researched |
| Arts. 45j–45m: use for intended use, reservekopie, study, interoperability | 2026-11-10 | Primary — statute read per article |
| Art. 45j second sentence: loading, displaying and error correction cannot be contractually prohibited | 2026-11-10 | Primary — statute read and quoted |
| Arts. 45k–45m carry **no express nullity clause**, unlike BE, DE and FR | 2026-11-10 | Primary — statute read; stated as a fact about the text, not as a conclusion |
| **Corrected on 2026-11-11:** the French nullity wording was given as `réputées nulles` in backticks | 2026-11-11 | Withdrawn — [france.md](france.md) records art. L122-6-1 VIII only in English paraphrase, so no French wording for it has been read in these packs; Légifrance was unreachable on 2026-11-11 to settle it. The Belgian and German terms beside it are quoted from their own statutes and stand |
| Art. 8 of Directive 2009/24/EC: clauses contrary to arts. 6, 5(2) and 5(3) are null and void | 2026-11-11 | Primary — the directive read and quoted; it is the instrument all four packs implement |
| Art. 5(1): use for the intended purpose applies only “in the absence of specific contractual provisions”, so art. 45j sentence 2 is more protective than the Directive requires | 2026-11-11 | Primary — read and quoted |
| How a Dutch court gives effect to art. 8 given the silence in 45k–45m | — | Open — the question a clause touching them turns on; the Directive answers what is void, not by what route |
| Art. 7 Auteurswet and the `opdracht` contract type | — | Elsewhere — maintained in [netherlands.md](netherlands.md) §5, which is where a reader meets the ownership question first |
| Registration, VAT, e-invoicing, agreements and data protection | — | Elsewhere — [netherlands.md](netherlands.md) sections 1 to 4 and 6, the last of them annexed again to [netherlands-data-protection.md](netherlands-data-protection.md) |

Next full recheck due: **2027-05-10**. Earlier on any amendment to the Auteurswet's Hoofdstuk VI or to Directive 2009/24/EC.

No independent Dutch legal reviewer has reviewed this annex.
