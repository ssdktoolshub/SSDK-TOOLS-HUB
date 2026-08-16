const fs = require('fs');
const path = require('path');

const REGISTRY_DIR = path.join(__dirname, '../registry');
const MANIFESTS_DIR = path.join(REGISTRY_DIR, 'manifests');

function validateManifests() {
  console.log("🔍 Running SSDK Manifest Validator...");
  const files = fs.readdirSync(MANIFESTS_DIR).filter(f => f.endsWith('.json'));
  let errors = 0;

  files.forEach(file => {
    const manifest = JSON.parse(fs.readFileSync(path.join(MANIFESTS_DIR, file), 'utf8'));
    
    // Check required fields based on our new standard
    const required = ['name', 'slug', 'category', 'description', 'version'];
    // Assuming 'id' was migrated to 'slug' based on the new schema, but we check both to be safe during migration
    
    required.forEach(field => {
      if (!manifest[field] && field !== 'slug' || (field === 'slug' && !manifest.slug && !manifest.id)) {
        console.error(`❌ [${file}] Missing required field: ${field}`);
        errors++;
      }
    });
  });

  if (errors > 0) {
    console.error(`\n❌ Validation Failed with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log(`\n✅ All ${files.length} manifests passed validation!`);
  }
}

validateManifests();
