# Install and resume the public alpha

Extract or clone the complete repository into a new directory. Follow [the quickstart](../README.md) for prerequisites, installation, demo and a new project. Keep private dossiers outside the application directory. Never overwrite an existing installation or project.

Run npm ci --ignore-scripts --no-audit --no-fund, then npm test. Use node src/startkompas.mjs --help. The bundled .agents/skills/startkompas directory is for project-local Codex discovery. Claude remains untested. The local browser project and offer flow was checked in Edge on Windows; other browser/OS combinations still need interactive validation.

See [commands](commands.md), [core storage and recovery](core-route.md), [workflow changes](workflow-route.md) and [data handling](security-data-flows.md). Upgrades are explicit: keep the old app and backups, install the new app separately, test a copy/export before changing your project. Deleting the app does not delete separate private dossiers, exported copies or provider records. No automatic synchronization or provider-data deletion is supplied.
