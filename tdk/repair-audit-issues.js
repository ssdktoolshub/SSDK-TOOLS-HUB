const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');

function writeFile(relPath, content) {
  const fullPath = path.join(toolsDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

console.log("Starting targeted repair of confirmed tool issues...");

// 1. SECURITY TOOLS
writeFile('security/password-generator/logic.js', `
export async function execute(inputs = {}) {
  const length = Math.max(4, Math.min(128, parseInt(inputs.length || inputs.value || 16)));
  const complexity = inputs.options || inputs.complexity || "complex";
  
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  if (complexity === "complex" || complexity === "all") charset += "!@#$%^&*()_+~|}{[]:;?><,./-=";
  if (complexity === "hex") charset = "0123456789ABCDEF";
  if (complexity === "alphanumeric") charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let result = "";
  const cryptoObj = typeof globalThis !== 'undefined' && globalThis.crypto ? globalThis.crypto : (typeof window !== 'undefined' ? window.crypto : null);
  if (cryptoObj && cryptoObj.getRandomValues) {
    const array = new Uint32Array(length);
    cryptoObj.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }

  return { toolOutput: result };
}
export function validate(inputs) { return true; }
`);

writeFile('security/random-string-generator/logic.js', `
export async function execute(inputs = {}) {
  const length = Math.max(1, Math.min(1024, parseInt(inputs.length || inputs.value || 32)));
  const charset = inputs.charset || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
  let result = "";
  const cryptoObj = typeof globalThis !== 'undefined' && globalThis.crypto ? globalThis.crypto : (typeof window !== 'undefined' ? window.crypto : null);
  if (cryptoObj && cryptoObj.getRandomValues) {
    const array = new Uint32Array(length);
    cryptoObj.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }

  return { toolOutput: result };
}
export function validate(inputs) { return true; }
`);

// 2. DEVELOPER TOOLS
writeFile('developer/json-formatter/logic.js', `
export async function execute(inputs = {}) {
  const text = inputs.toolInput || inputs.json || inputs.input || inputs.text || "";
  if (!text.trim()) {
    return { toolOutput: "{\\n  \\"example\\": \\"Enter valid JSON to format\\"\\n}" };
  }
  try {
    const parsed = JSON.parse(text);
    const indent = parseInt(inputs.indent) || 2;
    return { toolOutput: JSON.stringify(parsed, null, indent) };
  } catch (err) {
    return { toolOutput: "Invalid JSON: " + err.message };
  }
}
export function validate(inputs) { return true; }
`);

writeFile('developer/json-minifier/logic.js', `
export async function execute(inputs = {}) {
  const text = inputs.toolInput || inputs.json || inputs.input || inputs.text || "";
  if (!text.trim()) {
    return { toolOutput: '{"example":"Enter valid JSON to minify"}' };
  }
  try {
    const parsed = JSON.parse(text);
    return { toolOutput: JSON.stringify(parsed) };
  } catch (err) {
    return { toolOutput: "Invalid JSON: " + err.message };
  }
}
export function validate(inputs) { return true; }
`);

writeFile('developer/base64-decode/logic.js', `
export async function execute(inputs = {}) {
  const text = inputs.toolInput || inputs.base64 || inputs.input || inputs.text || "";
  if (!text.trim()) {
    return { toolOutput: "Please enter Base64 encoded text to decode." };
  }
  try {
    if (typeof Buffer !== 'undefined') {
      const decoded = Buffer.from(text.trim(), 'base64').toString('utf8');
      return { toolOutput: decoded };
    } else {
      const decoded = decodeURIComponent(escape(atob(text.trim())));
      return { toolOutput: decoded };
    }
  } catch (err) {
    return { toolOutput: "Decoding error: Invalid Base64 string (" + err.message + ")" };
  }
}
export function validate(inputs) { return true; }
`);

writeFile('developer/jwt-decoder/logic.js', `
export async function execute(inputs = {}) {
  const token = (inputs.toolInput || inputs.jwt || inputs.input || inputs.text || "").trim();
  if (!token) {
    return { toolOutput: "Please provide a valid JWT token." };
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { toolOutput: "Invalid JWT format: A valid JWT must contain Header, Payload, and Signature separated by dots." };
  }
  try {
    const decodePart = (str) => {
      const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      if (typeof Buffer !== 'undefined') {
        return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
      } else {
        return JSON.parse(decodeURIComponent(escape(atob(b64))));
      }
    };
    const header = decodePart(parts[0]);
    const payload = decodePart(parts[1]);
    return {
      toolOutput: JSON.stringify({ Header: header, Payload: payload, Signature: parts[2] }, null, 2)
    };
  } catch (err) {
    return { toolOutput: "JWT Parsing Error: " + err.message };
  }
}
export function validate(inputs) { return true; }
`);

// 3. MEDICAL & CLINICAL TOOLS
writeFile('medical/mcv-calculator/logic.js', `
export async function execute(inputs = {}) {
  const hct = parseFloat(inputs.hematocrit || inputs.hct || (typeof inputs.toolInput === 'string' ? inputs.toolInput.split(',')[0] : null) || 45);
  const rbc = parseFloat(inputs.rbc || (typeof inputs.toolInput === 'string' ? inputs.toolInput.split(',')[1] : null) || 5.0);
  
  if (!hct || !rbc || rbc <= 0) {
    return { toolOutput: "Please provide valid numerical values for Hematocrit (%) and RBC count (million/µL)." };
  }
  
  const mcv = ((hct * 10) / rbc).toFixed(1);
  let status = "Normocytic (80 - 100 fL)";
  if (mcv < 80) status = "Microcytic (< 80 fL) - Consider Iron Deficiency / Thalassemia";
  if (mcv > 100) status = "Macrocytic (> 100 fL) - Consider Vitamin B12 / Folate deficiency";
  
  return { toolOutput: \`Mean Corpuscular Volume (MCV): \${mcv} fL\\nInterpretation: \${status}\\nReference Range: 80.0 - 100.0 fL\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/mch-calculator/logic.js', `
export async function execute(inputs = {}) {
  const hb = parseFloat(inputs.hemoglobin || inputs.hb || (typeof inputs.toolInput === 'string' ? inputs.toolInput.split(',')[0] : null) || 15.0);
  const rbc = parseFloat(inputs.rbc || (typeof inputs.toolInput === 'string' ? inputs.toolInput.split(',')[1] : null) || 5.0);
  
  if (!hb || !rbc || rbc <= 0) {
    return { toolOutput: "Please provide valid numerical values for Hemoglobin (g/dL) and RBC count (million/µL)." };
  }
  
  const mch = ((hb * 10) / rbc).toFixed(1);
  let status = "Normochromic (27 - 33 pg)";
  if (mch < 27) status = "Hypochromic (< 27 pg)";
  if (mch > 33) status = "Hyperchromic (> 33 pg)";
  
  return { toolOutput: \`Mean Corpuscular Hemoglobin (MCH): \${mch} pg\\nInterpretation: \${status}\\nReference Range: 27.0 - 33.0 pg\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/mchc-calculator/logic.js', `
export async function execute(inputs = {}) {
  const hb = parseFloat(inputs.hemoglobin || inputs.hb || (typeof inputs.toolInput === 'string' ? inputs.toolInput.split(',')[0] : null) || 15.0);
  const hct = parseFloat(inputs.hematocrit || inputs.hct || (typeof inputs.toolInput === 'string' ? inputs.toolInput.split(',')[1] : null) || 45.0);
  
  if (!hb || !hct || hct <= 0) {
    return { toolOutput: "Please provide valid numerical values for Hemoglobin (g/dL) and Hematocrit (%)." };
  }
  
  const mchc = ((hb * 100) / hct).toFixed(1);
  let status = "Normal (32 - 36 g/dL)";
  if (mchc < 32) status = "Hypochromic (< 32 g/dL)";
  if (mchc > 36) status = "Hyperchromic / Spherocytosis (> 36 g/dL)";
  
  return { toolOutput: \`Mean Corpuscular Hemoglobin Concentration (MCHC): \${mchc} g/dL\\nInterpretation: \${status}\\nReference Range: 32.0 - 36.0 g/dL\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/differential-wbc-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const neut = parseFloat(inputs.neutrophils || inputs.neut || 60);
  const lymph = parseFloat(inputs.lymphocytes || inputs.lymph || 30);
  const mono = parseFloat(inputs.monocytes || inputs.mono || 6);
  const eos = parseFloat(inputs.eosinophils || inputs.eos || 3);
  const baso = parseFloat(inputs.basophils || inputs.baso || 1);

  const total = neut + lymph + mono + eos + baso;
  const result = \`Differential WBC Count:\\n- Neutrophils: \${neut}% (Normal: 40-75%)\\n- Lymphocytes: \${lymph}% (Normal: 20-45%)\\n- Monocytes: \${mono}% (Normal: 2-10%)\\n- Eosinophils: \${eos}% (Normal: 1-6%)\\n- Basophils: \${baso}% (Normal: 0-2%)\\nTotal: \${total}%\\nStatus: \${total === 100 ? 'Percentages balanced (100%)' : 'Note: Sum of percentages is ' + total + '%'}\`;
  
  return { toolOutput: result };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/anc-calculator/logic.js', `
export async function execute(inputs = {}) {
  const wbc = parseFloat(inputs.wbc || (typeof inputs.toolInput === 'string' ? inputs.toolInput.split(',')[0] : null) || 7000);
  const neut = parseFloat(inputs.neutrophils || inputs.neut || 60);
  const bands = parseFloat(inputs.bands || 0);

  if (!wbc || wbc <= 0) {
    return { toolOutput: "Please enter a valid Total WBC count (cells/µL)." };
  }

  const anc = Math.round((wbc * (neut + bands)) / 100);
  let risk = "Normal ANC (≥ 1500 /µL) - No neutropenia";
  if (anc < 500) risk = "Severe Neutropenia (< 500 /µL) - High infection risk";
  else if (anc < 1000) risk = "Moderate Neutropenia (500 - 999 /µL)";
  else if (anc < 1500) risk = "Mild Neutropenia (1000 - 1499 /µL)";

  return { toolOutput: \`Absolute Neutrophil Count (ANC): \${anc} /µL\\nInterpretation: \${risk}\\nFormula: WBC × (% Neutrophils + % Bands) / 100\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/ldl-calculator/logic.js', `
export async function execute(inputs = {}) {
  const tc = parseFloat(inputs.tc || inputs.cholesterol || inputs.totalCholesterol || 200);
  const hdl = parseFloat(inputs.hdl || 50);
  const tg = parseFloat(inputs.triglycerides || inputs.tg || 150);

  if (tg > 400) {
    return { toolOutput: \`Calculated LDL (Friedewald): Inaccurate when Triglycerides > 400 mg/dL (TG = \${tg} mg/dL). Direct LDL measurement recommended.\` };
  }

  const ldl = Math.round(tc - hdl - (tg / 5));
  let interp = "Optimal (< 100 mg/dL)";
  if (ldl >= 190) interp = "Very High (≥ 190 mg/dL)";
  else if (ldl >= 160) interp = "High (160 - 189 mg/dL)";
  else if (ldl >= 130) interp = "Borderline High (130 - 159 mg/dL)";
  else if (ldl >= 100) interp = "Near Optimal (100 - 129 mg/dL)";

  return { toolOutput: \`Calculated LDL Cholesterol (Friedewald): \${ldl} mg/dL\\nClassification: \${interp}\\nTotal Cholesterol: \${tc} mg/dL | HDL: \${hdl} mg/dL | Triglycerides: \${tg} mg/dL\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/vldl-calculator/logic.js', `
export async function execute(inputs = {}) {
  const tg = parseFloat(inputs.triglycerides || inputs.tg || inputs.toolInput || 150);
  if (!tg || tg < 0) return { toolOutput: "Please enter a valid Triglyceride level (mg/dL)." };
  const vldl = Math.round(tg / 5);
  return { toolOutput: \`Calculated VLDL Cholesterol: \${vldl} mg/dL\\nReference Range: 2 - 30 mg/dL\\nFormula: Triglycerides / 5\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/non-hdl-calculator/logic.js', `
export async function execute(inputs = {}) {
  const tc = parseFloat(inputs.tc || inputs.cholesterol || inputs.totalCholesterol || 200);
  const hdl = parseFloat(inputs.hdl || 50);
  const nonHdl = Math.round(tc - hdl);
  let interp = nonHdl < 130 ? "Optimal (< 130 mg/dL)" : (nonHdl < 160 ? "Borderline High (130-159 mg/dL)" : "High (≥ 160 mg/dL)");
  return { toolOutput: \`Non-HDL Cholesterol: \${nonHdl} mg/dL\\nInterpretation: \${interp}\\nFormula: Total Cholesterol (\${tc}) - HDL (\${hdl})\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/triglyceride-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const tg = parseFloat(inputs.triglycerides || inputs.tg || inputs.toolInput || 140);
  let interp = "Normal (< 150 mg/dL)";
  if (tg >= 500) interp = "Very High (≥ 500 mg/dL) - Risk of Pancreatitis";
  else if (tg >= 200) interp = "High (200 - 499 mg/dL)";
  else if (tg >= 150) interp = "Borderline High (150 - 199 mg/dL)";
  return { toolOutput: \`Triglyceride Level: \${tg} mg/dL\\nCategory: \${interp}\\nDesirable Range: < 150 mg/dL\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/cardiac-risk-ratio-calculator/logic.js', `
export async function execute(inputs = {}) {
  const tc = parseFloat(inputs.tc || inputs.cholesterol || 200);
  const hdl = parseFloat(inputs.hdl || 50);
  if (!hdl || hdl <= 0) return { toolOutput: "HDL must be greater than 0." };
  const ratio = (tc / hdl).toFixed(2);
  let risk = "Standard Risk (< 4.5 for women, < 5.0 for men)";
  if (ratio > 5.0) risk = "Elevated Cardiovascular Risk (> 5.0)";
  else if (ratio < 3.5) risk = "Optimal Cardiovascular Protection (< 3.5)";
  return { toolOutput: \`Cholesterol / HDL Ratio (Cardiac Risk): \${ratio}\\nAssessment: \${risk}\\nTotal Cholesterol: \${tc} mg/dL | HDL: \${hdl} mg/dL\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/lipid-profile-report-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const tc = parseFloat(inputs.cholesterol || inputs.tc || 190);
  const hdl = parseFloat(inputs.hdl || 55);
  const ldl = parseFloat(inputs.ldl || (tc - hdl - 30));
  const tg = parseFloat(inputs.triglycerides || inputs.tg || 140);
  const ratio = (tc / hdl).toFixed(2);

  return {
    toolOutput: \`=== COMPLETE LIPID PROFILE ANALYSIS ===\\n- Total Cholesterol: \${tc} mg/dL (Normal: < 200)\\n- HDL Cholesterol: \${hdl} mg/dL (Optimal: > 40 M / > 50 F)\\n- LDL Cholesterol: \${ldl} mg/dL (Optimal: < 100)\\n- Triglycerides: \${tg} mg/dL (Normal: < 150)\\n- Cholesterol/HDL Ratio: \${ratio} (Target: < 4.5)\\nStatus: \${tc < 200 && ldl < 100 && tg < 150 ? 'Desirable Lipid Profile' : 'Dyslipidemia indicators present. Consult a physician.'}\`
  };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/urine-routine-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const ph = parseFloat(inputs.ph || 6.0);
  const sg = parseFloat(inputs.specificGravity || inputs.sg || 1.015);
  const protein = inputs.protein || "Negative";
  const glucose = inputs.glucose || "Negative";
  const blood = inputs.blood || "Negative";

  return {
    toolOutput: \`=== URINALYSIS (URINE ROUTINE) REPORT ===\\n- pH: \${ph} (Normal: 4.5 - 8.0)\\n- Specific Gravity: \${sg} (Normal: 1.005 - 1.030)\\n- Protein: \${protein}\\n- Glucose: \${glucose}\\n- Blood/Hemoglobin: \${blood}\\nInterpretation: Normal routine parameters.\`
  };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/urine-ph-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const ph = parseFloat(inputs.ph || inputs.toolInput || inputs.value || 6.5);
  let status = "Normal (4.5 - 8.0)";
  if (ph < 4.5) status = "Acidic (< 4.5) - Consider metabolic acidosis, high protein diet";
  if (ph > 8.0) status = "Alkaline (> 8.0) - Consider UTI, vegetarian diet";
  return { toolOutput: \`Urine pH: \${ph}\\nStatus: \${status}\\nReference Range: 4.5 - 8.0 (Average: 5.5 - 6.5)\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/specific-gravity-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const sg = parseFloat(inputs.specificGravity || inputs.sg || inputs.toolInput || 1.015);
  let status = "Normal Urine Concentration (1.005 - 1.030)";
  if (sg < 1.005) status = "Low Specific Gravity (Dilute) - High fluid intake / Diabetes Insipidus";
  if (sg > 1.030) status = "High Specific Gravity (Concentrated) - Dehydration / Glucosuria";
  return { toolOutput: \`Urine Specific Gravity: \${sg}\\nInterpretation: \${status}\\nReference Range: 1.005 - 1.030\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/urine-glucose-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const val = String(inputs.glucose || inputs.toolInput || "Negative").trim();
  const isPos = !val.toLowerCase().includes("neg") && val !== "0";
  return { toolOutput: \`Urine Glucose Test Result: \${val}\\nInterpretation: \${isPos ? 'Glucosuria Detected (Abnormal) - Check blood glucose for diabetes mellitus' : 'Normal (Negative - No glucose detected)'}\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/urine-ketone-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const val = String(inputs.ketones || inputs.toolInput || "Negative").trim();
  const isPos = !val.toLowerCase().includes("neg") && val !== "0";
  return { toolOutput: \`Urine Ketones Result: \${val}\\nInterpretation: \${isPos ? 'Ketonuria Present (Positive) - Consider Diabetic Ketoacidosis (DKA), prolonged fasting, or ketogenic diet' : 'Normal (Negative - No ketones detected)'}\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/urine-bilirubin-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const val = String(inputs.bilirubin || inputs.toolInput || "Negative").trim();
  const isPos = !val.toLowerCase().includes("neg") && val !== "0";
  return { toolOutput: \`Urine Bilirubin Result: \${val}\\nInterpretation: \${isPos ? 'Positive (Abnormal) - Suggests conjugated hyperbilirubinemia / biliary obstruction or liver disease' : 'Normal (Negative)'}\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/urine-urobilinogen-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const val = parseFloat(inputs.urobilinogen || inputs.toolInput || 0.2);
  let interp = "Normal (< 1.0 mg/dL / < 17 µmol/L)";
  if (val > 1.0) interp = "Elevated - Consider hemolytic jaundice or hepatocellular damage";
  return { toolOutput: \`Urine Urobilinogen: \${val} mg/dL\\nInterpretation: \${interp}\\nReference Range: 0.1 - 1.0 mg/dL\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/urine-nitrite-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const val = String(inputs.nitrite || inputs.toolInput || "Negative").trim();
  const isPos = !val.toLowerCase().includes("neg") && val !== "0";
  return { toolOutput: \`Urine Nitrite Test: \${val}\\nInterpretation: \${isPos ? 'Positive - Indicates presence of nitrate-reducing bacteria (e.g. E. coli), suggestive of UTI' : 'Negative - No significant bacteriuria detected'}\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/urine-leukocyte-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const val = String(inputs.leukocytes || inputs.toolInput || "Negative").trim();
  const isPos = !val.toLowerCase().includes("neg") && val !== "0";
  return { toolOutput: \`Urine Leukocyte Esterase: \${val}\\nInterpretation: \${isPos ? 'Positive - Pyuria indicated, suggestive of Urinary Tract Infection or inflammation' : 'Negative - Normal white cell activity'}\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/free-t3-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const ft3 = parseFloat(inputs.free_t3 || inputs.ft3 || inputs.toolInput || 3.0);
  let status = "Normal (2.3 - 4.2 pg/mL)";
  if (ft3 < 2.3) status = "Low (< 2.3 pg/mL) - Hypothyroidism or Euthyroid Sick Syndrome";
  if (ft3 > 4.2) status = "High (> 4.2 pg/mL) - Hyperthyroidism / T3 Thyrotoxicosis";
  return { toolOutput: \`Free T3 (Triiodothyronine): \${ft3} pg/mL\\nStatus: \${status}\\nReference Range: 2.3 - 4.2 pg/mL (3.5 - 6.5 pmol/L)\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/free-t4-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const ft4 = parseFloat(inputs.free_t4 || inputs.ft4 || inputs.toolInput || 1.2);
  let status = "Normal (0.8 - 1.8 ng/dL)";
  if (ft4 < 0.8) status = "Low (< 0.8 ng/dL) - Hypothyroidism";
  if (ft4 > 1.8) status = "High (> 1.8 ng/dL) - Hyperthyroidism";
  return { toolOutput: \`Free T4 (Thyroxine): \${ft4} ng/dL\\nStatus: \${status}\\nReference Range: 0.8 - 1.8 ng/dL (10 - 23 pmol/L)\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/thyroid-report-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const tsh = parseFloat(inputs.tsh || 2.1);
  const ft4 = parseFloat(inputs.ft4 || inputs.free_t4 || 1.2);
  const ft3 = parseFloat(inputs.ft3 || inputs.free_t3 || 3.0);

  let interp = "Euthyroid (Normal Thyroid Function)";
  if (tsh > 4.5 && ft4 < 0.8) interp = "Primary Overt Hypothyroidism";
  else if (tsh > 4.5 && ft4 >= 0.8) interp = "Subclinical Hypothyroidism";
  else if (tsh < 0.4 && ft4 > 1.8) interp = "Primary Overt Hyperthyroidism";
  else if (tsh < 0.4 && ft4 <= 1.8) interp = "Subclinical Hyperthyroidism";

  return {
    toolOutput: \`=== THYROID FUNCTION REPORT ANALYSIS ===\\n- TSH: \${tsh} µIU/mL (Normal: 0.4 - 4.5)\\n- Free T4: \${ft4} ng/dL (Normal: 0.8 - 1.8)\\n- Free T3: \${ft3} pg/mL (Normal: 2.3 - 4.2)\\nDiagnosis / Assessment: \${interp}\`
  };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/serum-iron-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const iron = parseFloat(inputs.iron || inputs.serumIron || inputs.toolInput || 90);
  let status = "Normal (60 - 170 µg/dL)";
  if (iron < 60) status = "Low (< 60 µg/dL) - Iron Deficiency";
  if (iron > 170) status = "High (> 170 µg/dL) - Hemochromatosis / Iron Overload";
  return { toolOutput: \`Serum Iron: \${iron} µg/dL\\nStatus: \${status}\\nReference Range: 60 - 170 µg/dL (10.7 - 30.4 µmol/L)\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/ferritin-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const ferritin = parseFloat(inputs.ferritin || inputs.toolInput || 120);
  let status = "Normal (20 - 250 ng/mL)";
  if (ferritin < 20) status = "Low (< 20 ng/mL) - Depleted Iron Stores (Iron Deficiency Anemia)";
  if (ferritin > 300) status = "High (> 300 ng/mL) - Inflammation, Infection, or Hemochromatosis";
  return { toolOutput: \`Serum Ferritin: \${ferritin} ng/mL\\nStatus: \${status}\\nReference Range: 20 - 250 ng/mL (Men: 30-300, Women: 15-200)\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/tibc-calculator/logic.js', `
export async function execute(inputs = {}) {
  const iron = parseFloat(inputs.iron || 90);
  const uibc = parseFloat(inputs.uibc || 230);
  const tibc = iron + uibc;
  let status = "Normal (240 - 450 µg/dL)";
  if (tibc > 450) status = "Elevated (> 450 µg/dL) - Classic sign of Iron Deficiency";
  if (tibc < 240) status = "Low (< 240 µg/dL) - Malnutrition or Chronic Disease";
  return { toolOutput: \`Total Iron Binding Capacity (TIBC): \${tibc} µg/dL\\nFormula: Serum Iron (\${iron}) + UIBC (\${uibc})\\nInterpretation: \${status}\\nReference Range: 240 - 450 µg/dL\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/transferrin-saturation-calculator/logic.js', `
export async function execute(inputs = {}) {
  const iron = parseFloat(inputs.iron || 90);
  const tibc = parseFloat(inputs.tibc || 320);
  if (!tibc || tibc <= 0) return { toolOutput: "TIBC must be greater than 0." };
  const sat = ((iron / tibc) * 100).toFixed(1);
  let status = "Normal (20 - 50%)";
  if (sat < 20) status = "Low (< 20%) - Iron Deficiency Anemia";
  if (sat > 50) status = "High (> 50%) - Hemochromatosis / Iron Overload";
  return { toolOutput: \`Transferrin Saturation (TSAT): \${sat}%\\nFormula: (Serum Iron / TIBC) × 100\\nStatus: \${status}\\nReference Range: 20 - 50%\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/vitamin-d-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const vitD = parseFloat(inputs.vitamin_d || inputs.vitD || inputs.toolInput || 35);
  let status = "Sufficiency (30 - 100 ng/mL)";
  if (vitD < 12) status = "Severe Deficiency (< 12 ng/mL)";
  else if (vitD < 20) status = "Deficiency (12 - 20 ng/mL)";
  else if (vitD < 30) status = "Insufficiency (20 - 29 ng/mL)";
  else if (vitD > 100) status = "Toxicity Risk (> 100 ng/mL)";
  return { toolOutput: \`25-Hydroxy Vitamin D: \${vitD} ng/mL\\nClassification: \${status}\\nTarget Range: 30 - 60 ng/mL (75 - 150 nmol/L)\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/vitamin-b12-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const b12 = parseFloat(inputs.vitamin_b12 || inputs.b12 || inputs.toolInput || 450);
  let status = "Normal (200 - 900 pg/mL)";
  if (b12 < 200) status = "Deficient (< 200 pg/mL) - Pernicious / Nutritional B12 Anemia";
  else if (b12 < 300) status = "Borderline (200 - 300 pg/mL) - Check MMA or Homocysteine";
  else if (b12 > 900) status = "Elevated (> 900 pg/mL)";
  return { toolOutput: \`Serum Vitamin B12: \${b12} pg/mL\\nInterpretation: \${status}\\nReference Range: 200 - 900 pg/mL (148 - 664 pmol/L)\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/folate-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const folate = parseFloat(inputs.folate || inputs.toolInput || 10.5);
  let status = "Normal (> 4.0 ng/mL)";
  if (folate < 2.0) status = "Deficient (< 2.0 ng/mL) - Megaloblastic anemia risk";
  else if (folate < 4.0) status = "Borderline (2.0 - 4.0 ng/mL)";
  return { toolOutput: \`Serum Folate (Vitamin B9): \${folate} ng/mL\\nStatus: \${status}\\nReference Range: 4.0 - 20.0 ng/mL (9.0 - 45.3 nmol/L)\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/troponin-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const val = parseFloat(inputs.troponin || inputs.toolInput || 0.01);
  const cutoff = 0.04;
  let status = val > cutoff ? "ELEVATED (High Risk) - Myocardial Injury / Infarction (NSTEMI/STEMI). Seek immediate emergency medical care." : "Normal / Baseline (< 0.04 ng/mL)";
  return { toolOutput: \`Cardiac Troponin-I: \${val} ng/mL\\nAssessment: \${status}\\nReference Cutoff: < 0.04 ng/mL (< 14 ng/L for hs-cTnI)\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/widal-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const oTiter = inputs.to || inputs.o || "1:80";
  const hTiter = inputs.th || inputs.h || "1:160";
  return { toolOutput: \`Widal Test Result:\\n- S. Typhi 'O' Antigen Titer: \${oTiter}\\n- S. Typhi 'H' Antigen Titer: \${hTiter}\\nInterpretation: Titer ≥ 1:160 for O and H antigens indicates acute Salmonella enterica (Typhoid fever) infection in endemic areas.\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/ana-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const titer = inputs.titer || inputs.toolInput || "1:160";
  const pattern = inputs.pattern || "Homogeneous / Speckled";
  return { toolOutput: \`Antinuclear Antibody (ANA) IFA Result:\\n- Titer: \${titer}\\n- Staining Pattern: \${pattern}\\nInterpretation: Titer ≥ 1:160 is clinically significant for systemic autoimmune diseases (e.g. SLE, Scleroderma, Sjögren's syndrome).\` };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/abg-analyzer/logic.js', `
export async function execute(inputs = {}) {
  const ph = parseFloat(inputs.ph || 7.40);
  const pco2 = parseFloat(inputs.pco2 || 40);
  const hco3 = parseFloat(inputs.hco3 || 24);
  const po2 = parseFloat(inputs.po2 || 95);

  let acidBase = "Normal Acid-Base Status";
  if (ph < 7.35) {
    if (pco2 > 45) acidBase = "Respiratory Acidosis";
    else if (hco3 < 22) acidBase = "Metabolic Acidosis";
  } else if (ph > 7.45) {
    if (pco2 < 35) acidBase = "Respiratory Alkalosis";
    else if (hco3 > 26) acidBase = "Metabolic Alkalosis";
  }

  return {
    toolOutput: \`=== ARTERIAL BLOOD GAS (ABG) INTERPRETATION ===\\n- pH: \${ph} (Normal: 7.35 - 7.45)\\n- PaCO2: \${pco2} mmHg (Normal: 35 - 45)\\n- HCO3: \${hco3} mEq/L (Normal: 22 - 26)\\n- PaO2: \${po2} mmHg (Normal: 80 - 100)\\nPrimary Diagnosis: \${acidBase}\`
  };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/gcs-calculator/logic.js', `
export async function execute(inputs = {}) {
  const eye = parseInt(inputs.eye || 4);
  const verbal = parseInt(inputs.verbal || 5);
  const motor = parseInt(inputs.motor || 6);
  const total = eye + verbal + motor;

  let severity = "Mild Head Injury / Normal (GCS 13 - 15)";
  if (total <= 8) severity = "Severe Brain Injury / Coma (GCS ≤ 8) - Airway protection required";
  else if (total <= 12) severity = "Moderate Brain Injury (GCS 9 - 12)";

  return {
    toolOutput: \`Glasgow Coma Scale (GCS) Total: \${total} / 15\\n- Eye Response (E): \${eye} / 4\\n- Verbal Response (V): \${verbal} / 5\\n- Motor Response (M): \${motor} / 6\\nSeverity Classification: \${severity}\`
  };
}
export function validate(inputs) { return true; }
`);

writeFile('medical/temperature-converter/logic.js', `
export async function execute(inputs = {}) {
  const val = parseFloat(inputs.value || inputs.toolInput || inputs.temperature || 98.6);
  const from = (inputs.from || inputs.unit || "f").toLowerCase();

  let c, f, k;
  if (from.startsWith("c")) {
    c = val;
    f = (c * 9/5) + 32;
    k = c + 273.15;
  } else if (from.startsWith("k")) {
    k = val;
    c = k - 273.15;
    f = (c * 9/5) + 32;
  } else {
    f = val;
    c = (f - 32) * 5/9;
    k = c + 273.15;
  }

  let fever = c >= 38.0 ? "Fever Present (≥ 38.0°C / 100.4°F)" : (c < 35.0 ? "Hypothermia (< 35.0°C / 95.0°F)" : "Normal Body Temperature");

  return {
    toolOutput: \`Temperature Conversion:\\n- Celsius: \${c.toFixed(2)} °C\\n- Fahrenheit: \${f.toFixed(2)} °F\\n- Kelvin: \${k.toFixed(2)} K\\nClinical Status: \${fever}\`
  };
}
export function validate(inputs) { return true; }
`);

console.log("Completed targeted repairs.");
