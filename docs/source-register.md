# SK22 source and review register

The register records claims and reasons; it does not decide law or certify a project. It uses the existing immutable attachment/event path without a dossier-schema change. Read only the relevant registry snapshot. Old snapshots remain intact.

## Format

examples/source-register.json is a minimal technical claim sourced to the Agent Skills specification. Its unknown publication/effective dates are null and all four reviews not_reviewed. Sources require identity, HTTPS URL without credentials, type (primary/secondary/user_report), checked_on, recheck_reason and rights mode. Claims require text, application context, source IDs and separate source/interpretation/applicability/coverage reviews. Dates must be real calendar dates.

Review status is not_reviewed, open or reviewed. Reviewed requires a reviewer label, date, scope, note and existing dossier artifact IDs for review evidence. The helper does not authenticate the person, their expertise or the evidence contents. Source review additionally requires a primary source. A standalone validation checks only internal references; preparation against a dossier also checks review artifact references.

Conflicts identify claims, sources and the disagreement. An open conflict cannot masquerade as resolved; resolution needs a reason, reviewer and date. It remains in history. Rights modes are link_and_own_summary, licensed_excerpt or unresolved. A copied excerpt needs a licence reference; a reference alone does not establish licence compatibility. Unknown rights are not permission. Avoid copied text when a factual own summary and link suffice.

## Commands

    node src/register-cli.mjs validate examples/source-register.json
    node src/register-cli.mjs prepare <dossier-dir> <request.json>
    node src/register-cli.mjs show <dossier-dir> <project-id>

The preparation request contains exactly project_id, expected_revision, operation_id, at (YYYY-MM-DD) and registry (the full register object). Prepare is read-only. Save its content string as exact UTF-8 bytes and its update_request as a separate JSON file, outside source. Apply with:

    node src/core-cli.mjs attach <dossier-dir> <update-request.json> <content.json>

Retry the saved request/content rather than regenerate after a commit. Identity, revision, operation-ID and attachment-hash protections remain. The 4 MiB record limit keeps readback bounded. The show command reports changed dossier revision, missing/corrupt records, open conflicts and unresolved rights; it never emits a universal approval label. Recheck dates/triggers require actual work, not elapsed-time automation.

## Scope and evidence

This is a local technical implementation of SK22. Sources were checked online at https://agentskills.io/specification and https://json-schema.org/draft/2020-12 on2026-10-27. The JSON Schema page lists16 June2022 for the draft; this is not an inferred publication date for other pages. No third-party prose/code was copied. This generic metadata pattern is original work; dependencies/licences are unchanged.

Unknown business context, SK03 participants, phase budget and Claude remain unresolved. Registers can support later domain research but cannot replace qualified review. See evidence/sk22/ for tests and a synthetic saved demonstration, once recorded. No new AI-session claim follows from a child-process read.

## Current evidence availability

`show` retains historical `review_status` and adds per-dimension `review_evidence`: artifact IDs, current integrity and invalidation flags, plus `requires_recheck`. Local matching bytes are not a content/expertise review. Missing, changed, unreadable or recorded-unavailable files require recheck; external evidence remains `external_unchecked` and is never fetched. The register-level `requires_review` flag aggregates these limits. Reading does not rewrite stored reviews.

New workflow-schema register proposals also link the register artifact to cited review artifacts, so later damage invalidates dependent work. Old snapshots remain readable and get the direct integrity warning without a silent schema/history migration; their missing graph links are not retroactively invented. Use an explicit new register version and properly scoped dependencies when resuming dependent work.
