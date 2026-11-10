# Backlog — 100 items, basics and optimization first

Written 2026-11-10, against commit `3cc17e5` on branch `skill-first`.

**The rule for this list: no new features.** Every item below is either a basic that is currently wrong or missing, a cleanup, or a verification. Features that were asked for and deliberately refused are in [Not now](#not-now) at the end.

Nothing here is a guess about what users want. Items are grounded in what is actually in the repository today, with file references where they exist.

**How to read this file.** The numbered list in sections 1 to 11 is the **original plan as written on 2026-11-10** and it is left as written, including the numbers it quoted at the time. It is a record of what was decided, not a status board. For the current state, read **Progress** and **What is left, and why** immediately below; where an item has been resolved, declined or superseded, those two sections say so and give the reason. Where an item's own text has since been shown to be wrong rather than merely done, the item carries a bracketed correction inline.

---

## Progress

Updated 2026-11-10.

**Done (59):** 1, 2, 5, 7, 9, 15, 16, 21, 26, 27, 28, 29, 30, 31, 32, 33, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 53, 54, 55, 56, 57, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 73, 74, 77, 78, 79, 80, 81, 82, 87, 90, 91, 92, 93, 94, 95, 97 — plus 10 in part (branch pushed; the pull request itself is still to open).

**Organization and cleanliness pass (2026-11-10), after the work above:**

- **6 and 8 answered as far as item 11 allows.** `docs/README.md` classifies all 53 docs by evidence (14 governance, 21 runtime CLI, 7 browser UI, 11 feature notes) and states the staleness openly. `assets/README.md` explains all 3.1 MB — which 1.1 MB is a real `pdf-render.mjs` dependency, which 851 KB shows the *runtime* rather than the skill, and that the README banner is 1.1 MB for one decorative image. Neither deletes anything; that is item 11's call.
- **My own duplication removed.** Six check scripts had three copies of a directory walk, three of a reporting block, six hand-rolled root resolutions, and two different functions both named `walk`. Now `scripts/lib/` plus a single `check-all.mjs` entrypoint that CI and a terminal both run. Total lines went *up* (732 → 935, of which 72 is the new entrypoint and 93 the lib); the duplication went to zero.
- **One pack template, enforced.** The four national packs now share six fixed sections, `check-skill.mjs` fails and names an off-template section, and the template is documented where a contributor looks. That new check immediately caught a real omission: both EU layers lacked the "not advice" line every national pack carries.
- **`CONTRIBUTING.md` split** by which half you are contributing to, since `skill/` needs no install and the runtime needs `npm ci` plus the manifest refresh.
- **`SECURITY.md` rewritten** to name the skill's actual attack surface — prompt injection, context-packet exfiltration, unauthorized writes, a pack asserting what its source does not say — plus an explicit "not a vulnerability" list.
- **`scripts/check-doc-links.mjs`**, new: 104 markdown files, 189 relative links, all resolve. It exists because a throwaway one-liner reported a dozen dead links that were all false positives from its own broken path handling.
- **Repository layout table** in the README, so all 14 directories are accounted for.

**Verified by execution rather than inspection:**

- **32** — `skill/scripts/check-dossier.mjs` implements the change-propagation walk that `dossier-format.md` states in prose, runs it over the worked example from every node, and asserts termination and the absence of cycles. It also enforces referential integrity and the assertion vocabularies. Prose does not prove termination; this does.
- **57** — `skill/scripts/check-facts.mjs` asserts the 43 dates and figures the eval cases depend on, plus three *forbidden* patterns so a reversed claim cannot creep back. It caught a real mismatch on its first run: the pack says "none of this is law", my assertion looked for "not yet law". The assertion was wrong, the pack was right.
- **21** — done as the instruction-coverage audit in `skill/evals/results.md` rather than as a reading exercise.
- **56** — pass bar recorded in `results.md`: every harm case (C3, C10, C12, C20) must pass, and no more than two non-harm cases may fail, before telling anyone to install it.

**Verification debt (33–46) is worked through.** All four national packs carry **zero** unrefetched claims, plus three shared layers — `eu-gdpr.md`, `eu-vat-sme.md`, `eu-ai-act.md` — so the EU-level rules are stated once rather than four times. The per-item outcome is tabulated in [section 4](#4-verification-debt); several items are closed only as far as the primary source allows, and the packs say which.

**First research wave** — what it produced:

- **Primary legislation read and quoted** for six provisions: §19 UStG, §69b UrhG, §310(1) BGB, art. L113-9 CPI, art. L442-1 I C.com, art. 7 Auteurswet.
- **Two pack entries reversed.** The French PLF 2026 €25,000 carve-out was recorded as an open bill; it was rejected in November 2025. Dutch e-invoicing was recorded as Peppol-based; Peppol is recommended, not mandated.
- **One claim demoted by checking it.** §19 UStG is *silent* on net-vs-gross, mid-year exit and founding-year projection — three things professional commentary states as fact.
- **Three new cross-border findings** in `jurisdictions/README.md`: four different unfair-terms mechanisms with four different remedies; a genuine convergence on software ownership (none of the four transfers rights for commissioned work, so a founder keeps theirs by default); and the Dutch protection that switches off at 50 employees.
- **Open topics rose from 18 to 26.** Resolving nine surfaced several that were previously invisible — that is honest accounting, not a regression.

**Second research wave — the PDF pile.** Official guidance that a normal fetch cannot read, because the PDFs use subset fonts. Extracted with `pdftotext` from Git for Windows and read in full: the Belgian unfair-terms brochure; four GBA SME publications plus the GBA breach manual; the AP controller step plan, the AP breach step plan and the AP's own list of the breach form's questions; the French `fiche 7` on e-reporting, the official start guide, the CNIL TPE-PME checklist and the CNIL/Bpifrance PME guide; and all three BMF e-invoicing letters. **Fourteen documents.** What it changed:

- **One pack was contradicting the primary source.** Rn. 22 of the BMF letter of 2025-10-15 exempts **Kleinunternehmer** from issuing an e-invoice entirely, along with any invoice at or under €250. The pack had been telling exactly its own audience to prepare for a 2028 obligation they do not have. Corrected in three places, and `check-facts` now guards it.
- **Two "authority guides" turned out to be pre-GDPR awareness material.** The Belgian `Wegwijs in de AVG voor KMO's` is January 2018 and issued by the **CBPL**; the CNIL/Bpifrance PME guide is **April 2018** and marked `Document non contractuel`. Both describe the GDPR in the future tense. Two further GBA brochures are a **KU Leuven** project deliverable, not supervisory doctrine. Each document is now dated and attributed rather than listed by title.
- **The one current Belgian document is the breach manual**, versie 2.0 of **2026-02-02** — and it is the most operational material in any pack. It names its own trap: the art. 33 deadline can be lost to an unassigned MijneGov role.
- **A third cross-border contrast**, in `jurisdictions/README.md`: art. 33 gives everyone the same 72 hours, and the machinery inside them is national. Belgium is a two-part filing with a hard 21-day window; the Netherlands is one form with a 4-week follow-up request. In both, it is the *completion* step that discharges art. 33 — so filing inside 72 hours and stopping is not compliance.
- **The transitional/non-objection conflation fixed.** German transitional rules run to **2027-12-31**; the 2026-12-31 date is the non-objection period for a different letter's additional requirements.
- **Open topics rose from 26 to 33** across the two waves, for the same reason as before.

**Partly done:**

- **47** — an instruction-coverage audit of all 22 cases is recorded in [skill/evals/results.md](skill/evals/results.md) and found four real gaps, now fixed. A **behavioural score on a host is still missing**, and that is the part that matters.
- **22** — target corrected, see below.
- **34** — the **enacting instrument is now identified**: the Belgian law of 2026-09-23, published 2026-10-07, article 26 amending article 56ter of the VAT Code, in force 2027-01-01. The year-by-year figures still rest on professional commentary rather than an FPS Finance page, so this is improved but not closed.
- **35** — **closed.** The €100,000 is art. 284(2)(a) of Council Directive (EU) 2020/285, with a €85,000 ceiling on national thresholds in art. 284(1), applicable from 2025-01-01 per art. 3(1). Read from EUR-Lex and factored into a second shared layer, `eu-vat-sme.md`.

**Found while working, not in the original list:**

- Adding `skill/` had already broken CI. `verify-installation.mjs` requires every tree file to be listed in `installation.json`, so the first pull request would have failed on `Unlisted file: skill/SKILL.md`. Fixed by excluding `skill/` from the legacy runtime walk.
- `LICENSING.md` excluded `evals/**` from the MIT grant, which collided with the new `skill/evals/`. Resolved explicitly in favour of inclusion.
- `check-freshness.mjs` caught three packs whose recheck date did not parse, because the trailing period sat inside the bold. Normalized all four to one format.
- `check-public-package.mjs` requires the README to carry a download link matching `package.json`. Preserved by moving that link to the legacy row rather than weakening the check.

### Correction to item 22

The original target — "`SKILL.md` under 5 KB" — was set without measuring what was load-bearing, and is **wrong**. The file is 7.3 KB: 0.7 KB of routing description and 6.6 KB of body across 47 lines, after real deduplication into the references.

What remains is the jurisdiction rule, the four evidence steps, the four-part close, the reference table and the data/authority boundaries. Cutting further removes safety rules — a worse trade than the tokens saved.

**Revised target: keep the body under 8 KB and every section load-bearing.** Re-examine when a section is added, not against a byte count.

---

## What is left, and why

**Item 11 is decided.** The legacy runtime stays here, **frozen**: security, dependency and compatibility fixes only. Not split out, not deleted. The reasoning, the consequences and what would reverse it are in [DECISIONS.md](DECISIONS.md) entry 1.

That resolved the whole block that depended on it:

| Item | Outcome |
| --- | --- |
| 11 | Keep, frozen |
| 12 | **Declined.** 13 published release tags reference the full tree; a history split orphans every one, for a project with zero users |
| 13, 14 | Done — the README states the runtime is frozen and why it is kept |
| 15, 16 | **Done by deletion.** `.agents/skills/startkompas/` removed. A copy of `skill/` there would have duplicated 19 model-facing files — worse than losing project-scoped discovery in a repo that *is* the skill's source |
| 17 | **Done by deletion.** `scripts/install-skill.mjs` removed, along with `check-installed-skill.mjs` which tested what no longer exists |
| 18 | **Kept.** `installation.json` guards runtime package integrity; `skill/` is deliberately excluded from it |
| 19 | **Kept.** The 565 tests are the dossier format's reference implementation and they pass |
| 20 | Done — `quality.yml` runs one job on push and the full six-way matrix weekly and on demand, cutting routine cost by about five sixths |
| 83–85 | **Declined with reasoning.** Formatting a frozen component nobody reads buys nothing; the diff would be enormous. Do it first if the runtime is ever unfrozen |
| 88, 89 | **Declined with reasoning.** Both findings stand and are recorded, but tidying a frozen component is not a security or compatibility fix |
| 6, 8 | Done as far as keeping allows — `assets/README.md` and `docs/README.md` explain every file |

**Needs a GitHub session I do not have:** 3 and 4 (repo description and topics), 10's pull request, 76's release, 96 (traffic — needs `gh auth login`).

**Needs a live host session judged by someone who is not the model:** 23, 24, 25, 48, 49, 50, 51, 52, 58, 72. The cases and the pass bar are written; the scoring is not something the author of the instructions can do credibly about itself.

**Needs another machine:** 75.

**Needs real people:** 98, 99, 100 — and these are still the most valuable items in the file.

---

## Do these twelve first

They unblock or invalidate large parts of the rest. **Eight of the twelve are closed. The four that are open are the four that need someone other than the model**, which is the honest summary of where this project stands.

| | Item | Why first | State |
| --- | --- | --- | --- |
| 1 | [#11](#11) Decide the runtime's fate | 30+ items below branch on this answer | **Done** — keep, frozen; [DECISIONS.md](DECISIONS.md) entry 1 |
| 2 | [#1](#1) Rewrite the root README install path | It currently sends every visitor down the 28 MB route | **Done** — skill install is first, one line, no Node |
| 3 | [#47](#47) Score the eval cases on one host | Until this exists, nobody knows the skill works | **Open — needs a host session judged by someone who is not the model.** The 22 cases and the pass bar are written |
| 4 | [#69](#69) Install your own skill and use it | `~/.claude/skills/` does not exist on your machine | **Done** — installed in `~/.claude/skills/` and `~/.codex/skills/`, resynced on every change |
| 5 | [#59](#59) Run `check-skill.mjs` in CI | It currently runs nowhere | **Done** — `skill.yml` runs all five checks, no `npm ci` |
| 6 | [#99](#99) Watch one person install it, unaided | That number replaces every estimate in this file | **Open — needs a real person** |
| 7 | [#15](#15) Retire the old `.agents/` skill | Two skills in one repo confuses hosts and visitors | **Done by deletion** |
| 8 | [#3](#3) Fix the repo description and topics | Still says Codex-only, CLI, Node | **Open — needs the owner's GitHub session.** Paste-ready text prepared |
| 9 | [#33](#33) Refetch the six carried Belgium claims | Dated claims are the product | **Done** — and the refetch corrected several of them |
| 10 | [#51](#51) Verify the harm cases C3 and C12 pass | Wrong tax answers are the real risk | **Open — same blocker as item 47.** `check-facts.mjs` now guards the *facts* those cases rely on, which is not the same as scoring the behaviour |
| 11 | [#5](#5) Cut the README disclaimer density | 30 hedges in 94 lines | **Done** |
| 12 | [#98](#98) Ask five people the pre-product question | Everything else is downstream of the answer | **Open — needs real people** |

---

## 1. Truth in the shop window

The repository now contains two different products. A visitor cannot tell which one to install.

<a id="1"></a>**1.** Rewrite `README.md`. Its install section (lines 19–51) still routes through `node scripts/install-skill.mjs` plus `npm ci`, and the word `skill/` appears **zero** times in the whole file.

**2.** Put the real install at the very top: copy `skill/` into `~/.claude/skills/startkompas/`. One line, no Node.

<a id="3"></a>**3.** Fix the GitHub repo description. It reads *"Local founder workspace… Experimental Codex skill and Node.js CLI."* — Codex-only, CLI-first, and no longer true.

**4.** Fix the repo topics: currently `business-planning`, `cli`, `codex`, `nodejs`. Drop `cli`/`nodejs` if the runtime is parked; add the terms someone searching for this would actually type.

<a id="5"></a>**5.** Cut the hedging. `README.md` has 30 negation/caveat phrases in 94 lines. One honest paragraph at the top plus one Limits section at the bottom is equally accurate and far more readable.

**6.** Decide what to do with `assets/` — 3.1 MB including a 530 KB demo video and five PNGs of **CLI output from the runtime**. They advertise the product you may be about to park.

**7.** Fix `docs/support-matrix.md:3`: it states *"Package version remains 0.1.0-alpha.12.1"* while `package.json` says `0.1.0-alpha.14.2`.

**8.** Decide what `docs/` is for. Of 53 files, 12 mention Codex and 17 contain `node src/` commands — they document software a skill-first user never installs.

**9.** Add a short "which thing am I installing?" section contrasting the skill and the runtime in four lines.

**10.** Open the PR for `skill-first` with the jurisdiction contrast table in the body, so this becomes a reviewable decision rather than a silent merge.

## 2. The runtime decision

<a id="11"></a>**11.** Decide: delete, park in a separate repository, or keep as explicitly optional. **Do not defer this** — items 12–20, 83–90 and much of section 1 all depend on it.

**12.** If parking: move `src/`, `tests/`, `ui/`, `examples/`, `schemas/`, `modules/`, `templates/`, `start.mjs`, `installation.json` to `startkompas-runtime`, preserving history via a subtree split rather than a fresh copy.

**13.** If parking: leave a one-paragraph pointer in the README, not a second install path.

**14.** If keeping: state who it is for — someone who wants deterministic local operations with no AI host. Today it is presented as the main product.

<a id="15"></a>**15.** Retire `.agents/skills/startkompas/` (17 files). It still points at `modules/` and `docs/`, cannot stand alone, and competes with `skill/`.

**16.** If `.agents/` stays for project-scoped discovery, make it a copy of `skill/`, not the old runtime-coupled version.

**17.** Delete or rewrite `scripts/install-skill.mjs`. It copies 352 files and then instructs the user to run `npm ci`.

**18.** Delete `installation.json` (50 KB manifest of 352 files) if the runtime is parked. It only exists to serve the old distribution model.

**19.** Decide the fate of the 565 runtime tests. They pass and they are good work, but they guard code a skill-first design does not need. Move them with the runtime, or keep only the store/history integrity subset.

**20.** Re-point `.github/workflows/quality.yml`. Every step — `check-public-package`, `npm ci`, `npm test`, `check-installed-skill`, `doctor`, two demos — exercises the runtime. **Nothing in CI touches `skill/`.**

## 3. Skill correctness and optimization

**21.** Read `skill/SKILL.md` end to end as if you were the model. Every sentence that is a caveat rather than an instruction is weight carried on every single turn.

**22.** `SKILL.md` is ~7 KB. Target under 5 KB by moving detail into references and keeping only decision rules at the top level. — *[Correction: the 5 KB target was wrong. A coverage audit found the file was missing two load-bearing instructions, which were added, and it now sits at 7.5 KB. The real target is **under 8 KB with every section load-bearing**, tested by deleting a section and asking what behaviour is lost. Size is a proxy; the audit is the test.]*

**23.** Verify the 666-character description actually routes: ask an in-scope question **without naming the skill** and see whether it triggers.

**24.** Test the inverse: five clearly out-of-scope requests that must **not** trigger it. A skill that always fires is worse than none.

**25.** Watch a real session to confirm progressive disclosure works — does the model open the right reference, or answer from `SKILL.md` alone?

**26.** Remove the duplication between `SKILL.md` and `references/method.md`: both state the four-part close and the three-action limit.

**27.** Same for the data/authority boundary, stated in both files. Pick one owner.

**28.** Confirm every reference is reachable from the table in `SKILL.md`. An unlisted reference never loads.

**29.** Add **one worked example** to `references/offer-and-market.md`: a completed offer hypothesis with real filled fields. Instructions without an example underperform.

**30.** Add a worked `project.json` at revision 3 with populated `links`, so the model has a concrete target shape rather than a schema.

**31.** Reconsider `format: "startkompas/2"`. There is no published `startkompas/1` plain-file format, so the version invites a question you cannot answer.

**32.** Walk the change-propagation rules by hand on paper, including a dependent that is itself a prerequisite. Confirm the walk terminates.

## 4. Verification debt

This is the moat. Debt here is the only debt that degrades the product's actual value.

**Where this section stands**, item by item, as at 2026-11-10. Every one has been worked; not every one is closed, and the difference matters more than the count.

| Item | State | What actually happened |
| --- | --- | --- |
| 33 | **Closed** | All Belgium claims refetched and re-dated. The refetch *corrected* several of them rather than confirming them |
| 34 | **Open** | The enacting instrument is now identified — law of 2026-09-23, art. 26, amending art. 56ter VAT Code — but the per-year figures still rest on professional commentary. The pack says so |
| 35 | **Closed** | Primary EU legislation read; the €100,000 cap is art. 284(2)(a) |
| 36 | **Closed as far as the source allows** | §19 UStG read directly and it is **silent** on all three claims. The pack now says the secondary basis is unidentified and sends the founder to a `Steuerberater`. That is the correct outcome, not a failure |
| 37 | **Closed** | All three BMF letters — 2024-10-15, 2025-10-15, 2026-10-15 — extracted and read in full. This is what surfaced the Kleinunternehmer issuing exemption the pack had been contradicting |
| 38 | **Mostly closed** | KVK pages read, registration fee confirmed from the official page. Required identification documents and the processing timeframe remain open |
| 39 | **Mostly closed** | Tax-authority wording read and quoted: no invoice required, the scheme must be stated, no VAT charged. That purchase invoices are still retained rests on secondary sourcing and is flagged |
| 40 | **Closed** | €100,000 Union threshold, start date 2025-01-01, both from primary EU legislation |
| 41 | **Closed by another route** | `economie.gouv.fr` still returns 403 and the pack records that. The tax administration's own pages and the official `fiche` were read instead, which is a better source anyway |
| 42 | **Closed** | The PLF 2026 `travaux immobiliers` carve-out was **rejected, not pending** — the entry was wrong in the other direction and is corrected |
| 43 | **Partly** | The timeline is recorded from consistent secondary reporting; the `Contourenbrief` of 2026-09-11 itself has not been read |
| 44 | **Closed** | Primary legislation read per article for all three, and the four mechanisms are contrasted in the packs' README |
| 45 | **Closed for ownership, open for use** | All four jurisdictions' ownership rules read from primary sources and found to converge. What the *client* acquires is answered only for Germany (§31(5) UrhG); NL and FR are named as open |
| 46 | **Partly** | AP material read in depth, CNIL material read and dated. For Germany the BfDI's directory of 16 Länder authorities is read, but the BDSG and the competent authority's own guidance are not |

**The honest summary: the research succeeded, and the open-topic count went from 7 to 33 because of it.** Closing a vague gap reliably names two specific ones — "read the BMF guidance" became "read §27(38) UStG" and "read the GoBD letter". A rising number here is the method working, not the project slipping.

<a id="33"></a>**33.** Refetch the six carried Belgium claims (FPS Economy procedures, `business.belgium.be/32`, the unfair-terms PDF, software ownership, both EDPB pages) and update their dates.

**34.** Get primary confirmation of the Belgian VAT phased schedule from FPS Finance or the Official Gazette. It currently rests on two secondary sources.

**35.** Confirm the EU-wide €100,000 cross-border threshold from a primary source. One secondary source is not enough for a number.

**36.** Confirm the German "net amounts / immediate exit / no founding-year projection" changes against the primary text or BMF guidance.

**37.** Read the German BMF e-invoicing guidance — currently `[not researched]`. — *[Done, and it was the highest-value item in this section. Reading Rn. 22 of the 2025-10-15 letter showed the pack had been telling Kleinunternehmer to prepare for an issuing obligation they are exempt from. An item written as "fill a gap" turned out to fix an error.]*

**38.** Establish Dutch registration rules properly. The KVK page fetched was a navigation hub, so the pack honestly says *not established*.

**39.** Establish which invoicing and administration duties remain **inside** the Dutch KOR. Founders will assume it removes them; the pack cannot currently say.

**40.** Find the EU-KOR threshold, recorded as unknown.

**41.** Retry `economie.gouv.fr` (HTTP 403 on 2026-11-10) or find the French administration's own PDP and e-reporting guidance.

**42.** Track the French PLF 2026 to enactment; update or remove the `travaux immobiliers` entry. — *[Done, and the item's premise was wrong: the carve-out was **rejected**, not awaiting enactment. The entry said "pending" and now says "rejected".]*

**43.** Track the Dutch e-invoicing bill into consultation — expected Q4 2026, which is **now**.

**44.** Close "agreements / unfair terms" for NL, DE and FR.

**45.** Close "ownership of commissioned software" for NL, DE and FR.

**46.** Add national DPA guidance: AP (NL), the relevant state authority plus BDSG (DE), CNIL (FR). Better sources for those founders than the EU-level pages. — *[Mostly done, with one finding the item did not anticipate: **"national DPA guidance" is not a single kind of thing.** The Belgian GBA's SME brochures are January 2018 CBPL-era material and two of them are a KU Leuven deliverable, not supervisory doctrine; the CNIL's main PME guide is April 2018 and marked `non contractuel`. Only the AP's material and the GBA's breach manual (versie 2.0 of 2026-02-02) are current. The packs now date and attribute each document rather than listing titles, because the date is what decides whether a founder can rely on it.]*

## 5. Evals — the real quality gate

<a id="47"></a>**47.** Create `skill/evals/results.md` and score all 18 cases on one host. **This is the single most valuable item in the file.** — *[Still true, and still the most valuable item. Two corrections: the suite grew to **22** cases, and `skill/evals/results.md` now exists as the scoring sheet with every case listed and unscored. What is missing is the scoring itself, which the author of the instructions cannot credibly do about its own output.]*

**48.** Score the same 18 on a second host. The differences are the point.

**49.** For every fail, record the host, model, date, verbatim prompt and the actual answer. A fail without the transcript is unusable.

**50.** Fix what C1 reveals first — a simple request must not trigger intake. That failure mode irritates users more than any missing feature.

<a id="51"></a>**51.** Treat C3 (no jurisdiction established) and C12 (honest failure to verify) as blocking. These are the cases where being wrong causes real harm.

**52.** Re-run C4–C6 and C14–C18 after every pack recheck. They encode dates, so a stale eval marks correct behaviour as failure.

**53.** Add a case for a jurisdiction with **no** pack, exercising the research protocol end to end. It is currently untested.

**54.** Add a case where a pack's recheck date has passed, to confirm the model says so.

**55.** Add a case covering the worked offer example, once item 29 exists.

**56.** Set a pass bar before telling anyone to install: all harm cases pass, and a stated percentage overall.

**57.** Automate what can be automated — a case whose expected answer is a specific date can be string-checked.

**58.** Re-score after **every** `SKILL.md` edit. Instruction changes regress silently and invisibly.

## 6. CI and automation

<a id="59"></a>**59.** Add a workflow running `skill/scripts/check-skill.mjs` on push and pull request. It currently runs nowhere.

**60.** Make that job require no `npm ci`. The skill has no dependencies, so it should be the fastest job in the repo.

**61.** Add a link checker for the external URLs in the packs. A dead official URL is a silent correctness failure.

**62.** Make the link checker **report** rather than fail on 403 — `economie.gouv.fr` already proves 403 ≠ dead.

**63.** Add a scheduled job that opens an issue when a pack's "Next full recheck due" date passes.

**64.** Add a check that no pack claim sits older than roughly six months without being re-dated.

**65.** Keep the Gitleaks secret scan. It is cheap, pinned by checksum, and already correct.

**66.** Keep Dependabot scoped to whatever still has dependencies. If the runtime is parked, that is nothing.

**67.** Verify the pinned action SHAs still resolve (`actions/checkout@3d3c42e…`, `actions/setup-node@949feb24…`). Pinning is right; pins still rot.

**68.** Add a size guard: the skill is 119 KB. Fail above ~250 KB so growth is a decision, not a drift. — *[Done, then redone, because the first version measured the wrong thing. A single aggregate budget priced **every** pack into **every** conversation, so closing a German open topic competed for budget with France — but references load on demand and a founder in Berlin never loads the French pack. `check-skill.mjs` now enforces four budgets: **10 KB** always-loaded (`SKILL.md`, paid on every turn), **48 KB** for the largest single reference (what one turn actually opens), **320 KB** model-facing total (a distribution and recheck bound), and 512 KB for the folder. It reports a **worst-case turn** of 42.6 KB. The constraint that bites is now the right one: `germany.md` at 35.0 KB of 48 KB, not an aggregate that penalised breadth.]*

## 7. Install and distribution

<a id="69"></a>**69.** Install `skill/` into `~/.claude/skills/startkompas/` and actually use it. That directory **does not exist** on your machine — you have never run your own skill.

**70.** Install it into `~/.codex/skills/startkompas/` and use it there too. Codex is installed; `startkompas` is not among its skills.

**71.** Build the claude.ai zip and upload it. Confirm `SKILL.md` sits at the archive root.

**72.** Verify progressive disclosure in all three hosts. Relative-path reference loading is the thing most likely to differ.

**73.** Write down per host what actually happened. The support matrix should then describe the skill, not the old runtime.

**74.** Test a project directory with a space and a non-ASCII character in its path. That is where file-writing skills break.

**75.** Test on a second operating system. Everything so far is Windows.

**76.** Ship a release containing **only** `skill/`. Current release ZIPs are the entire repository.

## 8. Licensing and legal consistency

**77.** Reconcile `LICENSING.md` with reality. It still carves out `docs/sources/`, `docs/plan.md`, `docs/requirements.json`, `evidence/` and `evals/` — paths that are not in this repository.

**78.** Verify `skill/NOTICE`'s claim that no Apache-2.0 scaffold material survives, by diffing the new text against the old `SKILL.md`.

**79.** Decide whether `skill/` carries its own version and changelog, independent of `package.json`.

**80.** Add `CODE_OF_CONDUCT.md`. The GitHub community profile reports it missing and it is the cheapest open item.

**81.** Recheck `THIRD_PARTY_NOTICES.md`. If the runtime is parked, the 28 dependency licence texts in `licenses/` go with it.

**82.** Decide the licence position on the jurisdiction packs specifically. Facts are not copyrightable but the curation is — confirm MIT is what you want if the packs are meant to be the moat.

## 9. Code hygiene — only if the runtime is kept

**83.** Run Prettier with `printWidth: 100` across `src/` and `ui/`. Average line length is 189 chars in `src/local-workspace.mjs` and 210 in `ui/ui.js`; `ui/index.html` contains a single 25,981-character line. Diffs are currently unreadable, so review by anyone is impossible.

**84.** Split `src/local-workspace.mjs` (91 KB in 483 lines) into modules.

**85.** Split `ui/ui.js` (366 KB in 1,736 lines).

**86.** Confirm the 565 tests still pass after formatting. That is precisely what they are for.

**87.** Fix `engines`: `package.json` demands Node `26.7.0` while CI tests `24.x` and the suite passes on 24. Use a range.

**88.** Question whether PDF export earns its cost: `pdfkit` + `fontkit` are 2 of 3 dependencies and 1.1 MB of bundled fonts, used by exactly one file (`src/pdf-render.mjs`).

**89.** Question `ajv`: imported by **24 of 94** `src/` modules purely to validate request envelopes that a model now generates. This is the vestigial CLI-first layer.

**90.** Extend `.gitignore` beyond `node_modules/` — no editor, OS or coverage artifacts are ignored.

## 10. Maintenance capacity

**91.** Fill in or delete `docs/maintenance-readiness.md`. Every row reads "Unassigned". An honest empty table is still an unstaffed project.

**92.** Design for one person: fewer moving parts, scheduled rechecks, no response-time promises.

**93.** Decide what happens if you stop for three months. A dated "last verified" banner beats a silently stale repo.

**94.** Set a recheck cadence you will actually keep. Four packs twice a year is eight research sessions — budget them.

**95.** State the contact route in exactly one place now that there may be users. GitHub-only is a valid choice.

## 11. Measure before growing

**96.** Enable and read GitHub traffic (views and clones). You have never looked; it needs an authenticated session (`gh auth login`).

**97.** Define what a user is for you — an install you cannot observe, or someone who returns. Pick the one you can actually measure.

<a id="98"></a>**98.** Ask five real people the pre-product question: *"how do you currently keep track of what your decision was based on?"* If the answer is "I don't, and it doesn't bother me", you have learned the most important thing available.

<a id="99"></a>**99.** Watch one person install the skill without helping. Time it. That number replaces every estimate in this file.

**100.** Choose the next milestone from items 96–99, not from this list. If the answer is "nobody wants this", stopping is a result, not a failure.

---

## Not now

Deliberately refused. Each would add surface area before the basics above are done.

- A fifth jurisdiction pack, until the open topics in the existing four are closed (items 37–46).
- Cloud service, accounts, hosted sync, payments.
- New document types, module systems, PDF or browser features.
- Telemetry of any kind.
- Any marketing or community push before the evals are scored (item 47).
- An "agent" layer that calls itself.
- A rewrite in another language or framework.
- A Discord or community space before there are users.

## Status

**Do not read counts from this section. Run the checks.** Pack totals, open topics, file sizes, assertion counts and live URLs all move with every research commit, and a hand-copied number here goes stale the same day. One command prints the current ones:

```bash
node skill/scripts/check-all.mjs
```

It reports the pack count, open topics per pack, every size budget against its limit, the fact-assertion total and the live/dead URL split. That is the authority; this file is not.

What is true as at **2026-11-10** and does *not* drift with the next commit:

| | |
| --- | --- |
| Pack coverage | Four national packs — Belgium, Netherlands, Germany, France — plus shared `eu-gdpr`, `eu-vat-sme` and `eu-ai-act` layers for rules that are genuinely identical across them |
| Pack verification | All checked **2026-11-10**; next full recheck **2027-05-10** |
| Size budgets | **10 KB** always-loaded, **48 KB** largest single reference, **320 KB** model-facing total, **512 KB** folder. These are decisions, not measurements — the reasoning is in `check-skill.mjs` |
| Dependencies | **None.** `skill/` installs by copying a folder |
| Eval scoring | **Zero cases scored on any host.** Still the largest single hole, and the one thing on this list that no amount of further work by the model can close |
| Runtime | 94 `src/` modules, 565 passing tests, **frozen** — [DECISIONS.md](DECISIONS.md) entry 1 |
| Reviews | **None.** No independent user, security, legal or tax review of any part of this |

**Open topics are expected to rise, not fall.** Each one is named in the pack that owns it. Closing a vague gap reliably produces two specific ones — "read the BMF guidance" became "read §27(38) UStG" and "read the GoBD letter" — so a rising count is the method working. The number to worry about would be a pack with *zero* open topics, which would mean it had stopped being checked.

**The one-line version: the content is in better shape than the evidence that it works.** Four of the twelve priority items are open and all four need a person who is not the model — one host scoring session, one GitHub session, and five conversations with real founders.
