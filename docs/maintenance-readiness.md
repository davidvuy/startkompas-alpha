# Maintenance readiness

Rewritten 2026-11-10 for the skill-first repository. The previous version listed five responsibilities and marked every one "Unassigned", which was honest but not useful: an unstaffed table does not become staffed by being tabulated.

This project has **one maintainer**. That is not going to change by planning for it, so the design question is what a one-person project can actually sustain.

## What is actually assigned

| Responsibility | Who | How it is actually discharged |
| --- | --- | --- |
| Product scope and publication | Owner | Direct decision. [BACKLOG.md](../BACKLOG.md) records the open ones, item 11 first. |
| Structural correctness of the skill | Automated | `.github/workflows/skill.yml` on every push and pull request: frontmatter, links, reachability, host neutrality, runtime-freedom, size budget. |
| Source URL health | Automated | `skill/scripts/check-links.mjs` in the same workflow. Fails on 404/410 or unresolvable host; reports 403 and redirects. |
| Pack freshness | Automated + owner | Scheduled Monday job opens or comments on one "Jurisdiction packs need a recheck" issue. Acting on it is the owner's. |
| Secret scanning | Automated | `.github/workflows/secrets.yml`, checksum-pinned Gitleaks over full history. |
| Legacy runtime regressions | Automated | `.github/workflows/quality.yml`, 565 tests on three OSes and two Node versions. Fate pending backlog item 11. |
| Security and conduct reports | Owner, GitHub-only | [SECURITY.md](../SECURITY.md) private advisories; [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md). **No second responder and no response-time guarantee.** |

## What is deliberately not assigned

Naming an unwilling or non-existent assignee is worse than recording the gap.

- **Independent technical review and release approval.** Unassigned. No release here has been reviewed by anyone else.
- **Qualified jurisdiction review.** Unassigned. No accountant, lawyer or data-protection specialist has reviewed any pack, in any country. Every pack says so in its own text.
- **Independent security review.** Unassigned.
- **Accessibility review.** Unassigned.
- **Named incident responders, primary and alternate.** Unassigned, and a delivery test has never been run.

A documented policy is not an assigned person, and an automated check is not a reviewer.

## Recheck cadence

The packs are the part that decays. Four packs, rechecked twice a year, is eight research sessions annually — budget them rather than discovering them.

| When | What |
| --- | --- |
| Every Monday | Automated freshness check; act only if it opens an issue |
| Before a dated obligation takes effect | Recheck that claim specifically. Next: before 2027-01-01 (German issuing phase, Belgian VAT step), then before 2027-09-01 (French issuing for small businesses) |
| By 2027-05-10 | Full recheck of all four packs, updating the check date **even when nothing changed** — "checked and unchanged on this date" is itself information |
| On any pack edit | Re-run the eval cases that encode dates (C4–C6, C14–C18) |

## If work stops

Likely, and worth planning for rather than denying.

- The repository stays usable: the skill is plain markdown with no dependencies to rot.
- The packs become the liability, because they read as authoritative. The per-claim check dates and the "Next full recheck due" line exist so a reader can see the staleness themselves, and the skill is instructed to say so out loud when a pack is past its date.
- If a stop looks likely to exceed one recheck cycle, add a dated banner to the README saying when the packs were last verified. A clearly stale project is more useful than a silently stale one.
- Nothing here runs on a server, holds user data or costs money to leave in place.

## What counts as a user

Decided here so the question stops being open.

**Not** a star, a clone count or a download. Those measure attention, and this project has no evidence that attention converts to use.

A user is someone who **resumed a project they had saved earlier** — because that is the one behaviour the product exists to enable, and the one a casual visitor will not produce by accident.

That is not observable from here: the skill has no telemetry and will not get any. So it can only be learned by asking. Until someone says they resumed a saved project, the honest user count is **zero**, regardless of any other number. See backlog items 96–100.
