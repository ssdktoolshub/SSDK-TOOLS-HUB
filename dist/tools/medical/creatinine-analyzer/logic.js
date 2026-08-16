export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v > 1.2) status = "High"; else if (v < 0.6) status = "Low";
  return { outputData: `Creatinine: ${v} mg/dL - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
