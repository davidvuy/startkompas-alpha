# Licensing scope

Original Startkompas code, instructions and technical documentation are offered under the [MIT License](LICENSE), to the extent the contributors hold rights in that work. Copyright notice: 2026 Startkompas contributors. This collective attribution does not identify any AI tool as a legal author, claim ownership of upstream work, or determine whether AI-assisted output attracts copyright.

The root MIT licence is **not a blanket licence for every file in this working repository**. The exceptions below take precedence.

## `skill/` — fully MIT

Everything under `skill/` is original project-authored work under the root MIT licence, including `skill/evals/`. See [skill/NOTICE](skill/NOTICE) for the measured verification that no third-party scaffold material is retained there.

**This resolves an earlier ambiguity.** A previous version of this file excluded `evals/**` from the MIT grant. That exclusion referred to a private development directory at the repository root which **is not present in this repository**. It does **not** apply to `skill/evals/`, which is included.

### The jurisdiction packs

`skill/references/jurisdictions/` carries a specific position worth stating, because the packs are the part most likely to be copied.

- The underlying **facts** — a threshold, a date, a statutory reference — are not ours and are not copyrightable. Anyone may state them.
- The **selection, wording, dating, conflict handling and verification markers** are original authored work, and are MIT.
- Linking a source does not import that source's content or its terms into this licence. Each linked body retains its own rights, and none of them endorses this work.
- Where a pack quotes a source, it does so briefly and with attribution, in original surrounding words. Substantial source text is not copied.

MIT means a pack can be copied. What cannot be copied is the ongoing verification — see [BACKLOG.md](BACKLOG.md) section 10.

## Excluded or separately governed material

| Material | Scope and treatment |
|---|---|
| `modules/domain-index.json` | Contains plan-derived domain names and coverage. On 2026-10-30 the user expressly authorized including this derived index in davidvuy/startkompas-alpha. Redistribution as part of this alpha is permitted; this is not a blanket MIT grant over the original plan or other imported material. |
| `.agents/skills/startkompas/**` | **Removed on 2026-11-10** (see [DECISIONS.md](DECISIONS.md) entry 1). It carried the only Apache-2.0 scaffold material in this repository, along with its own `NOTICE` and `LICENSE-APACHE-2.0`. With it gone, no Apache-2.0 obligation remains in the working tree. Git history retains the files and their notices. |
| Any attributed third-party material elsewhere | Its original licence and notices prevail. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). New copying requires a path/revision/notice entry before distribution. |
| `assets/startkompas-logo.png`, `assets/startkompas-header.png` | User-supplied original logo retained unchanged; horizontal dark header derived using the built-in image tool at the user's request on 2026-10-30. Permission to display and distribute with this project does not imply a separate MIT grant over the logo or trademark rights. |
| `assets/fonts/**` | Bundled for the legacy runtime's PDF export only. Governed by `assets/fonts/OFL.txt`, not by the root MIT licence. |
| Remaining project-authored files | MIT for original contributions. External links do not import the linked work into this licence. |

### Historical exclusions that no longer have a target

A previous version of this file also excluded `docs/sources/**`, `docs/plan.md`, `docs/requirements.json`, `docs/requirements.md` and `evidence/**` — user-supplied plan material, derived acceptance criteria and preserved research evidence.

**None of those paths exists in this repository.** They belong to a separate private development tree. The exclusions are recorded here so that the boundary stays documented if that material is ever moved in: it would remain outside the root MIT grant, and possession would still not imply permission to publish it.

## Notice obligations

Preserve copyright and permission notices for MIT components. Preserve BSD-3-Clause copyright, conditions, disclaimer and the no-endorsement restriction. If Apache-2.0 code is copied in, retain its licence and notices and mark modifications as required; using a tool is not by itself a decision to relicense its templates or its output.

`package.json` remains `private` and points to the licence together with these scope rules. It is not a public package registration and not a publication authorization.

This file documents scope. It is not a legal opinion, and no lawyer has reviewed it.
