# docs/ — what is in here, and what it describes

**If you came for the skill, none of this is it.** The skill documents itself: [`skill/README.md`](../skill/README.md), [`skill/INSTALL.md`](../skill/INSTALL.md) and the files under `skill/references/`.

Everything in this directory describes either the **legacy Node runtime** (the CLI and browser workspace from earlier alphas) or the project's own governance. 53 files, 292 KB. It is indexed rather than pruned because the runtime is **frozen but kept** — see [DECISIONS.md](../DECISIONS.md) entry 1 for why it was neither split out nor deleted.

Classification below is by evidence, not by guess: a file counted as runtime or UI contains `node src/`, `npm run`, or browser-workspace instructions.

---

## Project status and governance

Read these to know where the project stands. The first three are current; the rest predate skill-first.

| File | What it is |
| --- | --- |
| [maintenance-readiness.md](maintenance-readiness.md) | **Current.** Who maintains what, what is deliberately unassigned, the recheck cadence, and what happens if work stops |
| [support-matrix.md](support-matrix.md) | **Current, with a caveat banner.** Compatibility evidence for the runtime — explicitly *not* evidence about the skill |
| [alpha-security-maintenance.md](alpha-security-maintenance.md) | Credential incident procedure |
| [alpha-roadmap.md](alpha-roadmap.md) | The original four-week roadmap. **Superseded by [BACKLOG.md](../BACKLOG.md)** |
| [alpha-progress.md](alpha-progress.md) | The 50-improvement register, dated 2026-10-30. **Superseded by [BACKLOG.md](../BACKLOG.md)** |
| [alpha-changelog.md](alpha-changelog.md) | Release notes for the runtime alphas 1–14.2. The skill has its own [CHANGELOG.md](../skill/CHANGELOG.md) |
| [alpha-contributing.md](alpha-contributing.md) | Contribution guidance from the runtime era |
| [alpha-support.md](alpha-support.md) | Support and FAQ from the runtime era |
| [alpha-feedback-template.md](alpha-feedback-template.md) | Feedback template |
| [alpha-improvements.md](alpha-improvements.md) | The alpha 2 guide |
| [alpha-demo.md](alpha-demo.md) | The fictional walkthrough, with the five captured CLI previews |
| [content-contributions.md](content-contributions.md) | Rules for contributed content |
| [fork-updates.md](fork-updates.md) | Guidance for forks |
| [project-command-contract-coverage.md](project-command-contract-coverage.md) | Which project commands the versioned contract covers |

## Legacy runtime — CLI, routes and setup

The command surface of `src/`. None of it is needed to use the skill.

| File | What it is |
| --- | --- |
| [commands.md](commands.md) | **The command reference, 20 KB.** Request shapes, arguments, receipts, error codes |
| [core-route.md](core-route.md) | The `1.0.0`/`1.1.0` dossier core: guarded updates, export/restore, handoff |
| [workflow-route.md](workflow-route.md) | Schema 1.1.0 material choices, change handling, reuse |
| [runtime.md](runtime.md) | Runtime requirements and diagnostics |
| [quickstart.md](quickstart.md) · [quickstart.nl.md](quickstart.nl.md) | The runtime's interactive menu, demo and project creation |
| [start-resume.md](start-resume.md) · [gebruiken.nl.md](gebruiken.nl.md) | Minimal start and resume notes |
| [alpha-workspace.md](alpha-workspace.md) · [alpha-workspace.nl.md](alpha-workspace.nl.md) | The guided founder workspace |
| [daily-work.md](daily-work.md) | The `daily-cli` brief view |
| [run-limits.md](run-limits.md) | The reported-event ledger and `run-cli` |
| [source-register.md](source-register.md) | Source-register schema and commands |
| [domain-index.md](domain-index.md) | The fifteen-domain index and its attachment route |
| [module-maintenance.md](module-maintenance.md) · [module-packages.md](module-packages.md) · [practice-modules.md](practice-modules.md) | Packaged procedural modules, trials and lifecycle notices |
| [skill-context.md](skill-context.md) | Selected-context packets |
| [document-templates.md](document-templates.md) | The five business document types |
| [pdf-export.md](pdf-export.md) | Local PDF output |
| [learning-loop.md](learning-loop.md) | The learning-review loop |

## Legacy browser workspace

The optional loopback UI in `ui/`. **`local-ui.md` alone is 57 KB — a fifth of this whole directory** — for a browser app the skill does not use.

| File | What it is |
| --- | --- |
| [local-ui.md](local-ui.md) | Workspace setup, screens, access boundaries, recovery |
| [local-collaboration.md](local-collaboration.md) | Mentor-file exchange and reviewed feedback |
| [document-verification.md](document-verification.md) | Comparing versions and affected sections |
| [export-settings.md](export-settings.md) | Export preferences and pre-share review |
| [text-import.md](text-import.md) | Importing text while keeping its original context |
| [sharing-review.md](sharing-review.md) | Selecting fields for an external copy |
| [revision-comments.md](revision-comments.md) | Comments on a revision |

## Legacy feature notes

Per-feature notes for the runtime's storage and research capabilities.

| File | What it is |
| --- | --- |
| [security-data-flows.md](security-data-flows.md) | Sensitive source and tool handling. **The one file here whose substance is carried into the skill**, as the data and authority boundaries in `SKILL.md` |
| [conversation-notes.md](conversation-notes.md) | Separating quotation from interpretation |
| [insight-timeline.md](insight-timeline.md) | Recorded events over time |
| [finding-classifications.md](finding-classifications.md) | Classifying findings |
| [research-findings.md](research-findings.md) · [research-conflicts.md](research-conflicts.md) · [research-assistance-evaluation.md](research-assistance-evaluation.md) | Retaining supporting and opposing findings |
| [source-inbox.md](source-inbox.md) · [source-summaries.md](source-summaries.md) · [source-retention.md](source-retention.md) · [source-removal.md](source-removal.md) | Source capture, summarizing, age review and privacy removal |

---

## Known staleness

Stated rather than quietly left for a reader to discover:

- **12 of these files mention Codex** and **17 contain `node src/` commands.** The skill is host-neutral and needs neither.
- **Resolved 2026-11-10:** `quickstart.md`, `start-resume.md` and `alpha-support.md` used to instruct installing the old runtime-coupled skill. That skill and its installer were removed ([DECISIONS.md](../DECISIONS.md) entry 1) and all three now point at `skill/INSTALL.md`.
- `alpha-roadmap.md` and `alpha-progress.md` are superseded by `BACKLOG.md` but are kept as the historical record of what was planned and claimed.
- Nothing in here has been rewritten for skill-first except `maintenance-readiness.md` and the banner on `support-matrix.md`.

The runtime is frozen, not parked, so this directory stays. If that decision is ever reversed ([DECISIONS.md](../DECISIONS.md) entry 1 lists what would reverse it), most of this goes with it and the governance table is the part that would remain.
