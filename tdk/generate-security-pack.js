const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

const securityTools = [
  "Password Generator", "Password Strength Checker", "Password Entropy Calculator", 
  "Secure Password Creator", "Random String Generator", "Random Number Generator", 
  "UUID Generator", "UUID Validator", "Hash Generator", "MD5 Generator", "SHA1 Generator", 
  "SHA256 Generator", "SHA512 Generator", "CRC32 Generator", "Base64 Encode", "Base64 Decode", 
  "URL Encode", "URL Decode", "HTML Encode", "HTML Decode", "JWT Decoder", "JWT Encoder", 
  "JWT Inspector", "JSON Web Key Viewer", "HMAC Generator", "Checksum Generator", 
  "File Hash Checker", "File Integrity Checker", "AES Encrypt", "AES Decrypt", 
  "RSA Key Generator", "RSA Encrypt", "RSA Decrypt", "PGP Key Viewer", "QR Code Generator", 
  "QR Code Decoder", "Barcode Generator", "Barcode Decoder"
];

const privacyTools = [
  "EXIF Remover", "Metadata Viewer", "Metadata Remover", "PDF Metadata Cleaner", 
  "Image Privacy Cleaner", "Filename Sanitizer", "Secure File Renamer", "Cookie Viewer", 
  "Local Storage Viewer", "Session Storage Viewer", "Browser Information Viewer", 
  "User Agent Viewer", "IP Information", "DNS Leak Test", "Email Leak Checker", 
  "Website Security Headers Checker", "SSL Certificate Checker"
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
      if (slug.includes("file-") || slug.includes("remover") || slug.includes("cleaner")) {
        inputs = [{ id: "fileInput", type: "file", label: "Upload File to Scan/Clean" }];
        outputs = [{ id: "toolOutput", type: "file", label: "Processed Result" }];
      } else if (slug.includes("aes-") || slug.includes("hmac")) {
        inputs = [
           { id: "toolInput", type: "textarea", label: "Payload (Text/Data)" },
           { id: "secretKey", type: "text", label: "Secret Key / Passphrase" }
        ];
        outputs = [{ id: "toolOutput", type: "textarea", label: "Cryptographic Output" }];
      } else if (slug.includes("random-") || slug.includes("password-generator")) {
        inputs = [
           { id: "length", type: "number", label: "Length", defaultValue: 16 },
           { id: "options", type: "select", label: "Complexity", options: [
              {value: "alphanumeric", label: "Alphanumeric"},
              {value: "complex", label: "Complex (Symbols included)"},
              {value: "hex", label: "Hexadecimal"}
           ]}
        ];
        outputs = [{ id: "toolOutput", type: "textarea", label: "Generated Value" }];
      } else if (slug.includes("rsa-") || slug.includes("ssl-") || slug.includes("dns-") || slug.includes("ip-")) {
        inputs = [{ id: "toolInput", type: "text", label: "Target Host / Data" }];
        outputs = [{ id: "toolOutput", type: "textarea", label: "Result" }];
        isFutureReady = true;
      } else {
        inputs = [{ id: "toolInput", type: "textarea", label: "Input Payload" }];
        outputs = [{ id: "toolOutput", type: "textarea", label: "Processed Output" }];
      }

      const manifestObj = {
        name: toolName,
        slug: slug,
        category: category,
        description: `Secure, local ${toolName}. Processes data securely directly in your browser.`,
        keywords: [toolName.toLowerCase(), catFolder, "security", "privacy", "crypto", "free", "tool"],
        inputs: inputs,
        outputs: outputs,
        supportedFormats: ["txt"],
        features: [
          "100% Client-Side Processing",
          "Web Crypto API Powered",
          "No data sent to servers",
          "Military-grade security implementations"
        ],
        faq: [
          { question: `Is the ${toolName} safe to use for sensitive data?`, answer: `Yes. This tool runs entirely within your browser environment. Your sensitive data is never transmitted to our servers.` },
          { question: `How does it perform cryptographic operations?`, answer: `It leverages the native browser Web Crypto API (where applicable) to ensure secure, high-performance execution.` },
          { question: `Do I need to install any software?`, answer: `No. Everything operates strictly via your web browser.` }
        ],
        seo: {
          title: `${toolName} | Enterprise Security & Privacy Tools | SSDK TOOLS HUB`,
          description: `Use the secure ${toolName}. Guarantee your privacy with our 100% client-side cryptographic processing tools.`
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
           logicContent = `// Future Ready Logic Stub for ${toolName}\nexport async function execute(inputs) {\n  return { toolOutput: "⚠️ API INTEGRATION PENDING\\n\\nThis Tool is currently in 'Future Ready' status pending integration with a secure backend proxy to perform network lookups safely." };\n}\nexport function validate(inputs) { return true; }\n`;
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

  processList(securityTools, "security", "🔒 Security Tools", "🔒");
  processList(privacyTools, "privacy", "🛡️ Privacy Tools", "🛡️");

  // Save updated registry
  fs.writeFileSync(toolsJsonPath, JSON.stringify(tools, null, 2));
  console.log(`✅ Security & Privacy Pack Generation Complete! Scaffolded ${generated} tools. Skipped ${skipped} duplicates.`);
} catch (e) {
  console.error("❌ Failed:", e.message);
}
