# Implementation Plan

[Overview]
Stabilize and harden GitHub Actions for this repository so that security tests pass consistently and Cloudflare Pages deploys succeed on every push to main using Direct Upload via Wrangler.

This implementation targets the root causes behind recurring workflow failures: missing CLI tools on the runner PATH (wrangler), insufficient pinning/hardening, and potential conflicts between Cloudflare Workers routes and Cloudflare Pages custom domains. The approach enforces minimal permissions, race-safe concurrency, strict action pinning, jq-guarded script execution, and reliable Pages deployment through npx wrangler. It also codifies validation and testing strategy so failures are caught earlier and with clearer diagnostics.

[Types]  
No application type system changes are required; this concerns CI YAML and deployment configuration only.

[Files]
We will modify and validate GitHub workflows and Cloudflare config to ensure consistent, secure CI/CD.

- Existing files to be modified:
  - .github/workflows/deploy.yml
    - Ensure minimal permissions (contents: read).
    - Ensure concurrency group ${{ github.workflow }}-${{ github.ref }} with cancel-in-progress: true.
    - Ensure actions pinned to immutable SHAs (checkout, setup-node).
    - Ensure build runs, discovers output dir (prefer docs), and deploys via npx -y wrangler@^4 pages deploy.
    - Gate deploy to the latest commit on main.
  - .github/workflows/test-build.yml
    - Same hardening as above (permissions, concurrency, pins).
    - Ensure jq -e guards present before running npm steps.
    - Ensure Build step completes.
    - Gate deployment to latest commit on main.
    - IMPORTANT: Replace raw wrangler invocation with npx -y wrangler@^4 pages deploy (eliminates PATH issues).
  - wrangler.toml
    - Keep pages_build_output_dir="docs".
    - Ensure no conflicting [env.production].routes with custom domains already handled by Cloudflare Pages.
    - Retain Workers/KV config for potential separate API worker, but do not route apex/www via Worker.

- Existing files to validate (no changes expected if already correct):
  - .github/workflows/workflow-lint.yml (lint sanity)
  - .github/workflows/workflow-lint-security.yml (security lint sanity)
  - .github/workflows/ci-node.yml and .github/workflows/ci-python.yml (if present, ensure they do not conflict with main CI or deploy jobs)
  - CNAME (baddbeatz.nl)

- New files to be created:
  - None (this plan file only).

- Files to be deleted or moved:
  - None at this time.

- Configuration updates:
  - GitHub repository secrets must include CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID (required for wrangler pages deploy).
  - Cloudflare environment must include OPENAI_API_KEY if /api/ask is exercised during tests.

[Functions]
No application code functions require changes for CI stabilization. CI steps (YAML) will be adjusted as described.

[Classes]
Not applicable.

[Dependencies]
- Runners/tools used by workflows:
  - jq installed via apt-get in CI (already present in CI).
  - wrangler invoked via npx -y wrangler@^4 to eliminate PATH issues and version drift.
  - Node 20.x via actions/setup-node (pinned SHA).
  - Python via actions/setup-python (pinned SHA) for tests that require it.

[Testing]
We will conduct CI-level and deployment-level validations:
- Automated (CI/Jest):
  - tests/workflow-security.test.js validates minimal permissions, concurrency, action SHAs, jq guards.
- Deploy pipeline:
  - Direct Upload via npx wrangler pages deploy to Cloudflare Pages project "baddbeatz".
  - Latest-commit gating to avoid redeploying old commits on main.
- Critical-path manual validation (post-deploy):
  - Confirm Pages deploy succeeded for latest main.
  - Homepage smoke test: asset loads + browser console/CSP sanity check.
  - API smoke: exercise /api/ask happy path if API URL and OPENAI_API_KEY are available.
- Optional thorough testing:
  - Navigate all major pages (index/about/music/video/gallery/bookings/contact/files/login/playlist/profile/dashboard/admin/live/privacy/terms/disclaimer/copyright/offline).
  - API negative/edge scenarios (invalid payloads, rate limiting).

[Implementation Order]
Perform changes in the following sequence to minimize risk:
1. Confirm wrangler.toml uses pages_build_output_dir="docs" and has no conflicting Worker routes for apex/www domains.
2. Ensure .github/workflows/deploy.yml:
   - Has minimal permissions and concurrency hardening.
   - Pins checkout and setup-node to immutable SHAs.
   - Builds, discovers output dir, and deploys with npx -y wrangler@^4 pages deploy.
   - Uses latest-commit gating.
3. Ensure .github/workflows/test-build.yml:
   - Has minimal permissions and concurrency hardening.
   - Pins checkout, setup-node, setup-python to immutable SHAs.
   - Installs jq and guards npm with jq -e checks.
   - Builds; deploy step gated to latest main commit.
   - IMPORTANT: Replace any raw “wrangler pages deploy …” with npx -y wrangler@^4 pages deploy.
4. Push changes on a short-lived branch; open and merge a PR with a clear body (CI changes and reasoning).
5. Trigger Deploy workflow on main.
6. Execute critical-path validation:
   - Confirm Deploy run is green (GitHub Actions + Cloudflare Pages build details).
   - Perform homepage smoke testing against the provided site URL.
   - If provided, test /api/ask endpoint happy path and confirm OK responses (and rate limits).
7. If issues are found, iterate:
   - Fix deployment step or environment secrets.
   - Re-run workflows, then repeat smoke/critical-path testing.
8. Optional: conduct thorough testing across all pages and API edge cases.
