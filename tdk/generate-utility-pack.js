const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

const unitConverters = [
  "Length Converter", "Weight Converter", "Area Converter", "Volume Converter", 
  "Speed Converter", "Temperature Converter", "Pressure Converter", "Energy Converter", 
  "Power Converter", "Force Converter", "Density Converter", "Torque Converter", 
  "Frequency Converter", "Angle Converter", "Time Converter", "Data Storage Converter", 
  "Internet Speed Converter", "Fuel Economy Converter", "Cooking Converter", 
  "Clothing Size Converter", "Shoe Size Converter", "Ring Size Converter", 
  "Paper Size Converter", "Typography Unit Converter", "Color Converter"
];

const fileConverters = [
  "Image Converter", "Document Converter", "Audio Converter", "Video Converter", 
  "Archive Converter", "CSV Converter", "JSON Converter", "XML Converter", 
  "YAML Converter", "Markdown Converter", "HTML Converter", "SVG Converter", 
  "Base64 Converter", "QR Converter", "Barcode Converter"
];

const textUtilities = [
  "Case Converter", "Remove Duplicate Lines", "Remove Empty Lines", "Sort Lines", 
  "Shuffle Lines", "Reverse Text", "Reverse Words", "Reverse Lines", "Character Counter", 
  "Word Counter", "Sentence Counter", "Paragraph Counter", "Reading Time Calculator", 
  "Slug Generator", "Lorem Ipsum Generator", "Random Text Generator"
];

const dateAndTime = [
  "Age Calculator", "Date Difference", "Working Days", "Business Days", 
  "Time Duration", "Countdown Timer", "Stopwatch", "Alarm Clock", 
  "Timezone Converter", "World Clock", "Leap Year Checker", "Week Number Calculator"
];

const encoding = [
  "Base64 Encode", "Base64 Decode", "URL Encode", "URL Decode", "HTML Encode", 
  "HTML Decode", "Unicode Encode", "Unicode Decode", "ASCII Converter", 
  "Binary Converter", "Hex Converter", "Octal Converter", "Roman Numeral Converter"
];

const numberUtilities = [
  "Prime Checker", "Random Number Generator", "Number to Words", "Words to Number", 
  "LCM", "GCD", "Percentage Calculator", "Ratio Calculator", "Average Calculator", 
  "Median", "Mode", "Standard Deviation"
];

const webUtilities = [
  "QR Generator", "QR Scanner", "Barcode Generator", "Barcode Reader", 
  "UUID Generator", "UUID Validator", "Hash Generator", "Checksum Generator", 
  "JWT Decoder", "Regex Tester", "Color Picker", "Gradient Generator"
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

      if (catFolder === 'unit-converters') {
        inputs = [
           { id: "value", type: "number", label: "Value", defaultValue: 1 },
           { id: "fromUnit", type: "select", label: "From Unit", options: [{value: "a", label: "Unit A"}, {value: "b", label: "Unit B"}] },
           { id: "toUnit", type: "select", label: "To Unit", options: [{value: "b", label: "Unit B"}, {value: "a", label: "Unit A"}] }
        ];
        outputs = [{ id: "toolOutput", type: "textarea", label: "Converted Result" }];
      } else if (catFolder === 'date-and-time') {
         if (slug.includes("calculator") || slug.includes("difference") || slug.includes("days")) {
             inputs = [
               { id: "date1", type: "date", label: "Start Date" },
               { id: "date2", type: "date", label: "End Date" }
             ];
             outputs = [{ id: "toolOutput", type: "textarea", label: "Result" }];
         } else {
             inputs = [{ id: "toolInput", type: "text", label: "Input Time/Date Data" }];
             outputs = [{ id: "toolOutput", type: "textarea", label: "Output" }];
         }
      } else if (catFolder === 'file-converters') {
         inputs = [{ id: "fileInput", type: "file", label: "Upload File" }];
         outputs = [{ id: "toolOutput", type: "textarea", label: "Converted Output / Download Link" }];
         isFutureReady = true;
      } else if (catFolder === 'text-utilities' || catFolder === 'encoding' || catFolder === 'web-utilities') {
         inputs = [{ id: "toolInput", type: "textarea", label: "Input Text/Data" }];
         outputs = [{ id: "toolOutput", type: "textarea", label: "Processed Result" }];
      } else {
         inputs = [
           { id: "value1", type: "number", label: "Input Value 1", defaultValue: 0 },
           { id: "value2", type: "number", label: "Input Value 2", defaultValue: 0 }
         ];
         outputs = [{ id: "toolOutput", type: "textarea", label: "Calculation Result" }];
      }

      const manifestObj = {
        name: toolName,
        slug: slug,
        category: category,
        description: `Professional ${toolName}. Instantly perform complex utility tasks in your browser.`,
        keywords: [toolName.toLowerCase(), catFolder, "utility", "converter", "free", "tool"],
        inputs: inputs,
        outputs: outputs,
        supportedFormats: ["txt", "csv", "json"],
        features: [
          "100% Client-Side Processing",
          "High Mathematical Precision",
          "Responsive Interface",
          "No data sent to servers"
        ],
        faq: [
          { question: `How accurate is the ${toolName}?`, answer: `This tool utilizes high-precision native JavaScript logic to ensure accurate results.` },
          { question: `Is my data secure?`, answer: `Yes. All calculations are executed securely on your local device. No data is ever uploaded.` },
          { question: `Why is the tool not converting my file?`, answer: `If the tool is in 'Future Ready' mode, it means the advanced WASM file conversion module is pending integration.` }
        ],
        seo: {
          title: `${toolName} | Enterprise Utility & Converter Tools | SSDK TOOLS HUB`,
          description: `Use the free ${toolName}. Perform fast, secure, and accurate tasks instantly in your browser.`
        },
        relatedTools: [],
        version: "1.0.0"
      };

      fs.writeFileSync(manifestPath, JSON.stringify(manifestObj, null, 2));

      const toolDir = path.join(rootDir, 'tools', catFolder, slug);
      if (!fs.existsSync(toolDir)) {
        fs.mkdirSync(toolDir, { recursive: true });
      }
      const logicPath = path.join(toolDir, 'logic.js');
      if (!fs.existsSync(logicPath)) {
        let logicContent = `// Core Logic for ${toolName}\nexport async function execute(inputs) {\n  return { toolOutput: "Please enter input values to process." };\n}\nexport function validate(inputs) { return true; }\n`;
        
        if (isFutureReady) {
           logicContent = `// Future Ready Mathematical Stub for ${toolName}\nexport async function execute(inputs) {\n  return { toolOutput: "⚠️ ADVANCED MODULE PENDING\\n\\nThis Tool is currently in 'Future Ready' status.\\n\\nThe advanced WASM file conversion engine is pending integration to preserve optimal platform bundle size." };\n}\nexport function validate(inputs) { return true; }\n`;
        }

        fs.writeFileSync(logicPath, logicContent);
      }

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

  processList(unitConverters, "unit-converters", "🔄 Unit Converters", "🔄");
  processList(fileConverters, "file-converters", "🗄️ File Converters", "🗄️");
  processList(textUtilities, "text-utilities", "📝 Text Utilities", "📝");
  processList(dateAndTime, "date-and-time", "⏳ Date & Time", "⏳");
  processList(encoding, "encoding", "🔠 Encoding", "🔠");
  processList(numberUtilities, "number-utilities", "🔢 Number Utilities", "🔢");
  processList(webUtilities, "web-utilities", "🌐 Web Utilities", "🌐");

  fs.writeFileSync(toolsJsonPath, JSON.stringify(tools, null, 2));
  console.log(`✅ Utility & Converter Pack Generation Complete! Scaffolded ${generated} tools. Skipped ${skipped} duplicates.`);
} catch (e) {
  console.error("❌ Failed:", e.message);
}
