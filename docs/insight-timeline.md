# Insight timeline

The read-only helper selects an existing assumption and returns its current text, saved research links with their original assumption snapshots, and decisions explicitly linked to that assumption. Research-link dates are capture times; decision dates are user supplied. Unknown dates sort last. Chronology is not proof that a finding caused a decision.

Only the latest 100 decisions from the existing decision log are available; truncation is disclosed. Missing or damaged decision detail remains labelled by that reader. The helper inspects up to 100 saved historical snapshots and the current revision. It compares adjacent valid revisions only; missing or damaged history creates a gap, and the next readable state is an observation rather than an inferred transition. Revision order is kept separate from user-supplied decision dates. It cannot reconstruct unsaved edits or explain unrecorded offer changes. It does not change evidence, decisions or task status.

M4-09 implementation evidence: Explicit finding-to-decision relationships, missing/corrupt/ambiguous/truncated history checks, an authenticated read-only API and browser controls are implemented. Explicit offer-change tracing and desktop browser verification are implemented. Current source and clean-install suites each pass 359 tests; the subsequent CSS-only wrapping correction was verified in Edge at 390 × 844. Tests use fictional data and verify current versus historical context and read-only behavior.

Decisions can explicitly select a research finding as context. Only findings whose source is unchanged and readable are offered. Removing that source invalidates dependent decisions for review while retaining the user-entered choice and reason. The timeline does not reconstruct a deleted finding from historical artifact metadata. A decision whose only link to an assumption was a removed finding is available in the decision log, but is no longer inferred to belong in that assumption timeline. User-entered decision text is not automatically erased by source removal; inspect it separately if it contains copied private information.

## Open the timeline

Open Research links, then Review support and contradictions. Choose the assumption and select Read insight timeline for this assumption. Read revision history separately from dated research and decisions. Check partial-history and missing-range notices before drawing conclusions. Back to assumption review returns to the chosen assumption.

To record a decision based on a finding, open Decision log and explicitly choose a research finding as additional context. Supply the choice, reason and date, inspect the preview, then confirm. A context link does not verify the finding or approve the assumption.


Explicitly linked offer versions are displayed with their recorded context IDs, predecessor, change reason, changed field values and successors. Only versions with an explicit inspected context link are included; this is not a complete offer history. Unreadable linked candidates disclose unavailable contents. User-supplied dates and context links do not prove causation. The panel was verified in Edge using fictional saved offers: predecessor/successor links, recorded reasons and changed values remained visible. At 390 × 844, the document and all timeline text blocks fit without horizontal overflow; long IDs and original text wrap without hiding content.
