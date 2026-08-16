const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/medical');

const implementations = {
  "iv-flow-rate-calculator": `
export async function execute(inputs) {
  const v = parseFloat(inputs.volume);
  const t = parseFloat(inputs.time);
  
  if (!v || !t || isNaN(v) || isNaN(t)) return { toolOutput: "Please enter valid volume and time." };

  // Flow Rate (mL/hr) = Volume (mL) / Time (hr)
  const rate = v / t;

  return { toolOutput: \`Result:\\n(Remember: For educational purposes only)\\n\\nIV Flow Rate: \${rate.toFixed(1)} mL/hr\` };
}
export function validate(inputs) { return true; }
`,
  "drip-rate-calculator": `
export async function execute(inputs) {
  const v = parseFloat(inputs.volume);
  const t = parseFloat(inputs.time); // hours
  const df = parseFloat(inputs.dropFactor);
  
  if (!v || !t || !df || isNaN(v) || isNaN(t) || isNaN(df)) return { toolOutput: "Please enter valid volume, time, and drop factor." };

  // Drip Rate (gtt/min) = (Volume (mL) * Drop Factor (gtt/mL)) / Time (minutes)
  const timeInMinutes = t * 60;
  const dripRate = (v * df) / timeInMinutes;

  return { toolOutput: \`Result:\\n(Remember: For educational purposes only)\\n\\nDrip Rate: \${Math.round(dripRate)} gtt/min (drops per minute)\` };
}
export function validate(inputs) { return true; }
`,
  "infusion-time-calculator": `
export async function execute(inputs) {
  // Let's assume inputs for Infusion Time uses standard text parsing or custom since we didn't specify distinct schema for it.
  // Wait, I mapped flow-rate and drip-rate, but maybe not infusion-time specifically. 
  // If inputs.volume and inputs.rate exist:
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please provide Volume (mL) and Rate (mL/hr) e.g., '1000 125'" };
  
  const parts = text.split(/\\s+/).map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return { toolOutput: "Invalid input. Example: 1000 125" };
  
  const v = parts[0];
  const r = parts[1];
  
  const hours = v / r;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  return { toolOutput: \`Result:\\n(Remember: For educational purposes only)\\n\\nInfusion Time: \${h} hours and \${m} minutes\` };
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
