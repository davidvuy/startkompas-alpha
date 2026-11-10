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
| `check-dossier.mjs` | The change-propagation algorithm in `references/dossier-format.md` terminates | Broken reference, duplicate id, invalid assertion value, a dependency cycle, a non-terminating walk | no |
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

### What the suite found on its first run

The first negative test written — "missing `SKILL.md` fails" — failed. `check-skill.mjs` reported the missing file in section 1 and then crashed with an unhandled `ENOENT` in section 4, because two later sections read `SKILL.md` without checking it was there. A contributor whose `SKILL.md` was missing got a stack trace instead of the one sentence that would have told them why. That is the argument for this directory in one example.

## The four size budgets

`check-skill.mjs` enforces four, because they measure four different costs. They are listed in order of how much each one matters.

| Budget | Covers | Why |
| --- | --- | --- |
| **10 KB** | `SKILL.md` alone | The host loads this on **every turn**, used or not. The most expensive kilobyte in the project, and the budget to defend hardest. |
| **48 KB** | the **largest single** file in `references/` | Progressive disclosure means the model opens *one* pack. A founder in Berlin never pays for the French pack, so the per-conversation cost is `SKILL.md` plus the biggest thing it might open. |
| 320 KB | `SKILL.md` + all of `references/` | A **distribution** bound, not a per-turn cost: how much a reader has to trust and a maintainer has to recheck. Deliberately the loosest of the three, so the ninth pack is not blocked by the eight a given conversation will not read. |
| 512 KB | the whole folder | Loose, and only there to catch accidental bulk. `scripts/` and `evals/` are never read by a model. |

The check also reports the **worst-case turn** — always-loaded plus the largest reference — which is the number to watch. Run it rather than trusting a figure quoted in a document; that is why it prints them.

**Two bugs of the same shape, both fixed.** Measuring only the folder, as this check first did, would have blocked adding a jurisdiction pack because the *tooling* had grown. Measuring only the aggregate, as it did next, had the same bug one level up: it priced every pack into every conversation and made closing an open topic in one country compete for budget with another country. A budget should charge for what is actually loaded.

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

## `lib/`

Three modules, extracted because the same code had been written three and six times over.

| Module | Holds |
| --- | --- |
| `paths.mjs` | The directories every check needs, resolved once from the lib's own location — so a script works from any cwd |
| `files.mjs` | Recursive sorted file listing, forward-slash path formatting, size helpers |
| `report.mjs` | One reporting shape: `note` / `warn` / `fail` / `finish`, so every check's output and exit behaviour match |

Honest note on the refactor: pulling these out did **not** reduce total lines — 732 across six scripts became 935 across ten, of which 72 is the new `check-all.mjs` entrypoint and 93 is `lib/`. What it removed was three copies of a directory walk, three copies of a problem-reporting block, six hand-rolled root resolutions, and two different functions confusingly both named `walk`. The trade is slightly more code for no duplication and one way to do each thing.

## CI

`.github/workflows/skill.yml` runs these on every push and pull request, and `check-freshness.mjs` again on a weekly schedule where a stale pack opens an issue instead of failing a build.
