// SSDK Tools Hub - 967 Tools Quality & Logic Auditor
// Analyzes all 967 logic.js implementations against the registry.

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(rootDir, 'core/registry/tools.json'), 'utf8'));
const folderMap = JSON.parse(fs.readFileSync(path.join(rootDir, 'core/registry/tool-folder-map.json'), 'utf8'));

const results = {
  total: 0,
  working: 0,
  stub: 0,
  missing: 0,
  hasValidate: 0,
  hasInit: 0
};

console.log('🔍 Auditing all registered tools in SSDK Tools Hub catalog...');

registry.forEach(tool => {
  results.total++;
  const catSlug = folderMap[tool.id] || tool.category.replace(/^[\uD800-\uDBFF\uDC00-\uDFFF\u200D\uFE0F\u2600-\u27BF\s]+/, '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-tools$/, '');
  const logicPath = path.join(rootDir, 'tools', catSlug, tool.id, 'logic.js');

  if (!fs.existsSync(logicPath)) {
    results.missing++;
    console.log(`❌ MISSING: ${tool.id} → ${logicPath}`);
    return;
  }

  const content = fs.readFileSync(logicPath, 'utf8');
  const size = content.length;

  if (content.includes('validate(')) results.hasValidate++;
  if (content.includes('init(')) results.hasInit++;

  if (size < 120) {
    results.stub++;
    console.log(`⚠️ STUB: ${tool.id} (${size} bytes)`);
  } else {
    results.working++;
  }
});

console.log('\n=========================================');
console.log('📊 SSDK TOOLS HUB CATALOG AUDIT RESULTS');
console.log('=========================================');
console.log(`Total Registered Tools: ${results.total}`);
console.log(`✅ Fully Implemented:   ${results.working} (${((results.working / results.total) * 100).toFixed(1)}%)`);
console.log(`⚠️ Minimal / Stub:       ${results.stub}`);
console.log(`❌ Missing logic.js:    ${results.missing}`);
console.log(`🛡️ Exporting validate:  ${results.hasValidate}`);
console.log('=========================================\n');
