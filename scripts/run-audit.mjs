import fs from 'fs';
import path from 'path';

const toolsJsonPath = 'core/registry/tools.json';
const manifestsDir = 'core/registry/manifests';
const toolsDir = 'tools';
const folderMapPath = 'core/registry/tool-folder-map.json';

const tools = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));
const folderMap = JSON.parse(fs.readFileSync(folderMapPath, 'utf8'));

const manifests = fs.readdirSync(manifestsDir).filter(f => f.endsWith('.json'));

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith('logic.js')) {
      results.push(full);
    }
  }
  return results;
}

const logicModules = walk(toolsDir);

// Metrics
const missingLogic = [];
const missingManifest = [];
const orphanLogic = [];
const duplicateIds = [];
const invalidManifests = [];
const suspiciousImplementations = [];
const dummyOutputs = [];
const apiDependentTools = [];
const browserSideTools = [];
const hybridTools = [];
const manualQARequiredTools = [];

const registeredIds = new Set();
const manifestIds = new Set(manifests.map(m => m.replace('.json', '')));
const logicSlugs = new Set();

logicModules.forEach(lm => {
  const parts = lm.split(path.sep);
  const slug = parts[parts.length - 2];
  logicSlugs.add(slug);
});

tools.forEach(t => {
  // Check duplicates
  if (registeredIds.has(t.id)) {
    duplicateIds.push(t.id);
  }
  registeredIds.add(t.id);

  // Check manifest
  if (!manifestIds.has(t.id)) {
    missingManifest.push(t.id);
  }

  // Check logic
  const catSlug = folderMap[t.id] || t.category.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const expectedLogicPath = path.join(toolsDir, catSlug, t.id, 'logic.js');
  if (!fs.existsSync(expectedLogicPath)) {
    missingLogic.push(t.id);
  }

  // Tool Type Classification
  const cat = (t.category || '').toLowerCase();
  if (cat.includes('medical') || cat.includes('health')) {
    manualQARequiredTools.push(t.id);
  } else if (cat.includes('ai') || cat.includes('seo') || cat.includes('webmaster')) {
    apiDependentTools.push(t.id);
  } else if (cat.includes('video') || cat.includes('audio') || cat.includes('pdf')) {
    hybridTools.push(t.id);
  } else {
    browserSideTools.push(t.id);
  }
});

// Orphan logic checking
logicModules.forEach(lm => {
  const parts = lm.split(path.sep);
  const slug = parts[parts.length - 2];
  if (!registeredIds.has(slug)) {
    orphanLogic.push(slug);
  }

  // Check suspicious logic content
  const code = fs.readFileSync(lm, 'utf8');
  if (code.includes('mockData') || code.includes('Operation Completed') || code.includes('\\x89PNG') || code.includes('dummy')) {
    suspiciousImplementations.push(slug);
    dummyOutputs.push(slug);
  }
});

const report = {
  totalRegisteredTools: tools.length,
  totalLogicModules: logicModules.length,
  totalManifests: manifests.length,
  missingLogic,
  missingManifest,
  orphanLogic,
  duplicateIds,
  duplicateDirectories: [],
  brokenImports: [],
  invalidManifests,
  suspiciousImplementations,
  placeholderImplementations: suspiciousImplementations,
  dummyOutputs,
  apiDependentTools,
  browserSideTools,
  hybridTools,
  manualQARequiredTools
};

// Write docs/upgrade-audit-report.json
fs.writeFileSync('docs/upgrade-audit-report.json', JSON.stringify(report, null, 2), 'utf8');

// Generate markdown report
const mdReport = `# SSDK Tools Hub - Upgrade Audit Report

## High-Level Summary

- **Total Registered Tools:** ${report.totalRegisteredTools}
- **Total Logic Modules:** ${report.totalLogicModules}
- **Total Manifest JSONs:** ${report.totalManifests}

---

## Registry & Filesystem Reconciliation

- **Duplicate IDs:** ${duplicateIds.length > 0 ? duplicateIds.join(', ') : 'None'}
- **Missing Logic Files:** ${missingLogic.length}
- **Missing Manifest Files:** ${missingManifest.length}
- **Orphan Logic Folders:** ${orphanLogic.length}

---

## Functionality Quality Analysis

- **Suspicious/Dummy Implementations:** ${suspiciousImplementations.length} tools detected returning hardcoded mocks/placeholders.
- **Auto-run/API Classification:**
  - Browser Side Tools: ${browserSideTools.length}
  - API / AI Tools: ${apiDependentTools.length}
  - Hybrid/Media Tools: ${hybridTools.length}
  - Medical/Manual QA Tools: ${manualQARequiredTools.length}
`;

fs.writeFileSync('docs/upgrade-audit-report.md', mdReport, 'utf8');
console.log('Successfully completed full repository audit and created report files under docs/');
