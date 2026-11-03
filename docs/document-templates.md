# Versioned document templates

A template supplies questions and boundaries, never prefilled findings. Format `startkompas-document-template-v1` requires an ID, positive integer version, name, document kind, audience, scope, required input keys, unknowns to investigate, boundaries and one prompt for every canonical document field. The five existing business document kinds are supported. Unsupported properties are refused. Validation also rejects omitted or repeated sections, unknown required inputs, empty boundaries and default answers.

`required_inputs` identifies answers needed to use the template meaningfully. It is not permission to invent an answer and does not prevent saving an explicitly incomplete draft. Missing required answers remain null/unknown and are listed in the preview. Supplied text is a proposal with no invented basis records. Template validation checks structure, not the truth or safety of arbitrary authored text.

## Commands

Run `node src/startkompas.mjs templates validate <template.json>` to check a template (maximum64 KiB). The result includes its stable content fingerprint. Run `node src/startkompas.mjs templates prepare <project-directory> <request.json>` to prepare a document without changing the project. The request has exactly these fields:

- `project_id`, `expected_revision`, `expected_sha256`: the project identity and exact current state.
- `template`: the complete validated template object.
- `answers`: a mapping of document field keys to your text; absent or blank answers stay unknown.
- `client`, `period`: explicit strings or null, using the normal business-document scope rules.

The preparation returns the exact document content and existing guarded `update_request`. Review them before attaching/saving through the normal business artifact route. This command does not save, send, call a model or execute template text. The browser offers the same three built-in worksheets through Service templates.

Each created document embeds the complete template snapshot, ID/version and fingerprint, plus missing required keys **at creation**. Later document revisions retain that origin; historical missing-input metadata is not a claim about current completeness. Editing an external template file cannot alter an existing document. The v1 format covers existing fields. The v2 offer format and personal-library commands described below add custom fields and saved worksheet versions.

## Built-in service library

`node src/startkompas.mjs templates list` returns eight complete worksheets with their fingerprints. `templates show <id>` displays one: `bounded-audit`, `implementation-service`, or `recurring-reporting`, or `experiment-card`. Review its audience, scope, questions, unknowns and boundaries before choosing. Audits focus on assessment and findings; implementation focuses on configuration, dependencies and handover; recurring reporting focuses on sources, cadence and missing-data handling. None supplies customer findings or promises.

`templates prepare-library <project-directory> <request.json>` uses the same preparation fields as above, replacing `template` with `template_id`, `template_version` and `template_sha256` from the reviewed library entry. A changed version or fingerprint is refused: inspect the current entry and explicitly choose again. Preparation remains read-only and incomplete answers stay unknown. Only the eight fixed library files are loaded; IDs cannot select arbitrary paths. In the browser, open Service templates from a project. Read the worksheet, choose Use, answer only what you know, preview the full draft and explicitly confirm saving. This creates a separate draft of the selected document kind; it does not revise an existing draft. Archived projects allow reading only. Unsaved answers block project switching and are not included in setup/offer recovery. Changing an answer clears the previous preview and confirmation.

## Personal worksheets and custom offer fields

Personal worksheet versions are project artifacts in your private project folder. They use the existing guarded attachment route; they are never added to the shipped library. `templates personal-list <directory> <project-id>` reads the complete bounded history (maximum 200 versions). A damaged history refuses processing instead of hiding duplicates. Each new ID starts at version 1; updates name the latest artifact and increment its version exactly once. Previous bytes and document snapshots remain unchanged.

`templates personal-prepare <directory> <project-id> <request.json>` accepts exactly `revision`, `sha256` and `input`. Input contains `previous` (null for a new ID, otherwise the latest saved template artifact ID) and a complete `template`. It returns an unsaved preview and guarded attachment request. `templates personal-draft` accepts the same outer fields; its input contains `artifact_id`, `template_sha256`, `answers`, `client`, and `period`. A deliberately selected historical worksheet can be reused; the document retains that exact version. These commands prepare only: review and save through the existing guarded artifact route.

Format `startkompas-document-template-v2` adds one to ten `custom_fields` to an **offer** worksheet. Each definition has `key` matching `custom_[a-z][a-z0-9_]{0,39}`, `label` (up to 120 characters) and `prompt`. Canonical sections remain required and cannot be replaced. Required inputs may include custom keys. Duplicate keys and default answers are refused. Other document kinds retain the v1 canonical format for now.

Custom offers use `startkompas-business-brief-v2`. Their field definitions and original template are immutable within a document history. To use a different field structure, create a separate draft. Ordinary offer edits, focused revisions, suggestions, comparisons and selected summaries include custom content. Existing callers that revise canonical fields retain the prior custom values and provenance. Scenario adoption changes its canonical fields and retains current custom fields; neutral interview guides still use canonical questions only. Custom answers are proposals or unknowns, not evidence. In the browser, open Service templates and choose Customize a copy. Edit the questions, audience, scope, unknowns and boundaries; add up to ten custom offer fields. Review the complete worksheet and confirm Save worksheet version. Use selects that exact saved version to create a separate draft. Edit next worksheet version is available only for the current personal version; older versions remain listed and can be deliberately reused. Worksheet changes never revise existing documents. Browser authoring currently covers offers; other v1 document kinds remain available through commands. Unsaved worksheet edits are excluded from recovery copies and block switching projects.


## Experiment planning card

The built-in `experiment-card` worksheet prepares an experiment document with question, method, audience/situation, effort, desired observation, decision rule and boundaries. All answers start blank. Unknown time, cost and participants remain unknown. Missing required planning inputs are disclosed in the draft. Select Service templates → Use Experiment planning card, preview and confirm. Saved sections use the existing focused revision flow and retain earlier decision rules and exact worksheet origin. Personal worksheet customization remains offer-only.

The current card records a plan, not execution or results. Its date does not establish that it preceded the experiment. Open a saved experiment card and choose Experiment start declaration. A complete current plan can receive one confirmed user start declaration. This records a statement, not independently verified execution. With a readable start declaration, choose original content from Source inbox, enter an observation date, observation, separate optional interpretation and contributor alias, then preview and confirm. The preview shows the exact source and planning fingerprints. Editing clears confirmation; unsaved experiment edits block project switching and are excluded from recovery copies. Saved observations remain separate from the immutable planning snapshot. Damaged or changed provenance requires review; removing an inbox source removes linked observations through the source-removal flow. No task, assumption or evidence is automatically promoted. Do not treat a desired observation as a result or a saved card as permission to spend money or contact participants.


## Choosing an experiment method

The generic card remains available when none of these methods fits. Four additional experiment worksheets use the same blank-answer, exact-preview, immutable-origin and confirmed-save flow. Choose based on the uncertainty, not on a promised validation score.

| Worksheet | Preparation material | What the observations may inform | What it cannot establish alone |
|---|---|---|---|
| `experiment-problem-conversation` | Neutral opening, recent-occurrence questions, workaround questions and separate quotation/interpretation notes | A particular reported problem and its context | Prevalence, willingness to pay or future behavior |
| `experiment-prototype-check` | Starting state, neutral task, completion criterion, assistance log and debrief | Performance of a specific task with the tested prototype | Demand, production reliability or accessibility for everyone |
| `experiment-offer-conversation` | Proposed scope/exclusions/price, comprehension questions, objections and decision-process notes | How the proposal is understood in that discussion | A sale or payment from compliments or hypothetical agreement |
| `experiment-paid-pilot` | Proposed deliverable, acceptance check, terms to discuss, delivery log and separate effort/payment records | Delivery and observed value in one bounded context | Profit, repeatability, retention or general demand |

Prompts help users prepare their own material; they supply no answers, participants, agreements, payment records or execution. State time/cost limits and contrary outcomes before running a check. Store actual source material separately and use the experiment observation flow to retain provenance. A method can produce inconclusive observations; choosing one never marks a business assumption validated.

Saved section guidance and missing-section prompts retain the selected worksheet snapshot alongside general guidance, including after a focused revision. They do not read a newer library version or insert guidance as an answer. Experiment observation preview and recorded history expose the original decision rule, effort/cost text and stop conditions from the exact start plan. If that plan cannot be verified, those conditions remain unavailable rather than being taken from a newer plan.


## Proposing a next step from observations

Open the experiment start screen after recording sourced observations. Select one or more observations from that plan, choose Continue, Adapt, Park or Investigate further, and enter your reason and proposed implications. Select any current offers or tasks you propose to affect; name the relevant offer sections in your implications. The exact preview shows the original conditions, selected observations and target snapshots. Review and confirm before saving. Saving records a proposal only: apply any subsequent document or task changes through their separate reviewed flows.

The list discloses its bounded target search. Unlisted and unrecorded dependencies may exist. Later target or source changes flag the review context; they do not rewrite the saved proposal. Removing a source removes linked experiment observations and proposals through source management, including a proposal using other sources as well. Unsaved experiment forms are excluded from recovery copies. Complete or discard one form before moving to another.
