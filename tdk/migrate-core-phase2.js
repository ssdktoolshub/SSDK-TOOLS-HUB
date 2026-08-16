const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const core = path.join(root, 'core');

console.log("Starting Architectural Migration Phase 2: Engines to Core...");

const fileMoves = [
  { src: 'engines/config-engine.js', dest: 'core/config/config-engine.js' },
  { src: 'engines/recommendation-engine.js', dest: 'core/discovery/recommendation-engine.js' },
  { src: 'engines/seo-engine.js', dest: 'core/seo/seo-engine.js' },
  { src: 'engines/theme-engine.js', dest: 'core/theme/theme-engine.js' },
  { src: 'engines/i18n-engine.js', dest: 'core/i18n/i18n-engine.js' },
  { src: 'engines/logger-engine.js', dest: 'core/logger/logger-engine.js' },
  { src: 'engines/plugin-engine.js', dest: 'core/plugins/plugin-engine.js' },
  { src: 'engines/plugin-manager.js', dest: 'core/plugins/plugin-manager.js' },
];

fileMoves.forEach(({ src, dest }) => {
  const srcPath = path.join(root, src);
  const destPath = path.join(root, dest);
  if (fs.existsSync(srcPath)) {
    fs.renameSync(srcPath, destPath);
    console.log(`✅ Moved ${src} to ${dest}`);
  }
});

// Update core/core.js
const corePath = path.join(core, 'core.js');
if (fs.existsSync(corePath)) {
  let content = fs.readFileSync(corePath, 'utf8');
  content = content.replace(/"\.\.\/engines\/config-engine\.js"/g, '"./config/config-engine.js"');
  fs.writeFileSync(corePath, content);
  console.log("✅ Updated core.js imports.");
}

// Update core/bootstrap.js
const bootstrapPath = path.join(core, 'bootstrap.js');
if (fs.existsSync(bootstrapPath)) {
  let content = fs.readFileSync(bootstrapPath, 'utf8');
  
  // Update phase 1 folders
  content = content.replace(/"\.\.\/search\/engine\.js"/g, '"./search/engine.js"');
  content = content.replace(/"\.\.\/analytics\/engine\.js"/g, '"./analytics/engine.js"');
  content = content.replace(/"\.\.\/storage\/engine\.js"/g, '"./storage/engine.js"');
  
  // Update phase 2 files
  content = content.replace(/"\.\.\/engines\/theme-engine\.js"/g, '"./theme/theme-engine.js"');
  content = content.replace(/"\.\.\/engines\/seo-engine\.js"/g, '"./seo/seo-engine.js"');
  content = content.replace(/"\.\.\/engines\/recommendation-engine\.js"/g, '"./discovery/recommendation-engine.js"');
  content = content.replace(/"\.\.\/engines\/plugin-engine\.js"/g, '"./plugins/plugin-engine.js"');
  content = content.replace(/"\.\.\/engines\/logger-engine\.js"/g, '"./logger/logger-engine.js"');
  content = content.replace(/"\.\.\/engines\/plugin-manager\.js"/g, '"./plugins/plugin-manager.js"');
  content = content.replace(/"\.\.\/engines\/i18n-engine\.js"/g, '"./i18n/i18n-engine.js"');
  
  fs.writeFileSync(bootstrapPath, content);
  console.log("✅ Updated bootstrap.js imports.");
}

console.log("Migration Phase 2 Complete!");
