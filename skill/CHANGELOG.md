# Changelog — the skill

The skill is versioned **independently** of the legacy runtime's `package.json`. A runtime release number says nothing about this folder, and vice versa.

Separately versioned again is the dossier file format, currently `startkompas-dossier/1`. A skill release may change without touching the format; a format change is a breaking change and gets its own number.

## 0.1.0 — 2026-11-10

First release of the skill as a standalone, host-neutral, dependency-free folder.

**What it is.** 38 files; 20 of them model-facing at 234.0 KB, and 332.6 KB for the whole folder. The number that describes the actual cost is smaller: because references load on demand, a turn pays for `SKILL.md` (7.5 KB) plus **one** reference, so the **worst case is 42.6 KB**. Installs by copying the folder into Claude Code, claude.ai or Codex. No Node, no npm, no dependencies, no server, no API key.

**Separated from the runtime.** The previously installed skill carried the whole repository as a runtime — 352 files, ~5.7 MB, plus ~23 MB of `node_modules` — to support ~30 KB of instructions, and six of its eleven references only pointed at files inside that runtime. Everything needed is now inside the folder.

**Worldwide method, per-jurisdiction rules.** The eight pilot-condition topics are jurisdiction-neutral. Country-specific requirements live in **seven** verified packs — four national (Belgium, Netherlands, Germany, France) plus three shared EU layers (`eu-gdpr`, `eu-vat-sme`, `eu-ai-act`) so a rule common to all four is stated once. All checked **2026-11-10**, each stating per claim whether its source was read, carried from earlier research, or not researched. Where no pack exists, the research protocol forbids stating any threshold, rate, fee or deadline that was not read in a fetched source.

**Fourteen official PDFs read, not summarised.** Guidance that a normal fetch cannot read, because the PDFs use subset fonts, was extracted and read in full. That is where the pack's distinctive content comes from — and it corrected the packs twice: a German Kleinunternehmer is **exempt** from issuing an e-invoice rather than deferred to 2028, and two documents that read like current authority guidance are dated January and April **2018**.

**The dossier format** is documented as plain files — `project.json`, `files/`, append-only `.history/` — with a declared dependency graph and change-propagation rules that were previously enforced only by Node code. A worked example at revision 3 ships with it.

**Checks.** Five, run together by `scripts/check-all.mjs` with no dependencies:

| Check | What it enforces |
| --- | --- |
| `check-skill.mjs` | Frontmatter, link integrity, reference reachability, host neutrality, no runtime coupling, the six-section pack template, and **four** size budgets — always-loaded, largest single reference, model-facing total, whole folder |
| `check-dossier.mjs` | Runs the change-propagation walk over the worked example from every node, asserting termination and no cycles |
| `check-facts.mjs` | 65 named claims the eval cases depend on, plus 3 forbidden patterns so a reversed claim cannot return |
| `check-freshness.mjs` | Packs past their recheck date, and drift between a pack's body markers and its maintenance table |
| `check-links.mjs` | Probes every cited source URL; reports rather than fails on a 403, since a bot block is not a dead link |

**Known limits at this release.**

- No behavioural eval has been scored on any host. An instruction-coverage audit found and fixed four real gaps — see [evals/results.md](evals/results.md) — but that is a desk check, not evidence of behaviour.
- Installed and structurally verified on Windows for Claude Code and Codex. Not verified on macOS or Linux, and discovery and progressive disclosure are unverified everywhere.
- **33 topics across the seven packs are marked `[not researched]`.** That number rose as the research progressed, because closing a vague gap names two specific ones; every one is named in the pack that owns it rather than left implicit.
- One general-method source in `references/offer-and-market.md` still carries a **2026-10-27** check date. Every jurisdiction claim is 2026-11-10.
- The pack content is further ahead than the evidence it works. **No pack has had an independent legal or tax review**, and that is stated at the foot of each one.
- No independent user, security or legal review of any part of this.
