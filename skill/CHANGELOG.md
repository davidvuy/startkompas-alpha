# Changelog — the skill

The skill is versioned **independently** of the legacy runtime's `package.json`. A runtime release number says nothing about this folder, and vice versa.

Separately versioned again is the dossier file format, currently `startkompas-dossier/1`. A skill release may change without touching the format; a format change is a breaking change and gets its own number.

## 0.1.0 — 2026-11-10

First release of the skill as a standalone, host-neutral, dependency-free folder.

**What it is.** 26 files, ~148 KB of markdown. Installs by copying the folder into Claude Code, claude.ai or Codex. No Node, no npm, no dependencies, no server, no API key.

**Separated from the runtime.** The previously installed skill carried the whole repository as a runtime — 352 files, ~5.7 MB, plus ~23 MB of `node_modules` — to support ~30 KB of instructions, and six of its eleven references only pointed at files inside that runtime. Everything needed is now inside the folder.

**Worldwide method, per-jurisdiction rules.** The eight pilot-condition topics are jurisdiction-neutral. Country-specific requirements live in verified packs: Belgium, Netherlands, Germany and France, all checked 2026-11-10, each stating per claim whether its source was read, carried from earlier research, or not researched. Where no pack exists, the research protocol forbids stating any threshold, rate, fee or deadline that was not read in a fetched source.

**The dossier format** is documented as plain files — `project.json`, `files/`, append-only `.history/` — with a declared dependency graph and change-propagation rules that were previously enforced only by Node code. A worked example at revision 3 ships with it.

**Checks.** `scripts/check-skill.mjs` verifies frontmatter, link integrity, reference reachability, host neutrality, absence of runtime coupling and a 256 KB size budget. `check-links.mjs` probes every cited source URL. `check-freshness.mjs` flags packs past their recheck date.

**Known limits at this release.**

- No behavioural eval has been scored on any host. An instruction-coverage audit found and fixed four real gaps — see [evals/results.md](evals/results.md) — but that is a desk check, not evidence of behaviour.
- Installed and structurally verified on Windows for Claude Code and Codex. Not verified on macOS or Linux, and discovery and progressive disclosure are unverified everywhere.
- 18 topics across the four packs are marked `[not researched]`, and both EDPB links plus six Belgian claims still carry their 2026-10-27 check date.
- No independent user, security or legal review of any part of this.
