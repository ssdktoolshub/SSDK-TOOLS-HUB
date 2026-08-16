const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools');

const implementations = {
  "unit-converters/length-converter": `
export async function execute(inputs) {
  const val = parseFloat(inputs.value) || 0;
  const from = inputs.fromUnit || 'a';
  const to = inputs.toUnit || 'b';
  
  // Basic mock logic for now, expanding via manifest options
  let result = val;
  if (from === 'a' && to === 'b') result = val * 100;
  if (from === 'b' && to === 'a') result = val / 100;
  
  return { toolOutput: \`Converted Value: \${result}\` };
}
export function validate(inputs) { return true; }
`,
  "unit-converters/weight-converter": `
export async function execute(inputs) {
  const val = parseFloat(inputs.value) || 0;
  const from = inputs.fromUnit || 'a';
  const to = inputs.toUnit || 'b';
  
  // Basic mock logic
  let result = val;
  if (from === 'a' && to === 'b') result = val * 1000;
  if (from === 'b' && to === 'a') result = val / 1000;
  
  return { toolOutput: \`Converted Value: \${result}\` };
}
export function validate(inputs) { return true; }
`,
  "unit-converters/temperature-converter": `
export async function execute(inputs) {
  const val = parseFloat(inputs.value) || 0;
  const from = inputs.fromUnit || 'a';
  const to = inputs.toUnit || 'b';
  
  // Basic mock logic
  let result = val;
  if (from === 'a' && to === 'b') result = (val * 9/5) + 32;
  if (from === 'b' && to === 'a') result = (val - 32) * 5/9;
  
  return { toolOutput: \`Converted Value: \${result.toFixed(2)}\` };
}
export function validate(inputs) { return true; }
`,
  "date-and-time/age-calculator": `
export async function execute(inputs) {
  if (!inputs.date1 || !inputs.date2) return { toolOutput: "Please enter both dates." };
  
  const d1 = new Date(inputs.date1);
  const d2 = new Date(inputs.date2);
  
  if (isNaN(d1) || isNaN(d2)) return { toolOutput: "Invalid date format." };
  
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffYears = Math.floor(diffDays / 365.25);
  
  return { toolOutput: \`Age / Difference:\\n\${diffYears} Years\\n\${diffDays} Total Days\` };
}
export function validate(inputs) { return true; }
`
};

Object.keys(implementations).forEach(relPath => {
  const p = path.join(toolsPath, relPath, 'logic.js');
  if (fs.existsSync(path.join(toolsPath, relPath))) {
    fs.writeFileSync(p, implementations[relPath].trim());
    console.log("Wrote " + p);
  }
});
