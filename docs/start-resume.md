# Install and resume the legacy runtime

> **The skill installs separately and needs none of this** — copy one folder, see [`skill/INSTALL.md`](../skill/INSTALL.md). The bundled `.agents/skills/startkompas` skill and `scripts/install-skill.mjs` were **removed** on 2026-11-10; see [DECISIONS.md](../DECISIONS.md) entry 1.

Extract or clone the repository into a new directory, then:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
node src/startkompas.mjs --help
```

Follow [the quickstart](quickstart.md) for the interactive menu, the fictional demo and creating a project. Keep private dossiers outside the application directory. Never overwrite an existing installation or project.

The local browser project and offer flow was checked in Edge on Windows; other browser and OS combinations still need interactive validation.

See [commands](commands.md), [core storage and recovery](core-route.md), [workflow changes](workflow-route.md) and [data handling](security-data-flows.md). Upgrades are explicit: keep the old app and backups, install the new app separately, test a copy/export before changing your project. Deleting the app does not delete separate private dossiers, exported copies or provider records. No automatic synchronization or provider-data deletion is supplied.
