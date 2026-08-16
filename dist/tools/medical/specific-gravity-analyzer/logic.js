export async function execute(inputs = {}) {
  const sg = parseFloat(inputs.specificGravity || inputs.sg || inputs.toolInput || 1.015);
  let status = "Normal Urine Concentration (1.005 - 1.030)";
  if (sg < 1.005) status = "Low Specific Gravity (Dilute) - High fluid intake / Diabetes Insipidus";
  if (sg > 1.030) status = "High Specific Gravity (Concentrated) - Dehydration / Glucosuria";
  return { toolOutput: `Urine Specific Gravity: ${sg}\nInterpretation: ${status}\nReference Range: 1.005 - 1.030` };
}
export function validate(inputs) { return true; }
