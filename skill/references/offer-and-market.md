# Offer, market and feasibility

Six procedures. Each produces one saved artifact. Read only the one the present decision needs — never run all six because the founder asked about pricing.

None of these authorizes contacting anyone, buying anything or deploying. Keep sourced facts, proposed experiments and actual outcomes separate throughout.

## 1. Customer learning → interview guide and evidence log

Reuse a suitable existing guide for the same client scope and period before making a new one. Start from the costly uncertainty that could change substantial work.

Fit preparation, the actual conversations and the review inside the founder's known available time. When access to participants is missing, cap preparation and leave the spare capacity visible rather than filling it with more preparation.

Ask about a **concrete recent instance**: what the job was, how they did it, the effort and consequences, their current workaround, and who decides on buying. Discuss a proposed solution only after you understand the current work.

Record separately, each with a date and a limited participant code: direct statements, your observations, your interpretation, refusals, and unresolved questions. Avoid asking for customer files during initial problem discovery.

Save the guide plus either a genuinely blank log or actual attributed findings. **A blank evidence log is not an interview.** Record a decision rule before interpreting outcomes, but do not impose a universal interview-count threshold.

Compliments, hypothetical prices and model predictions do not establish purchase intent. A good next step is often another narrow check, not a dashboard.

## 2. Alternatives → comparison sheet

Always include the current workaround and doing nothing, alongside alternatives you actually identified.

For each: the job it serves, known constraints, observed price with its date and source, switching effort, and unknowns.

Never invent competitors, prices, usage figures, or the absence of alternatives. Research current vendor details before recommending any purchase. Keep externally sourced specifications distinct from your own comparative judgment.

Save a compact table and the decision it informs, with unresolved fields visible.

## 3. Value proposition → offer hypothesis

State it as: for a named tentative segment and job, propose one concrete outcome, delivered in a limited way, compared against the present workaround.

Label the promised outcome a **hypothesis** unless actual evidence supports it. Save scope, exclusions, the evidence supporting and contradicting it, and the next check.

Avoid a feature list masquerading as evidence. A stronger pitch is not validation.

**Worked example:** [examples/offer-v1.md](examples/offer-v1.md) is a complete offer hypothesis in this shape — every section names its basis and its label, the price is marked as a proposal with its derivation, and the contradicting indication ("nobody has been asked to pay") is stated rather than omitted. Its matching dossier records are in [examples/worked-project.json](examples/worked-project.json). Aim for that, not for a confident plan with the uncertainty removed.

## 4. Pilot boundary → pilot brief

Save: the intended learning outcome, eligible client and context, **one** deliverable, exclusions, responsibilities, proposed period (`null` if not supplied), data limits, the acceptance observations, and the stop or review condition.

Keep three things distinct: acceptance of an output, market demand, and legal or operational readiness. Reuse the project's recorded agreements and open checks.

Never insert a default capacity, risk tolerance or calendar promise. Keep one milestone and at most three ordinary next actions; retain every urgent blocker.

## 5. Pricing → pricing assumption sheet

Record: the proposed price and charging unit, who decides to buy, evidence of actual payment or commitments if any, relevant alternatives, costs, and terms still to clarify.

A cost floor does not prove willingness to pay. A stated willingness is not a sale. Save the price as a **proposed** value with its source, its uncertainty, and a proportionate test.

Keep grants, taxes, discounts, renewals and service promises `unknown` until researched or supplied. Do not add defaults. Tax treatment of the price is jurisdiction-specific — see the relevant [jurisdiction pack](jurisdictions/README.md).

## 6. Feasibility → cost scenario and decision note

Use one explicit period for every input and integer currency minor units (cents). **Never use `null` as zero.**

Separate fixed costs, per-unit costs, and excluded or unknown costs. State explicitly whether founder effort, taxes, one-off costs and transition overlap are included. Do not amortize an upfront payment into available cash.

Budget is an internal constraint — not law, and not authorization to spend.

**Break-even**, for a single unit type with positive contribution:

```
contribution_per_unit = selling_price - variable_cost_per_unit
break_even_units      = ceil( fixed_cost / contribution_per_unit )
```

With non-positive contribution there is no positive volume that recovers fixed cost — say that instead of producing a number. Handle zero-cost and zero-margin edges explicitly rather than dividing.

Compare scenarios only when every assumed value is explicit. All compared scenarios must share the same project, currency, period and unit — never convert periods implicitly. Different quantities stay visible. The first scenario is the delta baseline, not a recommendation. Missing inputs keep the affected deltas unknown.

Save what decision follows — hold a supplier change, narrow the scope, obtain a missing quote — and its remaining blockers. Positive arithmetic does not prove demand, capacity, solvency or readiness.

## Versioning a brief

Each of these artifacts is versioned per [dossier-format.md](dossier-format.md).

A revision names its predecessor and a `change_reason`, preserves the earlier document in full, and records which fields changed. Supply the complete new field set — a revision is not a patch, so an omitted field becomes `unknown` and shows up in the change list.

The predecessor must match in kind, client scope and period. When the scope is unknown, present the candidate predecessors for the founder to choose rather than guessing identity.

A linked premise change marks the saved draft `review_required`. Earlier versions stay readable and identify their successor. A new draft is not a new substantive approval: an outdated basis record still needs assessment.

## Method sources and their limits

General method reference, checked 2026-10-27: [SBA — plan your business](https://www.sba.gov/counseling/plan-your-business/) covers direct research, alternatives and cost estimation. The [SBA break-even calculator](https://legacy.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs/break-even-point/calculate) states the single-unit formula. An older break-even URL returned 404 and was not counted as read.

These are **US general-method** references. They establish nothing about any jurisdiction's obligations.

Use only the scoped method and formula. Do not adopt the source's implication that break-even arithmetic proves viability, and do not adopt its quarterly-to-monthly divisor — inputs here require one common explicit period with no automatic conversion. That interpretation concern stays open in the register.

All procedural text here is original; no third-party text is copied. No independent business reviewer and no real participant validation has occurred.
