# Contributing

Start with a small fictional reproduction or a concrete user problem in [Issues](https://github.com/davidvuy/startkompas-alpha/issues/new/choose). Dutch and English are both welcome. Never include credentials, private dossiers or full chat logs.

Fork, branch, keep the change reviewable. Read [LICENSE](LICENSE) and [LICENSING.md](LICENSING.md) — code permissions do not automatically cover branding or imported material. Nothing is merged automatically and no response deadline is promised; this is a one-maintainer project.

This repository contains **two things**, and they have different contribution rules. Read the one that applies.

---

## Contributing to the skill — `skill/`

The skill is plain markdown with **no dependencies**. There is nothing to install.

```sh
cd skill
node scripts/check-all.mjs
```

Six checks, standard library only. [`skill/scripts/README.md`](skill/scripts/README.md) says what each one proves and what it fails on.

### The most useful contributions, in order

**1. A verified jurisdiction pack for your country.** The highest-value contribution there is. The bar is **verifiability, not volume**:

- Every substantive claim carries the official source URL, the source's own publication or effective date where it states one, the date *you* checked it, and a recheck trigger.
- Record conflicts between sources rather than silently picking a winner. See the three-way basic-management conflict in `belgium.md` §1 for the pattern.
- Mark the boundary of each claim: who it applies to, from when, and what it does not cover.
- **State what you did not check.** `[not researched]` is a contribution; a confident guess is a liability.
- Never produce a threshold, rate, fee or deadline you did not read in a source you actually fetched.
- Follow the six-section template — [`skill/references/jurisdictions/README.md`](skill/references/jurisdictions/README.md) documents it, and `check-skill.mjs` enforces it.
- Add the pack to the index table, and summarize in original words with links. Do not copy substantial source text.

**2. A scored eval run.** [`skill/evals/cases.md`](skill/evals/cases.md) has 22 cases and **not one has been scored on any host**. Run them against your host, record host, model, date and — for every failure — the verbatim prompt and the actual answer. A failure without the transcript cannot be acted on. Add rows to `results.md`; never overwrite an earlier run.

**3. A recheck of a stale claim.** Pick anything in a pack's maintenance table, check it against its primary source, and update the date **even when nothing changed** — "checked and unchanged on this date" is itself information.

### Two rules that matter more than they look

**When `check-facts.mjs` fails, that is a decision, not a bug.** Exactly one of two things is true: the pack improved and the eval case must be rewritten, or the edit was a mistake. Work out which. **Do not relax the assertion to make the build green** — that is the single change that silently destroys the check's value.

**Preserve recorded uncertainty.** Do not strip a `[not researched]`, an open conflict or an `unknown` to make an answer read more cleanly. The difference between a claim and evidence is the product.

---

## Contributing to the legacy runtime — `src/`, `ui/`, `tests/`

The Node CLI and browser workspace from earlier alphas. Its future is an open decision — [BACKLOG.md](BACKLOG.md) item 11 — so check there before investing in a large change.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

565 tests, no AI account required.

Preserve project identity, explicit save confirmation, revision guards, history, and the difference between claims and evidence. Discuss large schema changes first.

### Public package integrity

The repository is a selected product package: do not add private development evidence. Dependencies and workflows need human review.

After editing a file already listed in the manifest:

```sh
node scripts/refresh-public-manifest.mjs --check   # see what changed
node scripts/refresh-public-manifest.mjs --write   # refresh hashes deliberately
node scripts/check-public-package.mjs
npm test
```

This **never adds new files** to the allowlist; new files need the maintainer's reviewed packaging. A new manifest digest proves consistency only, not that anyone approved it. `source_revision` identifies the package's original private build, not subsequent community edits.

`skill/` is deliberately **excluded** from that manifest and from the legacy installer: it ships by folder copy and has its own checks.

### Templates and data modules

Use the [content submission checklist](docs/content-contributions.md) and the [fictional package rehearsal](docs/practice-modules.md). Include source rights and review status — a passing synthetic test does not establish specialist approval.

See [fork boundaries](docs/fork-updates.md) and [tested compatibility limits](docs/support-matrix.md) before merging upstream or migrating private data.

---

## Before you commit, either way

Install Gitleaks from its official repository and run:

```sh
sh scripts/scan-staged.sh
```

Opt-in, changes no Git hooks, needs a shell such as Git Bash on Windows. CI also scans public history. Redaction reduces log exposure; it is not a guarantee.

Reviewers should explain requested changes and preserve attribution. See also [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
