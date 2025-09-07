const fs = require('fs');
const path = require('path');

// Files to fix innerHTML usage
const filesToFix = [
  'assets/js/youtube.js',
  'assets/js/ui-utils.js',
  'assets/js/security-utils.js',
  'assets/js/pwa-init.js',
  'assets/js/live-stream-manager.js',
  'assets/js/intro-video.js',
  'assets/js/enhanced-animations.js',
  'assets/js/ai-chat-improved.js',
  'assets/js/admin.js'
];

let totalFixed = 0;

// Function to fix innerHTML usage in a file
function fixInnerHTMLInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fixedCount = 0;
    
    // Pattern to match innerHTML assignments
    const innerHTMLPattern = /(\w+)\.innerHTML\s*=\s*([^;]+);/g;
    
    // Replace innerHTML with DOMPurify.sanitize
    content = content.replace(innerHTMLPattern, (match, element, value) => {
      // Skip if already using DOMPurify
      if (value.includes('DOMPurify.sanitize')) {
        return match;
      }
      
      // Skip security-utils.js as it's our security utility file
      if (filePath.includes('security-utils.js')) {
        return match;
      }
      
      fixedCount++;
      
      // If it's a simple string literal, use textContent
      if (value.match(/^['"`].*['"`]$/) && !value.includes('<')) {
        return `${element}.textContent = ${value};`;
      }
      
      // Otherwise, use DOMPurify.sanitize
      return `${element}.innerHTML = DOMPurify.sanitize(${value});`;
    });
    
    // Add DOMPurify import if innerHTML was fixed and not already imported
    if (fixedCount > 0 && !content.includes('DOMPurify')) {
      // Add import at the top of the file
      if (content.includes('import ')) {
        // ES6 module
        content = `import DOMPurify from 'dompurify';\n` + content;
      } else {
        // Add comment about DOMPurify requirement
        content = `// SECURITY: DOMPurify is required for sanitization\n// const DOMPurify = window.DOMPurify || require('dompurify');\n\n` + content;
      }
    }
    
    // Write the fixed content back
    fs.writeFileSync(filePath, content, 'utf8');
    
    if (fixedCount > 0) {
      console.log(`✓ Fixed ${fixedCount} innerHTML usage(s) in ${filePath}`);
      totalFixed += fixedCount;
    } else {
      console.log(`✓ No innerHTML issues found in ${filePath}`);
    }
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`⚠ File not found: ${filePath}`);
    } else {
      console.error(`✗ Error processing ${filePath}:`, error.message);
    }
  }
}

console.log('Starting innerHTML security fixes...\n');

// Process each file
filesToFix.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  fixInnerHTMLInFile(fullPath);
});

console.log(`\n✅ Total innerHTML usages fixed: ${totalFixed}`);
console.log('\nNext steps:');
console.log('1. Ensure DOMPurify is loaded in your HTML files');
console.log('2. Test all affected functionality');
console.log('3. Run security tests to verify fixes');
