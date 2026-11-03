# One command entry point

Use `node src/startkompas.mjs --help` or `npm run startkompas -- --help` from the installed app. This routes to the existing helpers; it does not create another dossier format or bypass their checks. The older direct helper commands keep working.

| Route | Purpose | Example |
| --- | --- | --- |
| project | Start/resume, records, guarded changes, history, export/restore, dependencies | project handoff ../my-project my-project |
| business | Versioned interview, offer, pricing and other drafts | business types |
| intake | Reuse answers and ask the next relevant question | intake plan ../my-project ../intake.json |
| daily | One milestone, ordinary actions and urgent blockers | daily brief ../my-project ../selection.json |
| costs | Explicit cost scenarios and comparisons | costs compare-brief examples/cost-comparison.json |
| pilot | Combined draft pilot package | pilot prepare ../my-project ../pilot-request.json |
| sources | Source and review evidence register | sources show ../my-project my-project |
| domains | Topic index, selective detail and screening history | domains index |
| modules | Module notices, gated content and dependent review | modules notices |
| run | Execution limits and saved partial-result proposals | run check examples/run-ledger.json |
| legacy | Original sk09-v1 create/resume | legacy resume ../old-project expected-id |

Prefix each example with `node src/startkompas.mjs`. Application paths are internally resolved, so an absolute path to this entry point also works from another current directory. Input/output path arguments still resolve against your current directory. Quote paths with spaces. The dispatcher uses a fixed helper allowlist and passes arguments directly, without a shell. Error output and nonzero exits are preserved; never treat an error as an empty successful answer.

## Start without importing fictional business facts

Create a request file with your chosen identity/name and no task, or a supplied first task:

```json
{"project_id":"my-project","name":"My project","first_task":null}
```

```powershell
node src/startkompas.mjs project init ../my-project ../new-project.json
node src/startkompas.mjs project handoff ../my-project my-project
```

The parent must exist; the project directory must be new and outside the app/source. This does not infer business facts, create customer evidence or initialize a second copy when resuming. For an existing project use handoff/read with the expected identity. Follow core-route.md for advanced operations and recovery.

`business prepare`, `pilot prepare`, `intake answer`, `sources prepare`, `domains prepare`, `modules review` and `run prepare` are proposals, not completed writes. Preserve the returned request/content and use the existing project update/attach route, then read back. An uncertain write is retried with its exact saved request, not regenerated under a new operation ID.

## Compatibility

The installed npm startkompas alias now opens this common route. Top-level `create` and `resume` remain aliases for the legacy sk09-v1 helper so earlier callers still work. For a new current-schema project explicitly use `project init`. The direct `src/cli.mjs` legacy and `src/core-cli.mjs` current routes are unchanged. `--version` reports the app version, not verified host support. Help is read-only and loads no AI/model service. A unified entry point is not an independent user-comprehension test.


## First answer in a new project
An empty project has no sources. An intake answer may supply an explicit new source alongside source_id, with title, location and scope. The source and reported answer are proposed together and saved by the existing guarded project update command. Existing source IDs must omit source; new metadata never replaces an existing record. A source describes where the report came from, not verification of the claim. Unknown answers use null. Preparation does not write; save the exact proposal once and retain it for retries.
See examples/first-intake-answer.json. Set project_id, source_revision, operation_id, date, answer and source description to the actual project and user input before preparing. Run intake answer <directory> <request.json>, save its JSON output, then project update <directory> <saved-proposal.json>. Do not regenerate a proposal to retry an uncertain write.


## Alpha 2 guided tools
Run doctor for read-only installation checks; start asks for the minimal new-project inputs and confirms before saving. overview <directory> <project-id> [nl|en] gives a readable saved-state summary. compare <directory> <project-id> <older> <newer> lists changed record IDs/fields without private values. These tools do not call an AI service or add telemetry. See alpha-improvements.md.

## Selected skill context

`node src/startkompas.mjs context preview <private-directory> <selection.json>` produces bounded, explicitly selected prerequisite context. Read [skill-context.md](skill-context.md) before sharing. This route is read-only and makes no model call.

## Versioned integration contract

Run node src/startkompas.mjs --contract for a read-only JSON contract. contract_version1 describes the existing project CLI identity/revision/idempotency boundary, supported dossier/export formats, path resolution and output/error channels. The contract version is independent of the application version; reject unfamiliar contract versions rather than guessing. It does not declare every other route's output stable or authorize direct dossier edits. The current update payload is documented in core-route.md; use an expected project ID and saved operation ID, retain the exact request for uncertain-write retries, and reread before preparing a genuinely new update. A handled failure has a nonzero exit and JSON stderr; human-readable error wording is not a stable discriminator. Broader typed command schemas and compatibility fixtures remain follow-up work.

### Validate an update request without saving

Run node src/startkompas.mjs project validate-update <request.json>. The shipped schemas/update-request-v1.schema.json requires project_id, expected_revision, operation_id and changes, refuses unknown/immutable keys, and references the existing dossier1.1 field definitions instead of duplicating record schemas. Validation does not load a project, coerce values, supply defaults or modify the input. Success reports valid:true and explicitly identifies shape-only validation. Applying the request still checks the actual target schema (including1.0 limits), expected identity/revision, reference graph, append-only records, artifact integrity and write locks. A valid request is not approval, a successful save or evidence of compatibility with every project. The 4MiB core request limit remains in force. Empty changes are structurally allowed because the existing update route permits them; integrations should avoid unnecessary operations.

### Template compatibility declarations

Document templates v1 and v2 may declare `compatibility: {"command_contract": 1, "project_schemas": ["1.1.0"]}`. The schema list must contain unique explicitly supported versions (`1.0.0`, `1.1.0`); unknown contracts, versions and properties are refused. Draft preparation and personal-template import check the actual target schema before producing a save request. Validation alone does not select or check a project.

Legacy templates without this declaration retain their existing validation rules; no declaration or fingerprint is silently rewritten. The exact declaration is retained with document provenance. Older installations may reject this optional property: remove nothing automatically, and use an installation supporting this contract. These checks establish format compatibility, not specialist review or proof that a template solves a customer problem. No executable plugin code is accepted.

### Guarded project-write conflict codes

Handled project updates expose `REVISION_CONFLICT` for a stale expected revision, `PROJECT_MISMATCH` for the wrong expected project ID, and `OPERATION_CONFLICT` when an existing operation ID is reused with different content. These codes are attached at the storage boundary and mapped to public messages; integrations should not parse message wording. Exact saved-request retries still return their original receipt, even after later revisions. Reread before preparing a new operation; never repair a conflict by blindly replacing the expected revision. Other handled errors may remain `COMMAND_FAILED`; interruption is not guaranteed to emit this JSON shape.
The exact success object for project update and project attach is described by schemas/write-receipt-v1.schema.json (project_id, operation_id, revision). The revision is the committed operation revision, including on an identical retry, not necessarily the latest project revision. Handled CLI failures produced by publicError follow schemas/cli-error-v1.schema.json (code and error). These schemas do not describe read/export/helper success objects, raw process interruption, unexpected runtime diagnostics or web API errors. --contract advertises their paths. Unknown versions require explicit compatibility review rather than coercion.

### Project read result

`schemas/project-read-v1.schema.json` describes the existing `project read` result and the shared result shape of project init/create: directory, file, sha256 and dossier. It references both shipped dossier schemas rather than duplicating their definitions. Register both relative schema references in your validator. Ajv strict validation needs allowUnionTypes:true for the existing dossier profile-value schema, matching the app's validator; retain coerceTypes:false and useDefaults:false.

The digest identifies exact on-disk project bytes, not canonical JSON reconstructed from the response. The CLI checks the expected project ID before returning data. JSON Schema validates shape, not filesystem existence, hash correctness or cross-field identity: callers must still use the expected ID and preserve the returned revision/hash for guarded operations. Paths and dossier contents are private local data, not a shareable public report. Unknown future dossier versions are refused without rewriting.

### Project initialization request

`--contract` advertises `schemas/project-init-v1.schema.json`, the same schema used by `project init`. Required fields are project_id, name and first_task (null or an explicit id/title pair); practice and customer/outcome context are optional. Unknown fields, invalid IDs and coercion are refused. Creation returns the project-read result shape at revision1. Initial context becomes unknown assumptions, not verified facts; the practice flag labels fictional work and does not anonymize supplied text.

Initialization is not an update retry: an existing destination is refused without replacement. If completion is uncertain, inspect that destination and its expected project identity before selecting another path. Schema validity alone cannot guarantee filesystem availability or semantic consistency of the resulting dossier.

### Historical project results

`schemas/project-history-v1.schema.json` describes `project history <directory> <expected-id> [limit]`. The limit defaults to50 and must be an integer from1to100. Snapshot candidates are ordered by descending revision; truncation and unrecognized entries are explicit. Each item is either a validated snapshot (name and byte hash) or an invalid candidate (error), with a separate ambiguity flag. A valid item may still be ambiguous: never select it silently for recovery.

History intentionally does not read or repair current project.json, allowing inspection when that file is damaged. The returned project_id echoes the expected ID; each listed snapshot is checked against it. A successful command does not prove that all candidates are valid, the current project matches that ID, or history is complete. Invalid snapshots remain visible instead of turning the entire listing into a handled CLI failure. Error wording is diagnostic, not a stable discriminator; use valid, ambiguous and truncation fields. Hash checks establish integrity, not authenticity. Export performs separate artifact checks.

### Retrieval request and paging

`schemas/retrieval-request-v1.schema.json` is the runtime input schema for `project retrieve`. All seven fields are required: project_id, source_revision, query, groups, ids, offset and limit. Empty groups/ids mean no restriction; duplicates and unknown groups are rejected. A page limit is1–100; offset is0–100000. No coercion or defaults are inserted.

Use next_offset until null while retaining the same identity, revision, query and filters. Restart after a revision change. total_matches counts the filtered matches; missing_requested_ids identifies IDs absent from the entire dossier, not IDs excluded by query/group filters. A final page may still report truncated:true because it omits earlier pages. canonical_sha256 identifies the source dossier bytes; requires_review may additionally reflect current local artifact damage, so a fixed dossier revision does not freeze external file state. The command reads literal canonical record text, never attachment contents or external sources, and does not modify canonical assertions.

### Export result and recovery boundaries

`schemas/project-export-v1.schema.json` describes the output of project export and snapshot-export: destination directory and a manifest. Contract schema version1 covers bundle formats startkompas-export-v1 and v2. Each included file has an exact byte count and SHA-256; omitted external or unavailable artifacts remain explicit references. v2 additionally includes historical snapshots required by imported feedback. Neither format promises a complete copy of all historical revisions.

This output schema describes generated manifests, not permission to restore arbitrary input. Restore independently checks paths, project identity/revision, bytes, artifact membership and required recovery context. Shape validity does not prove safe paths, matching hashes or complete artifact coverage. Restore returns the project-read fields plus references; it does not match the exact project-read schema alone. References remain unavailable or external after restoration, and no external content is fetched. Both export and restore require new destinations and preserve the source. snapshot-export can use validated history when the current project is damaged; ordinary export reads the current project first.

### Restore result

`schemas/project-restore-v1.schema.json` describes successful `project restore` output. Register project-read-v1 and both dossier schemas as relative references. The result has directory, file, sha256, dossier and a required references array. An empty array means no artifact was omitted from that bundle, not complete history, verified external content or a validated business conclusion.

Reference entries retain artifact_id, location and reason. The existing restore reader may preserve additional reference metadata from an imported manifest, so these nested objects remain extensible; unknown top-level result fields are refused by this schema. Treat preserved metadata as untrusted data. This output contract does not authorize paths, network requests or arbitrary manifest fields. Actual restore performs its existing identity, integrity and artifact checks before publishing a new destination; originals remain unchanged.

### Handoff content

`schemas/project-handoff-v1.schema.json` describes project handoff and the JSON content written by save-handoff, not the save command's small receipt. Register both dossier schemas. Tagged retrieval records reuse the field definitions of those schemas; summary records retain their existing dossier shapes. The default limit20 (maximum100) applies independently to each summary section and to retrieval. A query filters retrieval only: it does not filter active tasks, summary sections or their totals. Inspect summary.truncated and retrieval.truncated separately.

The canonical digest identifies project bytes, while artifact checks describe files observed during this call. Missing, hash-mismatched, unsafe/unreadable and external-unchecked are distinct. The same dossier digest can therefore produce different artifact health later. A saved handoff is a derived snapshot, not a backup or continuously current state. The schema checks structure; it does not establish cross-field totals, authenticity, source truth or file health. Saving refuses an existing destination and does not edit the project.

### Validation, save and lock receipts

`schemas/project-receipts-v1.schema.json` contains four named definitions: validation (validate), update_validation (validate-update), saved_handoff (save-handoff) and released_lock (unlock). Select the command's definition through its #/$defs/... reference; the top-level union accepts any of the four shapes. A validation receipt is not a saved project. A saved-handoff receipt describes the derived file and its captured revision, not an update receipt or guaranteed current state.

Unlock returns released:true only after checking the exact token, local host and a process confirmed absent. A live process, wrong token or uncertain process state is refused. Age alone never permits unlocking. The receipt does not approve a new write or substantiate business data.

`schemas/project-upgrade-v1.schema.json` describes upgrade-workflow output: shared read-result fields plus retained_export and warning. Register the read and dossier schemas. This explicit copy upgrade retains the original bytes and export, initializes empty workflow annotations and preserves historical revision/operation data. The result is not a normal project-read object, and upgrade does not infer missing business facts or authorize repeating old operations.

`schemas/retrieval-result-v1.schema.json` describes retrieval output and is advertised alongside the request schema. It references the handoff's tagged record field definitions and adds required boolean requires_review. Register both dossier schemas, project-handoff-v1 and retrieval-request-v1 before compiling. Null next_offset ends paging; a numeric value identifies the next offset. The schema validates field types and record shapes, not consistency between totals, array lengths and source bytes. Keep the revision and query/filter set fixed across pages. A false requires_review is not evidence that a record is true; it only reports the current derived invalidation state.

### Workflow requests and results

`schemas/workflow-contract-v1.schema.json` exposes named plan_request/plan_result, reuse_request/reuse_result and impact_request/impact_result definitions. Select the appropriate #/$defs/... schema; the top-level union only distinguishes accepted shapes, not the command being called. Requests are validated by the runtime without coercion or defaults. Unknown keys are now refused; remove previously ignored extra keys before using this contract. Register both dossier schemas, project-handoff-v1 and update-request-v1 for result validation.

Plan distinguishes direct_small_edit from material-choice results; an empty declared blocker list is not launch approval. Reuse distinguishes exact known scope from unknown/different scope and invalidated candidates; no record is merged. Impact returns a proposal, not a write receipt: save its update_request exactly and apply through update, which still checks identity, revision and dossier semantics. A schema-valid date string or externally reported change is not independently verified evidence. These commands do not authorize external actions, silently clear review requirements or turn accepted uncertainty into proof.


Historical reinstatement uses `project snapshot-restore-preview <directory> <review.json>` followed by `project snapshot-reinstate <directory> <saved-request.json> --confirmed`. See core-route.md for exact fields, safeguards and retry semantics; this creates a new revision rather than the separate-copy behavior of `project restore`. The four schema definitions are advertised by `--contract`.
