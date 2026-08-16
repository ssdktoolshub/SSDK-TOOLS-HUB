export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let status = "Normal";
  if (v >= 126) status = "Diabetic"; else if (v >= 100) status = "Prediabetic"; else if (v < 70) status = "Low";
  return { outputData: `Fasting Sugar: ${v} mg/dL - ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
