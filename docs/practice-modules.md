# Practice modules

These three first-party procedural packages reuse existing worksheets. They are unreviewed guidance, not demonstrated customer solutions or specialist advice. Use `node src/startkompas.mjs modules library` to inspect them and `modules show-package <id>` for an exact package and fingerprint.

| Package | Problem to investigate | Route and checks |
| --- | --- | --- |
| scoped-service | A review is requested without agreement on its boundary or useful output. | Bound one workflow, identify an observable benefit, and exclude remediation or specialist assurance. |
| recurring-delivery | Reports recur without evidence that anyone uses them. | Identify the decision owner, handle missing inputs, and define a stop condition. |
| exploratory-pilot | Delivery and value remain uncertain before a proposed engagement. | Name a falsifiable assumption, cap effort, and define contrary observations. |

Each package has a single `prepare` route and three unanswered questions linked to its original worksheet citation. Empty answers remain unknown. No participants, purchases, messages or permissions are invented.

## Complete rehearsal

1. Create a new private fictional project with `project init` and a request containing project_id, name, first_task:null and practice:true.
2. Read its identity, revision and hash with `project read`. Select one library package and retain its exact `module` and `sha256` from show-package.
3. Build the trial request documented in module-packages.md, using route_id `prepare` and answers `{}` initially. Run `modules trial-preview`. Review the missing answers, scope, source, unreviewed warning and unanswered checks.
4. Add only explicitly fictional answers and preview again. The examples are proposals, never actual findings. Run trial-prepare and review its artifact/content and update_request before saving through project attach.
5. Read `modules trials` and compare the retained package and proposed document with the preview. Existing facts, tasks and active module versions are unchanged.
6. Prepare a reasoned trial-discard and apply its update_request. Verify the discarded flag while original content remains readable.
7. Export the project to a new private bundle and restore into a new directory. Reopen trials and verify the package, questions and discarded state remain identical.

The automated module-library test runs this complete route for all three packages, including unknown answers and recovery. It proves local mechanics only. Live application, independent content review and actual customer usefulness remain separate requirements.

Maintenance: report a concrete defect through repository Issues, including package ID/version and a synthetic reproducer. Change package version when embedded content changes; retain old artifacts as historical context. Review provenance and redistribution rights before accepting new content. Current packages contain original project guidance and no imported customer material.


## Rehearse an older project's complete journey

Run `node examples/demo-upgrade-journey.mjs <new-private-directory-outside-app>`. It creates a fictional 1.0.0 dossier, upgrades a separate copy to 1.1.0, retains a scoped-service module trial, imports one selected invented note, explicitly revises the old decision with attribution and remaining uncertainty, and exports/restores the complete result. Existing destinations are refused.

The report identifies the original, upgraded and restored directories plus hashes and artifact IDs. The original remains unchanged; restored trial content, selected source and decision history are checked against the upgraded project. This is local module trial use, not live activation or remote synchronization. The imported note is untrusted text; it is not silently promoted to evidence or a decision basis. The revision reason explicitly describes a synthetic example.

`node --test tests/upgrade-journey.test.mjs` additionally checks the old/new schema, retained original decision and superseding decision, unchanged facts/tasks/evidence/assumptions/module versions, and refusal to overwrite the destination. No actual participant or business result is implied.
