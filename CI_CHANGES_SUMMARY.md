Proceed with thorough testing# CI Changes Summary

This change set adds hardened GitHub Actions workflows required by repository tests and enables reliable deployments.

## What Was Added

- .github/workflows/test-build.yml
- .github/workflows/deploy.yml

Key properties:
- Minimal permissions: `permissions: contents: read`
- Concurrency: `group: ${{ github.workflow }}-${{ github.ref }}`, `cancel-in-progress: true`
- Actions pinned to immutable SHAs:
  - actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8
  - actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020
  - actions/setup-python@a26af69be951a213d495a4c3e4e4022e16d87065 (test-build only)
- Node versions:
  - Matrix: ['20.18.1', '22.x'] (test-build)
  - Deploy: '20.18.1'
- Output directory discovery:
  - `for d in docs dist build out .output/public public; do ...`
- Latest-commit gating:
  - `git ls-remote origin -h refs/heads/main | cut -f1`
  - Deploy runs only when `is_latest == 'true'`
- Guarded steps:
  - `jq -e` guards, lint/test gating
- Deployment:
  - `wrangler pages deploy ... --project-name baddbeatz`

## Local Validation

- `npm ci` and `npm test`: Both workflow-focused Jest suites passed (9 tests).
- `docs/` auto-built via scripts/ensure-docs.cjs.

## Post-Merge Expectations

- Push to `main` will run the Deploy workflow and publish via Cloudflare Pages using configured repo secrets:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`

## Smoke Tests After Deploy

- Verify key pages: `/`, `/music`, `/video`, `/bookings`, `/contact`, `/profile`, `/dashboard`, `/admin`
- Confirm service worker registration and `offline.html`
- No console errors; HTTPS/SSL and routing correct on `baddbeatz.nl` and `www.baddbeatz.nl`
