const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../core/registry/tools.json');
const MANIFESTS_DIR = path.join(__dirname, '../core/registry/manifests');

console.log("=========================================");
console.log("      SSDK ENTERPRISE QA AUTOMATION      ");
console.log("=========================================\n");

let errors = 0;
let warnings = 0;

try {
  // 1. Validate Registry JSON
  console.log("Scanning tools.json...");
  const registryRaw = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const tools = JSON.parse(registryRaw);
  
  if (!Array.isArray(tools)) {
    console.error("❌ ERROR: tools.json must be an array");
    process.exit(1);
  }
  
  console.log(`✅ Registry parsed. Found ${tools.length} tools.`);

  const ids = new Set();
  
  tools.forEach((tool, index) => {
    // Check required fields
    const required = ['id', 'name', 'category', 'description', 'url', 'icon'];
    required.forEach(field => {
      if (!tool[field]) {
        console.error(`❌ ERROR: Tool at index ${index} is missing required field '${field}'`);
        errors++;
      }
    });

    // Check ID uniqueness
    if (tool.id) {
      if (ids.has(tool.id)) {
        console.error(`❌ ERROR: Duplicate Tool ID found: ${tool.id}`);
        errors++;
      }
      ids.add(tool.id);
    }
    
    // Check URL mapping
    if (tool.url && !tool.url.startsWith('pages/tool.html')) {
      console.warn(`⚠️ WARNING: Tool ${tool.id} URL does not point to Universal Template (pages/tool.html)`);
      warnings++;
    }
  });

  console.log("\nScanning Manifests directory...");
  const manifestFiles = fs.readdirSync(MANIFESTS_DIR).filter(f => f.endsWith('.json'));
  console.log(`✅ Found ${manifestFiles.length} manifest files.`);

  manifestFiles.forEach(file => {
    const raw = fs.readFileSync(path.join(MANIFESTS_DIR, file), 'utf8');
    try {
      const manifest = JSON.parse(raw);
      
      // Cross-check manifest ID with registry
      if (manifest.id && !ids.has(manifest.id)) {
        console.warn(`⚠️ WARNING: Manifest ${file} has ID '${manifest.id}' not found in tools.json registry.`);
        warnings++;
      }
      
      // Ensure UI schema exists
      if (!manifest.ui || !manifest.ui.inputs) {
        console.warn(`⚠️ WARNING: Manifest ${file} lacks 'ui.inputs' schema definition.`);
        warnings++;
      }
      
    } catch (e) {
      console.error(`❌ ERROR: Invalid JSON in manifest ${file}:`, e.message);
      errors++;
    }
  });

  console.log("\n=========================================");
  console.log(`QA SCAN COMPLETE: ${errors} Errors, ${warnings} Warnings`);
  console.log("=========================================\n");

  if (errors > 0) {
    process.exit(1);
  }

} catch (e) {
  console.error("❌ FATAL QA ERROR:", e);
  process.exit(1);
}
