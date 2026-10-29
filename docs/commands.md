# One command entry point

Use `node src/startkompas.mjs --help` or `npm run startkompas -- --help` from the installed app. This routes to the existing helpers; it does not create another dossier format or bypass their checks. The older direct helper commands keep working.

| Route | Purpose | Example |
| --- | --- | --- |
| project | Start/resume, records, guarded changes, history, export/restore, dependencies | project handoff ../my-project my-project |
| business | Versioned interview, offer, pricing and other drafts | business types |
| intake | Reuse answers and ask the next relevant question | intake plan ../my-project ../intake.json |
| daily | One milestone, ordinary actions and urgent blockers | daily brief ../my-project ../selection.json |
| costs | Explicit cost scenarios and comparisons | costs compare-brief examples/cost-comparison.json |
| pilot | Combined draft pilot package | pilot prepare ../my-project ../pilot-request.json |
| sources | Source and review evidence register | sources show ../my-project my-project |
| domains | Topic index, selective detail and screening history | domains index |
| modules | Module notices, gated content and dependent review | modules notices |
| run | Execution limits and saved partial-result proposals | run check examples/run-ledger.json |
| legacy | Original sk09-v1 create/resume | legacy resume ../old-project expected-id |

Prefix each example with `node src/startkompas.mjs`. Application paths are internally resolved, so an absolute path to this entry point also works from another current directory. Input/output path arguments still resolve against your current directory. Quote paths with spaces. The dispatcher uses a fixed helper allowlist and passes arguments directly, without a shell. Error output and nonzero exits are preserved; never treat an error as an empty successful answer.

## Start without importing fictional business facts

Create a request file with your chosen identity/name and no task, or a supplied first task:

```json
{"project_id":"my-project","name":"My project","first_task":null}
```

```powershell
node src/startkompas.mjs project init ../my-project ../new-project.json
node src/startkompas.mjs project handoff ../my-project my-project
```

The parent must exist; the project directory must be new and outside the app/source. This does not infer business facts, create customer evidence or initialize a second copy when resuming. For an existing project use handoff/read with the expected identity. Follow core-route.md for advanced operations and recovery.

`business prepare`, `pilot prepare`, `intake answer`, `sources prepare`, `domains prepare`, `modules review` and `run prepare` are proposals, not completed writes. Preserve the returned request/content and use the existing project update/attach route, then read back. An uncertain write is retried with its exact saved request, not regenerated under a new operation ID.

## Compatibility

The installed npm startkompas alias now opens this common route. Top-level `create` and `resume` remain aliases for the legacy sk09-v1 helper so earlier callers still work. For a new current-schema project explicitly use `project init`. The direct `src/cli.mjs` legacy and `src/core-cli.mjs` current routes are unchanged. `--version` reports the app version, not verified host support. Help is read-only and loads no AI/model service. A unified entry point is not an independent user-comprehension test.


## First answer in a new project
An empty project has no sources. An intake answer may supply an explicit new source alongside source_id, with title, location and scope. The source and reported answer are proposed together and saved by the existing guarded project update command. Existing source IDs must omit source; new metadata never replaces an existing record. A source describes where the report came from, not verification of the claim. Unknown answers use null. Preparation does not write; save the exact proposal once and retain it for retries.
See examples/first-intake-answer.json. Set project_id, source_revision, operation_id, date, answer and source description to the actual project and user input before preparing. Run intake answer <directory> <request.json>, save its JSON output, then project update <directory> <saved-proposal.json>. Do not regenerate a proposal to retry an uncertain write.
