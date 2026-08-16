export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v < 36) status = "Low"; else if (v > 50) status = "High";
  return { outputData: `Hematocrit: ${v}% - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
