export async function execute(inputs) {
  // Let's assume inputs for Infusion Time uses standard text parsing or custom since we didn't specify distinct schema for it.
  // Wait, I mapped flow-rate and drip-rate, but maybe not infusion-time specifically. 
  // If inputs.volume and inputs.rate exist:
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please provide Volume (mL) and Rate (mL/hr) e.g., '1000 125'" };
  
  const parts = text.split(/\s+/).map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return { toolOutput: "Invalid input. Example: 1000 125" };
  
  const v = parts[0];
  const r = parts[1];
  
  const hours = v / r;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  return { toolOutput: `Result:\n(Remember: For educational purposes only)\n\nInfusion Time: ${h} hours and ${m} minutes` };
}
export function validate(inputs) { return true; }