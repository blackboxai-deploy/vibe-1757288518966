// ESM Jest tests for deployment logic expectations
// Ensures docs-first detection, latest-commit gating, and correct wrangler usage
import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');

describe('Deployment workflow logic', () => {
  let testBuild, deploy;
  beforeAll(() => {
    testBuild = read('.github/workflows/test-build.yml');
    deploy = read('.github/workflows/deploy.yml');
  });

  test('build output detection prioritizes docs first', () => {
    // Expect the detection loop order to start with docs and include common dirs
    const loopRe = /for d in docs dist build out \.output\/public public; do/;
    expect(testBuild).toMatch(loopRe);
  });

  test('wrangler pages deploy command uses computed output dir and project name', () => {
    // test-build.yml
    const wranglerBuildRe =
      /wrangler pages deploy\s+"\$\{\{\s*steps\.build\.outputs\.output_dir\s*\}\}"\s+--project-name\s+baddbeatz\.nl/;
    expect(testBuild).toMatch(wranglerBuildRe);

    // deploy.yml (uses a different step id "outdir")
    const wranglerDeployRe =
      /wrangler pages deploy\s+"\$\{\{\s*steps\.outdir\.outputs\.output_dir\s*\}\}"\s+--project-name\s+baddbeatz\.nl/;
    expect(deploy).toMatch(wranglerDeployRe);
  });

  test('latest-commit gating is present to avoid duplicate deploys', () => {
    // Looks for ls-remote to get latest main SHA and the is_latest gate
    expect(testBuild).toMatch(/git ls-remote origin -h refs\/heads\/main \| cut -f1/);
    expect(deploy).toMatch(/git ls-remote origin -h refs\/heads\/main \| cut -f1/);
    expect(testBuild).toMatch(/if:\s*steps\.latest\.outputs\.is_latest\s*!=\s*'true'/);
    expect(deploy).toMatch(/if:\s*steps\.latest\.outputs\.is_latest\s*!=\s*'true'/);
  });

  test('matrix tests Node 20.18.1 and 22.x, deploy uses Node 20.18.1', () => {
    expect(testBuild).toMatch(/matrix:\s*[\s\S]*node-version:\s*\[\s*'20\.18\.1',\s*'22\.x'\s*\]/m);
    expect(testBuild).toMatch(/node-version:\s*'20\.18\.1'/); // deploy job build step
  });

  test('minimal permissions and concurrency guards present', () => {
    const permRe = /permissions:\s*\n\s*contents:\s*read\b/m;
    const groupRe = /concurrency:\s*\n\s*group:\s*\$\{\{\s*github\.workflow\s*\}\}-\$\{\{\s*github\.ref\s*\}\}/m;
    const cancelRe = /cancel-in-progress:\s*true/m;
    expect(testBuild).toMatch(permRe);
    expect(testBuild).toMatch(groupRe);
    expect(testBuild).toMatch(cancelRe);
    expect(deploy).toMatch(permRe);
    expect(deploy).toMatch(groupRe);
    expect(deploy).toMatch(cancelRe);
  });
});
