// Pins GitHub Actions in a workflow file to immutable commit SHAs.
// Usage: node scripts/pin-actions.cjs [.github/workflows/test-build.yml]
//
// Strategy:
// - For selected official actions, fetch the latest tag for the desired major (vN)
// - Resolve its dereferenced commit SHA via `git ls-remote --tags`
// - Replace @vN tags in the workflow with @<40-hex-sha>
//
// Actions pinned:
//   - actions/checkout       v5 -> SHA
//   - actions/setup-node     v4 -> SHA
//   - actions/setup-python   v5 -> SHA
//
// Requires: git (for ls-remote)

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TARGET_FILE = process.argv[2] || path.join(process.cwd(), '.github', 'workflows', 'test-build.yml');

// Actions to pin: repo and desired major
const ACTIONS = [
  { repo: 'actions/checkout', major: 5 },
  { repo: 'actions/setup-node', major: 4 },
  { repo: 'actions/setup-python', major: 5 },
];

// Fetch the latest tag and its commit SHA for a given repo+major
function getLatestShaForMajor(repo, major) {
  let output;
  try {
    output = execSync(`git ls-remote --tags https://github.com/${repo}.git`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    console.error(`[pin-actions] Failed to fetch tags for ${repo}: ${e.message}`);
    return null;
  }

  const lines = output.trim().split('\n').filter(Boolean);
  const tagInfo = {}; // version -> { tagSha, commitSha }

  for (const line of lines) {
    const [sha, ref] = line.split('\t');
    const m = /^refs\/tags\/v(\d+\.\d+\.\d+)(\^\{\})?$/.exec(ref);
    if (!m) continue;
    const version = m[1];
    const isDerefed = !!m[2];
    const verMajor = parseInt(version.split('.')[0], 10);
    if (verMajor !== major) continue;

    if (!tagInfo[version]) tagInfo[version] = { tagSha: null, commitSha: null };
    if (isDerefed) tagInfo[version].commitSha = sha;
    else tagInfo[version].tagSha = sha;
  }

  const versions = Object.keys(tagInfo).sort((a, b) => {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    if (pa[0] !== pb[0]) return pa[0] - pb[0];
    if (pa[1] !== pb[1]) return pa[1] - pb[1];
    return pa[2] - pb[2];
  });

  if (versions.length === 0) {
    console.warn(`[pin-actions] No tags found for ${repo} major v${major}`);
    return null;
  }

  const latest = versions[versions.length - 1];
  const rec = tagInfo[latest];
  const sha = rec.commitSha || rec.tagSha;
  if (!sha) {
    console.warn(`[pin-actions] No commit SHA resolved for ${repo}@v${latest}`);
    return null;
  }
  return { version: `v${latest}`, sha };
}

function pinWorkflowFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`[pin-actions] Workflow file not found: ${filePath}`);
    process.exit(1);
  }

  let yaml = fs.readFileSync(filePath, 'utf8');

  for (const { repo, major } of ACTIONS) {
    const info = getLatestShaForMajor(repo, major);
    if (!info) continue;

    // Replace any usage of this action at @v{major} with @<sha>
    // Pattern: uses: actions/<name>@v<major> (case-insensitive)
    const re = new RegExp(`(uses:\\s*${repo.replace('/', '\\/')}@)v${major}\\b`, 'ig');
    if (re.test(yaml)) {
      yaml = yaml.replace(re, `$1${info.sha}`);
      console.log(`[pin-actions] Pinned ${repo}@v${major} -> ${info.sha} (${info.version})`);
    } else {
      // If already pinned to a SHA or another version, skip silently.
      console.log(`[pin-actions] No ${repo}@v${major} tag found in workflow (possibly already pinned).`);
    }
  }

  fs.writeFileSync(filePath, yaml, 'utf8');
  console.log(`[pin-actions] Updated: ${filePath}`);
}

pinWorkflowFile(TARGET_FILE);
