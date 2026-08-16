const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.join(__dirname, '..');
const REGISTRY_DIR = path.join(ROOT_DIR, 'registry');
const MANIFESTS_DIR = path.join(REGISTRY_DIR, 'manifests');
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');

console.log("=========================================");
console.log("🚀 SSDK Tool Development Kit (TDK) V1.0");
console.log("=========================================\n");

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Usage: node tdk.js \"Tool Name\" \"category-slug\"");
  console.log("Example: node tdk.js \"JSON Formatter\" \"developer-tools\"");
  process.exit(1);
}

const rawName = args[0];
const category = args[1];

const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const id = slug;
const uuid = crypto.randomUUID();

const manifestPath = path.join(MANIFESTS_DIR, `${id}.json`);
const htmlPath = path.join(TOOLS_DIR, `${id}.html`);

if (fs.existsSync(manifestPath)) {
  console.log(`❌ Tool with ID '${id}' already exists.`);
  process.exit(1);
}

// 1. Generate Manifest
const manifest = {
  id: id,
  uuid: uuid,
  name: rawName,
  slug: slug,
  shortName: rawName.substring(0, 10),
  category: category,
  subcategory: "General",
  version: "1.0.0",
  icon: "🔧",
  url: `tools/${id}.html`,
  status: "active",
  author: "SSDK Core Team",
  description: `Automatically generated description for ${rawName}.`,
  shortDescription: `Short description for ${rawName}.`,
  keywords: [slug, "tool", "utility"],
  aliases: [rawName],
  searchSynonyms: [],
  tags: [category],
  capabilities: {
    dragDrop: true,
    clipboard: true,
    download: true,
    share: true,
    offline: true,
    batch: false,
    print: false,
    fullscreen: true
  },
  seo: {
    title: `Online ${rawName} Tool`,
    description: `Free client-side ${rawName} utility.`,
    keywords: `${slug}, free ${slug}, online ${slug}`,
    canonicalUrl: `https://ssdk-tools.com/pages/tool.html?id=${id}`
  },
  faq: [
    {
      q: "Is my data uploaded to a server?",
      a: "No, all processing runs securely inside your browser. No data leaves your machine."
    },
    {
      q: `Is this ${rawName} free?`,
      a: "Yes, our entire platform follows a Free-First philosophy. It is 100% free with no limits."
    }
  ],
  useCases: [
    `Use case 1 for ${rawName}`,
    `Use case 2 for ${rawName}`
  ],
  examples: [
    {
      input: "Example input",
      output: "Example output"
    }
  ]
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`✅ Generated Manifest: manifests/${id}.json`);

// 2. Generate HTML Scaffold
const htmlScaffold = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${rawName} - SSDK Tools Hub</title>
</head>
<body>
  <div id="ssdk-playground">
    <div id="tool-inputs-container">
      <textarea id="toolInput" placeholder="Enter input here..."></textarea>
    </div>
    <div id="tool-outputs-container">
      <textarea id="toolOutput" readonly placeholder="Output will appear here..."></textarea>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(htmlPath, htmlScaffold);
console.log(`✅ Generated Scaffold: tools/${id}.html`);

console.log("\n🎉 Tool successfully registered in the ecosystem!");
console.log(`Next steps:`);
console.log(`1. Edit tools/${id}.html to build your UI.`);
console.log(`2. (Optional) Create modules/${id}.js for complex logic.`);
console.log(`3. Let the core engines handle the rest!`);
