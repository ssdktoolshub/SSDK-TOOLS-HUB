export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v < 4.5) status = "Low"; else if (v > 11.0) status = "High";
  return { outputData: `WBC Count: ${v} k/mcL - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
