# Contribute a bounded practice package

Use the public repository's Issues or a focused pull request. Never attach real dossiers, private transcripts, credentials or licensed source text without permission. A visually polished submission is not sufficient for inclusion. Code checks do not establish source rights, specialist correctness or actual customer value.

## Submission record

Include these fields in the issue or pull request description:

- Package ID, version, intended audience and one concrete problem. Include where it does not apply.
- Maker and intended maintainer. State whether the maintainer has actually agreed; do not assign another person without agreement.
- Every source: citation or URL, accessed date, relevant edition/version, applicability and which question or claim it supports. Mark original procedural content explicitly. Separate source statements from your interpretation.
- Reuse rights: original author or rights holder, licence or exact permission, copied/derived files and notices. For original work state that you may contribute it under the repository's applicable licence. Unknown rights mean no publication of that material.
- Review status, reviewer if actually reviewed, review date, next review trigger or due date, and an explicit specialist review route where needed. Never invent approval. Identify material AI assistance and actual checks.
- Maintenance agreement: who will triage reports, what changes trigger review, how an unsupported package will be marked withdrawn, and how users retain historical exports. An unassigned role remains unassigned; no response-time promise is implied.
- A synthetic example, its expected result, a contrary case and a recovery check. State what remains unknown and whether any real-user evidence exists.

## One small contribution end to end

For example, improve the recurring-delivery package's handling of late source data. Explain the concrete ambiguity with fictional inputs; propose one bounded check question rather than an integration or invented service guarantee. Increment the package version if embedded content changes. Inspect it with `modules inspect-package modules/packages/recurring-delivery.json 1.1.0`, then run `node --test tests/module-library.test.mjs tests/module-package.test.mjs`.

Add a focused regression showing the intended boundary and ensure old saved trials retain their original package. Follow the rehearsal in practice-modules.md, including discard and export/restore. Update the audience/scope/source/review metadata and user-facing guide where the change affects them. No paid model, external account or private project is needed. Keep implementation, source-rights evidence and actual content-review evidence distinct in the submission.

## Review and publication boundary

A maintainer checks the scope, licence/permission record, references, synthetic reproduction, compatibility and maintenance agreement. Missing provenance, redistribution permission or necessary specialist review must be resolved before publishing the affected content. Mark procedural drafts unreviewed rather than claiming certification. Any release still follows the project's existing packaging and authorization rules; this guide does not authorize publication of the private working repository.

The existing module-notices mechanism covers its documented procedural resources; it does not automatically distribute advisories for JSON practice packages. Package-level withdrawn metadata prevents new trials in the current implementation, while old trial records remain historical. Document this limit and ship any correction through a verified release; do not promise background notifications.
