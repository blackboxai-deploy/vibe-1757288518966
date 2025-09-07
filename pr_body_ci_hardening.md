# CI: Harden workflows and fix Cloudflare Pages deploy (project "baddbeatz")

This PR hardens GitHub Actions to improve reliability and satisfy workflow-security tests, and stabilizes Cloudflare Pages deployment.

## Summary of Changes

- Workflows added/updated:
  - .github/workflows/test-build.yml
  - .github/workflows/deploy.yml
- Security posture:
  - permissions: contents: read
  - concurrency with cancel-in-progress
  - Official actions pinned to SHAs:
    - actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8
    - actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020
    - actions/setup-python@a26af69be951a213d495a4c3e4e4022e16d87065 (test-build only)
  - jq -e guards for npm steps
- Deploy stabilization:
  - Fixed Pages project name to "baddbeatz"
  - Latest-commit gating so deploy runs only for the latest commit on main; no-op on older commits
  - Gated build step (npm ci || npm install; npm run build) before output-dir discovery
  - Output directory autodiscovery across: docs, dist, build, out, .output/public, public
- wrangler.toml already aligned:
  - pages_build_output_dir = "docs"
  - name = "baddbeatz"

Reference: CI_CHANGES_SUMMARY.md

## Why This Fixes Failures

- Previously, deploy attempted on non-latest commits and/or with a wrong project name, leading to intermittent failures.
- With latest-commit gating and the correct project name, deploy only runs when appropriate and succeeds once artifacts exist.
- Security posture now matches repository tests (minimal permissions, concurrency, action pinning, jq guards).

## Testing and Verification

Already executed:
- Jest suite (npm test), including workflow-security validations
- Python API smoke test (scripts/api_smoke.py): register, auth user, add track, list tracks
- Manual dispatch of deploy.yml for validation
- Repository secrets set (CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN)

Recommended post-merge checks (Thorough Testing):
- Ensure deploy.yml no-ops on non-latest commits and successfully deploys for the latest commit on main
- Confirm the live Cloudflare Pages site serves correctly
- Run a full frontend smoke (major pages) and validate service worker/offline and CSP
- Verify Cloudflare Worker /api/ask works with OPENAI_API_KEY set (happy path + error paths)
