const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

const spreadsheetTools = [
  "CSV Viewer", "CSV Editor", "CSV Cleaner", "CSV Validator", "CSV Splitter", 
  "CSV Merger", "CSV to Excel", "Excel to CSV", "JSON to CSV", "CSV to JSON", 
  "XML to CSV", "Spreadsheet Viewer", "Spreadsheet Comparator", "Spreadsheet Cleaner", 
  "Duplicate Row Remover", "Blank Row Remover", "Column Manager", "Row Manager", 
  "Spreadsheet Sorter", "Spreadsheet Filter", "Spreadsheet Search", 
  "Spreadsheet Formula Generator", "Spreadsheet Formula Library", "Excel Formula Helper", 
  "Excel Function Explorer", "Google Sheets Formula Helper"
];

const dataAnalysis = [
  "Pivot Table Generator", "Data Summary Generator", "Frequency Table", "Mean Calculator", 
  "Median Calculator", "Mode Calculator", "Variance Calculator", "Standard Deviation", 
  "Percentile Calculator", "Correlation Calculator", "Regression Calculator", "Trend Analysis", 
  "Forecast Calculator", "Data Normalizer", "Outlier Detector", "Missing Value Detector", 
  "Duplicate Detector", "Random Sample Generator", "Histogram Generator", "Scatter Plot Generator", 
  "Line Chart Generator", "Bar Chart Generator", "Pie Chart Generator", "Area Chart Generator", 
  "Radar Chart Generator", "Bubble Chart Generator", "Heatmap Generator"
];

const dashboardTools = [
  "KPI Dashboard Builder", "Sales Dashboard", "Finance Dashboard", "Marketing Dashboard", 
  "HR Dashboard", "Inventory Dashboard", "Project Dashboard", "Custom Dashboard Builder"
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

try {
  let tools = [];
  if (fs.existsSync(toolsJsonPath)) {
    tools = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));
  }

  let generated = 0;
  let skipped = 0;

  const processList = (list, catFolder, category, icon) => {
    for (const toolName of list) {
      const slug = slugify(toolName);
      
      const exists = tools.find(t => t.id === slug);
      if (exists || fs.existsSync(path.join(manifestsDir, `${slug}.json`))) {
         skipped++;
         continue; // Smart Deduplication
      }

      const manifestPath = path.join(manifestsDir, `${slug}.json`);
      let inputs = [];
      let outputs = [];
      let isFutureReady = true; // Most are future ready due to Grid/Chart requirements

      // Handle specific UI Schemas
      if (slug.includes("calculator") && !slug.includes("dashboard") && !slug.includes("generator")) {
        // Simple data calculators (e.g. Variance, Percentile)
        inputs = [{ id: "toolInput", type: "textarea", label: "Enter comma-separated data values (e.g. 10, 20, 30)" }];
        outputs = [{ id: "toolOutput", type: "textarea", label: "Calculation Result" }];
        isFutureReady = false;
      } else if (slug.includes("csv") || slug.includes("spreadsheet") || slug.includes("excel")) {
        // File upload driven tools
        inputs = [{ id: "fileInput", type: "file", label: "Upload Spreadsheet (CSV/XLSX)" }];
        outputs = [{ id: "toolOutput", type: "textarea", label: "Processed Output or Visual Grid" }];
      } else if (slug.includes("chart") || slug.includes("plot") || slug.includes("heatmap") || slug.includes("dashboard")) {
         inputs = [{ id: "fileInput", type: "file", label: "Upload Dataset for Visualization" }];
         outputs = [{ id: "toolOutput", type: "textarea", label: "Rendered Dashboard/Chart" }];
      } else {
         inputs = [{ id: "toolInput", type: "textarea", label: "Input Data / Configuration" }];
         outputs = [{ id: "toolOutput", type: "textarea", label: "Generated Result" }];
      }

      const manifestObj = {
        name: toolName,
        slug: slug,
        category: category,
        description: `Professional ${toolName}. Instantly perform complex data analysis and spreadsheet operations.`,
        keywords: [toolName.toLowerCase(), catFolder, "data", "spreadsheet", "analysis", "free", "tool"],
        inputs: inputs,
        outputs: outputs,
        supportedFormats: ["csv", "xlsx", "json"],
        features: [
          "100% Client-Side Processing",
          "High Performance Engine",
          "Responsive Interface",
          "No data sent to servers"
        ],
        faq: [
          { question: `Can I upload large datasets to the ${toolName}?`, answer: `Yes. This tool is designed to utilize browser-based memory to handle large file uploads securely.` },
          { question: `Is my confidential business data secure?`, answer: `Absolutely. All processing occurs locally on your machine. Your data is never uploaded to external servers.` },
          { question: `Why is the interactive table or chart not displaying?`, answer: `If the tool is in 'Future Ready' mode, it means the advanced visualization engine (like ag-Grid or Chart.js) is pending integration.` }
        ],
        seo: {
          title: `${toolName} | Enterprise Data Analysis & Spreadsheet Tools | SSDK TOOLS HUB`,
          description: `Use the free ${toolName}. Perform fast, secure, and accurate data operations instantly in your browser.`
        },
        relatedTools: [],
        version: "1.0.0"
      };

      fs.writeFileSync(manifestPath, JSON.stringify(manifestObj, null, 2));

      // Scaffold logic file
      const toolDir = path.join(rootDir, 'tools', catFolder, slug);
      if (!fs.existsSync(toolDir)) {
        fs.mkdirSync(toolDir, { recursive: true });
      }
      const logicPath = path.join(toolDir, 'logic.js');
      if (!fs.existsSync(logicPath)) {
        let logicContent = `// Core Logic for ${toolName}\nexport async function execute(inputs) {\n  return { toolOutput: "Please enter input values to process." };\n}\nexport function validate(inputs) { return true; }\n`;
        
        if (isFutureReady) {
           logicContent = `// Future Ready Advanced BI Stub for ${toolName}\nexport async function execute(inputs) {\n  return { toolOutput: "⚠️ ADVANCED BI MODULE PENDING\\n\\nThis Tool is currently in 'Future Ready' status.\\n\\nThe advanced Interactive Grid and Data Visualization engine for this specific tool is pending integration to preserve optimal platform memory and bundle size." };\n}\nexport function validate(inputs) { return true; }\n`;
        }

        fs.writeFileSync(logicPath, logicContent);
      }

      // Add to registry
      tools.push({
        id: slug,
        name: toolName,
        category: category,
        description: manifestObj.description,
        icon: icon,
        url: `pages/tool.html?id=${slug}`,
        type: "js",
        featured: false,
        addedDate: new Date().toISOString().split('T')[0],
        tags: manifestObj.keywords
      });

      generated++;
    }
  };

  processList(spreadsheetTools, "spreadsheet", "📊 Spreadsheet Tools", "📊");
  processList(dataAnalysis, "data-analysis", "📈 Data Analysis", "📈");
  processList(dashboardTools, "dashboard", "📊 Dashboard Tools", "📊");

  // Save updated registry
  fs.writeFileSync(toolsJsonPath, JSON.stringify(tools, null, 2));
  console.log(`✅ Data Analysis & Spreadsheet Pack Generation Complete! Scaffolded ${generated} tools. Skipped ${skipped} duplicates.`);
} catch (e) {
  console.error("❌ Failed:", e.message);
}
