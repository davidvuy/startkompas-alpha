# The 50 improvements: implementation and remaining evidence

Updated 2026-10-30. This register concerns the improvement suggestions, not completion of the original SK01–SK60 acceptance criteria. Implemented means code or documentation exists; it does not imply independent user validation. The user chose GitHub-only contact for now.

| # | Improvement | Status and concrete evidence |
| --- | --- | --- |
| 1 | Prominent contact entry | Implemented: README help links |
| 2 | Question form | Implemented: question issue template |
| 3 | Bug form | Implemented: version, steps, expected/actual result |
| 4 | Problem-first feature form | Implemented: feature issue template |
| 5 | Discussions | Enabled and verified in the repository navigation on 2026-10-30; Issues remain available |
| 6 | Support mailbox | Deferred by user: GitHub-only contact |
| 7 | Public/private reporting distinction | Implemented: support guide, SECURITY and issue chooser |
| 8 | Notification delivery test | Custom watch configured for Issues, Pull requests, Discussions and Security alerts; actual delivery untested |
| 9 | Issue follow-up routine | Documented: security-maintenance guide; recurring human execution not established |
| 10 | FAQ from recurring questions | Initial FAQ implemented; real recurring-question evidence still missing |
| 11 | Fast first result | Implemented: guided setup and deterministic founder demo; novice timing unmeasured |
| 12 | Short demonstration video | Implemented: 40-second rendered video of actual fictional CLI output; explicitly not a screen recording |
| 13 | Fictional example project | Implemented: demo-founder-workflow generates a complete example |
| 14 | Screenshots of actual output | Implemented: five readable previews of captured CLI output; rendered panels, not OS screenshots |
| 15 | Guided next steps | Implemented: workspace journey, draft, add and task-state |
| 16 | Actionable doctor failures | Implemented: reinstall/dependency/skill recovery guidance |
| 17 | Independent installation test | Open: no independent tester supplied |
| 18 | Dutch and English instructions | Superseded by the English product policy: English guides and prompts; historical language codes remain readable |
| 19 | Additional Node versions | Passed in alpha3 run 41029497263: Node 24.x and 26.7.0 on all three OS targets |
| 20 | macOS verification | Helper tests passed on macOS in alpha3 run 41029497263; host/Codex discovery remains untested |
| 21 | Idea-to-offer route | Implemented: assumptions, linked observations/decisions and guided offer drafts |
| 22 | Guided interview preparation | Implemented: interview draft wizard and blank log |
| 23 | Findings linked to assumptions and decisions | Implemented: reported observations with context links, scoped sources and decision basis |
| 24 | One suggested next action | Implemented: workspace show; explicit deterministic ordering, not discovered urgency |
| 25 | Assumption investigation queue | Implemented: assumptions ordered by declared dependents, with review state |
| 26 | Understandable resumption | Implemented: overview and workspace show with current drafts/checks/tasks |
| 27 | Optional content differences | Implemented: compare --values; default still excludes private values |
| 28 | Change impact | Implemented: workspace impact plus existing invalidation; declared dependencies only |
| 29 | Readable Markdown export | Implemented: selected sections, preview and content-digest confirmation |
| 30 | Draft/review/uncertainty status | Implemented for saved drafts and fields; no independent approval status invented |
| 31 | Automatic secret scanning | Implemented: push/PR/manual Gitleaks workflow |
| 32 | Local pre-commit check | Implemented: opt-in scan-staged.sh; does not silently install hooks |
| 33 | Credential incident procedure | Documented: alpha-security-maintenance.md |
| 34 | Reviewed dependency/manifest updates | Implemented: existing Dependabot plus refresh-public-manifest; review and CI still required |
| 35 | Backup/restore exercises | Implemented: workspace recovery-check and demo CI; no scheduled private-project automation |
| 36 | Crash/concurrency regressions | Existing recovery tests retained; new stale-save/exact-retry tests added; physical power loss remains unqualified |
| 37 | Hostile imported-content tests | Existing security tests plus guided hostile text/escaping tests; AI-host behavior not certified |
| 38 | Export data preview | Implemented: selected content, sections, bytes and digest before writing |
| 39 | Local/AI data boundary | Documented in README, support and security-data-flows; no telemetry added |
| 40 | Independent security review | Open: requires an actual independent reviewer |
| 41 | Concrete README use case | Implemented: guided founder workflow and example outputs |
| 42 | Repository topics | Implemented and UI-verified: business-planning, cli, codex, nodejs |
| 43 | Social preview image | Blocked: browser file upload requires extension access to local file URLs; existing README header remains |
| 44 | Public roadmap | Implemented: four-week roadmap plus this status register |
| 45 | User-focused changelog | Implemented: alpha-changelog.md |
| 46 | Public contribution instructions | Implemented: CONTRIBUTING.md, manifest and secret-check guidance |
| 47 | Small contribution tasks | Ideas documented in CONTRIBUTING; no manufactured bug reports or labeled issues published |
| 48 | Practical tutorials | Implemented: EN/NL workspace guide and end-to-end fictional example |
| 49 | Relevant community sharing | Open: no external posts sent; choose actual communities and their rules before outreach |
| 50 | Consented user stories and optional star request | README request implemented; no user stories fabricated, consented experiences still missing |

## Additional product improvements in this increment

Source-age review, explicit task-progress reasons, full guided draft revisions, selective export confirmation and a non-destructive recovery drill make the existing storage capabilities directly usable. None adds a cloud service, account system, payments or background model calls.
