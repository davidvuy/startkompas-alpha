# First development runtime

Selection D16/D17 and SK05 R01–R05: Node.js **26.7.0**, plain JavaScript, node:test/assert/fs/path/crypto. .node-version and package.json engines record this exact exercised development version. Repository checks need no third-party packages. Future validator selection: Ajv 8.20.0, JSON Schema 2020-12; exact evaluation lock and licences are in evidence/sk05, not a product install.

Observed host route: Windows 11 Home 10.0.26200, PowerShell 7.6.5, Codex CLI 0.162.1 with MXC; gpt-6-astra was observed in baseline session metadata, medium effort requested. See evidence/sk03-replay/environment.json and report.md. Existing local Node persistence probes and SK05 dependency probes passed. This is the supported **repository development/check route**, not certified installed-product support. Opaque model/desktop builds remain unknown. No claim is made for other Node patches, OSes, Claude Code or an installed Startkompas skill.

The old CLI pin is a reproducibility workaround for the Windows cwd/filesystem-helper defects, not a general desktop downgrade instruction. Retest replacements and review a supported production runtime before distribution (SK36/SK37/SK45). Runtime dependency choice is complete; installation, lifecycle, interrupted-write recovery and provider retention remain untested product properties.

Primary documentation consulted: [OpenAI CLI](https://learn.chatgpt.com/docs/codex/cli), [Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox). Existing source research and limits: sk05-reuse.md and sk04-probe.md.

SK09 update (2026-10-27): Node 26.7.0 now executes the minimal helper with Ajv 8.20.0 and the exact SK05 transitive lock. npm ci --ignore-scripts --no-audit --no-fund installs this local dependency set. Six process tests and one explicit source-skill CLI resumption passed; source-helper support remains limited to this environment and create-only format. No general installed-host support or recovery claim.

SK10 tested installation (2026-10-27): project-local .agents/skills/startkompas in the complete allowlisted Node/helper package. A new CLI session invoked $startkompas by name and created a new synthetic dossier; a distinct session resumed it correctly. Source/installed validators and six tests passed. This narrows the earlier no-installed-route statement for this one Windows/Node26.7.0/CLI0.162.1+MXC route only. Implicit selection, other hosts/versions and production recovery remain untested. See evidence/sk10/report.md.

## Current documentation qualification — 2026-10-28

Earlier future-validator/no-installed-product/no-recovery wording above describes historical stages. Ajv8.20.0 is now pinned in package-lock.json; core/workflow and interrupted-process recovery have bounded synthetic evidence in evidence/phase3, evidence/phase4 and evidence/sk32-D08-rep3. These do not qualify physical power loss, arbitrary hosts or real-user benefit. Current user entry points: start-resume.md and gebruiken.nl.md. Exact model/desktop build remains unknown; SK03, budget and Claude remain open.
