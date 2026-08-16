export async function execute(inputs = {}) {
  const tc = parseFloat(inputs.tc || inputs.cholesterol || inputs.totalCholesterol || 200);
  const hdl = parseFloat(inputs.hdl || 50);
  const nonHdl = Math.round(tc - hdl);
  let interp = nonHdl < 130 ? "Optimal (< 130 mg/dL)" : (nonHdl < 160 ? "Borderline High (130-159 mg/dL)" : "High (≥ 160 mg/dL)");
  return { toolOutput: `Non-HDL Cholesterol: ${nonHdl} mg/dL\nInterpretation: ${interp}\nFormula: Total Cholesterol (${tc}) - HDL (${hdl})` };
}
export function validate(inputs) { return true; }
