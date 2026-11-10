# Bounded compatibility evidence

> **This matrix describes the legacy Node runtime, not the `skill/` folder.** The skill has no dependencies and its own compatibility evidence is recorded in [skill/evals/cases.md](../skill/evals/cases.md) — where **nothing has been scored on any host yet**. Do not read this table as evidence about the skill.

This matrix describes local development evidence as of 2026-11-03, not a promise that every public release contains these changes. The versions below were recorded while `package.json` read `0.1.0-alpha.12.1`; it now reads `0.1.0-alpha.14.2`, so these results do not describe the current package. Identify a tested build by its full source revision and installation manifest, never by the version string. No independent platform certification or customer validation is implied.

| Combination | Evidence and boundary |
| --- | --- |
| Windows / Node 26.7.0 | Exercised locally with locked dependencies. Other Node versions, macOS and Linux are not verified by this matrix. |
| Project 1.0.0 | Core read/write and explicit copy upgrade tests. Workflow-dependent features require 1.1.0. |
| Project 1.1.0 | Local workflow, module trial, import and recovery tests. Synthetic data only. |
| Legacy sk09-v1 | Legacy route remains separate; explicit migration preserves original bytes and provenance. No silent upgrade. |
| Unknown future schema | Refused without rewriting; no downgrade inference. |
| Export v1 | Current project and declared artifacts/references. Historical feedback missing from older bundles cannot be invented. |
| Export v2 | Required review-context snapshots supported by current transfer code. Older readers may refuse it. Not an entire-history backup. |
| Template v1/v2 | Format validation, declared compatibility, custom fields and immutable saved origin tested. Older installations may reject new optional metadata. |
| Module package v1 | Inspection and fictional trials, including retention/discard/export/restore. No executable plugins or live activation. |
| Edge local UI | Specific synthetic flows exercised, including import comparison. Other browsers are not certified. Standalone mentor-file rendering/download remains unverified. |
| Remote connectors / hosted accounts | Not implemented or tested by these local routes. No background synchronization or delivery promise. |

## Reproducible tested package

Exact installation source `e5d57103f3b897dadce06111c4ffef1640b3e771`, manifest `be0574b478a4f0f44970fe69dcfe1d01b65511ed08a3fd8289f1a78289485994`: 294 selected files and 24 locked dependencies verified. Nine module/library tests passed. An additional 49 core/workflow/history/transfer tests passed in that installation, including real interrupted-write processes, legacy migration, 1.0 copy upgrade, retained originals, tamper refusal and export/restore. These focused results are not a new full-suite claim.

Reproduce the compatibility set with `node --test tests/core.test.mjs tests/workflow.test.mjs tests/history.test.mjs tests/transfer-consistency.test.mjs`, and the module set with `node --test tests/module-library.test.mjs tests/module-package.test.mjs`. Record actual platform, Node version, commit, manifest and terminal result for each new environment. Do not mark an OS supported merely because CI configuration mentions it.

Later documentation commits do not alter those historical test results. Recheck changed runtime behavior and a clean package before recommending another build. No automatic upgrade is recommended solely by a green version badge.

## Integrated contract candidate

Exact source `98dba465add15b7286e2258b1772c536d75436df`, installation manifest `26ea3aeff65094790219718ee3cfa9c2141414a897687e6a751f45d58b470065`: 313 selected files and 24 locked dependencies verified. The complete installed suite passed428/428 tests in137550.1958ms (terminal exit0), including the project-command contract changes and existing recovery/UI/API tests. This evidence remains Windows/Node26.7.0 and synthetic; it does not certify another platform, independent security or actual user outcomes. Subsequent documentation-only updates are not part of that exact manifest. Public alpha has not been republished.
