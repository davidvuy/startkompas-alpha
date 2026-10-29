# Alpha 2 improvements

## Start without writing JSON

From the extracted application folder:

~~~powershell
npm ci --ignore-scripts --no-audit --no-fund
node src/startkompas.mjs doctor
node src/startkompas.mjs start
~~~

The guided start asks for your project name, lowercase ID, a new private folder outside the app, and an optional first task. It saves only after yes/ja. Cancellation or incomplete input saves nothing. Existing folders are never overwritten. Keep the parent folder present and choose a new child folder. Codex access and skill discovery are not verified by doctor.

## Read and compare

~~~powershell
node src/startkompas.mjs overview ../my-project my-project nl
node src/startkompas.mjs overview ../my-project my-project en
node src/startkompas.mjs compare ../my-project my-project 1 2
~~~

Overview reports saved tasks, decisions, unresolved checks and review warnings. It does not mark tasks done. Compare lists record IDs and changed field names between two increasing revisions; it deliberately omits private field values and does not infer business impact. Older revisions must be available and pass history integrity checks. Neither command changes your project. Existing business render commands provide the full saved draft on explicit request.

## Errors and security

Malformed JSON errors omit file contents. Missing-file and permission errors omit operating-system paths. Revision conflicts explain rereading versus retrying the exact saved request. These protections apply to caught CLI failures; normal requested project output can contain private information, so inspect before sharing. No universal secret detector, encryption guarantee or independent audit is claimed.

The public quality workflow runs package consistency, product/security tests, doctor and the fictional export/restore demo on Windows and Linux. It uses pinned action commits, read-only contents permission, no repository secrets and no privileged pull_request_target execution. Dependencies install with scripts disabled. A separate job checks known dependency advisories. Weekly Dependabot proposals require review; nothing auto-merges. A passed advisory scan cannot rule out unknown vulnerabilities.

## While users test

Record version, installation/first-result/resume outcome, reproducible fictional steps and whether help was needed. Prioritize data loss or privacy exposure first, then blocked starts/resumes, then confusing output. Add a focused regression for each reproduced defect. Keep alpha1 downloadable while shipping alpha2 separately. No user reports or retention measurements are invented; there is no automatic user telemetry or background monitoring service.

Candidate future features remain decisions: select one from repeated user needs before adding accounts, cloud storage, billing or an entire web UI. Existing users do not upgrade silently. Before moving a real dossier, keep an export and test a copy on the new version.
