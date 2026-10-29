# Module restriction and withdrawal

Internal SK49 implementation,2026-10-29. This is local package behavior, not an activated public incident-response team or network monitoring.

## Read and apply notices

Use `node src/module-cli.mjs notices` for the installed policy. Use `detail modules/market-offer.md` (or pilot-conditions.md/pilot-package.md) to read content through the notice gate. `domains detail Dxx` also applies the gate. A matching restricted/withdrawn notice suppresses the affected content and returns its reason, reference and next step. Questions in the domain index stay available. Unknown/malformed policy fails instead of being ignored. No matching notice does not certify content.

The maintained file is modules/module-notices.json. It is shipped empty; no current module has been declared defective. Each real notice requires id, module_id, exact recorded version, resource, SHA-256 of affected content, status restricted/withdrawn, issued_on, reason, next_step and a traceable reference. Schema fields are defined in src/module-notices.mjs. Only the three packaged procedural module paths are accepted. A technical/relevant domain reviewer must establish the actual defect/scope before an approved package is released; synthetic tests are not real advisories. Resolve maintenance roles and publication conditions in maintenance-readiness.md first.

To flag a dossier using an affected module, prepare a request containing project_id, expected_revision, operation_id and notice_id, then run:

```powershell
node src/module-cli.mjs review ../project ../notice-review.json
```

Save the exact returned update_request and apply it with `core-cli.mjs update`; read the project back. Matching requires the declared module ID and version, plus workflow.modules record bindings. The helper traverses those dependencies, retains reasons/history and marks the affected work for review. Missing bindings are an error, not proof of no impact. Inspect unrecorded uses separately. Exact retries use the saved request. Removing a notice or reverting a module never clears previous dossier invalidation; reassessment requires current scoped records.

## Deliver a correction

Preserve the failed package, notice and scoped reproduction. Build a new reviewed source revision/package, verify exact files, and test both blocked old content and the intended corrected content. Deliver through the established channel once publication is authorized; record actual retrieval. The exact-content fingerprint prevents accidentally applying an old advisory to unrelated bytes, but different bytes are not proof that a defect is repaired. Record the repair evidence before releasing corrected content.

Users of an older installation receive no automatic update or alert. Direct filesystem reads can bypass the helper, so this gate is not an OS access-control boundary. Do not modify an installation's policy by hand and still claim its old manifest hash. Redistribute a newly verified package, or explicitly record a locally modified installation. Raw historical material remains for investigation, subject to the applicable privacy rules.
