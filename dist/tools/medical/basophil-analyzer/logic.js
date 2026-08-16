export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v > 1) status = "High";
  return { outputData: `Basophils: ${v}% - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
