export async function execute(inputs = {}) {
  const tc = parseFloat(inputs.tc || inputs.cholesterol || inputs.totalCholesterol || 200);
  const hdl = parseFloat(inputs.hdl || 50);
  const tg = parseFloat(inputs.triglycerides || inputs.tg || 150);

  if (tg > 400) {
    return { toolOutput: `Calculated LDL (Friedewald): Inaccurate when Triglycerides > 400 mg/dL (TG = ${tg} mg/dL). Direct LDL measurement recommended.` };
  }

  const ldl = Math.round(tc - hdl - (tg / 5));
  let interp = "Optimal (< 100 mg/dL)";
  if (ldl >= 190) interp = "Very High (≥ 190 mg/dL)";
  else if (ldl >= 160) interp = "High (160 - 189 mg/dL)";
  else if (ldl >= 130) interp = "Borderline High (130 - 159 mg/dL)";
  else if (ldl >= 100) interp = "Near Optimal (100 - 129 mg/dL)";

  return { toolOutput: `Calculated LDL Cholesterol (Friedewald): ${ldl} mg/dL\nClassification: ${interp}\nTotal Cholesterol: ${tc} mg/dL | HDL: ${hdl} mg/dL | Triglycerides: ${tg} mg/dL` };
}
export function validate(inputs) { return true; }
