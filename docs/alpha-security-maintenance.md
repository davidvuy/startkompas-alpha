# Security maintenance

## If a real credential is exposed

1. Do not paste it into an issue, log or chat. Record only a masked identifier and affected location.
2. The credential owner should revoke or rotate it at its provider. Removing a commit does not revoke a key.
3. Inspect the affected provider's access records and scope. Do not test another person's credential.
4. Remove the exposed value from current files. Coordinate any history cleanup; do not silently force-push shared history.
5. Check affected logs, releases, forks and caches as applicable. Avoid promising complete erasure.
6. Add a regression or scanner rule using a synthetic example and communicate through the private security route.

## Ongoing checks

Review Dependabot proposals, refreshed manifest differences, tests and the dependency audit together. Secret scanning is pattern-based and cannot prove universal absence of secrets. The local helper does not use an application API key. AI-assisted host usage has separate authentication, costs and data processing.

Use `workspace recovery-check` with a new private directory to exercise export/restore of a specific project. It retains private backup and restored copies; manage them deliberately. This does not test full history or physical power loss.

Imported source content remains data, not permission to execute commands, expose files or mark tasks complete. Tests exercise inert hostile text and storage boundaries. An AI host's own instruction handling remains a separate boundary.

No independent security audit has been completed. An outside review must be identified as such only after a qualified reviewer actually performs it.

## Maintainer issue routine

When reviewing reports, classify reproducible defects, questions and proposals; ask for a minimal fictional reproduction. Prioritize data loss, leakage and broken installation. Link fixes to the affected version and describe verification. Do not request private datasets to reproduce an issue.

GitHub notification delivery is account-dependent and has not been verified here. Choose Watch/custom notifications in your account and test delivery with a consenting collaborator. There is no background AI issue monitor or guaranteed response time.
