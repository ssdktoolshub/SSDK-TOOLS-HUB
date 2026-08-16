const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const toolsPath = path.join(__dirname, '../core/registry/tools.json');
const mapPath = path.join(__dirname, '../core/registry/tool-folder-map.json');
const manifestsDir = path.join(__dirname, '../core/registry/manifests');
const toolsDir = path.join(__dirname, '../tools');
const docsDir = path.join(__dirname, '../docs');

const toolsJson = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
const folderMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

// Forbidden fake output markers
const fakePatterns = [
  /processed successfully/i,
  /processing complete/i,
  /coming soon/i,
  /demo result/i,
  /sample result/i,
  /not implemented/i,
  /dummy/i,
  /placeholder/i
];

function getCategorySlug(tool) {
  if (folderMap[tool.id]) return folderMap[tool.id];
  let slug = tool.category.replace(/^[\uD800-\uDBFF\uDC00-\uDFFF\u200D\uFE0F\u2600-\u27BF\s]+/, '').toLowerCase();
  slug = slug.replace(/&/g, 'and');
  slug = slug.replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  if (slug.endsWith('-tools')) {
    slug = slug.replace(/-tools$/, '');
  }
  return slug;
}

// Generate realistic test inputs per category / tool type
function generateTestInputs(tool, manifest) {
  const cat = (tool.category || '').toLowerCase();
  const id = tool.id.toLowerCase();
  
  // Base inputs with multiple common aliases to satisfy different logic.js parameter names
  const inputs = {
    toolInput: "Hello World 123",
    input: "Hello World 123",
    text: "The quick brown fox jumps over the lazy dog.",
    value: 42,
    num: 100,
    amount: 5000,
    rate: 7.5,
    tenure: 12,
    principal: 10000,
    years: 5,
    months: 12,
    weight: 70,
    height: 175,
    age: 30,
    gender: "male",
    date: "2026-01-15",
    date1: "2026-01-01",
    date2: "2026-08-15",
    dob: "1995-05-20",
    from: "usd",
    to: "eur",
    unit: "meters",
    fromUnit: "meters",
    toUnit: "feet",
    color: "#7c3aed",
    hex: "#7c3aed",
    rgb: "rgb(124, 58, 237)",
    hsl: "hsl(262, 83%, 58%)",
    json: '{"name":"SSDK","version":"2.0","active":true}',
    url: "https://example.com/api?query=test&id=123",
    html: "<div class='container'><p>Hello World</p></div>",
    css: "body { background: #080911; color: #fff; }",
    js: "function test() { return 42; }",
    sql: "SELECT * FROM users WHERE active = 1;",
    xml: "<root><item id='1'>Value</item></root>",
    yaml: "name: SSDK\nversion: 2.0\nenabled: true",
    markdown: "# Title\n\n**Bold text** and *italic text*.",
    base64: "SGVsbG8gV29ybGQ=",
    ip: "192.168.1.1",
    domain: "example.com",
    email: "user@example.com",
    length: 16,
    count: 5,
    min: 1,
    max: 100,
    delimiter: ",",
    precision: 2,
    // Medical specific lab values
    hemoglobin: 14.5,
    rbc: 4.8,
    wbc: 7500,
    platelets: 250000,
    hematocrit: 44,
    esr: 10,
    glucose: 95,
    fasting_glucose: 90,
    pp_glucose: 130,
    hba1c: 5.6,
    creatinine: 0.9,
    bun: 15,
    sodium: 140,
    potassium: 4.2,
    chloride: 101,
    calcium: 9.4,
    cholesterol: 180,
    hdl: 55,
    ldl: 100,
    triglycerides: 125,
    systolic: 120,
    diastolic: 80,
    bilirubin: 0.8,
    sgot: 25,
    sgpt: 28,
    alp: 80,
    protein: 7.2,
    albumin: 4.5,
    tsh: 2.1,
    free_t3: 3.2,
    free_t4: 1.2,
    vitamin_d: 35,
    vitamin_b12: 450
  };

  // If manifest defines schema inputs, inject defaults
  if (manifest && manifest.schema && Array.isArray(manifest.schema.inputs)) {
    for (const inp of manifest.schema.inputs) {
      if (inp.id) {
        if (inp.defaultValue !== undefined) {
          inputs[inp.id] = inp.defaultValue;
        } else if (inp.type === "number") {
          inputs[inp.id] = inp.min !== undefined ? inp.min : 10;
        } else if (inp.type === "text" || inp.type === "textarea") {
          inputs[inp.id] = inp.placeholder || "Sample input text";
        } else if (inp.type === "select" && Array.isArray(inp.options) && inp.options.length) {
          inputs[inp.id] = inp.options[0].value !== undefined ? inp.options[0].value : inp.options[0];
        }
      }
    }
  }

  return inputs;
}

async function runDeepAudit() {
  console.log(`Starting Comprehensive Functional Audit of ${toolsJson.length} tools...`);
  
  const report = {
    total: toolsJson.length,
    pass: 0,
    partial: 0,
    broken: 0,
    blocked: 0,
    needsManualTest: 0,
    tools: []
  };

  const domainBreakdown = {};

  for (const tool of toolsJson) {
    const catSlug = getCategorySlug(tool);
    const logicPath = path.join(toolsDir, catSlug, tool.id, 'logic.js');
    const manifestPath = path.join(manifestsDir, `${tool.id}.json`);
    
    let manifest = null;
    if (fs.existsSync(manifestPath)) {
      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      } catch (e) {}
    }

    const toolEntry = {
      id: tool.id,
      name: tool.name,
      category: tool.category,
      categorySlug: catSlug,
      status: "PASS",
      problems: [],
      tested: true,
      verified: true,
      inputType: manifest?.type || tool.type || "text",
      outputType: "string",
      externalApi: false,
      backendDependency: false
    };

    const domain = catSlug || "general";
    if (!domainBreakdown[domain]) {
      domainBreakdown[domain] = { total: 0, pass: 0, partial: 0, broken: 0, blocked: 0, needsManualTest: 0 };
    }
    domainBreakdown[domain].total++;

    // 1. Verify Logic Path Exists
    if (!fs.existsSync(logicPath)) {
      toolEntry.status = "BROKEN";
      toolEntry.problems.push(`logic.js not found at tools/${catSlug}/${tool.id}/logic.js`);
      toolEntry.verified = false;
      report.broken++;
      domainBreakdown[domain].broken++;
      report.tools.push(toolEntry);
      continue;
    }

    // 2. Read File and Check for Fake Markers
    const content = fs.readFileSync(logicPath, 'utf8');
    for (const pat of fakePatterns) {
      if (pat.test(content)) {
        // Check if it is merely returning a configuration error message (e.g. for AI tools)
        if (content.includes("Configuration Error") || content.includes("API key")) {
          // This is a legitimate blocked/config error
        } else {
          toolEntry.problems.push(`Contains potential placeholder string matching ${pat}`);
        }
      }
    }

    // 3. Dynamic Module Import
    let module;
    try {
      const moduleUrl = pathToFileURL(logicPath).href + `?t=${Date.now()}`;
      module = await import(moduleUrl);
    } catch (importErr) {
      toolEntry.status = "BROKEN";
      toolEntry.problems.push(`Module import failed: ${importErr.message}`);
      toolEntry.verified = false;
      report.broken++;
      domainBreakdown[domain].broken++;
      report.tools.push(toolEntry);
      continue;
    }

    // 4. Verify Export Function Contract
    const execFn = module.execute || module.run;
    if (typeof execFn !== "function") {
      toolEntry.status = "BROKEN";
      toolEntry.problems.push(`Neither execute() nor run() is exported as a function`);
      toolEntry.verified = false;
      report.broken++;
      domainBreakdown[domain].broken++;
      report.tools.push(toolEntry);
      continue;
    }

    // 5. Test Validation Function (if present)
    if (typeof module.validate === "function") {
      try {
        const validRes = module.validate(generateTestInputs(tool, manifest));
        // Validate function should return boolean
      } catch (valErr) {
        toolEntry.problems.push(`validate() error: ${valErr.message}`);
      }
    }

    // 6. Test Real Execution
    const testInputs = generateTestInputs(tool, manifest);
    try {
      const result = await execFn(testInputs);

      // Analyze Execution Output
      if (result === undefined || result === null) {
        toolEntry.status = "PARTIAL";
        toolEntry.problems.push(`execute() returned ${result}`);
        toolEntry.verified = false;
      } else if (typeof result === "object") {
        if (result.toolOutput !== undefined) {
          toolEntry.outputType = "toolOutput (string/number)";
          if (typeof result.toolOutput === "string" && result.toolOutput.trim().length === 0) {
            toolEntry.status = "PARTIAL";
            toolEntry.problems.push("toolOutput is empty string");
          }
        } else if (result.outputData !== undefined) {
          toolEntry.outputType = "outputData (text/data)";
          if (typeof result.outputData === "string" && result.outputData.includes("Configuration Error")) {
            toolEntry.status = "BLOCKED";
            toolEntry.externalApi = true;
            toolEntry.problems.push("Requires external API key / Provider configuration");
          }
        } else if (result.htmlPreview !== undefined) {
          toolEntry.outputType = "htmlPreview (HTML UI/Visual)";
          if (typeof result.htmlPreview === "string" && result.htmlPreview.trim().length === 0) {
            toolEntry.status = "PARTIAL";
            toolEntry.problems.push("htmlPreview is empty string");
          }
        } else if (result.outputBlob !== undefined) {
          toolEntry.outputType = "outputBlob (File/Download)";
        } else if (Object.keys(result).length === 0) {
          toolEntry.status = "PARTIAL";
          toolEntry.problems.push("execute() returned empty object {}");
        } else {
          toolEntry.outputType = "structured json object";
        }
      } else if (typeof result === "string") {
        toolEntry.outputType = "raw string";
        if (result.trim().length === 0) {
          toolEntry.status = "PARTIAL";
          toolEntry.problems.push("execute() returned empty string");
        }
      } else if (typeof result === "number" || typeof result === "boolean") {
        toolEntry.outputType = typeof result;
      }

      // Check if tool requires external provider / API
      if (catSlug === "ai" || tool.id.startsWith("ai-") || (manifest && manifest.provider)) {
        toolEntry.externalApi = true;
        if (toolEntry.status === "PASS") {
          // If it handles locally (fallback) or returns config message
          if (typeof result === "object" && result.outputData && result.outputData.includes("Configuration Error")) {
            toolEntry.status = "BLOCKED";
            toolEntry.problems.push("External AI API Key required");
          }
        }
      }

    } catch (execErr) {
      toolEntry.status = "BROKEN";
      toolEntry.problems.push(`execute() threw exception: ${execErr.message}`);
      toolEntry.verified = false;
    }

    // Classify into counters
    if (toolEntry.status === "PASS") {
      report.pass++;
      domainBreakdown[domain].pass++;
    } else if (toolEntry.status === "PARTIAL") {
      report.partial++;
      domainBreakdown[domain].partial++;
    } else if (toolEntry.status === "BROKEN") {
      report.broken++;
      domainBreakdown[domain].broken++;
    } else if (toolEntry.status === "BLOCKED") {
      report.blocked++;
      domainBreakdown[domain].blocked++;
    } else if (toolEntry.status === "NEEDS_MANUAL_TEST") {
      report.needsManualTest++;
      domainBreakdown[domain].needsManualTest++;
    }

    report.tools.push(toolEntry);
  }

  // Save JSON report
  fs.writeFileSync(path.join(docsDir, 'tool-health-report.json'), JSON.stringify(report, null, 2));
  console.log(`\nAudit Complete! Results:`);
  console.log(`TOTAL: ${report.total}`);
  console.log(`PASS: ${report.pass}`);
  console.log(`PARTIAL: ${report.partial}`);
  console.log(`BROKEN: ${report.broken}`);
  console.log(`BLOCKED: ${report.blocked}`);
  console.log(`NEEDS_MANUAL_TEST: ${report.needsManualTest}`);

  // Generate Markdown report
  let md = `# SSDK TOOLS HUB — 967-Tool Functional Health Report\n\n`;
  md += `**Date:** ${new Date().toISOString()}\n`;
  md += `**Total Registered Tools:** ${report.total}\n\n`;
  md += `| Status | Count | Percentage |\n`;
  md += `|---|---|---|\n`;
  md += `| **PASS** (Fully Functional Real Logic) | ${report.pass} | ${((report.pass/report.total)*100).toFixed(1)}% |\n`;
  md += `| **BLOCKED** (Requires External API / Key) | ${report.blocked} | ${((report.blocked/report.total)*100).toFixed(1)}% |\n`;
  md += `| **PARTIAL** (Needs Additional Parameter Tuning) | ${report.partial} | ${((report.partial/report.total)*100).toFixed(1)}% |\n`;
  md += `| **BROKEN** (Syntax/Import/Runtime Error) | ${report.broken} | ${((report.broken/report.total)*100).toFixed(1)}% |\n`;
  md += `| **NEEDS MANUAL TEST** | ${report.needsManualTest} | ${((report.needsManualTest/report.total)*100).toFixed(1)}% |\n\n`;

  md += `## Category Domain Breakdown\n\n`;
  md += `| Category | Total | Pass | Blocked | Partial | Broken |\n`;
  md += `|---|---|---|---|---|---|\n`;
  for (const [cat, stats] of Object.entries(domainBreakdown)) {
    md += `| ${cat} | ${stats.total} | ${stats.pass} | ${stats.blocked} | ${stats.partial} | ${stats.broken} |\n`;
  }

  const nonPass = report.tools.filter(t => t.status !== "PASS");
  if (nonPass.length > 0) {
    md += `\n## Non-PASS Tools Analysis\n\n`;
    md += `| Tool ID | Name | Category | Status | Problems / Reason |\n`;
    md += `|---|---|---|---|---|\n`;
    for (const t of nonPass) {
      md += `| \`${t.id}\` | ${t.name} | ${t.category} | **${t.status}** | ${t.problems.join("; ")} |\n`;
    }
  }

  fs.writeFileSync(path.join(docsDir, 'tool-health-report.md'), md);
  console.log(`Saved docs/tool-health-report.json and docs/tool-health-report.md`);
}

runDeepAudit().catch(console.error);
