// Core Logic for Serum Amylase Analyzer
export async function execute(inputs) {
  const val = parseFloat(inputs.inputData);
  if (isNaN(val)) return { outputData: "Invalid input. Please enter a valid number (U/L)." };
  let status, explanation;
  if (val < 30) { status = "Low"; explanation = "Below normal limits. Could indicate pancreatic insufficiency or liver disease, but often not clinically significant on its own."; }
  else if (val <= 110) { status = "Normal"; explanation = "Amylase is within normal limits (typically 30 - 110 U/L)."; }
  else { status = "Elevated"; explanation = "Elevated Amylase may indicate acute pancreatitis or other pancreatic/salivary gland disorders."; }
  return { outputData: `Amylase: ${val} U/L\nStatus: ${status}\nInterpretation: ${explanation}` };
}
export function validate(inputs) {
  return inputs && inputs.inputData && inputs.inputData.trim() !== "";
}
