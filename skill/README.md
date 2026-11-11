# Startkompas — the skill

A skill for AI assistants that helps a solo founder prepare a small B2B service pilot **and keeps the evidence straight**: what was reported, what was observed, what is still an assumption, and which conclusions depend on it.

Plain markdown. No Node, no npm, no dependencies, no server, no API key. Install by copying this folder — see [INSTALL.md](INSTALL.md).

## What it actually does

Most assistants will happily write you a confident business plan full of invented numbers. This skill does the opposite:

- **Separates reported, observed, inferred and unknown**, and refuses to promote one to another without a source.
- **Records every claim with its source and check date**, so you can tell six months later whether it still holds.
- **Tracks which conclusions depend on which assumptions**, so when a supplier, price or customer changes you learn what needs re-reviewing instead of guessing.
- **Keeps history** — a revision never erases the earlier decision or its reason.
- **Verifies jurisdiction-specific rules against a primary source** instead of answering from memory, and says so plainly when it cannot.

It stores all of this as plain files in your own directory. See [references/dossier-format.md](references/dossier-format.md).

## Layout

```
SKILL.md                            entry point and the method
INSTALL.md                          install per host
CHANGELOG.md                        skill versions, independent of the runtime

references/
  method.md                         intake, labelling, execution
  dossier-format.md                 the file format (plain JSON + markdown)
  saving.md                         write, verify, resume
  offer-and-market.md               six procedures: interviews → offer → pricing → feasibility
  pilot-conditions.md               the eight topics every pilot depends on
  pilot-package.md                  assembling a connected pilot draft
  sources-and-review.md             recording claims, four review dimensions
  run-limits.md                     bounded tasks, honest stopping
  domain-screening.md               fifteen-domain breadth check
  examples/
    worked-project.json             a complete project at revision 3
    offer-v1.md                     the matching founder-facing offer
  jurisdictions/
    README.md                       research protocol, pack index, cross-border findings
    eu-gdpr.md                      shared GDPR layer
    eu-vat-sme.md                   shared small-enterprise VAT layer
    belgium.md  netherlands.md  germany.md  france.md

evals/
  cases.md                          22 conversation cases to score per host
  results.md                        coverage audit; no behavioural score yet

scripts/                            the checks, their lib and their tests
```

## Checks

```sh
node scripts/check-all.mjs
```

One command, no dependencies. It runs every check, starting with the tests over the checks themselves — because a broken check invalidates every result after it. The command prints what it ran; [scripts/README.md](scripts/README.md) says what each one proves, what it fails on, and the conventions they all follow.

They verify **structure**, not behaviour. For behaviour, run [evals/cases.md](evals/cases.md) by hand against your host and record the outcome in [evals/results.md](evals/results.md) — which is still empty of behavioural scores.

## Jurisdictions

The method is worldwide. The **rules** are not, so they live in packs: four national ones and three shared EU layers, all checked 2026-11-10 or 2026-11-11, with seven annexes. Each states per claim whether its source was actually read or is still unresearched.

Why packs rather than one "EU" answer? Same question, same day, four different answers:

| Must I send structured B2B e-invoices? | |
| --- | --- |
| Belgium | already, since 2026-01-01 — **including** under the small-business VAT exemption |
| France | from 2027-09-01 for small founders, and only via an accredited platform |
| Germany | from 2028-01-01 — but able to *receive* since 2025-01-01, where an email address suffices |
| Netherlands | no domestic mandate at all; one announced for 2030-07-01, not yet law |

[references/jurisdictions/README.md](references/jurisdictions/README.md) has the full contrast — four different unfair-terms remedies, a genuine convergence on software ownership, and the traps that catch anyone reasoning across a border.

For a country with no pack, the skill follows the research protocol in that file: use the universal topic list, check that jurisdiction's own official source, record it with a date — and **never produce a threshold, rate or deadline it did not actually read**.

Adding a pack for your country is the most useful contribution you can make. The bar is verifiability, not volume.

## Status and limits

Experimental. **No behavioural eval has been scored on any host**, and no independent user, security or legal review of any part of this exists. No measured time saving or business outcome is claimed. See [CHANGELOG.md](CHANGELOG.md) for the known limits of the current version.

It records attribution and keeps history. It does not establish that any recorded claim is true, and it is not legal, tax, accounting or security advice.

MIT — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
