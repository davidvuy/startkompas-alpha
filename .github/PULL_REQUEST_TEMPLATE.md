<!--
Delete the half that does not apply. Both halves of this repository have
different rules; CONTRIBUTING.md explains why.
-->

## What this changes, and why

<!-- One or two sentences. The why matters more than the what — the diff
     already shows the what. -->

## Which half

- [ ] `skill/` — the skill
- [ ] the legacy runtime (`src/`, `ui/`, `tests/`) — **frozen**: security, dependency and compatibility fixes only, see [DECISIONS.md](../DECISIONS.md) entry 1
- [ ] repository-level (docs, CI, licensing)

---

## If this touches `skill/`

```sh
cd skill && node scripts/check-all.mjs
```

- [ ] All six checks pass
- [ ] If a **jurisdiction pack** changed: every new or edited claim carries its source URL, the source's own date where stated, my check date and a recheck trigger
- [ ] If a pack changed: I stated what I did **not** check as `[not researched]` rather than leaving a gap
- [ ] If a pack changed: I did not state a threshold, rate, fee or deadline I had not read in a source I actually fetched
- [ ] If `check-facts.mjs` failed, I decided *which* was wrong — the pack or the eval case — and fixed that one. I did **not** relax the assertion to make the build green
- [ ] If `SKILL.md` changed: the eval cases need re-scoring, and I have said so below

## If this touches the legacy runtime

```sh
npm ci --ignore-scripts --no-audit --no-fund && npm test
node scripts/check-public-package.mjs
```

- [ ] 565 tests pass
- [ ] This is a security, dependency or compatibility fix — not a new feature
- [ ] If a manifest-listed file changed: I ran `node scripts/refresh-public-manifest.mjs --check`, reviewed the diff, then `--write`
- [ ] I did not add a new file to the manifest allowlist without the maintainer's packaging review

---

## Evidence

<!-- Paste the actual output, not a claim that it passed. For a pack change,
     link the sources you read. For an eval re-score, link the results.md row. -->

## What I did not do

<!-- Open questions, things left unverified, scope you deliberately left out.
     This section is as valuable as the diff. -->

- [ ] No credentials, customer data or private dossiers anywhere in this change
- [ ] I ran `sh scripts/scan-staged.sh` (or CI's secret scan covers it)
