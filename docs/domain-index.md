# SK21 domain index and screening record

This is the executable preparation of SK21, not phase-5 content approval. All fifteen plan domains have a version, source file, two starting questions and a relevance condition. D02/D03 now share a draft market/offer procedure (0.2.0); other detail modules remain not_researched. No module is qualified-reviewed. SK03 practice validation, budget and review capacity remain open; Claude is deferred. No local dossier schema migration or new dependency is needed.

## Read only what is needed

Run from the application root:

    node src/domains-cli.mjs index
    node src/domains-cli.mjs detail D10

The first command returns the lightweight index. The second returns only the selected question entry and detail_loaded:false for D10; D02/D03 selectively load their draft procedure. There is deliberately no empty module pretending to be researched content. The applicability text is an intake relevance prompt, not a jurisdiction-specific determination. The index does not imply that any project has been screened.

## Record actual consideration

Start from examples/domain-screen-request.json only for a synthetic pilot-orbit fixture. For a real project supply its actual identity/current revision, a new operation ID, date, actor, trigger (intake/milestone/change), reason and only the domains/questions actually considered. Each domain supplies applicability (applies/not_applicable/unknown) and rationale. Each answer supplies question_id, answer (text or null), source_ids and note. Non-null answers require existing dossier record IDs; unknowns stay null. Existing record references establish attribution, not truth. The actor is a supplied label, not authenticated reviewer identity. A reason alone is not qualified review.

    node src/domains-cli.mjs prepare <dossier-dir> <request.json>

This is read-only. It returns content (the exact UTF-8 screening document) and update_request. Save those as two separate files outside the source tree using JSON parsing and a UTF-8 write operation. Do not attach the whole proposal or reserialize the embedded content: its fingerprint covers those exact bytes. Then use the established core attachment command:

    node src/core-cli.mjs attach <dossier-dir> <saved-update-request.json> <saved-content.json>
    node src/domains-cli.mjs screens <dossier-dir> <project-id>

Retry the exact saved update_request and content after an ambiguous result. Do not regenerate a proposal under the same operation ID. The existing identity/revision/operation safeguards, snapshots and export/restore apply. Source dossier hash, revision, catalog hash/version, answers and an event are retained. No business task, evidence rating or applicability status in the dossier is automatically changed.

The record distinguishes not_screened, partially_screened and questions_addressed. Questions addressed can still have unknown answers; content_review always remains not_performed. Blank/omitted domains cannot count as screened. The read command exposes the saved documents, not a fabricated overall approval score. Any later dossier revision marks the older snapshot revision_changed (conservative, even if the update was unrelated); a changed catalog is separate. Historic coverage is not silently combined into current completeness. Missing/corrupt attachments are unresolved. Rescreen only affected topics after reviewing the change; do not erase earlier screenings.

## Scope, provenance and validation

Domain names and coverage wording come from docs/plan.md, section De ondernemingskaart. modules/domain-index.json is plan-derived and excluded from a blanket public MIT grant; see LICENSING.md. English questions/conditions are original drafting for intake, without substantive legal, fiscal or business claims. No third-party domain text was copied. [Agent Skills specification](https://agentskills.io/specification), checked 2026-10-27, supports loading detailed resources only as needed; it is not domain evidence.

The new tests check all fifteen entries, selective detail, incomplete/unknown coverage, rejected unsupported fields/references, guarded durable attachment, independent-process readback, export/restore, changed revisions and damaged records. This is technical synthetic coverage, not a new AI-session screening trial or practice validation. SK21 remains partial pending researched detail, applicability validation and appropriate review in the plan's later tasks. SK22's claim/source/review register is not implemented by this index.

SK24 catalog0.3.0: D06/D07/D08/D09/D10/D11/D13 selectively load a limited pilot-conditions research worksheet. Qualified interpretation/applicability/coverage remain open; broad domain completeness is not claimed. D02/D03 retain the SK23 draft. Other topics still have no detail module.
