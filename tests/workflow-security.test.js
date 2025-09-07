// ESM Jest test validating workflow security posture and action pinning
// Requires NODE_OPTIONS=--experimental-vm-modules (already set in package.json scripts)
import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');

describe('GitHub Actions workflow security and hardening', () => {
  let testBuild, deploy;
  beforeAll(() => {
    testBuild = read('.github/workflows/test-build.yml');
    deploy = read('.github/workflows/deploy.yml');
  });

  test('minimal permissions are set (contents: read)', () => {
    const permRe = /permissions:\s*\n\s*contents:\s*read\b/m;
    expect(testBuild).toMatch(permRe);
    expect(deploy).toMatch(permRe);
  });

  test('concurrency group and cancel-in-progress present', () => {
    // Accept either group and cancel-in-progress or at least a group reference pattern
    const groupRe = /concurrency:\s*\n\s*group:\s*\$\{\{\s*github\.workflow\s*\}\}-\$\{\{\s*github\.ref\s*\}\}/m;
    const cancelRe = /cancel-in-progress:\s*true/m;
    expect(testBuild).toMatch(groupRe);
    expect(testBuild).toMatch(cancelRe);
    expect(deploy).toMatch(groupRe);
    expect(deploy).toMatch(cancelRe);
  });

  test('official actions are pinned to immutable SHAs', () => {
    // checkout pinned
    expect(testBuild).toMatch(/uses:\s*actions\/checkout@[0-9a-f]{40}\b/);
    expect(deploy).toMatch(/uses:\s*actions\/checkout@[0-9a-f]{40}\b/);

    // setup-node pinned
    expect(testBuild).toMatch(/uses:\s*actions\/setup-node@[0-9a-f]{40}\b/);
    expect(deploy).toMatch(/uses:\s*actions\/setup-node@[0-9a-f]{40}\b/);

    // setup-python pinned (present in test-build only)
    expect(testBuild).toMatch(/uses:\s*actions\/setup-python@[0-9a-f]{40}\b/);
  });

  test('npm scripts are gated with jq existence checks', () => {
    // Ensure the build job uses jq -e guards for lint/test
    expect(testBuild).toMatch(/jq -e/);
    expect(testBuild).toMatch(/npm run lint|npm test --if-present/);
  });
});
