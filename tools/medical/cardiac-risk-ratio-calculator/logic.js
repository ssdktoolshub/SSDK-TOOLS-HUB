export async function execute(inputs = {}) {
  const tc = parseFloat(inputs.tc || inputs.cholesterol || 200);
  const hdl = parseFloat(inputs.hdl || 50);
  if (!hdl || hdl <= 0) return { toolOutput: "HDL must be greater than 0." };
  const ratio = (tc / hdl).toFixed(2);
  let risk = "Standard Risk (< 4.5 for women, < 5.0 for men)";
  if (ratio > 5.0) risk = "Elevated Cardiovascular Risk (> 5.0)";
  else if (ratio < 3.5) risk = "Optimal Cardiovascular Protection (< 3.5)";
  return { toolOutput: `Cholesterol / HDL Ratio (Cardiac Risk): ${ratio}\nAssessment: ${risk}\nTotal Cholesterol: ${tc} mg/dL | HDL: ${hdl} mg/dL` };
}
export function validate(inputs) { return true; }
