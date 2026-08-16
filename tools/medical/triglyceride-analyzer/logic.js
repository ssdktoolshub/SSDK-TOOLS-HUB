export async function execute(inputs = {}) {
  const tg = parseFloat(inputs.triglycerides || inputs.tg || inputs.toolInput || 140);
  let interp = "Normal (< 150 mg/dL)";
  if (tg >= 500) interp = "Very High (≥ 500 mg/dL) - Risk of Pancreatitis";
  else if (tg >= 200) interp = "High (200 - 499 mg/dL)";
  else if (tg >= 150) interp = "Borderline High (150 - 199 mg/dL)";
  return { toolOutput: `Triglyceride Level: ${tg} mg/dL\nCategory: ${interp}\nDesirable Range: < 150 mg/dL` };
}
export function validate(inputs) { return true; }
