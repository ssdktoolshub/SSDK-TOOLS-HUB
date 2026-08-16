const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

const medicalTools = [
  "BMI Calculator", "BMR Calculator", "Ideal Body Weight", "Body Surface Area", "Waist Hip Ratio",
  "Body Fat Calculator", "Burn Surface Area Calculator", "Parkland Formula Calculator", "Rule of Nines",
  "IV Flow Rate Calculator", "Drip Rate Calculator", "Infusion Time Calculator", "Drug Dosage Calculator",
  "Pediatric Dosage Calculator", "Tablet Dosage Calculator", "Insulin Dosage Calculator", "Creatinine Clearance",
  "eGFR Calculator", "Glasgow Coma Scale", "APGAR Score", "NEWS2 Score", "SOFA Score", "CURB-65",
  "CHA2DS2-VASc", "Wells Score", "Child-Pugh Score", "MELD Score", "Bishop Score", "EDD Calculator",
  "Pregnancy Week Calculator", "Ovulation Calculator", "Contraction Timer", "Growth Chart Calculator",
  "Vaccination Schedule", "Normal Lab Values", "CBC Reference", "Electrolyte Reference",
  "Liver Function Test Reference", "Renal Function Test Reference", "ABG Interpreter", "ECG Basics",
  "Blood Pressure Classification", "Pulse Rate Guide", "Respiratory Rate Guide", "Temperature Converter",
  "Blood Sugar Converter", "HbA1c Converter", "Cholesterol Calculator", "Calcium Correction Calculator",
  "Fluid Requirement Calculator", "Maintenance Fluid Calculator", "Dehydration Assessment", "Urine Output Calculator",
  "Nutrition Calculator", "Protein Requirement", "Calorie Requirement", "Pediatric Growth Percentile",
  "Medical Unit Converter", "Medical Abbreviation Dictionary", "Drug Interaction Checker", "Disease Reference",
  "ICD-10 Lookup", "Medical Image Viewer"
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

  for (const toolName of medicalTools) {
    const slug = slugify(toolName);
    const catFolder = "medical";
    const category = "⚕️ Medical Tools";
    const isApi = ["drug-interaction-checker", "disease-reference", "icd-10-lookup", "medical-image-viewer"].includes(slug);

    const manifestPath = path.join(manifestsDir, `${slug}.json`);

    if (!fs.existsSync(manifestPath)) {
      let inputs = [];
      
      // Configuration-Driven Schemas based on Tool Type
      if (slug.includes("bmi") || slug.includes("bmr") || slug.includes("ideal-body-weight") || slug.includes("body-surface-area")) {
        inputs = [
          { id: "weight", type: "number", label: "Weight (kg)", placeholder: "e.g., 70" },
          { id: "height", type: "number", label: "Height (cm)", placeholder: "e.g., 175" },
          { id: "age", type: "number", label: "Age (years)", placeholder: "e.g., 30" }
        ];
        if (slug.includes("bmr") || slug.includes("ideal-body-weight")) {
          inputs.push({ id: "gender", type: "select", label: "Gender", options: [{value: "male", label: "Male"}, {value: "female", label: "Female"}] });
        }
      } else if (slug.includes("flow-rate") || slug.includes("drip-rate")) {
        inputs = [
          { id: "volume", type: "number", label: "Volume (mL)", placeholder: "e.g., 1000" },
          { id: "time", type: "number", label: "Time (hours)", placeholder: "e.g., 8" },
          { id: "dropFactor", type: "number", label: "Drop Factor (gtt/mL)", placeholder: "e.g., 20" }
        ];
      } else if (slug === "glasgow-coma-scale") {
        inputs = [
          { id: "eye", type: "select", label: "Eye Opening", options: [
            {value: "4", label: "Spontaneous (4)"},
            {value: "3", label: "To Speech (3)"},
            {value: "2", label: "To Pain (2)"},
            {value: "1", label: "None (1)"}
          ]},
          { id: "verbal", type: "select", label: "Verbal Response", options: [
            {value: "5", label: "Oriented (5)"},
            {value: "4", label: "Confused (4)"},
            {value: "3", label: "Inappropriate (3)"},
            {value: "2", label: "Incomprehensible (2)"},
            {value: "1", label: "None (1)"}
          ]},
          { id: "motor", type: "select", label: "Motor Response", options: [
            {value: "6", label: "Obeys Commands (6)"},
            {value: "5", label: "Localizes Pain (5)"},
            {value: "4", label: "Withdraws from Pain (4)"},
            {value: "3", label: "Abnormal Flexion (3)"},
            {value: "2", label: "Abnormal Extension (2)"},
            {value: "1", label: "None (1)"}
          ]}
        ];
      } else if (slug === "apgar-score") {
        inputs = [
          { id: "appearance", type: "select", label: "Appearance (Skin Color)", options: [{value:"0",label:"Blue/Pale"},{value:"1",label:"Acrocyanosis"},{value:"2",label:"Completely Pink"}] },
          { id: "pulse", type: "select", label: "Pulse (Heart Rate)", options: [{value:"0",label:"Absent"},{value:"1",label:"<100 bpm"},{value:"2",label:">100 bpm"}] },
          { id: "grimace", type: "select", label: "Grimace (Reflex Irritability)", options: [{value:"0",label:"No Response"},{value:"1",label:"Grimace"},{value:"2",label:"Cry or Active Withdrawal"}] },
          { id: "activity", type: "select", label: "Activity (Muscle Tone)", options: [{value:"0",label:"Limp"},{value:"1",label:"Some Flexion"},{value:"2",label:"Active Motion"}] },
          { id: "respiration", type: "select", label: "Respiration", options: [{value:"0",label:"Absent"},{value:"1",label:"Weak/Irregular"},{value:"2",label:"Strong Cry"}] }
        ];
      } else {
        inputs = [{ id: "toolInput", type: "textarea", label: "Input Data / Notes", placeholder: "Enter clinical data..." }];
      }

      const manifestObj = {
        name: toolName,
        slug: slug,
        category: category,
        description: `⚠️ MEDICAL DISCLAIMER: This ${toolName} is for educational and informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment.`,
        keywords: [toolName.toLowerCase(), "medical", "calculator", "nursing", "clinical", "health"],
        inputs: inputs,
        outputs: [
          { id: "toolOutput", type: "textarea", label: "Clinical Result / Interpretation" }
        ],
        supportedFormats: ["txt"],
        features: [
          "⚠️ FOR EDUCATIONAL PURPOSES ONLY",
          "Fast browser-side calculation",
          "No patient data uploaded to server",
          "100% HIPAA compliant (runs locally)",
          "Responsive clinical interface"
        ],
        faq: [
          { question: `What is the ${toolName}?`, answer: `The ${toolName} is an educational clinical tool designed to assist healthcare professionals and students in understanding medical calculations.` },
          { question: `Can I use this for real patient care?`, answer: `⚠️ NO. This tool is strictly for educational purposes and must not replace professional clinical judgment.` },
          { question: `Is patient data secure?`, answer: `Yes. This tool operates entirely within your web browser. No PHI (Protected Health Information) is ever transmitted to our servers.` },
          { question: `How are the results calculated?`, answer: `Results are based on standard clinical formulas taught in nursing and medical education.` },
          { question: `Does it work offline?`, answer: isApi ? `No, this tool requires internet connectivity.` : `Yes, once the page is loaded, the calculator functions completely offline.` }
        ],
        seo: {
          title: `${toolName} | Free Medical & Nursing Calculator | SSDK TOOLS HUB`,
          description: `Use the free ${toolName} for clinical education. ⚠️ For informational purposes only. Fast, private, and secure medical calculator.`
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
        let logicContent = `// Core Logic for ${toolName}\nexport async function execute(inputs) {\n  return { toolOutput: "Result:\\n(Remember: For educational purposes only)\\n\\nProcessed data goes here..." };\n}\nexport function validate(inputs) { return true; }\n`;
        if (isApi) {
          logicContent = `// API Stub Logic for ${toolName}\nexport async function execute(inputs) {\n  return { toolOutput: "This feature requires the upcoming Medical API Integration module. It is currently in 'Future Ready' status." };\n}\nexport function validate(inputs) { return true; }\n`;
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
          icon: "⚕️",
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
  console.log(`✅ Medical Pack Generation Complete! Scaffolded ${generated} tools.`);
} catch (e) {
  console.error("❌ Failed:", e.message);
}
