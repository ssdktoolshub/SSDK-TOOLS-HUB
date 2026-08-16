const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const REGISTRY_DIR = path.join(ROOT_DIR, 'registry');
const MANIFESTS_DIR = path.join(REGISTRY_DIR, 'manifests');
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');

console.log("=========================================");
console.log("🛠️  SSDK DX Toolkit - Quality Control Validator");
console.log("=========================================\n");

let errorCount = 0;
let warningCount = 0;
let checkedCount = 0;
const seenIds = new Set();
const categories = new Set();

function logError(toolId, msg) {
  console.log(`❌ [ERROR] ${toolId}: ${msg}`);
  errorCount++;
}

function logWarning(toolId, msg) {
  console.log(`⚠️ [WARN]  ${toolId}: ${msg}`);
  warningCount++;
}

function runValidation() {
  const files = fs.readdirSync(MANIFESTS_DIR).filter(f => f.endsWith('.json') && f !== 'global.json');
  
  if (files.length === 0) {
    console.log("No manifests found.");
    return;
  }

  files.forEach(file => {
    checkedCount++;
    const filePath = path.join(MANIFESTS_DIR, file);
    let raw;
    let manifest;
    
    try {
      raw = fs.readFileSync(filePath, 'utf-8');
      manifest = JSON.parse(raw);
    } catch (e) {
      logError(file, "Invalid JSON structure.");
      return;
    }

    const id = manifest.id;
    if (!id) {
      logError(file, "Missing 'id' field.");
      return;
    }

    if (seenIds.has(id)) {
      logError(id, "Duplicate Tool ID detected in registry.");
    }
    seenIds.add(id);

    if (manifest.category) categories.add(manifest.category);

    // Required fields check
    const required = ['name', 'description', 'category', 'icon', 'url'];
    required.forEach(req => {
      if (!manifest[req]) logError(id, `Missing required field: '${req}'`);
    });

    // Dead Link Checker
    if (manifest.url) {
      const htmlPath = path.join(ROOT_DIR, manifest.url);
      if (!fs.existsSync(htmlPath)) {
        logError(id, `Dead Link! HTML file not found at: ${manifest.url}`);
      }
    }

    // SEO & Feature Validations (Warnings)
    if (!manifest.keywords || manifest.keywords.length === 0) {
      logWarning(id, "Missing SEO keywords.");
    }
    
    if (!manifest.faq || manifest.faq.length === 0) {
      logWarning(id, "Missing FAQ section.");
    }
    
    if (!manifest.useCases || manifest.useCases.length === 0) {
      logWarning(id, "Missing Use Cases.");
    }

    // Translation Checks (Basic)
    // We assume any text field should not be empty
    if (manifest.name && manifest.name.trim() === "") logError(id, "Name is empty (Translation issue).");
  });

  console.log("\n=========================================");
  console.log("📊 Validation Summary");
  console.log("=========================================");
  console.log(`Tools Scanned : ${checkedCount}`);
  console.log(`Categories    : ${categories.size}`);
  console.log(`Errors        : ${errorCount}`);
  console.log(`Warnings      : ${warningCount}`);
  
  if (errorCount > 0) {
    console.log("\n❌ QUALITY CONTROL FAILED. Please fix the errors above.");
    process.exit(1);
  } else {
    console.log("\n✅ ALL CHECKS PASSED. Platform is enterprise-ready.");
    process.exit(0);
  }
}

runValidation();
