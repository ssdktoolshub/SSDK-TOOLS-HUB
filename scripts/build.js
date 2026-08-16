// SSDK Tools Hub - Production Build & Asset Optimizer
// Compiles platform into a production-ready dist/ folder

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('🚀 Starting SSDK Tools Hub Production Build...');

// 1. Clean dist/
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Recursive copy helper
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 3. Folders to copy into dist/
const foldersToCopy = [
  'assets',
  'components',
  'core',
  'engines',
  'pages',
  'providers',
  'services',
  'templates',
  'tools',
  'admin',
  'configs',
  'modules'
];

foldersToCopy.forEach(folder => {
  const src = path.join(rootDir, folder);
  const dest = path.join(distDir, folder);
  if (fs.existsSync(src)) {
    console.log(`📦 Copying ${folder}/...`);
    copyRecursiveSync(src, dest);
  }
});

// 4. Files to copy to root of dist/
const filesToCopy = [
  'index.html',
  'manifest.json',
  'sw.js',
  'vercel.json',
  'package.json'
];

filesToCopy.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

// 5. Run Sitemap & Robots Generator
console.log('🗺️ Generating sitemap.xml & robots.txt...');
try {
  execSync('node scripts/generate-sitemap.js', { cwd: rootDir, stdio: 'inherit' });
  if (fs.existsSync(path.join(rootDir, 'sitemap.xml'))) {
    fs.copyFileSync(path.join(rootDir, 'sitemap.xml'), path.join(distDir, 'sitemap.xml'));
  }
  if (fs.existsSync(path.join(rootDir, 'robots.txt'))) {
    fs.copyFileSync(path.join(rootDir, 'robots.txt'), path.join(distDir, 'robots.txt'));
  }
} catch (e) {
  console.warn('Sitemap generator failed during build:', e.message);
}

// 6. Run Pre-rendering for SEO
console.log('📄 Pre-rendering static tool pages...');
try {
  execSync('node scripts/prerender.js', { cwd: rootDir, stdio: 'inherit' });
} catch (e) {
  console.warn('Prerender failed during build:', e.message);
}

console.log('✅ SSDK Tools Hub build completed successfully in dist/ !');
