export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  let risk = "Low";
  if (v >= 126) risk = "High (Check Fasting)";
  return { outputData: `Diabetes Risk based on sugar ${v}: ${risk}` };
}
export function validate(inputs) { return !!inputs.inputData; }
