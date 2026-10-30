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

Read saved draft opens a verified existing business document without entering edit mode, including historical versions and review warnings. Follow its recorded basis links, or open tasks, assumptions and review flags to inspect the original record and its declared prerequisites/dependents. Relationship lists show up to 100 links each and disclose truncation. These are recorded relationships, not inferred dependencies or new verification. Corrupt documents are refused without repair or writes.

Search this project uses case-insensitive literal matching across canonical records, 25 results per page. Results open the original record. The query and revision stay fixed across pages; changed projects require refreshing before another search. Draft metadata is searchable, but attachment document contents are not searched. No external index or AI calls are involved.

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
