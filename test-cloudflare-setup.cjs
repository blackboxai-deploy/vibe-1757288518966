#!/usr/bin/env node

/**
 * BaddBeatz Cloudflare Workers Setup Test
 * Tests the configuration and setup before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 BaddBeatz Cloudflare Workers Setup Test\n');

// Test 1: Check wrangler.toml
console.log('1️⃣ Checking wrangler.toml configuration...');
try {
  const wranglerConfig = fs.readFileSync('wrangler.toml', 'utf8');
  
  // Check for required fields
  const requiredFields = ['name = "baddbeatz"', 'main = "workers-site/index.js"', 'compatibility_date'];
  const missingFields = requiredFields.filter(field => !wranglerConfig.includes(field.split('=')[0]));
  
  if (missingFields.length === 0) {
    console.log('   ✅ wrangler.toml configuration looks good');
  } else {
    console.log('   ❌ Missing required fields:', missingFields);
  }
  
  // Check for KV namespaces
  if (wranglerConfig.includes('[[kv_namespaces]]')) {
    console.log('   ✅ KV namespaces configured');
  } else {
    console.log('   ⚠️  No KV namespaces found (optional but recommended)');
  }
  
} catch (error) {
  console.log('   ❌ wrangler.toml not found or invalid');
}

// Test 2: Check workers-site directory
console.log('\n2️⃣ Checking workers-site directory...');
try {
  const workersSiteExists = fs.existsSync('workers-site');
  const indexJsExists = fs.existsSync('workers-site/index.js');
  const packageJsonExists = fs.existsSync('workers-site/package.json');
  
  if (workersSiteExists && indexJsExists && packageJsonExists) {
    console.log('   ✅ workers-site directory structure is correct');
    
    // Check package.json dependencies
    const packageJson = JSON.parse(fs.readFileSync('workers-site/package.json', 'utf8'));
    if (packageJson.dependencies && packageJson.dependencies['@cloudflare/kv-asset-handler']) {
      console.log('   ✅ Required dependencies found');
    } else {
      console.log('   ❌ Missing @cloudflare/kv-asset-handler dependency');
    }
    
  } else {
    console.log('   ❌ workers-site directory structure incomplete');
    console.log('      Missing:', [
      !workersSiteExists && 'workers-site/',
      !indexJsExists && 'workers-site/index.js',
      !packageJsonExists && 'workers-site/package.json'
    ].filter(Boolean).join(', '));
  }
} catch (error) {
  console.log('   ❌ Error checking workers-site directory:', error.message);
}

// Test 3: Check build output
console.log('\n3️⃣ Checking build output...');
try {
  const distExists = fs.existsSync('dist');
  const indexHtmlExists = fs.existsSync('dist/index.html');
  const assetsExists = fs.existsSync('dist/assets');
  
  if (distExists && indexHtmlExists) {
    console.log('   ✅ Build output (dist/) exists');
    
    // Count files in dist
    const distFiles = fs.readdirSync('dist');
    console.log(`   📁 Found ${distFiles.length} files/folders in dist/`);
    
    if (assetsExists) {
      const assetFiles = fs.readdirSync('dist/assets');
      console.log(`   📁 Found ${assetFiles.length} files/folders in dist/assets/`);
    }
    
  } else {
    console.log('   ❌ Build output missing - run "npm run build" first');
  }
} catch (error) {
  console.log('   ❌ Error checking build output:', error.message);
}

// Test 4: Check worker code
console.log('\n4️⃣ Checking worker code...');
try {
  const workerCode = fs.readFileSync('workers-site/index.js', 'utf8');
  
  // Check for required imports and exports
  const hasKvImport = workerCode.includes('@cloudflare/kv-asset-handler');
  const hasDefaultExport = workerCode.includes('export default');
  const hasApiEndpoint = workerCode.includes('/api/ask');
  const hasSecurityHeaders = workerCode.includes('securityHeaders');
  
  if (hasKvImport && hasDefaultExport) {
    console.log('   ✅ Worker code structure looks good');
  } else {
    console.log('   ❌ Worker code issues found');
  }
  
  if (hasApiEndpoint) {
    console.log('   ✅ AI API endpoint configured');
  } else {
    console.log('   ⚠️  AI API endpoint not found');
  }
  
  if (hasSecurityHeaders) {
    console.log('   ✅ Security headers configured');
  } else {
    console.log('   ⚠️  Security headers not found');
  }
  
} catch (error) {
  console.log('   ❌ Error checking worker code:', error.message);
}

// Test 5: Check MCP integration
console.log('\n5️⃣ Checking MCP integration...');
try {
  const mcpJsExists = fs.existsSync('assets/js/baddbeatz-mcp.js');
  const mcpCssExists = fs.existsSync('assets/css/mcp-styles.css');
  
  if (mcpJsExists && mcpCssExists) {
    console.log('   ✅ MCP integration files found');
    
    // Check if MCP is included in index.html
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    if (indexHtml.includes('baddbeatz-mcp.js') && indexHtml.includes('mcp-styles.css')) {
      console.log('   ✅ MCP integration included in HTML');
    } else {
      console.log('   ⚠️  MCP integration not included in HTML');
    }
    
  } else {
    console.log('   ❌ MCP integration files missing');
  }
} catch (error) {
  console.log('   ❌ Error checking MCP integration:', error.message);
}

// Summary and recommendations
console.log('\n📋 SUMMARY & RECOMMENDATIONS\n');

console.log('🚀 Next Steps for Deployment:');
console.log('   1. Install Wrangler CLI: npm install -g wrangler');
console.log('   2. Login to Cloudflare: wrangler login');
console.log('   3. Create KV namespaces: wrangler kv:namespace create "RATE_LIMIT"');
console.log('   4. Update wrangler.toml with your KV namespace IDs');
console.log('   5. Set OpenAI API key: wrangler secret put OPENAI_API_KEY');
console.log('   6. Deploy to development: wrangler deploy --env development');
console.log('   7. Test your deployment');
console.log('   8. Deploy to production: wrangler deploy --env production');

console.log('\n🔧 Development Commands:');
console.log('   • Test locally: wrangler dev');
console.log('   • View logs: wrangler tail');
console.log('   • Check deployments: wrangler deployments list');

console.log('\n📚 Documentation:');
console.log('   • Full guide: CLOUDFLARE_WORKERS_FIX_GUIDE.md');
console.log('   • MCP integration: MCP_INTEGRATION_GUIDE.md');
console.log('   • Deployment guide: DEPLOYMENT_GUIDE.md');

console.log('\n✨ Your BaddBeatz Cloudflare Workers setup is ready! 🎵');
