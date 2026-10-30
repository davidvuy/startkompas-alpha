# Local workspace preview

This first month-one increment creates empty projects and reads the existing workspace view in a browser. Reports, archive controls and the extended intake are still CLI/skill-only or planned; this is not the completed month-one product.

## Run

Use the repository's documented Node version and install its locked dependencies. Create or choose a separate existing directory for projects, outside the application. From the application directory run:

```powershell
npm run ui -- "C:\your-projects"
```

Open the private session link printed by the terminal. Keep that terminal open. Stop with Ctrl+C. Each restart has a new session link; old tokens cannot authorize the new server. The application serves its own scripts, stylesheet and logo; it makes no AI calls or external asset requests. Files remain in the selected directory. Other software or cloud folder synchronization can still copy them.

The sidebar lists valid projects immediately inside that chosen directory, with name, ID, folder, revision and modification time. It never searches the computer. Select a project to read open tasks, assumptions, stored draft summaries and review items. Suggested order is based on saved records, not real-world validation.

Choose New project, supply a name and unique lowercase ID, optionally a first task, then explicitly confirm the destination. Existing folders are never overwritten. Cancel returns to the overview without saving; unsaved inputs stay in the form until a successful save or page reload. Browser refresh reloads the project list; select the project again. The same directory and ID work with the existing CLI and skill.

If a project is moved within the selected directory, refresh and select its new folder. If missing, restore the original folder and refresh; the interface does not recreate or overwrite it. If moved outside the selected directory, stop and start with its new parent. Invalid or linked projects are not opened. Use existing backup/restore tools for damaged content; this preview does not repair it automatically.

## Architecture and local boundary

`local-workspace.mjs` adapts existing `initializeProject`, `readCore` and `workspaceView` operations. It does not implement a second schema or write JSON directly. The write surface includes project creation and previewed offer creation/revision. Offer edits reuse prepareBusinessBrief and saveGuided with revision and content-hash checks. CLI tests verify that a project created through HTTP reads identically through a separate CLI process.

The Node HTTP server binds only to 127.0.0.1 on an ephemeral port. Exact Host, Origin and a fresh 256-bit process token protect every data endpoint. Fetch Metadata blocks foreign-site API requests, including same-site requests from another origin. Only navigation to the static root document is allowed from another site; it contains no project information or token. The fragment token is removed from the address bar and retained in tab session storage. Do not share the start link.

The static allowlist contains four assets. There is no arbitrary file-serving endpoint, shell execution or browser-supplied filesystem path. Project references are opaque process-local handles. The selected parent is canonicalized, linked children and linked dossier files are refused, reads use existing size/schema/identity checks, listings are capped at 200 directory entries, and request bodies at 64 KiB. CSP disallows inline code, external resources and framing. No CORS access is granted. Request content is not logged.

This is not an OS sandbox: another process running as the same user, a privileged browser extension, compromised dependencies or concurrent malicious filesystem replacement are outside this web-origin boundary. No independent security audit has been performed.

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

Choose Draft an offer or Revise this offer. Unknown answers stay blank. Context and period remain fixed when revising; give a change reason. Unchanged fields retain their recorded basis, while changed text becomes a proposal with no automatic source attribution. Preview is read-only. Saving requires confirmation of the exact server-held preview, expires after 15 minutes, and rejects changed project bytes or revision. Up to 20 previews are retained in memory. Repeated saves of the same successful preview return the same receipt without a duplicate revision. New versions retain previous draft bytes. Retry bundles are generated in unique sibling folders; the browser cannot choose arbitrary paths. After interruption inspect the project and retry bundle before another save. Existing saved documents retain their original bytes and language.
