# Dossier format

A Startkompas project is plain files in a directory the founder chooses. No database, no server, no dependencies. Any text editor can read it; any host that can write files can maintain it.

```
<project-dir>/
  project.json                  # the canonical record set
  files/                        # saved artifacts (offers, briefs, matrices)
  .history/<revision>-<sha256>.json   # append-only copies of earlier project.json
  exports/                      # optional readable copies; never canonical
```

`project.json` is authoritative. `.history/` is append-only — never edit or delete an entry. `exports/` holds frozen copies for sharing; a later project change never updates them.

## project.json

```json
{
  "format": "startkompas/2",
  "project_id": "my-idea",
  "name": "Short project name",
  "revision": 1,
  "jurisdiction": {
    "founder_country": null,
    "founder_region": null,
    "customer_country": null,
    "delivery_location": null,
    "pack": null
  },
  "sources": [],
  "facts": [],
  "assumptions": [],
  "decisions": [],
  "tasks": [],
  "artifacts": [],
  "links": [],
  "events": [],
  "active_task_id": null
}
```

Unknown fields are `null`. An empty collection is `[]`. Never use `null` as zero, and never use `0` for an unknown amount.

### sources

Where a claim came from. Not the claim itself.

```json
{
  "id": "source-2026-11-10-fps-economy",
  "title": "FPS Economy — procedures for the self-employed",
  "type": "primary_official | secondary | user_report | interview | vendor_terms | internal_document",
  "location": "https://… or a file path or a described physical source",
  "scope": "What this source does and does not cover",
  "published_at": null,
  "effective_from": null,
  "checked_at": "2026-11-10",
  "recheck_trigger": "What event or date makes this stale"
}
```

Prefer the relevant primary source. A user report or a secondary explanation is not automatically primary evidence. Unknown dates stay `null` — never estimate one.

### facts

Something actually reported, observed or inferred. Every fact carries its assertion level and its sources.

```json
{
  "id": "fact-p01-rewrites-report",
  "text": "Participant P01 rewrites their monthly report by hand.",
  "assertion": "reported | observed | inferred",
  "source_ids": ["source-interview-p01"],
  "scope": "One participant, one conversation, 2026-11-04. Not a market finding.",
  "recorded_at": "2026-11-04",
  "review_required": false
}
```

- `reported` — someone said it. Their saying it is the fact; its truth is not established.
- `observed` — you or the founder directly saw it happen.
- `inferred` — a conclusion drawn from other records. Name them in `links`.

Never promote `reported` to `observed` because it sounds credible, because it was repeated, or because work was deferred.

### assumptions

Something the project depends on that is **not** established.

```json
{
  "id": "assumption-teams-want-clarity",
  "text": "Small teams want an existing report clarified.",
  "assertion": "unknown",
  "source_ids": [],
  "test": "What concrete check would change this",
  "recorded_at": "2026-11-04",
  "review_required": false
}
```

An assumption stays `unknown` until a fact with a real source replaces it. Do not delete the assumption when that happens — add the fact, add a `supersedes` link, and leave the history intact.

### decisions

```json
{
  "id": "decision-narrow-first-offer",
  "text": "Prepare a narrow offer for one customer conversation.",
  "reason": "Why this, now",
  "basis_ids": ["fact-p01-rewrites-report"],
  "status": "active | superseded | withdrawn",
  "supersedes": null,
  "reconsider_when": "The condition that should reopen this",
  "decided_at": "2026-11-04"
}
```

A revision never erases the earlier decision or its reason. Set the old one to `superseded`, point the new one at it with `supersedes`, and keep both.

### tasks

```json
{
  "id": "first-offer",
  "title": "Prepare a testable first offer",
  "progress": "open | in_progress | parked | done",
  "substantiation": "unreviewed | reviewed",
  "basis_kind": "own_requirement | reported_requirement | obligation",
  "evidence_ids": [],
  "depends_on": [],
  "period": null
}
```

`progress: "done"` means the work happened. It never means the evidence is approved — that is `substantiation`. Keep them independent.

### artifacts

```json
{
  "id": "offer-v1",
  "kind": "offer | interview_guide | alternatives | pricing | pilot_brief | conditions_matrix | pilot_package | report",
  "version": "1",
  "location": "files/offer-v1.md",
  "sha256": "…",
  "basis_ids": ["fact-p01-rewrites-report", "assumption-teams-want-clarity"],
  "supersedes": null,
  "change_reason": null,
  "created_at": "2026-11-04",
  "review_required": false
}
```

Write the artifact file first, hash the exact bytes you wrote, then record it. A matching hash proves bytes, not correctness.

### links

The declared dependency graph. This is what makes change handling possible.

```json
{
  "dependent_id": "offer-v1",
  "prerequisite_id": "assumption-teams-want-clarity",
  "reason": "The offer's target segment rests on this assumption"
}
```

Only declare links you can justify. The graph is explicitly incomplete: an absent link means "not declared", never "no dependency exists".

### events

Append-only log of what happened. Never rewrite an event.

```json
{
  "id": "event-2026-11-04-offer-draft",
  "type": "project_created | fact_recorded | decision_made | artifact_saved | artifact_revised | source_checked | review_requested | snapshot_restored",
  "at": "2026-11-04",
  "description": "What happened, in one line",
  "subject_ids": ["offer-v1"]
}
```

## Change handling

When a prerequisite changes:

1. Add the **new** record (fact, source or assumption). Do not edit the old one in place.
2. Walk `links` to find every dependent of the changed prerequisite, transitively.
3. Set `review_required: true` on each dependent found. Report them to the founder before changing any of them.
4. Revise only what the founder authorizes. Each revision creates a new version that names its predecessor and a `change_reason`.
5. Add a `review_requested` event naming the trigger.

Reverting a value does not revive evidence. If a fact was superseded and the old value returns, that is a new fact with a new source and a new date.

Unknown dependencies stay unknown. If you cannot represent a change's consequences in this graph, say so plainly rather than claiming complete change handling.

## Revisions and history

Every authorized write to `project.json`:

1. Read the current `project.json` and note its `revision`.
2. Copy it verbatim to `.history/<revision>-<sha256-of-those-bytes>.json`.
3. Apply only the intended changes; preserve every other collection entry.
4. Increment `revision` by exactly 1.
5. Write, then read back and confirm the result parses and contains your change.

If step 5 fails, do not retry blindly — inspect what is actually on disk first. A partially written file is diagnostic evidence; preserve it.

## Restoring an earlier state

Reinstating a `.history/` snapshot creates a **new** revision with a `snapshot_restored` event and a stated reason. It does not rewind `revision`, does not delete later history, and does not re-validate the restored evidence: anything that was `unreviewed` or `review_required` stays that way.

## What this format deliberately does not do

It does not encrypt, lock concurrent writers, survive power loss, detect semantic duplicates, infer undeclared dependencies, authenticate a reviewer's identity, or establish that any recorded claim is true. It records attribution and keeps history. That is all it claims.
