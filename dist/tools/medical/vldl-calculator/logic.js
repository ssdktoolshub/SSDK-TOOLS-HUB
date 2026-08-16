export async function execute(inputs = {}) {
  const tg = parseFloat(inputs.triglycerides || inputs.tg || inputs.toolInput || 150);
  if (!tg || tg < 0) return { toolOutput: "Please enter a valid Triglyceride level (mg/dL)." };
  const vldl = Math.round(tg / 5);
  return { toolOutput: `Calculated VLDL Cholesterol: ${vldl} mg/dL\nReference Range: 2 - 30 mg/dL\nFormula: Triglycerides / 5` };
}
export function validate(inputs) { return true; }
