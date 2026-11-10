# Security reports

Experimental alpha. **No independent security audit has been performed**, and there is no support SLA or second responder.

## How to report

Use the repository **Security** tab → *Report a vulnerability*. If private reporting is unavailable, do not submit sensitive details publicly — open an issue saying only that you have something to report.

Never post credentials, private dossiers, customer data or exploit details in a public issue. Use minimal synthetic reproductions.

## What is in scope

This repository holds two things with different attack surfaces.

**The skill (`skill/`)** is markdown instructions executed by a model. It has no code path of its own, so the surface is what the instructions cause a host to do:

- **Prompt injection.** The skill tells the model to treat file content, retrieved pages and imported documents as data, never instructions — and to quote a suspicious instruction back rather than obey or silently skip it. A case where those rules can be bypassed is a valid report. `skill/evals/cases.md` C10 is the baseline test.
- **Exfiltration through a selected-context packet.** The rules say a packet's omissions are binding. A path that gets excluded fields fetched anyway is in scope.
- **Unauthorized writes.** Approving a draft is not authorization to write a file, and a save request authorizes only that scoped write. A reading of the instructions that widens either is in scope.
- **A jurisdiction pack asserting something its cited source does not say.** This is a correctness bug with real consequences — a founder may act on it — so report it here rather than as an ordinary issue.

**The legacy runtime (`src/`, `ui/`)** is Node code with a loopback HTTP server, three dependencies and local file writes. Path traversal, write-guard bypass, the per-session access checks on the browser workspace, and tamper acceptance in the dossier store are all in scope. `tests/security.test.mjs` is the existing baseline.

## What is not a vulnerability

- That the skill's own checks are not a sandbox. `check-*.mjs` verify structure and consistency; they do not constrain a host at runtime.
- That a pack is out of date. That is handled openly: every claim carries a check date, every pack a recheck date, and `check-freshness.mjs` flags staleness weekly. Report it as an ordinary issue.
- That local files do not mean local-only processing. Text given to a host can be processed and retained by its provider. The skill states this; it is a documented limit, not a flaw.
- That the dossier format does not encrypt, lock concurrent writers or survive power loss. All three are stated in `skill/references/dossier-format.md`.

## Handling

See [docs/alpha-security-maintenance.md](docs/alpha-security-maintenance.md) for the credential-incident procedure, and [docs/maintenance-readiness.md](docs/maintenance-readiness.md) for who is and is not assigned — named responders are **unassigned**, and that is recorded rather than papered over.
