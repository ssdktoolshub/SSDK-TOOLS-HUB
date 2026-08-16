const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

if (!fs.existsSync(manifestsDir)) {
  fs.mkdirSync(manifestsDir, { recursive: true });
}

function getCatFolder(category) {
  if (!category) return "utility";
  let catFolder = category.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (category.includes("Developer")) return "developer";
  if (category.includes("Image")) return "image";
  if (category.includes("PDF")) return "pdf";
  if (category.includes("Text")) return "text";
  if (category.includes("Health") || category.includes("Medical")) return "medical";
  if (category.includes("Finance")) return "finance";
  if (category.includes("Utility")) return "utility";
  if (category.includes("Color")) return "color";
  if (category.includes("Web")) return "web";
  if (category.includes("SEO")) return "seo";
  if (category.includes("Security")) return "security";
  if (category.includes("AI")) return "ai";
  if (category.includes("File")) return "file";
  if (category.includes("Social")) return "social";
  return catFolder;
}

try {
  const tools = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));
  let generated = 0;
  
  for (const tool of tools) {
    const slug = tool.id;
    const manifestPath = path.join(manifestsDir, `${slug}.json`);
    
    if (!fs.existsSync(manifestPath)) {
      const catFolder = getCatFolder(tool.category);
      
      const manifestObj = {
        name: tool.name,
        slug: slug,
        category: tool.category,
        description: tool.description || `Free online ${tool.name} tool.`,
        keywords: tool.tags || [slug.replace(/-/g, ' '), catFolder],
        inputs: [
          { id: "inputData", type: "text", label: "Input Data" }
        ],
        outputs: [
          { id: "outputData", type: "text", label: "Output Result" }
        ],
        supportedFormats: ["txt"],
        features: [
          "Fast and secure processing",
          "Works entirely in your browser",
          "No data is sent to the server"
        ],
        faq: [
          { question: `How to use ${tool.name}?`, answer: `Enter your input in the provided field and click process to generate the result.` },
          { question: `Is ${tool.name} free?`, answer: `Yes, completely free with no limits.` }
        ],
        seo: {
          title: `${tool.name} | Free Online Tool | SSDK TOOLS HUB`,
          description: `Use the best free online ${tool.name}. ${tool.description}`
        },
        relatedTools: [],
        version: "1.0.0"
      };
      
      fs.writeFileSync(manifestPath, JSON.stringify(manifestObj, null, 2));
      
      // Also scaffold the logic file
      const toolDir = path.join(rootDir, 'tools', catFolder, slug);
      if (!fs.existsSync(toolDir)) {
        fs.mkdirSync(toolDir, { recursive: true });
      }
      const logicPath = path.join(toolDir, 'logic.js');
      if (!fs.existsSync(logicPath)) {
        fs.writeFileSync(logicPath, `// Core Logic for ${tool.name}\nexport async function execute(inputs) { return { outputData: "Processed: " + inputs.inputData }; }\nexport function validate(inputs) { return true; }\n`);
      }
      
      generated++;
    }
  }
  console.log(`✅ Batch Generation Complete! Generated ${generated} missing tool manifests and logic wrappers.`);
} catch (e) {
  console.error("❌ Failed:", e.message);
}
