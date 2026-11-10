# Backlog — 100 items, basics and optimization first

Written 2026-11-10, against commit `3cc17e5` on branch `skill-first`.

**The rule for this list: no new features.** Every item below is either a basic that is currently wrong or missing, a cleanup, or a verification. Features that were asked for and deliberately refused are in [Not now](#not-now) at the end.

Nothing here is a guess about what users want. Items are grounded in what is actually in the repository today, with file references where they exist.

---

## Do these twelve first

They unblock or invalidate large parts of the rest.

| | Item | Why first |
| --- | --- | --- |
| 1 | [#11](#11) Decide the runtime's fate | 30+ items below branch on this answer |
| 2 | [#1](#1) Rewrite the root README install path | It currently sends every visitor down the 28 MB route |
| 3 | [#47](#47) Score the 18 eval cases on one host | Until this exists, nobody knows the skill works |
| 4 | [#69](#69) Install your own skill and use it | `~/.claude/skills/` does not exist on your machine |
| 5 | [#59](#59) Run `check-skill.mjs` in CI | It currently runs nowhere |
| 6 | [#99](#99) Watch one person install it, unaided | That number replaces every estimate in this file |
| 7 | [#15](#15) Retire the old `.agents/` skill | Two skills in one repo confuses hosts and visitors |
| 8 | [#3](#3) Fix the repo description and topics | Still says Codex-only, CLI, Node |
| 9 | [#33](#33) Refetch the six carried Belgium claims | Dated claims are the product |
| 10 | [#51](#51) Verify the harm cases C3 and C12 pass | Wrong tax answers are the real risk |
| 11 | [#5](#5) Cut the README disclaimer density | 30 hedges in 94 lines |
| 12 | [#98](#98) Ask five people the pre-product question | Everything else is downstream of the answer |

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

**22.** `SKILL.md` is ~7 KB. Target under 5 KB by moving detail into references and keeping only decision rules at the top level.

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

<a id="33"></a>**33.** Refetch the six carried Belgium claims (FPS Economy procedures, `business.belgium.be/32`, the unfair-terms PDF, software ownership, both EDPB pages) and update their dates.

**34.** Get primary confirmation of the Belgian VAT phased schedule from FPS Finance or the Official Gazette. It currently rests on two secondary sources.

**35.** Confirm the EU-wide €100,000 cross-border threshold from a primary source. One secondary source is not enough for a number.

**36.** Confirm the German "net amounts / immediate exit / no founding-year projection" changes against the primary text or BMF guidance.

**37.** Read the German BMF e-invoicing guidance — currently `[not researched]`.

**38.** Establish Dutch registration rules properly. The KVK page fetched was a navigation hub, so the pack honestly says *not established*.

**39.** Establish which invoicing and administration duties remain **inside** the Dutch KOR. Founders will assume it removes them; the pack cannot currently say.

**40.** Find the EU-KOR threshold, recorded as unknown.

**41.** Retry `economie.gouv.fr` (HTTP 403 on 2026-11-10) or find the French administration's own PDP and e-reporting guidance.

**42.** Track the French PLF 2026 to enactment; update or remove the `travaux immobiliers` entry.

**43.** Track the Dutch e-invoicing bill into consultation — expected Q4 2026, which is **now**.

**44.** Close "agreements / unfair terms" for NL, DE and FR.

**45.** Close "ownership of commissioned software" for NL, DE and FR.

**46.** Add national DPA guidance: AP (NL), the relevant state authority plus BDSG (DE), CNIL (FR). Better sources for those founders than the EU-level pages.

## 5. Evals — the real quality gate

<a id="47"></a>**47.** Create `skill/evals/results.md` and score all 18 cases on one host. **This is the single most valuable item in the file.**

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

**68.** Add a size guard: the skill is 119 KB. Fail above ~250 KB so growth is a decision, not a drift.

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

- 4 jurisdiction packs, all checked 2026-11-10, with 7 open topics between them.
- 18 eval cases written, **0 scored on any host**.
- `skill/` is 21 files, 119 KB, no dependencies; `check-skill.mjs` passes.
- Runtime is 353 files, 565 passing tests, untouched on this branch.
- No independent user, security or legal review of anything.
