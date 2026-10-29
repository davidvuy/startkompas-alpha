# Internal 0.1 workflow preview (schema 1.1.0)

D31 authorizes Codex-only SK16-SK20 technical work. SK03, phase budget and Claude remain open. This is an internal development preview, not a public release or measured product advantage. Existing 1.0.0 and sk09-v1 commands remain available; no automatic migration.

## Structure

Schema 1.1.0 retains the core records and adds `workflow`. Start from `examples/dossier-v1.1.json`, replacing synthetic values with supplied facts, or explicitly copy an existing 1.0.0 dossier:

```powershell
node src/core-cli.mjs upgrade-workflow ../old project-id ../new-workflow
```

The original remains unchanged. The new directory preserves its original canonical bytes as an identified artifact, and a separate export is retained. The revision and prior operation receipts remain historical; the schema changes explicitly. Workflow arrays are empty, not inferred. Do not repeat pre-upgrade operations as new business work. Failed staging directories remain inspectable.

`workflow` contains:

- `links`: `{dependent_id, prerequisite_id, reason}` for material dependencies between existing records. Assertion source, decision basis, task prerequisites, check evidence and evidence artifacts also form graph edges. Evidence's subject identity is not a dependency edge back to its subject. Missing references and cycles fail validation, including legacy native dependency fields.
- `intents`: `{record_id, goal, client, period, version}`; scope fields are strings or null. Explicit goal identity permits normalization of case/spacing. It does not imply semantic synonym recognition.
- `uncertainties`: `{record_id, impact, reason, checks:[{record_id,cost_rank}]}`. Impact is `minor` or `material`. The skill/user must identify the uncertainty and why it matters. Checks must exist in the check collection. Cost rank is a relative ordering supplied for this decision, not euros, elapsed time or a measured cost estimate.
- `accepted`: `{record_id, reason}` for consciously accepted uncertainty. Acceptance never changes assertion/evidence to verified. Retain the reason and residual uncertainty.
- `modules`: `{record_id,module_id}` for records that depend on an existing module version.
- `invalidated_ids`: append-only review-needed identifiers. They do not erase prior evidence. A new version/review should use new scoped records; this preview intentionally has no silent clearing/reset command.

## Before consequential work

Read the dossier and existing artifacts. Classify the requested work: a small independent correction is `small_edit`; a material build/vendor/customer decision is `material_choice`. Save a request file such as:

```json
{"kind":"material_choice","target_ids":["build-dashboard"]}
```

```powershell
node src/core-cli.mjs plan ../project project-id ../plan-request.json
```

The helper follows declared prerequisites, reuses relevant done/supported checks unless invalidated, and proposes the lowest-ranked applicable check for unresolved material uncertainty. It also lists independent open tasks. A small edit does not trigger broad research. Missing declarations, omitted edges or a model's incorrect materiality classification are not fixed by this deterministic helper: explain coverage limits. A clear result is not permission to contact, purchase, deploy or claim readiness. External research artifacts are not fetched or independently authenticated; supplied review status remains a claim.

## Reuse before regeneration

```json
{"goal":"interview guide","client":"Alder","period":"October 2026","version":"2"}
```

```powershell
node src/core-cli.mjs reuse ../project project-id ../reuse-query.json
```

Search covers all declared intents, including older records outside the short handoff. Exact known scope returns reusable records; different/unknown scope or invalidated records remain review candidates. No merge or mutation occurs. No match only means no matching explicit goal annotation: inspect relevant raw records and artifacts for synonyms or missing annotations before creating work. Failed searches are errors, never evidence that prior work is absent. The skill supplies semantic judgment; the helper makes scope boundaries explicit.

## Changes and evidence integrity

Ordinary guarded updates automatically propagate changed facts, sources, assumptions, profile fields, decisions, task/check content or period, intent scope, dependency links and bound module versions. Dependents become invalidated; task/check substantiation becomes `stale` without changing applicability or destroying historical evidence. New operational progress alone does not invalidate itself. Reverting a value or submitting an empty invalidation list does not clear earlier review requirements.

For a reported external change, prepare a scoped proposal:

```json
{"project_id":"project-id","expected_revision":2,"operation_id":"supplier-change-1","changed_ids":["supplier-fact"],"reason":"The supplier changed; old test results require review","at":"2026-10-27"}
```

```powershell
node src/core-cli.mjs impact ../project ../change-input.json
```

This prints `affected_ids` and an `update_request`, without modifying the project. Save **only that update_request** to a file, then apply it with `update`. Retain and retry the exact saved request for idempotency; do not regenerate it from later state under the same operation ID. New evidence/versions use new records; no automatic substantive revalidation exists.

The helper inspects available local artifact bytes during handoff/planning and updates. Missing, unreadable or changed local evidence invalidates its dependent assessments immediately in the derived view. An update records those invalidations; the old artifact/evidence records remain. External disappearance cannot be detected without a separately authorized source check. File fingerprints establish byte changes, not truth. Existing 1.0.0 behavior is retained except for rejection of dependency cycles and improved unreadable-file reporting; upgrade explicitly for persistent workflow invalidations.

## Evaluation and boundaries

`tests/workflow.test.mjs` covers material-vs-small work, research reuse, missing/cyclic edges, accepted uncertainty, scoped invalidation, module/period changes, missing/changed files, exact-scope reuse and explicit upgrade. The original core/legacy tests remain regression coverage. The frozen C01-C03 inputs and rubric are retained; development runs are evaluated separately from prior B0/B1 baselines. No time-saving claim or market validation follows from these tests.

Implementation uses existing Node/Ajv only. Sources checked 2026-10-27: [Ajv schema support](https://ajv.js.org/json-schema.html), [nonmutating validation options](https://ajv.js.org/guide/modifying-data.html), [Node filesystem behavior](https://nodejs.org/api/fs.html). Schema versions here are application formats, not different JSON Schema specification drafts; both use 2020-12.

For a reviewed replacement, create fresh scoped records from valid source records and the new report, then connect replacement checks/decisions/artifacts to them and all unchanged prerequisites. Do not point a current calculation at an obsolete aggregate fact, or omit dependencies to bypass invalidation. The old records and their invalidations stay intact. Run plan on the current target to ensure remaining material uncertainties are still reachable.

Accepted uncertainty is scoped to its unchanged premise. If that record or its basis is invalidated, `plan` now returns the retained acceptance in `acceptance_requiring_review` and requires a new check. It cannot silently reuse the previous acceptance, including after reverting the premise. Reassess using fresh scoped records as described above; the old reason remains historical.
