export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v < 40) status = "Low"; else if (v > 60) status = "High";
  return { outputData: `Neutrophils: ${v}% - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
