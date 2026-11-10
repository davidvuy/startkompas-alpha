# Decisions

Structural choices that are expensive to revisit, with the reasoning that produced them. Newest first.

A decision records *why*, not just *what*, so that a future reader can tell whether the reasoning still holds. If it no longer holds, add a new entry superseding the old one rather than editing history.

---

## 1 — The legacy runtime stays here, frozen

**Date:** 2026-11-10 · **Status:** accepted · **Resolves:** [BACKLOG.md](BACKLOG.md) item 11, and items 12–20, 83–89 that depended on it

### Context

The repository holds two products. The skill is 37 files and 230 KB with no dependencies. The legacy Node runtime — `src/`, `ui/`, `tests/`, `schemas/`, `examples/`, `templates/`, `modules/`, `licenses/`, `start.mjs`, most of `docs/` and most of `assets/` — is 359 files and 5.8 MB, with 3 dependencies, 24 locked packages and 565 tests.

Three options were on the table: delete the runtime, split it into its own repository, or keep it.

### Decision

**Keep it in this repository, explicitly frozen.** No new features. Security fixes, dependency updates and compatibility fixes only.

**And remove the parts that actively compete with the skill**, which is a separate matter from keeping the code:

- `.agents/skills/startkompas/` — the original runtime-coupled skill — is deleted. Several of its references only pointed at `modules/` and `docs/`, so it could not stand alone, and `docs/quickstart.md` still told people to install it. A deprecated thing that a reader is actively directed toward is worse than no thing.
- `scripts/install-skill.mjs` is deleted. It copied 352 files into a skills directory and then asked the user to run `npm ci`. The skill now installs by copying one folder.
- `scripts/check-installed-skill.mjs` and its CI step are deleted, because what they tested no longer exists.

**And stop paying for it on every push.** `quality.yml` ran 3 operating systems × 2 Node versions × 565 tests on every push and pull request. For a frozen component that is waste. It now runs one job on push and pull request, and the full six-way matrix on a weekly schedule and on manual dispatch. Coverage is retained; routine cost drops by about five sixths.

### Why not split it into its own repository

- **Thirteen published release tags** (`v0.1.0-alpha.1` through `v0.1.0-alpha.14.2`) reference the full tree. A history split orphans every one of them.
- **The gain is small and the operation is not.** A `git filter-repo` or subtree split is a large, effectively irreversible change to published history, undertaken for a project with **zero users** — nobody is currently confused by the layout, because nobody is currently looking.
- **The real costs were CI minutes and visitor confusion.** Both are fixable without touching history: the CI matrix is now reduced, and the README layout table plus `docs/README.md` tell a visitor exactly which half is which.

### Why not delete it

- **It is the dossier format's reference implementation.** The format is the part of this project that is hard to reproduce, and `src/store.mjs`, `src/history.mjs` and `src/transfer.mjs` are where its write-and-verify, append-only history and export/restore behaviour were actually worked out and tested — including interrupted writes, tamper refusal and legacy migration. A specification next to a working implementation is worth more than a specification alone.
- **565 tests pass**, on three operating systems and two Node versions. That is verified work, not a liability.
- Git history would keep the code either way, but discoverability dies with a deletion, and the thing worth keeping is precisely the ability to look it up.

### Consequences

| | |
| --- | --- |
| Accepted | The repository stays larger than the product. The layout tables are what make that navigable. |
| Accepted | Dependabot keeps opening pull requests for three dependencies. Reviewing them is the cost of not deleting. |
| Rejected | **Items 83–85, formatting `src/` and `ui/` with Prettier.** Those files average 190–210 characters per line and `ui/index.html` has a 25,981-character line, so the diff would be enormous — for a frozen component that no one is going to read or contribute to. Formatting unreadable code nobody reads buys nothing. If the runtime is ever unfrozen, do this first and in its own commit. |
| Rejected | **Items 88–89, removing `pdfkit`/`fontkit` and the vestigial `ajv` layer.** Both findings stand and are recorded in `assets/README.md` and `BACKLOG.md`: 1.1 MB of fonts serve one file, and `ajv` is imported by 24 of 94 modules to validate request envelopes a model now generates. But changing a frozen component to make it tidier is not a security or compatibility fix. Leave it. |
| Kept | `installation.json` and the manifest scripts. They guard package integrity for the runtime, and `skill/` is deliberately excluded from them. |

### What would reverse this

- Someone actually using the runtime, which would mean unfreezing it rather than splitting it.
- The runtime's dependencies producing security work that outweighs its reference value — at which point deleting beats splitting, because the value was always the reference implementation and git history preserves that.
- The skill reaching a point where the repository should contain only it. That is a question to revisit *after* the first behavioural eval run, not before.
