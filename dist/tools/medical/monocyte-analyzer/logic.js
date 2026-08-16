export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v < 2) status = "Low"; else if (v > 8) status = "High";
  return { outputData: `Monocytes: ${v}% - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
