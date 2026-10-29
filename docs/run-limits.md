# Execution budgets and checkpoint ledger

The source skill uses scoped limits before work. The optional helper evaluates an explicit ledger, preserving unknown usage, and prepares a revision-bound immutable attachment using the existing core route. It does not run commands or enforce limits on arbitrary host tools. Test harnesses separately enforce40 tool calls/15-minute process limits; those are development settings, not an installed product daemon. The phase budget remains unknown/open.

Ledger shape is illustrated in examples/run-ledger.json. Required UTC timestamps include milliseconds. `in_progress` has null finished_at; stopped/completed runs have an actual finish time. All unfinished runs require a concrete next_step. Each event records its type, outcome, note and optional earlier related_event_id/receipt_ref. Every event counts as a tool call; repairs also consume the repair budget. Successful repair/inspection of a prior issue needs an evidence/receipt reference, which is a reported reference, not automatically fetched or authenticated. An unresolved ambiguous outcome prohibits any repair attempt until inspected. Completed records cannot contain unresolved issues. Completing at/after a cap retains the limits_hit flags and does not grant another action.

```powershell
node src/run-cli.mjs check ../run-ledger.json
node src/run-cli.mjs prepare ../project ../run-request.json
```

Request: `{project_id,expected_revision,operation_id,ledger}`. Save returned content as exact UTF-8 and update_request separately, then use `node src/core-cli.mjs attach <dir> <request-file> <content-file>`. Read back actual attachment/hash before claiming persistence. Existing events/artifacts remain; duplicate-operation retry uses the exact original attachment request. No automatic update of task progress or evidence support.

Elapsed time uses supplied start/end and current system clock for active runs; clocks/events must be ordered and not future-dated. It is not a monotonic cross-machine timer or active-user-time measurement. For instrumented single processes, the host can use its monotonic timer; see [Node performance APIs](https://nodejs.org/api/perf_hooks.html). Process termination/enforcement belongs to the host, with actual behavior tested; see [Node child-process documentation](https://nodejs.org/api/child_process.html). A record alone cannot attest actual execution, billing, complete event capture or provider retention.

On stop/reconcile, retain the partial result and one feasible next step. Missing or truncated source output leaves the relevant conclusion unreviewed. Unknown model usage/cost stays null, including when an existing subscription was used. No background monitoring or automatic resumed task is installed by this helper.
