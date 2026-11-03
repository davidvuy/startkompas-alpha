# Unreviewed source inbox

The source inbox stores a raw note or a reference with source kind, source date (or unknown), context, limitations and a contributor label. An optional user summary is stored separately from raw text. References remain literal text; nothing is fetched, opened, executed or verified. A path or URL alone is not evidence of reading.

Every item starts `not_reviewed`. Saving does not create facts, evidence, completed tasks or registered verified claims. Contributor labels are user-supplied, not authenticated identities. Capture time records local save preparation; source date describes the source and may remain unknown.

The initial local API provides `source-inbox`, `source-inbox-read`, `source-inbox-preview`, and `source-inbox-save`. Preview requires the current revision and fingerprint, and saving requires the exact confirmed preview. Retries return the same receipt. Archived projects are readable but refuse additions. Corrupt or inconsistent history is refused.

Input fields: `title`, `kind` (`note`, `conversation`, `document`, `web`, `other`), `source_date`, `reference`, `raw_text`, `summary`, `context`, `limitations`, `entered_by`. Raw text/reference/summary may be null; at least raw text or reference must be present. Use null for unknown date. Context, limitations and contributor label must be explicit; unknown limitations may be stated as unknown without inventing research.

Limits: 300 immutable items, 64000 UTF-8 bytes of raw text, 16000 bytes each for summary/context/limitations, 4000 bytes for a reference, 200 title characters and 800 bytes for a contributor label. Raw content preserves whitespace and line endings. Binary controls and malformed Unicode are refused. Only the source-preview HTTP route accepts up to 1 MiB JSON; other existing request limits remain unchanged.

This is a private inbox, separate from the reviewed web-claim register. Source review, findings, transcript structure, source redaction/retention and duplicate-source assessment are later roadmap steps. Whole-project backups contain the source and summary. Nothing is automatically shared or inserted into an offer export.

## Browser workflow

Open Source inbox from the workspace, then Add a source. Supply raw text or a literal reference, context, limitations and a contributor alias. Leave the source date blank when unknown. Preview separates raw content from your interpretation and shows capture time, unreviewed status and source fingerprint. Changes invalidate confirmation. Save explicitly, then read the immutable entry. Archived projects remain readable. Unsaved inbox forms are guarded during navigation but are not included in recovery copies. References never become links or trigger fetching.
