# Dossier core route

Use this route only when the application includes `src/core-cli.mjs` and the dossier schema is `1.0.0` or `1.1.0`. It is an experimental local technical preview. Read `docs/core-route.md` from the application root before writes, migration or recovery; it defines the request format, command arguments and limits.

- Read or resume with `node src/core-cli.mjs handoff <directory> <expected-project-id>`. Verify identity/revision and the canonical source. Check both summary and retrieval truncation flags; query relevant older records rather than regenerating absent-looking work.
- For updates, read the actual dossier, create a request file with project ID, expected revision, unique operation ID and only the intended changed fields, then call `update`. Preserve existing collection entries. Reuse the exact operation ID and payload on a retry. Do not mark a reported assertion as verified or change applicability merely because work is deferred.
- Save a derived handoff outside the application with `save-handoff`; its hash/revision are for checking staleness, not a second canonical store.
- Export/restore use new directories. Missing and external manifest references stay unresolved. Migration of sk09-v1 must be explicit and writes a copy; never infer consent to replace a working project from a skill update.

No browser, Claude, market-validation, qualified legal-review or physical power-loss guarantee follows from these helpers. For the older create-only schema use local-route.md instead.
