# Local workspace preview

This month-one increment provides project setup, saved work, offer editing, selected report export and reversible archiving in a local browser. Adaptive intake and the remaining roadmap work are still ahead; this is not the completed month-one product.

## Run

Use the repository's documented Node version and install its locked dependencies. Create or choose a separate existing directory for projects, outside the application. From the application directory run:

```powershell
npm run ui -- "C:\your-projects"
```

Open the private session link printed by the terminal. Keep that terminal open. Stop with Ctrl+C. Each restart has a new session link; old tokens cannot authorize the new server. The application serves its own scripts, stylesheet and logo; it makes no AI calls or external asset requests. Files remain in the selected directory. Other software or cloud folder synchronization can still copy them.

The sidebar lists valid projects immediately inside that chosen directory, with name, ID, folder, revision and modification time. It never searches the computer. Select a project to read open tasks, assumptions, stored draft summaries and review items. Suggested order is based on saved records, not real-world validation.

Choose New project, supply a name and unique lowercase ID and optionally a first task. Continue to optional customer/outcome context, then review the exact details and confirm the destination. Back preserves entered answers. Blank context creates no assumption; supplied context is stored as unknown, never as customer evidence. It is reused in the first offer with a link to its recorded basis. Existing folders are never overwritten. Cancel returns to the overview without saving; unsaved inputs stay in the form until a successful save or page reload. Browser refresh reloads the project list; select the project again. The same directory and ID work with the existing CLI and skill.

If a project is moved within the selected directory, refresh and select its new folder. If missing, restore the original folder and refresh; the interface does not recreate or overwrite it. If moved outside the selected directory, stop and start with its new parent. Invalid or linked projects are not opened. Use existing backup/restore tools for damaged content; this preview does not repair it automatically.

## Architecture and local boundary

`local-workspace.mjs` adapts existing `initializeProject`, `readCore` and `workspaceView` operations. It does not implement a second schema or write JSON directly. The write surface includes project creation, previewed offer creation/revision, confirmed selected-report export and confirmed archive/restore events. Offer edits reuse prepareBusinessBrief and saveGuided with revision and content-hash checks. CLI tests verify that a project created through HTTP reads identically through a separate CLI process.

The Node HTTP server binds only to 127.0.0.1 on an ephemeral port. Exact Host, Origin and a fresh 256-bit process token protect every data endpoint. Fetch Metadata blocks foreign-site API requests, including same-site requests from another origin. Only navigation to the static root document is allowed from another site; it contains no project information or token. The fragment token is removed from the address bar and retained in tab session storage. Do not share the start link.

The static allowlist contains five assets. There is no arbitrary file-serving endpoint, shell execution or browser-supplied filesystem path. Project references are opaque process-local handles. The selected parent is canonicalized, linked children and linked dossier files are refused, reads use existing size/schema/identity checks, listings are capped at 200 directory entries, and request bodies at 64 KiB. CSP disallows inline code, external resources and framing. No CORS access is granted. Request content is not logged.

This is not an OS sandbox: another process running as the same user, a privileged browser extension, compromised dependencies or concurrent malicious filesystem replacement are outside this web-origin boundary. No independent security audit has been performed.

## Interface decision

## Inspecting saved work and asking for help

Opening a task in an active project also exposes a confirmed task-change form. Choose it as your active task, or report progress with a reason. Selecting an already active, completed, deferred or inapplicable task as focus is refused. Progress changes preserve applicability, substantiation and evidence links; work marked done is not automatic validation. Archived projects are read-only in this route. Saves check both the displayed revision and digest and use the same retry-bundle writer as the terminal. Reopen a stale task before retrying; the reason form is not part of tab-draft recovery.

Read saved draft opens a verified existing business document without entering edit mode, including historical versions and review warnings. Follow its recorded basis links, or open tasks, assumptions and review flags to inspect the original record and its declared prerequisites/dependents. Relationship lists show up to 100 links each and disclose truncation. These are recorded relationships, not inferred dependencies or new verification. Corrupt documents are refused without repair or writes.

Search this project uses case-insensitive literal matching across canonical records, 25 results per page. Results open the original record. The query and revision stay fixed across pages; changed projects require refreshing before another search. The optional saved-draft text mode searches verified field text in up to 32 newest business drafts, with a 4 MiB document-read budget and 25 results per page. Hits show a short excerpt and open that saved version directly. Corrupt, oversized or older omitted drafts produce an explicit partial-results status; a zero-result partial search is not a claim that the text is absent. General external attachments are never searched. No external index or AI calls are involved.

Report a problem prepares an editable report containing only application version, Node version, platform and blank fictional reproduction fields. It does not include project text/names, paths, tokens or browser data. Review before copying; copy failures select the text for manual copying. The GitHub support link opens the existing issue choices without prefilled data. Nothing is posted automatically. User additions can contain sensitive information, so inspect them before sharing. The report form is not stored by draft recovery.

## Interface decision

## Finding projects and reading history

Find a project filters the loaded project list by name, ID or folder, ignoring letter case. Show archived projects combines with search; the result count includes the total readable projects in the chosen parent. Sort by recently modified (default) or name. Filtering does not close the selected project or discard form text. Refresh projects reloads disk state; search does not scan files or send text to another service.

Project history shows the current revision, up to 50 saved snapshot candidates and the latest 100 recorded events in reverse recorded order. Truncation and unrecognized files are disclosed. Snapshots pass the existing schema, identity and hash checks; invalid or ambiguous snapshots have no comparison button. Compare with the displayed current revision lists changed record IDs/fields using the existing comparison helper. It does not show full before/after values, restore data, assess business impact or approve contents. The project is reread to detect concurrent changes. Both read-only API routes retain the same session/origin and opaque-project-handle boundary as the rest of the workspace. History is not an independent backup.

## Interface decision

The browser prototype reuses the existing Node dependency and storage implementation, while a desktop wrapper would add packaging, update and OS permission work before demonstrating a better user journey. Both need the same application boundary and data checks. This slice chooses the browser provisionally: real Edge use showed one launch-link failure caused by an overly broad Fetch Metadata rule, now corrected and regression-tested. There is no measured end-user preference or comparative desktop benchmark yet. Revisit the wrapper if installation or terminal lifetime becomes an observed obstacle.

Implementation references: [Node HTTP](https://nodejs.org/api/http.html), [Fetch Metadata](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Fetch_metadata), [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy). Top-level navigation and API calls have different security requirements; both retain Host validation and API calls always retain Origin/token checks.

## First-use route and remaining transitions

| Transition | Success | Failure | Cancel/recovery |
| --- | --- | --- | --- |
| Download/install | Existing alpha prerequisite and dependency checks | Dependency/runtime error leaves projects intact | Keep the previous app and separate dossiers |
| Start local server | Terminal prints session link | Missing/invalid root stops startup | Ctrl+C; choose an existing external root |
| Open link | Empty or existing-project overview | Expired session shows explicit error | Reopen current terminal link |
| Create project | Revision 1 with optional unverified task | Invalid fields/duplicate folder refuse save | Back preserves unsaved form until reload |
| Select/resume | ID, folder and revision visible | Missing/replaced identity refuses old handle | Refresh and reselect or restore original folder |
| Prepare offer | Existing skill/menu preview then confirmed save | Existing validation/revision gates apply | Cancel existing flow; browser preview/save with explicit confirmation |
| Close/reopen | Files survive server and browser shutdown | Old session fails after server restart | Start again and select the saved project |

Automated verification: `node --test tests/local-ui.test.mjs`. This covers shared CLI storage, refusal without confirmation, duplicate destinations, invalid input, foreign origins/hosts/sites, absent/invalid tokens, static file boundaries, linked/missing/reidentified projects and token rotation. Browser evidence and exact run results are recorded in the private development checkpoint, not presented as independent user validation.

## Offer editing

An available historical offer can be loaded from its read view as proposed text for a new revision. The editor follows that offer's latest saved successor, retains its client/period, leaves the change reason empty and requires a fresh preview and confirmation. Earlier artifact bytes stay intact. Changed historical text is a proposal; old evidence status is not silently reinstated. This restores offer content as a new version, not the entire project or a filesystem snapshot. Archived, damaged and ambiguous histories are refused.

If the project changed while editing, Compare with latest saved fields follows the same offer's successor chain (up to 100 versions) and shows your unsaved fields beside the latest stored values. After reviewing and checking confirmation, choose to keep your text against that revision or load the latest fields. Neither choice writes the project. Client/period continuity follows the saved offer; changed text remains a proposal. A fresh preview and save confirmation are mandatory, and another intervening change is refused. Archived projects, ambiguous/corrupt chains and missing drafts cannot be silently reapplied. New unscoped offers are not automatically merged with unrelated drafts.

Choose Draft an offer or Revise this offer. Unknown answers stay blank. Context and period remain fixed when revising; give a change reason. Unchanged fields retain their recorded basis, while changed text becomes a proposal with no automatic source attribution. Preview is read-only. Saving requires confirmation of the exact server-held preview, expires after 15 minutes, and rejects changed project bytes or revision. Up to 20 previews are retained in memory. Repeated saves of the same successful preview return the same receipt without a duplicate revision. New versions retain previous draft bytes. Retry bundles are generated in unique sibling folders; the browser cannot choose arbitrary paths. After interruption inspect the project and retry bundle before another save. Existing saved documents retain their original bytes and language.

## Selected report export

Choose Export a report, select sections, preview and confirm. The shared report renderer escapes stored text and retains review warnings. The server rechecks the exact digest before writing a unique Markdown file directly inside the selected projects parent, outside the dossier. The browser cannot supply paths or overwrite an existing file. The saved location is shown. A repeated successful save returns the original receipt. Project files remain unchanged. A report omits attachments and full history and is not a backup. Inspect confidential text before sharing; nothing is transmitted to a recipient.

## Archive and restore

## Practice, resume and tab recovery

New practice projects carry a saved `practice-project` event from revision 1. The marker survives renaming and export/restore, appears in the project list/workspace and is included in new business drafts and report exports. Wizard recovery retains the practice choice. The UI has no conversion action that removes the marker. This is a persistent product label, not tamper-proof protection against deliberate external file edits. Earlier synthetic examples without this event are not retrospectively classified by their names.

Try a fictional practice project fills the setup wizard with an explicitly fictional scenario and a fresh folder ID. Review and confirm before any files are created. The example contains no customer evidence or completed outcomes. It uses the same creation, offer and archive flows as other projects; it is not a sandbox or a real validation result.

After opening a project, this tab remembers its folder and ID. Following refresh, Resume opens that exact project using the current server list, including its archived status. Missing projects are not silently replaced by another project with the same name. This is tab-local convenience, not cross-device history.

Keep an unsaved draft in this browser tab is off by default. Enabling it retains one setup or offer form in sessionStorage on input, replacing the previous recovery copy. It contains the entered text in plaintext; do not enable it on a shared browser profile. Recovery is offered for up to 24 hours and is scoped to the chosen project parent. It does not write a project, preserve a preview/confirmation, make a backup or guarantee survival after tab closure, browser failure or server restart. Browser storage can be unavailable or full; the UI reports failed writes. Browser/session restoration may retain storage longer, so use Forget recovery copy or switch recovery off to remove it explicitly.

Review recovered draft restores only form text. Setup needs all review/confirmation steps again. Offers must match the original folder, ID, project revision, digest and field schema; a fresh preview and confirmation are required. If the project changed, was archived or is unavailable, the recovery text stays readable for manual copying instead of being silently applied. Successful save and explicit discard clear the recovery copy. Back to overview preserves setup text; Discard setup text removes it. Original unknowns and provenance rules still apply.

## Archive and restore

Archive project requires confirmation and the currently viewed revision/hash. It appends an event through the existing transactional storage; it never deletes or moves project files. The active sidebar hides archived projects. Enable Show archived projects, open one and choose Restore project to return it to the active list. Archive state is derived from saved events, survives server restart, and travels with export/restore. Reports remain available while archived; browser offer edits require restoring first. Archiving is an organizational state, not an OS lock: the CLI can still edit the project deliberately. Concurrent changes require refreshing before archive or restore. No task is automatically completed by archiving.

## Durable recovery copies

Recovery copies on this computer keeps an explicit snapshot of the current setup or offer form after a separate privacy confirmation. It writes only to `.startkompas-recovery` inside the selected projects parent, outside project folders. The visible location contains plaintext private text; do not use it on a shared account. Later edits require another explicit copy. Saving or discarding a project form does not remove disk copies; use the per-copy Forget confirmation.

Copies use distinct immutable filenames so separate sessions do not overwrite each other's text. At most 50 copies may normally be kept; each is schema-validated and limited to 128 KiB (HTTP requests also have their existing 64 KiB limit). Form restoration is available for seven days. Expired files remain on disk until explicitly forgotten, not silently erased. Incomplete or damaged files are reported unavailable; inspect the displayed folder manually. This is not automatic saving, encryption, a full backup or a guarantee against disk/power failure.

A new browser/server session lists copies from the same chosen parent. Recovering setup text starts the review steps again; recovering an offer reuses the exact project revision/digest/schema guards described above. No preview token, save confirmation or session credential is stored. Nothing is sent to a third party. A changed project leaves recovery text readable for manual review instead of overwriting current work.

## Resume saved work and field guidance

The project overview shows its last recorded event and most recently recorded business draft. This is recorded order, not a claim that every revision emitted an event or that the document is correct. The shortcut opens that exact draft read-only. A damaged newest draft stays visible as unavailable rather than silently sending you to an older one. Project history remains the route for revision comparisons.

Offer fields include short, accessible descriptions of useful input. Examples are explicitly fictional, remain help text and are never copied into your answers automatically. Unknown fields may stay blank. Supporting indications typed into an offer are not newly verified evidence.

## Error actions

Errors keep their message and receive contextual recovery controls. Return to my form preserves entered text; Refresh project list discovers current folders without reloading the editor. Offer revision conflicts can open the existing explicit comparison. Recovery options expose manual local copies. An unavailable/expired server requires reopening its current terminal launch link; retain the old tab for copying unsaved text. No automatic retries, repairs, file replacement or saved confirmation occurs. The main area marks in-flight operations busy; error focus and keyboard return to the form were checked in Edge.

## Explicit project profile

Project profile records four user-supplied fields: current stage, kind of service, available time and constraints. Each field shows its original assertion, source and statement date; missing answers remain unknown. Update one selected field at a time, review its purpose and confirm the statement/date. Leaving the answer blank records an explicit unknown. No budget, capacity estimate, business maturity or evidence status is inferred.

Profile edits use the existing intake and versioned save paths, with revision/digest and archive guards. Prior sources and revision history remain available. A profile statement is context, not independent validation. Unsaved profile edits have navigation/close warnings but are not covered by setup/offer recovery copies. Guidance that adapts tasks from this profile remains a later increment; saving context does not automatically change tasks or drafts.

## Starting points and field status

Choose a starting point offers three routes in an active project. Explore my idea reuses only its provisional wizard context; Record an existing offer opens blank fields for your own text; Improve this offer selects an explicit current saved version, with client/context, period and ID to distinguish documents. No route selection writes a record or marks skipped work complete. All writes still require an offer preview and confirmation, and revisions need a reason. Unavailable drafts are disclosed rather than silently replaced by an older one.

Offer fields display unknown, proposal or reported status with a linked-record count for unchanged text. Reported does not mean independently verified; changed text becomes a proposal, and blank text remains unknown. The preview remains the authoritative review before saving. A saved draft's review warning is shown without claiming which edited field independently caused it. Wizard customer/outcome questions identify the specific starting assumption and first-offer field they supply. Profile questions remain optional context; not all later adaptive guidance is implemented yet.

## Recorded connections

Recorded connections shows a two-link neighborhood around a selected record. The initial view centers on the most recently recorded business draft, then the active task or first available record when no draft exists. Each row reads from dependent to prerequisite and shows the stored reason. Both endpoints open their original records; Center on this record explores another neighborhood. The record inspector also links back to this view.

The view is read-only, supports archived projects and retains stored assertion/progress/substantiation labels without treating them as a new review. It shows at most 60 records and 200 links, discloses omitted connections and excludes unrelated records. No semantic or market relationships are inferred. The saved graph is not a guarantee that all dependencies were recorded or that attachments remain substantively correct.

## Plan a work session

The session planner explains the saved next-action ordering and lets you select another existing record. It shows recorded blockers and your profile statements with their provenance; choosing another record never overrides a blocker. Brief, focused and extended scopes produce one, two or three bounded preparation steps. These are explicit user choices, not estimated minutes or inferred capacity. The intended-result field makes the proposed session concrete.

Choose an obstacle to adapt preparation: missing information, a choice, limited time, a technical problem or missing access. Missing access offers an invitation draft or an actually available source, never a fabricated interview. Recorded blockers take priority over expanding the work. The planner uses fixed, visible preparation patterns rather than semantic task decomposition or autonomous execution.

You can explore without writing. To persist a choice, supply an intended result, preview the exact text and explicitly confirm. This creates a decision linked to the selected record, recorded blockers and stated profile context. It does not alter task progress, evidence, applicability or active task. Stale previews, archived projects, wrong preview kinds and unauthorized requests are rejected; a retry of a successful save returns the original receipt. Unsaved session edits have navigation/close warnings but are not part of setup/offer recovery.

## Research priorities

Research priorities lists up to the first 200 saved assumptions and openly marks partial lists. You supply impact, uncertainty, research order and a dated reason. Sorting uses your explicit order first, then stated impact, stated uncertainty and direct work-dependent count; priority-assessment history is excluded from that count. There is no weighted market score. Unknown judgments remain unknown.

Each confirmed assessment is a new immutable, checksum-verified local artifact linked to its assumption. Previous assessments and their original bytes remain in project history. A fingerprint of the assumption and its declared prerequisite records detects changed context; stale assessments are displayed but rank as unset/unknown. A fresh assessment can reflect current context while the underlying assumption still requires review. It never validates the assumption or clears existing evidence/review flags.

Damaged or missing latest assessments are shown unavailable without falling back silently to an older score. Restore or inspect the original artifact before updating that assessment. Writes require the current project revision/digest, confirmation, a real calendar date and an active project. Unsaved priority edits have navigation/close protection but are not included in setup/offer recovery copies.

## Decision log

Record a choice, its reason, up to eight alternatives, an optional reconsideration condition, a calendar date and optional recorded context. Preview the exact text before confirming. These are user judgments, not evidence or completed tasks. The latest 100 decisions are shown with explicit truncation; context choices are bounded to 100 records.

Revising an active decision creates a new linked decision and immutable checksum-verified detail file. The previous choice remains readable and becomes superseded. Existing basis links are retained; the preview lists declared dependent records that may require review. Missing legacy alternatives remain unrecorded. Damaged details are unavailable and cannot be silently replaced through revision. Stale previews, wrong preview kinds and archived writes are refused. Unsaved decision edits have navigation/close warnings but are not included in setup/offer recovery.
