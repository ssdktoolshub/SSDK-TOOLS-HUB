export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v < 4.0) status = "Low"; else if (v > 6.0) status = "High";
  return { outputData: `RBC Count: ${v} million/mcL - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
