# Startkompas — the skill

A skill for AI assistants that helps a solo founder prepare a small B2B service pilot **and keeps the evidence straight**: what was reported, what was observed, what is still an assumption, and which conclusions depend on it.

Plain markdown. No Node, no npm, no dependencies, no server, no API key. Install by copying this folder — see [INSTALL.md](INSTALL.md).

## What it actually does

Most assistants will happily write you a confident business plan full of invented numbers. This skill does the opposite:

- **Separates reported, observed, inferred and unknown**, and refuses to promote one to another without a source.
- **Records every claim with its source and check date**, so you can tell six months later whether it still holds.
- **Tracks which conclusions depend on which assumptions**, so when a supplier, price or customer changes, you learn what needs rereviewing instead of guessing.
- **Keeps history**: a revision never erases the earlier decision or its reason.
- **Verifies jurisdiction-specific rules against a primary source** instead of answering from memory — and says so plainly when it cannot.

It stores all of this as plain files in your own directory. See [references/dossier-format.md](references/dossier-format.md).

## Layout

```
SKILL.md                         entry point and the method
INSTALL.md                       install per host
references/
  method.md                      intake, labelling, execution
  dossier-format.md              the file format (plain JSON + markdown)
  saving.md                      write, verify, resume
  offer-and-market.md            six procedures: interviews → offer → pricing → feasibility
  pilot-conditions.md            the eight topics every pilot depends on
  pilot-package.md               assembling a connected pilot draft
  sources-and-review.md          recording claims, four review dimensions
  run-limits.md                  bounded tasks, honest stopping
  domain-screening.md            fifteen-domain breadth check
  jurisdictions/
    README.md                    research protocol, how to add a pack
    belgium.md                   verified packs, all checked 2026-11-10
    netherlands.md
    germany.md
    france.md
evals/cases.md                   eighteen conversation cases to score per host
scripts/check-skill.mjs          self-check (optional, stdlib only)
```

## Jurisdictions

The method is worldwide. The **rules** are not, so they live in packs.

Four verified packs exist: **Belgium, Netherlands, Germany, France** — all checked 2026-11-10, each stating per claim whether the source was actually read, carried from earlier research, or not researched at all.

Why packs rather than one "EU" answer? Same question, same date, four different answers:

| Must send structured B2B e-invoices? | |
| --- | --- |
| Belgium | already, since 2026-01-01 — including under the small-business VAT exemption |
| France | from 2027-09-01 for small founders, via an accredited platform |
| Germany | from 2028-01-01; but must be able to *receive* since 2025-01-01 |
| Netherlands | no domestic mandate; one announced for 2030-07-01 |

For any other country the skill follows the protocol in [references/jurisdictions/README.md](references/jurisdictions/README.md): use the universal topic list, check that jurisdiction's own official source, record it dated — and **never produce a threshold, rate or deadline it did not actually read**.

Adding a pack for your country is the most useful contribution you can make. The bar is verifiability, not volume.

## Testing it

```bash
node scripts/check-skill.mjs
```

That checks structure: frontmatter, links, self-containment, host neutrality. It cannot check behaviour — for that, run [evals/cases.md](evals/cases.md) by hand against your host and record the results.

## Status and limits

Experimental. No independent user validation, no independent security or legal review, no scored eval run yet. No measured time saving or business outcome is claimed.

It records attribution and keeps history. It does not establish that any recorded claim is true, and it is not legal, tax, accounting or security advice.

MIT — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
