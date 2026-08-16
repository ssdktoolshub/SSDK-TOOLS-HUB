export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v < 12.0) status = "Low"; else if (v > 17.5) status = "High";
  return { outputData: `Hemoglobin: ${v} g/dL - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
