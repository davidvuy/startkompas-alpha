<p align="left">
  <img src="assets/startkompas-header.png" alt="Startkompas — Since 2026" width="900">
</p>

# Startkompas

A skill for AI assistants that helps a solo founder prepare a small B2B service pilot **and keeps the evidence straight** — what was reported, what was observed, what is still an assumption, and which conclusions depend on it.

Install by copying one folder:

```sh
cp -r skill ~/.claude/skills/startkompas
```

No Node, no npm, no dependencies, no server, no API key. Works in Claude Code, claude.ai and Codex. Full per-host instructions: **[skill/INSTALL.md](skill/INSTALL.md)**.

This is an experimental alpha. No independent user validation has happened, and no time saving or business outcome is claimed. See [Limits](#limits) at the bottom.

## Why use it

Most assistants will cheerfully write you a business plan full of invented numbers. This one is built to refuse:

- **Separates reported, observed, inferred and unknown**, and will not promote one to another without a source.
- **Records every claim with its source and check date**, so in six months you can tell whether it still holds.
- **Tracks which conclusions depend on which assumptions**, so when a supplier, price or customer changes you learn what needs re-reviewing instead of guessing.
- **Keeps history** — a revision never erases the earlier decision or its reason.
- **Checks jurisdiction-specific rules against a primary source** instead of answering from memory, and says so plainly when it cannot.

Everything is stored as plain files in your own directory: see [skill/references/dossier-format.md](skill/references/dossier-format.md).

## Try it

Install, then in a new session:

```text
Help me draft an offer for my B2B service idea. Ask what you need to know,
keep assumptions separate from evidence, and save our work in <a private directory>.
```

To resume later:

```text
Resume my project at <that directory>. Read the saved state, tell me what
needs review, and continue the next task.
```

You do not need to name the skill — it is selected from its description.

## Jurisdictions

The method is worldwide. The **rules** are not, so they live in packs. Four are verified, all checked 2026-11-10: **Belgium, Netherlands, Germany, France**.

Why packs rather than one "EU" answer? Same question, same day, four different answers:

| Must I send structured B2B e-invoices? | |
| --- | --- |
| Belgium | already, since 2026-01-01 — including under the small-business VAT exemption |
| France | from 2027-09-01 for small founders, via an accredited platform |
| Germany | from 2028-01-01 — but must be able to *receive* since 2025-01-01 |
| Netherlands | no domestic mandate; one announced for 2030-07-01 |

For any other country the skill follows the protocol in [skill/references/jurisdictions/README.md](skill/references/jurisdictions/README.md): use the universal topic list, check that jurisdiction's own official source, record it with a date — and **never state a threshold, rate or deadline it did not actually read**.

Adding a pack for your country is the most useful contribution you can make. The bar is verifiability, not volume.

## Which thing am I installing?

This repository contains two things. You almost certainly want the first.

| | What it is | Install |
| --- | --- | --- |
| **`skill/`** | The product. 21 files of markdown, 119 KB, no dependencies. | Copy the folder — see [skill/INSTALL.md](skill/INSTALL.md). |
| `src/`, `ui/`, `start.mjs` | A legacy local Node CLI and browser workspace from earlier alphas. Deterministic file operations with no AI host. | [Download alpha 14.2 (ZIP)](https://github.com/davidvuy/startkompas-alpha/archive/refs/tags/v0.1.0-alpha.14.2.zip), then `npm ci --ignore-scripts` and `node start.mjs`. |

The legacy runtime is not required by the skill and is not the recommended route. It is kept for now because its storage and history tests are the origin of the dossier format. See [BACKLOG.md](BACKLOG.md) item 11 for its pending fate.

### Repository layout

Every directory, so nothing here is a mystery. Directories with their own README are linked.

| Path | Belongs to | What it is |
| --- | --- | --- |
| **[`skill/`](skill/README.md)** | **the skill** | The product. Markdown, no dependencies, six self-checks |
| `src/` | runtime | 94 modules: the CLI, dossier store, history, transfer, PDF export |
| `ui/` | runtime | The optional loopback browser workspace |
| `tests/` | runtime | 63 files, 565 tests |
| `schemas/` | runtime | 21 JSON schemas for the CLI's request and result shapes |
| `examples/` | runtime | Fictional demos and request fixtures |
| `templates/`, `modules/` | runtime | Document templates and packaged procedural modules |
| [`assets/`](assets/README.md) | runtime + brand | Fonts for PDF export, brand images, demo captures |
| `licenses/` | runtime | 28 dependency licence texts |
| `.agents/` | **deprecated** | The original runtime-coupled skill. Superseded by `skill/` |
| [`docs/`](docs/README.md) | mostly runtime | 53 files. The index classifies every one |
| `scripts/` | repository | Packaging, manifest, secret scan, repo-wide link check |
| `.github/` | repository | Two workflows — `quality.yml` (runtime) and `skill.yml` (skill) |

Root files: [`BACKLOG.md`](BACKLOG.md) is the 100-item plan, [`LICENSING.md`](LICENSING.md) the per-path licence scope, `installation.json` the legacy install manifest, `start.mjs` the runtime's interactive menu.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) and the [100-item backlog](BACKLOG.md), which is ordered basics-first and explicitly refuses new features until the basics are done.

Most useful contributions, in order:

1. A verified jurisdiction pack for your country.
2. A scored eval run — [skill/evals/cases.md](skill/evals/cases.md) has 18 cases and **none has been scored on any host yet**.
3. A recheck of a stale claim in an existing pack, with its new date.

[Ask a question](https://github.com/davidvuy/startkompas-alpha/discussions) · [Report a bug or suggest an improvement](https://github.com/davidvuy/startkompas-alpha/issues/new/choose) · [Report a vulnerability privately](https://github.com/davidvuy/startkompas-alpha/security/advisories/new)

Dutch and English both welcome. Never put credentials, customer data or private dossiers in a public issue.

## Limits

**Not advice.** Nothing the skill produces is legal, tax, accounting or security advice. Consequential obligations need a qualified, named, dated review in your own jurisdiction.

**No validation.** No independent user, security, accessibility or legal review of any part of this has happened. The jurisdiction packs state per claim whether the source was actually read, carried from earlier research, or not researched at all — read those markers.

**Local files are not local processing.** Text you give your assistant can be processed and retained by its provider. Removing the skill does not erase your projects, your exports, or any provider's records.

**The format is deliberately modest.** It records attribution and keeps history. It does not encrypt, lock concurrent writers, survive power loss, or establish that any recorded claim is true.

MIT — see [LICENSE](LICENSE), [LICENSING.md](LICENSING.md) and [skill/NOTICE](skill/NOTICE).
