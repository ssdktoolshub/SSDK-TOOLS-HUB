export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v > 20) status = "High";
  return { outputData: `ESR: ${v} mm/hr - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
