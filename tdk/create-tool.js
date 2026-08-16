const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const args = process.argv.slice(2);
const slug = args[0];
const toolName = args[1];
const category = args[2];

if (!slug || !toolName || !category) {
  console.log("Usage: node create-tool.js <slug> <\"Tool Name\"> <\"Category Name\">");
  process.exit(1);
}

// Convert category name to folder name (e.g. "🛠 Developer Tools" -> "developer")
let catFolder = category.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
// Handle special emojis
if (category.includes("Developer")) catFolder = "developer";
if (category.includes("Image")) catFolder = "image";
if (category.includes("PDF")) catFolder = "pdf";
if (category.includes("Text")) catFolder = "text";
if (category.includes("Health") || category.includes("Medical")) catFolder = "medical";
if (category.includes("Finance")) catFolder = "finance";
if (category.includes("Utility")) catFolder = "utility";
if (category.includes("Color")) catFolder = "color";
if (category.includes("Web")) catFolder = "web";
if (category.includes("SEO")) catFolder = "seo";
if (category.includes("Security")) catFolder = "security";
if (category.includes("AI")) catFolder = "ai";
if (category.includes("File")) catFolder = "file";
if (category.includes("Social")) catFolder = "social";

const rootDir = path.join(__dirname, '..');
const toolDir = path.join(rootDir, 'tools', catFolder, slug);
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

if (!fs.existsSync(toolDir)) {
  fs.mkdirSync(toolDir, { recursive: true });
}

// 1. Create manifest.json
const manifestPath = path.join(manifestsDir, `${slug}.json`);
const manifestObj = {
  name: toolName,
  slug: slug,
  category: category,
  description: `Automatically generated description for ${toolName}.`,
  keywords: [toolName.toLowerCase(), catFolder],
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
    { question: `How to use ${toolName}?`, answer: `Enter your input in the provided field and click process to generate the result.` },
    { question: `Is ${toolName} free?`, answer: `Yes, completely free with no limits.` }
  ],
  seo: {
    title: `${toolName} | Free Online Tool | SSDK TOOLS HUB`,
    description: `Use the best free online ${toolName}. Instantly process your data securely in your browser.`
  },
  relatedTools: [],
  version: "1.0.0"
};
fs.writeFileSync(manifestPath, JSON.stringify(manifestObj, null, 2));

// 2. Create logic.js in tool directory
const logicPath = path.join(toolDir, 'logic.js');
const logicContent = `
/**
 * Core Logic for ${toolName}
 */
export async function execute(inputs) {
  // Extract inputs
  const data = inputs.inputData;
  
  if (!data) {
    throw new Error("Please provide valid input data.");
  }
  
  // TODO: Implement actual tool logic here
  const result = \`Processed: \${data}\`;

  return {
    outputData: result
  };
}

export function validate(inputs) {
  return inputs.inputData && inputs.inputData.trim().length > 0;
}
`;
fs.writeFileSync(logicPath, logicContent.trim());

// 3. Update registry/tools.json
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
try {
  const tools = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));
  const exists = tools.find(t => t.id === slug);
  if (!exists) {
    tools.unshift({
      id: slug,
      name: toolName,
      category: category,
      description: manifestObj.description,
      icon: "🛠",
      url: `pages/tool.html?id=${slug}`,
      type: "js",
      featured: false,
      addedDate: new Date().toISOString().split('T')[0],
      tags: manifestObj.keywords
    });
    fs.writeFileSync(toolsJsonPath, JSON.stringify(tools, null, 2));
    console.log(`✅ Added to registry/tools.json`);
  } else {
    console.log(`⚠️ Tool already exists in registry/tools.json`);
  }
} catch (e) {
  console.error("❌ Failed to update registry/tools.json:", e.message);
}

console.log(`\n🎉 Tool [${toolName}] scaffolded successfully!`);
console.log(`📂 Manifest: registry/manifests/${slug}.json`);
console.log(`📂 Logic: tools/${catFolder}/${slug}/logic.js\n`);
process.exit(0);
