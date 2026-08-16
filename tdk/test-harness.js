const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const toolsJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../core/registry/tools.json'), 'utf8'));
const toolsDir = path.join(__dirname, '../tools');
const docsDir = path.join(__dirname, '../docs');

const placeholders = [
  "Processing complete",
  "Processed:",
  "Operation completed",
  "Analysis completed",
  "Successfully processed",
  "toolOutput: \"Please enter input values",
  "dummy",
  "mock",
  "sample",
  "placeholder",
  "demo",
  "fake",
  "coming soon",
  "not implemented"
];

const catMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../core/registry/tool-folder-map.json'), 'utf8'));

function getCategorySlug(tool) {
  if (catMap[tool.id]) return catMap[tool.id];
  let slug = tool.category.replace(/^[\uD800-\uDBFF\uDC00-\uDFFF\u200D\uFE0F\u2600-\u27BF\s]+/, '').toLowerCase();
  slug = slug.replace(/&/g, 'and');
  slug = slug.replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  if (slug.endsWith('-tools')) {
    slug = slug.replace(/-tools$/, '');
  }
  return slug;
}

async function runHarness() {
  let passed = 0;
  let partial = 0;
  let broken = 0;
  let placeholderCount = 0;
  let missing = 0;

  const results = [];

  for (const tool of toolsJson) {
    const catSlug = getCategorySlug(tool);
    const logicPath = path.join(toolsDir, catSlug, tool.id, 'logic.js');

    const result = {
      id: tool.id,
      category: catSlug,
      name: tool.name,
      status: "PASS",
      reason: ""
    };

    if (!fs.existsSync(logicPath)) {
      result.status = "BROKEN";
      result.reason = "logic.js missing";
      missing++;
      results.push(result);
      continue;
    }

    try {
      const content = fs.readFileSync(logicPath, 'utf8');
      const isPlaceholder = placeholders.some(ph => content.includes(ph));

      if (isPlaceholder) {
        result.status = "PLACEHOLDER";
        result.reason = "Contains fake/placeholder strings";
        placeholderCount++;
        results.push(result);
        continue;
      }

      // Try dynamic import
      const moduleUrl = pathToFileURL(logicPath).href;
      const module = await import(moduleUrl);

      if (!module.execute && !module.run) {
        result.status = "BROKEN";
        result.reason = "No execute() or run() exported";
        broken++;
      } else {
        passed++;
      }
    } catch (e) {
      result.status = "BROKEN";
      result.reason = "Syntax or import error: " + e.message;
      broken++;
    }

    results.push(result);
  }

  console.log(`Test Complete. Scanned ${toolsJson.length} tools.`);
  console.log(`PASS: ${passed}`);
  console.log(`PLACEHOLDER: ${placeholderCount}`);
  console.log(`BROKEN (Import/Export errors): ${broken}`);
  console.log(`MISSING FILES: ${missing}`);

  // Generate Report
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  
  let md = `# Tool Functionality Report\n\n`;
  md += `**Total Tools:** ${toolsJson.length}\n`;
  md += `**PASS:** ${passed}\n`;
  md += `**PLACEHOLDER:** ${placeholderCount}\n`;
  md += `**BROKEN:** ${broken}\n`;
  md += `**MISSING:** ${missing}\n\n`;

  md += `## Needs Repair (Placeholders & Broken)\n\n`;
  md += `| Tool ID | Category | Status | Reason |\n`;
  md += `|---|---|---|---|\n`;

  for (const r of results.filter(r => r.status !== "PASS")) {
    md += `| ${r.id} | ${r.category} | ${r.status} | ${r.reason} |\n`;
  }

  fs.writeFileSync(path.join(docsDir, 'tool-functionality-report.md'), md);
  console.log("Report generated at docs/tool-functionality-report.md");
}

runHarness().catch(console.error);
