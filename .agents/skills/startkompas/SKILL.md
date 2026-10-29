---
name: startkompas
description: Help a solo founder prepare a limited digital B2B service pilot by checking consequential assumptions, producing one useful result and recording evidence for the next step. Use for startup validation, project handoff or a material change to an existing pilot plan; not for unrelated standalone editing or coding.
license: MIT for original instructions; retained scaffold notices in NOTICE and LICENSE-APACHE-2.0.
---

# Startkompas

Help the founder advance one explicit milestone with evidence. The first content scope is a Belgian solo founder, Belgian business pilot customers and no employees. Flag other jurisdictions, consumers, staff or regulated activities as needing additional scoped review; do not silently adapt the conclusions.

For installed command discovery use `node src/startkompas.mjs --help` and docs/commands.md. The common entry point routes to existing helpers; proposals still require their documented save/readback steps. Use `project init` only for a new empty project and `project handoff` for existing work. Direct and legacy helpers remain available.

## Choose the smallest useful intervention

Follow the user's requested outcome. For a simple edit, translation, calculation, explanation or coding fix, do that task without imposing startup intake or reopening an entire business plan. Use the broader procedure when uncertain assumptions, continuity or a material change affect what the founder should do next. Answer in the user's language; Dutch and English are intended, not yet behaviorally validated.

## Work from evidence

1. Establish the project and requested milestone from the user's input and relevant existing files. Reuse prior artifacts and decisions. When resuming, read the actual saved files and identify their project/revision if present; do not substitute conversational recall. If identity or versions conflict, resolve that conflict before changing the affected project.
2. Identify the missing fact or dependency most likely to change substantial follow-up work. Distinguish user-reported facts, observations, inferences and unknowns; retain source and scope. A template value, confident wording or completed checkbox is not evidence. Do not invent risk tolerance, a planning horizon, marketing activity, capacity or validation results. Legitimately sourced values remain usable.
3. Select one useful next action with the founder's existing constraints. Prefer a concrete result such as a validation brief, evidence-backed decision or scoped change assessment over a broad checklist. Keep essential unresolved conditions open while allowing independent work. For a changed supplier, customer group or other assumption, revisit only dependent conclusions and preserve the earlier decision and its reason.
4. Perform the authorized work with available host tools. For consequential country-specific claims, check current primary sources and distinguish their applicability from qualified review still needed. Preparing outreach or a pilot does not authorize the assistant to send messages, purchase services or publish it. Distinguish those execution limits from a suggested next action for the founder: do not invent an approval gate on the founder's own future work. When giving a bounded time plan, reserve time for the actual learning step and review, not only preparation; if access is missing, give a smaller preparation fallback and keep unused capacity visible.
5. Report the result, supporting artifact/source, remaining uncertainty and next dependency. Show one milestone, at most three ordinary actions and all urgent blockers. Keep a requested short brief compact (roughly one page); place reusable templates or detailed provenance in separate artifacts instead of expanding the brief. Ask at most two questions that materially affect the next decision; do not delay independent useful work for optional answers. Do not give an overall compliance score or imply that preparing a closed pilot proves compliance.

Before using a packaged procedural module, read it through `node src/module-cli.mjs detail <module-resource>` (or the domain-detail helper). A restriction/withdrawal returns the reason and next step instead of content. Preserve historical work and use docs/module-maintenance.md to flag matching dossier dependencies. No matching notice is not substantive approval; the local policy does not automatically update older installations.

For an intake, new milestone or relevant change that needs a breadth check, use [domain-screening.md](references/domain-screening.md). The fifteen-domain index distinguishes questions and draft procedures from reviewed guidance; a catalog entry is not evidence that a project has been assessed.

When recording researched claims or review decisions, use [source-register.md](references/source-register.md) to keep source, interpretation, applicability and coverage review separate.

For adaptive daily work, concrete execution and readable Dutch/English evidence, use [daily-work.md](references/daily-work.md). Small standalone questions still bypass broad intake.

For research or tool-execution work, use [run-limits.md](references/run-limits.md) to set a bounded task and preserve partial outcomes. A missing phase budget is not filled in by operational task limits.

## Saving and handoff limits

For customer learning, alternatives, offer/pricing assumptions or pilot costs, use [market-offer.md](references/market-offer.md) for the selected business deliverable.

For scoped pilot conditions and unresolved review needs, use [pilot-conditions.md](references/pilot-conditions.md). Research worksheets do not approve a real pilot.

To combine a pilot brief, conditions, costs, acceptance, unsent recruitment and support, use [pilot-package.md](references/pilot-package.md), reusing existing work.

For schema 1.1.0 material choices, change handling or prior-work reuse, read [workflow-route.md](references/workflow-route.md). It adds scoped dependency/planning helpers to the local core. Earlier dossiers require an explicit copy upgrade; do not silently change their schema.

Check the stored schema and available application files before choosing a helper. For `sk09-v1`, read [local-route.md](references/local-route.md): this remains the original create-only route. For the experimental `1.0.0` dossier core, read [core-route.md](references/core-route.md): it supports guarded updates, explicit export/restore and targeted handoff. Do not silently migrate an older project, invent commands, create a competing canonical dossier, or claim durable memory from a chat response.

When the user authorizes saving an ordinary result, use an actual file operation in the identified private project location outside the public source tree. Preserve existing work, verify the written artifact by reading it back, and report its path and scope. A saved brief is an artifact, not proof of a validated dossier lifecycle. If the location or necessary write capability is missing, state the missing prerequisite and provide an unsaved draft. Existing project files remain authoritative; unsupported migration or conflicting writes need resolution before mutation.

Report data movement precisely: “no additional external tool transfer” does not mean “no data left the device.” Read file content and tool output can enter the host/model context and logs. Do not claim local-only processing or no data transmission merely because no outreach/upload command was run; account retention and provider settings remain unverified unless actually checked.
