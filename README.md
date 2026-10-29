<p align="left">
  <img src="assets/startkompas-header.png" alt="Startkompas — Since 2026" width="900">
</p>

# Startkompas — public alpha

Keep project decisions, unfinished work and the basis for your business drafts together. This early local Codex skill lets you save a draft, change a premise, see what needs review and resume later.

This is an experimental alpha. Independent user validation is still ahead. No measured time saving, business success or compliance outcome is promised. Download this repository using Code → Download ZIP, or clone https://github.com/davidvuy/startkompas-alpha. For feedback use https://github.com/davidvuy/startkompas-alpha/issues.

## Try the local helper

Prerequisites: Node.js and npm. The recorded development and package tests use Windows and Node 26.7.0; other versions and operating systems are not yet qualified. Codex access is needed for AI-assisted use, with your provider's own quotas and charges. The following deterministic demo does not call an AI service.

Extract the complete product package into a new directory. In that directory run:

~~~powershell
npm ci --ignore-scripts --no-audit --no-fund
npm test
node src/startkompas.mjs --help
node examples/demo-offer-change.mjs ../my-first-startkompas-demo
~~~

The demo target must not already exist. It uses fictional business text, saves an offer, revises one outcome, retains the original and checks export/restore. It prints its checks and the created output paths.

## Start your project

Keep your private project outside the application folder. Save this as a separate init.json file, adjusting the name:

~~~json
{"project_id":"my-project","name":"My business idea","first_task":{"id":"first-offer","title":"Draft my first offer"}}
~~~

~~~powershell
node src/startkompas.mjs project init ../my-private-project ../init.json
node src/startkompas.mjs project handoff ../my-private-project my-project
~~~

The project starts empty: it does not invent your budget, customers or demand. Use the command guide for intake, draft preparation and explicit saving. The first intake answer can now include its source in one proposed update. Keep the exact saved update request for retries.

For AI-assisted use, open the extracted application folder in Codex. The package contains .agents/skills/startkompas; invoke Startkompas and explicitly identify the separate private project directory. Original local Codex trials are recorded, but automatic discovery in every current desktop build is not guaranteed. The helper commands above remain directly executable.

## Give useful feedback

Use the Issues tab of this repository for non-sensitive feedback. Report the package revision, operating system, Node version, what you tried, what you expected and what happened. Small fictional reproductions are best. Tell us whether you could install, get a useful result and resume without help. There is no automatic usage telemetry in the helper.

Never attach private dossiers, customer data, credentials or full conversation logs to public issues. For sensitive reports use the Security tab and Report a vulnerability if available; otherwise do not submit details publicly. No response-time or support guarantee is offered for the alpha.

## Limits and data

Local dossiers do not make AI processing local: text supplied to Codex can be processed by its provider. Keep backups and inspect exports before sharing. Removing the application does not erase private projects, shared exports or provider records. Do not use draft business content as qualified legal, tax or security advice. Claude, browser/mobile routes and managed cloud services are not offered by this alpha.

The code underlying this alpha has 167 passing source tests and 167 passing clean-install tests. Its fictional offer demo passes seven checks. These are technical checks, not real-user validation.
