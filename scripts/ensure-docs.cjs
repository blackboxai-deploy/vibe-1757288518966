const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const docsPath = path.join(__dirname, '..', 'docs');
if (!fs.existsSync(docsPath)) {
  console.log('docs/ folder missing, generating with "npm run build-docs"...');
  execSync('npm run build-docs', { stdio: 'inherit' });
}
