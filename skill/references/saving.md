# Saving, verifying and resuming

No server, no database, no dependency. Plain file reads and writes with the host's own tools.

## Before the first write

Establish **one** private project directory, outside this skill and outside any public repository. Ask for it only when no authorized location is already established. Never create a project just because a new chat started — look for an existing one first.

Keep private project files out of public issues, public repositories and shared exports.

## The write sequence

For every authorized change to `project.json`:

1. **Read** the current `project.json`. Note its `revision`. If it does not parse, stop and report — do not overwrite a damaged file.
2. **Snapshot** those exact bytes to `.history/<revision>-<sha256>.json`. Never skip this.
3. **Apply** only the intended change. Preserve every other collection entry exactly.
4. **Increment** `revision` by exactly 1.
5. **Write** the file.
6. **Read it back.** Confirm it parses, that `revision` is what you expect, and that your change is actually present.
7. **Report** the real path and the new revision.

For an artifact: write the file into `files/` first, hash the exact bytes you wrote, then record the artifact entry with that hash in steps 3–6.

Do not report a save until step 6 succeeded. A write command returning without error is not confirmation.

## When a write goes wrong

- **Does not parse after writing** — preserve the file as it is. It is diagnostic evidence. Report what is on disk; do not retry blindly over it.
- **Revision is not what you expected** — something else changed the project. Stop, show the founder the difference, and let them decide. Never merge silently.
- **Partially written file** — preserve it, and recover from the matching `.history/` snapshot into a *new* revision with a stated reason.
- **Uncertain whether the write happened** — read the file. Never repeat a write to resolve uncertainty.

## Permission

A request to save or revise already authorizes **that scoped write**. Do not ask twice for the same permission.

**Approving the content is not the same as authorizing a write.** "That looks good", "perfect", "yes that's right" and similar are judgments about the draft, not instructions to put it on disk. Ask where to save it, and save only after they say so. Equally, do not invent a project path in order to have somewhere to write.

A save request does not authorize a wider one either. Ask again before: writing outside the agreed directory, changing records the founder did not mention, deleting anything, or producing a copy intended to leave the machine.

Before writing an export meant for someone else, show the exact content first and let the founder confirm it. Exports are frozen copies — a later project change never updates them, and a generated export is not cleared for sharing merely because it exists.

## Never do these

- Edit or delete a `.history/` entry
- Rewrite an existing event
- Change a `reported` assertion to `observed` without a new source
- Create a second canonical store alongside `project.json`
- Migrate an older format silently — propose an explicit copy upgrade that preserves the original
- Reuse an artifact ID for different content
- Claim a save, a path or a version you did not read back

## Resuming

1. Read `project.json`. Confirm `project_id` matches what the founder expects. On a mismatch, stop and resolve identity first.
2. Report the current `revision`, the active task, the latest artifacts, every `review_required: true` record, and the open assumptions.
3. Read the actual artifact files before revising them. Never reconstruct an artifact from conversational recall.
4. If the latest state looks damaged, say so and offer the newest intact `.history/` snapshot — without presenting a restore as a validated state.

Reinstating a snapshot creates a new revision with a `snapshot_restored` event and a reason. It never rewinds `revision`, never deletes later history, and never re-validates restored evidence.

## What the format cannot do

It does not encrypt, lock concurrent writers, or survive power loss. Two hosts writing the same project at once will corrupt it. Deleting this skill does not erase the founder's projects, their exports, or any provider's records of what was sent.
