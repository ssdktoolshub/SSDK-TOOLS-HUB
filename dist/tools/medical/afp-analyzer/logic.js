export async function execute(inputs) {
  const val = parseFloat(inputs.inputData);
  if (isNaN(val)) return { outputData: "Invalid input. Please enter a valid number (ng/mL)." };
  let status = val < 10.0 ? "Normal" : "Elevated";
  let explanation = val >= 10.0 ? "Elevated AFP may indicate hepatocellular carcinoma (liver cancer), germ cell tumors, or benign liver conditions (e.g., cirrhosis, hepatitis). It is also naturally elevated during pregnancy." : "AFP is within typical normal limits (< 10.0 ng/mL for non-pregnant adults).";
  return { outputData: `AFP: ${val} ng/mL\nStatus: ${status}\nInterpretation: ${explanation}` };
}
export function validate(inputs) {
  return inputs && inputs.inputData && inputs.inputData.trim() !== "";
}
