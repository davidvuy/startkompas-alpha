# Updating a fork without losing local work

Use the public product repository as upstream, not the private development repository. Keep dossiers and retry bundles outside every checkout. Record the installed source revision and package fingerprint before changing code; the app version alone does not distinguish unreleased development snapshots.

## Extension boundaries

| Change | Preferred boundary | Compatibility obligation |
| --- | --- | --- |
| New worksheet | Separate template ID and version; custom fields through template v2 | Validate exact fields and preserve saved template snapshots. |
| Procedural package | Data module package with its own ID/version | Declare supported schemas and command contract; use fixed template-selection routes. |
| External automation | Published command dispatcher and --contract | Preserve project identity, revision, explicit selection and exact retry requests. |
| New core behavior | Focused source change plus regression | Review schema, export and migration implications; do not edit project JSON directly. |

Data files do not automatically register a library entry. The current library uses a fixed allowlist; inspect and trial a custom package through its explicit file path. The installer/public package allowlists must deliberately include new distributable files. A fork's modified package has a new fingerprint and must not claim the original manifest verifies it.

## Review an upstream change

Start with a clean committed branch and a backup of private data. Inspect `git remote -v` and verify that upstream points to the intended public repository. Fetch upstream, inspect its commits and changes, and select a specific commit or tag. Create a separate update branch from your fork before merging. Use `git merge --no-ff --no-commit <reviewed-upstream-commit>` to review before creating the merge commit; `git merge --abort` abandons an in-progress merge. Do not use force reset to discard your customizations. Resolve conflicts field by field and retain original authorship.

Install the locked dependencies and run the changed-area regressions, then the package's full test command before accepting the update. Review manifest changes using the public contributor guide. Do not silently add private files or source material to packaging. Only commit the merge when the reviewed result and checks are satisfactory.

Git mechanics: [merge options](https://git-scm.com/docs/git-merge) and [GitHub fork synchronization](https://docs.github.com/en/enterprise-cloud%40latest/pull-requests/how-tos/work-with-forks/syncing-a-fork). Reviewed 2026-11-03.

## Rehearse data upgrades separately

Code merge is not data migration. Export an existing project, restore into a new private directory, and test the copy with the candidate app. For sk09-v1 use `project migrate <old-directory> <expected-id> <new-directory>`; this creates a 1.0.0 copy retaining original bytes and mapping. For 1.0.0 use `project upgrade-workflow <directory> <expected-id> <new-directory>` to create a 1.1.0 copy. Neither command upgrades in place. Check identity, retained source, unknown values, history/artifacts and a second export/restore before choosing the copy for further work.

Keep the old application and original data until that rehearsal succeeds. Returning to old code does not downgrade a newer dossier; use the original unchanged copy. A v2 export containing required review history may be unreadable to older applications. Consult support-matrix.md for actual evidence and gaps.
