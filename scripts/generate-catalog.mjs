import fs from 'fs';
import path from 'path';

const toolsJson = JSON.parse(fs.readFileSync('core/registry/tools.json', 'utf8'));
const folderMap = JSON.parse(fs.readFileSync('core/registry/tool-folder-map.json', 'utf8'));

// Group tools by category
const categories = {};
toolsJson.forEach(t => {
  const cat = t.category || '🛠 General Utilities';
  if (!categories[cat]) categories[cat] = [];
  const catSlug = folderMap[t.id] || 'utility';
  categories[cat].push({
    name: t.name,
    id: t.id,
    logicPath: `tools/${catSlug}/${t.id}/logic.js`,
    manifestPath: `core/registry/manifests/${t.id}.json`
  });
});

let mdContent = `# 🚀 SSDK Tools Hub - Master Catalog & Upgrade Guide (967 Tools)

এই ফাইলে আপনার ওয়েবসাইটের **সমস্ত ৯৬৭টি টুল** ক্যাটাগরি অনুযায়ী সাজানো রয়েছে। প্রতিটি টুলের নাম, স্লগ (ID), লজিক ফাইল ও ম্যানিফেস্ট ফাইলের পাথ দেওয়া আছে। 

---

## 🤖 ১. ChatGPT-তে আপডেট করার মাস্টার প্রম্পট (Copy & Paste Prompt)

যে কোনো টুল আপডেট করতে নিচের প্রম্পটটি ব্যবহার করুন:

\`\`\`text
I want to upgrade/modify an existing browser-based tool for my SSDK Tools Hub project.

Tool Name: [টুলের নাম]
Tool Slug: [টুলের ID / স্লগ]

CURRENT LOGIC FILE:
[logic.js ফাইলের কোড এখানে পেস্ট করুন]

CURRENT MANIFEST FILE:
[manifest.json ফাইলের কোড এখানে পেস্ট করুন]

MY REQUIREMENTS:
Please add new features, improve calculation accuracy, and enhance the tool output.

PROVIDE:
1. Updated \`logic.js\` (ES Module format: export function validate, export async function execute)
2. Updated \`<slug>.json\` (Manifest JSON with inputs, options, outputs, features, and FAQ)
\`\`\`

---

## ⚡ ২. আপডেট করার সাধারণ ৩টি ধাপ

১. ChatGPT-এর দেওয়া কোড নিয়ে \`tools/<category>/<slug>/logic.js\` ফাইলে রিপ্লেস করুন।  
২. ChatGPT-এর দেওয়া ম্যানিফেস্ট কোড নিয়ে \`core/registry/manifests/<slug>.json\` ফাইলে রিপ্লেস করুন।  
৩. টার্মিনালে কম্যান্ড চালান:
   \`\`\`bash
   node scripts/build.js
   \`\`\`

---

## 📂 ৩. মাস্টার টুল ক্যাটালগ (All 967 Tools List)

`;

let catIndex = 1;
for (const [catName, toolsList] of Object.entries(categories)) {
  mdContent += `\n### ${catIndex}. ${catName} (${toolsList.length} Tools)\n\n`;
  mdContent += `| # | Tool Name | Slug / ID | Logic File | Manifest File |\n`;
  mdContent += `|---|---|---|---|---|\n`;

  toolsList.forEach((tool, idx) => {
    mdContent += `| ${idx + 1} | **${tool.name}** | \`${tool.id}\` | [\`logic.js\`](${tool.logicPath}) | [\`manifest\`](${tool.manifestPath}) |\n`;
  });

  catIndex++;
}

const outputPath = 'C:/Users/USER/.gemini/antigravity/brain/47f1919a-a1ac-456a-9a2c-4d345e3d4b3f/tool_upgrade_guide.md';
fs.writeFileSync(outputPath, mdContent, 'utf8');

console.log(`Master catalog generated successfully with 967 tools across ${catIndex - 1} categories at ${outputPath}!`);
