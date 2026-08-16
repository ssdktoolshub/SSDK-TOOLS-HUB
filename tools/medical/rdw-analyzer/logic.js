export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v < 11.5) status = "Low"; else if (v > 14.5) status = "High";
  return { outputData: `RDW: ${v}% - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
