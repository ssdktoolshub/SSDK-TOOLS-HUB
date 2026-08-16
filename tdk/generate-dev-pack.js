const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

const devTools = [
  "JSON Formatter", "JSON Validator", "JSON Minifier", "JSON Beautifier", "JSON Compare",
  "JSON Diff", "JSON Viewer", "JSON Editor", "JSON to XML", "JSON to CSV", "JSON to YAML",
  "XML Formatter", "XML Validator", "XML Viewer", "XML to JSON",
  "YAML Formatter", "YAML Validator", "YAML to JSON",
  "HTML Formatter", "HTML Minifier", "HTML Beautifier", "HTML Encoder", "HTML Decoder", "HTML Preview",
  "CSS Formatter", "CSS Minifier", "CSS Beautifier",
  "JavaScript Formatter", "JavaScript Minifier", "JavaScript Beautifier",
  "SQL Formatter", "SQL Minifier",
  "Markdown Editor", "Markdown Preview", "Markdown to HTML",
  "CSV Viewer", "CSV to JSON", "CSV Formatter",
  "Base64 Encode", "Base64 Decode",
  "URL Encoder", "URL Decoder",
  "JWT Decoder", "JWT Generator",
  "UUID Generator", "Hash Generator",
  "MD5 Generator", "SHA1 Generator", "SHA256 Generator", "SHA512 Generator",
  "Password Generator", "Password Strength Checker",
  "Regex Tester", "Cron Expression Generator",
  "Unix Timestamp Converter", "Epoch Converter",
  "UUID Validator", "Slug Generator", "Lorem Ipsum Generator",
  "Case Converter", "Text Diff Checker",
  "Whitespace Remover", "Duplicate Line Remover", "Sort Lines", "Reverse Text",
  "Word Counter", "Character Counter",
  "QR Code Generator", "QR Code Reader",
  "Barcode Generator", "Barcode Reader",
  "Color Picker", "HEX to RGB", "RGB to HEX", "HSL Converter",
  "Gradient Generator", "CSS Box Shadow Generator", "CSS Border Radius Generator", "CSS Clip Path Generator",
  "SVG Optimizer", "SVG Viewer", "SVG to PNG", "SVG to JPG", "SVG Compressor",
  "URL Parser", "HTTP Header Viewer", "User Agent Parser", "MIME Type Checker",
  "DNS Lookup", "WHOIS Lookup", "IP Lookup", "GeoIP Lookup", "Port Checker", "SSL Checker"
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

  for (const toolName of devTools) {
    const slug = slugify(toolName);
    const catFolder = "developer";
    const category = "👨‍💻 Developer Tools";

    const manifestPath = path.join(manifestsDir, `${slug}.json`);

    if (!fs.existsSync(manifestPath)) {
      const isApi = ["dns-lookup", "whois-lookup", "ip-lookup", "geoip-lookup", "port-checker", "ssl-checker"].includes(slug);
      
      let inputs = [{ id: "toolInput", type: "textarea", label: "Input Data", placeholder: "Paste your input here..." }];
      if (slug.includes("generator") && !slug.includes("qr") && !slug.includes("barcode")) {
         inputs = []; // UUID, Password generators don't necessarily need input textareas, maybe a generate button, but we can leave standard schema and just ignore it in logic
      }

      const manifestObj = {
        name: toolName,
        slug: slug,
        category: category,
        description: `Professional, free, and secure ${toolName} online. Developer utility for instant processing.`,
        keywords: [toolName.toLowerCase(), "developer", "tool", "online", "free", "api"],
        inputs: inputs,
        outputs: [
          { id: "toolOutput", type: "textarea", label: "Output Result" }
        ],
        supportedFormats: ["txt", "json", "xml", "csv", "yaml", "html", "css", "js"],
        features: [
          "Fast browser-side processing",
          "No data uploaded to server",
          "100% Secure and private",
          "Copy and Download instantly",
          "Responsive interface"
        ],
        faq: [
          { question: `How do I use the ${toolName}?`, answer: `Paste your data into the input field and the tool will automatically process it, or click the process button.` },
          { question: `Is the ${toolName} free?`, answer: `Yes, it is 100% free with no limits.` },
          { question: `Is my data secure?`, answer: isApi ? `Yes. We query public APIs to get this information, but your personal browsing data remains secure.` : `Absolutely. All processing happens entirely within your web browser. No data is sent to our servers.` },
          { question: `Does it work offline?`, answer: isApi ? `No, this specific tool requires internet access to query remote APIs.` : `Yes, this tool can function completely offline once the page is loaded.` },
          { question: `Can I use keyboard shortcuts?`, answer: `Yes, standard shortcuts like Ctrl+C for copying output are supported.` }
        ],
        seo: {
          title: `${toolName} | Free Secure Online Tool | SSDK TOOLS HUB`,
          description: `Use the best free online ${toolName}. Secure, private, and ultra-fast developer utility.`
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
        let logicContent = `// Core Logic for ${toolName}\nexport async function execute(inputs) {\n  const text = inputs.toolInput;\n  return { toolOutput: text }; // Stub\n}\nexport function validate(inputs) { return true; }\n`;
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
          icon: "👨‍💻",
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
  console.log(`✅ Developer Pack Generation Complete! Scaffolded ${generated} tools.`);
} catch (e) {
  console.error("❌ Failed:", e.message);
}
