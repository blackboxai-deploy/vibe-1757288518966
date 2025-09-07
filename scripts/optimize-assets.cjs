const fs = require('fs/promises');
const path = require('path');

async function createDistDirectory() {
  const distPath = path.join(__dirname, '..', 'dist');
  await fs.rm(distPath, { recursive: true, force: true });
  await fs.mkdir(distPath, { recursive: true });
  return distPath;
}

async function copyFile(src, dest) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function optimizeAssets() {
  console.log('🚀 Starting asset optimization...');
  
  const rootDir = path.join(__dirname, '..');
  const distDir = await createDistDirectory();
  
  // Files to copy directly
  const staticFiles = [
    'index.html',
    'about.html',
    'music.html',
    'video.html',
    'gallery.html',
    'bookings.html',
    'contact.html',
    'files.html',
    'login.html',
    'playlist.html',
    'profile.html',
    'forum.html',
    'test.html',
    '404.html',
    'dashboard.html',
    'admin.html',
    'live.html',
    'privacy.html',
    'terms.html',
    'disclaimer.html',
    'copyright.html',
    'offline.html',
    'pwa-test.html',
    'robots.txt',
    'sitemap.xml',
    'CNAME',
    'favicon.ico',
    'manifest.json',
    'service-worker.js'
  ];
  
  // Copy static files
  console.log('📄 Copying static files...');
  let copiedFiles = 0;
  for (const file of staticFiles) {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(distDir, file);
    
    try {
      await copyFile(srcPath, destPath);
      console.log(`✅ Copied: ${file}`);
      copiedFiles++;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn(`⚠️  Warning: Could not copy ${file}:`, error.message);
      }
    }
  }
  
  // Copy directories
  const directories = ['assets', 'data'];
  console.log('📁 Copying directories...');
  
  for (const dir of directories) {
    const srcPath = path.join(rootDir, dir);
    const destPath = path.join(distDir, dir);
    
    try {
      await copyDirectory(srcPath, destPath);
      console.log(`✅ Copied directory: ${dir}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn(`⚠️  Warning: Could not copy directory ${dir}:`, error.message);
      }
    }
  }
  
  console.log('✨ Asset optimization complete!');
  console.log(`📦 Build output: ${distDir}`);
  console.log(`📄 Static files copied: ${copiedFiles}`);
}

// Run if called directly
if (require.main === module) {
  optimizeAssets().catch(console.error);
}

module.exports = { optimizeAssets };
