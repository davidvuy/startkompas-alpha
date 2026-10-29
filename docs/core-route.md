# Experimental dossier core (Codex technical preview)

This phase-3 engineering increment is authorized by D29. It does not close SK03 practice validation, approve a phase budget, qualify Claude or release the product. Use synthetic data on the recorded Windows/Node 26.7.0 route. No new runtime dependency was added. The existing `src/cli.mjs` and sk09-v1 dossier stay supported as the original create-only route.

## Commands

Run from the source or installed application root. Private project directories, exports and handoffs belong outside that root. Parent directories must already exist. New destinations must not exist. All commands print JSON; failures use stderr and a nonzero exit status.

```powershell
node src/core-cli.mjs validate examples/dossier-v1.json
node src/core-cli.mjs create ../orbit examples/dossier-v1.json
node src/core-cli.mjs read ../orbit pilot-orbit
node src/core-cli.mjs update ../orbit ../update.json
node src/core-cli.mjs handoff ../orbit pilot-orbit
node src/core-cli.mjs handoff ../orbit pilot-orbit "interview" 10
node src/core-cli.mjs save-handoff ../orbit pilot-orbit ../handoff-1.json
node src/core-cli.mjs export ../orbit pilot-orbit ../backup-1
node src/core-cli.mjs restore ../backup-1 pilot-orbit ../restored-orbit
node src/core-cli.mjs migrate ../old-project old-project-id ../migrated-project
```

Replace example IDs with the actual expected project identity. Names are not identities. Never infer identity from a similarly named directory. `read`/`handoff` reject a mismatch. A saved handoff is derived; always compare its revision/hash with the canonical dossier before acting. Summary sections and retrieval results have separate totals/truncation flags. Use a focused query or larger limit (maximum 100) when incomplete; never interpret a partial search as absence. External sources are not fetched automatically.

## Schema and meaning

`schemas/dossier-v1.schema.json` is JSON Schema 2020-12, validated by the existing pinned Ajv with coercion, default insertion and property removal disabled. Extra fields and unknown schema versions are rejected without rewriting. The 4 MiB bound applies to JSON inputs. Collections have stable globally unique record IDs; the helper checks reference kinds and active-task identity. Versions identify schema, skill and modules. Profile fields need explicit provenance; unknown values are null. Empty profile/arrays mean nothing recorded, not a negative business finding.

Facts and assumptions carry reported/observed/inferred/unknown status and source IDs. Decisions retain reason, basis and optional supersession. Tasks/checks independently store applicability, progress, substantiation and basis kind (unknown, obligation, agreement, service term, own requirement, recommendation or hypothesis). Deferring a task never changes applicability. Evidence references a subject/version, artifact, environment, date, reviewer, scope and period. Supporting evidence must match the task/check and period. A supplied review, file hash or schema-valid record cannot prove the underlying conclusion is correct.

Artifacts explicitly distinguish local `files/...` content from external references, availability and optional SHA-256. Available local files require a hash. Path traversal, links and case-colliding local paths are rejected. Hashes establish byte identity, not authorship, authenticity or truth. This helper is not a hostile multi-user filesystem sandbox.

## Guarded updates

An update request looks like this; `changes` replaces only the named collections/fields, not the whole dossier:

```json
{
  "project_id": "pilot-orbit",
  "expected_revision": 1,
  "operation_id": "rename-orbit-1",
  "changes": {"name": "Orbit pilot (synthetic)"}
}
```

Read before editing. Retain all existing records in a replaced collection. IDs cannot be removed; artifacts, evidence and events are append-only, so corrections use new records/versions. Business-record corrections remain traceable through prior canonical snapshots. Technical fields (project ID/schema/revision/operation history) cannot be changed through this API.

The same operation ID and semantically identical request return the original receipt, even after later updates. A different payload with that ID fails. New operations require the exact current revision. The state and operation receipt live in the same JSON commit. One cooperating writer holds `.writer-lock`; another writer is refused. Before committing, the helper saves the old bytes in `.history/<revision>-<hash>.json`, writes and syncs a unique temporary file, and renames it in the same directory. A post-rename error can mean the operation committed: retry the identical request rather than inventing a new operation ID.

For an attachment, add one artifact record to the retained artifact collection in the request, with a new ID/location/hash, then run:

```powershell
node src/core-cli.mjs attach ../orbit ../attach-request.json ../synthetic-guide.txt
```

The attachment copy is immutable and limited to 16 MiB. A rejected update may leave an unreferenced attachment; it is not evidence of a successful canonical update. Never automatically delete it. All bundled files together are capped at 64 MiB.

## Interrupted writes and recovery

Ordinary errors release the lock. A killed process leaves its lock and possibly a pending file; neither is automatically promoted. Read the canonical file first. Inspect `.writer-lock/owner.json`. Only after confirming the recorded local process is dead, use the exact owner token:

```powershell
node src/core-cli.mjs unlock ../orbit pilot-orbit OWNER-TOKEN
```

The command refuses a live PID, another host or a mismatching token. Missing/corrupt owner metadata requires manual investigation or recovery into a new directory. PID reuse can conservatively keep a lock blocked. Do not force-unlock a live writer or treat age alone as proof it stopped.

For a mistaken valid update, export an earlier snapshot by revision and restore into a new directory:

```powershell
node src/core-cli.mjs export ../orbit pilot-orbit ../before-mistake 1
node src/core-cli.mjs restore ../before-mistake pilot-orbit ../recovered-orbit
```

An export includes the selected canonical snapshot and available identified local artifacts. The manifest lists missing/external references requiring access; restore does not fabricate them. Hash mismatches fail. Export is not a whole-folder backup: unreferenced files, pending writes, locks and the complete history directory are excluded. Keep multiple versioned exports when history is needed. If canonical JSON is unreadable, use an existing validated export to restore into a fresh directory; the helper does not guess which orphaned file is authoritative.

Legacy migration writes a new directory only, retains exact original bytes plus an ID mapping as exportable artifacts, and preserves assertion status/source/reason. Only sk09-v1 to 1.0.0 is implemented. Unsupported future schemas fail closed. Updating/installing the application never runs migration automatically or overwrites a project.

## Storage and privacy limits

Local storage consists of project.json, immutable files/, previous JSON snapshots, optional exported bundles and derived handoffs. Review their contents before sharing. To remove a project, first identify its exact private directory and any separately chosen backup/export/handoff copies, then remove only the copies you intend; no automatic delete command is supplied. Removing local files does not delete model-provider conversation logs, uploads or independently shared copies; those depend on the provider's controls and were not audited.

The lock coordinates this helper on one local filesystem, not arbitrary external editors, network shares, cloud-sync conflicts or hostile processes. Process interruption tests are not physical power-loss tests; directory metadata durability, disk failure, full disk, antivirus interference and every filesystem/OS remain unqualified. Keep independent backups. Known failed export/migration staging directories may remain for inspection; none is treated as a completed project without validation.

Technical sources consulted 2026-10-27: [Node filesystem APIs](https://nodejs.org/api/fs.html) (exclusive creation, ordering and platform limits), [Ajv data-modifying options](https://ajv.js.org/guide/modifying-data.html), [JSON Schema annotations](https://json-schema.org/understanding-json-schema/reference/annotations). These sources inform implementation choices, not an independent audit.

## Start a real project without copying synthetic data

Use `node src/core-cli.mjs init <new-private-directory> <request.json>` with `{ "project_id": "my-project", "name": "My project", "first_task": null }`. Optional first_task is `{ "id": "first-task", "title": "Clarify my offer" }`; its applicability remains unknown, progress open and substantiation unreviewed. The initializer uses the installed package version, schema1.1 and empty collections/workflow, without budget, risk, capacity or market assumptions. Existing destinations are refused. Read back with `read <directory> <project-id>`. The older `create` command remains available for explicit complete dossiers and synthetic tests.

## Page through existing records

Use `node src/core-cli.mjs retrieve <directory> <request.json>`. Request: `{ "project_id": "my-project", "source_revision": 1, "query": "", "groups": [], "ids": [], "offset": 0, "limit": 50 }`. Empty groups/ids mean no such filter; otherwise use collection names or exact record IDs. Keep query, filters and source_revision fixed; use next_offset until null. If revision changes, reread and restart. Results expose totals, truncation, absent requested IDs and review state. Search is literal, case-insensitive, and limited to canonical record fields; attachment contents and external sources are not searched. A filtered empty page is not proof that work does not exist. This complements the concise handoff without making it longer.

## Recover when current project.json cannot be read

`node src/core-cli.mjs history <directory> <project-id> [limit]` inspects saved historical snapshots without reading the current dossier. It shows valid/invalid and ambiguous candidates, total/truncation and unrecognized entries. Maximum displayed candidates is100; a larger total is explicitly incomplete. Never choose an ambiguous or invalid revision.

`node src/core-cli.mjs snapshot-export <directory> <project-id> <new-bundle> <revision>` exports the explicitly selected historical snapshot. Then use the existing `restore <new-bundle> <project-id> <new-recovery-directory>` and `read` commands. Snapshot identity/schema/hash and available artifact bytes must validate. Missing/external artifacts remain explicit references; altered local bytes refuse export. The source and corrupt current file remain untouched. Restoration is a separate historical copy, not merging newer work or repairing external providers. Validate the recovered state before choosing it as the working copy. Local .history shares the original disk and is not an independent backup; hashes are integrity checks, not authenticity guarantees. The default current-state export remains strict and still requires a readable current dossier.

Export and legacy migration compare the copied source bytes with the digest from their initial validated read. If another writer replaces the source between those reads, the operation fails before creating a transfer/migration staging directory. Reread the source before retrying. This is a consistency check, not a hostile-filesystem lock or a guarantee against physical power loss.
