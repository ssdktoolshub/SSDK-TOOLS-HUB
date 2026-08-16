const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/medical');

const implementations = {
  "bmi-calculator": `
export async function execute(inputs) {
  const w = parseFloat(inputs.weight);
  const h = parseFloat(inputs.height) / 100; // cm to m
  
  if (!w || !h || isNaN(w) || isNaN(h)) return { toolOutput: "Please enter valid weight and height." };

  const bmi = (w / (h * h)).toFixed(1);
  let status = "";
  if (bmi < 18.5) status = "Underweight";
  else if (bmi < 25) status = "Normal weight";
  else if (bmi < 30) status = "Overweight";
  else status = "Obese";

  return { toolOutput: \`Result:\\n(Remember: For educational purposes only)\\n\\nBMI: \${bmi} kg/m²\\nStatus: \${status}\` };
}
export function validate(inputs) { return true; }
`,
  "bmr-calculator": `
export async function execute(inputs) {
  const w = parseFloat(inputs.weight);
  const h = parseFloat(inputs.height);
  const age = parseFloat(inputs.age);
  const gender = inputs.gender;
  
  if (!w || !h || !age || !gender || isNaN(w) || isNaN(h) || isNaN(age)) return { toolOutput: "Please enter valid weight, height, age, and gender." };

  // Mifflin-St Jeor Equation
  let bmr = (10 * w) + (6.25 * h) - (5 * age);
  if (gender === "male") bmr += 5;
  else bmr -= 161;

  return { toolOutput: \`Result:\\n(Remember: For educational purposes only)\\n\\nBMR: \${bmr.toFixed(0)} kcal/day\\n\\nInterpretation:\\nThis represents the number of calories required to keep your body functioning at rest.\` };
}
export function validate(inputs) { return true; }
`,
  "ideal-body-weight": `
export async function execute(inputs) {
  const h = parseFloat(inputs.height);
  const gender = inputs.gender;
  
  if (!h || !gender || isNaN(h)) return { toolOutput: "Please enter valid height and gender." };

  // Devine Formula (requires height in inches for calculation, but we take cm)
  const inchesOver5Ft = (h * 0.393701) - 60;
  
  let ibw = 0;
  if (inchesOver5Ft <= 0) {
     ibw = gender === "male" ? 50 : 45.5; // Base weight for 5ft or under
  } else {
     if (gender === "male") {
        ibw = 50 + (2.3 * inchesOver5Ft);
     } else {
        ibw = 45.5 + (2.3 * inchesOver5Ft);
     }
  }

  return { toolOutput: \`Result:\\n(Remember: For educational purposes only)\\n\\nIdeal Body Weight (Devine formula): \${ibw.toFixed(1)} kg\` };
}
export function validate(inputs) { return true; }
`,
  "body-surface-area": `
export async function execute(inputs) {
  const w = parseFloat(inputs.weight);
  const h = parseFloat(inputs.height);
  
  if (!w || !h || isNaN(w) || isNaN(h)) return { toolOutput: "Please enter valid weight and height." };

  // Mosteller formula
  const bsa = Math.sqrt((w * h) / 3600);

  return { toolOutput: \`Result:\\n(Remember: For educational purposes only)\\n\\nBody Surface Area (Mosteller): \${bsa.toFixed(2)} m²\` };
}
export function validate(inputs) { return true; }
`
};

Object.keys(implementations).forEach(slug => {
  const p = path.join(toolsPath, slug, 'logic.js');
  if (fs.existsSync(path.join(toolsPath, slug))) {
    fs.writeFileSync(p, implementations[slug].trim());
    console.log("Wrote " + p);
  }
});
