export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v < 20) status = "Low"; else if (v > 40) status = "High";
  return { outputData: `Lymphocytes: ${v}% - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
