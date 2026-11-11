# Checks

Standard library only. No dependencies, no lockfile, no install step — the skill itself needs no runtime, and neither do its checks.

```sh
node scripts/check-all.mjs              # run everything
node scripts/check-all.mjs --offline    # skip the one check that needs the network
node scripts/check-all.mjs --quiet      # summary only; prints detail for failures
```

Run `check-all.mjs`. The individual scripts exist for when you want one check's detail.

## What each one proves

| Script | Proves | Fails on | Network |
| --- | --- | --- | --- |
| `check-skill.mjs` | The skill is structurally sound, self-contained and host-neutral | Bad frontmatter, dead relative link, unreachable reference, a reference linking outside the model-facing set, reintroduced runtime coupling, a named host, an undated or off-template pack, over budget, a binary | no |
| `check-markdown.mjs` | The markdown renders as written | A table split by a blank line, a ragged row, a separator with no header, a duplicate heading, an unclosed code fence | no |
| `check-dossier.mjs` | The change-propagation algorithm in `references/dossier-format.md` terminates, and is acyclic | Broken reference, duplicate id, invalid assertion value, a dependency cycle — reported as the path round the loop | no |
| `check-facts.mjs` | Packs and eval cases still agree | A fact a case depends on has moved, or a reversed claim has returned | no |
| `check-freshness.mjs` | No pack is past its recheck date | Missing recheck date, overdue recheck, a verified claim older than 183 days | no |
| `check-links.mjs` | Every cited source URL still resolves | 404, 410, or a host that does not resolve | **yes** |
| `build-zip.mjs` | The upload archive has `SKILL.md` at its root | `SKILL.md` not at the archive root | no |
| `test/*.test.mjs` | **The checks above actually catch what they claim to** | A check that passes a tree it should reject | no |

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

### What the suite is guarding, beyond correctness

Two tests assert a **cost**, not a behaviour, because both were real regressions waiting to happen:

- `mapPool` keeps workers busy rather than waiting for a batch. `check-links.mjs` used to slice URLs into fixed batches, so one government portal on a 15-second timeout idled five workers. The run went from about 5.0 s to 1.8 s.
- `check-dossier.mjs` handles a large dossier in linear time. Cycle detection used to be a reachability walk from *every* record: 8000 records took 1.4 s and doubling the records quadrupled it. One depth-first search does it in about 60 ms, and the test uses 16000 records with a loose 3-second bound — wide enough not to be flaky on a busy runner, tight enough that a quadratic implementation cannot pass.

A dossier is the one artefact here that grows without bound over a project's life, and this check is documented as safe to point at a real one, so its cost is part of its contract.

### What the suite found on its first run

The first negative test written — "missing `SKILL.md` fails" — failed. `check-skill.mjs` reported the missing file in section 1 and then crashed with an unhandled `ENOENT` in section 4, because two later sections read `SKILL.md` without checking it was there. A contributor whose `SKILL.md` was missing got a stack trace instead of the one sentence that would have told them why. That is the argument for this directory in one example.

## The five size budgets

`check-skill.mjs` enforces five, because they measure five different costs. They are listed in order of how much each one matters.

| Budget | Covers | Why |
| --- | --- | --- |
| **10 KB** | `SKILL.md` alone | The host loads this on **every turn**, used or not. The most expensive kilobyte in the project, and the budget to defend hardest. |
| **48 KB** | the **largest single** file in `references/` | Progressive disclosure means the model opens *one* pack. A founder in Berlin never pays for the French pack, so the per-conversation cost is `SKILL.md` plus the biggest thing it might open. |
| 320 KB | `SKILL.md` + all of `references/` | A **distribution** bound, not a per-turn cost: how much a reader has to trust and a maintainer has to recheck. Deliberately loose, so the ninth pack is not blocked by the eight a given conversation will not read. |
| 512 KB | the folder as installed, **excluding** `scripts/test/` | Loose, and only there to catch accidental bulk. |
| 192 KB | `scripts/test/` alone | Test code is *deliberate* bulk. Giving it its own bound keeps a runaway fixture catchable without letting a fixture compete with a jurisdiction pack. |

The check also reports the **worst-case turn** — always-loaded plus the largest reference — which is the number to watch. Run it rather than trusting a figure quoted in a document; that is why it prints them.

**The same bug three times, each a level further out.** Measuring only the folder, as this check first did, would have blocked adding a jurisdiction pack because the *tooling* had grown. Measuring only the aggregate, as it did next, priced every pack into every conversation, so closing an open topic in one country competed for budget with another country. Then the test suite reached 95 KB and started drawing on the same 512 KB as the packs, so a new fixture would have blocked a new pack. In each case the fix was the same: **charge for what is actually loaded, by whoever actually loads it.**

### When a budget was last changed, and why

Kept here so a raise is never silent. The constants live in `check-skill.mjs`; change them there and this table together.

| Date | Change | At the time |
| --- | --- | --- |
| — | **320 KB** model-facing, initially 192 KB | Set when the model-facing set was 142.7 KB |
| 2026-11-10 | model-facing 192 → 256 KB | Raised at 177.5 KB. Closing open topics adds verified content, and 14.5 KB of headroom was about to block that work — raised on an explicit decision, not to turn a red build green |
| 2026-11-10 | **10 KB** always-loaded and **48 KB** per-reference added | SKILL.md was 7.5 KB and the largest reference 36.1 KB. They encode what the aggregate could not: the per-turn cost is bounded by one pack, and SKILL.md growing is far worse than `references/` growing |
| 2026-11-11 | model-facing 256 → 320 KB, and **192 KB** test budget added | The test suite had reached 95 KB. Nothing was over budget; the point was that it was about to be, for the wrong reason — a fixture and a jurisdiction pack drawing on the same 512 KB |

**Before raising one, ask what it is telling you.** Before raising the model-facing budget, ask whether the packs should be condensed instead. Before raising the always-loaded budget, ask what behaviour the extra instruction buys. Verified prose earns its space; restated prose does not.

**And a message bug worth remembering.** `kb()` rounds, so a file one byte over the 10 KB budget reported `10.0 KB is over the 10 KB budget` — which reads as the check contradicting itself, and whose first interpretation is that the check is broken. `overBudget()` states the excess in bytes instead: `10.0 KB, over the 10 KB always-loaded budget by 1 byte`.

The same distinction is why references may only link to `SKILL.md` or to each other: if a reference pointed into `scripts/` or `evals/`, the model could be sent to a file that is not part of what it should be reading. That closure is enforced.

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
| `check-facts.mjs` | Four real mismatches, listed above |
| `check-freshness.mjs` | Three packs whose recheck date did not parse, because the period sat inside the bold |
| `check-links.mjs` | A `wetten.overheid.nl` redirect to a dated URL, and a moved CNIL page |
| `check-dossier.mjs` | Not yet — the worked example has been correct since it was written. Break it on purpose if you change the walk. |

## How this directory is laid out

Three kinds of file, and the kind tells you what to expect:

| Where | What it is | Rule |
| --- | --- | --- |
| `scripts/*.mjs` | **Runnable programs.** Each has a shebang, a header saying why it exists, and a usage line | Reserved for programs. A module that is only imported does not belong here, and `test/conventions.test.mjs` enforces that |
| `scripts/lib/*.mjs` | **Imported modules.** No shebang, never executed directly | See the two groups below |
| `scripts/test/*.test.mjs` | **Tests**, plus `helpers.mjs` for fixtures | Charged to their own size budget, because test code is deliberate bulk |

### `lib/` — generic infrastructure

Nothing in these is specific to this project; any check could use them. The first three were extracted because the same code had been written three and six times over.

| Module | Checks using it | Holds |
| --- | --- | --- |
| `paths.mjs` | all 7 | The directories every check needs, resolved from the lib's own location so a script works from any cwd. Also the `STARTKOMPAS_SKILL_ROOT` test seam |
| `report.mjs` | 6 | One reporting shape — `note` / `warn` / `fail` / `finish` — so every check's output and exit behaviour match |
| `files.mjs` | 4 | Recursive sorted file listing, forward-slash path formatting, size and budget-overage formatting |
| `pool.mjs` | 1 | Bounded-concurrency mapping, so a slow request delays only itself. Generic, but `check-links.mjs` is its only consumer today |

### `lib/` — one check's logic, pulled out to be testable

Each of these has exactly **one** check that uses it, plus its test. They are in `lib/` rather than beside that check because the top level is for programs, and a program cannot be imported without running it. Pulling the logic out is what lets a test feed it synthetic input instead of driving the whole check.

| Module | Used by | Why it is separate |
| --- | --- | --- |
| `citations.mjs` | `check-links.mjs` | Decides which URLs get probed at all. A URL it fails to see is a claim whose evidence is never checked, so it is worth testing without a network |
| `probe.mjs` | `check-links.mjs` | Decides what each HTTP response *means*. Takes an injectable `fetch`, so the dead-or-merely-awkward table is tested with no network and no server |
| `facts.mjs` | `check-facts.mjs` | The assertion tables **and** a pure `evaluate()`. The tables are data that goes wrong in specific ways — a duplicate label, a pattern naming a pack that no longer exists — so they are tested as data |

**`facts.mjs` is the one surprise in here**, since it holds claims about German VAT rather than general-purpose code. It sits in `lib/` for the structural reason above, not because it is reusable. If you are looking for the fact assertions, start from `check-facts.mjs`, which is a 34-line CLI around it.

Honest note on the original extraction: it did **not** reduce total lines — 732 across six scripts became 935 across ten. What it removed was three copies of a directory walk, three copies of a problem-reporting block, six hand-rolled root resolutions, and two different functions confusingly both named `walk`. The trade is slightly more code for no duplication and one way to do each thing.

## CI

`.github/workflows/skill.yml` runs these on every push and pull request, and `check-freshness.mjs` again on a weekly schedule where a stale pack opens an issue instead of failing a build.
