# Your first result with Startkompas

Startkompas keeps assumptions, decisions, tasks and drafts together for your business idea. This is an early local alpha. The menu, browser workspace and fictional demo make no AI calls. Optional Codex assistance has separate access requirements and provider costs.

## Install

Install Node.js with npm. The development pin is 26.7.0; the published alpha CI also exercises Node 24. Download the complete repository or release ZIP, extract it into a new folder and open a terminal there, alongside `package.json` and `start.mjs`.

```sh
node --version
npm ci --ignore-scripts --no-audit --no-fund
node start.mjs
```

Dependency installation downloads the locked packages. No administrator rights or API key are required.

## Try the fictional demo

Choose **3** in the menu. Supply a new folder outside the application, such as `../my-startkompas-demo`. It must not already exist. The demo creates a fictional project, offer and report and checks export/restore. A successful run prints `"result": "pass"`. Read `workspace.md` and `report.md` in the demo folder. No actual customer conversation takes place.

## Create your own project

Run `node start.mjs` and choose **2**. Enter a name, a lowercase project ID such as `my-idea`, a new private folder such as `../my-idea`, and optionally a first task. Confirm with `yes` only when those details are correct. Keep the project ID and folder path for resuming.

Choose **5** to prepare an offer. Enter the project folder and ID, leave unknown answers blank, and inspect the English draft before saving. Choose a new private retry folder outside both the app and project, such as `../my-idea-save-1`, then confirm. Each separate save uses a new retry folder. `/cancel` exits a guided draft without saving.

## Use the browser preview

In development builds containing `src/local-ui-cli.mjs`, create or choose a separate existing parent folder for your projects, then run:

```sh
npm run ui -- ../my-projects
```

Open the private link printed by the terminal. Create a project in three steps: name and first task, optional customer/outcome context, then review and confirm. Back retains your answers; unknown context can stay blank. Choose **Draft an offer** to reuse that context, fill in what you know, preview and confirm saving. To revise a saved offer, choose **Revise this offer** and record a reason. Earlier versions remain intact. Use **Export a report** to select sections, preview and save a new local Markdown file. **Archive project** hides it from active projects without deleting files; **Show archived projects** lets you find and restore it. Keep the terminal open while using the workspace; Ctrl+C stops it. See [local workspace](local-ui.md) for access boundaries and recovery. The released alpha 4.1 predates this browser preview.

## Resume and export

Menu **4** resumes the same project folder and ID. Menu **6** previews a report, asks for a new file outside both the app and project, and saves only after `yes`. Existing files are never overwritten. If the project changes after preview, prepare a fresh preview. A report is not a full backup.

## Troubleshooting

- Missing `node` or `npm`: install Node with npm and open a new terminal.
- Missing `package.json` or `start.mjs`: change to the extracted application folder.
- Incomplete installation: run the dependency command above, then menu **1**.
- Destination exists: use a new destination for creation; use menu **4** for an existing project.
- Wrong project ID: use the original ID; never create over your existing folder.
- Upgrade: extract separately, retain the old app and private data, and test a copy/export first.

[Ask a question](https://github.com/davidvuy/startkompas-alpha/discussions) or [report a bug](https://github.com/davidvuy/startkompas-alpha/issues/new/choose). Include the version, OS, Node version, step and error. Use fictional examples; never share customer information, credentials or complete private projects. Read the [product guide](alpha-workspace.md) for more workflows. Drafts and assumptions are not evidence that customers want the offer.
