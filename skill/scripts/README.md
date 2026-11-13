# Checks

Standard library only. No dependencies, no lockfile, no install step — the skill itself needs no runtime, and neither do its checks.

```sh
node scripts/check-all.mjs              # run everything
node scripts/check-all.mjs --offline    # skip the one check that needs the network
node scripts/check-all.mjs --quiet      # summary only; prints detail for failures
```

Run `check-all.mjs`. The individual scripts exist for when you want one check's detail.

## How this directory is laid out

Three kinds of file, and the kind tells you what to expect:

| Where | What it is | Rule |
| --- | --- | --- |
| `scripts/*.mjs` | **Runnable programs.** Each has a shebang, a header saying why it exists, and a usage line | Reserved for programs. A module that is only imported does not belong here, and `test/conventions.test.mjs` enforces that |
| `scripts/lib/*.mjs` | **Imported modules.** No shebang, never executed directly | Two groups — see below |
| `scripts/test/*.test.mjs` | **Tests**, plus `helpers.mjs` for fixtures | `X.mjs` is tested by `X.test.mjs`. Charged to their own size budget, because test code is deliberate bulk |

### `lib/` — generic infrastructure

Nothing in these is specific to this project; any check could use them. The first three were extracted because the same code had been written three and six times over.

| Module | Programs using it | Holds |
| --- | --- | --- |
| `paths.mjs` | all 8 | The directories every check needs, resolved from the lib's own location so a script works from any cwd. Also the `STARTKOMPAS_SKILL_ROOT` test seam |
| `report.mjs` | 6 | One reporting shape — `note` / `warn` / `fail` / `finish` — so every check's output and exit behaviour match |
| `files.mjs` | 4 | Recursive sorted file listing, forward-slash path formatting, size and budget-overage formatting |
| `pool.mjs` | 1 | Bounded-concurrency mapping, so a slow request delays only itself — plus an optional **per-key** bound, so a run spread over many hosts never puts two requests into one of them at once. Generic, but `check-links.mjs` is its only consumer today |

### `lib/` — one check's logic, pulled out to be testable

Each of these has exactly **one** program that uses it, plus its test. They are in `lib/` rather than beside that program because the top level is for programs, and a program cannot be imported without running it. Pulling the logic out is what lets a test feed it synthetic input instead of driving the whole check.

| Module | Used by | Why it is separate |
| --- | --- | --- |
| `citations.mjs` | `check-links.mjs` | Decides which URLs get probed at all. A URL it fails to see is a claim whose evidence is never checked, so it is worth testing without a network |
| `probe.mjs` | `check-links.mjs` | Decides what each HTTP response *means*. Takes an injectable `fetch`, so the dead-or-merely-awkward table is tested with no network and no server |
| `statutes.mjs` | `check-links.mjs` | Decides which statute reading claims a version, and reads the version in force out of the portal's redirect. Both halves are string work on text that varies — a dated URL, or the portal's `Geldend van` phrase in a source annotation — and a *wrongly* attributed version is worse than a missed one, because it sends a maintainer to reread a statute that has not changed |
| `facts.mjs` | `check-facts.mjs` | The assertion tables **and** a pure `evaluate()`. The tables are data that goes wrong in specific ways — a duplicate label, a pattern naming a pack that no longer exists — so they are tested as data |
| `graph.mjs` | `check-dossier.mjs` | The two walks over a dossier's links: reachability, and one depth-first search for a cycle. Takes an adjacency map and nothing else |

**`graph.mjs` is the clearest case for this split.** Inline, the only way to exercise a cycle was to build a whole valid dossier around it — eight collections and a dozen fields of unrelated fixture per case — so the interesting shapes went untested because each cost twenty lines to set up. With an adjacency map as the input, a graph is one line, and the cases that matter are covered: a diamond that a visited-set-only implementation would misreport as a loop, a cycle in a disconnected component, a cycle buried behind a forty-node acyclic chain, a 50,000-node chain that would overflow a recursive search, and a linearity guard at 40,000 nodes. `check-dossier.mjs` went from 247 lines to 176.

**`facts.mjs` is the one surprise in here**, since it holds claims about German VAT rather than general-purpose code. It sits in `lib/` for the structural reason above, not because it is reusable. If you are looking for the fact assertions, start from `check-facts.mjs`, which is a 34-line CLI around it.

Honest note on the original extraction: it did **not** reduce total lines — 732 across six scripts became 935 across ten. What it removed was three copies of a directory walk, three copies of a problem-reporting block, six hand-rolled root resolutions, and two different functions confusingly both named `walk`. The trade is slightly more code for no duplication and one way to do each thing.

## What each one proves

| Script | Proves | Fails on | Network |
| --- | --- | --- | --- |
| `check-skill.mjs` | The skill is structurally sound, self-contained and host-neutral | Bad frontmatter, dead relative link, unreachable reference, a reference linking outside the model-facing set, reintroduced runtime coupling, a named host, an undated or off-template pack, an annex its own pack does not link, **a cross-reference to a section number that no longer exists**, a verification marker outside the three the legend defines, a source on a non-authoritative host called "primary", over budget, a binary, a file rewritten with CRLF line endings | no |
| `check-markdown.mjs` | The markdown renders as written | A table split by a blank line, a ragged row, a separator with no header, a duplicate heading, a `---` that turns the paragraph above it into a heading, an unclosed code fence, a missing final newline | no |
| `check-dossier.mjs` | The change-propagation algorithm in `references/dossier-format.md` terminates, and is acyclic | Broken reference, duplicate id, invalid assertion value, a dependency cycle, **a `location` that points at nothing** — reported as the path round the loop | no |
| `check-facts.mjs` | Packs and eval cases still agree | A fact a case depends on has moved, or a reversed claim has returned | no |
| `check-freshness.mjs` | No pack is past its recheck date, and its maintenance table is still machine-readable | Missing recheck date, overdue recheck, an impossible date, a verified claim older than 183 days, a Status cell outside the seven-label vocabulary, an `Open` row carrying a check date or a dated label missing one | no |
| `check-links.mjs` | Every cited source URL still resolves, and every anchor with it — **and every Dutch statute reading is still the version in force** | 404, 410, or a host that does not resolve. A statute read at a version the portal no longer serves is **warned**, not failed | **yes** |
| `build-zip.mjs` | The upload archive has `SKILL.md` at its root | `SKILL.md` not at the archive root | no |
| `test/*.test.mjs` | **The checks above actually catch what they claim to** | A check that passes a tree it should reject | no |

**References may only link to `SKILL.md` or to each other.** If a reference pointed into `scripts/` or `evals/`, the model could be sent to a file that is not part of what it should be reading. `check-skill.mjs` section 7 enforces that closure.

## Who checks the checkers

```sh
node --test "scripts/test/*.test.mjs"
```

`check-all.mjs` runs this first, because a broken check invalidates every result below it.

**The tests are mostly negative.** CI already proves the checks pass on a correct tree; what it cannot prove is that they would notice a broken one, and a check that silently passes everything is worse than no check because it is trusted. So each test builds a tree that is correct except for one deliberate defect, then asserts that the check fails **and names the problem** — an exit code alone does not tell a contributor what to fix.

Two seams make that possible, and neither is used by anything that ships:

- **`STARTKOMPAS_SKILL_ROOT`** overrides the tree a check inspects, so a real check can be pointed at a fixture. Without it the only tree the checks could examine is the correct one.
- **`probeUrl`'s injectable `fetch`**, so the dead-or-merely-awkward table is tested with no network and no local server. A link checker with flaky tests gets switched off, which is the exact failure this check exists to prevent.

**Use the explicit glob.** Node's default discovery also loads any file under a directory called `test/`, which pulls in `test/helpers.mjs` as an empty test file.

### One test file per subject

`X.mjs` is tested by `X.test.mjs`, for every program and every lib module. So the tests for `pool.mjs` are in `pool.test.mjs`, and a missing test file is a visible gap rather than nothing at all. Two tests in `conventions.test.mjs` enforce it in both directions: nothing untested, and no test file left behind after its subject was renamed.

It was not always one-to-one. `probe.mjs` had its own file while `pool`, `citations`, `files` and `report` were bundled into a `lib.test.mjs`, so finding `pool`'s tests meant grepping for them. Splitting that file changed no assertions — the same 212 tests passed before and after.

Two files cover something other than a single module: `conventions.test.mjs` (how this directory hangs together) and `evals.test.mjs` (that `evals/cases.md` and `results.md` agree). `helpers.mjs` is fixtures rather than tests.

**One exemption, and it is checked.** `check-facts.mjs` has no test of its own, because it is a CLI over `lib/facts.mjs` and every decision is there. A test requires each exempt script to stay under 100 lines, so the exemption cannot quietly grow to cover something substantial. It already caught one: `check-all.mjs` was on that list at 103 lines, and looking properly turned up three things worth asserting — including that a child killed by a signal is a failure, not a pass, which `status !== 0` alone does not catch.

### Where to find the tests for one section of a check

A check's test file groups its tests under banners naming the numbered sections they cover — `// --- Jurisdiction packs — section 6 ---`. A test in `conventions.test.mjs` requires every numbered section to be named by some banner, so a section added with no tests shows up as a failure rather than as silence.

### What the suite is guarding, beyond correctness

Two tests assert a **cost**, not a behaviour, because both were real regressions waiting to happen:

- `mapPool` keeps workers busy rather than waiting for a batch. `check-links.mjs` used to slice URLs into fixed batches, so one government portal on a 15-second timeout idled five workers. The run went from about 5.0 s to 1.8 s.
- `check-dossier.mjs` handles a large dossier in linear time. Cycle detection used to be a reachability walk from *every* record: 8000 records took 1.4 s and doubling the records quadrupled it. One depth-first search does it in about 60 ms, and the test uses 16000 records with a loose 3-second bound — wide enough not to be flaky on a busy runner, tight enough that a quadratic implementation cannot pass.

A dossier is the one artefact here that grows without bound over a project's life, and this check is documented as safe to point at a real one, so its cost is part of its contract.

### What the suite found on its first run

The first negative test written — "missing `SKILL.md` fails" — failed. `check-skill.mjs` reported the missing file in section 1 and then crashed with an unhandled `ENOENT` in section 4, because two later sections read `SKILL.md` without checking it was there. A contributor whose `SKILL.md` was missing got a stack trace instead of the one sentence that would have told them why. That is the argument for this directory in one example.

## Three conventions these follow

**A problem fails the run. A warning never does.** `check-links.mjs` is the clearest case: a 403 from Légifrance means the portal blocks bots, not that the law has gone. Failing a build on that teaches people to ignore the build.

**A failure message names what is wrong and where.** `references/jurisdictions/france.md: dead relative link -> ../foo.md`, not `validation error`.

**`check-facts.mjs` failing is a decision, not a bug.** Exactly one of two things is true: the pack improved and the eval case must be rewritten, or the edit was a mistake. Work out which. Do not relax the assertion to make the build green — that is the one change that silently destroys the check's value.

That script has already caught four real mismatches, none of them a pack error:

- the pack said "none of this is law", the assertion looked for "not yet law"
- the Belgium pack gained its enacting instrument, so C6's "primary confirmation is open" requirement would have marked a *better* answer as a failure
- two assertions written without allowing for markdown emphasis (`**not** a legal requirement`)

## Every check here has been seen to fail

A check nobody has watched fail is not known to work. Each of these has fired on a real or deliberately introduced fault:

| Check | What made it fire |
| --- | --- |
| `check-skill.mjs` — template | An off-template `## 4.` heading in `germany.md`, introduced on purpose and reverted |
| `check-skill.mjs` — closure | A reference linking to `../evals/cases.md`, introduced on purpose and reverted |
| `check-skill.mjs` — "not advice" | A real omission: both EU layers lacked the disclaimer the national packs carry |
| `check-skill.mjs` — line endings | The section exists because of a real one: a Python helper used for a one-line substitution rewrote `check-freshness.mjs` as CRLF, and `git diff --stat` reported 449 changed lines where 103 were real |
| `check-skill.mjs` — "primary" | Four real mislabels: a Belgian e-invoicing FAQ and three Belastingdienst pages were cited as *primary official*, which reads as though the statute had been read when it had not |
| `check-skill.mjs` — markers | Two real ones: `[checked 2026-11-10, needs primary confirmation]` and `[checked 2026-11-10 — primary source silent, secondary basis unidentified]`, a fourth marker form growing inside the brackets of the only field in a pack that is parsed rather than read |
| `check-skill.mjs` — annex linked | Both halves of the annex rule were switched off in turn and the two tests watched fail: treating an annex as a national pack again reinstated the off-template failure, and skipping the link rule let an annex no reader could reach pass |
| `check-skill.mjs` — 48 KB budget | Two real ones. `germany.md` reached 54.9 KB after §19 UStG and §27(38) were read in full, which is why the first annex exists; then `eu-gdpr.md` reached 52.5 KB after its eight articles were read on EUR-Lex. Both times the check said to split rather than raise the budget, and the worst-case turn fell — 62.5 → 50.6 KB, then 60.1 → 51.1 KB |
| `check-skill.mjs` — annex of a layer | Classifying by the `eu-` prefix before resolving a parent made `eu-gdpr-fines.md` a shared layer, which silently exempted it from the only rule that keeps an annex reachable. Watched fail with the old single-hyphen `parentOf` restored, which resolved it to an `eu.md` that does not exist |
| `check-skill.mjs` — section references | Watched fail both ways on 2026-11-11: with the rule disabled a pack pointing at `§9` of a five-section pack passed, and with it on the real tree it passed, confirming that two renumberings earlier the same day had been fixed completely by hand. That hand-fixing is what the rule replaces |
| `check-skill.mjs` — assertion budget | Hit at 183.1 KB of the 192 KB support budget with nothing wasteful in it: `facts.mjs` had grown from 25 KB to 39 KB in a day because every verified claim adds an entry. Split out rather than raised, and the arithmetic test caught the derived folder total the moment it did |
| `check-skill.mjs` — support budget | A real one at 511.6 KB of the old 512 KB folder budget, reported as *"something bulky got in"* when what had grown was a verified pack. Watched fail again with the new budget raised, to confirm the test fails for the right reason |
| `check-markdown.mjs` | A real defect: a maintenance-table row in `eu-ai-act.md` separated from its table by a blank line, and two empty headings in `docs/local-ui.md`. Then seven more: every section divider in the four national packs sat directly under a paragraph, so seven closing paragraphs were rendering as `<h2>` |
| `check-facts.mjs` | Four real mismatches, listed above |
| `check-freshness.mjs` | Three packs whose recheck date did not parse, because the period sat inside the bold. Then, once the Status column became a vocabulary: an `Unconfirmed` row in `belgium.md` dated `—`, hiding that the Staatsblad really had been searched, and five `Elsewhere` rows dated as though a check had happened in a pack that only points elsewhere |
| `check-links.mjs` | A `wetten.overheid.nl` redirect to a dated URL, and a moved CNIL page |
| `check-links.mjs` — statute versions | Nothing yet, and that is the finding: on 2026-11-13 all **six** Dutch statute readings in the packs matched the version in force. Watched failing with one date edited, to see that the message names both dates and the file to reread |
| `check-dossier.mjs` | Its tests break it on purpose, including a three-hop cycle and a dangling link. And on 2026-11-13 it found real content: the shipped worked example's only customer-evidence source pointed at a file that did not exist, and its artifact `location` pointed at `files/offer-v1.md` while the file sat beside the dossier. A behavioural eval run found the first; the new location check found the second |
| `test/conventions.test.mjs` | A deliberately added `--- 9. ---` section with no tests, and `lib/graph.mjs` added without a README entry |

## Why the link check also reads statute versions

A dead URL is loud. `check-links.mjs` fails, and a maintainer can see that a claim's evidence is gone.

**An amended statute is silent.** The URL still resolves, the page still looks official, and the article a pack quoted may have been rewritten since it was read. Nothing in the project noticed that, and it is the failure mode with the worst consequences: a pack that goes on asserting repealed law, with a check date next to it that makes it look verified.

`wetten.overheid.nl` answers the question for free. The undated `/BWBR0005289` redirects to `/BWBR0005289/<date>` — the version in force today — so a reading that states which version it used can be compared against it with one extra request to a host already in the queue. Four of the packs' six Dutch readings state the version in the source annotation (*"read on the official portal in the version `Geldend van 16-07-2026`"*) and two state it in a dated URL; both are read.

**It warns and never fails**, for two reasons that are not politeness. An amendment may not touch the articles quoted, so a mismatch is a prompt to reread rather than a proven error — and a pack may cite an older version deliberately, beside a `Withdrawn` row, which is the record working as intended. What the warning carries is the pair of dates and the file to reread, which is the part a maintainer cannot derive themselves.

**No equivalent exists for the other portals yet.** `gesetze-im-internet.de` serves no version in its URLs, EUR-Lex consolidations are dated in the CELEX number rather than by redirect, and Justel's version is in the page body. So this covers the Netherlands and says so, rather than pretending to cover four countries.

## What makes check-links slow, measured rather than guessed

Every other check runs in under 150 ms. `check-links.mjs` takes thirteen seconds, and before changing anything about it, it was measured on the real citation set on **2026-11-12**. Three results, two of them negative, recorded so nobody pays for them twice.

**The median probe takes 135 ms, and one URL takes nine seconds.** Across 114 cited URLs and two passes: p50 135 ms, p90 616 ms, p95 938 ms — and then [the Justel consolidated economic code](https://www.ejustice.just.fgov.be/eli/loi/2013/02/28/2013A11134/justel) at **9 to 13 seconds**, every time. That one URL sets the floor for the whole run and **no client-side change can lower it**: a bare `HEAD` on it takes 8.7 s, because the server generates the whole 6 MB document before answering. Probing it with `GET` and cancelling the body is no faster. If a run ever has to be quicker than this, the only lever is not citing that route — and the content is worth more than the nine seconds.

**Negative result: spreading the queue across hosts does nothing.** Sorting by URL clusters a host's URLs together, so the shared queue of width 8 puts up to eight requests into one government host. Round-robin ordering by host cuts same-host adjacent pairs from 83 to 11 — and changed the wall clock by **5 ms** in one pass and made it worse in the other. The run is bounded by the slow URL above, not by contention, so **ordering is not a lever**. Raising the width to 16 did nothing either, for the same reason.

**What was actually wrong was not speed.** Two consecutive runs disagreed about which sources were reachable: 101 live, then 94, then 102. The cause was precise — `gesetze-im-internet.de` holds 23 of the 114 URLs, and under eight unbounded workers five of them answered `ECONNRESET`. The report was stating as fact something that changed per run. Two fixes, both measured:

| Change | Effect |
| --- | --- |
| **Retry a transport failure once** (`probe.mjs`, `DEFAULT_TRANSPORT_ATTEMPTS`) | Not enough on its own — the retry fired straight back into the same rate limit. Kept because it is nearly free: a connection error returns in milliseconds, and no probe in the set reached the 15 s timeout. Our own timeout is deliberately **not** retried |
| **One request per host** (`pool.mjs`, `keyOf` and `keyLimit`) | The fix. Two runs, identical results, zero resets. Costs about **two seconds**, all of it the Justel URL's five siblings now queueing behind it |

`keyLimit: 2` was tried and reset once in two passes, so it is not safe here; `keyLimit: 1` with width 8 and with width 31 gave the same time, because the bound is that one host's lane and not the global width. **Width 8, one per host.**

**And the runner now overlaps the waiting with the work.** `check-all.mjs` ran the seven checks strictly in sequence, so fourteen of its thirty seconds were spent with an idle CPU waiting on government portals. The network check is now started before the local loop and awaited after it, with its output captured and printed in its declared position so the report reads exactly as before — the order is documented, because the test suite comes first for a reason. Measured over three alternating pairs: **29.7 s to 23.6 s on average, and parallel won every pair.** The summary now also prints each check's duration, because the first version of this section could not have been written without measuring, and the place a maintainer will look is the summary they already read.

**Where it stops being worth optimising.** With the waiting overlapped, the run is bounded by that one Justel URL and nothing else is close. The test suite takes 3.7 s and is **already parallel** — `node --test` runs the files concurrently, so the suite costs what its longest file costs: `check-skill.test.mjs` at 3.3 s, which is about sixty child processes at Node's startup cost. Halving that would need either the entrypoint refactored into an importable module — losing the end-to-end property the suite header relies on — or the file split in two, which `test/conventions.test.mjs` forbids for good reason. And it would buy nothing in `check-all`, where those 3.7 s now run inside the network check's fourteen. **The remaining local checks are 44 to 77 ms each, which is Node starting up.** So this is the floor until the Justel citation changes or a check starts doing real work.

**And one correctness bug surfaced while measuring.** `EAI_AGAIN` — POSIX for *temporary* failure in name resolution — was classified as `dead`, the one network state that fails the build. A DNS hiccup would therefore have reported a government source as gone. It is now retried and, if it persists, reported as `unreachable` like any other transient fault. `ENOTFOUND` still means dead.

## The seven size budgets

`check-skill.mjs` enforces seven, because they measure seven different costs. They are listed in order of how much each one matters.

| Budget | Covers | Why |
| --- | --- | --- |
| **10 KB** | `SKILL.md` alone | The host loads this on **every turn**, used or not. The most expensive kilobyte in the project, and the budget to defend hardest. |
| **48 KB** | the **largest single** file in `references/` | Progressive disclosure means the model opens *one* pack. A founder in Berlin never pays for the French pack, so the per-conversation cost is `SKILL.md` plus the biggest thing it might open. |
| 768 KB | `SKILL.md` + all of `references/` | A **distribution** bound, not a per-turn cost: how much a reader has to trust and a maintainer has to recheck. Deliberately loose, so a new jurisdiction is never blocked by the ones a given conversation will not read. Re-derived from what one fully-worked country costs — see the procedure below. |
| 192 KB | `scripts/` and `docs/` as installed — everything shipped that the model never reads | Loose, and only there to catch accidental bulk on the half a turn never pays for. |
| 192 KB | `scripts/test/` alone | Test code is *deliberate* bulk. Giving it its own bound keeps a runaway fixture catchable without letting a fixture compete with a jurisdiction pack. |
| 96 KB | `scripts/lib/facts.mjs` alone | The assertion table holds one entry per verified claim, so it grows with the packs **by design** — 25 KB at 101 assertions and 39 KB at 174 on the same day. Charged apart for the same reason as the tests: a newly verified fact must not compete with the tooling that verifies facts. |
| 96 KB | `evals/` — the case suite and the run log | `results.md` grows by one run and never shrinks, because the suite's own rule is that a score without its transcripts cannot be acted on. Charged apart on 2026-11-13, when the second run of the day pushed the support half over 192 KB and made *recording a run* compete with *shipping the tooling*. A log and a budget for accidental bulk do not belong in the same number. |

The folder as installed has no budget of its own: it is the model-facing set plus the support files plus the assertion table plus `evals/`, so `FOLDER_BUDGET_KB` is **derived** as 768 + 192 + 96 + 96 = 1152 KB and only reported. Exceeding it means exceeding one of the four, and each of those fails with a message that names the right one. A test asserts that arithmetic rather than the number, after the first version hard-coded 576 and broke on the next raise — it then caught the assertion table being split out, and caught `evals/` being split out the same way. Both times that was the check working. **Anything charged apart in future has to be added to `FOLDER_BUDGET_KB` too**, or the total stops being the sum of the parts and becomes a budget nobody set on purpose.

The check also reports the **worst-case turn** — always-loaded plus the largest reference — which is the number to watch. Run it rather than trusting a figure quoted in a document; that is why it prints them.

**The same bug four times, each a level further out.** Measuring only the folder, as this check first did, would have blocked adding a jurisdiction pack because the *tooling* had grown. Measuring only the aggregate, as it did next, priced every pack into every conversation, so closing an open topic in one country competed for budget with another country. Then the test suite reached 95 KB and started drawing on the same 512 KB as the packs, so a new fixture would have blocked a new pack. Then the folder budget itself failed when a pack grew — with the message *"something bulky got in"*, which sends a maintainer looking for a stray binary instead of at the budget that was actually exceeded. In each case the fix was the same: **charge for what is actually loaded, by whoever actually loads it**, and let a failure name the half that caused it.

### Why the aggregate is derived from a jurisdiction and not from a file

It is the budget that has moved most — 192, 256, 320, 384, now 512, see the history below — which is itself the reason to record the argument each time. The last two moves happened on the same day, and that is worth explaining rather than hiding, because the first of them used the wrong unit.

**The move to 384.** The AI Act layer went 371 bytes over after being rewritten from the consolidated regulation. Trimming 371 bytes was possible and would have been the wrong fix: by then the **nine** files in `references/jurisdictions/` were 261 KB of the 320 KB on their own, leaving 59 KB for the method references — so a tenth pack of ordinary size could not have fitted whatever anyone trimmed. The number had quietly become the thing its own entry above says it must not be: a bound that blocks a new country. 384 KB was set as 320 plus 64: **one more file at the 48 KB per-reference ceiling, plus margin.**

**Why that unit was wrong, five hours later.** Reading the GDPR onto EUR-Lex and the BDSG onto `gesetze-im-internet.de` produced two more annexes for the GDPR layer and one for the German pack, and the set reached 380.9 KB of 384. The derivation had assumed a jurisdiction costs one file. It no longer does: **Germany is three files and 75 KB** — the pack, the e-invoicing annex and the data-protection annex — and that is what a country looks like once its statutes are actually read rather than summarised. A per-file bound cannot hold a per-country unit.

So 512 KB, derived as the set as it stands plus one more country at the size the most-worked country has reached, rounded up a step: 380.9 + 75.3 = 456.2, and the next 64 KB step above that is 512.

**The same derivation, run again on 2026-11-12, gives 640, and a third time the same night gives 768.** The set had reached 505.0 KB with Germany at 89.2 KB, so 594.2 and the next step is 640; by the end of that night the set was 636.8 KB and Germany 102.0 KB, so 738.8 and the next step is 768. Two things are worth noticing about that. The first is that **the derivation is stable** — it was applied twice, four days apart, without being argued from scratch, which is what a written-down procedure is for. The second is that **the cost of a country keeps rising**: 75 KB on 2026-11-11, 89 KB on 2026-11-12, because every statute actually read displaces a paraphrase that was shorter and wrong. Expect the next re-derivation to want a bigger step, and do not read the growth as bloat without checking which of it is sourced law.

**The per-turn budgets were not touched, and annexing improved them.** Those are the ones a user pays: `SKILL.md` is 7.5 KB of 10 KB, the largest single reference 45.0 KB of 48 KB, and the worst-case turn **fell from 62.5 KB this morning to 52.5 KB** even as the distributed set grew by a third. That is the whole argument for splitting rather than raising the per-reference budget, and for keeping the two kinds of budget separate.

So the rule for the next contributor: this budget tracks **jurisdictions, not files**, and running into it is a prompt to re-derive it from what one fully-worked country now costs — never to shave sentences out of sourced law. The per-turn budgets are the ones to defend by splitting, and `germany-e-invoicing.md`, `eu-gdpr-fines.md`, `eu-gdpr-dpo-dpia.md` and `germany-data-protection.md` are what that looks like.

**And a message bug worth remembering.** `kb()` rounds, so a file one byte over the 10 KB budget reported `10.0 KB is over the 10 KB budget` — which reads as the check contradicting itself, and whose first interpretation is that the check is broken. `overBudget()` states the excess in bytes instead: `10.0 KB, over the 10 KB always-loaded budget by 1 byte`.

### When a budget was last changed, and why

Kept here so a raise is never silent. The constants live in `check-skill.mjs`; change them there and this table together.

| Date | Change | At the time |
| --- | --- | --- |
| — | model-facing, initially **192 KB** | Set when the model-facing set was 142.7 KB |
| 2026-11-10 | model-facing 192 → 256 KB | Raised at 177.5 KB. Closing open topics adds verified content, and 14.5 KB of headroom was about to block that work — raised on an explicit decision, not to turn a red build green |
| 2026-11-10 | **10 KB** always-loaded and **48 KB** per-reference added | SKILL.md was 7.5 KB and the largest reference 36.1 KB. They encode what the aggregate could not: the per-turn cost is bounded by one pack, and SKILL.md growing is far worse than `references/` growing |
| 2026-11-11 | model-facing 256 → 320 KB, and **192 KB** test budget added | The test suite had reached 95 KB. Nothing was over budget; the point was that it was about to be, for the wrong reason — a fixture and a jurisdiction pack drawing on the same 512 KB |
| 2026-11-11 | model-facing 320 → **384 KB** | Raised at 320.4 KB, from the pack count rather than from the overage: nine jurisdiction files held 261 KB of it, so a tenth pack could not have fitted at any amount of trimming. 384 is one more file at the 48 KB per-reference ceiling plus margin. Reasoned through above |
| 2026-11-11 | model-facing 384 → **512 KB** | Hit at 380.9 KB the same day, after the GDPR and BDSG reads produced three annexes. Re-derived from the unit that was wrong in the row above: a jurisdiction, not a file. Germany is now three files and 75 KB, so the set plus one more country at that size is 456 KB, and the next step is 512. The worst-case turn fell to 52.5 KB over the same work |
| 2026-11-11 | the **512 KB** folder budget replaced by a **192 KB** support budget, with the folder total derived as 576 KB | Hit at 511.6 KB while reading the GDPR onto EUR-Lex. It was not a raise: 384 model-facing plus 160 KB of legitimate `scripts/` and `docs/` already exceeded 512, so the folder number had become unreachable for the same structural reason as the aggregate above. Splitting it puts the failure on the half that grew — and the half the model never reads is where *"something bulky got in"* actually belongs |
| 2026-11-12 | model-facing 640 → **768 KB** | Hit at 636.8 KB of 640 the same night, after the GDPR restriction articles, the Belgian VAT and e-invoicing statutes, the AI Act's national layer and its high-risk requirements were read. Re-derived the same way: the set plus one more country at Germany's **102.0 KB** is 738.8, so 768. Germany cost 75 KB on 2026-11-11, 89 KB that morning and 102 KB that night — the number this procedure tracks is still growing, and that is sourced law replacing paraphrase |
| 2026-11-12 | model-facing 512 → **640 KB** | Hit at 505.0 KB of 512 after the CNIL's prospecting material was read into the French annex. Re-derived by the procedure above rather than re-argued: the set plus one more country at Germany's 89.2 KB is 594.2, so 640. The per-turn budgets were not touched and did not need to be — SKILL.md 7.7 KB of 10, largest reference 47.3 KB of 48 |
| 2026-11-13 | **96 KB** eval budget added for `evals/`, and the folder total re-derived as 1120 KB | Hit at 196.7 KB of 192 KB support, 4.7 KB over, when the second behavioural run of the day was written into `results.md`. Not a raise and not waste: the file is an append-only log of scored runs with their transcripts, and the support budget exists to catch stray bulk on the half the model never reads. Same remedy as the assertion table and the test suite. 96 KB is 56.6 KB used, so roughly four more runs recorded before anyone has to think about it |
| 2026-11-13 | assertion table 64 -> **96 KB**, and the folder total re-derived as 1152 KB | Hit at 64.1 KB of 64, 86 bytes over, while the Belgian VAT annex and the Dutch contract articles added nine assertions between them. Re-derived from the claim count as the failure message says to: 273 assertions over 64.1 KB is about 240 bytes each, so the number was always the count and never a margin. 96 KB is roughly 410 assertions, another fully-worked jurisdiction s worth |
| 2026-11-11 | **64 KB** assertion-table budget added, and the folder total re-derived as 768 KB | Hit at 183.1 KB of 192 KB support with no waste: `scripts/lib/facts.mjs` is one entry per verified claim and had gone from 25 KB at 101 assertions to 39 KB at 174 in a day. Charged apart for the reason the test suite already is — a newly verified fact must not compete with the tooling that verifies facts. 64 KB is roughly another 170 assertions |

**Before raising one, ask what it is telling you.** Before raising the model-facing budget, ask whether the packs should be condensed instead. Before raising the always-loaded budget, ask what behaviour the extra instruction buys. Verified prose earns its space; restated prose does not.

## CI

`.github/workflows/skill.yml` runs them in two jobs, because they fail for different reasons:

| Job | Runs | Where |
| --- | --- | --- |
| `checks` | `check-all.mjs --offline` — the tests and every check that needs no network | ubuntu **and** windows. These walk directories and format relative paths, so Windows is where a separator bug would appear |
| `links` | `check-links.mjs`, then `build-zip.mjs` | ubuntu only. One OS is enough to learn that a URL is gone, and a portal having a bad morning should not look like a path bug |

A third job runs `check-freshness.mjs` on a weekly schedule, where a stale pack opens an issue instead of failing a build. `.github/workflows/quality.yml` covers the frozen runtime and, in its `audit` job, `npm run test:scripts` and the repository-wide link check.
