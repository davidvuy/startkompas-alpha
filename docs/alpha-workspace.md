# Work on your project without request JSON

Alpha 3 adds guided product workflows. Commands below run from the application folder. Replace `../my-project` and `my-project` with your private directory and project ID. No command here calls an AI service or contacts anyone.

## 1. Start and see what comes next

```sh
node src/startkompas.mjs start
node src/startkompas.mjs workspace show ../my-project my-project
node src/startkompas.mjs workspace journey ../my-project my-project
```

The work view shows a suggested next action, all recorded invalidations, unresolved checks, unfinished tasks, assumptions ordered by declared dependent count and saved draft status. This is a deterministic suggestion from stored data, not a claim about real-world urgency. Journey shows interview, alternatives, offer, pricing and pilot drafts; an existing draft is not a completed validation stage.

## 2. Capture the idea as an assumption

```sh
node src/startkompas.mjs workspace add ../my-project my-project assumption
```

Type your premise. It starts as unknown. Review the preview, choose a new private retry-bundle directory outside both the app and project, then explicitly answer `yes` or `ja`. `no`, `nee` or `/cancel` stops without saving. Incomplete input also stops without saving. Retry bundles retain the exact update request for interrupted-save recovery; protect them like your project.

## 3. Prepare an interview or an offer

```sh
node src/startkompas.mjs workspace draft ../my-project my-project interview
node src/startkompas.mjs workspace draft ../my-project my-project offer
```

Choose `nl` or `en`, enter context and the guided fields. Blank fields remain unknown. Optional basis IDs must already exist in the project. New text remains a proposal even when you link a source. Other kinds: `alternatives`, `pricing`, `pilot`.

To revise a draft, append its artifact ID from `workspace show`. Explain why. Blank answers keep prior fields; `-` deliberately clears a field to unknown. Earlier versions remain available. Concurrent project changes reject the save instead of overwriting them.

## 4. Record what happened and decide

```sh
node src/startkompas.mjs workspace add ../my-project my-project observation
node src/startkompas.mjs workspace add ../my-project my-project decision
node src/startkompas.mjs workspace add ../my-project my-project task
node src/startkompas.mjs workspace task-state ../my-project my-project TASK_ID
```

An observation records a participant code/source title, private reference, scope and date, with optional related records. It is always **reported**, not independently verified. Related assumptions are not automatically confirmed. Record interpretation separately as a decision with its reason and basis IDs. Task progress changes record a reason and leave evidence/applicability unchanged; `done` does not mean supported.

## 5. Resume, inspect impact and compare

```sh
node src/startkompas.mjs workspace show ../my-project my-project
node src/startkompas.mjs workspace impact ../my-project my-project RECORD_ID
node src/startkompas.mjs compare ../my-project my-project 1 2
node src/startkompas.mjs compare ../my-project my-project 1 2 --values
node src/startkompas.mjs workspace source-review ../my-project my-project 2026-10-30 90
```

Impact follows declared dependencies; it does not modify records. Default comparison lists fields only. `--values` explicitly reveals private before/after values as JSON. Source review uses your chosen date and age threshold, never fetches links and never declares a source correct merely because it is recent.

## 6. Preview a readable export

```sh
node src/startkompas.mjs workspace report-preview ../my-project my-project summary,tasks
```

Review the full `markdown`, included `sections`, byte count and `confirmation_sha256`. Optional sections are `assumptions`, `decisions`, `drafts`. Defaults exclude their contents. Select deliberately: text can contain confidential information. Attached files, full history and source locations are not automatically included.

```sh
node src/startkompas.mjs workspace report-save ../my-project my-project summary,tasks DIGEST_FROM_PREVIEW ../my-report.md
```

The digest must match the freshly generated content. If the project changes, preview again. The new file must be outside the app and project and must not already exist. A readable report is not a backup.

## 7. Check recovery

```sh
node src/startkompas.mjs workspace recovery-check ../my-project my-project ../my-recovery-check
```

This creates a private backup, restores it into a new sibling directory and verifies the canonical hash. It does not modify the original. Copies remain for your inspection. Missing/external references are reported, not magically recovered; full history and physical power-loss recovery are outside this check.

## Try the complete fictional route

```sh
node examples/demo-founder-workflow.mjs ../founder-demo
```

Open `workspace.md` and `report.md` in that new directory. The example covers a premise, synthetic observation, linked decision, draft offer, selected report and recovery check. It explicitly preserves unknowns and does not claim a real interview occurred.

For interrupted guided saves, inspect the saved receipt and project revision. Retry the exact saved `request.json` with `project update`, or `project attach` plus `content.json` for drafts. Do not restart the wizard as a substitute for an exact retry. For help, use the public question template with a fictional reproduction.

### Browser change-impact review

Open an original record or saved draft, then choose **Review change impact**. The bounded list shows the first100 of all recorded affected IDs, with total and partial disclosure. This action is read-only. Offer and pilot revision previews (including scenario adoption) also show the impact before the exact-preview confirmation. Unrecorded dependencies remain unknown; this does not approve a broad change or regenerate dependent documents. CLI business preparation returns the same structured `change_impact` when revising a prior artifact.
