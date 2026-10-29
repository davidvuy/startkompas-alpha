# Market, offer and feasibility — draft procedure 0.1.0

Scope: a small digital B2B pilot. This is original procedural guidance informed by general research methods, not proof of demand or a Belgian legal/tax determination. Read only the procedure needed for the present decision. Keep sourced facts, proposed experiments and actual outcomes separate. All six procedures produce a saved business artifact; none authorizes contacting, buying or deploying.

## 1. Customer learning → interview guide and evidence log

Reuse a suitable existing guide in the same client/period/version before making one. Start with the costly uncertainty that could change substantial work. Fit preparation, actual conversations and review inside known available time; when access is missing, cap preparation and leave spare capacity visible.

Ask about a concrete recent job, how it was done, effort/consequences, current workaround and buyer decision. Discuss a proposed solution only after understanding the current work. Record direct statements, observations, interpretation, refusals and unresolved questions separately, with date and limited participant code. A blank evidence log is not an interview. Avoid requesting customer files for initial problem discovery.

Save the guide plus a blank log or actual attributed findings. Record a proposed decision rule before interpreting outcomes, but do not impose a universal interview-count threshold. Compliments, hypothetical prices and model predictions do not establish purchase intent. A useful next step may be another narrow check rather than a dashboard.

## 2. Alternatives → comparison sheet

Include the current workaround and doing nothing, alongside relevant alternatives actually identified. For each record the job served, known constraints, observed price and date/source, switching effort and unknowns. Research current vendor details before recommending a purchase. Do not invent competitors, prices, usage or absence of alternatives. Distinguish externally sourced specifications from comparative judgment. Save a compact table and the decision it informs, with unresolved fields visible.

## 3. Value proposition → offer hypothesis

State: for a named tentative segment and job, propose one concrete outcome delivered in a limited way, compared with the present workaround. Label the promised outcome as a hypothesis unless supported by actual evidence. Save scope, exclusions, evidence supporting/contradicting it and the next check. Avoid a feature list masquerading as evidence. A stronger pitch is not validation.

## 4. Pilot boundary → pilot brief

Save intended learning outcome, eligible client/context, one deliverable, exclusions, responsibilities, proposed period (unknown if unsupplied), data limits, acceptance observations and stop/review condition. Distinguish acceptance of an output from market demand and from legal/operational readiness. Reuse the project's recorded agreements and open checks. Avoid silent default capacity, risk tolerance or calendar promises. Keep one milestone and at most three ordinary next actions; retain all urgent blockers.

## 5. Pricing → pricing assumption sheet

Record a proposed price/charging unit, who decides to buy, evidence of actual payment or commitments (if any), relevant alternatives, costs and terms still to clarify. A cost floor does not prove willingness to pay; a stated willingness is not a sale. Save the price assumption as proposed, with its source, uncertainty and a proportionate test. Keep grants, taxes, discounts, renewals and service promises unknown until researched/supplied rather than adding defaults.

## 6. Feasibility → cost scenario and decision note

Use explicit same-period units and integer euro cents with the installed helper. Never use null as zero. Separate fixed, per-unit and excluded/unknown costs; explicitly state whether founder effort, taxes, one-off costs and transition overlap are included. Do not automatically amortize an upfront payment into cash availability. Budget is an internal constraint, not law or payment authorization.

    node src/costs-cli.mjs calculate <scenario.json>
    node src/costs-cli.mjs brief <scenario.json>

Start with examples/cost-scenario.json only as a synthetic NotePilot quote example. The helper prints results; save them using an actual host file operation and read back. Attach the useful document via the existing guarded dossier route when continuity is needed. If price, volume, cost or budget is absent, keep the affected calculation unknown. Positive arithmetic does not prove demand, capacity, cash solvency or readiness.

For a single unit type with positive contribution, break-even units are fixed cost divided by selling price minus variable unit cost, rounded up for whole units. Nonpositive contribution has no positive-volume recovery of fixed costs; distinguish zero-cost/zero-margin edge cases. Compare plausible input scenarios only when their assumed values are explicit, not fabricated facts. Save what decision follows (for example hold a supplier change, narrow scope or obtain a missing quote) and its remaining blockers.

## Sources, interpretation and limits

General method source checked 2026-10-27: [SBA business planning](https://www.sba.gov/counseling/plan-your-business/) covers direct research, alternatives and cost estimation. Its older market/cost URLs redirect here; an attempted old break-even URL returned 404 and was not counted as read. [SBA break-even calculator](https://legacy.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs/break-even-point/calculate) states the single-unit formula. These are US general-method references, not Belgian obligations.

Use only the scoped method/formula: do not adopt the page's implication that break-even arithmetic proves real viability, nor its questionable quarterly-to-monthly divisor. Inputs here require a common explicit period and no automatic period conversion. Those source interpretation concerns stay open in the register. All templates and prose here are original; no third-party text copied. No independent business reviewer or real participant validation has occurred. Link claims and unresolved interpretation in the SK22 register; do not label this module qualified-reviewed.

## Compare explicit cost scenarios

Use `node src/costs-cli.mjs compare <comparison.json>` for structured results or `compare-brief` for a Dutch/English comparison table. The request is `{language: "nl" | "en", scenarios: [{label, scenario}, ...]}`; each scenario follows the existing cost schema. See examples/cost-comparison.json (synthetic inputs only). Supports two to ten unique labels. All scenarios must have exactly the same project, currency, period and unit; no implicit conversion. Different quantities remain visible. The first scenario is the delta baseline, not a recommended choice. Missing inputs keep affected deltas unknown. Preserve each source and exclusions; total-cost comparison alone cannot establish equivalent scope, quality, willingness to pay or authorization to spend. Save the table with the existing guarded attachment route when it is a project deliverable.

## Versioned business briefs

The executable `src/business-cli.mjs` helper prepares the first five procedures as a saved draft: `interview`, `alternatives`, `offer`, `pilot`, or `pricing`. Costs keep their existing calculation helper. `types` lists the field keys and Dutch/English headings. Select only the requested procedure. The helper organizes supplied text; it does not perform interviews, infer market facts, research competitors, generate qualified advice or send messages.

Use `examples/business-brief-request.json` only with the synthetic Orbit example. Adapt identity, current revision, client/context, period and supplied fields to the actual project. Each field has `key`, `value`, `assertion` (`proposal`, `reported`, or `unknown`) and `record_ids`. Reported content requires linked project records; their existence does not prove the report true. Unknowns use null. Omitted fields stay unknown. No silent prices, risk tolerance, commitments or participants are inserted.

```powershell
node src/business-cli.mjs types
node src/business-cli.mjs prepare ../project ../brief-request.json
```

The JSON output contains `content` (a structured JSON document including readable `document_markdown`), `update_request`, `artifact_id` and changes. Preparing is read-only. Save the exact content as UTF-8 and save the update_request separately, then:

```powershell
node src/core-cli.mjs attach ../project ../brief-update.json ../brief-content.json
node src/business-cli.mjs read ../project project-id business-artifact-id
node src/business-cli.mjs render ../project project-id business-artifact-id
```

`render` prints the saved Markdown and current stale/successor warnings. Save that output as an optional readable export; the registered JSON is canonical for the draft and contains field provenance. Resume using `read`/`render`, not by preparing a replacement. Retry an uncertain attach using the exact saved request. Proposal and save are separate so an interrupted host operation can be inspected and retried using the existing guarded storage route.

For a revision, read the prior brief and supply its `previous_artifact_id`, a `change_reason`, a new operation ID and current dossier revision. Send the complete new field set; this is not a patch (omitted fields become unknown and appear in the change list). The new version retains all prior bytes and records before/after field values. The previous version must match kind, client/context and period. A known same-scope first draft is refused when one already exists; an obsolete predecessor with a recorded successor is refused. Unknown scope returns candidates for explicit inspection rather than guessing identity. This exact-scope check complements the broader reuse procedure; it does not discover unregistered files or semantic synonyms.

A linked premise change marks the saved draft for review. Prior drafts remain readable and identify successors. A new draft is not a new substantive approval; outdated basis records still require assessment. Interview drafts include an empty observation log and never mark an interview done. The five procedures have synthetic local tests only; independent user and specialist acceptance remain open.
