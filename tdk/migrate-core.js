const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const core = path.join(root, 'core');

console.log("Starting Architectural Migration Phase 1: Moving Directories...");

const moves = [
  { src: 'registry', dest: 'core/registry' },
  { src: 'search', dest: 'core/search' },
  { src: 'analytics', dest: 'core/analytics' },
  { src: 'providers', dest: 'core/providers' },
  { src: 'cache', dest: 'core/cache' },
  { src: 'storage', dest: 'core/storage' }
];

moves.forEach(({ src, dest }) => {
  const srcPath = path.join(root, src);
  const destPath = path.join(root, dest);

  if (fs.existsSync(srcPath)) {
    // Note: since dest might exist (we just scaffolded it), we need to move contents or replace.
    // Easiest is to move contents into the scaffolded dest.
    console.log(`Migrating ${src} to ${dest}...`);
    
    const items = fs.readdirSync(srcPath);
    items.forEach(item => {
      const oldPath = path.join(srcPath, item);
      const newPath = path.join(destPath, item);
      fs.renameSync(oldPath, newPath);
    });
    
    // Remove old empty dir
    try {
      fs.rmdirSync(srcPath);
      console.log(`✅ Moved contents of ${src} to ${dest} and deleted old directory.`);
    } catch (e) {
      console.warn(`⚠️ Could not remove ${src}, it might not be empty.`);
    }
  } else {
    console.warn(`⚠️ Source ${src} does not exist. Skipping.`);
  }
});

// Update ToolEngine paths
const toolEnginePath = path.join(root, 'engines', 'tool-engine.js');
if (fs.existsSync(toolEnginePath)) {
  let content = fs.readFileSync(toolEnginePath, 'utf8');
  content = content.replace(/registry\/manifests/g, 'core/registry/manifests');
  fs.writeFileSync(toolEnginePath, content);
  console.log("✅ Updated ToolEngine registry path.");
}

// Update AdminEngine paths
const adminEnginePath = path.join(root, 'engines', 'admin-engine.js');
if (fs.existsSync(adminEnginePath)) {
  let content = fs.readFileSync(adminEnginePath, 'utf8');
  content = content.replace(/registry\/tools\.json/g, 'core/registry/tools.json');
  fs.writeFileSync(adminEnginePath, content);
  console.log("✅ Updated AdminEngine registry path.");
}

// Update QA Validator script paths
const qaPath = path.join(root, 'tdk', 'qa-validate.js');
if (fs.existsSync(qaPath)) {
  let content = fs.readFileSync(qaPath, 'utf8');
  content = content.replace(/\.\.\/registry/g, '../core/registry');
  fs.writeFileSync(qaPath, content);
  console.log("✅ Updated QA script registry path.");
}

console.log("Migration Phase 1 Complete!");
