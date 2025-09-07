/**
 * CSS Optimization Script
 * Combines and minifies multiple CSS files into a single optimized file
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// CSS files to combine (in order of importance)
const cssFiles = [
  'assets/css/style.css',
  'assets/css/cyberpunk.css',
  'assets/css/enhanced-cyberpunk.css',
  'assets/css/ui-enhancements.css',
  'assets/css/animation-styles.css',
  'assets/css/responsive.css',
  'assets/css/video-enhancements.css',
  'assets/css/mobile-fixes.css',
  'assets/css/embed.css'
];

// Page-specific CSS files
const pageSpecificCSS = {
  'live.html': ['assets/css/live-stream.css'],
  'login.html': ['assets/css/login.css'],
  'dashboard.html': ['assets/css/dashboard.css'],
  'admin.html': ['assets/css/admin.css'],
  'legal-pages': ['assets/css/legal.css'] // For privacy, terms, disclaimer, copyright
};

/**
 * Minify CSS content
 * @param {string} css - CSS content to minify
 * @returns {string} Minified CSS
 */
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove unnecessary whitespace
    .replace(/\s+/g, ' ')
    // Remove whitespace around selectors
    .replace(/\s*([{}:;,])\s*/g, '$1')
    // Remove trailing semicolons before closing braces
    .replace(/;}/g, '}')
    // Remove empty rules
    .replace(/[^{}]+\{\s*\}/g, '')
    // Trim
    .trim();
}

/**
 * Extract critical CSS for above-the-fold content
 * @param {string} css - Full CSS content
 * @returns {string} Critical CSS
 */
function extractCriticalCSS(css) {
  const criticalSelectors = [
    // Navigation
    'nav', '.nav', '.nav__',
    // Hero section
    '.hero', '.hero__', '.overlay',
    // Base typography
    'body', 'h1', 'h2', 'h3', 'p',
    // Critical animations
    '@keyframes pulse', '@keyframes fadeIn',
    // Base layout
    '.container', 'header', 'main'
  ];
  
  const criticalRules = [];
  const cssRules = css.match(/[^{}]+\{[^{}]+\}/g) || [];
  
  cssRules.forEach(rule => {
    const selector = rule.split('{')[0].trim();
    if (criticalSelectors.some(critical => 
      selector.includes(critical) || 
      rule.includes('@keyframes') && rule.includes(critical.replace('@keyframes ', ''))
    )) {
      criticalRules.push(rule);
    }
  });
  
  return criticalRules.join('');
}

/**
 * Generate content hash for cache busting
 * @param {string} content - File content
 * @returns {string} Hash
 */
function generateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
}

/**
 * Update HTML files to use optimized CSS
 * @param {string} htmlFile - Path to HTML file
 * @param {string} optimizedCSSPath - Path to optimized CSS file
 * @param {string} criticalCSS - Critical CSS to inline
 */
async function updateHTMLFile(htmlFile, optimizedCSSPath, criticalCSS, pageSpecificPath = null) {
  try {
    let html = await fs.readFile(htmlFile, 'utf8');
    
    // Remove old CSS links
    cssFiles.forEach(cssFile => {
      const regex = new RegExp(`<link[^>]*href="${cssFile}"[^>]*>`, 'g');
      html = html.replace(regex, '');
    });
    
    // Remove page-specific CSS if updating
    if (pageSpecificPath) {
      const regex = new RegExp(`<link[^>]*href="${pageSpecificPath}"[^>]*>`, 'g');
      html = html.replace(regex, '');
    }
    
    // Add critical CSS inline
    const criticalCSSTag = `<style id="critical-css">${minifyCSS(criticalCSS)}</style>`;
    
    // Add optimized CSS link with preload
    const optimizedCSSLink = `
    <link rel="preload" href="${optimizedCSSPath}" as="style">
    <link rel="stylesheet" href="${optimizedCSSPath}">`;
    
    // Insert before </head>
    html = html.replace('</head>', `${criticalCSSTag}\n${optimizedCSSLink}\n</head>`);
    
    await fs.writeFile(htmlFile, html);
    console.log(`✅ Updated ${htmlFile}`);
  } catch (error) {
    console.error(`❌ Error updating ${htmlFile}:`, error);
  }
}

/**
 * Main optimization function
 */
async function optimizeCSS() {
  console.log('🚀 Starting CSS optimization...\n');
  
  try {
    // Create dist directory if it doesn't exist
    await fs.mkdir('dist/css', { recursive: true });
    
    // Read and combine main CSS files
    console.log('📖 Reading CSS files...');
    const cssContents = await Promise.all(
      cssFiles.map(async file => {
        try {
          const content = await fs.readFile(file, 'utf8');
          console.log(`  ✓ ${file}`);
          return content;
        } catch (error) {
          console.log(`  ✗ ${file} (not found)`);
          return '';
        }
      })
    );
    
    // Combine and minify
    const combinedCSS = cssContents.join('\n');
    const minifiedCSS = minifyCSS(combinedCSS);
    const criticalCSS = extractCriticalCSS(combinedCSS);
    
    // Generate hash for cache busting
    const hash = generateHash(minifiedCSS);
    const outputFilename = `dist/css/main.${hash}.css`;
    
    // Write optimized CSS
    await fs.writeFile(outputFilename, minifiedCSS);
    console.log(`\n✅ Created optimized CSS: ${outputFilename}`);
    console.log(`   Original size: ${combinedCSS.length} bytes`);
    console.log(`   Minified size: ${minifiedCSS.length} bytes`);
    console.log(`   Reduction: ${Math.round((1 - minifiedCSS.length / combinedCSS.length) * 100)}%`);
    
    // Update HTML files
    console.log('\n📝 Updating HTML files...');
    const htmlFiles = await fs.readdir('.', { withFileTypes: true });
    
    for (const file of htmlFiles) {
      if (file.isFile() && file.name.endsWith('.html')) {
        await updateHTMLFile(file.name, outputFilename, criticalCSS);
      }
    }
    
    // Create page-specific optimized CSS
    console.log('\n📄 Creating page-specific optimized CSS...');
    for (const [page, cssFiles] of Object.entries(pageSpecificCSS)) {
      const contents = await Promise.all(
        cssFiles.map(async file => {
          try {
            return await fs.readFile(file, 'utf8');
          } catch {
            return '';
          }
        })
      );
      
      if (contents.some(c => c)) {
        const combined = contents.join('\n');
        const minified = minifyCSS(combined);
        const hash = generateHash(minified);
        const filename = `dist/css/${page.replace('.html', '')}.${hash}.css`;
        
        await fs.writeFile(filename, minified);
        console.log(`  ✓ ${filename}`);
      }
    }
    
    // Create CSS optimization report
    const report = {
      timestamp: new Date().toISOString(),
      originalFiles: cssFiles.length,
      originalSize: combinedCSS.length,
      optimizedSize: minifiedCSS.length,
      reduction: `${Math.round((1 - minifiedCSS.length / combinedCSS.length) * 100)}%`,
      criticalCSSSize: criticalCSS.length,
      outputFile: outputFilename
    };
    
    await fs.writeFile('dist/css/optimization-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n✨ CSS optimization complete!');
    
  } catch (error) {
    console.error('❌ Error during CSS optimization:', error);
    process.exit(1);
  }
}

// Run optimization
optimizeCSS();
