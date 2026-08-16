// Core Logic for Fasting Insulin Analyzer
export async function execute(inputs) {
  const val = parseFloat(inputs.inputData);
  if (isNaN(val)) return { outputData: "Invalid input. Please enter a valid number (mcU/mL)." };
  let status, explanation;
  if (val < 2.6) { status = "Low"; explanation = "Decreased fasting insulin. May be seen in Type 1 Diabetes or hypoinsulinemia."; }
  else if (val <= 24.9) { status = "Normal"; explanation = "Fasting insulin is within normal limits (2.6 - 24.9 mcU/mL)."; }
  else { status = "Elevated"; explanation = "Elevated fasting insulin. May indicate insulin resistance, Type 2 Diabetes, or metabolic syndrome."; }
  return { outputData: `Fasting Insulin: ${val} mcU/mL\nStatus: ${status}\nInterpretation: ${explanation}` };
}
export function validate(inputs) {
  return inputs && inputs.inputData && inputs.inputData.trim() !== "";
}
