const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

const webmasterTools = [
  "Meta Tag Analyzer", "Website SEO Analyzer", "Website Screenshot", "Website Metadata Extractor", 
  "HTML Validator", "CSS Validator", "JavaScript Validator", "Robots.txt Tester", "Robots.txt Generator", 
  "Sitemap Generator", "Sitemap Validator", "Canonical Checker", "Open Graph Checker", "Twitter Card Checker", 
  "Structured Data Tester", "Schema Validator", "JSON-LD Validator", "HTML Minifier", "CSS Minifier", 
  "JavaScript Minifier", "HTML Beautifier", "CSS Beautifier", "JavaScript Beautifier", "HTML Diff", 
  "CSS Diff", "JavaScript Diff"
];

const networkTools = [
  "DNS Lookup", "WHOIS Lookup", "IP Lookup", "Reverse IP Lookup", "Reverse DNS Lookup", 
  "MX Lookup", "NS Lookup", "TXT Lookup", "CAA Lookup", "SPF Checker", "DMARC Checker", 
  "DKIM Checker", "Ping Test", "Traceroute", "Port Scanner", "Port Checker", "SSL Checker", 
  "TLS Checker", "HTTP Header Checker", "HTTPS Redirect Checker", "Website Uptime Checker", 
  "Latency Checker", "Network Speed Test", "GeoIP Lookup", "CDN Detector", "Hosting Checker", 
  "Technology Stack Detector", "CMS Detector", "HTTP Status Checker", "Redirect Chain Checker"
];

const domainTools = [
  "Domain Age Checker", "Domain Expiry Checker", "Domain Availability", "Subdomain Finder", 
  "DNS Propagation Checker", "Registrar Lookup", "Domain Generator"
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
      let isFutureReady = false;

      // Handle specific UI Schemas
      if (slug.includes("minifier") || slug.includes("beautifier") || slug.includes("diff") || slug.includes("validator") || slug.includes("tester")) {
        // Code formatting / validation
        inputs = [{ id: "toolInput", type: "textarea", label: "Input Code Payload" }];
        outputs = [{ id: "toolOutput", type: "textarea", label: "Processed Output" }];
      } else if (slug.includes("generator")) {
         inputs = [{ id: "toolInput", type: "textarea", label: "Configuration Data" }];
         outputs = [{ id: "toolOutput", type: "textarea", label: "Generated Result" }];
      } else {
        // Network / Domain Lookups
        inputs = [{ id: "toolInput", type: "text", label: "Target Domain Name or IP Address", placeholder: "e.g., google.com or 8.8.8.8" }];
        outputs = [{ id: "toolOutput", type: "textarea", label: "Analysis Result" }];
        isFutureReady = true;
      }

      const manifestObj = {
        name: toolName,
        slug: slug,
        category: category,
        description: `Professional online ${toolName}. Instantly analyze and process targets.`,
        keywords: [toolName.toLowerCase(), catFolder, "webmaster", "network", "domain", "free", "tool"],
        inputs: inputs,
        outputs: outputs,
        supportedFormats: ["txt"],
        features: [
          "Fast Execution",
          "Comprehensive Results",
          "Responsive Layout",
          "Free to use"
        ],
        faq: [
          { question: `What does the ${toolName} do?`, answer: `The ${toolName} allows you to analyze, test, or process the specified target instantly.` },
          { question: `Is this tool running in my browser?`, answer: `Code formatters and minifiers run locally in your browser. Network tools (like DNS or Ping) utilize secure backend proxy APIs.` },
          { question: `Why is the tool not returning results?`, answer: `If the tool is in 'Future Ready' mode, it means the required backend API proxy is currently pending activation by the Admin.` }
        ],
        seo: {
          title: `${toolName} | Enterprise Webmaster & Network Tools | SSDK TOOLS HUB`,
          description: `Use the best free ${toolName}. Instantly analyze websites, domains, and network configurations.`
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
        let logicContent = `// Core Logic for ${toolName}\nexport async function execute(inputs) {\n  return { toolOutput: "Please enter input payload to process." };\n}\nexport function validate(inputs) { return true; }\n`;
        
        if (isFutureReady) {
           logicContent = `// Future Ready Network API Stub for ${toolName}\nexport async function execute(inputs) {\n  const target = inputs.toolInput;\n  if (!target) return { toolOutput: "Please enter a target Domain or IP." };\n  return { toolOutput: "⚠️ NETWORK API INTEGRATION PENDING\\n\\nThis Tool is currently in 'Future Ready' status.\\n\\nBrowser security (CORS) prevents direct raw network requests (like Ping, WHOIS, or DNS lookups) from the client-side. This tool is awaiting a secure backend proxy integration." };\n}\nexport function validate(inputs) { return true; }\n`;
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

  processList(webmasterTools, "webmaster", "🌍 Webmaster Tools", "🌍");
  processList(networkTools, "network", "🌐 Network Tools", "🌐");
  processList(domainTools, "domain", "🏢 Domain Tools", "🏢");

  // Save updated registry
  fs.writeFileSync(toolsJsonPath, JSON.stringify(tools, null, 2));
  console.log(`✅ Webmaster & Network Pack Generation Complete! Scaffolded ${generated} tools. Skipped ${skipped} duplicates.`);
} catch (e) {
  console.error("❌ Failed:", e.message);
}
