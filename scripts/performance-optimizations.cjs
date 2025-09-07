/**
 * Performance Optimization Script for BaddBeatz
 * Implements recommendations from the project improvement report
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

// Configuration
const config = {
  jsFiles: [
    'assets/js/main.js',
    'assets/js/ui-utils.js',
    'assets/js/auth-service.js',
    'assets/js/login.js',
    'assets/js/dashboard.js',
    'assets/js/admin.js',
    'assets/js/live-stream-manager.js'
  ],
  cssFiles: [
    'assets/css/style.css',
    'assets/css/cyberpunk.css',
    'assets/css/responsive.css',
    'assets/css/login.css',
    'assets/css/dashboard.css',
    'assets/css/admin.css',
    'assets/css/legal.css',
    'assets/css/live-stream.css'
  ],
  outputDir: 'dist'
};

// Create output directories
function createOutputDirs() {
  const dirs = ['dist', 'dist/js', 'dist/css'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Minify JavaScript files
async function minifyJavaScript() {
  console.log('🔧 Minifying JavaScript files...');
  
  for (const file of config.jsFiles) {
    try {
      const filePath = path.join(process.cwd(), file);
      const code = fs.readFileSync(filePath, 'utf8');
      
      const result = await minify(code, {
        compress: {
          drop_console: false, // Keep console logs for debugging
          drop_debugger: true,
          passes: 2
        },
        mangle: {
          toplevel: true
        },
        format: {
          comments: false
        }
      });
      
      const outputPath = path.join('dist', file);
      const outputDir = path.dirname(outputPath);
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, result.code);
      
      const originalSize = Buffer.byteLength(code, 'utf8');
      const minifiedSize = Buffer.byteLength(result.code, 'utf8');
      const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
      
      console.log(`✅ ${file}: ${originalSize} → ${minifiedSize} bytes (-${reduction}%)`);
    } catch (error) {
      console.error(`❌ Error minifying ${file}:`, error.message);
    }
  }
}

// Minify CSS files
function minifyCSS() {
  console.log('\n🎨 Minifying CSS files...');
  
  const cleanCSS = new CleanCSS({
    level: 2,
    compatibility: 'ie11'
  });
  
  config.cssFiles.forEach(file => {
    try {
      const filePath = path.join(process.cwd(), file);
      const css = fs.readFileSync(filePath, 'utf8');
      
      const output = cleanCSS.minify(css);
      
      if (output.errors.length > 0) {
        console.error(`❌ Errors in ${file}:`, output.errors);
        return;
      }
      
      const outputPath = path.join('dist', file);
      const outputDir = path.dirname(outputPath);
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, output.styles);
      
      const originalSize = Buffer.byteLength(css, 'utf8');
      const minifiedSize = Buffer.byteLength(output.styles, 'utf8');
      const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
      
      console.log(`✅ ${file}: ${originalSize} → ${minifiedSize} bytes (-${reduction}%)`);
    } catch (error) {
      console.error(`❌ Error minifying ${file}:`, error.message);
    }
  });
}

// Create bundle configuration
function createBundleConfig() {
  console.log('\n📦 Creating bundle configuration...');
  
  const bundleConfig = {
    entry: {
      main: ['assets/js/main.js', 'assets/js/ui-utils.js'],
      auth: ['assets/js/auth-service.js'],
      login: ['assets/js/login.js'],
      dashboard: ['assets/js/dashboard.js'],
      admin: ['assets/js/admin.js'],
      liveStream: ['assets/js/live-stream-manager.js']
    },
    css: {
      main: ['assets/css/style.css', 'assets/css/cyberpunk.css', 'assets/css/responsive.css'],
      login: ['assets/css/login.css'],
      dashboard: ['assets/css/dashboard.css'],
      admin: ['assets/css/admin.css'],
      legal: ['assets/css/legal.css'],
      liveStream: ['assets/css/live-stream.css']
    }
  };
  
  fs.writeFileSync('bundle.config.json', JSON.stringify(bundleConfig, null, 2));
  console.log('✅ Bundle configuration created');
}

// Create lazy loading script
function createLazyLoadingScript() {
  console.log('\n🚀 Creating lazy loading script...');
  
  const lazyLoadScript = `
/**
 * Lazy Loading Implementation for BaddBeatz
 */

// Lazy load images
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
});

// Lazy load YouTube iframes
function lazyLoadYouTube() {
  const videos = document.querySelectorAll('.youtube-lazy');
  
  const videoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const iframe = document.createElement('iframe');
        iframe.src = video.dataset.src;
        iframe.width = video.dataset.width || '560';
        iframe.height = video.dataset.height || '315';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        
        video.parentNode.replaceChild(iframe, video);
        observer.unobserve(video);
      }
    });
  });
  
  videos.forEach(video => videoObserver.observe(video));
}

// Dynamic import for code splitting
async function loadModule(moduleName) {
  try {
    const module = await import(\`./modules/\${moduleName}.js\`);
    return module.default;
  } catch (error) {
    console.error(\`Failed to load module \${moduleName}:\`, error);
  }
}

// Export functions
window.lazyLoadYouTube = lazyLoadYouTube;
window.loadModule = loadModule;
`;
  
  fs.writeFileSync('assets/js/lazy-loading.js', lazyLoadScript);
  console.log('✅ Lazy loading script created');
}

// Create resource hints
function createResourceHints() {
  console.log('\n🔗 Creating resource hints...');
  
  const resourceHints = `
<!-- Resource Hints for Performance -->
<!-- DNS Prefetch for external domains -->
<link rel="dns-prefetch" href="//www.youtube.com">
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//cdnjs.cloudflare.com">

<!-- Preconnect for critical resources -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload critical resources -->
<link rel="preload" href="/assets/css/style.css" as="style">
<link rel="preload" href="/assets/js/main.js" as="script">
<link rel="preload" href="/assets/images/Logo.png" as="image">

<!-- Prefetch for likely next pages -->
<link rel="prefetch" href="/dashboard.html">
<link rel="prefetch" href="/music.html">
`;
  
  fs.writeFileSync('resource-hints.html', resourceHints);
  console.log('✅ Resource hints template created');
}

// Main execution
async function main() {
  console.log('🚀 Starting Performance Optimization Process...\n');
  
  createOutputDirs();
  await minifyJavaScript();
  minifyCSS();
  createBundleConfig();
  createLazyLoadingScript();
  createResourceHints();
  
  console.log('\n✨ Performance optimization complete!');
  console.log('\nNext steps:');
  console.log('1. Update HTML files to use minified assets from /dist');
  console.log('2. Add resource hints to HTML <head> sections');
  console.log('3. Implement lazy loading for images and videos');
  console.log('4. Consider using a bundler like Webpack or Rollup for production');
}

// Check if required modules are installed
function checkDependencies() {
  try {
    require('terser');
    require('clean-css');
    return true;
  } catch (error) {
    console.error('❌ Missing dependencies. Please run:');
    console.error('npm install terser clean-css');
    return false;
  }
}

// Run the script
if (checkDependencies()) {
  main().catch(console.error);
}
