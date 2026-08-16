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
  
  return { toolOutput: `Mean Corpuscular Hemoglobin Concentration (MCHC): ${mchc} g/dL\nInterpretation: ${status}\nReference Range: 32.0 - 36.0 g/dL` };
}
export function validate(inputs) { return true; }
