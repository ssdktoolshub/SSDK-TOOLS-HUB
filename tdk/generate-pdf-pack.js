const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

const pdfTools = [
  "Merge PDF", "Split PDF", "Compress PDF", "Organize PDF", "Rotate PDF",
  "Delete Pages", "Extract Pages", "Reorder Pages", "Duplicate Pages",
  "Crop PDF", "Repair PDF", "Unlock PDF", "Protect PDF", "Add Password",
  "Remove Password", "Watermark PDF", "Remove Watermark", "Header & Footer",
  "Page Numbers", "PDF to JPG", "PDF to PNG", "PDF to WEBP", "JPG to PDF",
  "PNG to PDF", "Image to PDF", "Word to PDF", "Excel to PDF", "PowerPoint to PDF",
  "HTML to PDF", "TXT to PDF", "Markdown to PDF", "PDF to Word", "PDF to Excel",
  "PDF to PPT", "PDF to HTML", "PDF to TXT", "PDF to EPUB", "OCR PDF",
  "Scan to PDF", "Sign PDF", "Fill PDF Form", "Flatten PDF", "Compare PDF",
  "Redact PDF", "PDF Metadata Editor", "PDF Metadata Viewer", "Extract Images",
  "Extract Text", "Compress Scanned PDF", "Bookmark Editor", "Table Extractor",
  "PDF Thumbnail Generator", "Batch PDF Processor"
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

  for (const toolName of pdfTools) {
    const slug = slugify(toolName);
    const catFolder = "pdf";
    const category = "📄 PDF Tools";

    const manifestPath = path.join(manifestsDir, `${slug}.json`);

    if (!fs.existsSync(manifestPath)) {
      const manifestObj = {
        name: toolName,
        slug: slug,
        category: category,
        description: `Professional, free, and secure ${toolName} online. Process files instantly in your browser.`,
        keywords: [toolName.toLowerCase(), "pdf", "document", "free pdf tool", "secure pdf"],
        inputs: [
          { id: "pdfFile", type: "file", label: "Upload PDF", accept: ".pdf" }
        ],
        outputs: [
          { id: "resultPdf", type: "file", label: "Processed PDF" }
        ],
        supportedFormats: ["pdf"],
        features: [
          "Fast browser-side processing",
          "No files uploaded to our server",
          "100% Secure and private",
          "Enterprise grade output",
          "Batch processing support"
        ],
        faq: [
          { question: `How do I use the ${toolName}?`, answer: `Simply drag and drop your PDF into the upload area, configure any options, and click process. Your file is ready instantly.` },
          { question: `Is the ${toolName} free?`, answer: `Yes, it is 100% free with no hidden fees or watermarks.` },
          { question: `Are my PDF documents secure?`, answer: `Absolutely. All processing happens entirely within your web browser. No files are uploaded to any server, guaranteeing 100% privacy.` },
          { question: `Does it work on mobile?`, answer: `Yes, this tool is fully responsive and works perfectly on smartphones, tablets, and desktop computers.` },
          { question: `Is there a file size limit?`, answer: `Since processing happens in your browser, the limit depends on your device's memory. Most modern devices can handle very large PDFs easily.` }
        ],
        seo: {
          title: `${toolName} | Free Secure Online Tool | SSDK TOOLS HUB`,
          description: `Use the best free online ${toolName}. Secure, private, browser-based document processing with no uploads.`
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
        fs.writeFileSync(logicPath, `// Core Logic for ${toolName}\nexport async function execute(inputs) {}\nexport function validate(inputs) { return true; }\nexport function init(core) {\n  document.addEventListener("ssdk:pdfLoaded", (e) => {\n     // Setup logic hook for PDFEngine\n  });\n}\n`);
      }

      // Add to registry if missing
      const exists = tools.find(t => t.id === slug);
      if (!exists) {
        tools.push({
          id: slug,
          name: toolName,
          category: category,
          description: manifestObj.description,
          icon: "📄",
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
  console.log(`✅ PDF Pack Generation Complete! Scaffolded ${generated} tools.`);
} catch (e) {
  console.error("❌ Failed:", e.message);
}
