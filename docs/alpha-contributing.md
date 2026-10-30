# Contributing and forks

Start with a small fictional reproduction or a concrete user problem in [Issues](https://github.com/davidvuy/startkompas-alpha/issues/new/choose). Dutch and English are welcome. No credentials, private dossiers or full chat logs.

Fork the repository, create a focused branch and keep your changes reviewable. Install with `npm ci --ignore-scripts --no-audit --no-fund`, then run `npm test`. No AI account is required for helper tests. Read LICENSE and LICENSING.md; code permissions do not automatically cover branding or imported material.

## Good first contributions

- Reproduce an installation problem with exact platform/version details and fictional inputs.
- Improve one confusing Dutch or English command example and run it.
- Add a focused regression for a reported bug, demonstrating failure before the fix.
- Improve accessibility of terminal output without losing status or uncertainty warnings.

These are contribution ideas, not reports of known defects. Discuss large schema changes first. Preserve project identity, explicit save confirmation, revision guards, history and the difference between claims and evidence.

## Public package integrity

The public repository is a selected product package. Do not add private development evidence. Dependencies and workflows need human review; no automatic merging is enabled.

After reviewing edits to already listed files, run `node scripts/refresh-public-manifest.mjs --check`. To refresh hashes deliberately, use `--write`, then `node scripts/check-public-package.mjs` and `npm test`. This never adds new files to the allowlist. New files require the maintainer's reviewed packaging process. A new manifest digest proves consistency only, not who approved it. source_revision identifies the package's original private build; it is not the hash of subsequent community edits.

## Local secret check

Install Gitleaks from its official repository, then run `sh scripts/scan-staged.sh` before committing. This requires a shell such as Git Bash on Windows. The script is opt-in and does not change your Git hooks. CI also scans public history. Redaction reduces log exposure; it is not a security guarantee.

Reviewers should explain requested changes and preserve attribution. Feature proposals and pull requests are not automatically accepted. No support response deadline is promised.
