export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v < 150) status = "Low"; else if (v > 450) status = "High";
  return { outputData: `Platelet Count: ${v} k/mcL - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
