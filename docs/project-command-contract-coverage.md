# Project command contract coverage

Reviewed against every switch case in src/core-cli.mjs on 2026-11-03. This inventory distinguishes a documented command from a fully machine-validated integration result. It does not expand the version1 contract to every product helper, browser API or legacy route.

All project commands use fixed dispatcher routing, JSON stdout on success and publicError JSON on stderr/nonzero exit for handled failures. Process interruption is outside that error shape. Paths resolve from the caller directory. Names do not establish identity. Schema validity never replaces target-specific identity, revision, filesystem or semantic checks.

| Command | Input and effect | Published result schema | Remaining machine-contract work |
| --- | --- | --- | --- |
| validate | Dossier file; semantic validation, no write | project-receipts-v1 validation | None for receipt |
| validate-update | update-request-v1; shape validation, no project read/write | project-receipts-v1 update_validation | None for receipt |
| init | project-init-v1; new destination | project-read-v1 | None for this shape; initialization is not an idempotent update |
| create | Supported dossier schema; new destination | project-read-v1 | None for this shape; cross-record checks remain runtime |
| read | Directory and expected ID; read-only | project-read-v1 | None for this shape |
| retrieve | retrieval-request-v1; revision-bound literal search | retrieval-result-v1 | None for shape; page consistency remains caller/runtime responsibility |
| plan | Kind and existing target_ids; schema1.1 read-only | workflow-contract-v1 plan_request/plan_result | Caller still classifies materiality |
| reuse | Goal and explicit nullable client/period/version; schema1.1 read-only | workflow-contract-v1 reuse_request/reuse_result | Only declared intents, not semantic search |
| impact | Identity/revision/operation/changed_ids/reason/date; proposal only | workflow-contract-v1 impact_request/impact_result | Applying still checks target revision and semantics |
| upgrade-workflow | Expected schema1.0 ID; separate new copy and retained export | project-upgrade-v1 | None for result shape |
| update | update-request-v1; guarded write/exact retry | write-receipt-v1 | None for receipt; target-dependent rules remain runtime |
| attach | Update request plus source file; immutable attachment and guarded write | write-receipt-v1 | Attachment-specific constraints remain documented/runtime |
| export | Directory/ID/new bundle, optional revision | project-export-v1 | None for generated result; not an arbitrary-input safety validator |
| history | Directory/expected ID/optional limit; read-only historical candidates | project-history-v1 | None for shape; successful listing may contain invalid candidates |
| snapshot-export | Directory/ID/new bundle/revision; history-only export | project-export-v1 | None for generated result; current dossier need not be readable |
| snapshot-restore-preview | snapshot-restoration-v1 preview_request; exact revision/hash, read-only | snapshot-restoration-v1 review | Historical artifact/privacy checks remain runtime |
| snapshot-reinstate | snapshot-restoration-v1 restore_request plus --confirmed; guarded new revision | snapshot-restoration-v1 receipt | Privacy removals retained; reappeared deleted files and schema downgrade refused |
| restore | Bundle/expected ID/new destination | project-restore-v1 | None for result; manifest/path/hash validation remains runtime |
| migrate | Legacy source/expected ID/new destination | project-read-v1 matches final read result | Actual CLI migration output regression passes; original bytes retained |
| unlock | Directory/ID/exact owner token; removes only verified abandoned lock | project-receipts-v1 released_lock | Never infer dead writer from age alone |
| handoff | Directory/ID/optional query/limit; derived read-only view | project-handoff-v1 | None for content shape; summary/retrieval limits are independent |
| save-handoff | Directory/ID/new file; writes derived JSON, leaves dossier unchanged | project-handoff-v1 content; project-receipts-v1 saved_handoff receipt | None for these shapes |

Schema names above refer to schemas/<name>.schema.json. core-route.md and workflow-route.md remain the behavioral references. Exact clean-install evidence is in the private checkpoint; installation manifests pin source bytes rather than granting approval to publish.

All22 listed commands now have published input/argument documentation and result schemas (including named receipt definitions); migration has a direct CLI contract regression. Workflow inputs now reject unknown fields rather than silently ignoring them. This is the local project-command scope, not every product helper or browser API.

Next: verify the exact installed workflow/migration package, then run one complete candidate suite before making an integrated verification claim. Real users, independent review, hosted collaboration and external connector authorization remain separate roadmap conditions.
