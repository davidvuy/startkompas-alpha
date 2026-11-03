# Local collaboration roles

The local alpha has no authenticated multi-user accounts, invitations or remote permissions. Roles describe the intended workflow; an alias or a role in a file is not an access grant. Operating-system access to the project directory remains outside this role description.

| Role | Intended visibility | Intended changes |
| --- | --- | --- |
| Owner | Their local project and the complete package preview | Select a review snapshot; explicitly review and apply later proposals as new versions |
| Reviewer | Only the documents, sections and questions in the deliberately shared package | Return proposed feedback; no direct dossier update |
| Editor | No access is granted by the local package route | Not enabled; do not infer write permission from a name, feedback file or copied package |

Package aliases are user-supplied and do not prove who read or authored a response. A reviewer can copy or edit the file outside the app; its fingerprint identifies the expected snapshot but is not authentication or a digital signature. Sharing a package requires a separate chosen destination and user action. Prior sharing does not authorize more data or later versions. Already downloaded copies cannot be remotely recalled.

## Review package boundary

`reviewPackage` prepares a bounded JSON snapshot of 1–10 current saved documents with explicitly selected sections and 1–10 questions. It includes project/document IDs, document versions and fingerprints for later matching. It excludes project names/paths, client/period metadata, source records, attachments, basis IDs, comments, history and other records. These exclusions do not redact private information embedded in the selected prose. Unknown values and proposal/reported labels stay explicit. Only included content is inspected by the sharing review.

`writeReviewPackage` requires confirmation of that exact content digest, an outside-project destination and a new file. It recomputes the preview and refuses changed data or overwrite. It writes locally and sends nothing. The local workspace exposes this through Prepare a review package: select sections, enter questions and aliases, inspect the exact preview, then confirm local saving. Editing invalidates the preview and confirmation; unsaved input blocks project switching. Package forms are not included in recovery copies. Use Review received feedback to import a matching response as unreviewed proposals. Do not treat a locally saved package as delivered or reviewed.


## Import received feedback

Keep the original `review-package-<uuid>.json` in the selected projects folder. The feedback screen inspects at most 100 matching local filenames and discloses incomplete inspection or unreadable files. Select the original, inspect its questions and selected document sections, and copy the response JSON template for the reviewer. The template supplies at most twenty section entries; remove unused entries and fill the comment text. For plain comment fields, select Prepare a standalone mentor page, inspect the selected context and exact HTML, then confirm local saving. The fallback JSON template remains available.

Paste returned JSON and preview it before confirming. The response must match the package ID, project ID, original project revision, document IDs, document versions and shared section keys. Blank/duplicate comments, unknown fields, implicit edit commands, changed originals and already imported responses are refused. Reviewer aliases are unverified, including when they match the intended alias. Selecting a local original and verifying its hashes does not establish authorship or delivery.

Saving creates a separate unreviewed feedback artifact and an event. It preserves the selected original snapshot and comments, but does not edit business documents, decisions, assumptions, tasks or evidence status. Editing input clears confirmation; unsaved input blocks project switching and is not included in recovery. A changed project requires a fresh preview. Historical document targets remain historical and are labelled; comments are never silently moved to newer versions. Archived projects allow reading but refuse imports. Damaged original document or feedback files block reading rather than appearing as empty feedback.

The saved feedback contains a local copy of the selected review package. Deleting the external export does not delete this copy or backups/retry files. The content remains private unless you separately choose to share it. Owner responses are a separate confirmed step after import, described below.


## Standalone mentor page

The owner selects an existing original package in Review received feedback and explicitly previews/confirms a standalone HTML file. The page contains selected sections, questions, unknown/proposal labels, fictional-practice flags, exclusions and plain comment fields. It does not include the private project path or omitted records. A historical snapshot is labelled when a newer document exists at page creation; the page does not monitor future changes.

The reviewer opens the HTML file in their browser, enters an alias and up to twenty comments, builds the exact response preview, confirms it and downloads a JSON response. No JSON editing, project account or network call is required. Blank comment fields are omitted. The download is not delivery: the reviewer checks the saved file and chooses a channel separately. Edits clear the preview/confirmation; unsaved changes are held only in the open page. The owner imports the response through the existing guarded route. Nothing is automatically accepted or applied.

Exported text is HTML-escaped. A restrictive meta CSP permits only the exact inline script and style hashes and blocks connections, object loads and form navigation. Script line endings are normalized to LF before hashing, matching HTML input preprocessing. Technical references: [CSP inline-script hashes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src) and [HTML input preprocessing](https://html.spec.whatwg.org/multipage/parsing.html#preprocessing-the-input-stream). These controls do not authenticate a reviewer or make a modified copy trustworthy.

Verification limitation: the browser automation policy rejected opening local file URLs. The owner-side preview/save flow was exercised in Edge, and the generated script was executed in an isolated deterministic test harness through response generation and successful import validation. Actual standalone-file browser rendering, CSP enforcement and the download interaction still require verification in a permitted browser context; they are not claimed from the harness tests.


## Owner responses and changed documents

Open Respond to comment from saved feedback. The screen shows the original comment, the original document section, the latest uniquely linked version and the previous owner responses. Accept records agreement with the feedback direction; Adapt records your rewritten feedback alongside the original; Reject records your reason for not using it. These actions do not apply document text, complete tasks, create canonical business decisions or verify the feedback as fact. Use the document editor separately when you intend a document change.

Each response preserves the owner alias, reason, exact comparison at response time and predecessor response. Reconsidering a response adds another record; it never replaces the comment or earlier response. The current comparison distinguishes text, version and context changes. Even unchanged section text in a newer version requires explicit acknowledgment. An ambiguous, damaged or excessive version chain is refused instead of choosing an arbitrary target. Feedback stays attached to its original document ID/version.

Changes to form input clear the preview and confirmation. Stale project state or an outdated predecessor response requires rereading before saving. Archived projects are read-only. These local owner aliases describe the recorded workflow; they are not authenticated identities. Source and retry copies of responses retain selected original/current text, so export or source removal does not erase every copy.


## Task responsibilities and prerequisites

Open Task responsibilities to record or clear a responsible alias and choose required tasks/checks. The alias is local metadata in a versioned record; it does not change the dossier schema, invite anyone, prove acceptance or grant access. The workspace task list displays the recorded alias, no recorded owner, or an explicit unavailable state if the responsibility history is damaged.

Prerequisites update the existing task dependency graph. Unknown IDs, duplicate selections, self-dependencies and cycles are refused. The preview shows old/new ownership, old/new prerequisites, prerequisite statuses, newly required reviews and the resulting task progress/substantiation. Changing only an alias leaves task status and evidence untouched. Changing prerequisites preserves progress but can mark this task and its dependents as stale under the existing invalidation rules. Removing a prerequisite does not automatically clear earlier review flags.

The selector displays every saved prerequisite plus up to 500 unselected candidates and discloses that bound. Existing selections are never silently dropped. Saving requires exact preview confirmation; editing clears confirmation, and unsaved input blocks switching tasks or projects. Earlier responsibility records remain readable. Archived projects are read-only; damaged history is not silently treated as no owner. This UI changes existing tasks; it does not infer new tasks or people.

Business decisions can explicitly record the decision maker's local alias, remaining uncertainty and up to 20 current owner-response IDs. The preview includes each original comment, response and original/current document comparison. Only explicit selection adds these responses to decision context; Accept never creates a business decision. Historical decision references remain fixed when a response is later revised. Aliases are unauthenticated statements; neither agreement nor a saved choice validates demand. Legacy decisions keep missing attribution unrecorded.

Imported comments can be read together by exact original document ID, version and section. Each contribution retains its original review questions, claimed reviewer alias, response history and original text. New versions form separate groups even when section labels match. These local discussion views send no messages, infer no consensus and create no evidence or decisions.

An offer section revision can explicitly select a current Accept or Adapt feedback response as its review source. The response must have been reviewed against that exact current document version and section; a later version requires another explicit feedback review. Selecting the source does not fill or save proposed text automatically. The owner supplies the replacement text and reason and confirms the entire new-version preview. The changed section remains a proposal with the response ID as context; other fields and original versions are retained. Experiment and feedback sources cannot both be selected in one section edit. Linked pilot feedback revisions are not supported by this route.

The feedback screen includes a local attention overview and an optional view filter for comments needing review. Each imported comment is counted once as unreviewed, changed since its latest response, or reviewed against current context. Historical responses are not additional notifications. Opening or filtering this view neither writes to the project nor sends anything. The filter resets when reopening the screen. A response can be explicitly reaffirmed after its document/context changes, with the required changed-context acknowledgment; identical repeated responses against unchanged context remain refused. Reviewed does not mean validated, resolved, delivered or accepted by a reviewer.

Project exports containing imported feedback now use startkompas-export-v2 when older project snapshots are required to verify the original review package. They include only those required project snapshots (up to 500, within the existing 64 MiB bundle limit), alongside the current dossier and recorded artifact files. Snapshots contain historical project metadata: treat the whole export as private, not as a selected reviewer package. This is not a complete backup of every historical revision. Restoration validates snapshot paths, hashes, project identity and revision and refuses missing required snapshots. Current versions still read v1 bundles; older applications may reject v2. Existing v1 bundles without needed history cannot reconstruct that missing history—re-export from the intact original project when available.
