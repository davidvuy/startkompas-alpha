# Experimental SK09 local route

Use from the development checkout or a complete local installation with src/, schemas/ and locked dependencies present. Locate the application root by package.json (name startkompas) and src/cli.mjs: two directories above source skill/startkompas, or three above installed .agents/skills/startkompas. Run helper commands from that root. Copying only the skill directory is insufficient.

From that root, Node 26.7.0 runs:

- Create: node src/cli.mjs create <private-directory> <input.json>
- Resume: node src/cli.mjs resume <private-directory> <expected-project-id>

Read the supplied input before creation. It must contain project_id, name, fact (id, text, status reported/observed/inferred, source), decision (id, text, reason, basis_fact_id matching the fact), and next_action. Supply no schema_version or revision: the helper assigns sk09-v1 and revision 1. Do not invent missing business fields. Require user-provided or actually observed source attribution; schema validity is not factual verification.

The directory must be outside the source tree and its parent must exist. Creation refuses an existing project.json; no update command exists. Success means a real write, sync, byte-checked readback and process exit, which closes the session's file handle. Resume is read-only: verify identity and report the stored revision, fact/status/source, decision/reason and next action from the returned dossier. Never fill gaps from chat memory.

An unknown schema, invalid data or identity mismatch must be reported without rewriting the file. Do not bypass rejection with a manual edit. An interrupted initial write may leave an incomplete file: preserve it for diagnosis; recovery, migration, revisioned updates, writer locking and operation replay are later work. No production safety, installed-host support or claim of source truth follows from this minimal route.
