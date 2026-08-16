export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v < 1) status = "Low"; else if (v > 4) status = "High";
  return { outputData: `Eosinophils: ${v}% - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
