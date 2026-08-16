export async function execute(inputs) {
  const val = parseFloat(inputs.inputData);
  if (isNaN(val)) return { outputData: "Invalid input. Please enter a valid number (ng/mL)." };
  let status = val <= 5.0 ? "Normal" : "Elevated";
  let explanation = val > 5.0 ? "Elevated CEA may indicate colorectal or other cancers, or benign conditions (like smoking, IBD, liver disease)." : "CEA is within typical normal limits (<= 5.0 ng/mL is standard, though < 2.5 is ideal for non-smokers).";
  return { outputData: `CEA: ${val} ng/mL\nStatus: ${status}\nInterpretation: ${explanation}` };
}
export function validate(inputs) {
  return inputs && inputs.inputData && inputs.inputData.trim() !== "";
}
