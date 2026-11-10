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
| `check-skill.mjs` | The skill is structurally sound, self-contained and host-neutral | Bad frontmatter, dead relative link, unreachable reference, reintroduced runtime coupling, a named host, an undated pack, over budget, a binary | no |
| `check-dossier.mjs` | The change-propagation algorithm in `references/dossier-format.md` terminates | Broken reference, duplicate id, invalid assertion value, a dependency cycle, a non-terminating walk | no |
| `check-facts.mjs` | Packs and eval cases still agree | A fact a case depends on has moved, or a reversed claim has returned | no |
| `check-freshness.mjs` | No pack is past its recheck date | Missing recheck date, overdue recheck, a verified claim older than 183 days | no |
| `check-links.mjs` | Every cited source URL still resolves | 404, 410, or a host that does not resolve | **yes** |
| `build-zip.mjs` | The upload archive has `SKILL.md` at its root | `SKILL.md` not at the archive root | no |

## Three conventions these follow

**A problem fails the run. A warning never does.** `check-links.mjs` is the clearest case: a 403 from Légifrance means the portal blocks bots, not that the law has gone. Failing a build on that teaches people to ignore the build.

**A failure message names what is wrong and where.** `references/jurisdictions/france.md: dead relative link -> ../foo.md`, not `validation error`.

**`check-facts.mjs` failing is a decision, not a bug.** Exactly one of two things is true: the pack improved and the eval case must be rewritten, or the edit was a mistake. Work out which. Do not relax the assertion to make the build green — that is the one change that silently destroys the check's value.

That script has already caught three real mismatches, none of them a pack error:

- the pack said "none of this is law", the assertion looked for "not yet law"
- the Belgium pack gained its enacting instrument, so C6's "primary confirmation is open" requirement would have marked a *better* answer as a failure
- two assertions written without allowing for markdown emphasis (`**not** a legal requirement`)

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
