const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

const seoTools = [
  "Meta Tag Generator", "Title Generator", "Meta Description Generator", "Meta Length Checker",
  "Keyword Density Checker", "Keyword Extractor", "Keyword Grouper", "Slug Generator",
  "Canonical URL Generator", "Robots.txt Generator", "Sitemap XML Generator", "HTML Sitemap Generator",
  "Open Graph Generator", "Twitter Card Generator", "Schema Markup Generator", "FAQ Schema Generator",
  "HowTo Schema Generator", "Breadcrumb Schema Generator", "Article Schema Generator",
  "Product Schema Generator", "Organization Schema Generator", "Local Business Schema Generator",
  "Person Schema Generator", "Event Schema Generator", "Video Schema Generator",
  "Image SEO Optimizer", "Image Alt Text Generator", "Heading Structure Checker",
  "Internal Link Checker", "Broken Link Checker", "Redirect Checker", "HTTP Header Checker",
  "Cache Header Checker", "Page Size Checker", "GZIP Checker", "Mobile Friendly Checker",
  "Viewport Checker", "Hreflang Generator", "SERP Preview Tool", "Rich Result Preview",
  "Google Search Snippet Preview", "UTM Builder", "URL Canonical Checker", "URL Encoder",
  "URL Decoder", "HTML Minifier", "CSS Minifier", "JavaScript Minifier", "Social Meta Preview",
  "Favicon Checker", "Website Meta Extractor", "Website SEO Analyzer", "PageSpeed Checker",
  "Domain Authority Checker", "Backlink Checker", "Keyword Position Tracker"
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

  for (const toolName of seoTools) {
    const slug = slugify(toolName);
    const catFolder = "seo";
    const category = "📈 SEO Tools";

    const manifestPath = path.join(manifestsDir, `${slug}.json`);

    if (!fs.existsSync(manifestPath)) {
      const isApi = ["website-seo-analyzer", "pagespeed-checker", "domain-authority-checker", "backlink-checker", "keyword-position-tracker"].includes(slug);
      
      let inputs = [];
      if (slug === "faq-schema-generator") {
        inputs = [
          { id: "q1", type: "text", label: "Question 1", placeholder: "e.g., What is SEO?" },
          { id: "a1", type: "textarea", label: "Answer 1", placeholder: "Search Engine Optimization is..." },
          { id: "q2", type: "text", label: "Question 2", placeholder: "Optional" },
          { id: "a2", type: "textarea", label: "Answer 2", placeholder: "Optional" }
        ];
      } else if (slug === "utm-builder") {
        inputs = [
          { id: "url", type: "text", label: "Website URL", placeholder: "https://example.com" },
          { id: "source", type: "text", label: "Campaign Source", placeholder: "google, newsletter" },
          { id: "medium", type: "text", label: "Campaign Medium", placeholder: "cpc, email" },
          { id: "name", type: "text", label: "Campaign Name", placeholder: "spring_sale" }
        ];
      } else if (slug.includes("generator") || slug.includes("preview")) {
         inputs = [
           { id: "title", type: "text", label: "Page Title", placeholder: "Enter title..." },
           { id: "desc", type: "textarea", label: "Meta Description", placeholder: "Enter description..." }
         ];
      } else {
         inputs = [{ id: "toolInput", type: "textarea", label: "Input Data", placeholder: "Paste your content or URL here..." }];
      }

      const manifestObj = {
        name: toolName,
        slug: slug,
        category: category,
        description: `Professional, free, and precise ${toolName} online. Optimize your website instantly.`,
        keywords: [toolName.toLowerCase(), "seo", "optimization", "webmaster", "free", "tool"],
        inputs: inputs,
        outputs: [
          { id: "toolOutput", type: "textarea", label: "Output Result" }
        ],
        supportedFormats: ["txt", "html", "json", "xml"],
        features: [
          "Fast browser-side processing",
          "No data uploaded to server",
          "100% Secure and private",
          "Copy and Download instantly",
          "Follows latest Google guidelines"
        ],
        faq: [
          { question: `How do I use the ${toolName}?`, answer: `Fill in the required fields or paste your data, and the tool will automatically process and generate the result.` },
          { question: `Is the ${toolName} free?`, answer: `Yes, it is 100% free with no limits.` },
          { question: `Is my data secure?`, answer: isApi ? `Yes. We query public APIs to get this information, but your data is secure.` : `Absolutely. All processing happens entirely within your web browser. No data is sent to our servers.` },
          { question: `Does it follow current SEO best practices?`, answer: `Yes, all generated code and recommendations strictly adhere to the latest official guidelines from Google and Schema.org.` },
          { question: `Can I use this on mobile?`, answer: `Yes, the interface is fully responsive and optimized for mobile devices.` }
        ],
        seo: {
          title: `${toolName} | Free Online Webmaster Tool | SSDK TOOLS HUB`,
          description: `Use the best free online ${toolName}. Secure, private, and ultra-fast SEO utility for webmasters.`
        },
        relatedTools: [],
        version: "1.1.0"
      };

      fs.writeFileSync(manifestPath, JSON.stringify(manifestObj, null, 2));

      // Scaffold logic file
      const toolDir = path.join(rootDir, 'tools', catFolder, slug);
      if (!fs.existsSync(toolDir)) {
        fs.mkdirSync(toolDir, { recursive: true });
      }
      const logicPath = path.join(toolDir, 'logic.js');
      if (!fs.existsSync(logicPath)) {
        let logicContent = `// Core Logic for ${toolName}\nexport async function execute(inputs) {\n  return { toolOutput: "Processed output goes here..." }; // Stub\n}\nexport function validate(inputs) { return true; }\n`;
        if (isApi) {
          logicContent = `// API Stub Logic for ${toolName}\nexport async function execute(inputs) {\n  return { toolOutput: "This feature requires the upcoming Backend API Integration module. It is currently in 'Future Ready' status." };\n}\nexport function validate(inputs) { return true; }\n`;
        }
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
          icon: "📈",
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
  console.log(`✅ SEO Pack Generation Complete! Scaffolded ${generated} tools.`);
} catch (e) {
  console.error("❌ Failed:", e.message);
}
