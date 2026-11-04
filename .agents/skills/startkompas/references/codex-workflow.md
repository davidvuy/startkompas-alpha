# Conversational Codex workflow

Use the loaded skill directory for scripts and `--runtime-root` for runtime documentation. References that say `src/...`, `docs/...`, `schemas/...` or `examples/...` mean paths beneath that runtime, not beneath the founder's working directory. Call those scripts by absolute path without changing the meaning of user-supplied paths.

## Start or resume

- For an idea: use the user's stated customer/problem and desired result. If these are missing, ask the one or two questions that change the deliverable, while producing a clearly tentative outline. Do not invent interviews, customers, capacity or willingness to pay.
- For existing work: locate the user-selected private dossier, inspect `project.json` identity/schema, then run `project handoff <directory> <expected-id>` or the narrower selected-context route. Report stale/unknown records; reuse saved drafts before creating replacements.
- If a user authorizes a new structured project, prepare a private request file with project_id, name and first_task (null when unknown), then `project init <new-directory> <request-file>`. Read back with `project read <directory> <expected-id>`. Do not initialize another project merely because this is a new chat.
- Keep private dossiers outside the installed skill/runtime and public repository. Ask for a location only when no existing authorized project location can be established.

## Deliver useful work in chat

Choose the reference for the actual task, not every reference in the skill:

| User intent | Work to do | Reference |
| --- | --- | --- |
| Shape an idea or offer | Customer/problem, proposed outcome, scope, unknowns and a practical check | market-offer.md |
| Prepare today's work | One attainable result and the action that produces learning | daily-work.md |
| Interpret research | Separate original account, interpretation, contrary evidence and decision | source-register.md |
| Change a customer, scope or assumption | Identify declared affected records, revise only affected work and preserve history | workflow-route.md |
| Prepare a pilot | Reuse offer, costs, boundaries and unresolved conditions | pilot-package.md |
| Relevant breadth/specialist concern | Select the relevant domain and scope its review needs | domain-screening.md |

Draft the actual artifact, not merely instructions for operating the software. Tell the user what is proposed, its basis, remaining uncertainties and whether/where it was saved. For a simple standalone question answer directly.

## Save through the existing core

For noninteractive work read runtime `docs/commands.md` and the relevant `docs/core-route.md`, `modules/market-offer.md` or other route documentation discovered through `--help`. Codex writes request files; the founder should not have to construct JSON. Use the versioned contract and existing prepare/update/attach operations. Preserve exact operation IDs, revision guards, preview content and retry bundles. For business preparation, `content` is an already serialized string: write its exact UTF-8 bytes without JSON-stringifying it again, adding a BOM or changing newlines. Serialize `update_request` separately as JSON. Inspect the actual preparation output before applying the authorized change and read back the saved result. Never fabricate commands or mutate project.json directly.

A request to save or revise can already authorize that scoped write; do not repeatedly ask for the same permission. Helper-specific confirmation requirements still apply, and a preview alone does not authorize a broader mutation. In a plain-document project, an authorized ordinary artifact can be saved as an English file and read back without inventing a parallel dossier or migrating existing content.

## Finish and continue

After a useful result, show the next unresolved decision or action. Continue independent work already authorized; ask only for information needed to proceed. A saved task is not completed work, and a draft pilot is not validated demand. End-of-session handoff should identify the actual project, current revision, changed artifacts, unresolved conditions and next action. Read that saved state in the next chat instead of promising conversational memory.
