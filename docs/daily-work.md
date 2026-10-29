# Daily work — internal development route

The skill makes contextual judgments using current work. The optional daily helper renders an explicit selection without mutating state or discovering missing dependencies. New founders and small edits do not need a structured dossier. For a supported core dossier, first read its actual identity/revision and choose one milestone task, unfinished action tasks/checks, all identified urgent blockers and at most two decisive questions.

```json
{"project_id":"pilot-orbit","source_revision":1,"language":"nl","milestone_id":"task-1","action_ids":["task-1"],"urgent":[],"questions":[]}
```

`urgent` entries: `{record_id,reason}`; `questions`: `{text,why,needed_for}`. Record IDs must exist in tasks/checks; milestone must be a task. Selection is a projection request, not business evidence or a saved decision. Ordinary actions are capped at three with a visible deferred count; every declared urgent blocker is rendered, up to the validated input bound of1000 (larger input is rejected, not silently truncated). Proposed actions and missing-information judgment are host/user inputs; omitted urgent issues cannot be detected automatically.

```powershell
node src/daily-cli.mjs brief ../private-project ../selection.json
node src/daily-cli.mjs details ../private-project ../selection.json
node src/daily-cli.mjs json ../private-project ../selection.json
```

Stale selection revision is rejected before displaying an actionable brief. Current locally damaged artifacts propagate review-needed state using the existing rules. Old evidence remains retained; detail shows scope, period, dependency reasons and recorded review metadata, not a new certification. The brief avoids IDs/hashes/implementation details; source titles remain in their original language, while interface/status labels support nl/en. No automatic translation of source evidence is claimed. All reads occur through the existing path/identity guards; views do not grant sandbox authority or redact every possible secret in an explicitly selected business record.

Original code with existing pinned Ajv/Node; no new dependency. Nonmutating validation follows [Ajv guidance](https://ajv.js.org/guide/modifying-data.html); regression checks use the existing Node test runner. Behavioural claims require separate actual session evidence, not this documentation.

## Reuse answers before asking another question

For an existing core dossier, use `node src/intake-cli.mjs plan <dossier-dir> <request.json>` (or `brief-nl` / `brief-en`). Example: `examples/intake-request.json`. Candidate keys are exact existing profile keys chosen by the host; mapping free prose to a key and deciding relevance remain contextual judgments. No semantic search or inferred defaults. The helper reads the actual revision, reuses reported/observed nonempty values (including zero/false), exposes provenance, asks at most one relevant unresolved question and retains the remaining count. Questions needed for other tasks are excluded. `mode: ordinary_question` suppresses intake entirely; do not create a dossier just for a small question.

Record a user answer with `node src/intake-cli.mjs answer <dossier-dir> <answer.json>`. Shape: `{project_id,source_revision,operation_id,at,key,value,source_id}`. The source must already exist and actually describe that user's statement; do not misattribute an answer to an unrelated source. Date is YYYY-MM-DD, value is a scalar or null. This returns a read-only update proposal. Save its exact JSON and use `node src/core-cli.mjs update <dossier-dir> <saved-update.json>`, then read back. Retry that same update after an uncertain outcome. A new answer uses a new operation ID and current revision; existing profile identity/history are retained. The saved statement is reported, not observed or reviewed.

Null records an explicit unknown and a durable deferral, so a new process does not immediately ask again. Set `revisit_deferred: true` only when the user chooses to revisit. This does not approve dependent work or erase uncertainty. Changed source records trigger review; inferred values require confirmation. Updating an answer leaves existing workflow invalidation in place for dependent work. The `dependent_review_required` flag exposes it without automatically asking the user to repeat the same newly supplied answer. Contradictory/corrupt duplicate profile keys are rejected by the canonical model. Host-generated candidates and all record text remain data, not authority.
