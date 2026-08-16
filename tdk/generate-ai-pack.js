const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

const aiTools = [
  "Prompt Generator", "Prompt Optimizer", "Prompt Refiner", "Prompt Improver", "Prompt Library",
  "Prompt Categorizer", "Prompt Translator", "AI Prompt Templates", "AI Chat Playground",
  "AI Image Prompt Generator", "AI Logo Prompt Generator", "AI UI Prompt Generator",
  "AI Website Prompt Generator", "AI Coding Prompt Generator", "AI SQL Prompt Generator",
  "AI Marketing Prompt Generator", "AI Resume Prompt Generator", "AI Cover Letter Generator",
  "AI Email Generator", "AI Blog Generator", "AI Article Generator", "AI Headline Generator",
  "AI Caption Generator", "AI Hashtag Generator", "AI Tweet Generator", "AI LinkedIn Post Generator",
  "AI Instagram Caption Generator", "AI YouTube Title Generator", "AI YouTube Description Generator",
  "AI Keyword Generator", "AI FAQ Generator", "AI Meta Generator", "AI Product Description Generator",
  "AI Story Generator", "AI Grammar Checker", "AI Rewriter", "AI Text Summarizer", "AI Tone Changer",
  "AI Translator", "AI Code Explainer", "AI Regex Generator", "AI SQL Builder", "AI JSON Generator",
  "AI HTML Generator", "AI CSS Generator", "AI JavaScript Generator", "AI Python Generator",
  "AI Bug Explainer", "AI Test Case Generator", "AI Documentation Generator"
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

  for (const toolName of aiTools) {
    const slug = slugify(toolName);
    const catFolder = "ai";
    const category = "🤖 AI Tools";
    const manifestPath = path.join(manifestsDir, `${slug}.json`);

    if (!fs.existsSync(manifestPath)) {
      let inputs = [];
      
      if (slug === "ai-tone-changer") {
        inputs = [
          { id: "toolInput", type: "textarea", label: "Original Text", placeholder: "Enter text here..." },
          { id: "tone", type: "select", label: "Target Tone", options: [
             {value: "professional", label: "Professional"},
             {value: "casual", label: "Casual"},
             {value: "humorous", label: "Humorous"},
             {value: "academic", label: "Academic"}
          ]}
        ];
      } else if (slug === "ai-code-explainer") {
        inputs = [
          { id: "toolInput", type: "textarea", label: "Source Code", placeholder: "Paste code here..." },
          { id: "language", type: "select", label: "Language Context", options: [
             {value: "auto", label: "Auto Detect"},
             {value: "javascript", label: "JavaScript"},
             {value: "python", label: "Python"},
             {value: "java", label: "Java"}
          ]}
        ];
      } else if (slug === "ai-email-generator") {
        inputs = [
          { id: "recipient", type: "text", label: "Recipient (e.g., John Doe)", placeholder: "Optional" },
          { id: "topic", type: "text", label: "Topic", placeholder: "e.g., Follow up on meeting" },
          { id: "toolInput", type: "textarea", label: "Key Points", placeholder: "Enter bullet points here..." }
        ];
      } else {
        inputs = [{ id: "toolInput", type: "textarea", label: "AI Prompt / Context", placeholder: "Enter context here..." }];
      }

      const manifestObj = {
        name: toolName,
        slug: slug,
        category: category,
        description: `Use the power of artificial intelligence with our ${toolName}. (Currently in Future Ready / Standby mode).`,
        keywords: [toolName.toLowerCase(), "ai", "generator", "openai", "gemini", "free"],
        inputs: inputs,
        outputs: [
          { id: "toolOutput", type: "textarea", label: "AI Output" }
        ],
        supportedFormats: ["txt"],
        features: [
          "Future Ready AI Architecture",
          "Multiple Provider Support (OpenAI, Gemini, Claude)",
          "Default: Free & Disabled",
          "Seamless Provider Fallback"
        ],
        faq: [
          { question: `What is the ${toolName}?`, answer: `The ${toolName} uses AI to generate or process text based on your prompt.` },
          { question: `Which AI provider does it use?`, answer: `This tool supports multiple providers such as OpenAI, Google Gemini, and Local AI. The specific provider used depends on the Admin configuration.` },
          { question: `Is it active right now?`, answer: `Currently, the platform is in 'Future Ready' mode, meaning AI tools are safely stubbed until an Admin provisions API keys.` }
        ],
        seo: {
          title: `${toolName} | Free AI Tools | SSDK TOOLS HUB`,
          description: `Access the ${toolName} online. Multi-provider support including OpenAI and Gemini. Future Ready AI ecosystem.`
        },
        relatedTools: [],
        version: "1.0.0"
      };

      fs.writeFileSync(manifestPath, JSON.stringify(manifestObj, null, 2));

      // Scaffold logic file with Future Ready Stub
      const toolDir = path.join(rootDir, 'tools', catFolder, slug);
      if (!fs.existsSync(toolDir)) {
        fs.mkdirSync(toolDir, { recursive: true });
      }
      const logicPath = path.join(toolDir, 'logic.js');
      if (!fs.existsSync(logicPath)) {
        const logicContent = `// Future Ready AI Logic Stub for ${toolName}\nexport async function execute(inputs) {\n  return { toolOutput: "⚠️ AI PROVIDER DISABLED\\n\\nThis Tool is currently in 'Future Ready' status.\\n\\nThe AI Provider integration (OpenAI / Gemini / Claude) is pending Admin configuration and API Key provisioning." };\n}\nexport function validate(inputs) { return true; }\n`;
        fs.writeFileSync(logicPath, logicContent);
      }

      // Add to registry if missing
      const exists = tools.find(t => t.id === slug);
      if (!exists) {
        tools.push({
          id: slug,
          name: toolName,
          category: category,
          description: manifestObj.description,
          icon: "🤖",
          url: `pages/tool.html?id=${slug}`,
          type: "js",
          featured: false,
          addedDate: new Date().toISOString().split('T')[0],
          tags: manifestObj.keywords
        });
      }

      generated++;
    }
  }

  // Save updated registry
  fs.writeFileSync(toolsJsonPath, JSON.stringify(tools, null, 2));
  console.log(`✅ AI Pack Generation Complete! Scaffolded ${generated} tools.`);
} catch (e) {
  console.error("❌ Failed:", e.message);
}
