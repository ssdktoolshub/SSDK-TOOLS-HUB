const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

const textTools = [
  "Text Editor", "Rich Text Editor", "Markdown Editor", "Markdown Preview", "Word Counter",
  "Character Counter", "Sentence Counter", "Paragraph Counter", "Reading Time Calculator",
  "Case Converter", "Uppercase", "Lowercase", "Title Case", "Sentence Case", "Capitalize Words",
  "Reverse Text", "Reverse Words", "Reverse Lines", "Sort Lines", "Shuffle Lines",
  "Remove Empty Lines", "Remove Duplicate Lines", "Trim Spaces", "Normalize Spaces",
  "Remove Extra Spaces", "Find & Replace", "Text Diff Checker", "Compare Text", "Remove HTML Tags",
  "HTML Encode", "HTML Decode", "URL Encode", "URL Decode", "Base64 Encode", "Base64 Decode",
  "Lorem Ipsum Generator", "Random Text Generator", "Password Generator", "Strong Password Checker",
  "Slug Generator", "UUID Generator", "QR Code Generator", "Barcode Generator", "Text to Speech",
  "Speech to Text"
];

const docTools = [
  "TXT to PDF", "Markdown to PDF", "HTML to PDF", "Text to DOCX", "DOCX to Text",
  "RTF to Text", "RTF to PDF", "ODT to PDF", "Document Metadata Viewer", "Document Metadata Remover",
  "Document Comparator", "Document Merge", "Document Split", "Document Watermark",
  "Document Page Number", "Document Header/Footer", "Document Template Generator",
  "Resume Builder", "CV Builder", "Invoice Generator", "Letter Generator", "Certificate Generator",
  "Report Generator", "Meeting Notes Generator"
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
      
      // Some text tools already exist in Developer Pack (Base64, Slug, UUID, etc.)
      const exists = tools.find(t => t.id === slug);
      if (exists || fs.existsSync(path.join(manifestsDir, `${slug}.json`))) {
         skipped++;
         continue; // Deduplication
      }

      const manifestPath = path.join(manifestsDir, `${slug}.json`);
      let inputs = [];
      let outputs = [];
      let isFutureReady = false;
      let supportFormat = ["txt"];

      // Form configuration logic based on tool type
      if (slug.includes("to-pdf") || slug.includes("to-text") || slug.includes("to-docx") || slug.includes("metadata") || slug.includes("document-")) {
        // Converters and document manipulation (requires file upload)
        inputs = [{ id: "fileInput", type: "file", label: "Upload Document", accept: ".txt,.md,.doc,.docx,.pdf,.rtf" }];
        outputs = [{ id: "toolOutput", type: "file", label: "Processed Document" }];
        isFutureReady = true; // Wait for pdfmake/mammoth libs
      } else if (slug.includes("builder") || slug.includes("generator") && catFolder === "document") {
        // Generators (Invoice, Resume)
        inputs = [
           { id: "title", type: "text", label: "Document Title", placeholder: "e.g., Invoice #1001" },
           { id: "name", type: "text", label: "Full Name / Company", placeholder: "John Doe" },
           { id: "date", type: "date", label: "Date" },
           { id: "details", type: "textarea", label: "Additional Details" }
        ];
        outputs = [{ id: "toolOutput", type: "textarea", label: "Generated Content Preview" }];
      } else if (slug === "find-replace") {
        inputs = [
           { id: "toolInput", type: "textarea", label: "Original Text" },
           { id: "findText", type: "text", label: "Find" },
           { id: "replaceText", type: "text", label: "Replace With" }
        ];
        outputs = [{ id: "toolOutput", type: "textarea", label: "Modified Text" }];
      } else {
        // Default text processor
        inputs = [{ id: "toolInput", type: "textarea", label: "Input Text", placeholder: "Enter text here..." }];
        outputs = [{ id: "toolOutput", type: "textarea", label: "Result" }];
      }

      const manifestObj = {
        name: toolName,
        slug: slug,
        category: category,
        description: `Free and secure online ${toolName}. Fast browser-side processing for text and documents.`,
        keywords: [toolName.toLowerCase(), catFolder, "free", "online", "converter", "generator"],
        inputs: inputs,
        outputs: outputs,
        supportedFormats: supportFormat,
        features: [
          "Browser-side Execution",
          "No data uploaded to servers",
          "100% Secure & Private",
          "Instant Results"
        ],
        faq: [
          { question: `What is the ${toolName}?`, answer: `The ${toolName} helps you format, convert, or generate text and documents directly in your browser.` },
          { question: `Are my documents uploaded to a server?`, answer: `No. All text and document processing happens locally on your device for absolute privacy.` },
          { question: `Is it completely free?`, answer: `Yes, all our text utilities are entirely free to use without limits.` }
        ],
        seo: {
          title: `${toolName} | Free Online Text & Document Tools | SSDK TOOLS HUB`,
          description: `Use the best free online ${toolName}. Instantly convert and format text with absolute privacy.`
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
        let logicContent = `// Core Logic for ${toolName}\nexport async function execute(inputs) {\n  const text = inputs.toolInput;\n  if (!text) return { toolOutput: "Please enter text to process." };\n  return { toolOutput: text };\n}\nexport function validate(inputs) { return true; }\n`;
        
        if (isFutureReady) {
           logicContent = `// Future Ready Logic Stub for ${toolName}\nexport async function execute(inputs) {\n  return { toolOutput: "⚠️ ADVANCED CONVERSION PENDING\\n\\nThis Tool is currently in 'Future Ready' status pending the integration of heavy client-side parsing libraries (e.g. pdfmake, mammoth.js)." };\n}\nexport function validate(inputs) { return true; }\n`;
        } else if (slug.includes("builder") || slug.includes("generator") && catFolder === "document") {
           logicContent = `// Generator Logic Stub for ${toolName}\nexport async function execute(inputs) {\n  const t = inputs.title || "";\n  const n = inputs.name || "";\n  return { toolOutput: \`Document Preview:\\n\\nTitle: \${t}\\nName/Company: \${n}\\n\\n[Template generation logic pending]\` };\n}\nexport function validate(inputs) { return true; }\n`;
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

  processList(textTools, "text", "📝 Text Tools", "📝");
  processList(docTools, "document", "📄 Document Tools", "📄");

  // Save updated registry
  fs.writeFileSync(toolsJsonPath, JSON.stringify(tools, null, 2));
  console.log(`✅ Text & Document Pack Generation Complete! Scaffolded ${generated} tools. Skipped ${skipped} duplicates.`);
} catch (e) {
  console.error("❌ Failed:", e.message);
}
