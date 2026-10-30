#!/bin/sh
set -eu
if ! command -v gitleaks >/dev/null 2>&1; then
  echo 'Install Gitleaks from https://github.com/gitleaks/gitleaks, then retry.' >&2
  exit 1
fi
exec gitleaks git --staged --redact=100 --ignore-gitleaks-allow --no-banner .
